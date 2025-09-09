// Translation cache
let translations = {};
let isTranslating = false;

// Get the correct base path for translations for GitHub Pages
function getBasePath() {
    // Get the current URL path
    const currentPath = window.location.pathname;
    
    // Check if we're on GitHub Pages (URL contains repository name)
    const isGitHubPages = currentPath.split('/').length > 2;
    
    if (isGitHubPages) {
        // Extract repository name from URL path
        const pathParts = currentPath.split('/');
        const repoName = pathParts[1]; // Second part is usually the repo name
        
        if (repoName && repoName !== '') {
            return `/${repoName}/translations/`;
        }
    }
    
    // Default path for local development or root domain
    return '/translations/';
}

const BASE_PATH = getBasePath();

// Debug: Log the base path to help with troubleshooting
console.log('Translation base path:', BASE_PATH);

// Initialize language when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
});

async function initializeLanguage() {
    try {
        // Get the saved language preference from localStorage
        const savedLang = localStorage.getItem('siteLanguage');
        
        // Get browser language as fallback
        const browserLang = navigator.language.split('-')[0] || 'en';
        
        // Use saved language if available, otherwise use browser language
        const langToLoad = savedLang || browserLang;
        
        console.log('Loading language:', langToLoad, '(saved:', savedLang, 'browser:', browserLang + ')');
        
        // Apply translations
        await changeLanguage(langToLoad);
        
        // Setup dropdown event listeners
        setupLanguageDropdown();
        
    } catch (error) {
        console.error('Error initializing language:', error);
        // Fallback to English
        await changeLanguage('en');
    }
}

function setupLanguageDropdown() {
    // Remove existing listeners to prevent duplicates
    document.querySelectorAll('.language-option').forEach(option => {
        option.onclick = null;
    });
    
    // Add new event listeners
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
}

async function changeLanguage(lang) {
    // Prevent multiple simultaneous language changes
    if (isTranslating) return;
    isTranslating = true;
    
    try {
        console.log('Changing to language:', lang);
        
        // Only load if not cached
        if (!translations[lang]) {
            const response = await fetch(`${BASE_PATH}${lang}.json`);
            if (!response.ok) {
                // If translation file not found, try fallback path
                if (BASE_PATH.startsWith('/')) {
                    const fallbackResponse = await fetch(`translations/${lang}.json`);
                    if (fallbackResponse.ok) {
                        translations[lang] = await fallbackResponse.json();
                    } else {
                        throw new Error(`Translation not found for ${lang}`);
                    }
                } else {
                    throw new Error(`Translation not found for ${lang}`);
                }
            } else {
                translations[lang] = await response.json();
            }
        }
        
        // Apply translations
        applyTranslations(translations[lang]);
        
        // Update UI elements
        updateLanguageUI(lang);
        
        // Save preference to localStorage (this persists across all pages)
        localStorage.setItem('siteLanguage', lang);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
    } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to English if preferred language fails
        if (lang !== 'en') {
            await changeLanguage('en');
        }
    } finally {
        isTranslating = false;
    }
}

function applyTranslations(translation) {
    // Update all translatable elements
    updateTextElements(translation);
    updatePlaceholders(translation);
    updateAltTexts(translation);
    updatePageTitle(translation);
    updateLinks(translation);
}

function updateTextElements(translation) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translation[key]) {
            element.textContent = translation[key];
        } else {
            console.warn('Translation key not found:', key);
        }
    });
}

function updatePlaceholders(translation) {
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translation[key] && element.placeholder !== undefined) {
            element.placeholder = translation[key];
        }
    });
}

function updateAltTexts(translation) {
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
        const key = element.getAttribute('data-i18n-alt');
        if (translation[key] && element.alt !== undefined) {
            element.alt = translation[key];
        }
    });
}

function updatePageTitle(translation) {
    // Use page-specific title if available, fallback to generic title
    const pageName = document.body.getAttribute('data-page') || 'page';
    const pageTitleKey = `${pageName}_title`;
    
    if (translation[pageTitleKey]) {
        document.title = translation[pageTitleKey];
    } else if (translation['page_title']) {
        document.title = translation['page_title'];
    }
}

function updateLinks(translation) {
    document.querySelectorAll('[data-i18n-href]').forEach(element => {
        const key = element.getAttribute('data-i18n-href');
        if (translation[key] && element.href !== undefined) {
            element.href = translation[key];
        }
    });
}

function updateLanguageUI(lang) {
    // Update current language display
    const languageDisplay = document.getElementById('currentLanguage');
    if (languageDisplay && translations[lang] && translations[lang]['language_name']) {
        languageDisplay.textContent = translations[lang]['language_name'];
    }
    
    // Update active state in dropdown
    document.querySelectorAll('.language-option').forEach(option => {
        const optionLang = option.getAttribute('data-lang');
        if (optionLang === lang) {
            option.classList.add('active');
            option.setAttribute('aria-current', 'true');
        } else {
            option.classList.remove('active');
            option.removeAttribute('aria-current');
        }
    });
    
    // Update dropdown button text
    const dropdownButton = document.querySelector('.dropdown-toggle');
    if (dropdownButton && translations[lang] && translations[lang]['language_name']) {
        dropdownButton.textContent = translations[lang]['language_name'];
    }
}

// Listen for storage events (if language is changed in another tab)
window.addEventListener('storage', function(e) {
    if (e.key === 'siteLanguage' && e.newValue && e.newValue !== localStorage.getItem('siteLanguage')) {
        changeLanguage(e.newValue);
    }
});

// Optional: Export for debugging
window.i18n = {
    changeLanguage,
    getCurrentLang: () => localStorage.getItem('siteLanguage'),
    getTranslations: () => translations,
    getBasePath: () => BASE_PATH
};