# ExcuseAI ⚡

> Your AI-powered excuse generator for every awkward situation life throws at you

ExcuseAI is a fun, interactive web application that generates creative and humorous excuses for various situations. Whether you need a witty excuse for being late to work, missing a social event, or not completing your homework, ExcuseAI has you covered with both pre-written clever excuses and AI-generated custom responses.

## ✨ Features

- **Multiple Categories**: Generate excuses for different scenarios including:
  - 🌟 General situations
  - 💼 Work-related scenarios
  - 👥 Social events
  - 💖 Dating and romantic situations
  - ⏰ Being late or tardiness
  - 📚 Homework and academic situations

- **Dual Mode Operation**:
  - **Canned Excuses**: Pre-written witty and creative excuses for quick generation
  - **AI-Powered Generation**: Custom excuses generated using Google's Gemini AI for personalized situations

- **Custom Prompts**: Describe your specific situation and let the AI craft a tailored excuse

- **Interactive Features**:
  - Copy excuses to clipboard
  - Save favorite excuses
  - Responsive, modern UI with smooth animations
  - Mobile-friendly design

## 🚀 Getting Started

### Prerequisites

- Python 3.7+
- Flask
- Google Generative AI library
- A Google AI API key (for AI-powered features)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nehalban/ExcuseAI.git
   cd ExcuseAI
   ```

2. **Install dependencies**:
   ```bash
   pip install flask google-generativeai
   ```

3. **Get your Google AI API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key for the next step

4. **Configure the API Key**:
   - Open `app.py`
   - Replace `"INSERT_API_KEY_HERE"` with your actual Google AI API key:
   ```python
   client = genai.Client(api_key="YOUR_ACTUAL_API_KEY_HERE")
   ```

5. **Run the application**:
   ```bash
   python app.py
   ```

6. **Access the app**:
   Open your browser and navigate to `http://localhost:5000`

## 🎯 How to Use

### Quick Start
1. Select a category from the available options (General, Work, Social, etc.)
2. Click "Generate Excuse" to get a pre-written clever excuse
3. Copy the excuse or save it to your favorites

### AI-Powered Custom Excuses
1. Check the "Use AI Generation" checkbox
2. (Optional) Enter a custom prompt describing your specific situation
3. Click "Generate Excuse" to get an AI-crafted response
4. Save your favorites for future reference

### Example Custom Prompts
- "I need an excuse for missing my friend's birthday party because I forgot to buy a gift"
- "Why I didn't show up to the team meeting this morning"
- "Excuse for not finishing the project report on time"

## 🏗️ Project Structure

```
ExcuseAI/
│
├── app.py                 # Main Flask application
├── templates/
│   └── index.html        # Frontend HTML template with embedded CSS/JS
├── static/               # (Optional) For separate CSS/JS files
└── README.md            # This file
```

## 🔧 Technical Details

### Backend (`app.py`)
- **Flask Framework**: Lightweight web server
- **Google Generative AI**: Powers the AI excuse generation using Gemini 2.5 Flash
- **RESTful API**: Clean `/generate` endpoint for excuse generation
- **Error Handling**: Graceful fallbacks when AI services are unavailable

### Frontend (`templates/index.html`)
- **Modern CSS**: Glassmorphism design with smooth animations
- **Responsive Design**: Mobile-first approach with grid layouts
- **Interactive JavaScript**: Dynamic category switching and API calls
- **Local Storage**: Persistent favorites storage
- **Progressive Enhancement**: Works with or without JavaScript

### API Endpoints

#### `GET /`
Returns the main application interface.

#### `POST /generate`
Generates an excuse based on the provided parameters.

**Request Body**:
```json
{
  "category": "general",
  "custom_prompt": "Optional custom situation description",
  "use_ai": false
}
```

**Response**:
```json
{
  "excuse": "Generated excuse text",
  "ai_generated": true
}
```

## 🎨 Customization

### Adding New Categories
1. Add new category to the `canned_excuses` dictionary in `app.py`
2. Add corresponding button in the HTML template
3. Update the JavaScript category mapping

### Modifying AI Prompts
Edit the prompt generation logic in the `/generate` route:
```python
prompt = f"Generate a creative, witty, and slightly unbelievable excuse for: '{custom_prompt_text}'"
```

### Styling Changes
The application uses embedded CSS in `index.html`. Key design elements:
- Gradient backgrounds with glassmorphism effects
- CSS animations and hover effects
- Responsive grid layouts
- Font Awesome icons

## ⚠️ Important Notes

- **API Key Security**: Never commit your actual API key to version control
- **Rate Limits**: Be mindful of Google AI API usage limits
- **Disclaimer**: This app is for entertainment purposes - use excuses responsibly!
- **Error Handling**: The app falls back to canned excuses if AI generation fails

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Disclaimer

ExcuseAI is designed for entertainment and humor. While our excuses are creative and witty, we encourage honesty in real-life situations. Use responsibly and maybe try the truth once in a while! 😉

---

**Made with ❤️ and a healthy sense of humor**

*Remember: The best excuse is often no excuse at all, but where's the fun in that?*