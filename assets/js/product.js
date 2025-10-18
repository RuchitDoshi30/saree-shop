/**
 * Product Detail Page Functionality
 * FIXED VERSION - Enhanced error handling and security
 */

class ProductDetailManager {
    constructor() {
        this.currentProduct = null;
        this.toastTimeout = null;
        this.maxRetries = 3;
        this.retryCount = 0;
        
        this.init();
    }

    init() {
        console.log('🛍️ Product Detail Manager Initializing...');
        
        // Wait for dependencies
        this.waitForDependencies()
            .then(() => {
                this.loadProductData();
                this.bindElements();
                this.bindEvents();
                this.createAccessibilityFeatures();
                this.loadReviews();
                console.log('✅ Product Detail Manager Ready');
            })
            .catch(error => {
                console.error('❌ Failed to initialize Product Manager:', error);
                this.showError('Failed to load product. Please refresh the page.');
            });
    }

    waitForDependencies() {
        return new Promise((resolve, reject) => {
            const checkDependencies = () => {
                if (typeof getUrlParameter !== 'undefined' && 
                    typeof getProductById !== 'undefined') {
                    resolve();
                } else if (this.retryCount < this.maxRetries) {
                    this.retryCount++;
                    setTimeout(checkDependencies, 100);
                } else {
                    reject(new Error('Required dependencies not loaded'));
                }
            };
            checkDependencies();
        });
    }

    loadProductData() {
        try {
            // Get product ID from URL with validation
            const productId = this.getValidProductId();
            if (!productId) {
                throw new Error('Invalid product ID');
            }

            this.currentProduct = getProductById(parseInt(productId));
            
            if (!this.currentProduct) {
                throw new Error('Product not found');
            }
            
            this.renderProduct(this.currentProduct);
        } catch (error) {
            console.error('❌ Error loading product:', error);
            this.showError('Product not found. Redirecting to collection...');
            setTimeout(() => {
                window.location.href = 'saree-collection.html';
            }, 2000);
        }
    }

    getValidProductId() {
        try {
            const id = getUrlParameter('id');
            if (!id || isNaN(id) || parseInt(id) < 1) {
                return null;
            }
            return id;
        } catch (error) {
            console.error('Error parsing product ID:', error);
            return null;
        }
    }

    renderProduct(product) {
        try {
            // Update page title with product name
            document.title = `${this.sanitizeText(product.name)} - Apsara Creations`;
            
            // Update main image with error handling
            const mainImage = document.getElementById('main-product-image');
            if (mainImage) {
                mainImage.onerror = () => {
                    mainImage.src = '../assets/uploads/placeholder.webp';
                };
                mainImage.src = product.image;
                mainImage.alt = this.sanitizeText(product.name);
            }
            
            // Update product title
            this.updateTextContent('product-title', product.name);
            
            // Update reviews count
            const reviewsElement = document.getElementById('product-reviews');
            if (reviewsElement && product.reviews) {
                reviewsElement.textContent = `(${product.reviews.length} reviews)`;
            }
            
            // Update pricing
            this.updatePricing(product);
            
            // Update description
            this.updateTextContent('product-description', product.description);
            
            // Update features
            this.updateFeatures(product);
            
            // Update color swatches if available
            this.updateColorSwatches(product);
        } catch (error) {
            console.error('❌ Error rendering product:', error);
            this.showError('Error displaying product details.');
        }
    }

    sanitizeText(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateTextContent(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = this.sanitizeText(text);
        }
    }

    updatePricing(product) {
        try {
            const priceElement = document.getElementById('product-price');
            const originalPriceElement = document.getElementById('product-original-price');
            const discountElement = document.getElementById('product-discount');
            
            if (priceElement) {
                priceElement.textContent = product.price;
            }
            
            if (product.originalPrice) {
                if (originalPriceElement) {
                    originalPriceElement.textContent = product.originalPrice;
                    originalPriceElement.style.display = 'inline';
                }
                
                if (discountElement) {
                    const discount = this.calculateDiscount(
                        product.price, 
                        product.originalPrice
                    );
                    if (discount > 0) {
                        discountElement.textContent = `${discount}% OFF`;
                        discountElement.style.display = 'inline';
                    }
                }
            } else {
                if (originalPriceElement) originalPriceElement.style.display = 'none';
                if (discountElement) discountElement.style.display = 'none';
            }
        } catch (error) {
            console.error('Error updating pricing:', error);
        }
    }

    calculateDiscount(currentPrice, originalPrice) {
        try {
            const current = parseFloat(currentPrice.replace(/[₹,]/g, ''));
            const original = parseFloat(originalPrice.replace(/[₹,]/g, ''));
            
            if (isNaN(current) || isNaN(original) || original === 0) {
                return 0;
            }
            
            return Math.round((1 - current / original) * 100);
        } catch (error) {
            console.error('Error calculating discount:', error);
            return 0;
        }
    }

    updateFeatures(product) {
        const featureMap = {
            'product-fabric': product.fabric,
            'product-work': product.work,
            'product-occasion': product.occasion,
            'product-care': product.careInstructions,
            'product-origin': product.origin,
            'product-blouse': product.blouse
        };

        Object.entries(featureMap).forEach(([id, value]) => {
            this.updateTextContent(id, value || '-');
        });
    }

    updateColorSwatches(product) {
        try {
            // Remove existing color swatches
            const existingSwatches = document.querySelector('.color-swatches');
            if (existingSwatches) {
                existingSwatches.remove();
            }

            if (!product.colors || product.colors.length === 0) {
                return;
            }

            const actionsContainer = document.querySelector('.product-actions');
            if (!actionsContainer) return;

            const swatchesContainer = document.createElement('div');
            swatchesContainer.className = 'color-swatches';
            swatchesContainer.style.marginBottom = '20px';
            
            const swatchesTitle = document.createElement('h4');
            swatchesTitle.textContent = 'Available Colors:';
            swatchesTitle.style.cssText = 'margin-bottom: 10px; font-size: 14px; color: #5a4a5a;';
            swatchesContainer.appendChild(swatchesTitle);

            const swatchesWrapper = document.createElement('div');
            swatchesWrapper.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';

            const colorMap = {
                'red': '#dc3545', 'maroon': '#8b0000', 'blue': '#007bff',
                'green': '#28a745', 'pink': '#e91e63', 'purple': '#6f42c1',
                'yellow': '#ffc107', 'white': '#ffffff', 'black': '#000000',
                'orange': '#fd7e14', 'golden': '#daa520', 'beige': '#f5f5dc',
                'brown': '#8b4513', 'cream': '#fffdd0'
            };

            product.colors.forEach((color, index) => {
                const swatch = this.createColorSwatch(color, index === 0, colorMap);
                swatchesWrapper.appendChild(swatch);
            });

            swatchesContainer.appendChild(swatchesWrapper);
            actionsContainer.parentNode.insertBefore(swatchesContainer, actionsContainer);
        } catch (error) {
            console.error('Error updating color swatches:', error);
        }
    }

    createColorSwatch(color, isActive, colorMap) {
        const swatch = document.createElement('div');
        swatch.className = `color-swatch ${color}${isActive ? ' active' : ''}`;
        swatch.style.cssText = `
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2px solid ${color === 'white' ? '#ccc' : '#ddd'};
            cursor: pointer;
            transition: transform 0.2s;
            background-color: ${colorMap[color] || color};
        `;
        swatch.title = color.charAt(0).toUpperCase() + color.slice(1);
        
        swatch.addEventListener('mouseover', () => {
            swatch.style.transform = 'scale(1.1)';
        });
        
        swatch.addEventListener('mouseout', () => {
            swatch.style.transform = 'scale(1)';
        });

        return swatch;
    }

    bindElements() {
        this.addToCartBtn = document.getElementById('add-to-cart-btn');
        this.buyNowBtn = document.getElementById('buy-now-btn');
        this.styleFinderBtn = document.getElementById('style-finder-btn');
        this.toast = document.getElementById('toast-notification');
        this.toastMessage = this.toast?.querySelector('.toast-message');
        this.announcer = document.getElementById('sr-announcer');
    }

    bindEvents() {
        // Add to cart button with debouncing
        if (this.addToCartBtn) {
            this.addToCartBtn.addEventListener('click', 
                this.debounce(() => this.handleAddToCart(), 300)
            );
        }

        // Buy now button
        if (this.buyNowBtn) {
            this.buyNowBtn.addEventListener('click', 
                this.debounce(() => this.handleBuyNow(), 300)
            );
        }

        // Style finder button
        if (this.styleFinderBtn) {
            this.styleFinderBtn.addEventListener('click', () => this.handleStyleFinder());
        }

        // Image click for enlargement
        const mainImage = document.getElementById('main-product-image');
        if (mainImage) {
            mainImage.addEventListener('click', () => this.enlargeImage());
            mainImage.style.cursor = 'pointer';
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    handleAddToCart() {
        if (!this.currentProduct) return;

        try {
            // Check if cart system is available
            if (typeof window.cartSystem === 'undefined') {
                throw new Error('Cart system not available');
            }

            const added = window.cartSystem.addToCart({
                id: this.currentProduct.id,
                name: this.currentProduct.name,
                price: this.currentProduct.price,
                image: this.currentProduct.image,
                category: 'Saree'
            });

            if (added) {
                this.showToast(`${this.currentProduct.name} added to cart!`, 'success');
                this.addCelebrationEffect(this.addToCartBtn);
            } else {
                throw new Error('Failed to add to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showToast('Error adding to cart. Please try again.', 'error');
        }
    }

    handleBuyNow() {
        if (!this.currentProduct) return;
        
        try {
            // Check authentication
            if (typeof window.authSystem === 'undefined' || 
                !window.authSystem.checkLoginForCheckout()) {
                return;
            }

            this.handleAddToCart();
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 1000);
        } catch (error) {
            console.error('Error in buy now:', error);
            this.showToast('Error processing request. Please try again.', 'error');
        }
    }

    handleStyleFinder() {
        this.showLoadingState(this.styleFinderBtn);
        
        setTimeout(() => {
            window.location.href = 'body-recommender.html';
        }, 1000);
    }

    enlargeImage() {
        if (!this.currentProduct) return;
        
        try {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                cursor: pointer;
                animation: fadeIn 0.3s ease;
            `;
            
            const img = document.createElement('img');
            img.src = this.currentProduct.image;
            img.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            `;
            img.onerror = () => {
                document.body.removeChild(modal);
                this.showToast('Error loading image', 'error');
            };
            
            modal.appendChild(img);
            document.body.appendChild(modal);
            
            modal.addEventListener('click', () => {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    if (document.body.contains(modal)) {
                        document.body.removeChild(modal);
                    }
                }, 300);
            });
        } catch (error) {
            console.error('Error enlarging image:', error);
        }
    }

    showLoadingState(button) {
        if (!button) return;
        
        const originalText = button.querySelector('.btn-text')?.textContent || button.textContent;
        const textElement = button.querySelector('.btn-text') || button;
        
        textElement.textContent = 'Loading...';
        button.disabled = true;
        button.style.opacity = '0.7';
        
        setTimeout(() => {
            textElement.textContent = originalText;
            button.disabled = false;
            button.style.opacity = '1';
        }, 2000);
    }

    showToast(message, type = 'success') {
        try {
            if (!this.toast || !this.toastMessage) {
                this.createToast();
            }
            
            if (this.toastMessage) {
                this.toastMessage.textContent = message;
                this.toast.className = `toast-notification ${type} show`;
                
                if (this.toastTimeout) {
                    clearTimeout(this.toastTimeout);
                }
                
                this.toastTimeout = setTimeout(() => {
                    this.hideToast();
                }, 3000);

                // Announce to screen readers
                if (this.announcer) {
                    this.announcer.textContent = message;
                }
            }
        } catch (error) {
            console.error('Error showing toast:', error);
        }
    }

    createToast() {
        if (document.getElementById('toast-notification')) return;
        
        const toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast-notification';
        toast.innerHTML = '<span class="toast-message"></span>';
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            z-index: 9999;
            transform: translateX(300px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        this.toast = toast;
        this.toastMessage = toast.querySelector('.toast-message');
        
        const style = document.createElement('style');
        style.textContent = `
            .toast-notification.show { transform: translateX(0) !important; }
            .toast-notification.error { background: #dc3545; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        `;
        document.head.appendChild(style);
    }

    hideToast() {
        if (this.toast) {
            this.toast.classList.remove('show');
        }
    }

    addCelebrationEffect(button) {
        if (!button) return;
        
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    loadReviews() {
        if (!this.currentProduct?.reviews) return;
        
        const reviewsContainer = document.getElementById('reviews-container');
        if (!reviewsContainer) return;
        
        try {
            const reviewsHTML = this.currentProduct.reviews.map(review => `
                <div class="review-item">
                    <div class="review-header">
                        <span class="reviewer-name">${this.sanitizeText(review.name)}</span>
                        <div class="review-rating">
                            ${'★'.repeat(Math.min(5, Math.max(0, review.rating)))}${'☆'.repeat(5 - Math.min(5, Math.max(0, review.rating)))}
                        </div>
                    </div>
                    <p class="review-comment">${this.sanitizeText(review.comment)}</p>
                </div>
            `).join('');
            
            reviewsContainer.innerHTML = reviewsHTML;
        } catch (error) {
            console.error('Error loading reviews:', error);
        }
    }

    createAccessibilityFeatures() {
        if (!document.getElementById('sr-announcer')) {
            const announcer = document.createElement('div');
            announcer.id = 'sr-announcer';
            announcer.className = 'sr-only';
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
        }
    }

    showError(message) {
        this.showToast(message, 'error');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        new ProductDetailManager();
    } catch (error) {
        console.error('Failed to initialize product manager:', error);
    }
});

console.log('📦 Product Detail System Loaded (Fixed Version)');