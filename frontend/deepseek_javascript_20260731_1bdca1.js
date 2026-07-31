/**
 * ============================================
 * WHATSAPP MODULE
 * Handles all WhatsApp integration
 * ============================================
 */

const WhatsApp = (function() {
    
    /**
     * Generate WhatsApp message from selected books
     */
    function generateMessage(selectedBooks, currency) {
        const books = Storage.getSelectedBooks();
        if (!books || Object.keys(books).length === 0) {
            return null;
        }
        
        const cycleInfo = BidEngine.getCycleInfo();
        let message = `Hello,\n\n`;
        message += `I would like to place the following bids for Cycle ${cycleInfo.cycle} (${cycleInfo.display}).\n\n`;
        
        let totalBooks = 0;
        let totalReward = 0;
        const currencySymbol = Currency.getSymbol(currency);
        
        for (const [number, data] of Object.entries(books)) {
            const reward = BidEngine.calculateReward(data.bid);
            message += `📖 Book #${number}\n`;
            message += `   Bid: ${data.bid} ${currencySymbol}\n`;
            message += `   Possible Reward: ${reward} ${currencySymbol}\n\n`;
            totalBooks++;
            totalReward += reward;
        }
        
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `📊 Total Books: ${totalBooks}\n`;
        message += `💰 Total Possible Reward: ${totalReward} ${currencySymbol}\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `Please review my bids.\n\nThank you.`;
        
        return message;
    }
    
    /**
     * Send message via WhatsApp
     */
    function sendMessage(message) {
        if (!message) {
            showToast('No bids to send', 'warning');
            return false;
        }
        
        const phoneNumber = CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
        if (!phoneNumber) {
            showToast('WhatsApp number not configured', 'error');
            return false;
        }
        
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Open in new window/tab
        window.open(url, '_blank');
        return true;
    }
    
    /**
     * Show toast notification
     */
    function showToast(message, type = 'info') {
        // Simple toast implementation
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 9999;
            background: ${type === 'error' ? '#ea4335' : type === 'warning' ? '#fbbc04' : '#1a73e8'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 90%;
            text-align: center;
            animation: slideUp 0.3s ease;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    /**
     * Check if selected books exist
     */
    function hasSelectedBooks() {
        const books = Storage.getSelectedBooks();
        return books && Object.keys(books).length > 0;
    }
    
    /**
     * Get count of selected books
     */
    function getSelectedCount() {
        const books = Storage.getSelectedBooks();
        return books ? Object.keys(books).length : 0;
    }
    
    // Public API
    return {
        generateMessage,
        sendMessage,
        hasSelectedBooks,
        getSelectedCount,
        showToast
    };
})();