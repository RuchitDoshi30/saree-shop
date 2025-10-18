/**
 * Authentication System for Apsara Creations
 * FIXED VERSION - Uses in-memory storage instead of localStorage
 * Handles login, signup, logout, and session management
 */

class AuthSystem {
    constructor() {
        // Base path for GitHub Pages
        this.REPO_BASE = '/saree-shop/';
        
        // In-memory storage (replaces localStorage)
        this.memory = {
            users: [],
            currentUser: null,
            isLoggedIn: false,
            sessionTimeout: null
        };
        
        this.init();
    }

    init() {
        // Initialize with default users
        this.seedDefaultUsers();
        
        // Check for existing session (using sessionStorage as fallback)
        this.restoreSession();
        
        // Update navbar on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.updateNavbar(), 100);
            });
        } else {
            setTimeout(() => this.updateNavbar(), 100);
        }

        // Setup session timeout (30 minutes)
        this.setupSessionTimeout();

        console.log('🔐 Auth system initialized (memory-based)');
    }

    seedDefaultUsers() {
        // Admin user
        this.memory.users.push({
            id: 'admin-' + Date.now(),
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
            name: 'Administrator',
            createdAt: new Date().toISOString()
        });

        // Demo user
        this.memory.users.push({
            id: 'user-' + Date.now(),
            email: 'user@example.com',
            password: 'user123',
            role: 'user',
            name: 'Demo User',
            createdAt: new Date().toISOString()
        });

        console.log('🔧 Default users seeded');
    }

    restoreSession() {
        try {
            // Try to restore from sessionStorage (persists during page navigation)
            const sessionData = sessionStorage.getItem('apsara_session');
            if (sessionData) {
                const session = JSON.parse(sessionData);
                const sessionAge = Date.now() - new Date(session.timestamp).getTime();
                
                // Session valid for 30 minutes
                if (sessionAge < 30 * 60 * 1000) {
                    this.memory.currentUser = session.user;
                    this.memory.isLoggedIn = true;
                    console.log('✅ Session restored for:', session.user.email);
                } else {
                    this.clearSession();
                    console.log('⏰ Session expired');
                }
            }
        } catch (e) {
            console.warn('Could not restore session', e);
        }
    }

    saveSession() {
        try {
            sessionStorage.setItem('apsara_session', JSON.stringify({
                user: this.memory.currentUser,
                timestamp: new Date().toISOString()
            }));
        } catch (e) {
            console.warn('Could not save session', e);
        }
    }

    clearSession() {
        try {
            sessionStorage.removeItem('apsara_session');
        } catch (e) {
            console.warn('Could not clear session', e);
        }
        this.memory.currentUser = null;
        this.memory.isLoggedIn = false;
    }

    setupSessionTimeout() {
        // Clear any existing timeout
        if (this.memory.sessionTimeout) {
            clearTimeout(this.memory.sessionTimeout);
        }

        // Auto-logout after 30 minutes of inactivity
        const resetTimeout = () => {
            if (this.memory.sessionTimeout) {
                clearTimeout(this.memory.sessionTimeout);
            }
            
            if (this.memory.isLoggedIn) {
                this.memory.sessionTimeout = setTimeout(() => {
                    this.logout();
                    alert('Your session has expired. Please login again.');
                }, 30 * 60 * 1000); // 30 minutes
            }
        };

        // Reset timeout on user activity
        ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
            document.addEventListener(event, resetTimeout, { passive: true });
        });

        resetTimeout();
    }

    signup(email, password, confirmPassword) {
        try {
            // Validation
            if (!email || !password || !confirmPassword) {
                throw new Error('All fields are required');
            }

            if (!this.isValidEmail(email)) {
                throw new Error('Please enter a valid email address');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            // Check if user already exists
            if (this.memory.users.find(user => user.email === email)) {
                throw new Error('User with this email already exists');
            }

            // Create new user
            const newUser = {
                id: 'user-' + Date.now(),
                email: email,
                password: password,
                role: 'user',
                createdAt: new Date().toISOString(),
                name: email.split('@')[0]
            };

            // Save user
            this.memory.users.push(newUser);

            // Auto-login after signup
            this.setCurrentUser(newUser);

            return { success: true, message: 'Account created successfully!' };

        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    login(email, password) {
        try {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            const user = this.memory.users.find(u => 
                u.email === email && u.password === password
            );

            if (!user) {
                throw new Error('Invalid email or password');
            }

            this.setCurrentUser(user);

            return { success: true, message: 'Login successful!' };

        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    logout() {
        this.clearSession();
        this.updateNavbar();

        // Redirect to login page
        try {
            window.location.replace(this.REPO_BASE + 'pages/login.html');
        } catch (e) {
            window.location.href = this.REPO_BASE + 'pages/login.html';
        }

        console.log('👋 User logged out');
    }

    setCurrentUser(user) {
        this.memory.currentUser = user;
        this.memory.isLoggedIn = true;
        this.saveSession();
        this.setupSessionTimeout();
        this.updateNavbar();
        console.log('✅ User logged in:', user.email);
    }

    getCurrentUser() {
        return this.memory.currentUser;
    }

    isLoggedIn() {
        return this.memory.isLoggedIn;
    }

    requireLogin(redirectMessage = 'Please login to continue', requireAdmin = false) {
        if (!this.memory.isLoggedIn || !this.memory.currentUser) {
            sessionStorage.setItem('auth_redirect_message', redirectMessage);
            window.location.replace(this.REPO_BASE + 'pages/login.html');
            return false;
        }

        if (requireAdmin && this.memory.currentUser.role !== 'admin') {
            sessionStorage.setItem('auth_redirect_message', 'Admin access required.');
            window.location.replace(this.REPO_BASE + 'pages/login.html');
            return false;
        }

        return true;
    }

    updateNavbar() {
        let attempts = 0;
        const maxAttempts = 10;

        const tryUpdate = () => {
            const navbar = document.querySelector('.navbar-icons');
            const loginIcon = navbar ? navbar.querySelector('a[href*="login.html"]') : null;

            if (navbar && loginIcon) {
                if (this.isLoggedIn()) {
                    this.showUserDropdown(navbar, loginIcon);
                } else {
                    this.showLoginIcon(navbar, loginIcon);
                }
                console.log('✅ Navbar updated successfully');
            } else {
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(tryUpdate, 200);
                }
            }
        };

        tryUpdate();
    }

    showUserDropdown(navbar, loginIcon) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;

        const existingDropdown = navbar.querySelector('.user-dropdown-container');
        if (existingDropdown) {
            existingDropdown.remove();
        }

        const loginIcons = navbar.querySelectorAll('a[href*="login.html"]');
        loginIcons.forEach(icon => {
            if (icon && icon.parentNode) {
                icon.parentNode.removeChild(icon);
            }
        });

        const isAdmin = currentUser.role === 'admin' || currentUser.email === 'admin@example.com';

        const adminLink = isAdmin ? `
            <a href="${this.REPO_BASE}pages/admin-dashboard.html" class="dropdown-item admin-dashboard-link">
                <span class="material-icons">dashboard</span>
                Admin Dashboard
            </a>
        ` : '';

        const dropdownHTML = `
            <div class="user-dropdown-container">
                <div class="user-dropdown-trigger navbar-icon">
                    <span class="material-icons">person</span>
                    <span class="material-icons dropdown-arrow">arrow_drop_down</span>
                </div>
                <div class="user-dropdown-menu">
                    <div class="dropdown-header">
                        <span class="user-email">${currentUser.email}</span>
                    </div>
                    <div class="dropdown-divider"></div>
                    <a href="settings.html" class="dropdown-item">
                        <span class="material-icons">settings</span>
                        Settings
                    </a>
                    ${adminLink}
                    <a href="#" class="dropdown-item logout-btn">
                        <span class="material-icons">logout</span>
                        Logout
                    </a>
                </div>
            </div>
        `;

        if (!navbar.querySelector('.user-dropdown-container')) {
            navbar.insertAdjacentHTML('beforeend', dropdownHTML);
        }

        this.setupDropdownEvents();
    }

    showLoginIcon(navbar, loginIcon) {
        const dropdown = navbar.querySelector('.user-dropdown-container');
        if (dropdown) {
            dropdown.remove();
        }

        if (loginIcon) {
            loginIcon.style.display = 'flex';
        }
    }

    setupDropdownEvents() {
        const trigger = document.querySelector('.user-dropdown-trigger');
        const menu = document.querySelector('.user-dropdown-menu');
        const logoutBtn = document.querySelector('.logout-btn');

        if (trigger && menu) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                menu.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!trigger.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.remove('active');
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    checkLoginForCheckout() {
        if (this.isLoggedIn()) {
            return true;
        } else {
            this.requireLogin('Please login to complete your purchase');
            return false;
        }
    }

    getUsers() {
        return this.memory.users;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    clearAllData() {
        this.memory.users = [];
        this.clearSession();
        this.seedDefaultUsers();
        console.log('🗑️ All auth data cleared');
    }

    getAllUsers() {
        return this.getUsers();
    }
}

// Global Authentication Instance
const authSystem = new AuthSystem();
window.authSystem = authSystem;

// Form Handlers
document.addEventListener('DOMContentLoaded', function () {
    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('login-error');
            const successDiv = document.getElementById('login-success');

            const result = authSystem.login(email, password);

            if (result.success) {
                if (successDiv) {
                    successDiv.textContent = result.message;
                    successDiv.style.display = 'block';
                }
                if (errorDiv) errorDiv.style.display = 'none';

                setTimeout(() => {
                    authSystem.updateNavbar();
                }, 100);

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                if (errorDiv) {
                    errorDiv.textContent = result.message;
                    errorDiv.style.display = 'block';
                }
                if (successDiv) successDiv.style.display = 'none';
            }
        });
    }

    // Signup form handler
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const errorDiv = document.getElementById('signup-error');
            const successDiv = document.getElementById('signup-success');

            const result = authSystem.signup(email, password, confirmPassword);

            if (result.success) {
                if (successDiv) {
                    successDiv.textContent = result.message;
                    successDiv.style.display = 'block';
                }
                if (errorDiv) errorDiv.style.display = 'none';

                setTimeout(() => {
                    authSystem.updateNavbar();
                }, 100);

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                if (errorDiv) {
                    errorDiv.textContent = result.message;
                    errorDiv.style.display = 'block';
                }
                if (successDiv) successDiv.style.display = 'none';
            }
        });
    }

    // Check for redirect message
    const redirectMessage = sessionStorage.getItem('auth_redirect_message');
    if (redirectMessage) {
        const messageDiv = document.querySelector('.auth-message');
        if (messageDiv) {
            messageDiv.textContent = redirectMessage;
            messageDiv.style.display = 'block';
        }
        sessionStorage.removeItem('auth_redirect_message');
    }

    // Debug info
    console.log('🔍 Auth Debug Info:');
    console.log('- Is logged in:', authSystem.isLoggedIn());
    console.log('- Current user:', authSystem.getCurrentUser());
});

console.log('🚀 Auth.js loaded successfully (memory-based version)');