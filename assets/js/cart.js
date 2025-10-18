/**
 * Shopping Cart System for Apsara Creations
 * FIXED VERSION - Uses in-memory storage instead of localStorage
 */

class CartSystem {
    constructor() {
        // In-memory cart storage
        this.cart = [];
        this.sessionTimeout = null;
        
        this.init();
    }

    init() {
        // Try to restore cart from sessionStorage (persists during page navigation)
        this.restoreCart();
        
        // Setup session timeout
        this.setupSessionTimeout();
        
        // Update cart icon on page load
        setTimeout(() => this.updateCartIcon(), 100);
        
        console.log('🛒 Cart system initialized (memory-based)');
    }

    restoreCart() {
        try {
            const cartData = sessionStorage.getItem('apsara_cart');
            if (cartData) {
                const savedCart = JSON.parse(cartData);
                const cartAge = Date.now() - new Date(savedCart.timestamp).getTime();
                
                // Cart valid for 24 hours
                if (cartAge < 24 * 60 * 60 * 1000) {
                    this.cart = savedCart.items || [];
                    console.log('✅ Cart restored:', this.cart.length, 'items');
                } else {
                    this.clearCart();
                    console.log('⏰ Cart expired');
                }
            }
        } catch (e) {
            console.warn('Could not restore cart', e);
        }
    }

    saveCart() {
        try {
            sessionStorage.setItem('apsara_cart', JSON.stringify({
                items: this.cart,
                timestamp: new Date().toISOString()
            }));
        } catch (e) {
            console.warn('Could not save cart', e);
        }
    }

    setupSessionTimeout() {
        // Save cart every 30 seconds if there are changes
        setInterval(() => {
            if (this.cart.length > 0) {
                this.saveCart();
            }
        }, 30000);
    }

    addToCart(product) {
        try {
            // Validate product
            if (!product || !product.id) {
                throw new Error('Invalid product');
            }

            // Check if product already in cart
            const existingIndex = this.cart.findIndex(item => item.id === product.id);
            
            if (existingIndex !== -1) {
                // Increase quantity
                this.cart[existingIndex].quantity = (this.cart[existingIndex].quantity || 1) + 1;
            } else {
                // Add new item
                this.cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    category: product.category || 'Saree',
                    quantity: 1,
                    addedAt: new Date().toISOString()
                });
            }
            
            this.saveCart();
            this.updateCartIcon();
            
            console.log('✅ Added to cart:', product.name);
            return true;
        } catch (error) {
            console.error('❌ Error adding to cart:', error);
            return false;
        }
    }

    removeFromCart(productId) {
        try {
            this.cart = this.cart.filter(item => item.id !== productId);
            this.saveCart();
            this.updateCartIcon();
            console.log('🗑️ Removed from cart:', productId);
            return true;
        } catch (error) {
            console.error('❌ Error removing from cart:', error);
            return false;
        }
    }

    updateQuantity(productId, newQuantity) {
        try {
            if (newQuantity <= 0) {
                return this.removeFromCart(productId);
            }

            const item = this.cart.find(item => item.id === productId);
            if (item) {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartIcon();
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error updating quantity:', error);
            return false;
        }
    }

    getCart() {
        return [...this.cart]; // Return a copy
    }

    getCartCount() {
        return this.cart.reduce((total, item) => total + (item.quantity || 1), 0);
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace(/[₹,]/g, ''));
            return total + (price * (item.quantity || 1));
        }, 0);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartIcon();
        console.log('🗑️ Cart cleared');
    }

    updateCartIcon() {
        const cartCount = this.getCartCount();
        const cartIcons = document.querySelectorAll('.navbar-icon[href*="cart.html"]');
        
        cartIcons.forEach(cartIcon => {
            if (cartIcon) {
                // Remove existing badge
                const existingBadge = cartIcon.querySelector('.cart-badge');
                if (existingBadge) {
                    existingBadge.remove();
                }
                
                // Add new badge if items exist
                if (cartCount > 0) {
                    const badge = document.createElement('span');
                    badge.className = 'cart-badge';
                    badge.textContent = cartCount;
                    badge.style.cssText = `
                        position: absolute;
                        top: -8px;
                        right: -8px;
                        background: #dc3545;
                        color: white;
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.75rem;
                        font-weight: 600;
                    `;
                    cartIcon.style.position = 'relative';
                    cartIcon.appendChild(badge);
                }
            }
        });
    }
}

// Global Cart Instance
const cartSystem = new CartSystem();
window.cartSystem = cartSystem;

// Helper functions for backward compatibility
window.addToCart = function(product) {
    return cartSystem.addToCart(product);
};

window.updateCartIcon = function() {
    return cartSystem.updateCartIcon();
};

console.log('🚀 Cart.js loaded successfully (memory-based version)');