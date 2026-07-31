/**
 * ============================================
 * THAILAND BOOK NUMBERS - OVERSEAS
 * Configuration File
 * ============================================
 */

const CONFIG = {
    // App Info
    appName: 'Thailand Book Numbers - Overseas',
    version: '1.0.0',
    siteTitle: 'Discover 000 to 999 Unique Thai Book numbers',
    siteDescription: 'Bid on your favorite Thailand Book Numbers from 000 to 999. Make your offer and own a piece of Thai literature.',
    
    // Business Rules
    rewardMultiplier: 500,
    defaultBid: 1,
    minBid: 1,
    maxBid: 999999,
    cycleDays: 15,
    winnersPerCycle: 1, // ONLY ONE NUMBER WINS PER CYCLE
    
    // WhatsApp
    whatsappNumber: '+1234567890', // CHANGE THIS TO YOUR NUMBER
    whatsappMessageTemplate: 'Hello,\n\nI would like to place the following bids for the current cycle.\n\n',
    
    // Languages (15 Languages)
    defaultLanguage: 'en',
    supportedLanguages: [
        { code: 'en', name: 'English', dir: 'ltr' },
        { code: 'ar', name: 'العربية', dir: 'rtl' },
        { code: 'th', name: 'ไทย', dir: 'ltr' },
        { code: 'ur', name: 'اردو', dir: 'rtl' },
        { code: 'hi', name: 'हिन्दी', dir: 'ltr' },
        { code: 'zh', name: '中文', dir: 'ltr' },
        { code: 'ja', name: '日本語', dir: 'ltr' },
        { code: 'ko', name: '한국어', dir: 'ltr' },
        { code: 'fr', name: 'Français', dir: 'ltr' },
        { code: 'de', name: 'Deutsch', dir: 'ltr' },
        { code: 'es', name: 'Español', dir: 'ltr' },
        { code: 'pt', name: 'Português', dir: 'ltr' },
        { code: 'tr', name: 'Türkçe', dir: 'ltr' },
        { code: 'id', name: 'Bahasa Indonesia', dir: 'ltr' },
        { code: 'ru', name: 'Русский', dir: 'ltr' }
    ],
    
    // Currencies (12 Currencies)
    defaultCurrency: 'KWD',
    supportedCurrencies: [
        { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', flag: '🇰🇼' },
        { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
        { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
        { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', flag: '🇶🇦' },
        { code: 'BHD', name: 'Bahraini Dinar', symbol: 'د.ب', flag: '🇧🇭' },
        { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع', flag: '🇴🇲' },
        { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
        { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
        { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
        { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
        { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰' },
        { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' }
    ],
    
    // Book Numbers
    totalBooks: 1000,
    startNumber: 0,
    endNumber: 999,
    
    // Range Navigation
    ranges: [
        { label: '000-099', start: 0, end: 99 },
        { label: '100-199', start: 100, end: 199 },
        { label: '200-299', start: 200, end: 299 },
        { label: '300-399', start: 300, end: 399 },
        { label: '400-499', start: 400, end: 499 },
        { label: '500-599', start: 500, end: 599 },
        { label: '600-699', start: 600, end: 699 },
        { label: '700-799', start: 700, end: 799 },
        { label: '800-899', start: 800, end: 899 },
        { label: '900-999', start: 900, end: 999 }
    ],
    
    // Storage Keys
    storageKeys: {
        selectedBooks: 'tb_selected_books',
        language: 'tb_language',
        currency: 'tb_currency',
        uiPreferences: 'tb_ui_preferences',
        cycleData: 'tb_cycle_data'
    },
    
    // Admin Data (for demo)
    adminData: {
        winners: [
            { cycle: '1-15 August', number: '555', winners: 22, countries: 'Kuwait, Saudi Arabia, UAE, Pakistan, India, Thailand, USA, UK' },
            { cycle: '15-31 August', number: '777', winners: 14, countries: 'Bahrain, Qatar, Oman, UAE, India, Pakistan, France' },
            { cycle: '1-15 September', number: '333', winners: 19, countries: 'Kuwait, Saudi Arabia, Thailand, Pakistan, India, USA, UK, Turkey, Indonesia' },
            { cycle: '15-30 September', number: '901', winners: 8, countries: 'UAE, Qatar, Bahrain, Oman, India, Pakistan' },
            { cycle: '1-15 October', number: '222', winners: 11, countries: 'Kuwait, Saudi Arabia, UAE, Pakistan, India, Thailand, UK' }
        ],
        rewardedNumbers: [
            { cycle: '1-15 August', numbers: ['555'] },
            { cycle: '15-31 August', numbers: ['777'] },
            { cycle: '1-15 September', numbers: ['333'] },
            { cycle: '15-30 September', numbers: ['901'] },
            { cycle: '1-15 October', numbers: ['222'] }
        ]
    }
};

// Freeze config to prevent accidental changes
Object.freeze(CONFIG);