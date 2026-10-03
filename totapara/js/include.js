
/* =====================================================
   LOAD COMMON HTML
===================================================== */

async function loadInclude(
    elementId,
    file
) {

    const element =
        document.getElementById(elementId);


    if (!element) {
        return;
    }


    try {

        const response =
            await fetch(file);


        if (!response.ok) {

            throw new Error(
                `Failed to load ${file}`
            );

        }


        element.innerHTML =
            await response.text();


    } catch (error) {

        console.error(
            "Include error:",
            error
        );

    }

}


/* =====================================================
   CHECK AUTHENTICATION
===================================================== */

function checkAuthentication() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop();
    
    // Pages that don't require authentication
    const publicPages = ['login.html', 'register.html'];
    
    // If on login page, skip auth check
    if (publicPages.includes(currentPage)) {
        return true;
    }

    // Check if user is authenticated
    const session = sessionStorage.getItem('currentUser');
    
    if (!session) {
        // Redirect to login page
        window.location.href = 'login.html';
        return false;
    }

    try {
        const user = JSON.parse(session);
        // Store user in global variable for access
        window.currentUser = user;
        return true;
    } catch (e) {
        window.location.href = 'login.html';
        return false;
    }
}


/* =====================================================
   FILTER SIDEBAR BY PERMISSIONS
===================================================== */

async function filterSidebarByPermissions() {
    const user = window.currentUser;
    if (!user) return;
    
    // Get all sidebar nav items
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    
    // Get user permissions
    let permissions = [];
    
    try {
        const userData = await getUserByUserId(user.userId);
        if (userData) {
            if (userData.isAdmin) {
                // Admin has access to all - show everything
                navItems.forEach(item => {
                    item.classList.remove('d-none');
                });
                return;
            }
            permissions = userData.permissions || [];
        }
    } catch (error) {
        console.error('Error getting permissions:', error);
        return;
    }
    
    // Show only items that user has permission for
    navItems.forEach(item => {
        const page = item.dataset.page;
        if (!page) return;
        
        // Check if user has permission for this page
        if (permissions.includes(page)) {
            item.classList.remove('d-none');
        } else {
            item.classList.add('d-none');
        }
    });
}


/* =====================================================
   LOAD SIDEBAR + FOOTER
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        // CHECK AUTHENTICATION FIRST
        const isAuthenticated = checkAuthentication();
        
        // If not authenticated, stop loading further
        if (!isAuthenticated) {
            return;
        }

        await loadInclude(
            "sidebar-container",
            "includes/sidebar.html"
        );

        await loadInclude(
            "footer-container",
            "includes/footer.html"
        );

        setupMobileSidebar();
        
        // Set active page after sidebar loads
        setTimeout(setActivePage, 100);
        
        // Update sidebar with user info
        setTimeout(updateSidebarUserInfo, 150);
        
        // Filter sidebar by permissions (show only permitted items)
        setTimeout(filterSidebarByPermissions, 200);
    }
);


/* =====================================================
   UPDATE SIDEBAR WITH USER INFO
===================================================== */

function updateSidebarUserInfo() {
    const user = window.currentUser;
    if (!user) return;
    
    // Update user display in sidebar
    const userDisplay = document.getElementById('sidebarUserDisplay');
    if (userDisplay) {
        userDisplay.textContent = user.userId || 'User';
    }
    
    const userBadge = document.getElementById('sidebarUserBadge');
    if (userBadge) {
        userBadge.textContent = user.isAdmin ? 'Admin' : 'User';
        userBadge.className = `badge ${user.isAdmin ? 'bg-primary' : 'bg-secondary'} ms-2`;
    }
}


/* =====================================================
   SET ACTIVE PAGE
===================================================== */

// function setActivePage() {

//     // Get current page filename
//     var currentPage = window.location.pathname.split('/').pop();
    
//     // If empty or index, set to index.html
//     if (currentPage === '' || currentPage === '/') {
//         currentPage = 'index.html';
//     }

//     // Get all sidebar links
//     var links = document.querySelectorAll('.sidebar-nav .nav-link');

//     links.forEach(function(link) {

//         var href = link.getAttribute('href');

//         // Remove active class from all links
//         link.classList.remove('active');

//         // Check if this link matches current page
//         if (href === currentPage) {
//             link.classList.add('active');
//         }

//         // Handle index.html special case
//         if (currentPage === 'index.html' && href === 'index.html') {
//             link.classList.add('active');
//         }

//     });

// }


function setActivePage() {

    let currentPage = window.location.pathname.split('/').pop();

    if (currentPage === '' || currentPage === '/') {
        currentPage = 'index.html';
    }

    const links =
        document.querySelectorAll('.sidebar-nav .nav-link');

    let attendanceActive = false;
    let companyActive = false;

    links.forEach(function (link) {

        const href = link.getAttribute('href');

        link.classList.remove('active');

        if (href === currentPage) {

            link.classList.add('active');

            // Attendance pages
            if (
                href === 'attendance.html' ||
                href === 'auto-attendance.html'
            ) {
                attendanceActive = true;
            }

            // Company pages
            if (
                href === 'company-prize.html' ||
                href === 'find-costing.html'
            ) {
                companyActive = true;
            }
        }

    });


    // ==========================================
    // ATTENDANCE MENU
    // ==========================================

    const attendanceMenu =
        document.getElementById('attendanceMenu');

    if (attendanceMenu) {

        const attendanceCollapse =
            bootstrap.Collapse.getOrCreateInstance(
                attendanceMenu,
                { toggle: false }
            );

        if (attendanceActive) {
            attendanceCollapse.show();
        } else {
            attendanceCollapse.hide();
        }
    }


    // ==========================================
    // COMPANY MENU
    // ==========================================

    const companyMenu =
        document.getElementById('companyMenu');

    if (companyMenu) {

        const companyCollapse =
            bootstrap.Collapse.getOrCreateInstance(
                companyMenu,
                { toggle: false }
            );

        if (companyActive) {
            companyCollapse.show();
        } else {
            companyCollapse.hide();
        }
    }

}


/* =====================================================
   MOBILE SIDEBAR
===================================================== */

function setupMobileSidebar() {

    const button =
        document.getElementById(
            "mobileMenuBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function() {

            const sidebar =
                document.getElementById(
                    "sidebar"
                );


            if (sidebar) {

                sidebar.classList.toggle(
                    "show"
                );

            }

        }
    );

}


/* =====================================================
   LOGOUT FUNCTION (Global)
===================================================== */

function logoutUser() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}


/* =====================================================
   GET USER BY USER ID (from db.js)
===================================================== */

// This function is already defined in db.js
// But we need to make sure it's accessible
// The function getUserByUserId() is available from db.js