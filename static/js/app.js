/**
 * ExcuseAI Frontend JavaScript
 * Handles user interactions, API calls, theme switching, and favorites management
 * 
 * @author nehalban
 * @version 2.0
 */

// ============================================================================
// GLOBAL STATE MANAGEMENT
// ============================================================================

/**
 * Current selected excuse category
 * @type {string}
 */
let currentCategory = 'general';

/**
 * Array of user's favorite excuses (persisted in localStorage)
 * @type {Array<string>}
 */
let favorites = [];

// ============================================================================
// DOM ELEMENT REFERENCES
// Cache DOM elements for better performance
// ============================================================================

const useAICheckbox = document.getElementById('useAI');
const generateBtn = document.getElementById('generateBtn');
const customPromptInput = document.getElementById('customPrompt');
const excuseContainer = document.getElementById('excuseContainer');
const currentCategoryDisplay = document.getElementById('currentCategory');
const aiIndicator = document.getElementById('aiIndicator');
const favoritesSection = document.getElementById('favoritesSection');
const favoritesList = document.getElementById('favoritesList');
const believabilityInput = document.getElementById('believability');

// ============================================================================
// THEME MANAGEMENT
// ============================================================================

/**
 * Initialize theme from localStorage or system preference
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Use saved theme, or default to system preference
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

/**
 * Update theme toggle button icon
 * @param {string} theme - Current theme ('light' or 'dark')
 */
function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-toggle i');
    const themeText = document.querySelector('.theme-toggle span');
    
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        if (themeText) themeText.textContent = 'Light Mode';
    } else {
        themeIcon.className = 'fas fa-moon';
        if (themeText) themeText.textContent = 'Dark Mode';
    }
}

// ============================================================================
// CATEGORY MANAGEMENT
// ============================================================================

/**
 * Bind click event listeners to all category buttons
 * Handles category selection and triggers excuse generation
 */
function bindCategoryButtons() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active state from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            
            // Set this button as active
            this.classList.add('active');
            
            // Update current category and UI
            currentCategory = this.dataset.category;
            updateCategoryDisplay();
            generateExcuse();
        });
    });
}

// ============================================================================
// BELIEVABILITY LEVEL UTILITIES
// ============================================================================

/**
 * Get human-readable label for believability level
 * @param {number} value - Believability level (0, 1, or 2)
 * @returns {string} Descriptive label for the level
 */
function believabilityLabel(value) {
    const map = {
        0: 'Plausible professional',
        1: 'Barely believable but bold',
        2: 'Comedic chaos'
    };
    return map[value] || map[0];
}

// ============================================================================
// UI UPDATE FUNCTIONS
// ============================================================================

/**
 * Update the category display text and AI indicator
 * Shows current category, believability level, and AI status
 */
function updateCategoryDisplay() {
    // Category name mappings
    const categories = {
        'general': 'General',
        'work': 'Work',
        'social': 'Social Events',
        'romantic': 'Dating',
        'tardiness': 'Being Late',
        'homework': 'Homework'
    };
    
    const customPrompt = customPromptInput.value.trim();
    const useAI = useAICheckbox.checked;
    
    // Show "Custom Excuse" if AI is enabled with a custom prompt
    const displayName = (useAI && customPrompt) 
        ? 'Custom Excuse' 
        : `${categories[currentCategory]} Excuse`;
    
    // Get believability text
    const believabilityText = believabilityLabel(
        parseInt(believabilityInput.value, 10)
    );
    
    // Update display with category and believability
    currentCategoryDisplay.textContent = `${displayName} · ${believabilityText}`;
    
    // Show/hide AI indicator
    aiIndicator.style.display = useAI ? 'inline-flex' : 'none';
}

// ============================================================================
// EXCUSE GENERATION
// ============================================================================

/**
 * Generate an excuse by calling the backend API
 * Handles both AI-powered and preset excuse generation
 */
function generateExcuse() {
    const customPrompt = customPromptInput.value.trim();
    const useAI = useAICheckbox.checked;

    // Prepare request data
    const requestData = {
        category: currentCategory,
        custom_prompt: customPrompt,
        use_ai: useAI,
        believability: parseInt(believabilityInput.value, 10)
    };

    // Show loading state
    excuseContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <span>${useAI ? 'AI is crafting your perfect excuse...' : 'Finding a classic excuse...'}</span>
        </div>`;
    generateBtn.disabled = true;

    // Call backend API
    fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        // Check for HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Validate JSON response
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError('Server response was not JSON. Check Flask server logs.');
        }
        
        return response.json();
    })
    .then(data => {
        // Display the excuse or error message
        if (data.excuse) {
            displayExcuse(data.excuse, data.ai_generated);
        } else {
            displayExcuse(data.error || 'An unknown error occurred.', false);
        }
    })
    .catch(error => {
        // Log error and show user-friendly message
        console.error('❌ FRONTEND ERROR:', error);
        displayExcuse(
            `Error: ${error.message}. Check browser console and server logs.`,
            false
        );
    })
    .finally(() => {
        // Re-enable button and update UI
        generateBtn.disabled = false;
        updateCategoryDisplay();
    });
}

// ============================================================================
// EXCUSE DISPLAY
// ============================================================================

/**
 * Display a generated excuse with action buttons
 * @param {string} excuse - The excuse text to display
 * @param {boolean} aiGenerated - Whether the excuse was AI-generated
 */
function displayExcuse(excuse, aiGenerated = false) {
    // Clear container
    excuseContainer.innerHTML = '';

    // Create excuse display card
    const displayDiv = document.createElement('div');
    displayDiv.className = 'excuse-display';
    displayDiv.innerHTML = `<p class="excuse-text">"${excuse}"</p>`;

    // Add AI indicator if applicable
    if (aiGenerated) {
        const aiLabel = document.createElement('div');
        aiLabel.className = 'ai-label';
        aiLabel.innerHTML = `<i class="fas fa-robot"></i> AI Generated`;
        displayDiv.appendChild(aiLabel);
    }

    // Create action buttons container
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'action-buttons';

    // Copy to clipboard button
    const copyBtn = createCopyButton(excuse);
    
    // Save to favorites button
    const favBtn = createFavoriteButton(excuse);

    // Append buttons and display excuse
    actionsDiv.appendChild(copyBtn);
    actionsDiv.appendChild(favBtn);
    excuseContainer.appendChild(displayDiv);
    excuseContainer.appendChild(actionsDiv);
}

/**
 * Create a copy-to-clipboard button
 * @param {string} excuse - Text to copy
 * @returns {HTMLButtonElement} The copy button element
 */
function createCopyButton(excuse) {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'action-btn';
    copyBtn.innerHTML = `<i class="fas fa-copy"></i> Copy to Clipboard`;
    
    copyBtn.addEventListener('click', (e) => {
        navigator.clipboard.writeText(excuse).then(() => {
            const btn = e.currentTarget;
            const originalText = btn.innerHTML;
            
            // Show success feedback
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            
            // Restore original text after 2 seconds
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    });
    
    return copyBtn;
}

/**
 * Create a save-to-favorites button
 * @param {string} excuse - Excuse to save
 * @returns {HTMLButtonElement} The favorite button element
 */
function createFavoriteButton(excuse) {
    const favBtn = document.createElement('button');
    favBtn.className = 'action-btn';
    favBtn.innerHTML = `<i class="fas fa-heart"></i> Save to Favorites`;
    
    favBtn.addEventListener('click', (e) => {
        addToFavorites(excuse, e.currentTarget);
    });
    
    return favBtn;
}

// ============================================================================
// FAVORITES MANAGEMENT
// ============================================================================

/**
 * Add an excuse to favorites list
 * @param {string} excuse - Excuse text to add
 * @param {HTMLElement} btnElement - Button element to show feedback on
 */
function addToFavorites(excuse, btnElement) {
    // Check if excuse is already in favorites
    if (!favorites.includes(excuse)) {
        favorites.push(excuse);
        updateFavorites();

        // Show success feedback
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fas fa-check"></i> Added!';
        
        setTimeout(() => {
            btnElement.innerHTML = originalText;
        }, 2000);
    } else {
        // Show already exists feedback
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fas fa-info-circle"></i> Already saved!';
        
        setTimeout(() => {
            btnElement.innerHTML = originalText;
        }, 2000);
    }
}

/**
 * Remove an excuse from favorites by index
 * @param {number} index - Array index of excuse to remove
 */
function removeFavorite(index) {
    if (index > -1 && index < favorites.length) {
        favorites.splice(index, 1);
        updateFavorites();
    }
}

/**
 * Update favorites display and persist to localStorage
 * Shows/hides favorites section based on content
 */
function updateFavorites() {
    if (favorites.length > 0) {
        favoritesSection.style.display = 'block';
        
        // Render each favorite as a card
        favoritesList.innerHTML = favorites.map((fav, index) => `
            <div class="favorite-item">
                <span class="favorite-text">"${fav}"</span>
                <button class="delete-fav-btn" data-index="${index}" title="Delete favorite">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `).join('');
    } else {
        favoritesSection.style.display = 'none';
    }
    
    // Persist to localStorage
    localStorage.setItem('excuseAIFavorites', JSON.stringify(favorites));
}

// ============================================================================
// EVENT BINDING
// ============================================================================

/**
 * Bind event listeners for favorites list
 * Handles delete button clicks with event delegation
 */
function bindFavoritesEvents() {
    favoritesList.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.delete-fav-btn');
        if (deleteButton) {
            const indexToRemove = parseInt(deleteButton.dataset.index, 10);
            removeFavorite(indexToRemove);
        }
    });
}

/**
 * Bind event listeners for excuse generation controls
 */
function bindGenerateEvents() {
    // AI checkbox toggle
    useAICheckbox.addEventListener('change', function() {
        updateCategoryDisplay();
    });

    // Believability slider
    if (believabilityInput) {
        believabilityInput.addEventListener('input', updateCategoryDisplay);
    }

    // Generate button click
    generateBtn.addEventListener('click', generateExcuse);

    // Enter key in custom prompt textarea (without Shift)
    customPromptInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            generateExcuse();
        }
    });
}

/**
 * Bind theme toggle button event
 */
function bindThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize application state from localStorage
 * Loads saved favorites and sets initial category
 */
function initState() {
    // Load saved favorites from localStorage
    const savedFavorites = JSON.parse(
        localStorage.getItem('excuseAIFavorites')
    );
    if (savedFavorites) {
        favorites = savedFavorites;
        updateFavorites();
    }

    // Set first category as active
    const firstBtn = document.querySelector('.category-btn');
    if (firstBtn) {
        firstBtn.classList.add('active');
        currentCategory = firstBtn.dataset.category;
    }
    
    // Update UI and generate initial excuse
    updateCategoryDisplay();
    generateExcuse();
}

/**
 * Main initialization function
 * Binds all event listeners and initializes app state
 */
function init() {
    initTheme();
    bindThemeToggle();
    bindCategoryButtons();
    bindFavoritesEvents();
    bindGenerateEvents();
    initState();
}

// ============================================================================
// START APPLICATION
// Initialize when DOM is fully loaded
// ============================================================================

document.addEventListener('DOMContentLoaded', init);
