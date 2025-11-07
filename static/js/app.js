let currentCategory = 'general';
let favorites = [];

// --- DOM Elements ---
const useAICheckbox = document.getElementById('useAI');
const generateBtn = document.getElementById('generateBtn');
const customPromptInput = document.getElementById('customPrompt');
const excuseContainer = document.getElementById('excuseContainer');
const currentCategoryDisplay = document.getElementById('currentCategory');
const aiIndicator = document.getElementById('aiIndicator');
const favoritesSection = document.getElementById('favoritesSection');
const favoritesList = document.getElementById('favoritesList');
const believabilityInput = document.getElementById('believability');

function bindCategoryButtons() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            updateCategoryDisplay();
            generateExcuse();
        });
    });
}

function believabilityLabel(value) {
    const map = {
        0: 'Plausible professional',
        1: 'Barely believable but bold',
        2: 'Comedic chaos'
    };
    return map[value] || map[0];
}

function updateCategoryDisplay() {
    const categories = {
        'general': 'General', 'work': 'Work', 'social': 'Social Events',
        'romantic': 'Dating', 'tardiness': 'Being Late', 'homework': 'Homework'
    };
    const customPrompt = customPromptInput.value.trim();
    const useAI = useAICheckbox.checked;
    const displayName = (useAI && customPrompt) ? 'Custom Excuse' : `${categories[currentCategory]} Excuse`;
    const believabilityText = believabilityLabel(parseInt(believabilityInput.value, 10));
    currentCategoryDisplay.textContent = `${displayName} · ${believabilityText}`;
    aiIndicator.style.display = useAI ? 'inline-block' : 'none';
}

function generateExcuse() {
    const customPrompt = customPromptInput.value.trim();
    const useAI = useAICheckbox.checked;

    const requestData = {
        category: currentCategory,
        custom_prompt: customPrompt,
        use_ai: useAI,
        believability: parseInt(believabilityInput.value, 10)
    };

    excuseContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <span>${useAI ? 'AI is crafting your perfect excuse...' : 'Finding a classic excuse...'}</span>
        </div>`;
    generateBtn.disabled = true;

    fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError('Server response was not JSON. Check Flask server logs.');
        }
        return response.json();
    })
    .then(data => {
        if (data.excuse) {
            displayExcuse(data.excuse, data.ai_generated);
        } else {
            displayExcuse(data.error || 'An unknown error occurred.', false);
        }
    })
    .catch(error => {
        console.error('❌ FRONTEND ERROR:', error);
        displayExcuse(`Error: ${error.message}. Check browser console and server logs.`, false);
    })
    .finally(() => {
        generateBtn.disabled = false;
        updateCategoryDisplay();
    });
}

function displayExcuse(excuse, aiGenerated = false) {
    excuseContainer.innerHTML = '';

    const displayDiv = document.createElement('div');
    displayDiv.className = 'excuse-display';
    displayDiv.innerHTML = `<p class="excuse-text">"${excuse}"</p>`;

    if (aiGenerated) {
        const aiLabel = document.createElement('div');
        aiLabel.className = 'ai-label';
        aiLabel.innerHTML = `<i class="fas fa-robot"></i> AI Generated`;
        displayDiv.appendChild(aiLabel);
    }

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'action-buttons';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'action-btn';
    copyBtn.innerHTML = `<i class="fas fa-copy"></i> Copy to Clipboard`;
    copyBtn.addEventListener('click', (e) => {
        navigator.clipboard.writeText(excuse).then(() => {
            const btn = e.currentTarget;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => { btn.innerHTML = originalText; }, 2000);
        });
    });

    const favBtn = document.createElement('button');
    favBtn.className = 'action-btn';
    favBtn.innerHTML = `<i class="fas fa-heart"></i> Save to Favorites`;
    favBtn.addEventListener('click', (e) => {
        addToFavorites(excuse, e.currentTarget);
    });

    actionsDiv.appendChild(copyBtn);
    actionsDiv.appendChild(favBtn);
    excuseContainer.appendChild(displayDiv);
    excuseContainer.appendChild(actionsDiv);
}

function addToFavorites(excuse, btnElement) {
    if (!favorites.includes(excuse)) {
        favorites.push(excuse);
        updateFavorites();

        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fas fa-check"></i> Added!';
        setTimeout(() => { btnElement.innerHTML = originalText; }, 2000);
    }
}

function removeFavorite(index) {
    if (index > -1 && index < favorites.length) {
        favorites.splice(index, 1);
        updateFavorites();
    }
}

function updateFavorites() {
    if (favorites.length > 0) {
        favoritesSection.style.display = 'block';
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
    localStorage.setItem('excuseAIFavorites', JSON.stringify(favorites));
}

function bindFavoritesEvents() {
    favoritesList.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.delete-fav-btn');
        if (deleteButton) {
            const indexToRemove = parseInt(deleteButton.dataset.index, 10);
            removeFavorite(indexToRemove);
        }
    });
}

function bindGenerateEvents() {
    useAICheckbox.addEventListener('change', function() {
        updateCategoryDisplay();
    });

    if (believabilityInput) {
        believabilityInput.addEventListener('input', updateCategoryDisplay);
    }

    generateBtn.addEventListener('click', generateExcuse);

    customPromptInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            generateExcuse();
        }
    });
}

function initState() {
    const savedFavorites = JSON.parse(localStorage.getItem('excuseAIFavorites'));
    if (savedFavorites) {
        favorites = savedFavorites;
        updateFavorites();
    }

    const firstBtn = document.querySelector('.category-btn');
    if (firstBtn) {
        firstBtn.classList.add('active');
        currentCategory = firstBtn.dataset.category;
    }
    updateCategoryDisplay();
    generateExcuse();
}

function init() {
    bindCategoryButtons();
    bindFavoritesEvents();
    bindGenerateEvents();
    initState();
}

document.addEventListener('DOMContentLoaded', init);
