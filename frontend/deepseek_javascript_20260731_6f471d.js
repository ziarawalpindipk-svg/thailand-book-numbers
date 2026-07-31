/**
 * ============================================
 * LANGUAGE MODULE
 * Handles all language/translation functionality
 * ============================================
 */

const Language = (function() {
    
    let currentLang = CONFIG.defaultLanguage;
    let translations = {};
    let isLoaded = false;
    
    /**
     * Load translations for a language
     */
    async function loadTranslations(langCode) {
        try {
            const response = await fetch(`assets/js/locales/${langCode}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${langCode}`);
            }
            const data = await response.json();
            translations = data;
            currentLang = langCode;
            isLoaded = true;
            return true;
        } catch (error) {
            console.error('Language load error:', error);
            // Fallback to English
            if (langCode !== 'en') {
                return loadTranslations('en');
            }
            return false;
        }
    }
    
    /**
     * Get a translation by key
     */
    function t(key, fallback = key) {
        if (!isLoaded) {
            return fallback;
        }
        return translations[key] || fallback;
    }
    
    /**
     * Get all translations
     */
    function getAllTranslations() {
        return translations;
    }
    
    /**
     * Get current language
     */
    function getCurrentLanguage() {
        return currentLang;
    }
    
    /**
     * Get language info
     */
    function getLanguageInfo(code) {
        return CONFIG.supportedLanguages.find(l => l.code === code);
    }
    
    /**
     * Set language and update UI
     */
    async function setLanguage(langCode) {
        if (!CONFIG.supportedLanguages.find(l => l.code === langCode)) {
            langCode = CONFIG.defaultLanguage;
        }
        
        const success = await loadTranslations(langCode);
        if (success) {
            Storage.saveLanguage(langCode);
            currentLang = langCode;
            updateUI();
            return true;
        }
        return false;
    }
    
    /**
     * Initialize language from saved preference
     */
    async function initLanguage() {
        const savedLang = Storage.getLanguage();
        const langToLoad = savedLang || CONFIG.defaultLanguage;
        await loadTranslations(langToLoad);
        
        // Apply RTL if needed
        const langInfo = getLanguageInfo(currentLang);
        if (langInfo && langInfo.dir === 'rtl') {
            document.body.classList.add('rtl');
        } else {
            document.body.classList.remove('rtl');
        }
        
        updateUI();
        return currentLang;
    }
    
    /**
     * Update all UI elements with translations
     */
    function updateUI() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = t(key);
            if (translation) {
                el.textContent = translation;
            }
        });
        
        // Update header language label
        const langLabel = document.getElementById('currentLangLabel');
        if (langLabel) {
            const langInfo = getLanguageInfo(currentLang);
            langLabel.textContent = langInfo ? langInfo.name : 'English';
        }
        
        // Update language button text
        const langBtn = document.getElementById('languageBtn');
        if (langBtn) {
            const langInfo = getLanguageInfo(currentLang);
            langBtn.innerHTML = `🌐 ${langInfo ? langInfo.name : 'English'}`;
        }
        
        // Dispatch custom event for other modules
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: currentLang }
        }));
    }
    
    /**
     * Get all supported languages
     */
    function getSupportedLanguages() {
        return CONFIG.supportedLanguages;
    }
    
    // Public API
    return {
        init: initLanguage,
        setLanguage,
        getCurrentLanguage,
        getLanguageInfo,
        getSupportedLanguages,
        t,
        getAllTranslations,
        updateUI
    };
})();