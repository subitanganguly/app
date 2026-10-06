
// =====================================================
// FIREBASE CONFIG
// =====================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


// =====================================================
// FIREBASE CONFIGURATION
// =====================================================

const firebaseConfig = {

    apiKey: "AIzaSyCDZoBecmF5q3xibgtJm5bwOLyI9x7nzCU",

    authDomain: "toribill.firebaseapp.com",

    databaseURL: "https://toribill-default-rtdb.firebaseio.com",

    projectId: "toribill",

    storageBucket: "toribill.firebasestorage.app",

    messagingSenderId: "887198449730",

    appId: "1:887198449730:web:998881b905423af6886ddb"

};


// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);


// =====================================================
// FIREBASE AUTH
// =====================================================

const auth = getAuth(app);


// =====================================================
// REALTIME DATABASE
// =====================================================

const db = getDatabase(app);


// =====================================================
// LOGOUT FUNCTION
// =====================================================

async function logoutUser() {

    try {

        // Sign out from Firebase Authentication
        await signOut(auth);

        // Remove saved user profile
        sessionStorage.removeItem("userProfile");

        // Go to login page
        window.location.href = "login.html";

    } catch (error) {

        console.error("Logout failed:", error);

        // Even if Firebase logout fails,
        // remove the local session
        sessionStorage.removeItem("userProfile");

        window.location.href = "login.html";
    }
}


// =====================================================
// EXPORT
// =====================================================

export {
    app,
    auth,
    db,
    logoutUser
};



