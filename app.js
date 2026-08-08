document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // DOM Elements
    const quotesContainer = document.getElementById('quotesContainer');
    const categoryFilters = document.getElementById('categoryFilters');
    const bookmarkCountEl = document.getElementById('bookmarkCount');
    const bookmarksModal = document.getElementById('bookmarksModal');
    const openBookmarksBtn = document.getElementById('openBookmarksBtn');
    const closeBookmarksBtn = document.getElementById('closeBookmarksBtn');
    const bookmarksList = document.getElementById('bookmarksList');
    const navUpBtn = document.getElementById('navUpBtn');
    const navDownBtn = document.getElementById('navDownBtn');
    const navArrowsContainer = document.getElementById('navArrowsContainer');

    // Add Quote Elements
    const openAddQuoteBtn = document.getElementById('openAddQuoteBtn');
    const closeAddQuoteBtn = document.getElementById('closeAddQuoteBtn');
    const addQuoteModal = document.getElementById('addQuoteModal');
    const cancelAddQuoteBtn = document.getElementById('cancelAddQuoteBtn');
    const addQuoteForm = document.getElementById('addQuoteForm');

    // State
    let bookmarkedIds = JSON.parse(localStorage.getItem('resilience_bookmarks')) || [];
    let customQuotes = JSON.parse(localStorage.getItem('resilience_customQuotes')) || [];
    const getAllQuotes = () => [...customQuotes, ...quotesData];
    let currentCategory = 'All';
    let filteredQuotes = [...getAllQuotes()];

    // Helper: Determine glow class
    const getGlowClass = (category) => {
        switch (category) {
            case 'Mental Toughness': return 'glow-mental';
            case 'Compounding & Growth': return 'glow-growth';
            case 'Precision Communication': return 'glow-comm';
            case 'Lateral Thinking': return 'glow-lateral';
            default: return '';
        }
    };

    // Render Cards
    const renderQuotes = () => {
        quotesContainer.innerHTML = '';
        
        filteredQuotes.forEach(quoteObj => {
            const isBookmarked = bookmarkedIds.includes(quoteObj.id);
            const glowClass = getGlowClass(quoteObj.category);
            const isCustomBadge = quoteObj.isCustom ? `<span class="bg-white/10 text-white px-2 py-0.5 mt-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 w-max"><i data-lucide="sparkles" class="w-3 h-3 text-yellow-400"></i> Personalized</span>` : '';
            
            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'quote-card-wrapper';
            cardWrapper.dataset.id = quoteObj.id;

            cardWrapper.innerHTML = `
                <div class="quote-card ${glowClass} relative group" data-id="${quoteObj.id}">
                    
                    <!-- Top Bar -->
                    <div class="flex justify-between items-start w-full relative z-20">
                        <!-- Category & Source -->
                        <div class="flex flex-col gap-1 items-start">
                            <span class="text-xs font-bold tracking-wider uppercase text-white/50">${quoteObj.category}</span>
                            ${isCustomBadge}
                        </div>
                        
                        <!-- Actions -->
                        <div class="flex items-center gap-2 action-container transition-opacity duration-200">
                            ${quoteObj.isCustom ? `
                            <button class="delete-quote-btn p-1.5 rounded-full bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors" data-id="${quoteObj.id}" title="Delete Quote">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                            ` : ''}
                            <button class="download-quote-btn p-1.5 rounded-full bg-white/5 hover:bg-white/20 text-white/50 hover:text-white transition-colors" data-id="${quoteObj.id}" title="Download as Image">
                                <i data-lucide="download" class="w-4 h-4"></i>
                            </button>
                            <!-- Bookmark Indicator -->
                            <div class="transition-opacity duration-300 ml-1 ${isBookmarked ? 'opacity-100' : 'opacity-0'}">
                                <i data-lucide="heart" class="w-5 h-5 text-red-500 fill-current bookmark-indicator"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Main Quote -->
                    <div class="flex-1 flex flex-col justify-center my-6">
                        <p class="card-quote-text text-white">"${quoteObj.quote}"</p>
                    </div>

                    <!-- Author & Insight -->
                    <div class="flex flex-col gap-4">
                        <div>
                            <p class="text-lg font-semibold text-white">${quoteObj.author}</p>
                            ${quoteObj.source ? `<p class="text-sm text-white/50">${quoteObj.source}</p>` : ''}
                        </div>
                        <div class="bg-white/5 p-4 rounded-xl border border-white/10">
                            <p class="text-xs font-bold uppercase text-white/50 mb-1 flex items-center gap-1">
                                <i data-lucide="zap" class="w-3 h-3"></i> Daily Action
                            </p>
                            <p class="text-sm text-white/90 leading-relaxed">${quoteObj.daily_actionable_insight}</p>
                        </div>
                    </div>

                    <!-- Heart Animation Container -->
                    <div class="heart-anim-container">
                        <i data-lucide="heart" class="w-24 h-24 text-red-500 fill-current drop-shadow-2xl"></i>
                    </div>
                </div>
            `;
            
            quotesContainer.appendChild(cardWrapper);
        });

        // Re-init newly added icons
        lucide.createIcons();
        attachDoubleTapListeners();
        attachCardActionListeners();
        updateNavArrowsVisibility();
    };

    // Card Action Logic (Delete & Download)
    const attachCardActionListeners = () => {
        document.querySelectorAll('.delete-quote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                const id = parseInt(e.currentTarget.dataset.id);
                
                // Remove from customQuotes
                customQuotes = customQuotes.filter(q => q.id !== id);
                localStorage.setItem('resilience_customQuotes', JSON.stringify(customQuotes));
                
                // If bookmarked, remove from bookmarks
                const bookmarkIndex = bookmarkedIds.indexOf(id);
                if (bookmarkIndex > -1) {
                    bookmarkedIds.splice(bookmarkIndex, 1);
                    saveBookmarks();
                }

                // Update filtered view state
                filteredQuotes = filteredQuotes.filter(q => q.id !== id);
                
                // Animate removal from DOM
                const wrapper = document.querySelector(`.quote-card-wrapper[data-id="${id}"]`);
                if (wrapper) {
                    wrapper.style.transition = 'opacity 0.3s ease, transform 0.3s ease, height 0.3s ease, margin 0.3s ease, padding 0.3s ease';
                    wrapper.style.opacity = '0';
                    wrapper.style.transform = 'scale(0.9)';
                    
                    if (window.innerWidth < 1024) {
                        wrapper.style.height = '0';
                        wrapper.style.margin = '0';
                        wrapper.style.padding = '0';
                    }
                    setTimeout(() => {
                        wrapper.remove();
                        updateNavArrowsVisibility();
                    }, 300);
                }
            });
        });

        document.querySelectorAll('.download-quote-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                const wrapper = document.querySelector(`.quote-card-wrapper[data-id="${id}"]`);
                const card = wrapper.querySelector('.quote-card');
                
                if (!card) return;

                // Temporarily make action container transparent to keep it out of the photo without layout shift
                const actionContainer = card.querySelector('.action-container');
                if (actionContainer) actionContainer.style.opacity = '0';

                // Small delay to ensure rendering catches up
                await new Promise(r => setTimeout(r, 50));

                try {
                    const canvas = await html2canvas(card, {
                        scale: 2,
                        backgroundColor: '#161618',
                        useCORS: true
                    });
                    
                    const dataUrl = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.download = `quote-${id}.png`;
                    link.href = dataUrl;
                    link.click();
                } catch (err) {
                    console.error("Error downloading image: ", err);
                } finally {
                    if (actionContainer) actionContainer.style.opacity = '1';
                }
            });
        });
    };

    // Double Tap Logic
    const attachDoubleTapListeners = () => {
        const cards = document.querySelectorAll('.quote-card');
        
        cards.forEach(card => {
            let lastTap = 0;
            const doubleTapDelay = 300;

            const handleTap = (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                
                if (tapLength < doubleTapDelay && tapLength > 0) {
                    // Double tap detected
                    e.preventDefault();
                    toggleBookmark(parseInt(card.dataset.id), card);
                }
                lastTap = currentTime;
            };

            card.addEventListener('click', handleTap);
            // Touchend handles iOS safely
            card.addEventListener('touchend', (e) => {
                // Ignore if swiping
                if (e.changedTouches.length > 0) {
                    handleTap(e);
                }
            });
        });
    };

    const toggleBookmark = (id, cardElement) => {
        const index = bookmarkedIds.indexOf(id);
        const animContainer = cardElement.querySelector('.heart-anim-container');
        const indicator = cardElement.querySelector('.bookmark-indicator').parentElement;

        if (index === -1) {
            // Add
            bookmarkedIds.push(id);
            // Play animation
            animContainer.classList.remove('animate');
            void animContainer.offsetWidth; // trigger reflow
            animContainer.classList.add('animate');
            // Show indicator
            indicator.classList.remove('opacity-0');
            indicator.classList.add('opacity-100');
        } else {
            // Remove
            bookmarkedIds.splice(index, 1);
            // Hide indicator
            indicator.classList.remove('opacity-100');
            indicator.classList.add('opacity-0');
        }

        saveBookmarks();
    };

    const saveBookmarks = () => {
        localStorage.setItem('resilience_bookmarks', JSON.stringify(bookmarkedIds));
        updateBookmarkCount();
        renderBookmarksModal();
    };

    const updateBookmarkCount = () => {
        bookmarkCountEl.textContent = bookmarkedIds.length;
    };

    // Category Filtering
    categoryFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-pill')) {
            // Update active styling
            document.querySelectorAll('.category-pill').forEach(pill => pill.classList.remove('active'));
            e.target.classList.add('active');

            currentCategory = e.target.dataset.category;
            
            if (currentCategory === 'All') {
                filteredQuotes = [...getAllQuotes()];
            } else {
                filteredQuotes = getAllQuotes().filter(q => q.category === currentCategory);
            }
            
            renderQuotes();
            // Reset scroll position
            quotesContainer.scrollTop = 0;
        }
    });

    // Bookmarks Modal Logic
    const renderBookmarksModal = () => {
        bookmarksList.innerHTML = '';
        
        if (bookmarkedIds.length === 0) {
            bookmarksList.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center text-white/50 pt-20">
                    <i data-lucide="heart-off" class="w-12 h-12 mb-4"></i>
                    <p>No saved insights yet.</p>
                    <p class="text-sm mt-2">Double-tap a card to save it.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        const bookmarkedQuotes = quotesData.filter(q => bookmarkedIds.includes(q.id));
        
        bookmarkedQuotes.forEach(q => {
            const item = document.createElement('div');
            item.className = 'bookmark-item relative group';
            item.innerHTML = `
                <button class="remove-bookmark-btn absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full transition-colors" data-id="${q.id}">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
                <div class="pr-12">
                    <span class="text-xs text-white/50 uppercase tracking-wider">${q.category}</span>
                    <p class="text-sm text-white mt-2 mb-3 leading-relaxed">"${q.quote}"</p>
                    <p class="text-xs text-white/50">${q.author}</p>
                </div>
            `;
            bookmarksList.appendChild(item);
        });

        // Add remove listeners
        document.querySelectorAll('.remove-bookmark-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                // Find card in DOM and update it if present
                const card = document.querySelector(`.quote-card[data-id="${id}"]`);
                if (card) {
                    toggleBookmark(id, card);
                } else {
                    const index = bookmarkedIds.indexOf(id);
                    if (index > -1) {
                        bookmarkedIds.splice(index, 1);
                        saveBookmarks();
                    }
                }
            });
        });

        lucide.createIcons();
    };

    openBookmarksBtn.addEventListener('click', () => {
        renderBookmarksModal();
        bookmarksModal.classList.remove('hidden');
        // Small delay to allow display:block to apply before changing opacity
        setTimeout(() => {
            bookmarksModal.classList.remove('opacity-0');
            bookmarksModal.classList.add('opacity-100');
        }, 10);
    });

    closeBookmarksBtn.addEventListener('click', () => {
        bookmarksModal.classList.remove('opacity-100');
        bookmarksModal.classList.add('opacity-0');
        setTimeout(() => {
            bookmarksModal.classList.add('hidden');
        }, 300); // matches duration-300
    });

    // Add Quote Modal Logic
    const closeAddQuoteModal = () => {
        addQuoteModal.classList.remove('opacity-100');
        addQuoteModal.classList.add('opacity-0');
        setTimeout(() => {
            addQuoteModal.classList.add('hidden');
        }, 300);
    };

    openAddQuoteBtn.addEventListener('click', () => {
        addQuoteModal.classList.remove('hidden');
        setTimeout(() => {
            addQuoteModal.classList.remove('opacity-0');
            addQuoteModal.classList.add('opacity-100');
        }, 10);
    });

    closeAddQuoteBtn.addEventListener('click', closeAddQuoteModal);
    cancelAddQuoteBtn.addEventListener('click', closeAddQuoteModal);

    addQuoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newQuote = {
            id: Date.now(), // Generate unique ID
            isCustom: true,
            quote: document.getElementById('customQuoteText').value.trim(),
            author: document.getElementById('customQuoteAuthor').value.trim(),
            category: document.getElementById('customQuoteCategory').value,
            daily_actionable_insight: document.getElementById('customQuoteInsight').value.trim() || 'Keep pushing forward.'
        };

        // Prepend to custom quotes array and save to local storage
        customQuotes.unshift(newQuote);
        localStorage.setItem('resilience_customQuotes', JSON.stringify(customQuotes));
        
        // Reset form and close modal
        addQuoteForm.reset();
        closeAddQuoteModal();

        // Re-render if it matches current category
        if (currentCategory === 'All' || currentCategory === newQuote.category) {
            filteredQuotes = currentCategory === 'All' ? [...getAllQuotes()] : getAllQuotes().filter(q => q.category === currentCategory);
            renderQuotes();
        }
    });

    // Mobile Scrolling Arrows
    const updateNavArrowsVisibility = () => {
        if (window.innerWidth >= 1024) {
            navArrowsContainer.style.display = 'none';
            return;
        }
        navArrowsContainer.style.display = 'flex';
        
        // Hide Up if at top
        if (quotesContainer.scrollTop <= 10) {
            navUpBtn.style.opacity = '0.3';
            navUpBtn.style.pointerEvents = 'none';
        } else {
            navUpBtn.style.opacity = '1';
            navUpBtn.style.pointerEvents = 'auto';
        }

        // Hide down if at bottom
        const maxScroll = quotesContainer.scrollHeight - quotesContainer.clientHeight;
        if (quotesContainer.scrollTop >= maxScroll - 10) {
            navDownBtn.style.opacity = '0.3';
            navDownBtn.style.pointerEvents = 'none';
        } else {
            navDownBtn.style.opacity = '1';
            navDownBtn.style.pointerEvents = 'auto';
        }
    };

    quotesContainer.addEventListener('scroll', () => {
        // Simple requestAnimationFrame for scroll logic
        requestAnimationFrame(updateNavArrowsVisibility);
    });

    window.addEventListener('resize', updateNavArrowsVisibility);

    const scrollCard = (direction) => {
        const containerHeight = quotesContainer.clientHeight;
        const currentScroll = quotesContainer.scrollTop;
        
        if (direction === 'down') {
            quotesContainer.scrollBy({
                top: containerHeight,
                behavior: 'smooth'
            });
        } else {
            quotesContainer.scrollBy({
                top: -containerHeight,
                behavior: 'smooth'
            });
        }
    };

    navUpBtn.addEventListener('click', () => scrollCard('up'));
    navDownBtn.addEventListener('click', () => scrollCard('down'));

    // Initialize
    updateBookmarkCount();
    renderQuotes();
    
    // Initial check for arrow visibility
    setTimeout(updateNavArrowsVisibility, 100);
});
