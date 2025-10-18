// ===============================
// Product Detail Page Functionality
// Dynamic Product Loading System
// ===============================

class ProductDetailManager {
    constructor() {
        this.currentProduct = null;
        this.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.toastTimeout = null;
        
        this.init();
    }

    init() {
        console.log('🛍️ Product Detail Manager Initializing...');
        
        // Wait for products.js to load
        if (typeof getUrlParameter === 'undefined') {
            setTimeout(() => this.init(), 100);
            return;
        }
        
        this.loadProductData();
        this.bindElements();
        this.bindEvents();
        this.createAccessibilityFeatures();
        this.loadReviews();
        console.log('✅ Product Detail Manager Ready');
    }

    loadProductData() {
        // Get product ID from URL parameters
        const productId = getUrlParameter('id') || '1';
        this.currentProduct = getProductById(parseInt(productId));
        
        if (this.currentProduct) {
            this.renderProduct(this.currentProduct);
        }
    }

    renderProduct(product) {
        // Update page title
        document.title = `${product.name} - Apsara Creations`;
        
        // Update main image
        const mainImage = document.getElementById('main-product-image');
        if (mainImage) {
            mainImage.src = product.image;
            mainImage.alt = product.name;
        }
        
        // Update product title
        const titleElement = document.getElementById('product-title');
        if (titleElement) {
            titleElement.textContent = product.name;
        }
        
        // Update reviews count
        const reviewsElement = document.getElementById('product-reviews');
        if (reviewsElement && product.reviews) {
            reviewsElement.textContent = `(${product.reviews.length} reviews)`;
        }
        
        // Update pricing
        this.updatePricing(product);
        
        // Update description
        const descriptionElement = document.getElementById('product-description');
        if (descriptionElement) {
            descriptionElement.textContent = product.description;
        }
        
        // Update features
        this.updateFeatures(product);
        
        // Update color swatches if available
        this.updateColorSwatches(product);
    }

    updatePricing(product) {
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
                const currentPrice = parseFloat(product.price.replace('₹', '').replace(',', ''));
                const originalPrice = parseFloat(product.originalPrice.replace('₹', '').replace(',', ''));
                const discount = Math.round((1 - currentPrice / originalPrice) * 100);
                discountElement.textContent = `${discount}% OFF`;
                discountElement.style.display = 'inline';
            }
        } else {
            if (originalPriceElement) originalPriceElement.style.display = 'none';
            if (discountElement) discountElement.style.display = 'none';
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
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value || '-';
            }
        });
    }

    updateColorSwatches(product) {
        // Remove existing color swatches
        const existingSwatches = document.querySelector('.color-swatches');
        if (existingSwatches) {
            existingSwatches.remove();
        }

        if (product.colors && product.colors.length > 0) {
            const actionsContainer = document.querySelector('.product-actions');
            const swatchesContainer = document.createElement('div');
            swatchesContainer.className = 'color-swatches';
            swatchesContainer.style.marginBottom = '20px';
            
            const swatchesTitle = document.createElement('h4');
            swatchesTitle.textContent = 'Available Colors:';
            swatchesTitle.style.marginBottom = '10px';
            swatchesTitle.style.fontSize = '14px';
            swatchesTitle.style.color = '#5a4a5a';
            swatchesContainer.appendChild(swatchesTitle);

            const swatchesWrapper = document.createElement('div');
            swatchesWrapper.style.display = 'flex';
            swatchesWrapper.style.gap = '8px';
            swatchesWrapper.style.flexWrap = 'wrap';

            product.colors.forEach((color, index) => {
                const swatch = document.createElement('div');
                swatch.className = `color-swatch ${color}`;
                if (index === 0) swatch.classList.add('active');
                swatch.style.width = '30px';
                swatch.style.height = '30px';
                swatch.style.borderRadius = '50%';
                swatch.style.border = '2px solid #ddd';
                swatch.style.cursor = 'pointer';
                swatch.style.transition = 'transform 0.2s';
                swatch.title = color.charAt(0).toUpperCase() + color.slice(1);
                
                // Set background color
                const colorMap = {
                    'red': '#dc3545',
                    'maroon': '#8b0000',
                    'blue': '#007bff',
                    'green': '#28a745',
                    'pink': '#e91e63',
                    'purple': '#6f42c1',
                    'yellow': '#ffc107',
                    'white': '#ffffff',
                    'black': '#000000',
                    'orange': '#fd7e14',
                    'golden': '#daa520',
                    'beige': '#f5f5dc',
                    'brown': '#8b4513',
                    'cream': '#fffdd0'
                };
                
                swatch.style.backgroundColor = colorMap[color] || color;
                if (color === 'white') {
                    swatch.style.border = '2px solid #ccc';
                }

                swatch.addEventListener('mouseover', () => {
                    swatch.style.transform = 'scale(1.1)';
                });
                
                swatch.addEventListener('mouseout', () => {
                    swatch.style.transform = 'scale(1)';
                });

                swatchesWrapper.appendChild(swatch);
            });

            swatchesContainer.appendChild(swatchesWrapper);
            actionsContainer.parentNode.insertBefore(swatchesContainer, actionsContainer);
        }
    }

    bindElements() {
        // Action buttons
        this.addToCartBtn = document.getElementById('add-to-cart-btn');
        this.buyNowBtn = document.getElementById('buy-now-btn');
        this.styleFinderBtn = document.getElementById('style-finder-btn');
        
        // Notification elements
        this.toast = document.getElementById('toast-notification');
        this.toastMessage = this.toast?.querySelector('.toast-message');
        this.announcer = document.getElementById('sr-announcer');
    }

    bindEvents() {
        // Add to cart button
        if (this.addToCartBtn) {
            this.addToCartBtn.addEventListener('click', () => this.handleAddToCart());
        }

        // Buy now button
        if (this.buyNowBtn) {
            this.buyNowBtn.addEventListener('click', () => this.handleBuyNow());
        }

        // Style finder button
        if (this.styleFinderBtn) {
            this.styleFinderBtn.addEventListener('click', () => this.handleStyleFinder());
        }

        // Image click for enlargement
        const mainImage = document.getElementById('main-product-image');
        if (mainImage) {
            mainImage.addEventListener('click', () => this.enlargeImage());
        }
    }

    handleAddToCart() {
        if (!this.currentProduct) return;

        const existingItem = this.cartItems.find(item => item.id === this.currentProduct.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cartItems.push({
                id: this.currentProduct.id,
                name: this.currentProduct.name,
                price: this.currentProduct.price,
                image: this.currentProduct.image,
                quantity: 1
            });
        }
        
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        this.showToast(`${this.currentProduct.name} added to cart!`, 'success');
        this.updateCartCounter();
        this.addCelebrationEffect(this.addToCartBtn);
    }

    handleBuyNow() {
        if (!this.currentProduct) return;
        
        this.handleAddToCart();
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1000);
    }

    handleStyleFinder() {
        this.showLoadingState(this.styleFinderBtn);
        
        setTimeout(() => {
            window.location.href = 'body-recommender.html';
        }, 1000);
    }

    enlargeImage() {
        if (!this.currentProduct) return;
        
        // Create modal for enlarged image
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            cursor: pointer;
        `;
        
        const img = document.createElement('img');
        img.src = this.currentProduct.image;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;
        
        modal.appendChild(img);
        document.body.appendChild(modal);
        
        modal.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    showLoadingState(button) {
        if (!button) return;
        
        const originalText = button.querySelector('.btn-text').textContent;
        button.querySelector('.btn-text').textContent = 'Loading...';
        button.disabled = true;
        button.style.opacity = '0.7';
        
        setTimeout(() => {
            button.querySelector('.btn-text').textContent = originalText;
            button.disabled = false;
            button.style.opacity = '1';
        }, 2000);
    }

    showToast(message, type = 'success') {
        if (!this.toast || !this.toastMessage) {
            // Create toast if it doesn't exist
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
        
        // Add CSS for show state
        const style = document.createElement('style');
        style.textContent = '.toast-notification.show { transform: translateX(0) !important; }';
        document.head.appendChild(style);
    }

    hideToast() {
        if (this.toast) {
            this.toast.classList.remove('show');
        }
    }

    updateCartCounter() {
        const cartCounter = document.querySelector('.cart-counter');
        if (cartCounter) {
            const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartCounter.textContent = totalItems;
            cartCounter.style.display = totalItems > 0 ? 'block' : 'none';
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
        if (!this.currentProduct || !this.currentProduct.reviews) return;
        
        const reviewsContainer = document.getElementById('reviews-container');
        if (!reviewsContainer) return;
        
        const reviewsHTML = this.currentProduct.reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="reviewer-name">${review.name}</span>
                    <div class="review-rating">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                </div>
                <p class="review-comment">${review.comment}</p>
            </div>
        `).join('');
        
        reviewsContainer.innerHTML = reviewsHTML;
    }

    createAccessibilityFeatures() {
        // Create screen reader announcer
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProductDetailManager();
});

console.log('📦 Product Detail System Loaded');