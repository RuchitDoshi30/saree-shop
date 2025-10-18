// ===============================
// Virtual Saree Draping Simulator
// Advanced JavaScript Logic
// ===============================

class VirtualDrapingSystem {
    constructor() {
        this.currentSaree = null;
        this.isCustomPhoto = false;
        this.originalModelSrc = '../assets/images/model.svg';
        this.sareeOverlays = {
            saree1: '../assets/images/saree1-overlay.svg',
            saree2: '../assets/images/saree2-overlay.svg', 
            saree3: '../assets/uploads/saree3.jpeg',
            saree4: '../assets/uploads/saree4.jpeg',
            saree5: '../assets/uploads/product-1.webp'
        };
        
        this.init();
    }

    init() {
        console.log('🎭 Virtual Draping System Initializing...');
        this.bindEvents();
        this.createFallbackImages();
        console.log('✅ Virtual Draping System Ready');
    }

    bindEvents() {
        // Saree dropdown selection
        const sareeSelect = document.getElementById('saree-select');
        if (sareeSelect) {
            sareeSelect.addEventListener('change', (e) => {
                this.selectSaree(e.target.value);
            });
        }

        // Thumbnail clicks
        document.querySelectorAll('.thumbnail-item').forEach(item => {
            item.addEventListener('click', () => {
                const sareeId = item.dataset.saree;
                this.selectSaree(sareeId);
                this.updateDropdown(sareeId);
                this.updateThumbnailSelection(item);
            });
        });

        // Photo upload
        const photoUpload = document.getElementById('photo-upload');
        if (photoUpload) {
            photoUpload.addEventListener('change', (e) => {
                this.handlePhotoUpload(e);
            });
        }

        // Control buttons
        const changeSareeBtn = document.getElementById('change-saree-btn');
        const resetModelBtn = document.getElementById('reset-model-btn');
        const downloadBtn = document.getElementById('download-btn');

        if (changeSareeBtn) {
            changeSareeBtn.addEventListener('click', () => {
                this.changeSaree();
            });
        }

        if (resetModelBtn) {
            resetModelBtn.addEventListener('click', () => {
                this.resetToModel();
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadPreview();
            });
        }

        // Modal close
        const modalClose = document.getElementById('modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    selectSaree(sareeId) {
        if (!sareeId) {
            this.clearSaree();
            return;
        }

        console.log(`👗 Selecting saree: ${sareeId}`);
        this.currentSaree = sareeId;
        this.showLoading();
        
        // Simulate loading time for better UX
        setTimeout(() => {
            this.applySareeOverlay(sareeId);
            this.hideLoading();
        }, 800);
    }

    applySareeOverlay(sareeId) {
        const overlay = document.getElementById('saree-overlay');
        if (!overlay) return;

        // For demo purposes, we'll use a mix of SVG overlays and existing images
        const overlayImages = {
            saree1: '../assets/images/saree1-overlay.svg',
            saree2: '../assets/images/saree2-overlay.svg',
            saree3: '../assets/uploads/saree3.jpeg',
            saree4: '../assets/uploads/saree4.jpeg',
            saree5: '../assets/uploads/product-1.webp'
        };

        const overlayImage = overlayImages[sareeId];
        if (overlayImage) {
            overlay.src = overlayImage;
            overlay.style.display = 'block';
            overlay.style.opacity = '0.7';
            overlay.style.mixBlendMode = 'multiply';
            
            // Add fade-in animation
            overlay.style.animation = 'fadeIn 0.5s ease-in-out';
            
            console.log(`✅ Applied saree overlay: ${sareeId}`);
        }
    }

    clearSaree() {
        const overlay = document.getElementById('saree-overlay');
        if (overlay) {
            overlay.style.display = 'none';
            overlay.src = '';
        }
        this.currentSaree = null;
        this.clearThumbnailSelection();
        console.log('🧹 Cleared saree selection');
    }

    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Please select an image smaller than 5MB.');
            return;
        }

        console.log('📷 Processing uploaded photo...');
        this.showLoading();

        const reader = new FileReader();
        reader.onload = (e) => {
            setTimeout(() => {
                this.setModelImage(e.target.result);
                this.isCustomPhoto = true;
                this.hideLoading();
                console.log('✅ Photo uploaded successfully');
            }, 1000);
        };
        
        reader.onerror = () => {
            this.hideLoading();
            alert('Error reading the image file. Please try again.');
        };

        reader.readAsDataURL(file);
    }

    setModelImage(imageSrc) {
        const modelImage = document.getElementById('model-image');
        if (modelImage) {
            modelImage.src = imageSrc;
            modelImage.style.animation = 'fadeIn 0.5s ease-in-out';
        }
    }

    resetToModel() {
        console.log('🔄 Resetting to default model...');
        this.showLoading();
        
        setTimeout(() => {
            this.setModelImage(this.originalModelSrc);
            this.isCustomPhoto = false;
            this.hideLoading();
            
            // Clear file input
            const photoUpload = document.getElementById('photo-upload');
            if (photoUpload) {
                photoUpload.value = '';
            }
            
            console.log('✅ Reset to default model');
        }, 500);
    }

    changeSaree() {
        console.log('🔄 Opening saree selection...');
        // Scroll to saree selection area
        const sareePanel = document.querySelector('.saree-selection-panel');
        if (sareePanel) {
            sareePanel.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            // Highlight the panel briefly
            sareePanel.style.boxShadow = '0 0 20px rgba(212, 165, 165, 0.5)';
            setTimeout(() => {
                sareePanel.style.boxShadow = '0 8px 30px var(--drape-shadow)';
            }, 2000);
        }
    }

    async downloadPreview() {
        console.log('⬇️ Starting download...');
        
        // Check if html2canvas is available
        if (typeof html2canvas === 'undefined') {
            alert('Download feature is not available. Please check your internet connection.');
            return;
        }

        this.showLoading();

        try {
            const previewContainer = document.getElementById('preview-container');
            if (!previewContainer) {
                throw new Error('Preview container not found');
            }

            // Generate canvas from preview
            const canvas = await html2canvas(previewContainer, {
                backgroundColor: '#ffffff',
                scale: 2, // Higher quality
                useCORS: true,
                allowTaint: true,
                logging: false
            });

            // Create download link
            const link = document.createElement('a');
            link.download = `apsara-saree-preview-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.hideLoading();
            this.showSuccessModal();
            
            console.log('✅ Download completed successfully');
            
        } catch (error) {
            console.error('❌ Download failed:', error);
            this.hideLoading();
            alert('Download failed. Please try again.');
        }
    }

    updateDropdown(sareeId) {
        const sareeSelect = document.getElementById('saree-select');
        if (sareeSelect) {
            sareeSelect.value = sareeId;
        }
    }

    updateThumbnailSelection(selectedItem) {
        // Clear all selections
        document.querySelectorAll('.thumbnail-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add selection to clicked item
        selectedItem.classList.add('active');
    }

    clearThumbnailSelection() {
        document.querySelectorAll('.thumbnail-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const sareeSelect = document.getElementById('saree-select');
        if (sareeSelect) {
            sareeSelect.value = '';
        }
    }

    showLoading() {
        const loading = document.getElementById('loading-indicator');
        if (loading) {
            loading.style.display = 'flex';
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading-indicator');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    showSuccessModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.style.display = 'flex';
            modal.style.animation = 'fadeIn 0.3s ease-in-out';
        }
    }

    closeModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    createFallbackImages() {
        // Create a simple fallback model image if the main one fails to load
        const modelImage = document.getElementById('model-image');
        if (modelImage) {
            modelImage.onerror = () => {
                console.warn('⚠️ Model image failed to load, using fallback');
                this.createFallbackModelImage();
            };
        }
    }

    createFallbackModelImage() {
        const modelImage = document.getElementById('model-image');
        if (!modelImage) return;

        // Create a canvas with a simple silhouette
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 450;
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Simple human silhouette
        ctx.fillStyle = '#d0d0d0';
        ctx.beginPath();
        
        // Head
        ctx.arc(150, 80, 30, 0, Math.PI * 2);
        
        // Body
        ctx.rect(120, 110, 60, 120);
        
        // Arms
        ctx.rect(90, 120, 25, 80);
        ctx.rect(185, 120, 25, 80);
        
        // Legs
        ctx.rect(130, 230, 20, 100);
        ctx.rect(150, 230, 20, 100);
        
        ctx.fill();
        
        // Add text
        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Model Placeholder', 150, 380);
        ctx.fillText('Upload your photo', 150, 400);
        ctx.fillText('for better results', 150, 420);
        
        modelImage.src = canvas.toDataURL();
    }

    // Public API methods
    getCurrentSaree() {
        return this.currentSaree;
    }

    isUsingCustomPhoto() {
        return this.isCustomPhoto;
    }

    getSareeInfo(sareeId) {
        const sareeDetails = {
            saree1: { name: 'Elegant Red Silk Saree', color: 'Red', fabric: 'Silk' },
            saree2: { name: 'Royal Blue Banarasi', color: 'Blue', fabric: 'Banarasi' },
            saree3: { name: 'Golden Georgette Saree', color: 'Golden', fabric: 'Georgette' },
            saree4: { name: 'Pink Embroidered Saree', color: 'Pink', fabric: 'Embroidered' },
            saree5: { name: 'Green Traditional Saree', color: 'Green', fabric: 'Traditional' }
        };
        
        return sareeDetails[sareeId] || null;
    }
}

// ===============================
// Enhanced User Experience Features
// ===============================

class DrapingEnhancements {
    constructor(drapingSystem) {
        this.drapingSystem = drapingSystem;
        this.init();
    }

    init() {
        this.addKeyboardShortcuts();
        this.addTooltips();
        this.addProgressIndicators();
        this.addAccessibilityFeatures();
    }

    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only trigger shortcuts when not typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

            switch(e.key) {
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                    e.preventDefault();
                    this.drapingSystem.selectSaree(`saree${e.key}`);
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    this.drapingSystem.resetToModel();
                    break;
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.drapingSystem.downloadPreview();
                    break;
            }
        });
    }

    addTooltips() {
        // Add helpful tooltips to important elements
        const elements = [
            { selector: '#photo-upload', text: 'Upload a full-body photo for the best virtual draping experience' },
            { selector: '#download-btn', text: 'Download your virtual draping preview as an image' },
            { selector: '#reset-model-btn', text: 'Return to the default model image' },
            { selector: '.thumbnail-item', text: 'Click to quickly select this saree style' }
        ];

        elements.forEach(({ selector, text }) => {
            const element = document.querySelector(selector);
            if (element) {
                element.title = text;
                element.setAttribute('aria-label', text);
            }
        });
    }

    addProgressIndicators() {
        // Add visual feedback for long operations
        const originalShowLoading = this.drapingSystem.showLoading.bind(this.drapingSystem);
        const originalHideLoading = this.drapingSystem.hideLoading.bind(this.drapingSystem);

        this.drapingSystem.showLoading = () => {
            originalShowLoading();
            this.showProgressBar();
        };

        this.drapingSystem.hideLoading = () => {
            originalHideLoading();
            this.hideProgressBar();
        };
    }

    showProgressBar() {
        const existing = document.querySelector('.progress-bar');
        if (existing) return;

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
            <div class="progress-fill"></div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .progress-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: rgba(212, 165, 165, 0.2);
                z-index: 9999;
            }
            .progress-fill {
                height: 100%;
                background: var(--drape-primary);
                width: 0%;
                animation: progressLoad 2s ease-in-out forwards;
            }
            @keyframes progressLoad {
                0% { width: 0%; }
                50% { width: 70%; }
                100% { width: 100%; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(progressBar);
    }

    hideProgressBar() {
        setTimeout(() => {
            const progressBar = document.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.remove();
            }
        }, 300);
    }

    addAccessibilityFeatures() {
        // Add ARIA labels and roles
        const previewContainer = document.getElementById('preview-container');
        if (previewContainer) {
            previewContainer.setAttribute('role', 'img');
            previewContainer.setAttribute('aria-label', 'Virtual saree draping preview');
        }

        // Add screen reader announcements
        this.addScreenReaderAnnouncements();
    }

    addScreenReaderAnnouncements() {
        const announcer = document.createElement('div');
        announcer.id = 'sr-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(announcer);

        // Override selectSaree to announce changes
        const originalSelectSaree = this.drapingSystem.selectSaree.bind(this.drapingSystem);
        this.drapingSystem.selectSaree = (sareeId) => {
            originalSelectSaree(sareeId);
            if (sareeId) {
                const sareeInfo = this.drapingSystem.getSareeInfo(sareeId);
                if (sareeInfo) {
                    announcer.textContent = `Selected ${sareeInfo.name}`;
                }
            }
        };
    }
}

// ===============================
// Initialize System
// ===============================

// Wait for DOM and ensure page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎭 Initializing Virtual Saree Draping System...');
    
    // Small delay to ensure all other scripts are loaded
    setTimeout(() => {
        try {
            window.virtualDraping = new VirtualDrapingSystem();
            window.drapingEnhancements = new DrapingEnhancements(window.virtualDraping);
            
            console.log('✅ Virtual Saree Draping System Fully Loaded');
            
            // Announce to screen readers
            const announcer = document.getElementById('sr-announcer');
            if (announcer) {
                announcer.textContent = 'Virtual saree draping system is ready. You can now select sarees and upload photos.';
            }
            
        } catch (error) {
            console.error('❌ Failed to initialize Virtual Draping System:', error);
        }
    }, 100);
});

// ===============================
// Global Utility Functions
// ===============================

// Expose some functions globally for HTML onclick handlers if needed
window.selectSaree = (sareeId) => {
    if (window.virtualDraping) {
        window.virtualDraping.selectSaree(sareeId);
    }
};

window.downloadPreview = () => {
    if (window.virtualDraping) {
        window.virtualDraping.downloadPreview();
    }
};

window.resetToModel = () => {
    if (window.virtualDraping) {
        window.virtualDraping.resetToModel();
    }
};

// Handle page visibility changes to pause/resume animations
document.addEventListener('visibilitychange', () => {
    const isHidden = document.hidden;
    const animations = document.querySelectorAll('[style*="animation"]');
    
    animations.forEach(element => {
        if (isHidden) {
            element.style.animationPlayState = 'paused';
        } else {
            element.style.animationPlayState = 'running';
        }
    });
});

// Add performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`🚀 Virtual Draping Page Load Time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
        }, 0);
    });
}

// Initialize Virtual Draping System when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎭 Initializing Virtual Draping System...');
    const drapingSystem = new VirtualDrapingSystem();
    
    // Make it globally accessible for debugging
    window.drapingSystem = drapingSystem;
});

console.log('🎭 Virtual Saree Draping Script Loaded Successfully!');
