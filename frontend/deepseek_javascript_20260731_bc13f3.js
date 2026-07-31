/**
 * ============================================
 * CURRENCY MODULE
 * Handles all currency functionality
 * ============================================
 */

const Currency = (function() {
    
    let currentCurrency = CONFIG.defaultCurrency;
    
    /**
     * Get currency info
     */
    function getCurrencyInfo(code) {
        return CONFIG.supportedCurrencies.find(c => c.code === code);
    }
    
    /**
     * Get symbol for currency
     */
    function getSymbol(code) {
        const info = getCurrencyInfo(code);
        return info ? info.symbol : code;
    }
    
    /**
     * Get flag for currency
     */
    function getFlag(code) {
        const info = getCurrencyInfo(code);
        return info ? info.flag : '🌍';
    }
    
    /**
     * Format amount with currency
     */
    function format(amount, currencyCode = null) {
        const code = currencyCode || currentCurrency;
        const symbol = getSymbol(code);
        return `${amount} ${symbol}`;
    }
    
    /**
     * Set current currency
     */
    function setCurrency(code) {
        if (!CONFIG.supportedCurrencies.find(c => c.code === code)) {
            code = CONFIG.defaultCurrency;
        }
        currentCurrency = code;
        Storage.saveCurrency(code);
        updateUI();
        document.dispatchEvent(new CustomEvent('currencyChanged', {
            detail: { currency: code }
        }));
        return true;
    }
    
    /**
     * Get current currency
     */
    function getCurrentCurrency() {
        return currentCurrency;
    }
    
    /**
     * Initialize currency from saved preference
     */
    function initCurrency() {
        const savedCurrency = Storage.getCurrency();
        currentCurrency = savedCurrency || CONFIG.defaultCurrency;
        if (!CONFIG.supportedCurrencies.find(c => c.code === currentCurrency)) {
            currentCurrency = CONFIG.defaultCurrency;
        }
        updateUI();
        return currentCurrency;
    }
    
    /**
     * Update all UI elements with currency
     */
    function updateUI() {
        // Update header currency label
        const currencyLabel = document.getElementById('currentCurrencyLabel');
        if (currencyLabel) {
            const info = getCurrencyInfo(currentCurrency);
            currencyLabel.textContent = info ? info.code : currentCurrency;
        }
        
        // Update currency button
        const currencyBtn = document.getElementById('currencyBtn');
        if (currencyBtn) {
            const info = getCurrencyInfo(currentCurrency);
            const flag = info ? info.flag : '💰';
            currencyBtn.innerHTML = `${flag} ${info ? info.code : currentCurrency}`;
        }
        
        // Update all currency displays
        document.querySelectorAll('[data-currency]').forEach(el => {
            const amount = el.getAttribute('data-amount');
            if (amount) {
                const formatted = format(parseFloat(amount));
                el.textContent = formatted;
            }
        });
    }
    
    /**
     * Get all supported currencies
     */
    function getSupportedCurrencies() {
        return CONFIG.supportedCurrencies;
    }
    
    // Public API
    return {
        init: initCurrency,
        setCurrency,
        getCurrentCurrency,
        getCurrencyInfo,
        getSymbol,
        getFlag,
        format,
        getSupportedCurrencies,
        updateUI
    };
})();