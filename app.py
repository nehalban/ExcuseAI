from google import genai
import random
from flask import Flask, request, jsonify, render_template
from presets import PRESET_EXCUSES

# --- App Setup ---
app = Flask(__name__)

# --- Pre-canned Excuses (for non-AI mode) ---
# Moved to presets.py as PRESET_EXCUSES grouped by believability.

# Track last served canned excuse per category to avoid repeats
_last_canned_by_category = {}

# --- API Route Definitions ---

@app.route('/')
def index():
    """Renders the main HTML page."""
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_excuse():
    """Generates an excuse based on the user's request."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request"}), 400

    category = data.get('category', 'general')
    custom_prompt_text = data.get('custom_prompt', '').strip()
    use_ai = data.get('use_ai', False)
    believability = int(data.get('believability', 0))  # 0,1,2

    # --- MODIFIED LOGIC: Handle AI and non-AI requests separately and intelligently ---

    if use_ai:
        try:
            client = genai.Client(api_key="INSERT_YOUR_API_KEY") # Replace with your actual API key
            
            # Believability prompt templates
            believability_prompts = {
                0: (
                    "Write a concise, professional-sounding excuse that is plausible and respectful. "
                    "Keep it under 30 words. Avoid obvious exaggerations. If a situation is provided, tailor to it; otherwise use the category. "
                    "Tone: professional, empathetic, accountable. Output only the excuse."
                ),
                1: (
                    "Write a short excuse that is bold and slightly unbelievable but delivered with confidence. "
                    "Keep it under 30 words. Add a playful twist without going full comedy. "
                    "Tone: audacious, witty, borderline plausible. Output only the excuse."
                ),
                2: (
                    "Write a short, funny excuse that embraces comedic chaos. "
                    "Keep it under 25 words. Feel free to be absurd and witty. "
                    "Tone: playful, irreverent, clearly comedic. Output only the excuse."
                )
            }

            base_context = (
                f"Situation: '{custom_prompt_text}'" if custom_prompt_text else f"Category: '{category}'"
            )
            system_directive = believability_prompts.get(believability, believability_prompts[0])
            prompt = f"{system_directive}\n{base_context}"

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            # Clean up the response to remove potential markdown or quotes
            excuse = response.text.strip().replace('"', '').replace('*', '')
            
            return jsonify({"excuse": excuse, "ai_generated": True})

        except Exception as e:
            print(f"An API error occurred: {e}")
            return jsonify({"excuse": f"The AI had a moment of crisis and couldn't generate an excuse. Error: {str(e)}", "ai_generated": False})

    # Path 3: Standard Canned Excuse (if use_ai is false)
    else:
        # Pick from presets by believability level, then by category
        level_presets = PRESET_EXCUSES.get(believability) or PRESET_EXCUSES.get(0, {})
        excuse_list = level_presets.get(category) or level_presets.get("general", [])
        if not excuse_list:  # ultimate fallback
            excuse_list = ["I'm experiencing technical difficulties with my excuses today."]

        # Avoid repeating the same excuse consecutively per category when possible
        key = f"{believability}:{category}"
        last = _last_canned_by_category.get(key)
        if len(excuse_list) > 1:
            for _ in range(5):
                candidate = random.choice(excuse_list)
                if candidate != last:
                    break
            else:
                candidate = random.choice(excuse_list)
        else:
            candidate = excuse_list[0]
        _last_canned_by_category[key] = candidate
        return jsonify({"excuse": candidate, "ai_generated": False})

# --- Run the App ---
if __name__ == '__main__':
    app.run(debug=True)
