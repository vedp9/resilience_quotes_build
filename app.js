document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Splash Screen Logic (Placed at top for guaranteed execution)
    const splashScreen = document.getElementById('splashScreen');
    const splashBox = document.getElementById('splashBox');
    
    if (splashScreen && splashBox) {
        let splashDismissed = false;
        
        const hideSplash = () => {
            if (splashDismissed) return;
            splashDismissed = true;
            splashScreen.style.pointerEvents = 'none';
            splashScreen.classList.add('opacity-0');
            splashBox.classList.remove('scale-100');
            splashBox.classList.add('scale-110');
            setTimeout(() => {
                splashScreen.classList.add('hidden');
            }, 600);
        };

        // Safety click/tap listener to dismiss immediately
        splashScreen.addEventListener('click', hideSplash);
        splashScreen.addEventListener('touchstart', hideSplash, { passive: true });

        // Solid 2.2 second delay on every load
        setTimeout(() => {
            if (!splashScreen.classList.contains('hidden')) {
                hideSplash();
            }
        }, 2200);
    }

    // DOM Elements
    const quotesContainer = document.getElementById('quotesContainer');
    const categoryFilters = document.getElementById('categoryFilters');
    const bookmarkCountEl = document.getElementById('bookmarkCount');
    const bookmarksModal = document.getElementById('bookmarksModal');
    const openBookmarksBtn = document.getElementById('openBookmarksBtn');
    const closeBookmarksBtn = document.getElementById('closeBookmarksBtn');
    const bookmarksList = document.getElementById('bookmarksList');
    const navLeftBtn = document.getElementById('navLeftBtn');
    const navRightBtn = document.getElementById('navRightBtn');
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
    let currentCardIndex = 0;

    // Generate Dynamic Categories
    const renderCategoryPills = () => {
        if (!categoryFilters) return;
        
        // Extract unique categories from all quotes
        const categories = ["All", ...new Set(getAllQuotes().map(q => q.category))];
        
        categoryFilters.innerHTML = categories.map(cat => {
            const isActive = cat === currentCategory ? 'active' : '';
            return `<button type="button" class="category-pill ${isActive}" data-category="${cat}">${cat}</button>`;
        }).join('');
        
        // Attach click listeners to new pills
        categoryFilters.querySelectorAll('.category-pill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                categoryFilters.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                currentCategory = e.currentTarget.dataset.category;
                
                const updateFeed = () => {
                    currentCardIndex = 0;
                    if (currentCategory === 'All') {
                        filteredQuotes = [...getAllQuotes()];
                    } else {
                        filteredQuotes = getAllQuotes().filter(q => 
                            q.category === currentCategory || 
                            (currentCategory.toUpperCase() === 'RESILIENCE' && q.category === 'Mental Toughness') ||
                            (currentCategory.toUpperCase() === 'MENTAL TOUGHNESS' && q.category.toUpperCase() === 'RESILIENCE')
                        );
                    }
                    renderQuotes();
                    if (window.innerWidth >= 1025) quotesContainer.scrollTop = 0;
                };

                updateFeed();
            });
        });
    };

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
        
        filteredQuotes.forEach((quoteObj, index) => {
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
                        <div class="flex flex-col gap-1 items-start">
                            <span class="text-[11px] font-bold tracking-wider uppercase text-white/50">${quoteObj.category}</span>
                            ${isCustomBadge}
                        </div>
                        <div class="text-[10px] font-bold text-white/30 tracking-widest uppercase">
                            ${index + 1} of ${filteredQuotes.length}
                        </div>
                    </div>

                    <!-- Middle: Quote -->
                    <div class="flex-1 flex flex-col justify-center my-2">
                        <p class="card-quote-text text-lg lg:text-2xl font-semibold leading-snug text-white">"${quoteObj.quote}"</p>
                    </div>

                    <!-- Bottom: Author & Insight -->
                    <div class="flex flex-col gap-3">
                        <div>
                            <p class="text-base font-semibold text-white">${quoteObj.author}</p>
                            ${quoteObj.source ? `<p class="text-[11px] text-white/50">${quoteObj.source}</p>` : ''}
                        </div>
                        <div class="bg-white/5 border border-white/10 rounded-xl p-3 mb-2">
                            <p class="text-[10px] font-bold uppercase text-white/50 mb-1 flex items-center gap-1">
                                <i data-lucide="zap" class="w-3 h-3"></i> Today's action
                            </p>
                            <p class="text-sm text-white/90 leading-tight">${quoteObj.daily_actionable_insight}</p>
                        </div>
                    </div>
                    
                    <!-- Footer: Action Bar -->
                    <div class="flex items-center justify-end gap-2 mt-2 pt-3 border-t border-white/10 action-container transition-opacity duration-200 w-full z-20">
                        ${quoteObj.isCustom ? `
                        <button class="delete-quote-btn p-3 rounded-full bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]" data-id="${quoteObj.id}" title="Delete Quote" aria-label="Delete Quote">
                            <i data-lucide="trash-2" class="w-5 h-5" aria-hidden="true"></i>
                        </button>
                        ` : ''}
                        <button class="download-quote-btn p-3 rounded-full bg-white/5 hover:bg-white/20 text-white/50 hover:text-white transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]" data-id="${quoteObj.id}" title="Download as Image" aria-label="Download as Image">
                            <i data-lucide="download" class="w-5 h-5" aria-hidden="true"></i>
                        </button>
                        <button class="bookmark-toggle-btn p-3 rounded-full bg-white/5 hover:bg-white/20 transition-colors flex items-center justify-center min-h-[44px] px-4" data-id="${quoteObj.id}" title="Save Quote" aria-label="${isBookmarked ? 'Remove saved quote' : 'Save quote'}">
                            <i data-lucide="heart" class="w-5 h-5 transition-colors ${isBookmarked ? 'text-red-500 fill-current' : 'text-white/50 hover:text-white'} bookmark-indicator" aria-hidden="true"></i>
                            <span class="bookmark-text text-[11px] font-bold ml-2 ${isBookmarked ? 'text-red-500' : 'hidden'}">Saved</span>
                        </button>
                    </div>

                    <!-- Heart Animation Container -->
                    <div class="heart-anim-container">
                        <i data-lucide="heart" class="w-24 h-24 text-red-500 fill-current drop-shadow-2xl"></i>
                    </div>
                </div>
            `;
            
            quotesContainer.appendChild(cardWrapper);
        });

        // Update visibility for mobile stack
        if (window.innerWidth < 1024) {
            updateCardVisibility();
        }

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
                    wrapper.style.transition = 'opacity 0.3s ease, transform 0.3s ease, width 0.3s ease, margin 0.3s ease, padding 0.3s ease';
                    wrapper.style.opacity = '0';
                    wrapper.style.transform = 'scale(0.9)';
                    
                    if (window.innerWidth < 1024) {
                        wrapper.style.minWidth = '0';
                        wrapper.style.width = '0';
                        wrapper.style.flex = '0';
                        wrapper.style.height = '0';
                        wrapper.style.margin = '0';
                        wrapper.style.padding = '0';
                    }
                    setTimeout(() => {
                        wrapper.remove();
                        renderCategoryPills(); // Real-time category sync on delete
                        updateNavArrowsVisibility();
                    }, 300);
                }
            });
        });

        document.querySelectorAll('.bookmark-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(e.currentTarget.dataset.id);
                const wrapper = document.querySelector(`.quote-card-wrapper[data-id="${id}"]`);
                const card = wrapper.querySelector('.quote-card');
                if (card) toggleBookmark(id, card);
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
        const indicator = cardElement.querySelector('.bookmark-indicator');
        const textIndicator = cardElement.querySelector('.bookmark-text');

        if (index === -1) {
            // Add
            bookmarkedIds.push(id);
            // Play animation
            if (animContainer) {
                animContainer.classList.remove('animate');
                void animContainer.offsetWidth; // trigger reflow
                animContainer.classList.add('animate');
            }
            // Update button indicator
            if (indicator) {
                indicator.classList.remove('text-white/50', 'hover:text-white');
                indicator.classList.add('text-red-500', 'fill-current');
            }
            if (textIndicator) {
                textIndicator.classList.remove('hidden');
                textIndicator.classList.add('text-red-500');
            }
        } else {
            // Remove
            bookmarkedIds.splice(index, 1);
            // Update button indicator
            if (indicator) {
                indicator.classList.remove('text-red-500', 'fill-current');
                indicator.classList.add('text-white/50', 'hover:text-white');
            }
            if (textIndicator) {
                textIndicator.classList.add('hidden');
                textIndicator.classList.remove('text-red-500');
            }
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

        // Real-time category sync on add
        renderCategoryPills();

        // Re-render if it matches current category
        if (currentCategory === 'All' || currentCategory === newQuote.category) {
            filteredQuotes = currentCategory === 'All' ? [...getAllQuotes()] : getAllQuotes().filter(q => q.category === currentCategory);
            renderQuotes();
        }
    });

    // Vertical Mobile Scrolling Arrows
    // Swipe & Touch Mechanics
    let touchStartX = 0;
    let touchStartY = 0;
    let currentTranslate = 0;
    let isDragging = false;
    let activeCard = null;
    const SWIPE_THRESHOLD = 90; // px threshold to trigger next card

    window.updateCardVisibility = () => {
        const wrappers = document.querySelectorAll('.quote-card-wrapper');
        if (!wrappers.length) return;
        
        wrappers.forEach((wrapper, index) => {
            if (window.innerWidth >= 1025) {
                // Desktop Grid Mode: Reset inline styles
                wrapper.classList.remove('active-card', 'bg-card', 'swipe-left-out', 'swipe-right-out');
                wrapper.style.transform = '';
                wrapper.style.opacity = '';
                wrapper.style.zIndex = '';
                wrapper.style.transition = '';
                return;
            }
            
            // Mobile Swipe Deck Mode
            wrapper.style.transform = ''; // clear drag transforms
            wrapper.style.transition = '';
            wrapper.style.opacity = '';
            wrapper.style.pointerEvents = '';
            wrapper.style.zIndex = '';
            wrapper.classList.remove('active-card', 'bg-card', 'swipe-left-out', 'swipe-right-out');
            
            if (index === currentCardIndex) {
                wrapper.classList.add('active-card');
                activeCard = wrapper;
            } else if (index === currentCardIndex + 1) {
                wrapper.classList.add('bg-card');
            } else if (index < currentCardIndex) {
                // Past cards are hidden
                wrapper.style.opacity = '0';
                wrapper.style.pointerEvents = 'none';
            } else {
                // Future cards deeper in stack are hidden
                wrapper.style.opacity = '0';
                wrapper.style.pointerEvents = 'none';
            }
        });
        
        updateNavArrowsVisibility();
    };

    const updateNavArrowsVisibility = () => {
        if (window.innerWidth >= 1025) {
            if(navArrowsContainer) navArrowsContainer.style.display = 'none';
            return;
        }
        if(navArrowsContainer) navArrowsContainer.style.display = 'flex';
        
        // Stack loops infinitely, always enable arrows
        if (navLeftBtn) {
            navLeftBtn.style.opacity = '1';
            navLeftBtn.style.pointerEvents = 'auto';
        }
        if (navRightBtn) {
            navRightBtn.style.opacity = '1';
            navRightBtn.style.pointerEvents = 'auto';
        }
    };

    quotesContainer.addEventListener('touchstart', (e) => {
        if (window.innerWidth >= 1025 || !activeCard) return;
        
        // Prevent drag on interactive buttons (delete, download, bookmark)
        if (e.target.closest('button')) return;

        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isDragging = true;
        
        // Remove transitions so card follows finger instantly
        activeCard.style.transition = 'none';
    }, { passive: true });

    quotesContainer.addEventListener('touchmove', (e) => {
        if (!isDragging || window.innerWidth >= 1025 || !activeCard) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        
        const diffX = currentX - touchStartX;
        const diffY = currentY - touchStartY;
        
        // Ignore mostly vertical scrolls
        if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 20) {
            return;
        }
        
        currentTranslate = diffX;
        const rotation = diffX * 0.05; // Gentle tilt rotation
        
        activeCard.style.transform = `scale(1) translateX(${diffX}px) rotate(${rotation}deg)`;
    }, { passive: true });

    quotesContainer.addEventListener('touchend', (e) => {
        if (!isDragging || window.innerWidth >= 1025 || !activeCard) return;
        isDragging = false;
        
        // Restore transition for snap physics
        activeCard.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease';
        
        if (currentTranslate > SWIPE_THRESHOLD) {
            swipeRight(); // Swipe right -> Previous Card
        } else if (currentTranslate < -SWIPE_THRESHOLD) {
            swipeLeft();  // Swipe left -> Next Card
        } else {
            // Not enough force, snap back to center
            activeCard.style.transform = `scale(1) translateX(0) rotate(0deg)`;
        }
        
        currentTranslate = 0;
    });

    const swipeLeft = () => {
        if (!activeCard) return;
        
        activeCard.classList.add('swipe-left-out');
        activeCard.classList.remove('active-card');
        
        currentCardIndex++;
        if (currentCardIndex >= filteredQuotes.length) {
            currentCardIndex = 0; // Infinite Loop
        }
        
        setTimeout(updateCardVisibility, 50);
    };

    const swipeRight = () => {
        if (!activeCard) return;
        
        activeCard.classList.add('swipe-right-out');
        activeCard.classList.remove('active-card');
        
        currentCardIndex--;
        if (currentCardIndex < 0) {
            currentCardIndex = filteredQuotes.length - 1; // Infinite Loop
        }
        
        setTimeout(updateCardVisibility, 50);
    };

    // Button controls
    if (navLeftBtn) navLeftBtn.addEventListener('click', swipeRight);
    if (navRightBtn) navRightBtn.addEventListener('click', swipeLeft);

    window.addEventListener('resize', () => {
        updateCardVisibility();
    });

    // Keyboard Accessibility (Left/Right arrows)
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if (e.key === 'ArrowLeft') {
            if (window.innerWidth < 1025) {
                swipeRight(); // Previous card
            } else {
                quotesContainer.scrollBy({ top: -400, behavior: 'smooth' });
            }
        } else if (e.key === 'ArrowRight') {
            if (window.innerWidth < 1025) {
                swipeLeft(); // Next card
            } else {
                quotesContainer.scrollBy({ top: 400, behavior: 'smooth' });
            }
        }
    });

    // Initialize
    updateBookmarkCount();
    renderCategoryPills();
    renderQuotes();
    
    // Initial check for arrow visibility
    setTimeout(updateNavArrowsVisibility, 100);
});
