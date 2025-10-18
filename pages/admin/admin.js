// Admin-wide JavaScript utilities
document.addEventListener('DOMContentLoaded', () => {
    // ENFORCE ADMIN AUTH: prevent access to admin pages unless logged in as admin
    try {
        // If authSystem is available, use it to require login
        if (window.authSystem && typeof window.authSystem.requireLogin === 'function') {
            const ok = window.authSystem.requireLogin('Please login as an admin to access the admin area', true);
            if (!ok) return; // abort further admin.js execution; requireLogin redirected
            // Basic admin check: for this static demo we treat the seeded admin email as admin
            const cur = window.authSystem.getCurrentUser ? window.authSystem.getCurrentUser() : null;
            const adminEmail = 'admin@example.com';
            if (!cur || cur.email !== adminEmail) {
                // Not an admin - redirect to login (or home) with message
                try { window.location.replace('/pages/login.html'); } catch(e) { window.location.href = '/pages/login.html'; }
                return;
            }
        } else {
            // Fallback: if no authSystem, check localStorage keys conservatively
            const isLoggedIn = localStorage.getItem('apsara_is_logged_in') === 'true';
            const raw = localStorage.getItem('apsara_current_user');
            const cur = raw ? JSON.parse(raw) : null;
            if (!isLoggedIn || !cur || cur.email !== 'admin@example.com') {
                try { window.location.replace('/pages/login.html'); } catch(e) { window.location.href = '/pages/login.html'; }
                return;
            }
        }
    } catch (authErr) {
        console.warn('Admin auth check failed, continuing cautiously', authErr);
    }

    // Mobile access restriction: if the viewport is small, redirect to a blocking page.
    try {
        const isMobileView = window.matchMedia('(max-width: 767px)').matches;
    const currentPath = location.pathname.replace(/\//g, '/');
        const isMobileBlockPage = currentPath.endsWith('/pages/admin/mobile-block.html') || currentPath.endsWith('/mobile-block.html');
        const urlParams = new URLSearchParams(location.search);
        const override = urlParams.get('allow_mobile') === '1';
        if (isMobileView && !isMobileBlockPage && !override) {
            // Relative redirect to the admin mobile block page
            const base = location.origin + location.pathname.replace(/\/[^/]*$/, '/');
            // Try to build a sane relative URL
            let target = '/pages/admin/mobile-block.html';
            // If the site is served under a subfolder, attempt a relative path
            if (location.pathname.includes('/pages/admin/')) target = location.pathname.replace(/\/[^/]*$/, '/mobile-block.html');
            // Final redirect (replace so back button doesn't loop)
            location.replace(target);
            return; // stop executing the rest of admin.js on mobile
        }
    } catch (e) {
        // if anything goes wrong, fall back to normal behavior
        console.warn('mobile redirect check failed', e);
    }
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    // find the menu button and its icon (support both fa-bars or other icons)
    const menuBtn = document.querySelector('.top-navbar button#menuToggle') || document.querySelector('.top-navbar button');
    const menuIcon = menuBtn ? menuBtn.querySelector('i') : null;
    if (!sidebar || !mainContent || !menuBtn) return;

    const computed = window.getComputedStyle(sidebar);
    const originalWidth = computed.width || '250px';
    const collapsedWidth = '70px';
    const navItems = sidebar.querySelectorAll('.nav-item');

    // Inject compact-sidebar CSS (keeps markup edits minimal)
    const injectedCss = `
        .sidebar { transition: width 0.28s; }
        .main-content { transition: margin-left 0.28s; }
        .sidebar .nav-item { transition: padding 0.22s, opacity 0.22s; }
        .sidebar.collapsed { width: ${collapsedWidth} !important; }
        .main-content.collapsed { margin-left: ${collapsedWidth} !important; }
        .sidebar .nav-label { display: inline-block; }
        .sidebar.collapsed .nav-label { display: none !important; }
        .sidebar.collapsed .sidebar-logo { text-align: center; }
        /* hide brand text but keep icon when collapsed */
        .sidebar .sidebar-logo .brand-text { display: inline-block; margin-left: 0.5rem; }
        .sidebar.collapsed .sidebar-logo .brand-text { display: none !important; }
        /* hide logout text when collapsed, keep the button / icon visible */
        .sidebar .logout-btn .logout-label { display: inline-block; margin-left: 0.5rem; }
        .sidebar.collapsed .logout-btn .logout-label { display: none !important; }

        /* Responsive: off-canvas behaviour for small screens */
        @media (max-width: 991px) {
            .sidebar { transform: translateX(-100%); width: var(--sidebar-width); position: fixed; left: 0; top: 0; height: 100vh; z-index: 1100; }
            .sidebar.open-mobile { transform: translateX(0); box-shadow: 0 6px 24px rgba(0,0,0,0.15); }
            .main-content { margin-left: 0 !important; }
            .main-content.collapsed { margin-left: 0 !important; }
            .admin-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.42); z-index: 1050; opacity: 0; transition: opacity .18s; pointer-events: none; }
            .admin-backdrop.show { opacity: 1; pointer-events: auto; }
        }
        /* Aesthetic modal tweaks for admin pages */
        .modal-content { border-radius: 12px; box-shadow: 0 12px 40px rgba(13, 38, 59, 0.12); border: none; overflow: hidden; }
        .modal-header { background: linear-gradient(90deg, rgba(49,130,206,0.06), rgba(56,189,248,0.02)); border-bottom: 1px solid rgba(15, 23, 42, 0.04); padding: 1rem 1.25rem; }
        .modal-title { font-weight: 600; color: #0f172a; }
        .modal-body { padding: 1.25rem; color: #334155; }
        .modal-footer { padding: 0.75rem 1.25rem; border-top: none; background: #ffffff; }
        .modal .btn-primary { background: linear-gradient(180deg,#2563eb,#1e40af); border: none; box-shadow: 0 6px 18px rgba(37,99,235,0.12); }
        .modal .btn-secondary { background: #f1f5f9; color: #0f172a; border: none; }
        .modal-backdrop.show { opacity: 0.45 !important; }
        @media (max-width: 576px) {
            .modal-dialog { margin: 1.2rem; }
            .modal-content { border-radius: 10px; }
        }
    `;
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-generated-by', 'admin.js');
    styleEl.appendChild(document.createTextNode(injectedCss));
    document.head.appendChild(styleEl);

    // Create backdrop element for mobile off-canvas
    let backdrop = document.querySelector('.admin-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'admin-backdrop';
        document.body.appendChild(backdrop);
    }

    // Expose sidebar width as a CSS variable used by the injected rules
    try {
        sidebar.style.setProperty('--sidebar-width', originalWidth || '250px');
    } catch (e) {
        // ignore
    }

    // Ensure nav labels exist: wrap raw text nodes into <span class="nav-label"> if missing
    navItems.forEach(item => {
        // If a .nav-label already exists, skip
        if (item.querySelector('.nav-label')) return;
        // Move any direct text nodes (non-empty) into a span.nav-label
        const walker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                // ignore text inside icons or inside existing label
                if (node.parentElement && node.parentElement.classList.contains('nav-label')) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        const texts = [];
        while (walker.nextNode()) texts.push(walker.currentNode);
        if (texts.length) {
            const span = document.createElement('span');
            span.className = 'nav-label';
            // concatenate text nodes with single space
            span.textContent = texts.map(t => t.nodeValue.trim()).join(' ');
            // Remove original text nodes
            texts.forEach(t => t.parentNode && t.parentNode.removeChild(t));
            item.appendChild(span);
        }
    });

    // Wrap sidebar-brand text into .brand-text so we can hide it when collapsed
    const sidebarLogo = sidebar.querySelector('.sidebar-logo');
    if (sidebarLogo && !sidebarLogo.querySelector('.brand-text')) {
        const walkerB = document.createTreeWalker(sidebarLogo, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                if (node.parentElement && node.parentElement.classList && node.parentElement.classList.contains('brand-text')) return NodeFilter.FILTER_REJECT;
                // ignore text within <i> icons
                if (node.parentElement && node.parentElement.tagName.toLowerCase() === 'i') return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        const textsB = [];
        while (walkerB.nextNode()) textsB.push(walkerB.currentNode);
        if (textsB.length) {
            const spanB = document.createElement('span');
            spanB.className = 'brand-text';
            spanB.textContent = textsB.map(t => t.nodeValue.trim()).join(' ');
            textsB.forEach(t => t.parentNode && t.parentNode.removeChild(t));
            sidebarLogo.appendChild(spanB);
        }
    }

    // Wrap logout button label into .logout-label for collapse hiding; add title for accessibility
    const logoutBtn = sidebar.querySelector('.logout-btn');
    if (logoutBtn && !logoutBtn.querySelector('.logout-label')) {
        const walkerL = document.createTreeWalker(logoutBtn, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                if (node.parentElement && node.parentElement.classList && node.parentElement.classList.contains('logout-label')) return NodeFilter.FILTER_REJECT;
                if (node.parentElement && node.parentElement.tagName.toLowerCase() === 'i') return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        const textsL = [];
        while (walkerL.nextNode()) textsL.push(walkerL.currentNode);
        if (textsL.length) {
            const spanL = document.createElement('span');
            spanL.className = 'logout-label';
            spanL.textContent = textsL.map(t => t.nodeValue.trim()).join(' ');
            textsL.forEach(t => t.parentNode && t.parentNode.removeChild(t));
            logoutBtn.appendChild(spanL);
        }
        // ensure icon button has an accessible title
        logoutBtn.setAttribute('title', logoutBtn.querySelector('.logout-label') ? logoutBtn.querySelector('.logout-label').textContent.trim() : 'Logout');
    }
    // Ensure logout uses the shared auth system if available.
    // Attach the same handler to every element with class .logout-btn (sidebar buttons and any other logout controls)
    try {
        // Remove any global window.logout to avoid conflicts
        try { if (window.logout) delete window.logout; } catch(e) {}

        const handleLogoutClick = (ev) => {
            ev && ev.preventDefault();
            if (!confirm('Are you sure you want to logout?')) return;
            if (window.authSystem && typeof window.authSystem.logout === 'function') {
                window.authSystem.logout();
                return;
            }
            // Fallback: clear known session keys and navigate to login (replace history to avoid back nav)
            try { localStorage.removeItem('apsara_current_user'); } catch(e) {}
            try { localStorage.removeItem('apsara_is_logged_in'); } catch(e) {}
            try { window.location.replace('/pages/login.html'); } catch(e) { window.location.href = '/pages/login.html'; }
        };

        // Query all logout buttons and attach listener
        const allLogoutBtns = Array.from(document.querySelectorAll('.logout-btn'));
        allLogoutBtns.forEach(btn => {
            // remove inline onclick handlers if present and avoid double-binding
            btn.removeAttribute('onclick');
            btn.dataset._logoutBound = 'true';
            btn.addEventListener('click', handleLogoutClick);
        });
    } catch (e) {
        console.warn('Failed to attach logout handlers', e);
    }

    // When a page is restored from the bfcache (back/forward), browsers may show stale state.
    // Use the 'pageshow' event to re-validate authentication and force a redirect if the user is no longer logged in.
    window.addEventListener('pageshow', (event) => {
        try {
            if (window.authSystem && typeof window.authSystem.requireLogin === 'function') {
                // This will redirect if the user is not logged in
                window.authSystem.requireLogin('Please login to continue');
            } else {
                const isLoggedIn = localStorage.getItem('apsara_is_logged_in') === 'true';
                const cur = localStorage.getItem('apsara_current_user');
                const user = cur ? JSON.parse(cur) : null;
                if (!isLoggedIn || !user || user.email !== 'admin@example.com') {
                    try { window.location.replace('/pages/login.html'); } catch(e) { window.location.href = '/pages/login.html'; }
                }
            }
        } catch (err) {
            console.warn('pageshow auth recheck failed', err);
        }
    });

    // Load saved state
    let collapsed = localStorage.getItem('adminSidebarCollapsed') === 'true';
    let mobileOpen = false;
    const mobileMq = window.matchMedia('(max-width: 991px)');

    const applyState = () => {
        if (collapsed) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('collapsed');
        }
        // accessibility
        menuBtn.setAttribute('aria-expanded', (!collapsed).toString());
        // Toggle menu icon to 'X' when collapsed, back to 'bars' when expanded
        if (menuIcon) {
            // If mobile off-canvas is open show the X icon; otherwise reflect collapsed state
            if (mobileOpen) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-xmark');
            } else if (collapsed) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-xmark');
            } else {
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            }
        }
        // set titles for tooltips when collapsed
        navItems.forEach(item => {
            const label = item.querySelector('.nav-label');
            if (label) {
                item.setAttribute('title', label.textContent.trim());
            }
        });

        // ensure mobile classes/backdrop match mobileOpen
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

    const openMobileSidebar = () => {
        mobileOpen = true;
        sidebar.classList.add('open-mobile');
        backdrop.classList.add('show');
        // show X icon
        if (menuIcon) { menuIcon.classList.remove('fa-bars'); menuIcon.classList.add('fa-xmark'); }
    };

    const closeMobileSidebar = () => {
        mobileOpen = false;
        sidebar.classList.remove('open-mobile');
        backdrop.classList.remove('show');
        // restore icon based on collapsed state
        if (menuIcon) {
            if (collapsed) { menuIcon.classList.remove('fa-bars'); menuIcon.classList.add('fa-xmark'); }
            else { menuIcon.classList.remove('fa-xmark'); menuIcon.classList.add('fa-bars'); }
        }
    };

    menuBtn.addEventListener('click', () => {
        // On small screens open the off-canvas sidebar; on desktop toggle collapse
        if (mobileMq.matches) {
            if (mobileOpen) closeMobileSidebar();
            else openMobileSidebar();
            return;
        }
        collapsed = !collapsed;
        localStorage.setItem('adminSidebarCollapsed', collapsed);
        applyState();
    });

    // Close mobile sidebar when backdrop is clicked
    backdrop.addEventListener('click', () => {
        if (mobileOpen) closeMobileSidebar();
    });

    // Close mobile sidebar on Escape
    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && mobileOpen) closeMobileSidebar();
    });

    // Optional: keyboard shortcut (Ctrl/Cmd + S)
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 's' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            collapsed = !collapsed;
            localStorage.setItem('adminSidebarCollapsed', collapsed);
            applyState();
        }
    });

    // Small screen behavior: slide sidebar
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMobileSidebar = (e) => {
        if (e.matches) {
            sidebar.style.position = 'fixed';
            sidebar.style.zIndex = '1000';
            // On mobile, when collapsed, hide it off-canvas to the left; otherwise show
            sidebar.style.left = collapsed ? `-${collapsedWidth}` : '0';
        } else {
            sidebar.style.position = '';
            sidebar.style.left = '';
        }
    };
    if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', handleMobileSidebar);
    else if (mediaQuery.addListener) mediaQuery.addListener(handleMobileSidebar);
    handleMobileSidebar(mediaQuery);

});
