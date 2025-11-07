"""
ExcuseAI - AI-Powered Excuse Generator
A Flask web application that generates creative excuses using both pre-written
presets and AI-powered generation via Google's Gemini API.

Author: nehalban
Repository: https://github.com/nehalban/ExcuseAI
"""

API_KEY = "YOUR_GOOGLE_GEMINI_API_KEY_HERE"  # TODO: Move to environment variable for production

from google import genai
import random
from flask import Flask, request, jsonify, render_template
from presets import PRESET_EXCUSES

# ============================================================================
# APPLICATION SETUP
# ============================================================================

app = Flask(__name__)

# ============================================================================
# GLOBAL STATE
# ============================================================================

# Track last served canned excuse per category to avoid consecutive repeats
# Format: {"{believability}:{category}": "last_excuse_text"}
_last_canned_by_category = {}

# ============================================================================
# ROUTE HANDLERS
# ============================================================================

@app.route('/')
def index():
    """
    Render the main HTML page for the ExcuseAI application.
    
    Returns:
        str: Rendered HTML template (index.html)
    """
    return render_template('index.html')


@app.route('/generate', methods=['POST'])
def generate_excuse():
    """
    Generate an excuse based on user request parameters.
    
    This endpoint handles both AI-powered and preset excuse generation.
    It accepts JSON data specifying the category, custom prompt, AI usage,
    and believability level.
    
    Request JSON Body:
        category (str): Excuse category (general, work, social, romantic, 
                       tardiness, homework)
        custom_prompt (str, optional): Custom situation description for AI
        use_ai (bool): Whether to use AI generation or preset excuses
        believability (int): Level 0-2 (0=professional, 1=bold, 2=comedic)
    
    Returns:
        JSON response with either:
        - Success: {"excuse": str, "ai_generated": bool}
        - Error: {"error": str}, status_code
        
    Examples:
        >>> # Request preset excuse
        >>> {"category": "work", "use_ai": false, "believability": 0}
        
        >>> # Request AI-generated custom excuse
        >>> {"category": "social", "custom_prompt": "missing party", 
        ...  "use_ai": true, "believability": 1}
    """
    # Validate request data
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request"}), 400

    # Extract parameters with defaults
    category = data.get('category', 'general')
    custom_prompt_text = data.get('custom_prompt', '').strip()
    use_ai = data.get('use_ai', False)
    believability = int(data.get('believability', 0))  # 0, 1, or 2

    # ========================================================================
    # AI-POWERED EXCUSE GENERATION
    # ========================================================================
    if use_ai:
        try:
            # Initialize Gemini AI client
            # TODO: Move API key to environment variable for production
            client = genai.Client(api_key=API_KEY)
            
            # Define believability-specific prompt templates
            # Each level produces excuses with different tone and credibility
            believability_prompts = {
                0: (
                    "Write a professional-sounding excuse that is plausible and respectful in under 30 words. "
                    "Avoid obvious exaggerations."
                    "Tone: professional, empathetic, accountable. "
                    "Output only the excuse."
                ),
                1: (
                    "Write a short excuse that is bold and only somewhat believable, but delivered with confidence. Keep it under 30 words. Add a playful twist without going full comedy. "
                    "Tone: audacious, witty, borderline plausible. "
                    "Output only the excuse."
                ),
                2: '''Write a short, hillarious excuse that embraces comedic chaos.
                    Not meant to get you out of trouble, just   roll on the floor laughing. Be creative! Keep it under 25 words.
                    Tone: playful, irreverent, absurd, clearly comedic
                    Output only the excuse.'''
            }
            situation_for_category = {
                "general": "",
                "work": "Situation: being late for work or not meeting a work deadline",
                "social": "Situation: missing a social event or gathering",
                "romantic": "Situation: late for a romantic date or missing it",
                "tardiness": "Situation: too tired to move",
                "homework": "Situation: didn't complete homework/assignment"
            }

            # Build prompt context from user input
            base_context = (
                f"Situation: '{custom_prompt_text}'" if custom_prompt_text 
                else situation_for_category.get(category, "")
            )
            
            # Get appropriate system directive based on believability level
            system_directive = believability_prompts.get(
                believability, 
                believability_prompts[2]  # Default to comedic chaos
            )
            
            # Combine directive and context for final prompt
            prompt = f"{system_directive}\n{base_context}"

            # Call Gemini API
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            
            # Clean up AI response: remove markdown formatting and quotes
            excuse = response.text.strip().replace('"', '').replace('*', '')
            
            return jsonify({"excuse": excuse, "ai_generated": True})

        except Exception as e:
            # Log error and return fallback message
            print(f"An API error occurred: {e}")
            return jsonify({
                "excuse": (
                    "The AI had a moment of crisis and couldn't generate "
                    f"an excuse. Error: {str(e)}"
                ),
                "ai_generated": False
            })

    # ========================================================================
    # PRESET EXCUSE GENERATION
    # ========================================================================
    else:
        # Retrieve preset excuses from the appropriate level and category
        level_presets = PRESET_EXCUSES.get(believability) or PRESET_EXCUSES.get(0, {})
        excuse_list = level_presets.get(category) or level_presets.get("general", [])
        
        # Ultimate fallback if no excuses found
        if not excuse_list:
            excuse_list = ["I'm experiencing technical difficulties with my excuses today."]

        # Avoid serving the same excuse twice in a row
        # This improves user experience by providing variety
        cache_key = f"{believability}:{category}"
        last_excuse = _last_canned_by_category.get(cache_key)
        
        if len(excuse_list) > 1:
            # Try up to 5 times to get a different excuse
            for _ in range(5):
                candidate = random.choice(excuse_list)
                if candidate != last_excuse:
                    break
            else:
                # If all attempts fail, just use a random one
                candidate = random.choice(excuse_list)
        else:
            # Only one excuse available, use it
            candidate = excuse_list[0]
        
        # Cache the selected excuse to avoid immediate repeats
        _last_canned_by_category[cache_key] = candidate
        
        return jsonify({"excuse": candidate, "ai_generated": False})


# ============================================================================
# APPLICATION ENTRY POINT
# ============================================================================

if __name__ == '__main__':
    # Run Flask development server
    # WARNING: Debug mode should be disabled in production
    app.run(debug=True)
