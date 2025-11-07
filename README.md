# ExcuseAI ⚡

> Your AI-powered excuse generator for every awkward situation life throws at you

ExcuseAI is a fun, interactive web application that generates creative and humorous excuses for various situations. Whether you need a witty excuse for being late to work, missing a social event, or not completing your homework, ExcuseAI has you covered with both pre-written clever excuses and AI-generated custom responses powered by Google's Gemini AI.

![Python](https://img.shields.io/badge/Python-3.7+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

### 📋 Multiple Categories
Generate excuses for different scenarios:
- 🌟 **General** - All-purpose excuses for any situation
- 💼 **Work** - Professional scenarios and workplace situations
- 👥 **Social Events** - Parties, gatherings, and social commitments
- 💖 **Dating** - Romantic situations and relationship matters
- ⏰ **Being Late** - Tardiness and timing issues
- 📚 **Homework** - Academic and assignment-related excuses

### 🎚️ Believability Slider
Choose your excuse style with three distinct levels:
- **Level 0 - Plausible Professional**: Concise, respectful, and believable excuses suitable for formal situations
- **Level 1 - Barely Believable But Bold**: Creative excuses with a playful twist that toe the line of plausibility
- **Level 2 - Comedic Chaos**: Absurd, witty, and clearly humorous excuses for entertainment

### 🤖 Dual Mode Operation
- **Canned Excuses**: 100+ pre-written witty and creative excuses organized by category and believability
- **AI-Powered Generation**: Custom excuses generated using Google's Gemini 2.5 Flash for personalized situations

### 💬 Custom Prompts
Describe your specific situation and let the AI craft a tailored excuse that fits your exact needs.

### 🎨 Interactive Features
- **Copy to Clipboard**: One-click copying of excuses
- **Favorites System**: Save and manage your favorite excuses with persistent storage
- **Responsive Design**: Modern glassmorphism UI with smooth animations
- **Mobile-Friendly**: Fully responsive design that works on all devices
- **Progressive Enhancement**: Works gracefully with or without JavaScript

## 🚀 Getting Started

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)
- A Google AI API key (free at [Google AI Studio](https://makersuite.google.com/app/apikey))

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
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key

4. **Configure the API Key**:
   - Open `app.py` in your text editor
   - Locate line 30: `client = genai.Client(api_key="INSERT_YOUR_API_KEY")`
   - Replace `"INSERT_YOUR_API_KEY"` with your actual API key:
   ```python
   client = genai.Client(api_key="your_actual_api_key_here")
   ```
   - **Important**: Never commit your API key to version control!

5. **Run the application**:
   ```bash
   python app.py
   ```

6. **Access the app**:
   - Open your web browser
   - Navigate to `http://localhost:5000`
   - Start generating excuses!

## 🎯 How to Use

### Quick Start (Canned Excuses)
1. Select a category button (General, Work, Social, etc.)
2. Adjust the believability slider to your desired level
3. Click "Generate Excuse" to get a pre-written excuse
4. Use the action buttons to copy or save the excuse

### AI-Powered Custom Excuses
1. Check the "Use AI Generation" checkbox
2. (Optional) Enter a custom prompt describing your specific situation
3. Select your category and believability level
4. Click "Generate Excuse" to get an AI-crafted response
5. Save your favorites for future reference

### Example Custom Prompts
- "I need an excuse for missing my friend's birthday party because I forgot to buy a gift"
- "Why I didn't show up to the team meeting this morning"
- "Excuse for not finishing the project report on time"
- "Why I can't attend the family reunion next weekend"
- "Reason for not responding to emails for three days"

### Believability Levels Explained

**Plausible Professional (Level 0)**
- Suitable for work, school, and formal situations
- Respectful and accountable tone
- Example: "I had an unexpected commitment I needed to handle and couldn't step away in time."

**Barely Believable But Bold (Level 1)**
- Creative with a playful twist
- Delivered with confidence
- Example: "I was locked out of a building with my notes waving at me through the window."

**Comedic Chaos (Level 2)**
- Absurd and entertaining
- Clearly humorous, not meant to be believed
- Example: "My pet rock needed emergency emotional support."

## 🏗️ Project Structure

```
ExcuseAI/
│
├── app.py                    # Main Flask application with route handlers
├── presets.py                # Pre-written excuse database organized by level
│
├── templates/
│   └── index.html           # Main HTML template with structure
│
├── static/
│   ├── css/
│   │   └── styles.css       # Complete styling with responsive design
│   └── js/
│       └── app.js           # Frontend JavaScript for interactivity
│
└── README.md                # This file
```

## 🔧 Technical Details

### Backend (`app.py`)
- **Flask Framework**: Lightweight Python web server
- **Google Generative AI**: Powers AI excuse generation using Gemini 2.5 Flash
- **RESTful API**: Clean `/generate` endpoint for excuse generation
- **Error Handling**: Graceful fallbacks when AI services are unavailable
- **Smart Caching**: Tracks last served excuses to avoid repetition
- **Modular Design**: Excuse presets separated into `presets.py`

### Frontend Architecture
- **Modern CSS (`styles.css`)**: 
  - CSS custom properties (variables) for theming
  - Glassmorphism design with backdrop filters
  - Smooth animations and transitions
  - Responsive grid layouts
  - Mobile-first approach with media queries
  
- **Interactive JavaScript (`app.js`)**:
  - Event-driven architecture
  - Dynamic category and believability switching
  - Asynchronous API calls with fetch
  - Local storage for persistent favorites
  - Progressive enhancement pattern

- **HTML Template (`index.html`)**:
  - Semantic HTML5 structure
  - Accessible form controls with ARIA labels
  - Font Awesome icons for visual appeal
  - External CSS and JS for maintainability

### Excuse Database (`presets.py`)
Organized in a three-level nested dictionary structure:
```python
PRESET_EXCUSES = {
    believability_level: {
        category: [list_of_excuses]
    }
}
```

### API Endpoints

#### `GET /`
Returns the main application interface.

**Response**: HTML page

#### `POST /generate`
Generates an excuse based on the provided parameters.

**Request Body**:
```json
{
  "category": "general",           // Category of excuse
  "custom_prompt": "...",          // Optional: custom situation description
  "use_ai": false,                 // Whether to use AI or canned excuses
  "believability": 0               // Believability level: 0, 1, or 2
}
```

**Response**:
```json
{
  "excuse": "Generated excuse text here",
  "ai_generated": true              // Indicates if AI was used
}
```

**Error Response**:
```json
{
  "error": "Error message description"
}
```

## 🎨 Customization

### Adding New Categories

1. **Update `presets.py`**:
   ```python
   PRESET_EXCUSES = {
       0: {
           "your_new_category": [
               "Excuse 1 for level 0",
               "Excuse 2 for level 0",
           ]
       },
       1: {
           "your_new_category": [
               "Excuse 1 for level 1",
           ]
       },
       2: {
           "your_new_category": [
               "Excuse 1 for level 2",
           ]
       }
   }
   ```

2. **Update `index.html`** (add category button):
   ```html
   <div class="category-btn" data-category="your_new_category">
       <span class="icon">🎭</span>
       <span>Your Category</span>
   </div>
   ```

3. **Update `app.js`** (add to category mapping):
   ```javascript
   const categories = {
       // ... existing categories
       'your_new_category': 'Your Display Name'
   };
   ```

### Modifying AI Prompts

Edit the believability prompt templates in `app.py` (lines 36-54):
```python
believability_prompts = {
    0: "Your custom prompt for professional excuses...",
    1: "Your custom prompt for bold excuses...",
    2: "Your custom prompt for comedic excuses..."
}
```

### Styling Changes

The application uses CSS custom properties (variables) for easy theming. Edit `styles.css`:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --accent-cyan: #00d4ff;
    --accent-pink: #ff6b9d;
    --accent-gold: #ffd93d;
    /* ... other variables */
}
```

### Adding More Preset Excuses

Simply edit `presets.py` and add excuses to the appropriate category and believability level.

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## ⚠️ Important Notes

### Security
- **API Key Security**: Never commit your actual API key to version control
- Consider using environment variables for production:
  ```python
  import os
  api_key = os.environ.get('GEMINI_API_KEY')
  ```

### Rate Limits
- Google AI API has usage limits on the free tier
- The app gracefully falls back to canned excuses if AI generation fails
- Consider implementing rate limiting for production deployment

### Local Storage
- Favorites are stored in browser's localStorage
- Data persists across sessions on the same device
- Clearing browser data will remove saved favorites

### Disclaimer
This app is designed for **entertainment purposes only**. While our excuses are creative and witty, we encourage honesty in real-life situations. Use responsibly!

## 🐛 Troubleshooting

### "API Key Error" or AI generation fails
- Verify your API key is correctly set in `app.py`
- Check that your API key is active at [Google AI Studio](https://makersuite.google.com/)
- Ensure you have internet connectivity
- Check the browser console and Flask terminal for error messages

### Styles not loading
- Ensure the `static/css/styles.css` file exists
- Clear your browser cache
- Check the Flask terminal for 404 errors

### JavaScript not working
- Ensure the `static/js/app.js` file exists
- Check browser console for JavaScript errors
- Verify Font Awesome CDN is accessible

## 🚀 Deployment

### Running in Production

1. **Use a production WSGI server** (not Flask's development server):
   ```bash
   pip install gunicorn
   gunicorn app:app
   ```

2. **Set environment variables**:
   ```bash
   export GEMINI_API_KEY="your_api_key"
   export FLASK_ENV="production"
   ```

3. **Use a reverse proxy** (nginx, Apache) for better performance

### Deploy to Cloud Platforms

**Heroku**:
- Add `requirements.txt`: `flask`, `google-generativeai`, `gunicorn`
- Create `Procfile`: `web: gunicorn app:app`
- Set API key as config var

**Vercel/Netlify**:
- May require serverless function adaptation
- Set API key in environment variables

**Docker**:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000"]
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Add your changes**:
   - New excuse presets
   - UI improvements
   - Bug fixes
   - Documentation updates
4. **Test thoroughly**
5. **Commit your changes**: `git commit -m 'Add some amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Contribution Ideas
- Add more excuse categories (travel, health, pets, etc.)
- Implement excuse history tracking
- Add excuse sharing functionality
- Create themed excuse packs (holidays, seasons)
- Improve mobile UI/UX
- Add internationalization (i18n)
- Implement dark/light theme toggle

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👏 Acknowledgments

- **Google Gemini AI** for powering the AI excuse generation
- **Font Awesome** for the beautiful icons
- **Flask** community for the excellent web framework
- All contributors who help make this project better

## 🎉 Fun Facts

- The app contains over 100 pre-written excuses across all categories and levels
- The "barely believable but bold" category is the most popular with users
- Average AI-generated excuse length: 25-30 words
- The glassmorphism design trend was chosen to make excuses look more "transparent" (pun intended!)

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review this README for troubleshooting tips

---

**Made with ❤️ and a healthy sense of humor**

*Remember: The best excuse is often no excuse at all, but where's the fun in that?*

**ExcuseAI** - Because sometimes, honesty can wait until tomorrow. 😉