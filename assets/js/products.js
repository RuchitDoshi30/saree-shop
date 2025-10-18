// Product database with all saree collection items
const productDatabase = {
    1: {
        id: 1,
        name: "Silk Banarasi Saree",
        price: "₹25,000",
        originalPrice: "₹35,000",
        image: "../assets/uploads/product-1.webp",
        badge: "Best Seller",
        colors: ["red", "maroon", "blue", "green"],
        description: "Exquisite Silk Banarasi saree featuring intricate handwoven patterns and traditional motifs. This masterpiece showcases the rich heritage of Varanasi's silk weaving tradition with luxurious gold zari work.",
        fabric: "Pure Silk",
        work: "Handwoven Zari",
        occasion: "Wedding, Festival",
        careInstructions: "Dry clean only",
        blouse: "Unstitched blouse piece included",
        origin: "Varanasi, India",
        reviews: [
            { name: "Priya Sharma", rating: 5, comment: "Absolutely stunning saree! The quality is exceptional and the design is breathtaking." },
            { name: "Meera Patel", rating: 5, comment: "Perfect for my daughter's wedding. Everyone complimented the beautiful work." }
        ]
    },
    2: {
        id: 2,
        name: "Designer Georgette Saree",
        price: "₹18,000",
        originalPrice: "₹22,500",
        image: "../assets/uploads/product-2.webp",
        badge: "-20%",
        colors: ["pink", "purple", "yellow", "white"],
        description: "Contemporary designer georgette saree with modern prints and elegant draping. Perfect blend of tradition and contemporary fashion for the modern woman.",
        fabric: "Premium Georgette",
        work: "Digital Print",
        occasion: "Party, Office",
        careInstructions: "Hand wash or dry clean",
        blouse: "Stitched blouse available",
        origin: "Mumbai, India",
        reviews: [
            { name: "Anita Desai", rating: 4, comment: "Love the lightweight fabric and beautiful colors. Great for office wear." },
            { name: "Sneha Kapoor", rating: 5, comment: "Excellent quality and fast delivery. Highly recommended!" }
        ]
    },
    3: {
        id: 3,
        name: "Cotton Handloom Saree",
        price: "₹12,000",
        originalPrice: null,
        image: "../assets/uploads/product-3.webp",
        badge: "New",
        colors: ["orange", "yellow", "green", "red"],
        description: "Authentic handloom cotton saree crafted by skilled artisans. Comfortable, breathable, and perfect for daily wear with traditional charm.",
        fabric: "Pure Cotton",
        work: "Handloom",
        occasion: "Daily wear, Casual",
        careInstructions: "Machine wash cold",
        blouse: "Unstitched blouse piece included",
        origin: "West Bengal, India",
        reviews: [
            { name: "Lakshmi Iyer", rating: 5, comment: "Comfortable cotton saree with beautiful handloom work. Value for money!" },
            { name: "Kavitha Rao", rating: 4, comment: "Good quality cotton. Perfect for everyday wear." }
        ]
    },
    4: {
        id: 4,
        name: "Embroidered Net Saree",
        price: "₹30,000",
        originalPrice: "₹55,000",
        image: "../assets/uploads/product-4.webp",
        badge: "-45%",
        colors: ["black", "maroon", "blue", "white"],
        description: "Luxurious net saree with intricate embroidery work. Features delicate threadwork and sequins that create a mesmerizing effect perfect for special occasions.",
        fabric: "Premium Net",
        work: "Hand Embroidery",
        occasion: "Wedding, Reception",
        careInstructions: "Dry clean only",
        blouse: "Designer blouse included",
        origin: "Lucknow, India",
        reviews: [
            { name: "Deepika Singh", rating: 5, comment: "Absolutely gorgeous! The embroidery work is phenomenal." },
            { name: "Pooja Gupta", rating: 5, comment: "Perfect for my reception. Everyone loved it!" }
        ]
    },
    5: {
        id: 5,
        name: "Traditional Kanjivaram Saree",
        price: "₹35,000",
        originalPrice: "₹42,000",
        image: "../assets/uploads/product-5.webp",
        badge: "Best Seller",
        colors: ["maroon", "red", "yellow", "green"],
        description: "Authentic Kanjivaram silk saree from Tamil Nadu featuring traditional temple motifs and rich gold zari border. A timeless piece for special occasions.",
        fabric: "Pure Kanjivaram Silk",
        work: "Traditional Zari",
        occasion: "Wedding, Temple",
        careInstructions: "Dry clean only",
        blouse: "Matching blouse piece included",
        origin: "Kanchipuram, Tamil Nadu",
        reviews: [
            { name: "Radha Krishnan", rating: 5, comment: "Authentic Kanjivaram with beautiful temple motifs. Excellent quality!" },
            { name: "Sunita Reddy", rating: 5, comment: "Traditional and elegant. Perfect for weddings." }
        ]
    },
    6: {
        id: 6,
        name: "Chiffon Designer Saree",
        price: "₹22,000",
        originalPrice: "₹26,000",
        image: "../assets/uploads/product-6.webp",
        badge: "-15%",
        colors: ["blue", "purple", "pink", "white"],
        description: "Elegant chiffon saree with contemporary design and flowing drape. Features subtle embellishments and modern patterns for a sophisticated look.",
        fabric: "Premium Chiffon",
        work: "Designer Print",
        occasion: "Party, Function",
        careInstructions: "Dry clean recommended",
        blouse: "Designer blouse included",
        origin: "Delhi, India",
        reviews: [
            { name: "Nisha Agarwal", rating: 4, comment: "Beautiful drape and lovely colors. Perfect for parties." },
            { name: "Ritika Jain", rating: 5, comment: "Elegant and comfortable. Great quality chiffon." }
        ]
    },
    7: {
        id: 7,
        name: "Bandhani Print Saree",
        price: "₹15,000",
        originalPrice: null,
        image: "../assets/uploads/product-7.webp",
        badge: "New",
        colors: ["yellow", "orange", "red", "green"],
        description: "Traditional Bandhani print saree showcasing the ancient tie-dye technique from Gujarat. Vibrant colors and authentic patterns make it perfect for festivals.",
        fabric: "Pure Silk",
        work: "Bandhani Tie-Dye",
        occasion: "Festival, Celebration",
        careInstructions: "Dry clean only",
        blouse: "Contrasting blouse piece included",
        origin: "Gujarat, India",
        reviews: [
            { name: "Meenakshi Shah", rating: 5, comment: "Authentic Bandhani work with vibrant colors. Love it!" },
            { name: "Kiran Patel", rating: 4, comment: "Beautiful traditional saree perfect for festivals." }
        ]
    },
    8: {
        id: 8,
        name: "Pure Mysore Silk Saree",
        price: "₹28,000",
        originalPrice: "₹40,000",
        image: "../assets/uploads/product-8.webp",
        badge: "-30%",
        colors: ["purple", "maroon", "blue", "black"],
        description: "Authentic Mysore silk saree known for its smooth texture and lustrous finish. Features traditional motifs and rich golden border.",
        fabric: "Pure Mysore Silk",
        work: "Traditional Weaving",
        occasion: "Wedding, Formal",
        careInstructions: "Dry clean only",
        blouse: "Matching silk blouse included",
        origin: "Mysore, Karnataka",
        reviews: [
            { name: "Latha Murthy", rating: 5, comment: "Genuine Mysore silk with excellent finish. Highly recommended!" },
            { name: "Shanti Rao", rating: 5, comment: "Beautiful saree with rich texture. Perfect for special occasions." }
        ]
    },
    9: {
        id: 9,
        name: "Tussar Silk Saree",
        price: "₹20,000",
        originalPrice: "₹27,000",
        image: "../assets/uploads/product-9.webp",
        badge: "-25%",
        colors: ["golden", "beige", "brown", "cream"],
        description: "Natural Tussar silk saree with earthy tones and organic texture. Features hand-painted motifs and eco-friendly dyeing process.",
        fabric: "Pure Tussar Silk",
        work: "Hand Painted",
        occasion: "Eco-friendly events, Casual",
        careInstructions: "Gentle hand wash or dry clean",
        blouse: "Natural cotton blouse included",
        origin: "Jharkhand, India",
        reviews: [
            { name: "Gayatri Devi", rating: 4, comment: "Love the natural texture and earthy colors. Eco-friendly choice!" },
            { name: "Vidya Sharma", rating: 5, comment: "Unique Tussar silk with beautiful hand-painted work." }
        ]
    }
};

// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to get product by ID
function getProductById(id) {
    return productDatabase[id] || productDatabase[1]; // Default to first product if not found
}

// Function to navigate to product detail page
function navigateToProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { productDatabase, getUrlParameter, getProductById, navigateToProduct };
}