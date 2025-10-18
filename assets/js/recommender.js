/**
 * Body Type Recommender System - FIXED VERSION
 * Enhanced error handling, validation, and accessibility
 */

class BodyTypeRecommender {
    constructor() {
        this.recommendationData = this.initializeRecommendationData();
        this.currentRecommendations = [];
        this.isProcessing = false;
        
        this.init();
    }

    init() {
        console.log('🎯 Body Type Recommender System Initializing...');
        
        try {
            this.bindEvents();
            this.createAccessibilityFeatures();
            this.setupValidation();
            console.log('✅ Body Type Recommender System Ready');
        } catch (error) {
            console.error('❌ Failed to initialize recommender:', error);
            this.showError('System initialization failed. Please refresh the page.');
        }
    }

    initializeRecommendationData() {
        return {
            pear: {
                wedding: {
                    silk: {
                        name: "Heavy Silk Saree with Embellished Blouse",
                        description: "Perfect for pear body types! The heavy silk fabric with rich embellishments on the blouse draws attention upward, balancing your proportions beautifully.",
                        features: ["Detailed blouse work", "Heavy fabric drape", "Rich colors", "Traditional appeal"],
                        image: "../assets/images/recommendation1.png"
                    },
                    georgette: {
                        name: "Georgette Saree with Statement Blouse",
                        description: "Flowing georgette with an eye-catching blouse creates a stunning silhouette that flatters pear-shaped figures perfectly.",
                        features: ["Flowing drape", "Statement blouse", "Elegant fall", "Comfortable wear"],
                        image: "../assets/images/recommendation2.png"
                    }
                },
                party: {
                    chiffon: {
                        name: "Designer Chiffon with Sequin Work",
                        description: "Light chiffon with sequin detailing on the blouse area creates visual interest upward, perfect for your body type.",
                        features: ["Lightweight fabric", "Sequin embellishments", "Modern design", "Party perfect"],
                        image: "../assets/images/recommendation3.png"
                    },
                    georgette: {
                        name: "Printed Georgette with Contrast Blouse",
                        description: "Beautiful prints with contrasting blouse colors enhance your upper body proportions elegantly.",
                        features: ["Vibrant prints", "Contrast elements", "Flattering drape", "Stylish appeal"],
                        image: "../assets/images/recommendation4.png"
                    }
                },
                casual: {
                    cotton: {
                        name: "Cotton Saree with Embroidered Blouse",
                        description: "Comfortable cotton with beautiful embroidered blouse work - ideal for daily wear while maintaining elegance.",
                        features: ["Breathable fabric", "Easy maintenance", "Elegant embroidery", "Daily wear perfect"],
                        image: "../assets/images/recommendation5.png"
                    }
                }
            },
            apple: {
                wedding: {
                    silk: {
                        name: "Silk Saree with Empire Waist Blouse",
                        description: "Beautiful silk saree with an empire waist blouse that sits just below the bust, creating a flattering silhouette for apple body types.",
                        features: ["Empire waist design", "Luxurious silk", "Elegant draping", "Traditional glamour"],
                        image: "../assets/images/recommendation1.png"
                    }
                },
                office: {
                    cotton: {
                        name: "Structured Cotton with Tailored Blouse",
                        description: "Professional cotton saree with a well-tailored blouse that provides structure and confidence for the workplace.",
                        features: ["Professional appearance", "Structured fit", "Breathable comfort", "Work appropriate"],
                        image: "../assets/images/recommendation3.png"
                    }
                }
            },
            rectangle: {
                wedding: {
                    silk: {
                        name: "Silk Saree with Peplum Blouse",
                        description: "Stunning silk saree paired with a peplum blouse that creates curves and adds dimension to your straight silhouette.",
                        features: ["Curve-creating peplum", "Rich silk texture", "Dimensional design", "Elegant appeal"],
                        image: "../assets/images/recommendation1.png"
                    }
                },
                party: {
                    georgette: {
                        name: "Ruffled Georgette with Fitted Blouse",
                        description: "Beautiful ruffled georgette saree with a fitted blouse that adds texture and creates the illusion of curves.",
                        features: ["Ruffle detailing", "Fitted silhouette", "Texture play", "Party glamour"],
                        image: "../assets/images/recommendation2.png"
                    }
                }
            },
            hourglass: {
                wedding: {
                    silk: {
                        name: "Classic Silk Saree with Fitted Blouse",
                        description: "Timeless silk saree with a perfectly fitted blouse that celebrates your natural curves beautifully.",
                        features: ["Curve celebrating", "Perfect fit", "Classic elegance", "Timeless appeal"],
                        image: "../assets/images/recommendation1.png"
                    }
                },
                party: {
                    chiffon: {
                        name: "Draped Chiffon with Corset Blouse",
                        description: "Elegantly draped chiffon with a corset-style blouse that enhances your natural hourglass figure perfectly.",
                        features: ["Corset styling", "Natural enhancement", "Elegant draping", "Figure flattering"],
                        image: "../assets/images/recommendation3.png"
                    }
                }
            },
            petite: {
                wedding: {
                    chiffon: {
                        name: "Lightweight Chiffon with Minimal Border",
                        description: "Delicate chiffon saree with minimal border work that doesn't overwhelm your petite frame while maintaining elegance.",
                        features: ["Lightweight feel", "Minimal borders", "Delicate design", "Petite friendly"],
                        image: "../assets/images/recommendation2.png"
                    }
                },
                party: {
                    georgette: {
                        name: "Georgette with Small Prints",
                        description: "Beautiful georgette with small, proportionate prints that complement your petite stature perfectly.",
                        features: ["Proportionate prints", "Lightweight fabric", "Petite scaling", "Elegant design"],
                        image: "../assets/images/recommendation4.png"
                    }
                }
            }
        };
    }

    bindEvents() {
        const form = document.getElementById('recommendation-form');
        const resetBtn = document.getElementById('reset-btn');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetForm();
            });
        }

        // Add change listeners for real-time validation
        const selects = form?.querySelectorAll('select');
        selects?.forEach(select => {
            select.addEventListener('change', () => {
                this.validateField(select);
            });
        });
    }

    setupValidation() {
        const form = document.getElementById('recommendation-form');
        if (!form) return;

        // Add visual feedback for required fields
        const selects = form.querySelectorAll('select');
        selects.forEach(select => {
            select.addEventListener('blur', () => {
                this.validateField(select);
            });
        });
    }

    validateField(field) {
        if (!field.value) {
            field.style.borderColor = '#ef4444';
            return false;
        } else {
            field.style.borderColor = '#e5e7eb';
            return true;
        }
    }

    async handleFormSubmission() {
        if (this.isProcessing) {
            console.log('⚠️ Already processing request');
            return;
        }

        const formData = this.getFormData();
        
        if (!this.validateFormData(formData)) {
            this.showError('Please fill in all fields to get personalized recommendations.');
            return;
        }

        this.isProcessing = true;
        this.showLoading();
        
        try {
            // Simulate processing with proper async handling
            await this.delay(1500);
            
            const recommendations = this.generateRecommendations(formData);
            
            if (recommendations.length === 0) {
                throw new Error('No recommendations found');
            }
            
            this.displayRecommendations(recommendations);
            this.hideLoading();
            this.announceToScreenReader(`${recommendations.length} recommendations have been generated based on your preferences.`);
            
            // Track recommendation (analytics placeholder)
            this.trackRecommendation(formData.bodyType, formData.occasion, formData.fabric, recommendations.length);
            
        } catch (error) {
            console.error('❌ Error generating recommendations:', error);
            this.hideLoading();
            this.showError('Failed to generate recommendations. Please try again.');
        } finally {
            this.isProcessing = false;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getFormData() {
        try {
            return {
                bodyType: document.getElementById('body-type')?.value || '',
                occasion: document.getElementById('occasion')?.value || '',
                fabric: document.getElementById('fabric')?.value || ''
            };
        } catch (error) {
            console.error('Error getting form data:', error);
            return { bodyType: '', occasion: '', fabric: '' };
        }
    }

    validateFormData(data) {
        return data.bodyType && data.occasion && data.fabric;
    }

    generateRecommendations(formData) {
        const { bodyType, occasion, fabric } = formData;
        const recommendations = [];

        try {
            // Primary recommendation
            const primary = this.recommendationData[bodyType]?.[occasion]?.[fabric];
            if (primary) {
                recommendations.push({
                    ...primary,
                    priority: 'primary',
                    match: 'Perfect Match'
                });
            }

            // Secondary recommendations
            const bodyData = this.recommendationData[bodyType];
            if (bodyData) {
                for (const occ in bodyData) {
                    for (const fab in bodyData[occ]) {
                        if (!(occ === occasion && fab === fabric) && recommendations.length < 3) {
                            recommendations.push({
                                ...bodyData[occ][fab],
                                priority: 'secondary',
                                match: 'Great Alternative'
                            });
                        }
                    }
                }
            }

            // Fallback recommendations
            if (recommendations.length < 2) {
                recommendations.push(...this.getFallbackRecommendations());
            }

            return recommendations.slice(0, 3);
        } catch (error) {
            console.error('Error generating recommendations:', error);
            return this.getFallbackRecommendations();
        }
    }

    getFallbackRecommendations() {
        return [
            {
                name: "Classic Silk Saree",
                description: "A timeless classic that works beautifully for your body type and preferences.",
                features: ["Versatile design", "Classic appeal", "Elegant draping", "Suitable for all"],
                image: "../assets/images/recommendation1.png",
                priority: 'fallback',
                match: 'Classic Choice'
            },
            {
                name: "Designer Georgette Saree",
                description: "Flowing georgette that creates beautiful movement and flatters most body types.",
                features: ["Flowing fabric", "Universal appeal", "Easy to drape", "Comfortable wear"],
                image: "../assets/images/recommendation2.png",
                priority: 'fallback',
                match: 'Popular Choice'
            }
        ];
    }

    displayRecommendations(recommendations) {
        const grid = document.getElementById('recommendations-grid');
        const section = document.getElementById('recommendations-section');
        
        if (!grid || !section) {
            console.error('Required elements not found');
            return;
        }

        grid.innerHTML = '';

        recommendations.forEach((rec, index) => {
            const card = this.createRecommendationCard(rec, index);
            grid.appendChild(card);
        });

        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });

        this.currentRecommendations = recommendations;
    }

    createRecommendationCard(recommendation, index) {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.style.animationDelay = `${index * 0.2}s`;
        
        // Sanitize content
        const safeName = this.sanitizeHTML(recommendation.name);
        const safeDescription = this.sanitizeHTML(recommendation.description);
        const safeMatch = this.sanitizeHTML(recommendation.match || 'Recommended');
        
        card.innerHTML = `
            <img src="${recommendation.image}" 
                 alt="${safeName}" 
                 class="card-image" 
                 onerror="this.src='../assets/uploads/product-${(index % 5) + 1}.webp'">
            <div class="card-content">
                <div class="match-badge" style="background: linear-gradient(135deg, #800000, #FFD700); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; margin-bottom: 15px; display: inline-block;">
                    ${safeMatch}
                </div>
                <h3>${safeName}</h3>
                <p>${safeDescription}</p>
                <ul class="card-features">
                    ${recommendation.features.map(feature => 
                        `<li>${this.sanitizeHTML(feature)}</li>`
                    ).join('')}
                </ul>
            </div>
        `;

        // Add hover effects with error handling
        try {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-5px)';
            });
        } catch (error) {
            console.error('Error adding hover effects:', error);
        }

        return card;
    }

    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    resetForm() {
        const form = document.getElementById('recommendation-form');
        const section = document.getElementById('recommendations-section');
        
        if (form) {
            form.reset();
            
            // Reset field styles
            const selects = form.querySelectorAll('select');
            selects.forEach(select => {
                select.style.borderColor = '';
            });
        }
        
        if (section) {
            section.style.display = 'none';
        }

        form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        this.announceToScreenReader('Form has been reset. You can make new selections.');
        
        // Focus on first select
        const firstSelect = document.getElementById('body-type');
        if (firstSelect) {
            setTimeout(() => firstSelect.focus(), 500);
        }
    }

    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    showError(message) {
        const form = document.getElementById('recommendation-form');
        if (!form) return;

        // Remove existing error if present
        const existingError = form.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #fee2e2;
            border: 1px solid #fecaca;
            color: #991b1b;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            font-weight: 500;
        `;
        errorDiv.textContent = message;

        form.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);

        this.announceToScreenReader(message);
    }

    announceToScreenReader(message) {
        const announcer = document.getElementById('sr-announcer');
        if (announcer) {
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
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

        this.enhanceFormAccessibility();
    }

    enhanceFormAccessibility() {
        const fields = [
            { id: 'body-type', help: 'Choose the body type that best describes your figure' },
            { id: 'occasion', help: 'Select the type of event you plan to wear the saree to' },
            { id: 'fabric', help: 'Choose your preferred fabric type for comfort and style' }
        ];

        fields.forEach(({ id, help }) => {
            const element = document.getElementById(id);
            if (element) {
                element.setAttribute('aria-describedby', `${id}-help`);
                
                const helpText = document.createElement('div');
                helpText.id = `${id}-help`;
                helpText.className = 'sr-only';
                helpText.textContent = help;
                
                element.parentNode.appendChild(helpText);
            }
        });
    }

    trackRecommendation(bodyType, occasion, fabric, count) {
        console.log(`📊 Recommendation: ${bodyType} + ${occasion} + ${fabric} = ${count} suggestions`);
        
        // Placeholder for analytics
        if (window.gtag) {
            window.gtag('event', 'recommendation_generated', {
                body_type: bodyType,
                occasion: occasion,
                fabric: fabric,
                result_count: count
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Initializing Body Type Recommender System...');
    
    try {
        const recommender = new BodyTypeRecommender();
        window.bodyRecommender = recommender;
    } catch (error) {
        console.error('❌ Failed to initialize recommender:', error);
    }
});

console.log('🛠️ Recommender script loaded');