/**
 * Authentication System for Apsara Creations
 * Handles login, signup, logout, and session management
 * Uses localStorage for static simulation
 */

class AuthSystem {
    constructor() {
        // Base path for the project when hosted on GitHub Pages.
        // Set this to the repository name path so redirects and absolute links work.
        // Example for GitHub Pages: '/saree-shop/'
        // If you need to run locally without the repo subpath, change this to '' for local dev.
        this.REPO_BASE = '/saree-shop/';
        this.storageKeys = {
            users: 'apsara_users',
            currentUser: 'apsara_current_user',
            isLoggedIn: 'apsara_is_logged_in'
        };
        this.init();
    }

    init() {
        // Initialize users storage if it doesn't exist
        if (!localStorage.getItem(this.storageKeys.users)) {
            localStorage.setItem(this.storageKeys.users, JSON.stringify([]));
        }
        // Ensure a default admin account exists for development/testing
        try {
            const users = this.getUsers();
            const adminEmail = 'admin@example.com';
            const adminExists = users.find(u => u.email === adminEmail);
            if (!adminExists) {
                const adminUser = {
                    id: 'admin-' + Date.now().toString(),
                    email: adminEmail,
                    password: 'admin123', // default admin password for testing only
                    createdAt: new Date().toISOString(),
                    name: 'Administrator'
                };
                users.push(adminUser);
                localStorage.setItem(this.storageKeys.users, JSON.stringify(users));
                console.log('🔧 Default admin account created:', adminEmail);
            }
        } catch (e) {
            console.warn('Could not seed admin user', e);
        }

        // Ensure a default user account exists for development/testing
        try {
            const users = this.getUsers();
            const userEmail = 'user@example.com';
            const userExists = users.find(u => u.email === userEmail);
            if (!userExists) {
                const demoUser = {
                    id: 'user-' + Date.now().toString(),
                    email: userEmail,
                    password: 'user123', // default user password for testing only
                    createdAt: new Date().toISOString(),
                    name: 'Demo User'
                };
                users.push(demoUser);
                localStorage.setItem(this.storageKeys.users, JSON.stringify(users));
                console.log('🔧 Default user account created:', userEmail);
            }
        } catch (e) {
            console.warn('Could not seed demo user', e);
        }

        // Update navbar on page load with delay to ensure DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.updateNavbar(), 100);
            });
        } else {
            setTimeout(() => this.updateNavbar(), 100);
        }

        console.log('🔐 Auth system initialized');
    }

    // ===============================
    //   User Registration
    // ===============================
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
            const users = this.getUsers();
            if (users.find(user => user.email === email)) {
                throw new Error('User with this email already exists');
            }

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                email: email,
                password: password, // In production, this should be hashed
                createdAt: new Date().toISOString(),
                name: email.split('@')[0] // Use email prefix as name
            };

            // Save user
            users.push(newUser);
            localStorage.setItem(this.storageKeys.users, JSON.stringify(users));

            // Auto-login after signup
            this.setCurrentUser(newUser);

            return { success: true, message: 'Account created successfully!' };

        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // ===============================
    //   User Login
    // ===============================
    login(email, password) {
        try {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            const users = this.getUsers();
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Set current user session
            this.setCurrentUser(user);

            return { success: true, message: 'Login successful!' };

        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // ===============================
    //   User Logout
    // ===============================
    logout() {
        localStorage.removeItem(this.storageKeys.currentUser);
        localStorage.removeItem(this.storageKeys.isLoggedIn);
        this.updateNavbar();

        // Redirect to login page so logout flows are consistent across user and admin
        try {
            window.location.replace(this.REPO_BASE + 'pages/login.html');
        } catch (e) {
            window.location.href = this.REPO_BASE + 'pages/login.html';
        }

        console.log('👋 User logged out');
    }

    // ===============================
    //   Session Management
    // ===============================
    setCurrentUser(user) {
        localStorage.setItem(this.storageKeys.currentUser, JSON.stringify(user));
        localStorage.setItem(this.storageKeys.isLoggedIn, 'true');
        this.updateNavbar();
        console.log('✅ User logged in:', user.email);
    }

    getCurrentUser() {
        const userStr = localStorage.getItem(this.storageKeys.currentUser);
        return userStr ? JSON.parse(userStr) : null;
    }

    isLoggedIn() {
        return localStorage.getItem(this.storageKeys.isLoggedIn) === 'true';
    }

    requireLogin(redirectMessage = 'Please login to continue', requireAdmin = false) {
        const isLoggedIn = localStorage.getItem(this.storageKeys.isLoggedIn) === 'true';
        const currentUser = this.getCurrentUser();

        if (!isLoggedIn || !currentUser) {
            sessionStorage.setItem('auth_redirect_message', redirectMessage);
            window.location.replace(this.REPO_BASE + 'pages/login.html');
            return false;
        }

        if (requireAdmin && currentUser.email !== 'admin@example.com') {
            sessionStorage.setItem('auth_redirect_message', 'Admin access required.');
            window.location.replace(this.REPO_BASE + 'pages/login.html');
            return false;
        }

        return true;
    }

    // ===============================
    //   Navbar Management
    // ===============================
    updateNavbar() {
        // Try multiple times to find navbar
        let attempts = 0;
        const maxAttempts = 10;

        const tryUpdate = () => {
            const navbar = document.querySelector('.navbar-icons');
            const loginIcon = navbar ? navbar.querySelector('a[href="login.html"]') : null;

            if (navbar && loginIcon) {
                if (this.isLoggedIn()) {
                    // User is logged in - show dropdown
                    this.showUserDropdown(navbar, loginIcon);
                } else {
                    // User is not logged in - show login icon
                    this.showLoginIcon(navbar, loginIcon);
                }
                console.log('✅ Navbar updated successfully');
            } else {
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(tryUpdate, 200);
                } else {
                    console.warn('⚠️ Could not find navbar elements after multiple attempts');
                }
            }
        };

        tryUpdate();
    }

    showUserDropdown(navbar, loginIcon) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;

        // Remove existing dropdown if any
        const existingDropdown = navbar.querySelector('.user-dropdown-container');
        if (existingDropdown) {
            existingDropdown.remove();
        }

        // Helper to determine admin status. For the demo the seeded admin email is treated as admin.
        const isAdmin = (user) => {
            if (!user) return false;
            // If role property exists, honor it
            if (user.role && user.role.toLowerCase() === 'admin') return true;
            // Fallback: seeded admin email
            return user.email === 'admin@example.com';
        };

        const adminLink = isAdmin(currentUser) ? `
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

        // Replace login icon with dropdown
        if (!navbar.querySelector('.user-dropdown-container')) {
            loginIcon.style.display = 'none';
            navbar.insertAdjacentHTML('beforeend', dropdownHTML);
        }

        // Add event listeners
        this.setupDropdownEvents();
    }

    showLoginIcon(navbar, loginIcon) {
        // Remove dropdown if exists
        const dropdown = navbar.querySelector('.user-dropdown-container');
        if (dropdown) {
            dropdown.remove();
        }

        // Show login icon
        loginIcon.style.display = 'flex';
    }

    setupDropdownEvents() {
        const trigger = document.querySelector('.user-dropdown-trigger');
        const menu = document.querySelector('.user-dropdown-menu');
        const logoutBtn = document.querySelector('.logout-btn');

        if (trigger && menu) {
            // Toggle dropdown on click
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                menu.classList.toggle('active');
            });

            // Close dropdown when clicking outside
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

    // ===============================
    //   Helper Functions
    // ===============================
    getUsers() {
        const usersStr = localStorage.getItem(this.storageKeys.users);
        return usersStr ? JSON.parse(usersStr) : [];
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===============================
    //   Cart Integration
    // ===============================
    checkLoginForCheckout() {
        if (this.isLoggedIn()) {
            return true;
        } else {
            this.requireLogin('Please login to complete your purchase');
            return false;
        }
    }

    // ===============================
    //   Debug Functions
    // ===============================
    clearAllData() {
        localStorage.removeItem(this.storageKeys.users);
        localStorage.removeItem(this.storageKeys.currentUser);
        localStorage.removeItem(this.storageKeys.isLoggedIn);
        console.log('🗑️ All auth data cleared');
    }

    getAllUsers() {
        return this.getUsers();
    }
}

// ===============================
//   Global Authentication Instance
// ===============================
const authSystem = new AuthSystem();

// Make it globally available
window.authSystem = authSystem;

// ===============================
//   Form Handlers
// ===============================
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

                // Update navbar immediately
                setTimeout(() => {
                    authSystem.updateNavbar();
                }, 100);

                // Redirect after success
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

                // Update navbar immediately
                setTimeout(() => {
                    authSystem.updateNavbar();
                }, 100);

                // Redirect after success
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

    // Debug: Log auth state on page load
    console.log('🔍 Auth Debug Info:');
    console.log('- Is logged in:', authSystem.isLoggedIn());
    console.log('- Current user:', authSystem.getCurrentUser());
    console.log('- Storage keys exist:', {
        users: !!localStorage.getItem('apsara_users'),
        currentUser: !!localStorage.getItem('apsara_current_user'),
        isLoggedIn: !!localStorage.getItem('apsara_is_logged_in')
    });
});

console.log('🚀 Auth.js loaded successfully');
