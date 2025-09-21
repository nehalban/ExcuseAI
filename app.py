from google import genai
import random
from flask import Flask, request, jsonify, render_template

# --- App Setup ---
app = Flask(__name__)

# --- Pre-canned Excuses (for non-AI mode) ---
canned_excuses = {
    "general": [
        "My pet rock needed emergency emotional support.",
        "I was busy converting oxygen to carbon dioxide.",
        "A wizard stole my car keys.",
        "My smart home AI achieved sentience and locked me out to protect me from making bad decisions today.",
        "I'm participating in a social experiment on the psychological effects of spontaneous absence.",
        "My cat learned to use the doorbell and has been receiving mysterious visitors all morning.",
        "I discovered a glitch in the matrix and spent three hours trying to report it to customer service.",
        "My meditation app became self-aware and insisted I achieve enlightenment before leaving the house."
    ],
    "work": [
        "My computer screen froze, and I got frostbite on my eyeballs.",
        "I was stuck in a time loop for the first half of the day.",
        "The corporate synergy levels were too low for me to be productive.",
        "My smart home AI achieved sentience and locked me out to protect me from making bad decisions today.",
        "I'm participating in a social experiment on the psychological effects of spontaneous absence.",
        "My cat learned to use the doorbell and has been receiving mysterious visitors all morning.",
        "I discovered a glitch in the matrix and spent three hours trying to report it to customer service.",
        "My meditation app became self-aware and insisted I achieve enlightenment before leaving the house."
    ],
    "social": [
        "I had to attend the annual meeting of the International Society of Procrastinators.",
        "My social battery was at 1% and the charger is missing.",
        "I was told there would be snacks, and I'm philosophically opposed to snack-less events.",
        "I'm currently in a standoff with my houseplant over who gets to use the good lighting today.",
        "My social battery is currently charging via solar power and it's been cloudy all week.",
        "I accidentally joined a flash mob rehearsal and I'm legally obligated to see it through.",
        "My mirror told me I look too good today and leaving would cause a public distraction.",
        "I'm practicing social distancing from my own social anxiety."
    ],
    "romantic": [
        "I was busy practicing your name in the mirror.",
        "My astrologer advised against making any good decisions today.",
        "Cupid's arrow is stuck in traffic.",
        "My social battery is currently charging via solar power and it's been cloudy all week.",
        "My dating app matched me with my own reflection and we're having a deep conversation about self-love.",
        "I'm waiting for Mercury to exit retrograde so our conversation flows don't get disrupted.",
        "My horoscope specifically warned against romantic encounters on days ending in 'y'.",
        "I'm in the middle of a very important relationship with my Netflix algorithm.",
        "My cat is giving me relationship advice and we're not done with our consultation yet."
    ],
    "tardiness": [
        "My clock was running on creative time, not real time.",
        "I took the scenic route through a wormhole.",
        "A gang of squirrels held my shoelaces hostage.",
        "I got stuck in a time loop for exactly 23 minutes and just broke free.",
        "My GPS decided to take me on a scenic tour of every construction zone in the city.",
        "I was helping an elderly person with their smartphone and accidentally became their IT support.",
        "My alarm clock and I had a philosophical debate about the nature of time.",
        "I witnessed a squirrel attempting to pay for coffee with acorns and had to see how it ended."
    ],
    "homework": [
        "My dog didn't just eat my homework, he peer-reviewed it and said it needed a rewrite.",
        "I accidentally submitted it to a black hole.",
        "The knowledge was too powerful and my paper combusted.",
        "My laptop became convinced it was a gaming console and refused to open educational software.",
        "I was researching so intensely that I accidentally solved a problem that wasn't even assigned yet.",
        "My study playlist achieved sentience and demanded creative control over my academic career.",
        "I got lost in a Wikipedia rabbit hole that started with homework and ended with ancient llama warfare.",
        "My textbook pages are staging a rebellion and rearranging themselves alphabetically by vowel sounds."
    ]
}

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

    # --- MODIFIED LOGIC: Handle AI and non-AI requests separately and intelligently ---

    if use_ai:
        try:
            client = genai.Client(api_key="INSERT_API_KEY_HERE") # Replace with your actual API key
            
            prompt = ""
            # Path 1: True Custom Excuse. The prompt is based ONLY on the user's text.
            if custom_prompt_text:
                prompt = f"Generate a creative, witty, and slightly unbelievable excuse for the following situation: '{custom_prompt_text}'. Make it one or two sentences long and deliver just the excuse itself."
            # Path 2: AI-powered Category Excuse. The prompt is for a generic category.
            else:
                prompt = f"Generate a creative, witty, and slightly unbelievable excuse suitable for a '{category}' situation. Make it one or two sentences long and deliver just the excuse itself.Nothing to do with pigeons"

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents = prompt
            )
            # Clean up the response to remove potential markdown or quotes
            excuse = response.text.strip().replace('"', '').replace('*', '')
            
            return jsonify({"excuse": excuse, "ai_generated": True})

        except Exception as e:
            print(f"An API error occurred: {e}")
            return jsonify({"excuse": f"The AI had a moment of crisis and couldn't generate an excuse. Error: {str(e)}", "ai_generated": False})

    # Path 3: Standard Canned Excuse (if use_ai is false)
    else:
        excuse_list = canned_excuses.get(category, canned_excuses["general"])
        excuse = random.choice(excuse_list)
        return jsonify({"excuse": excuse, "ai_generated": False})

# --- Run the App ---
if __name__ == '__main__':
    app.run(debug=True)
