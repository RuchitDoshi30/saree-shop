/**
 * Admin Panel JavaScript - FIXED VERSION
 * Enhanced security, proper auth checks, and mobile restrictions
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Admin panel initializing...');

    // ============================================
    // CRITICAL: Enforce Admin Authentication
    // ============================================
    let authCheckAttempts = 0;
    const MAX_AUTH_ATTEMPTS = 5;

    const enforceAdminAuth = () => {
        try {
            // Check retry attempts
            if (authCheckAttempts >= MAX_AUTH_ATTEMPTS) {
                console.error('❌ Auth system failed to load after multiple attempts');
                redirectToLogin('System error. Please try again later.');
                return false;
            }

            // Wait for auth system to be ready
            if (typeof window.authSystem === 'undefined') {
                authCheckAttempts++;
                console.warn(`⚠️ Auth system not yet loaded, retrying... (Attempt ${authCheckAttempts}/${MAX_AUTH_ATTEMPTS})`);
                setTimeout(enforceAdminAuth, 200 * authCheckAttempts); // Increase delay with each attempt
                return false;
            }

            // Reset attempts counter since auth system is now available
            authCheckAttempts = 0;

            // Check if user is logged in
            if (!window.authSystem.isLoggedIn()) {
                console.warn('⚠️ User not logged in');
                redirectToLogin('Please login to access admin area');
                return false;
            }

            // Get current user
            const currentUser = window.authSystem.getCurrentUser();
            if (!currentUser) {
                console.warn('⚠️ No current user found');
                redirectToLogin('Session expired. Please login again');
                return false;
            }

            // Check if user is admin
            const isAdmin = currentUser.role === 'admin' || 
                           currentUser.email === 'admin@example.com';
            
            if (!isAdmin) {
                console.warn('⚠️ Non-admin user attempting access:', currentUser.email);
                redirectToLogin('Admin access required');
                return false;
            }

            console.log('✅ Admin authentication verified:', currentUser.email);
            return true;

        } catch (error) {
            console.error('❌ Auth check failed:', error);
            redirectToLogin('Authentication error');
            return false;
        }
    };

    // ============================================
    // Mobile Access Restriction
    // ============================================
    const enforceMobileRestriction = () => {
        try {
            const isMobile = window.matchMedia('(max-width: 767px)').matches;
            const currentPath = window.location.pathname;
            const isMobileBlockPage = currentPath.includes('mobile-block.html');
            const urlParams = new URLSearchParams(window.location.search);
            const override = urlParams.get('allow_mobile') === '1';

            if (isMobile && !isMobileBlockPage && !override) {
                console.warn('⚠️ Mobile device detected, redirecting to block page');
                const repoBase = window.authSystem?.REPO_BASE || '/saree-shop/';
                const blockPageUrl = repoBase + 'pages/mobile-block.html';
                window.location.replace(blockPageUrl);
                return false;
            }

            return true;
        } catch (error) {
            console.error('❌ Mobile check failed:', error);
            return true; // Allow access if check fails
        }
    };

    // ============================================
    // Helper: Redirect to Login
    // ============================================
    const redirectToLogin = (message) => {
        try {
            if (message) {
                sessionStorage.setItem('auth_redirect_message', message);
            }
            
            const repoBase = window.authSystem?.REPO_BASE || '/saree-shop/';
            const loginUrl = repoBase + 'pages/login.html';
            console.log('🔄 Redirecting to:', loginUrl);
            
            setTimeout(() => {
                window.location.replace(loginUrl);
            }, 100);
        } catch (error) {
            console.error('❌ Redirect failed:', error);
            window.location.href = '../pages/login.html';
        }
    };

    // ============================================
    // Execute Security Checks
    // ============================================
    if (!enforceAdminAuth()) {
        return; // Stop execution if auth fails
    }

    if (!enforceMobileRestriction()) {
        return; // Stop execution if mobile restriction applies
    }

    // ============================================
    // Page Show Event (Handle Back Button)
    // ============================================
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            console.log('🔄 Page restored from cache, rechecking auth...');
            enforceAdminAuth();
        }
    });

    // ============================================
    // Sidebar Collapse Functionality
    // ============================================
    const initSidebar = () => {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        const menuBtn = document.querySelector('#menuToggle, .top-navbar button');
        
        if (!sidebar || !mainContent || !menuBtn) {
            console.warn('⚠️ Sidebar elements not found');
            return;
        }

        const menuIcon = menuBtn.querySelector('i');
        
        // Get collapsed state from sessionStorage (not cookies)
        let collapsed = sessionStorage.getItem('adminSidebarCollapsed') === 'true';
        let mobileOpen = false;
        const mobileMq = window.matchMedia('(max-width: 991px)');

        // Inject CSS for sidebar behavior
        const style = document.createElement('style');
        style.textContent = `
            .sidebar { transition: width 0.28s; width: 250px; }
            .main-content { transition: margin-left 0.28s; }
            .sidebar.collapsed { width: 70px !important; }
            .main-content.collapsed { margin-left: 70px !important; }
            .sidebar .nav-item { transition: padding 0.22s; }
            .sidebar .nav-label { display: inline-block; }
            .sidebar.collapsed .nav-label { display: none !important; }
            
            @media (max-width: 991px) {
                .sidebar { 
                    transform: translateX(-100%); 
                    position: fixed; 
                    z-index: 1100; 
                }
                .sidebar.open-mobile { 
                    transform: translateX(0); 
                    box-shadow: 0 6px 24px rgba(0,0,0,0.15); 
                }
                .main-content { margin-left: 0 !important; }
                .admin-backdrop { 
                    position: fixed; 
                    inset: 0; 
                    background: rgba(0,0,0,0.42); 
                    z-index: 1050; 
                    opacity: 0; 
                    transition: opacity .18s; 
                    pointer-events: none; 
                }
                .admin-backdrop.show { opacity: 1; pointer-events: auto; }
            }
        `;
        document.head.appendChild(style);

        // Create backdrop
        let backdrop = document.querySelector('.admin-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'admin-backdrop';
            document.body.appendChild(backdrop);
        }

        // Apply state
        const applyState = () => {
            sidebar.classList.toggle('collapsed', collapsed);
            mainContent.classList.toggle('collapsed', collapsed);
            
            if (menuIcon) {
                if (mobileOpen || collapsed) {
                    menuIcon.className = 'fas fa-xmark';
                } else {
                    menuIcon.className = 'fas fa-bars';
                }
            }

            if (mobileOpen && mobileMq.matches) {
                sidebar.classList.add('open-mobile');
                backdrop.classList.add('show');
            } else {
                sidebar.classList.remove('open-mobile');
                backdrop.classList.remove('show');
                mobileOpen = false;
            }
        };

        applyState();

        // Menu button click
        menuBtn.addEventListener('click', () => {
            if (mobileMq.matches) {
                mobileOpen = !mobileOpen;
            } else {
                collapsed = !collapsed;
                sessionStorage.setItem('adminSidebarCollapsed', collapsed);
            }
            applyState();
        });

        // Close on backdrop click
        backdrop.addEventListener('click', () => {
            mobileOpen = false;
            applyState();
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileOpen) {
                mobileOpen = false;
                applyState();
            }
        });

        console.log('✅ Sidebar initialized');
    };

    // ============================================
    // Logout Functionality
    // ============================================
    const initLogout = () => {
        const logoutButtons = document.querySelectorAll('.logout-btn');
        
        logoutButtons.forEach(btn => {
            // Remove any existing onclick handlers
            btn.removeAttribute('onclick');
            
            // Add new event listener
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (confirm('Are you sure you want to logout?')) {
                    console.log('🚪 Logging out...');
                    
                    if (window.authSystem) {
                        window.authSystem.logout();
                    } else {
                        // Fallback logout
                        sessionStorage.clear();
                        localStorage.removeItem('apsara_session');
                        window.location.href = 'login.html';
                    }
                }
            });
        });

        console.log('✅ Logout handlers attached to', logoutButtons.length, 'buttons');
    };

    // ============================================
    // Theme Toggle
    // ============================================
    const initThemeToggle = () => {
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            // Restore saved theme
            const savedTheme = sessionStorage.getItem('adminTheme');
            if (savedTheme === 'dark') {
                themeToggle.classList.remove('fa-moon');
                themeToggle.classList.add('fa-sun');
                document.body.classList.add('dark-theme');
            }

            themeToggle.addEventListener('click', function() {
                this.classList.toggle('fa-moon');
                this.classList.toggle('fa-sun');
                document.body.classList.toggle('dark-theme');
                
                // Save theme preference
                const isDark = this.classList.contains('fa-sun');
                sessionStorage.setItem('adminTheme', isDark ? 'dark' : 'light');
                
                console.log('🎨 Theme toggled:', isDark ? 'dark' : 'light');
            });
        }
    };

    // ============================================
    // Session Monitoring
    // ============================================
    const initSessionMonitoring = () => {
        // Check session every 5 minutes
        const checkInterval = setInterval(() => {
            if (!window.authSystem?.isLoggedIn()) {
                console.warn('⚠️ Session expired during use');
                clearInterval(checkInterval);
                alert('Your session has expired. Please login again.');
                redirectToLogin('Session expired');
            }
        }, 5 * 60 * 1000);

        console.log('✅ Session monitoring started');
    };

    // ============================================
    // User Info Display
    // ============================================
    const updateUserDisplay = () => {
        const currentUser = window.authSystem?.getCurrentUser();
        if (!currentUser) return;

        // Update user circle with initials or icon
        const userCircles = document.querySelectorAll('.fa-user-circle');
        userCircles.forEach(circle => {
            const parent = circle.parentElement;
            if (parent && !parent.dataset.updated) {
                parent.dataset.updated = 'true';
                parent.title = `Logged in as ${currentUser.email}`;
            }
        });
    };

    // ============================================
    // Initialize All Components
    // ============================================
    try {
        initSidebar();
        initLogout();
        initThemeToggle();
        initSessionMonitoring();
        updateUserDisplay();
        
        console.log('✅ Admin panel initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing admin panel:', error);
    }
});

// ============================================
// Global Error Handler
// ============================================
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    
    // Handle auth errors globally
    if (event.error?.message?.includes('auth') || 
        event.error?.message?.includes('session')) {
        console.warn('Auth-related error detected');
    }
});

console.log('🚀 Admin.js loaded (Fixed Version with consistent auth checks)');