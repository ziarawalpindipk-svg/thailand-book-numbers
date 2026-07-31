/**
 * ============================================
 * BID ENGINE MODULE
 * Handles all bidding logic
 * ============================================
 */

const BidEngine = (function() {
    
    /**
     * Calculate reward for a bid
     */
    function calculateReward(bidAmount) {
        return bidAmount * CONFIG.rewardMultiplier;
    }
    
    /**
     * Validate a bid
     */
    function validateBid(bidAmount, currency) {
        const errors = [];
        
        if (!bidAmount || bidAmount < CONFIG.minBid) {
            errors.push('Minimum bid is ' + CONFIG.minBid);
        }
        
        if (bidAmount > CONFIG.maxBid) {
            errors.push('Maximum bid is ' + CONFIG.maxBid);
        }
        
        if (!currency) {
            errors.push('Please select a currency');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * Format bid display
     */
    function formatBid(bookNumber, bid, currency, reward) {
        const currencyData = CONFIG.supportedCurrencies.find(c => c.code === currency);
        const symbol = currencyData ? currencyData.symbol : currency;
        
        return {
            bookNumber: bookNumber,
            bid: bid,
            currency: currency,
            reward: reward,
            display: `${bookNumber}: ${bid} ${currency} → ${reward} ${currency}`
        };
    }
    
    /**
     * Check if a book is selected
     */
    function isBookSelected(bookNumber, selectedBooks) {
        return selectedBooks && selectedBooks[bookNumber] !== undefined;
    }
    
    /**
     * Add a bid to selected books
     */
    function addBid(bookNumber, bid, currency, selectedBooks) {
        const reward = calculateReward(bid);
        selectedBooks[bookNumber] = {
            bid: bid,
            currency: currency,
            reward: reward,
            timestamp: Date.now()
        };
        return selectedBooks;
    }
    
    /**
     * Remove a bid from selected books
     */
    function removeBid(bookNumber, selectedBooks) {
        if (selectedBooks[bookNumber]) {
            delete selectedBooks[bookNumber];
        }
        return selectedBooks;
    }
    
    /**
     * Update a bid
     */
    function updateBid(bookNumber, newBid, currency, selectedBooks) {
        if (selectedBooks[bookNumber]) {
            const reward = calculateReward(newBid);
            selectedBooks[bookNumber] = {
                bid: newBid,
                currency: currency,
                reward: reward,
                timestamp: Date.now()
            };
        }
        return selectedBooks;
    }
    
    /**
     * Get total potential reward
     */
    function getTotalReward(selectedBooks) {
        let total = 0;
        for (const key in selectedBooks) {
            total += selectedBooks[key].reward || 0;
        }
        return total;
    }
    
    /**
     * Get total books count
     */
    function getTotalBooks(selectedBooks) {
        return Object.keys(selectedBooks).length;
    }
    
    /**
     * Format selected books for WhatsApp
     */
    function formatForWhatsApp(selectedBooks, currency) {
        if (!selectedBooks || Object.keys(selectedBooks).length === 0) {
            return null;
        }
        
        let message = CONFIG.whatsappMessageTemplate;
        const currencyData = CONFIG.supportedCurrencies.find(c => c.code === currency);
        const symbol = currencyData ? currencyData.symbol : currency;
        
        let totalBooks = 0;
        let totalReward = 0;
        
        for (const [number, data] of Object.entries(selectedBooks)) {
            const reward = calculateReward(data.bid);
            message += `Book Number: ${number}\nBid: ${data.bid} ${currency}\nPossible Reward: ${reward} ${currency}\n\n`;
            totalBooks++;
            totalReward += reward;
        }
        
        message += `Total Books: ${totalBooks}\n`;
        message += `Total Possible Reward: ${totalReward} ${currency}\n\n`;
        message += 'Please review my bids.\n\nThank you.';
        
        return message;
    }
    
    /**
     * Check if it's time for cycle reset
     */
    function shouldResetCycle() {
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth();
        const year = now.getFullYear();
        
        // Cycle A: 1st-15th
        // Cycle B: 16th-end of month
        const cycleStart = day <= 15 ? 1 : 16;
        const cycleEnd = day <= 15 ? 15 : new Date(year, month + 1, 0).getDate();
        
        // Check if we need to reset (first day of cycle)
        const isFirstDayOfCycle = day === cycleStart;
        
        return isFirstDayOfCycle;
    }
    
    /**
     * Get current cycle info
     */
    function getCycleInfo() {
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth();
        const year = now.getFullYear();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        
        let startDay, endDay, cycleLabel;
        
        if (day <= 15) {
            startDay = 1;
            endDay = 15;
            cycleLabel = 'A';
        } else {
            startDay = 16;
            endDay = new Date(year, month + 1, 0).getDate();
            cycleLabel = 'B';
        }
        
        const startDate = new Date(year, month, startDay);
        const endDate = new Date(year, month, endDay);
        
        // Days remaining
        const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        
        return {
            cycle: cycleLabel,
            startDay: startDay,
            endDay: endDay,
            startDate: startDate,
            endDate: endDate,
            startLabel: `${startDay} ${monthNames[month]}`,
            endLabel: `${endDay} ${monthNames[month]}`,
            daysRemaining: Math.max(0, daysRemaining),
            isActive: daysRemaining >= 0,
            monthName: monthNames[month],
            year: year,
            display: `${startDay}-${endDay} ${monthNames[month]} ${year}`
        };
    }
    
    /**
     * Get next cycle info
     */
    function getNextCycleInfo() {
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth();
        const year = now.getFullYear();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        
        let nextStartDay, nextEndDay, nextMonth, nextYear;
        
        if (day <= 15) {
            // Next cycle starts on 16th of same month
            nextStartDay = 16;
            nextEndDay = new Date(year, month + 1, 0).getDate();
            nextMonth = month;
            nextYear = year;
        } else {
            // Next cycle starts on 1st of next month
            nextStartDay = 1;
            nextEndDay = 15;
            nextMonth = month + 1;
            nextYear = year;
            if (nextMonth > 11) {
                nextMonth = 0;
                nextYear = year + 1;
            }
        }
        
        const startDate = new Date(nextYear, nextMonth, nextStartDay);
        const daysUntil = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
        
        return {
            startDay: nextStartDay,
            endDay: nextEndDay,
            startDate: startDate,
            startLabel: `${nextStartDay} ${monthNames[nextMonth]}`,
            endLabel: `${nextEndDay} ${monthNames[nextMonth]}`,
            daysUntil: Math.max(0, daysUntil),
            monthName: monthNames[nextMonth],
            year: nextYear,
            display: `${nextStartDay}-${nextEndDay} ${monthNames[nextMonth]} ${nextYear}`
        };
    }
    
    // Public API
    return {
        calculateReward,
        validateBid,
        formatBid,
        isBookSelected,
        addBid,
        removeBid,
        updateBid,
        getTotalReward,
        getTotalBooks,
        formatForWhatsApp,
        shouldResetCycle,
        getCycleInfo,
        getNextCycleInfo,
        CONFIG
    };
})();