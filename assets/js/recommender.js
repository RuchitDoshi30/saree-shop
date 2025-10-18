// ===============================
// Body Type Recommender System
// Advanced JavaScript Logic
// ===============================

class BodyTypeRecommender {
    constructor() {
        this.recommendationData = this.initializeRecommendationData();
        this.currentRecommendations = [];
        
        this.init();
    }

    init() {
        console.log('🎯 Body Type Recommender System Initializing...');
        this.bindEvents();
        this.createAccessibilityFeatures();
        console.log('✅ Body Type Recommender System Ready');
    }

    initializeRecommendationData() {
        return {
            // Body Type: Pear
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

            // Body Type: Apple
            apple: {
                wedding: {
                    silk: {
                        name: "Silk Saree with Empire Waist Blouse",
                        description: "Beautiful silk saree with an empire waist blouse that sits just below the bust, creating a flattering silhouette for apple body types.",
                        features: ["Empire waist design", "Luxurious silk", "Elegant draping", "Traditional glamour"],
                        image: "../assets/images/recommendation1.png"
                    },
                    georgette: {
                        name: "Flowing Georgette with V-neck Blouse",
                        description: "Graceful georgette with a flattering V-neck blouse that elongates your torso and creates beautiful proportions.",
                        features: ["V-neck flattery", "Flowing silhouette", "Comfortable fit", "Sophisticated look"],
                        image: "../assets/images/recommendation2.png"
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

            // Body Type: Rectangle
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
                },
                casual: {
                    cotton: {
                        name: "Printed Cotton with Belt-style Blouse",
                        description: "Vibrant printed cotton with a belt-style blouse that defines your waist and creates a beautiful shape.",
                        features: ["Waist definition", "Vibrant prints", "Comfortable wear", "Shape enhancing"],
                        image: "../assets/images/recommendation4.png"
                    }
                }
            },

            // Body Type: Hourglass
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
                },
                casual: {
                    cotton: {
                        name: "Wrap-style Cotton with Tie Blouse",
                        description: "Comfortable wrap-style cotton saree with tie blouse that maintains your beautiful proportions in casual settings.",
                        features: ["Wrap styling", "Comfortable fit", "Proportion maintaining", "Casual elegance"],
                        image: "../assets/images/recommendation5.png"
                    }
                }
            },

            // Body Type: Petite
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
                },
                casual: {
                    cotton: {
                        name: "Soft Cotton with Simple Blouse",
                        description: "Gentle cotton saree with a simple, well-fitted blouse that creates a polished look without overwhelming your frame.",
                        features: ["Gentle draping", "Simple elegance", "Perfect scaling", "Comfortable wear"],
                        image: "../assets/images/recommendation5.png"
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
    }

    async handleFormSubmission() {
        const formData = this.getFormData();
        
        if (!this.validateFormData(formData)) {
            this.showError('Please fill in all fields to get personalized recommendations.');
            return;
        }

        this.showLoading();
        
        // Simulate processing time for better UX
        setTimeout(() => {
            const recommendations = this.generateRecommendations(formData);
            this.displayRecommendations(recommendations);
            this.hideLoading();
            this.announceToScreenReader('Recommendations have been generated based on your preferences.');
        }, 1500);
    }

    getFormData() {
        return {
            bodyType: document.getElementById('body-type').value,
            occasion: document.getElementById('occasion').value,
            fabric: document.getElementById('fabric').value
        };
    }

    validateFormData(data) {
        return data.bodyType && data.occasion && data.fabric;
    }

    generateRecommendations(formData) {
        const { bodyType, occasion, fabric } = formData;
        const recommendations = [];

        // Primary recommendation based on exact match
        if (this.recommendationData[bodyType] && 
            this.recommendationData[bodyType][occasion] && 
            this.recommendationData[bodyType][occasion][fabric]) {
            
            recommendations.push({
                ...this.recommendationData[bodyType][occasion][fabric],
                priority: 'primary',
                match: 'Perfect Match'
            });
        }

        // Secondary recommendations from same body type but different fabric/occasion
        if (this.recommendationData[bodyType]) {
            for (const occ in this.recommendationData[bodyType]) {
                for (const fab in this.recommendationData[bodyType][occ]) {
                    if (!(occ === occasion && fab === fabric) && recommendations.length < 3) {
                        recommendations.push({
                            ...this.recommendationData[bodyType][occ][fab],
                            priority: 'secondary',
                            match: 'Great Alternative'
                        });
                    }
                }
            }
        }

        // Ensure we have at least 2-3 recommendations
        if (recommendations.length < 2) {
            recommendations.push(...this.getFallbackRecommendations(formData));
        }

        return recommendations.slice(0, 3); // Limit to 3 recommendations
    }

    getFallbackRecommendations(formData) {
        const fallbacks = [
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

        return fallbacks;
    }

    displayRecommendations(recommendations) {
        const grid = document.getElementById('recommendations-grid');
        const section = document.getElementById('recommendations-section');
        
        if (!grid || !section) return;

        // Clear previous results
        grid.innerHTML = '';

        // Create cards for each recommendation
        recommendations.forEach((rec, index) => {
            const card = this.createRecommendationCard(rec, index);
            grid.appendChild(card);
        });

        // Show results section with animation
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Store current recommendations
        this.currentRecommendations = recommendations;
    }

    createRecommendationCard(recommendation, index) {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.style.animationDelay = `${index * 0.2}s`;
        
        card.innerHTML = `
            <img src="${recommendation.image}" alt="${recommendation.name}" class="card-image" 
                 onerror="this.src='../assets/uploads/product-${(index % 5) + 1}.webp'">
            <div class="card-content">
                <div class="match-badge" style="background: var(--rec-gradient); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; margin-bottom: 15px; display: inline-block;">
                    ${recommendation.match || 'Recommended'}
                </div>
                <h3>${recommendation.name}</h3>
                <p>${recommendation.description}</p>
                <ul class="card-features">
                    ${recommendation.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        `;

        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-5px)';
        });

        return card;
    }

    resetForm() {
        const form = document.getElementById('recommendation-form');
        const section = document.getElementById('recommendations-section');
        
        if (form) {
            form.reset();
        }
        
        if (section) {
            section.style.display = 'none';
        }

        // Scroll back to form
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        this.announceToScreenReader('Form has been reset. You can make new selections.');
        
        // Focus on first select for better UX
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
        // Create temporary error display
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #ffe6e6;
            border: 1px solid #ffcccc;
            color: #cc0000;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            font-weight: 500;
        `;
        errorDiv.textContent = message;

        const form = document.getElementById('recommendation-form');
        if (form) {
            form.appendChild(errorDiv);
            
            // Remove error after 5 seconds
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 5000);
        }

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
        // Add keyboard navigation for form elements
        const selects = document.querySelectorAll('.form-select');
        selects.forEach(select => {
            select.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    select.click();
                }
            });
        });

        // Add ARIA labels and descriptions
        this.enhanceFormAccessibility();
    }

    enhanceFormAccessibility() {
        const bodyTypeSelect = document.getElementById('body-type');
        const occasionSelect = document.getElementById('occasion');
        const fabricSelect = document.getElementById('fabric');

        if (bodyTypeSelect) {
            bodyTypeSelect.setAttribute('aria-describedby', 'body-type-help');
            bodyTypeSelect.insertAdjacentHTML('afterend', 
                '<div id="body-type-help" class="sr-only">Choose the body type that best describes your figure</div>'
            );
        }

        if (occasionSelect) {
            occasionSelect.setAttribute('aria-describedby', 'occasion-help');
            occasionSelect.insertAdjacentHTML('afterend', 
                '<div id="occasion-help" class="sr-only">Select the type of event you plan to wear the saree to</div>'
            );
        }

        if (fabricSelect) {
            fabricSelect.setAttribute('aria-describedby', 'fabric-help');
            fabricSelect.insertAdjacentHTML('afterend', 
                '<div id="fabric-help" class="sr-only">Choose your preferred fabric type for comfort and style</div>'
            );
        }
    }

    // Analytics and tracking methods
    trackRecommendation(bodyType, occasion, fabric, recommendationCount) {
        console.log(`📊 Recommendation generated: ${bodyType} + ${occasion} + ${fabric} = ${recommendationCount} suggestions`);
    }

    // Performance monitoring
    measurePerformance(startTime, endTime, operation) {
        const duration = endTime - startTime;
        console.log(`⚡ ${operation} completed in ${duration}ms`);
    }
}

// Initialize the Body Type Recommender when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Initializing Body Type Recommender System...');
    const recommender = new BodyTypeRecommender();
    
    // Make it globally accessible for debugging
    window.bodyRecommender = recommender;
});

// Add performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`🚀 Body Recommender Page Load Time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
        }, 0);
    });
}

// Add smooth scroll behavior enhancement
document.addEventListener('DOMContentLoaded', () => {
    // Enhance form interactions
    const formInputs = document.querySelectorAll('.form-select');
    formInputs.forEach(input => {
        input.addEventListener('change', () => {
            input.style.borderColor = 'var(--rec-primary)';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
        });
    });
});

console.log('🎯 Body Type Recommender Script Loaded Successfully!');