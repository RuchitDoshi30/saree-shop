/**
 * Authentication System for Apsara Creations
 * FIXED VERSION - Consistent session management using sessionStorage + cookies
 * Handles login, signup, logout, and session management
 */

class AuthSystem {
    constructor() {
        // Base path for GitHub Pages
        this.REPO_BASE = '/saree-shop/';

        // In-memory storage for current session
        this.memory = {
            currentUser: null,
            isLoggedIn: false,
            sessionTimeout: null
        };

        this.init();
    }

    /**
     * Cookie utilities - used ONLY for persistent login state flag
     */
    setCookie(name, value, days) {
        const expires = days
            ? `; expires=${new Date(Date.now() + days * 864e5).toUTCString()}`
            : '';
        document.cookie = `${name}=${value || ''}${expires}; path=/`;
    }

    getCookie(name) {
        const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()\[\]\\\/\\+^])/g, '\\$1')}=([^;]*)`));
        return match ? decodeURIComponent(match[1]) : null;
    }

    deleteCookie(name) {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    }

    init() {
        console.log('🔐 Auth system initializing...');

        // Initialize default users in localStorage (persistent across sessions)
        this.initializeDefaultUsers();

        // Restore active session from sessionStorage
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

        console.log('✅ Auth system initialized');
    }

    initializeDefaultUsers() {
        // Check if users already exist in localStorage
        let users = this.getUsersFromStorage();

        if (!users || users.length === 0) {
            users = [
                {
                    id: 'admin-' + Date.now(),
                    email: 'admin@example.com',
                    password: 'admin123',
                    role: 'admin',
                    name: 'Administrator',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'user-' + Date.now(),
                    email: 'user@example.com',
                    password: 'user123',
                    role: 'user',
                    name: 'Demo User',
                    createdAt: new Date().toISOString()
                }
            ];

            localStorage.setItem('apsara_users', JSON.stringify(users));
            console.log('🔧 Default users initialized in localStorage');
        }
    }

    getUsersFromStorage() {
        try {
            const usersJson = localStorage.getItem('apsara_users');
            return usersJson ? JSON.parse(usersJson) : [];
        } catch (e) {
            console.error('Error reading users from storage:', e);
            return [];
        }
    }

    saveUsersToStorage(users) {
        try {
            localStorage.setItem('apsara_users', JSON.stringify(users));
        } catch (e) {
            console.error('Error saving users to storage:', e);
        }
    }

    restoreSession() {
        try {
            // Check sessionStorage for active session (cleared on tab close)
            const sessionData = sessionStorage.getItem('apsara_session');

            if (sessionData) {
                const session = JSON.parse(sessionData);
                const sessionAge = Date.now() - new Date(session.timestamp).getTime();

                // Session valid for 30 minutes
                if (sessionAge < 30 * 60 * 1000) {
                    this.memory.currentUser = session.user;
                    this.memory.isLoggedIn = true;

                    // Set cookie flag to indicate logged in state
                    this.setCookie('apsara_logged_in', 'true', 1);

                    console.log('✅ Session restored for:', session.user.email);
                    return;
                }
            }

            // No valid session - ensure clean state
            this.clearSession();
            console.log('ℹ️ No active session found');

        } catch (e) {
            console.warn('Could not restore session:', e);
            this.clearSession();
        }
    }

    saveSession() {
        try {
            if (this.memory.currentUser && this.memory.isLoggedIn) {
                sessionStorage.setItem('apsara_session', JSON.stringify({
                    user: this.memory.currentUser,
                    timestamp: new Date().toISOString()
                }));

                // Update cookie flag
                this.setCookie('apsara_logged_in', 'true', 1);
            }
        } catch (e) {
            console.warn('Could not save session:', e);
        }
    }

    clearSession() {
        try {
            // Clear sessionStorage
            sessionStorage.removeItem('apsara_session');

            // Clear cookie flag
            this.deleteCookie('apsara_logged_in');

            // Clear memory
            this.memory.currentUser = null;
            this.memory.isLoggedIn = false;

        } catch (e) {
            console.warn('Could not clear session:', e);
        }
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
            document.addEventListener(event, resetTimeout, { passive: true, once: true });
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
            const users = this.getUsersFromStorage();
            if (users.find(user => user.email === email)) {
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

            // Save user to localStorage
            users.push(newUser);
            this.saveUsersToStorage(users);

            console.log('✅ Account created successfully for:', email);

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

            const users = this.getUsersFromStorage();
            const user = users.find(u =>
                u.email === email && u.password === password
            );

            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Set current user and create session
            this.setCurrentUser(user);

            console.log('🔓 User logged in:', user.email);

            return { success: true, message: 'Login successful!' };

        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    logout() {
        console.log('🚪 Logging out user...');

        // Clear session
        this.clearSession();

        // Update navbar
        this.updateNavbar();

        // Redirect to login page
        try {
            window.location.replace(this.REPO_BASE + 'pages/login.html');
        } catch (e) {
            window.location.href = this.REPO_BASE + 'pages/login.html';
        }
    }

    setCurrentUser(user) {
        if (!user) return;

        this.memory.currentUser = user;
        this.memory.isLoggedIn = true;
        this.saveSession();
        this.setupSessionTimeout();
        
        // Only update navbar for non-admin pages
        if (!window.location.pathname.includes('admin-dashboard.html')) {
            this.updateNavbar();
        }
    }

    getCurrentUser() {
        return this.memory.currentUser;
    }

    isLoggedIn() {
        return this.memory.isLoggedIn && this.memory.currentUser !== null;
    }

    requireLogin(redirectMessage = 'Please login to continue', requireAdmin = false) {
        if (!this.isLoggedIn()) {
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
        // Get the current page path
        const currentPath = window.location.pathname;
        
        // Skip navbar update on admin pages
        if (currentPath.includes('admin-dashboard.html')) {
            return;
        }

        let attempts = 0;
        const maxAttempts = 3; // Reduced from 10 to 3

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
                    setTimeout(tryUpdate, 100); // Reduced from 200ms to 100ms
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
                    <a href="${this.REPO_BASE}pages/settings.html" class="dropdown-item">
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
        return this.getUsersFromStorage();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getAllUsers() {
        return this.getUsers();
    }

    static validatePassword(password) {
        return password && password.length >= 6;
    }
}

// Form validation functions
function validateEmail(input) {
    const validationMessage = document.getElementById('email-validation');
    if (!input.value) {
        validationMessage.textContent = 'Email is required';
        validationMessage.className = 'validation-message validation-error';
        return false;
    }

    if (!input.checkValidity()) {
        validationMessage.textContent = 'Please enter a valid email address';
        validationMessage.className = 'validation-message validation-error';
        return false;
    }

    validationMessage.textContent = 'Email format is valid';
    validationMessage.className = 'validation-message validation-success';
    return true;
}

function validatePassword(input) {
    const validationMessage = document.getElementById('password-validation');
    if (!input.value) {
        validationMessage.textContent = 'Password is required';
        validationMessage.className = 'validation-message validation-error';
        return false;
    }

    if (input.value.length < 6) {
        validationMessage.textContent = 'Password must be at least 6 characters long';
        validationMessage.className = 'validation-message validation-error';
        return false;
    }

    validationMessage.textContent = 'Password meets requirements';
    validationMessage.className = 'validation-message validation-success';
    return true;
}

function validateConfirmPassword(input) {
    const validationMessage = document.getElementById('confirm-password-validation');
    const password = document.getElementById('password').value;

    if (!input.value) {
        validationMessage.textContent = 'Please confirm your password';
        validationMessage.className = 'validation-message validation-error';
        return false;
    }

    if (input.value !== password) {
        validationMessage.textContent = 'Passwords do not match';
        validationMessage.className = 'validation-message validation-error';
        return false;
    }

    validationMessage.textContent = 'Passwords match';
    validationMessage.className = 'validation-message validation-success';
    return true;
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

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const errorDiv = document.getElementById('login-error');
            const successDiv = document.getElementById('login-success');

            // Validate form inputs
            const isEmailValid = validateEmail(emailInput);
            const isPasswordValid = validatePassword(passwordInput);

            if (!isEmailValid || !isPasswordValid) {
                errorDiv.textContent = 'Please fix the validation errors before submitting.';
                errorDiv.style.display = 'block';
                successDiv.style.display = 'none';
                return;
            }

            const email = emailInput.value;
            const password = passwordInput.value;

            const result = authSystem.login(email, password);

            if (result.success) {
                if (successDiv) {
                    successDiv.textContent = result.message;
                    successDiv.style.display = 'block';
                }
                if (errorDiv) {
                    errorDiv.style.display = 'none';
                }

                // Redirect to the intended page or home
                const redirectTo = sessionStorage.getItem('auth_redirect_to') || authSystem.REPO_BASE + 'pages/index.html';
                sessionStorage.removeItem('auth_redirect_to');

                setTimeout(() => {
                    window.location.href = redirectTo;
                }, 500);
            } else {
                if (errorDiv) {
                    errorDiv.textContent = result.message;
                    errorDiv.style.display = 'block';
                }
                if (successDiv) {
                    successDiv.style.display = 'none';
                }
            }
        });
    }

    // Signup form handler
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirm-password');
            const errorDiv = document.getElementById('signup-error');
            const successDiv = document.getElementById('signup-success');

            // Validate form inputs
            const isEmailValid = validateEmail(emailInput);
            const isPasswordValid = validatePassword(passwordInput);
            const isConfirmPasswordValid = validateConfirmPassword(confirmPasswordInput);

            if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
                errorDiv.textContent = 'Please fix the validation errors before submitting.';
                errorDiv.style.display = 'block';
                successDiv.style.display = 'none';
                return;
            }

            const email = emailInput.value;
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            const result = authSystem.signup(email, password, confirmPassword);

            if (result.success) {
                if (successDiv) {
                    successDiv.textContent = result.message;
                    successDiv.style.display = 'block';
                }
                if (errorDiv) {
                    errorDiv.style.display = 'none';
                }

                // Auto-login after signup
                setTimeout(() => {
                    const loginResult = authSystem.login(email, password);
                    if (loginResult.success) {
                        const redirectTo = sessionStorage.getItem('auth_redirect_to') || authSystem.REPO_BASE + 'pages/index.html';
                        sessionStorage.removeItem('auth_redirect_to');
                        window.location.href = redirectTo;
                    }
                }, 1000);
            } else {
                if (errorDiv) {
                    errorDiv.textContent = result.message;
                    errorDiv.style.display = 'block';
                }
                if (successDiv) {
                    successDiv.style.display = 'none';
                }
            }
        });
    }

    // Logout button handler (for standalone buttons)
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            authSystem.logout();
        });
    }

    // Admin dashboard access check
    const adminDashboard = document.getElementById('admin-dashboard');
    if (adminDashboard) {
        authSystem.requireLogin('Admin access is required to view this page', true);
    }

    // Checkout page login check
    const checkoutPage = document.getElementById('checkout-page');
    if (checkoutPage) {
        authSystem.checkLoginForCheckout();
    }
});

console.log('🚀 Auth.js loaded successfully (Fixed Version with consistent session management)');