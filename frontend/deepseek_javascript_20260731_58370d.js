/**
 * ============================================
 * UI RENDERER MODULE
 * Handles all UI rendering
 * ============================================
 */

const UIRenderer = (function() {
    
    let currentRange = '0-99';
    let searchQuery = '';
    let selectedBooks = {};
    
    /**
     * Initialize UI
     */
    function init() {
        selectedBooks = Storage.getSelectedBooks();
        renderBookGrid();
        updateSelectedCount();
        updateCycleInfo();
        setupEventListeners();
        setupLanguageMenu();
        setupCurrencyMenu();
        setupPageNavigation();
        setupBottomNav();
    }
    
    /**
     * Render book grid
     */
    function renderBookGrid() {
        const grid = document.getElementById('bookGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        const range = currentRange.split('-');
        const start = parseInt(range[0]);
        const end = parseInt(range[1]);
        
        for (let i = start; i <= end; i++) {
            const num = i.toString().padStart(3, '0');
            const btn = document.createElement('button');
            btn.className = 'book-btn';
            btn.dataset.number = num;
            btn.textContent = num;
            
            // Check if selected
            if (selectedBooks[num]) {
                btn.classList.add('selected', 'bid-added');
            }
            
            // Check if matches search
            if (searchQuery && !num.includes(searchQuery.padStart(3, '0'))) {
                btn.classList.add('hidden');
            }
            
            btn.addEventListener('click', () => onBookClick(num));
            grid.appendChild(btn);
        }
    }
    
    /**
     * Handle book click
     */
    function onBookClick(number) {
        const dialog = document.getElementById('bidDialog');
        const bookNumber = document.getElementById('dialogBookNumber');
        const bidValue = document.getElementById('bidValue');
        const rewardValue = document.getElementById('rewardValue');
        const rewardCurrency = document.getElementById('rewardCurrency');
        
        const currentCurrency = Currency.getCurrentCurrency();
        const existingBid = selectedBooks[number];
        let currentBid = existingBid ? existingBid.bid : CONFIG.defaultBid;
        
        bookNumber.textContent = `Book #${number}`;
        bidValue.textContent = currentBid;
        
        // Update reward
        const reward = BidEngine.calculateReward(currentBid);
        rewardValue.textContent = reward;
        rewardCurrency.textContent = Currency.getSymbol(currentCurrency);
        
        // Store current book number
        dialog.dataset.bookNumber = number;
        dialog.dataset.currentBid = currentBid;
        dialog.dataset.existing = existingBid ? 'true' : 'false';
        
        dialog.classList.add('active');
    }
    
    /**
     * Update selected count badges
     */
    function updateSelectedCount() {
        const count = Object.keys(selectedBooks).length;
        const badges = document.querySelectorAll('#selectedCount, #bottomSelectedCount');
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
        });
    }
    
    /**
     * Update cycle info
     */
    function updateCycleInfo() {
        const cycleInfo = BidEngine.getCycleInfo();
        const nextCycle = BidEngine.getNextCycleInfo();
        
        // Update cycle dates
        const cycleDates = document.getElementById('cycleDates');
        if (cycleDates) {
            cycleDates.textContent = cycleInfo.display;
        }
        
        // Update days remaining
        const daysRemaining = document.getElementById('daysRemaining');
        if (daysRemaining) {
            daysRemaining.textContent = `${cycleInfo.daysRemaining} days remaining`;
        }
        
        // Update winner announcement date
        const winnerDate = document.getElementById('winnerAnnounceDate');
        if (winnerDate) {
            winnerDate.textContent = `Announced: ${cycleInfo.endLabel}`;
        }
    }
    
    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Search
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.trim();
                renderBookGrid();
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                if (searchInput) {
                    searchQuery = searchInput.value.trim();
                    renderBookGrid();
                }
            });
        }
        
        // Quick jump
        document.querySelectorAll('.quick-jump button').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.quick-jump button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentRange = btn.dataset.range;
                searchQuery = '';
                if (searchInput) searchInput.value = '';
                renderBookGrid();
            });
        });
        
        // Bid dialog controls
        document.getElementById('bidDecrease')?.addEventListener('click', () => {
            const value = document.getElementById('bidValue');
            let current = parseInt(value.textContent);
            if (current > CONFIG.minBid) {
                current--;
                value.textContent = current;
                updateRewardDisplay(current);
            }
        });
        
        document.getElementById('bidIncrease')?.addEventListener('click', () => {
            const value = document.getElementById('bidValue');
            let current = parseInt(value.textContent);
            current++;
            value.textContent = current;
            updateRewardDisplay(current);
        });
        
        document.getElementById('dialogAddBtn')?.addEventListener('click', handleAddBid);
        document.getElementById('dialogCancelBtn')?.addEventListener('click', closeDialog);
        
        // Selected books modal
        document.getElementById('selectedBooksBtn')?.addEventListener('click', openSelectedModal);
        document.getElementById('bottomSelectedBtn')?.addEventListener('click', openSelectedModal);
        document.getElementById('selectedModalClose')?.addEventListener('click', closeSelectedModal);
        
        // WhatsApp buttons
        document.getElementById('whatsappFromModal')?.addEventListener('click', handleWhatsAppSend);
        document.getElementById('whatsappFloatBtn')?.addEventListener('click', handleWhatsAppSend);
        
        // Back to top
        document.getElementById('backToTopBtn')?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Language button
        document.getElementById('languageBtn')?.addEventListener('click', toggleLanguageMenu);
        
        // Currency button
        document.getElementById('currencyBtn')?.addEventListener('click', toggleCurrencyMenu);
        
        // Close modals on overlay click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }
    
    /**
     * Update reward display
     */
    function updateRewardDisplay(bid) {
        const reward = BidEngine.calculateReward(bid);
        document.getElementById('rewardValue').textContent = reward;
    }
    
    /**
     * Handle add bid
     */
    function handleAddBid() {
        const dialog = document.getElementById('bidDialog');
        const bookNumber = dialog.dataset.bookNumber;
        const bidValue = document.getElementById('bidValue');
        const bid = parseInt(bidValue.textContent);
        const currency = Currency.getCurrentCurrency();
        const isExisting = dialog.dataset.existing === 'true';
        
        // Validate bid
        const validation = BidEngine.validateBid(bid, currency);
        if (!validation.valid) {
            WhatsApp.showToast(validation.errors[0], 'error');
            return;
        }
        
        // Add or update bid
        if (isExisting) {
            selectedBooks = BidEngine.updateBid(bookNumber, bid, currency, selectedBooks);
        } else {
            selectedBooks = BidEngine.addBid(bookNumber, bid, currency, selectedBooks);
        }
        
        // Save to storage
        Storage.saveSelectedBooks(selectedBooks);
        
        // Update UI
        renderBookGrid();
        updateSelectedCount();
        closeDialog();
        
        WhatsApp.showToast(`Book #${bookNumber} added successfully!`, 'success');
    }
    
    /**
     * Close dialog
     */
    function closeDialog() {
        document.getElementById('bidDialog').classList.remove('active');
    }
    
    /**
     * Open selected books modal
     */
    function openSelectedModal() {
        const modal = document.getElementById('selectedModal');
        const list = document.getElementById('selectedBooksList');
        const totalBooks = document.getElementById('modalTotalBooks');
        const totalReward = document.getElementById('modalTotalReward');
        const totalCurrency = document.getElementById('modalTotalCurrency');
        
        const books = Storage.getSelectedBooks();
        
        if (!books || Object.keys(books).length === 0) {
            list.innerHTML = '<p class="empty-state">No books selected yet.</p>';
            totalBooks.textContent = '0';
            totalReward.textContent = '0';
        } else {
            let html = '';
            let total = 0;
            let reward = 0;
            const currency = Currency.getCurrentCurrency();
            
            for (const [number, data] of Object.entries(books)) {
                const bookReward = BidEngine.calculateReward(data.bid);
                html += `
                    <div class="selected-item" data-number="${number}">
                        <div class="book-info">
                            <span class="book-number">#${number}</span>
                            <span class="bid-info">
                                Bid: ${data.bid} ${currency} | 
                                <span class="reward">Reward: ${bookReward} ${currency}</span>
                            </span>
                        </div>
                        <div class="actions">
                            <button class="btn-edit" onclick="UIRenderer.editBid('${number}')">Edit</button>
                            <button class="btn-remove" onclick="UIRenderer.removeBid('${number}')">Remove</button>
                        </div>
                    </div>
                `;
                total++;
                reward += bookReward;
            }
            
            list.innerHTML = html;
            totalBooks.textContent = total;
            totalReward.textContent = reward;
            totalCurrency.textContent = currency;
        }
        
        // Update total reward
        const total = BidEngine.getTotalReward(books);
        document.getElementById('modalTotalReward').textContent = total;
        document.getElementById('modalTotalCurrency').textContent = Currency.getCurrentCurrency();
        
        modal.classList.add('active');
    }
    
    /**
     * Close selected modal
     */
    function closeSelectedModal() {
        document.getElementById('selectedModal').classList.remove('active');
    }
    
    /**
     * Edit bid from modal
     */
    function editBid(number) {
        closeSelectedModal();
        // Trigger click on book button
        const btn = document.querySelector(`.book-btn[data-number="${number}"]`);
        if (btn) {
            btn.click();
        }
    }
    
    /**
     * Remove bid from modal
     */
    function removeBid(number) {
        if (confirm(`Remove bid for Book #${number}?`)) {
            selectedBooks = BidEngine.removeBid(number, selectedBooks);
            Storage.saveSelectedBooks(selectedBooks);
            renderBookGrid();
            updateSelectedCount();
            openSelectedModal(); // Refresh modal
            WhatsApp.showToast(`Book #${number} removed`, 'info');
        }
    }
    
    /**
     * Handle WhatsApp send
     */
    function handleWhatsAppSend() {
        const books = Storage.getSelectedBooks();
        if (!books || Object.keys(books).length === 0) {
            WhatsApp.showToast('No bids to send', 'warning');
            return;
        }
        
        const currency = Currency.getCurrentCurrency();
        const message = WhatsApp.generateMessage(books, currency);
        
        if (message) {
            WhatsApp.sendMessage(message);
        }
    }
    
    /**
     * Setup language menu
     */
    function setupLanguageMenu() {
        // Simple dropdown - will be implemented as dialog
    }
    
    /**
     * Toggle language menu
     */
    function toggleLanguageMenu() {
        // Show language selection dialog
        const langs = Language.getSupportedLanguages();
        let html = '<div class="language-menu">';
        langs.forEach(lang => {
            const isActive = lang.code === Language.getCurrentLanguage();
            html += `
                <button onclick="Language.setLanguage('${lang.code}')" 
                        class="${isActive ? 'active' : ''}"
                        style="display:block;width:100%;padding:10px;border:none;background:${isActive ? '#e8f0fe' : 'transparent'};cursor:pointer;text-align:left;font-size:14px;">
                    ${lang.code === 'ar' ? '🔴' : ''} ${lang.name}
                </button>
            `;
        });
        html += '</div>';
        
        // Show as dialog
        showCustomDialog('Select Language', html);
    }
    
    /**
     * Setup currency menu
     */
    function setupCurrencyMenu() {
        // Simple dropdown - will be implemented as dialog
    }
    
    /**
     * Toggle currency menu
     */
    function toggleCurrencyMenu() {
        const currencies = Currency.getSupportedCurrencies();
        let html = '<div class="currency-menu">';
        currencies.forEach(curr => {
            const isActive = curr.code === Currency.getCurrentCurrency();
            html += `
                <button onclick="Currency.setCurrency('${curr.code}')" 
                        class="${isActive ? 'active' : ''}"
                        style="display:block;width:100%;padding:10px;border:none;background:${isActive ? '#e8f0fe' : 'transparent'};cursor:pointer;text-align:left;font-size:14px;">
                    ${curr.flag} ${curr.code} - ${curr.name}
                </button>
            `;
        });
        html += '</div>';
        
        showCustomDialog('Select Currency', html);
    }
    
    /**
     * Show custom dialog
     */
    function showCustomDialog(title, content) {
        const dialog = document.createElement('div');
        dialog.className = 'custom-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        dialog.innerHTML = `
            <div style="background:white;border-radius:12px;max-width:400px;width:100%;padding:20px;max-height:80vh;overflow-y:auto;">
                <h3 style="margin:0 0 16px 0;font-size:18px;">${title}</h3>
                <div>${content}</div>
                <button onclick="this.closest('.custom-dialog').remove()" 
                        style="margin-top:16px;padding:10px 20px;background:#f1f3f4;border:none;border-radius:8px;cursor:pointer;width:100%;font-size:14px;">
                    Close
                </button>
            </div>
        `;
        document.body.appendChild(dialog);
    }
    
    /**
     * Setup page navigation
     */
    function setupPageNavigation() {
        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            link.addEventListener('click', () => {
                const page = link.dataset.page;
                navigateTo(page);
            });
        });
    }
    
    /**
     * Setup bottom navigation
     */
    function setupBottomNav() {
        document.querySelectorAll('.bottom-nav-link[data-page]').forEach(link => {
            link.addEventListener('click', () => {
                const page = link.dataset.page;
                navigateTo(page);
            });
        });
    }
    
    /**
     * Navigate to page
     */
    function navigateTo(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        // Show target page
        const target = document.getElementById(`page-${page}`);
        if (target) {
            target.classList.add('active');
        }
        
        // Update nav links
        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });
        
        document.querySelectorAll('.bottom-nav-link[data-page]').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    /**
     * Get selected books count
     */
    function getSelectedCount() {
        return Object.keys(selectedBooks).length;
    }
    
    // Public API
    return {
        init,
        renderBookGrid,
        updateSelectedCount,
        editBid,
        removeBid,
        getSelectedCount,
        navigateTo,
        showCustomDialog
    };
})();

// Expose for inline onclick
window.UIRenderer = UIRenderer;
window.Language = Language;
window.Currency = Currency;