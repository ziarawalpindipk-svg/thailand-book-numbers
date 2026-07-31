/**
 * ============================================
 * THAILAND BOOK NUMBERS - OVERSEAS
 * Main Application Entry Point
 * ============================================
 */

(function() {
    'use strict';
    
    /**
     * Initialize the application
     */
    async function initApp() {
        console.log(`🚀 ${CONFIG.appName} v${CONFIG.version}`);
        console.log(`📚 ${CONFIG.siteTitle}`);
        
        try {
            // 1. Initialize language
            await Language.init();
            console.log(`🌐 Language: ${Language.getCurrentLanguage()}`);
            
            // 2. Initialize currency
            Currency.init();
            console.log(`💰 Currency: ${Currency.getCurrentCurrency()}`);
            
            // 3. Check for cycle reset
            checkCycleReset();
            
            // 4. Initialize UI
            UIRenderer.init();
            console.log('🎨 UI initialized');
            
            // 5. Load instructions content
            loadInstructions();
            
            // 6. Load terms content
            loadTerms();
            
            // 7. Load winners content
            loadWinners();
            
            // 8. Load rewarded numbers
            loadRewardedNumbers();
            
            // 9. Load bid cycle content
            loadBidCycle();
            
            console.log('✅ Application ready!');
            
        } catch (error) {
            console.error('❌ Initialization error:', error);
        }
    }
    
    /**
     * Check if cycle reset is needed
     */
    function checkCycleReset() {
        if (BidEngine.shouldResetCycle()) {
            const cycleInfo = BidEngine.getCycleInfo();
            const lastReset = Storage.getCycleData();
            const today = new Date().toDateString();
            
            // Check if already reset today
            if (lastReset && lastReset.date === today) {
                return;
            }
            
            // Reset bid data
            Storage.resetBidData();
            Storage.saveCycleData({
                date: today,
                cycle: cycleInfo.cycle,
                start: cycleInfo.startLabel,
                end: cycleInfo.endLabel
            });
            
            console.log('🔄 Cycle reset performed');
        }
    }
    
    /**
     * Load instructions content
     */
    function loadInstructions() {
        const container = document.getElementById('instructionsContent');
        if (!container) return;
        
        const lang = Language.getCurrentLanguage();
        // Content is loaded from language file
        // We'll use the translations
        const content = `
            <h3>${Language.t('step1', 'STEP 1: UNDERSTAND THE BOOK NUMBERS')}</h3>
            <p>${Language.t('step1Desc', 'There are exactly 1000 Book Numbers: 000 to 999. Each number represents a unique book. You already know what each book contains. No descriptions or images needed - just the number!')}</p>
            
            <h3>${Language.t('step2', 'STEP 2: SELECT YOUR CURRENCY')}</h3>
            <p>${Language.t('step2Desc', 'Choose your preferred currency from the top menu. All bids and rewards will be shown in your selected currency. Currency works independently of language.')}</p>
            
            <h3>${Language.t('step3', 'STEP 3: SELECT YOUR LANGUAGE')}</h3>
            <p>${Language.t('step3Desc', 'Choose your preferred language from the top menu. 15 languages supported. All content translates instantly. Language works independently of currency.')}</p>
            
            <h3>${Language.t('step4', 'STEP 4: PLACE YOUR BID')}</h3>
            <p>${Language.t('step4Desc', 'Find your desired Book Number using Search Box or Quick Jump buttons. Click/Tap on the Book Number. A Bid Dialog will open. Enter your bid amount and click Add.')}</p>
            
            <h3>${Language.t('step5', 'STEP 5: UNDERSTAND THE REWARD SYSTEM')}</h3>
            <p>${Language.t('step5Desc', 'ONE WINNING NUMBER PER CYCLE! Every 15-day cycle, ONLY ONE Book Number is rewarded. ALL users who bid on that number get the reward. Users from ALL countries participate together.')}</p>
            <p><strong>${Language.t('rewardFormula', 'Reward Formula:')}</strong> ${Language.t('rewardFormulaDesc', 'Reward = Bid × 500 (same currency)')}</p>
            
            <h3>${Language.t('step6', 'STEP 6: BID CYCLE EXPLAINED')}</h3>
            <p>${Language.t('step6Desc', 'The marketplace operates in 15-day cycles: Cycle A: 1st to 15th of every month. Cycle B: 15th to end of every month.')}</p>
            
            <h3>${Language.t('step7', 'STEP 7: REVIEW YOUR SELECTED BOOKS')}</h3>
            <p>${Language.t('step7Desc', 'Click "Selected Books" to view all your bids. You can Edit or Remove any bid.')}</p>
            
            <h3>${Language.t('step8', 'STEP 8: SEND BIDS VIA WHATSAPP')}</h3>
            <p>${Language.t('step8Desc', 'Click the green WhatsApp button. A formatted message will be created automatically. Review and send.')}</p>
            
            <h3>${Language.t('step9', 'STEP 9: WHAT HAPPENS NEXT?')}</h3>
            <p>${Language.t('step9Desc', 'Admin reviews all bids. If your number wins, you receive the reward. Payment instructions are sent. Access to books is granted for 15 days.')}</p>
            
            <hr>
            <h3>${Language.t('faq', 'FREQUENTLY ASKED QUESTIONS')}</h3>
            <p><strong>${Language.t('faq1q', 'How many numbers win each cycle?')}</strong><br>
            ${Language.t('faq1a', 'ONLY ONE (1) number wins each 15-day cycle.')}</p>
            
            <p><strong>${Language.t('faq2q', 'If I bid on the winning number, do I get the reward?')}</strong><br>
            ${Language.t('faq2a', 'YES! Everyone who bid on that number gets the reward.')}</p>
            
            <p><strong>${Language.t('faq3q', 'What if multiple users bid on the same winning number?')}</strong><br>
            ${Language.t('faq3a', 'ALL of them get the reward based on their own bid amount.')}</p>
            
            <p><strong>${Language.t('faq4q', 'Can users from different countries win together?')}</strong><br>
            ${Language.t('faq4a', 'YES! All users from all countries participate together. If your number wins, you all win!')}</p>
            
            <p><strong>${Language.t('faq5q', 'Can I use any language with any currency?')}</strong><br>
            ${Language.t('faq5a', 'YES! Language and currency are independent. You can use Hindi with KWD, or Urdu with USD, etc.')}</p>
            
            <p><strong>${Language.t('faq6q', 'Do I need to create an account?')}</strong><br>
            ${Language.t('faq6a', 'No! No registration or login required. Everything is simple.')}</p>
            
            <p><strong>${Language.t('faq7q', 'What is the minimum bid?')}</strong><br>
            ${Language.t('faq7a', 'Minimum bid is 1 (in your selected currency).')}</p>
            
            <p><strong>${Language.t('faq8q', 'Is there a maximum bid limit?')}</strong><br>
            ${Language.t('faq8a', 'No, you can bid any amount above 1.')}</p>
            
            <p><strong>${Language.t('faq9q', 'How long do I get access to the books?')}</strong><br>
            ${Language.t('faq9a', '15 days from the date of payment confirmation.')}</p>
            
            <p><strong>${Language.t('faq10q', 'What if my number doesn\'t win?')}</strong><br>
            ${Language.t('faq10a', 'You can try again in the next bidding cycle with new numbers.')}</p>
        `;
        
        container.innerHTML = content;
    }
    
    /**
     * Load terms content
     */
    function loadTerms() {
        const container = document.getElementById('termsContent');
        if (!container) return;
        
        const content = `
            <h3>1. ${Language.t('biddingRules', 'Bidding Rules')}</h3>
            <p>${Language.t('biddingRulesDesc', 'All bids must be at least 1 (in the selected currency). There is no maximum bid limit. Bids can only be placed on Book Numbers 000-999. All bids are submitted through WhatsApp. The admin reserves the right to accept or reject any bid. Users from ALL countries can participate together.')}</p>
            
            <h3>2. ${Language.t('rewardRules', 'Reward Rules')}</h3>
            <p>${Language.t('rewardRulesDesc', 'ONLY ONE (1) Book Number wins per 15-day cycle. ALL users who bid on the winning number get the reward. Users from ALL countries receive the reward together. Reward = Bid × 500 (same currency). Reward is calculated automatically. Reward is only paid if the number wins.')}</p>
            
            <h3>3. ${Language.t('paymentRules', 'Payment Rules')}</h3>
            <p>${Language.t('paymentRulesDesc', 'Payment is required only after the number wins. Payment instructions will be sent via WhatsApp. Access to books is granted only after payment confirmation. All payments are final and non-refundable.')}</p>
            
            <h3>4. ${Language.t('accessRules', 'Access Rules')}</h3>
            <p>${Language.t('accessRulesDesc', 'Access to purchased books lasts for 15 days. Access starts from the date of payment confirmation. Access expires automatically after 15 days. Users must participate in the next cycle for continued access.')}</p>
            
            <h3>5. ${Language.t('userResponsibilities', 'User Responsibilities')}</h3>
            <p>${Language.t('userResponsibilitiesDesc', 'Users must provide accurate information. Users are responsible for their own bid amounts. Users must read and understand these terms before bidding. Users must contact the admin via WhatsApp for any queries. Users from all countries are equally eligible to win.')}</p>
            
            <h3>6. ${Language.t('privacyPolicy', 'Privacy Policy')}</h3>
            <p>${Language.t('privacyPolicyDesc', 'User data is stored only in the browser (Local Storage). No personal data is collected without consent. WhatsApp communication is handled directly with the admin. User stories are only published with explicit permission.')}</p>
            
            <h3>7. ${Language.t('disclaimer', 'Disclaimer')}</h3>
            <p>${Language.t('disclaimerDesc', 'This platform is for bidding purposes only. The admin makes no guarantees about bid acceptance. Users participate at their own risk. The admin may update these terms at any time. Only 1 number wins per cycle; choose your bids wisely.')}</p>
            
            <h3>8. ${Language.t('contactInformation', 'Contact Information')}</h3>
            <p>📱 WhatsApp: ${CONFIG.whatsappNumber}</p>
            
            <h3>9. ${Language.t('agreement', 'Agreement')}</h3>
            <p>${Language.t('agreementDesc', 'By placing a bid, you agree to all the terms and conditions listed above.')}</p>
            <p><em>${Language.t('lastUpdated', 'Last Updated:')} ${new Date().toLocaleDateString()}</em></p>
        `;
        
        container.innerHTML = content;
    }
    
    /**
     * Load winners content
     */
    function loadWinners() {
        const container = document.getElementById('winnersContent');
        if (!container) return;
        
        const winners = CONFIG.adminData.winners;
        let html = `
            <p style="text-align:center;background:#e8f0fe;padding:12px;border-radius:8px;margin-bottom:20px;">
                ⭐ ${Language.t('oneWinnerPerCycle', 'ONE WINNER PER CYCLE!')} 
                ${Language.t('allUsersGetReward', 'Everyone who bid on the winning number gets the reward!')}
            </p>
        `;
        
        winners.forEach((winner, index) => {
            html += `
                <div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;background:var(--bg);">
                    <h4 style="color:var(--primary);margin:0 0 8px 0;">
                        🏆 WINNING CYCLE: ${winner.cycle}
                    </h4>
                    <p style="font-size:24px;font-weight:700;margin:8px 0;color:var(--success);">
                        Winning Number: ${winner.number} 🎉
                    </p>
                    <p style="margin:4px 0;">
                        <strong>${Language.t('totalWinners', 'Total Winners')}:</strong> ${winner.winners} users
                    </p>
                    <p style="margin:4px 0;">
                        <strong>${Language.t('countries', 'Countries')}:</strong> ${winner.countries}
                    </p>
                </div>
            `;
        });
        
        html += `
            <div style="background:#f1f3f4;border-radius:8px;padding:16px;margin-top:16px;">
                <h4>💫 ${Language.t('wantToBeWinner', 'Want to be a winner too?')}</h4>
                <p>${Language.t('joinNextCycle', 'The next bidding cycle starts soon. Don\'t miss your chance to win!')}</p>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    /**
     * Load rewarded numbers content
     */
    function loadRewardedNumbers() {
        const container = document.getElementById('rewardedContent');
        if (!container) return;
        
        const rewarded = CONFIG.adminData.rewardedNumbers;
        let html = `
            <p style="text-align:center;background:#e8f0fe;padding:12px;border-radius:8px;margin-bottom:20px;">
                📌 ${Language.t('oneWinnerPerCycle', 'ONLY ONE NUMBER WINS PER CYCLE!')}
            </p>
        `;
        
        rewarded.forEach((item, index) => {
            html += `
                <div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:12px;background:var(--bg);">
                    <h4 style="margin:0 0 8px 0;color:var(--primary);">📅 ${item.cycle}</h4>
                    <p style="font-size:20px;font-weight:700;margin:8px 0;color:var(--success);">
                        ⭐ WINNING NUMBER: ${item.numbers.join(', ')} 🎉
                    </p>
                    <p style="font-size:13px;color:var(--text-secondary);margin:4px 0;">
                        🎯 ${Language.t('allUsersGetReward', 'All users who bid on this number received rewards!')}
                    </p>
                </div>
            `;
        });
        
        html += `
            <div style="background:#f1f3f4;border-radius:8px;padding:16px;margin-top:16px;">
                <h4>💡 ${Language.t('howItWorks', 'How It Works')}</h4>
                <p>${Language.t('howItWorksDesc', 'Every 15-day cycle has ONLY ONE winning number. ALL users who bid on that number are winners. Winners receive reward = Their Bid × 500.')}</p>
                <p style="margin-top:8px;">
                    <strong>📢 ${Language.t('nextAnnouncement', 'Next Winning Number Announcement')}:</strong> 
                    ${BidEngine.getCycleInfo().endLabel}
                </p>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    /**
     * Load bid cycle content
     */
    function loadBidCycle() {
        const container = document.getElementById('bidCycleContent');
        if (!container) return;
        
        const cycle = BidEngine.getCycleInfo();
        const nextCycle = BidEngine.getNextCycleInfo();
        
        const content = `
            <div style="background:var(--primary);color:white;border-radius:8px;padding:20px;margin-bottom:20px;text-align:center;">
                <h3 style="margin:0 0 8px 0;font-size:20px;">${Language.t('currentCycle', 'Current Bid Cycle')}</h3>
                <p style="font-size:28px;font-weight:700;margin:8px 0;">${cycle.display}</p>
                <p style="font-size:14px;opacity:0.9;">
                    📅 ${Language.t('daysRemaining', 'Days Remaining')}: ${cycle.daysRemaining} days
                </p>
                <p style="font-size:14px;opacity:0.9;margin-top:8px;">
                    ⭐ ${Language.t('oneWinnerPerCycle', 'ONLY ONE NUMBER WINS PER CYCLE!')}
                </p>
            </div>
            
            <div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;background:var(--bg);">
                <h4 style="margin:0 0 8px 0;">⏰ ${Language.t('nextCycle', 'Next Cycle')}</h4>
                <p><strong>${Language.t('nextCycleStarts', 'Next Cycle Starts')}:</strong> ${nextCycle.display}</p>
                <p><strong>${Language.t('daysUntilNextCycle', 'Days Until Next Cycle')}:</strong> ${nextCycle.daysUntil} days</p>
            </div>
            
            <div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;background:var(--bg);">
                <h4 style="margin:0 0 8px 0;">📋 ${Language.t('importantRules', 'Important Rules')}</h4>
                <ul style="margin:8px 0;padding-left:20px;">
                    <li>${Language.t('biddingOpen', 'Bidding is open during the current cycle')}</li>
                    <li>${Language.t('bidsReset', 'All bids reset at the start of each new cycle')}</li>
                    <li>${Language.t('cycleLasts', 'Each cycle lasts 15 days')}</li>
                    <li>${Language.t('oneWinnerPerCycleRule', 'ONLY ONE winning number per cycle')}</li>
                    <li>${Language.t('accessDuration', 'Access to books is granted for 15 days after payment')}</li>
                </ul>
            </div>
            
            <div style="border:1px solid var(--border);border-radius:8px;padding:16px;background:var(--bg);">
                <h4 style="margin:0 0 8px 0;">📊 ${Language.t('yourStatus', 'Your Status')}</h4>
                <p><strong>${Language.t('selectedBooks', 'Selected Books')}:</strong> <span id="cycleSelectedCount">${UIRenderer.getSelectedCount()}</span></p>
                <p><strong>${Language.t('totalBids', 'Total Bids')}:</strong> <span id="cycleTotalBids">${UIRenderer.getSelectedCount()}</span></p>
            </div>
        `;
        
        container.innerHTML = content;
    }
    
    // Handle language change events
    document.addEventListener('languageChanged', function(e) {
        loadInstructions();
        loadTerms();
        loadWinners();
        loadRewardedNumbers();
        loadBidCycle();
    });
    
    // Handle currency change events
    document.addEventListener('currencyChanged', function(e) {
        // Update all currency displays
        document.querySelectorAll('[data-currency]').forEach(el => {
            const amount = el.getAttribute('data-amount');
            if (amount) {
                const formatted = Currency.format(parseFloat(amount));
                el.textContent = formatted;
            }
        });
    });
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
    
})();