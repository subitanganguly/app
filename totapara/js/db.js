// // =====================================================
// // CENTRAL DATABASE
// // =====================================================

// let APP_NAME = "tea-estate-management";

// const DB_VERSION = 7; // Increased version to add companyPrize store


// // Object Stores
// const STORES = {
//     PROJECTS: "projects",
//     EMPLOYEES: "employees",
//     DESIGNATIONS: "designations",
//     PHASES: "phases",
//     ATTENDANCE: "attendance",
//     SALARY_SETTINGS: "salarySettings",
//     EXPENSES: "expenses",
//     PRIZE_SETTINGS: "prizeSettings",
//     COMPANY_PRIZE: "companyPrize"  // Added companyPrize store
// };


// // =====================================================
// // LOAD SETTINGS
// // =====================================================

// async function loadSettings() {

//     try {

//         const response =
//             await fetch("js/settings.json");

//         if (!response.ok) {
//             throw new Error("settings.json not found");
//         }

//         const settings =
//             await response.json();

//         if (settings.appName) {
//             APP_NAME = settings.appName;
//         }

//         console.log(
//             "Application:",
//             APP_NAME
//         );

//     } catch (error) {

//         console.error(
//             "Settings error:",
//             error
//         );

//     }

// }


// // =====================================================
// // OPEN DATABASE
// // =====================================================

// function openDB() {

//     return new Promise((resolve, reject) => {

//         const request =
//             indexedDB.open(
//                 APP_NAME,
//                 DB_VERSION
//             );


//         // =============================================
//         // DATABASE CREATE / UPGRADE
//         // =============================================

//         request.onupgradeneeded = function (event) {

//             const db =
//                 event.target.result;

//             const oldVersion =
//                 event.oldVersion;


//             // -----------------------------------------
//             // PROJECTS
//             // -----------------------------------------

//             if (
//                 !db.objectStoreNames.contains(
//                     STORES.PROJECTS
//                 )
//             ) {

//                 const store =
//                     db.createObjectStore(
//                         STORES.PROJECTS,
//                         {
//                             keyPath: "id",
//                             autoIncrement: true
//                         }
//                     );

//                 store.createIndex(
//                     "name",
//                     "name",
//                     {
//                         unique: false
//                     }
//                 );

//             }


//             // -----------------------------------------
//             // EMPLOYEES
//             // -----------------------------------------

//             if (
//                 !db.objectStoreNames.contains(
//                     STORES.EMPLOYEES
//                 )
//             ) {

//                 const store =
//                     db.createObjectStore(
//                         STORES.EMPLOYEES,
//                         {
//                             keyPath: "id",
//                             autoIncrement: true
//                         }
//                     );

//                 store.createIndex(
//                     "name",
//                     "name",
//                     {
//                         unique: false
//                     }
//                 );

//                 store.createIndex(
//                     "mobile",
//                     "mobile",
//                     {
//                         unique: false
//                     }
//                 );

//             }


//             // -----------------------------------------
//             // DESIGNATIONS
//             // -----------------------------------------

//             if (
//                 !db.objectStoreNames.contains(
//                     STORES.DESIGNATIONS
//                 )
//             ) {

//                 const store =
//                     db.createObjectStore(
//                         STORES.DESIGNATIONS,
//                         {
//                             keyPath: "id",
//                             autoIncrement: true
//                         }
//                     );

//                 store.createIndex(
//                     "name",
//                     "name",
//                     {
//                         unique: false
//                     }
//                 );

//             }


//             // -----------------------------------------
//             // PHASES
//             // -----------------------------------------

//             if (
//                 !db.objectStoreNames.contains(
//                     STORES.PHASES
//                 )
//             ) {

//                 const store =
//                     db.createObjectStore(
//                         STORES.PHASES,
//                         {
//                             keyPath: "id",
//                             autoIncrement: true
//                         }
//                     );

//                 store.createIndex(
//                     "name",
//                     "name",
//                     {
//                         unique: false
//                     }
//                 );

//                 store.createIndex(
//                     "time",
//                     "time",
//                     {
//                         unique: false
//                     }
//                 );

//                 store.createIndex(
//                     "projectId",
//                     "projectId",
//                     {
//                         unique: false
//                     }
//                 );

//             }


//             // -----------------------------------------
//             // ATTENDANCE
//             // -----------------------------------------

//             if (
//                 !db.objectStoreNames.contains(
//                     STORES.ATTENDANCE
//                 )
//             ) {

//                 const store =
//                     db.createObjectStore(
//                         STORES.ATTENDANCE,
//                         {
//                             keyPath: "id",
//                             autoIncrement: true
//                         }
//                     );

//                 store.createIndex(
//                     "projectId",
//                     "projectId",
//                     {
//                         unique: false
//                     }
//                 );

//                 store.createIndex(
//                     "date",
//                     "date",
//                     {
//                         unique: false
//                     }
//                 );

//                 store.createIndex(
//                     "phaseId",
//                     "phaseId",
//                     {
//                         unique: false
//                     }
//                 );

//                 // Composite index for quick lookups
//                 store.createIndex(
//                     "projectDatePhase",
//                     ["projectId", "date", "phaseId"],
//                     {
//                         unique: false
//                     }
//                 );

//                 console.log(
//                     "✅ Attendance store created"
//                 );

//             }


//             // -----------------------------------------
//             // SALARY SETTINGS
//             // -----------------------------------------

//             if (
//                 !db.objectStoreNames.contains(
//                     STORES.SALARY_SETTINGS
//                 )
//             ) {

//                 const store =
//                     db.createObjectStore(
//                         STORES.SALARY_SETTINGS,
//                         {
//                             keyPath: "id",
//                             autoIncrement: true
//                         }
//                     );

//                 store.createIndex(
//                     "projectId",
//                     "projectId",
//                     {
//                         unique: false
//                     }
//                 );

//                 store.createIndex(
//                     "valueName",
//                     "valueName",
//                     {
//                         unique: false
//                     }
//                 );

//                 store.createIndex(
//                     "condition",
//                     "condition",
//                     {
//                         unique: false
//                     }
//                 );

//                 console.log(
//                     "✅ Salary Settings store created"
//                 );

//             }


//             // -----------------------------------------
//             // EXPENSES
//             // -----------------------------------------

//             if (
//                 !db.objectStoreNames.contains(
//                     STORES.EXPENSES
//                 )
//             ) {

//                 const store =
//                     db.createObjectStore(
//                         STORES.EXPENSES,
//                         {
//                             keyPath: "id",
//                             autoIncrement: true
//                         }
//                     );

//                 store.createIndex(
//                     "projectId",
//                     "projectId",
//                     {
//                         unique: false
//                     }
//                 );

//                 store.createIndex(
//                     "date",
//                     "date",
//                     {
//                         unique: false
//                     }
//                 );

//                 store.createIndex(
//                     "category",
//                     "category",
//                     {
//                         unique: false
//                     }
//                 );

//                 store.createIndex(
//                     "type",
//                     "type",
//                     {
//                         unique: false
//                     }
//                 );

//                 // Composite index for quick lookups by project and date
//                 store.createIndex(
//                     "projectDate",
//                     ["projectId", "date"],
//                     {
//                         unique: false
//                     }
//                 );

//                 console.log(
//                     "✅ Expenses store created"
//                 );

//             }


//             // -----------------------------------------
//             // PRIZE SETTINGS
//             // -----------------------------------------

//             if (
//                 !db.objectStoreNames.contains(
//                     STORES.PRIZE_SETTINGS
//                 )
//             ) {

//                 const store =
//                     db.createObjectStore(
//                         STORES.PRIZE_SETTINGS,
//                         {
//                             keyPath: "id",
//                             autoIncrement: true
//                         }
//                     );

//                 store.createIndex(
//                     "projectId",
//                     "projectId",
//                     {
//                         unique: true  // One prize setting per project
//                     }
//                 );

//                 store.createIndex(
//                     "rate",
//                     "rate",
//                     {
//                         unique: false
//                     }
//                 );

//                 console.log(
//                     "✅ Prize Settings store created"
//                 );

//             }


//             // -----------------------------------------
//             // COMPANY PRIZE (NEW)
//             // -----------------------------------------

//             if (
//                 !db.objectStoreNames.contains(
//                     STORES.COMPANY_PRIZE
//                 )
//             ) {

//                 const store =
//                     db.createObjectStore(
//                         STORES.COMPANY_PRIZE,
//                         {
//                             keyPath: "id",
//                             autoIncrement: true
//                         }
//                     );

//                 store.createIndex(
//                     "projectId",
//                     "projectId",
//                     {
//                         unique: false
//                     }
//                 );

//                 store.createIndex(
//                     "date",
//                     "date",
//                     {
//                         unique: false
//                     }
//                 );

//                 store.createIndex(
//                     "totalAmount",
//                     "totalAmount",
//                     {
//                         unique: false
//                     }
//                 );

//                 // Composite index for quick lookups
//                 store.createIndex(
//                     "projectDate",
//                     ["projectId", "date"],
//                     {
//                         unique: false
//                     }
//                 );

//                 console.log(
//                     "✅ Company Prize store created"
//                 );

//             }


//             console.log(
//                 "✅ Database stores created/updated (Version: " + DB_VERSION + ")"
//             );

//         };


//         request.onsuccess = function (event) {

//             const db =
//                 event.target.result;

//             console.log(
//                 "✅ Database opened:",
//                 APP_NAME
//             );

//             resolve(db);

//         };


//         request.onerror = function () {

//             console.error(
//                 "❌ Database error:",
//                 request.error
//             );

//             reject(request.error);

//         };

//     });

// }





// =====================================================
// CENTRAL DATABASE
// =====================================================

let APP_NAME = "tea-estate-management";

const DB_VERSION = 8; // Increased version to add users store


// Object Stores
const STORES = {
    PROJECTS: "projects",
    EMPLOYEES: "employees",
    DESIGNATIONS: "designations",
    PHASES: "phases",
    ATTENDANCE: "attendance",
    SALARY_SETTINGS: "salarySettings",
    EXPENSES: "expenses",
    PRIZE_SETTINGS: "prizeSettings",
    COMPANY_PRIZE: "companyPrize",
    USERS: "users"  // Added users store
};


// =====================================================
// LOAD SETTINGS
// =====================================================

async function loadSettings() {

    try {

        const response =
            await fetch("js/settings.json");

        if (!response.ok) {
            throw new Error("settings.json not found");
        }

        const settings =
            await response.json();

        if (settings.appName) {
            APP_NAME = settings.appName;
        }

        console.log(
            "Application:",
            APP_NAME
        );

    } catch (error) {

        console.error(
            "Settings error:",
            error
        );

    }

}


// =====================================================
// OPEN DATABASE
// =====================================================

function openDB() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open(
                APP_NAME,
                DB_VERSION
            );


        // =============================================
        // DATABASE CREATE / UPGRADE
        // =============================================

        request.onupgradeneeded = function (event) {

            const db =
                event.target.result;

            const oldVersion =
                event.oldVersion;


            // -----------------------------------------
            // PROJECTS
            // -----------------------------------------

            if (
                !db.objectStoreNames.contains(
                    STORES.PROJECTS
                )
            ) {

                const store =
                    db.createObjectStore(
                        STORES.PROJECTS,
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );

                store.createIndex(
                    "name",
                    "name",
                    {
                        unique: false
                    }
                );

            }


            // -----------------------------------------
            // EMPLOYEES
            // -----------------------------------------

            if (
                !db.objectStoreNames.contains(
                    STORES.EMPLOYEES
                )
            ) {

                const store =
                    db.createObjectStore(
                        STORES.EMPLOYEES,
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );

                store.createIndex(
                    "name",
                    "name",
                    {
                        unique: false
                    }
                );

                store.createIndex(
                    "mobile",
                    "mobile",
                    {
                        unique: false
                    }
                );

            }


            // -----------------------------------------
            // DESIGNATIONS
            // -----------------------------------------

            if (
                !db.objectStoreNames.contains(
                    STORES.DESIGNATIONS
                )
            ) {

                const store =
                    db.createObjectStore(
                        STORES.DESIGNATIONS,
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );

                store.createIndex(
                    "name",
                    "name",
                    {
                        unique: false
                    }
                );

            }


            // -----------------------------------------
            // PHASES
            // -----------------------------------------

            if (
                !db.objectStoreNames.contains(
                    STORES.PHASES
                )
            ) {

                const store =
                    db.createObjectStore(
                        STORES.PHASES,
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );

                store.createIndex(
                    "name",
                    "name",
                    {
                        unique: false
                    }
                );

                store.createIndex(
                    "time",
                    "time",
                    {
                        unique: false
                    }
                );

                store.createIndex(
                    "projectId",
                    "projectId",
                    {
                        unique: false
                    }
                );

            }


            // -----------------------------------------
            // ATTENDANCE
            // -----------------------------------------

            if (
                !db.objectStoreNames.contains(
                    STORES.ATTENDANCE
                )
            ) {

                const store =
                    db.createObjectStore(
                        STORES.ATTENDANCE,
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );

                store.createIndex(
                    "projectId",
                    "projectId",
                    {
                        unique: false
                    }
                );

                store.createIndex(
                    "date",
                    "date",
                    {
                        unique: false
                    }
                );

                store.createIndex(
                    "phaseId",
                    "phaseId",
                    {
                        unique: false
                    }
                );

                // Composite index for quick lookups
                store.createIndex(
                    "projectDatePhase",
                    ["projectId", "date", "phaseId"],
                    {
                        unique: false
                    }
                );

                console.log(
                    "✅ Attendance store created"
                );

            }


            // -----------------------------------------
            // SALARY SETTINGS
            // -----------------------------------------

            if (
                !db.objectStoreNames.contains(
                    STORES.SALARY_SETTINGS
                )
            ) {

                const store =
                    db.createObjectStore(
                        STORES.SALARY_SETTINGS,
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );

                store.createIndex(
                    "projectId",
                    "projectId",
                    {
                        unique: false
                    }
                );

                store.createIndex(
                    "valueName",
                    "valueName",
                    {
                        unique: false
                    }
                );

                store.createIndex(
                    "condition",
                    "condition",
                    {
                        unique: false
                    }
                );

                console.log(
                    "✅ Salary Settings store created"
                );

            }


            // -----------------------------------------
            // EXPENSES
            // -----------------------------------------

            if (
                !db.objectStoreNames.contains(
                    STORES.EXPENSES
                )
            ) {

                const store =
                    db.createObjectStore(
                        STORES.EXPENSES,
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );

                store.createIndex(
                    "projectId",
                    "projectId",
                    {
                        unique: false
                    }
                );

                store.createIndex(
                    "date",
                    "date",
                    {
                        unique: false
                    }
                );

                store.createIndex(
                    "category",
                    "category",
                    {
                        unique: false
                    }
                );

                store.createIndex(
                    "type",
                    "type",
                    {
                        unique: false
                    }
                );

                // Composite index for quick lookups by project and date
                store.createIndex(
                    "projectDate",
                    ["projectId", "date"],
                    {
                        unique: false
                    }
                );

                console.log(
                    "✅ Expenses store created"
                );

            }


            // -----------------------------------------
            // PRIZE SETTINGS
            // -----------------------------------------

            if (
                !db.objectStoreNames.contains(
                    STORES.PRIZE_SETTINGS
                )
            ) {

                const store =
                    db.createObjectStore(
                        STORES.PRIZE_SETTINGS,
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );

                store.createIndex(
                    "projectId",
                    "projectId",
                    {
                        unique: true  // One prize setting per project
                    }
                );

                store.createIndex(
                    "rate",
                    "rate",
                    {
                        unique: false
                    }
                );

                console.log(
                    "✅ Prize Settings store created"
                );

            }


            // -----------------------------------------
            // COMPANY PRIZE
            // -----------------------------------------

            if (
                !db.objectStoreNames.contains(
                    STORES.COMPANY_PRIZE
                )
            ) {

                const store =
                    db.createObjectStore(
                        STORES.COMPANY_PRIZE,
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );

                store.createIndex(
                    "projectId",
                    "projectId",
                    {
                        unique: false
                    }
                );

                store.createIndex(
                    "date",
                    "date",
                    {
                        unique: false
                    }
                );

                store.createIndex(
                    "totalAmount",
                    "totalAmount",
                    {
                        unique: false
                    }
                );

                // Composite index for quick lookups
                store.createIndex(
                    "projectDate",
                    ["projectId", "date"],
                    {
                        unique: false
                    }
                );

                console.log(
                    "✅ Company Prize store created"
                );

            }


            // -----------------------------------------
            // USERS (NEW)
            // -----------------------------------------

            if (
                !db.objectStoreNames.contains(
                    STORES.USERS
                )
            ) {

                const store =
                    db.createObjectStore(
                        STORES.USERS,
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );

                store.createIndex(
                    "userId",
                    "userId",
                    {
                        unique: true
                    }
                );

                store.createIndex(
                    "password",
                    "password",
                    {
                        unique: false
                    }
                );

                store.createIndex(
                    "isAdmin",
                    "isAdmin",
                    {
                        unique: false
                    }
                );

                store.createIndex(
                    "createdAt",
                    "createdAt",
                    {
                        unique: false
                    }
                );

                console.log(
                    "✅ Users store created"
                );

                // Create default admin user
                const defaultUser = {
                    userId: "TPTE0001",
                    password: "admin",
                    isAdmin: true,
                    createdAt: new Date().toISOString()
                };

                store.add(defaultUser);
                //console.log("✅ Default admin user created: TPTE0001");

            } else {
                // Check if users exist, if not create default admin
                const transaction = db.transaction(STORES.USERS, "readwrite");
                const store = transaction.objectStore(STORES.USERS);
                const countRequest = store.count();
                
                countRequest.onsuccess = function() {
                    if (countRequest.result === 0) {
                        const defaultUser = {
                            userId: "TPTE0001",
                            password: "admin",
                            isAdmin: true,
                            createdAt: new Date().toISOString()
                        };
                        store.add(defaultUser);
                        console.log("✅ Default admin user created: TPTE0001");
                    }
                };
            }


            console.log(
                "✅ Database stores created/updated (Version: " + DB_VERSION + ")"
            );

        };


        request.onsuccess = function (event) {

            const db =
                event.target.result;

            console.log(
                "✅ Database opened:",
                APP_NAME
            );

            resolve(db);

        };


        request.onerror = function () {

            console.error(
                "❌ Database error:",
                request.error
            );

            reject(request.error);

        };

    });

}


// =====================================================
// USER AUTHENTICATION FUNCTIONS
// =====================================================

// Get all users
async function getAllUsers() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.USERS, "readonly");
        const store = transaction.objectStore(STORES.USERS);
        const request = store.getAll();
        request.onsuccess = function() {
            db.close();
            resolve(request.result);
        };
        request.onerror = function() {
            db.close();
            reject(request.error);
        };
    });
}

// Get user by userId
async function getUserByUserId(userId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.USERS, "readonly");
        const store = transaction.objectStore(STORES.USERS);
        const index = store.index("userId");
        const request = index.get(userId);
        request.onsuccess = function() {
            db.close();
            resolve(request.result || null);
        };
        request.onerror = function() {
            db.close();
            reject(request.error);
        };
    });
}

// Add new user
async function addUser(user) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.USERS, "readwrite");
        const store = transaction.objectStore(STORES.USERS);
        const request = store.add(user);
        request.onsuccess = function() {
            db.close();
            resolve(request.result);
        };
        request.onerror = function() {
            db.close();
            reject(request.error);
        };
    });
}

// Update user
async function updateUser(user) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.USERS, "readwrite");
        const store = transaction.objectStore(STORES.USERS);
        const request = store.put(user);
        request.onsuccess = function() {
            db.close();
            resolve(request.result);
        };
        request.onerror = function() {
            db.close();
            reject(request.error);
        };
    });
}

// Delete user
async function deleteUser(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.USERS, "readwrite");
        const store = transaction.objectStore(STORES.USERS);
        const request = store.delete(id);
        request.onsuccess = function() {
            db.close();
            resolve();
        };
        request.onerror = function() {
            db.close();
            reject(request.error);
        };
    });
}

// Authenticate user
async function authenticateUser(userId, password) {
    const user = await getUserByUserId(userId);
    if (user && user.password === password) {
        return user;
    }
    return null;
}

// Generate next user ID (TPTE0001, TPTE0002, etc.)
async function generateNextUserId() {
    const users = await getAllUsers();
    const maxId = users.reduce((max, user) => {
        const num = parseInt(user.userId.replace('TPTE', ''));
        return num > max ? num : max;
    }, 0);
    const nextNum = maxId + 1;
    return 'TPTE' + String(nextNum).padStart(4, '0');
}

// Check if user is authenticated (session check)
function isAuthenticated() {
    const session = sessionStorage.getItem('currentUser');
    return session ? JSON.parse(session) : null;
}

// Logout user
function logoutUser() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Require authentication middleware
function requireAuth() {
    const user = isAuthenticated();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}




// =====================================================
// PERMISSION FUNCTIONS
// =====================================================

// Get user permissions
async function getUserPermissions(userId) {
    const user = await getUserByUserId(userId);
    if (!user) return [];
    if (user.isAdmin) {
        // Admin has access to all menus
        return getAllMenuIds();
    }
    return user.permissions || [];
}

// Check if user has permission for a specific menu
async function hasPermission(userId, menuId) {
    const user = await getUserByUserId(userId);
    if (!user) return false;
    if (user.isAdmin) return true;
    const permissions = user.permissions || [];
    return permissions.includes(menuId);
}


// Get all menu IDs (for admin)
function getAllMenuIds() {
    return [
        'dashboard', 'projects', 'employees', 'attendance', 'auto-attendance',
        'salary', 'expenses', 'company-prize', 'backup',
        'users', 'settings'
    ];
}

// Check if user can access a page
async function canAccessPage(userId, page) {
    const user = await getUserByUserId(userId);
    if (!user) return false;
    if (user.isAdmin) return true;
    const permissions = user.permissions || [];
    return permissions.includes(page);
}