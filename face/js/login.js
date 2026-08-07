
//====================================================
// login.js
// Firebase Login & Signup Modal
//====================================================

//----------------------------
// Firebase Config
//----------------------------
const firebaseConfig = {
    apiKey: "AIzaSyCz5lIlliOl7-IS2OB1bfvG_eRglpYDVhY",
    authDomain: "face-7d2c4.firebaseapp.com",
    databaseURL: "https://face-7d2c4-default-rtdb.firebaseio.com",
    projectId: "face-7d2c4",
    storageBucket: "face-7d2c4.firebasestorage.app",
    messagingSenderId: "923290930785",
    appId: "1:923290930785:web:c58bfd55043c72c2eea420"
};

//----------------------------
// Initialize Firebase
//----------------------------
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.database();

// Flag to prevent multiple auth state updates during login
let isProcessingLogin = false;

const loginStyle = document.createElement("style");

loginStyle.innerHTML = `

/* Background */
#loginModal{
    backdrop-filter: blur(12px);
}

#loginModal .modal-dialog{
    max-width:480px;
}

/* Glass Card */
#loginModal .modal-content{
    background:rgba(255,255,255,.15);
    backdrop-filter:blur(30px);
    -webkit-backdrop-filter:blur(30px);
    border:1px solid rgba(255,255,255,.25);
    box-shadow:
    0 10px 40px rgba(0,0,0,.25),
    inset 0 1px rgba(255,255,255,.35);
    border-radius:28px;
    overflow:hidden;
}

/* Decorative Glow */
#loginModal .modal-content::before{
    content:"";
    position:absolute;
    width:220px;
    height:220px;
    background:linear-gradient(135deg,#00dbff,#7b2ff7);
    border-radius:50%;
    top:-120px;
    right:-90px;
    filter:blur(40px);
    opacity:.55;
}

#loginModal .modal-content::after{
    content:"";
    position:absolute;
    width:180px;
    height:180px;
    background:linear-gradient(135deg,#ff9800,#ff3d71);
    border-radius:50%;
    bottom:-90px;
    left:-80px;
    filter:blur(40px);
    opacity:.45;
}

/* Header */
#loginModal .modal-header{
    border:none;
    background:transparent;
    position:relative;
    z-index:2;
}

/* Body */
#loginModal .modal-body{
    position:relative;
    z-index:2;
}

/* Input */
#loginModal .form-control{
    background:rgba(255,255,255,.18);
    border:1px solid rgba(255,255,255,.25);
    color:#fff;
    height:40px;
    border-radius:15px;
}

#loginModal .form-control::placeholder{
    color:rgba(255,255,255,.7);
}

#loginModal .form-control:focus{
    background:rgba(255,255,255,.22);
    border-color:#00d2ff;
    box-shadow:0 0 0 .2rem rgba(0,210,255,.25);
    color:#fff;
}

/* Labels */
#loginModal label{
    color:#fff;
    font-weight:600;
}

/* Buttons */
#loginModal .btn{
    height:52px;
    border-radius:15px;
    font-weight:600;
    transition:.35s;
    position: relative;
}

#loginModal .btn-primary{
    background:linear-gradient(45deg,#00c6ff,#0072ff);
    border:none;
}

#loginModal .btn-success{
    background:linear-gradient(45deg,#00c853,#64dd17);
    border:none;
}

#loginModal .btn:hover{
    transform:translateY(-2px);
    box-shadow:0 10px 20px rgba(0,0,0,.25);
}

#loginModal .btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

/* Button Loader */
#loginModal .btn .spinner-border {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    vertical-align: middle;
}

/* Tabs */
#loginModal .nav-tabs{
    border:none;
    background:rgba(255,255,255,.1);
    border-radius:15px;
    padding:5px;
}

#loginModal .nav-link{
    border:none;
    color:#fff;
    border-radius:12px;
}

#loginModal .nav-link.active{
    background:linear-gradient(45deg,#00c6ff,#0072ff);
    color:#fff;
}

/* Close */
#loginModal .btn-close{
    filter:invert(1);
}

/* Remember Me Checkbox */
#loginModal .remember-me {
    color: #fff;
    margin-bottom: 15px;
}

#loginModal .remember-me input[type="checkbox"] {
    width: 18px;
    height: 18px;
    margin-right: 8px;
    accent-color: #00c6ff;
    cursor: pointer;
}

#loginModal .remember-me label {
    cursor: pointer;
    user-select: none;
    font-weight: 500;
}

`;

document.head.appendChild(loginStyle);

//====================================================
// Create Modal
//====================================================

function createLoginModal() {

    if (document.getElementById("loginModal"))
        return;

    document.body.insertAdjacentHTML("beforeend", `

<div class="modal fade" id="loginModal" tabindex="-1">

<div class="modal-dialog modal-dialog-centered">

<div class="modal-content">

<div class="modal-header">

<div class="text-center w-100 mb-3">

<img src="img/logo.png"

style="
width:90px;
height:90px;
border-radius:50%;
box-shadow:0 0 25px rgba(255,255,255,.4);
animation:floatLogo 3s ease-in-out infinite;
">

</div>


<button
    type="button"
    class="btn-close position-absolute top-0 end-0 m-3"
    data-bs-dismiss="modal"
    aria-label="Close">
</button>

</div>

<div class="modal-body">

<ul class="nav nav-tabs mb-4">

<li class="nav-item w-50">

<button
id="loginTab"
class="nav-link active w-100"
onclick="showLogin()">

Sign In

</button>

</li>

<li class="nav-item w-50">

<button
id="signupTab"
class="nav-link w-100"
onclick="showSignup()">

Sign Up

</button>

</li>

</ul>

<!-- LOGIN -->

<div id="loginPage">

<div class="mb-3">

<label>Email</label>

<input
type="email"
id="loginEmail"
class="form-control"
placeholder="Enter email">

</div>

<div class="mb-3">

<label>Password</label>

<input
type="password"
id="loginPassword"
class="form-control"
placeholder="Password">

</div>

<div class="remember-me">
    <input type="checkbox" id="rememberMe">
    <label for="rememberMe">Remember Me</label>
</div>

<button
class="btn btn-primary w-100"
onclick="login()">

Sign In

</button>

</div>

<!-- SIGNUP -->

<div
id="signupPage"
style="display:none;">

<div class="mb-2">

<label>Full Name</label>

<input
id="name"
class="form-control"
placeholder="Full Name">

</div>

<div class="mb-2">

<label>Mobile</label>

<input
id="mobile"
class="form-control"
placeholder="Mobile Number">

</div>

<div class="mb-2">

<label>Email</label>

<input
id="email"
type="email"
class="form-control"
placeholder="Email">

</div>


<div class="mb-3">

<label>Password</label>

<input
id="password"
type="password"
class="form-control"
placeholder="Password">

</div>

<button
class="btn btn-success w-100"
onclick="register()">

Create Account

</button>

</div>

</div>

</div>

</div>

</div>

`);
}

//====================================================
// Open Modal
//====================================================

function openLogin() {

    // Save current page
    sessionStorage.setItem("redirectAfterLogin", window.location.href);

    createLoginModal();

    const modal = new bootstrap.Modal(
        document.getElementById("loginModal")
    );

    // Check for remembered email
    loadRememberedEmail();

    modal.show();
}

//====================================================
// Close Modal
//====================================================

function closeLogin() {

    const modal = bootstrap.Modal.getInstance(
        document.getElementById("loginModal")
    );

    if (modal)
        modal.hide();
}

//====================================================
// Change Pages
//====================================================

function showLogin() {

    document.getElementById("loginPage").style.display = "block";
    document.getElementById("signupPage").style.display = "none";

    document
        .getElementById("loginTab")
        .classList.add("active");

    document
        .getElementById("signupTab")
        .classList.remove("active");
    
    // Load remembered email when switching to login
    loadRememberedEmail();
}

function showSignup() {

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("signupPage").style.display = "block";

    document
        .getElementById("signupTab")
        .classList.add("active");

    document
        .getElementById("loginTab")
        .classList.remove("active");
}

//====================================================
// Remember Me Functions
//====================================================

function saveRememberedEmail(email) {
    localStorage.setItem("rememberedEmail", email);
}

function loadRememberedEmail() {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberMeCheckbox = document.getElementById("rememberMe");
    const emailInput = document.getElementById("loginEmail");
    
    if (rememberedEmail && emailInput) {
        emailInput.value = rememberedEmail;
        if (rememberMeCheckbox) {
            rememberMeCheckbox.checked = true;
        }
    }
}

function clearRememberedEmail() {
    localStorage.removeItem("rememberedEmail");
}

//====================================================
// Register New User
//====================================================

function register() {

    let name = document.getElementById("name").value.trim();
    let mobile = document.getElementById("mobile").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    //----------------------------
    // Validation
    //----------------------------

    if (name === "") {
        alertError("Enter Full Name");
        return;
    }

    if (mobile === "") {
        alertError("Enter Mobile Number");
        return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
        alertError("Enter a valid 10-digit mobile number");
        return;
    }

    if (email === "") {
        alertError("Enter Email");
        return;
    }

    if (password.length < 6) {
        alertError("Password must be at least 6 characters");
        return;
    }

    //----------------------------
    // Get button and show loader
    //----------------------------

    const btn = event.target;
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Creating Account...';

    //----------------------------
    // Create User
    //----------------------------

    auth.createUserWithEmailAndPassword(email, password)

    .then((userCredential) => {

        const user = userCredential.user;
        const uid = user.uid;

        //----------------------------
        // Save User Information
        //----------------------------

        return db.ref("registration/" + uid).set({

            uid: uid,

            name: name,

            mobile: mobile,

            email: email.toLowerCase(),

            type: "user",

            status: "active",

            createdAt: firebase.database.ServerValue.TIMESTAMP

        });

    })

    .then(() => {

        alert("Registration Successful.");

        //----------------------------
        // Clear Form
        //----------------------------

        document.getElementById("name").value = "";
        document.getElementById("mobile").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";

        //----------------------------
        // Return to Login Page
        //----------------------------

        showLogin();

    })

    .catch((error) => {

        console.error(error);

        alertError(error.message);

    })
    
    .finally(() => {
        // Restore button
        btn.disabled = false;
        btn.innerHTML = originalText;
    });

}


//====================================================
// Login
//====================================================

function login() {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    //----------------------------
    // Validation
    //----------------------------

    if (email === "") {
        alertError("Enter Email");
        return;
    }

    if (password === "") {
        alertError("Enter Password");
        return;
    }

    //----------------------------
    // Handle Remember Me
    //----------------------------

    if (rememberMe) {
        saveRememberedEmail(email);
    } else {
        clearRememberedEmail();
    }

    //----------------------------
    // Disable Button & Show Loader
    //----------------------------

    const btn = event.target;
    const oldText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Signing In...';

    // Set flag to prevent auth state from showing disabled message
    isProcessingLogin = true;

    //----------------------------
    // Firebase Login
    //----------------------------

    auth.signInWithEmailAndPassword(email, password)

    .then((userCredential) => {

        const uid = userCredential.user.uid;

        //----------------------------
        // Read User Info
        //----------------------------

        return db.ref("registration/" + uid)
            .once("value");

    })

    .then((snapshot) => {

        if (!snapshot.exists()) {

            auth.signOut();

            throw new Error("User data not found.");

        }

        const user = snapshot.val();

        //----------------------------
        // ⭐ FIX: Save everything FIRST before checking
        //----------------------------
        localStorage.setItem("uid", user.uid);
        localStorage.setItem("name", user.name);
        localStorage.setItem("email", user.email);
        localStorage.setItem("mobile", user.mobile);
        localStorage.setItem("type", user.type);
        localStorage.setItem("status", user.status);


        //----------------------------
        // Status Check
        //----------------------------
        if (user.status !== "active") {

            localStorage.clear();

            auth.signOut();

            throw new Error("Your account has been disabled.");

        }

        //----------------------------
        // Success
        //----------------------------

        alertSuccess("Login Successful");

        closeLogin();

        //----------------------------
        // Redirect
        //----------------------------

        const redirectUrl =
        sessionStorage.getItem("redirectAfterLogin") || "index.html";

        sessionStorage.removeItem("redirectAfterLogin");

        window.location.href = redirectUrl;

    })

    .catch((error) => {

        alert(error.message);

    })

    .finally(() => {

        btn.disabled = false;

        btn.innerHTML = oldText;

        isProcessingLogin = false;

    });

}

//====================================================
// Check Login
//====================================================

function checkLogin() {

    auth.onAuthStateChanged(function(user) {

        if (!user) {

            return;

        }

        db.ref("registration/" + user.uid)

        .once("value")

        .then(function(snapshot) {

            if (!snapshot.exists())
                return;

            const data = snapshot.val();

            localStorage.setItem("uid", data.uid);
            localStorage.setItem("name", data.name);
            localStorage.setItem("email", data.email);
            localStorage.setItem("mobile", data.mobile);
            localStorage.setItem("type", data.type);
            // ⭐ FIX: Add status
            localStorage.setItem("status", data.status);

        });

    });

}

//====================================================
// Logout
//====================================================

function logout() {

    auth.signOut()

    .then(function() {

        localStorage.removeItem("uid");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("mobile");
        localStorage.removeItem("type");
        localStorage.removeItem("status");
        // Don't remove rememberedEmail on logout

        alert("Logged Out");

        window.location.reload();

    })

    .catch(function(error) {

        alert(error.message);

    });

}


//====================================================
// Current User
//====================================================

function getCurrentUser() {

    return {
    uid: localStorage.getItem("uid"),
    name: localStorage.getItem("name"),
    email: localStorage.getItem("email"),
    mobile: localStorage.getItem("mobile"),
    type: localStorage.getItem("type"),
    status: localStorage.getItem("status")
};

}

//====================================================
// Is Logged In
//====================================================

function isLoggedIn() {

    return localStorage.getItem("uid") !== null;

}

//====================================================
// Require Login
//====================================================

function requireLogin() {

    auth.onAuthStateChanged(function(user) {

        if (!user) {

            localStorage.clear();

            window.location.href = "index.html";

        }

    });

}

//====================================================
// Update User Information
//====================================================

function refreshCurrentUser() {

    const user = auth.currentUser;

    if (!user)
        return;

    db.ref("registration/" + user.uid)

    .once("value")

    .then(function(snapshot) {

        if (!snapshot.exists())
            return;

        const data = snapshot.val();

        localStorage.setItem("uid", data.uid);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", data.email);
        localStorage.setItem("mobile", data.mobile);
        localStorage.setItem("type", data.type);
        // ⭐ FIX: Add status
        localStorage.setItem("status", data.status);

    });

}

//====================================================
// Authentication State Listener
//====================================================

auth.onAuthStateChanged(function(user) {

    // ⭐ FIX: Skip if we're in the middle of a login process
    if (isProcessingLogin) {
        return;
    }

    if (user) {

        db.ref("registration/" + user.uid)

        .once("value")

        .then(function(snapshot) {

            if (!snapshot.exists()) {

                auth.signOut();

                return;

            }

            const data = snapshot.val();

            localStorage.setItem("uid", data.uid);
            localStorage.setItem("name", data.name);
            localStorage.setItem("email", data.email);
            localStorage.setItem("mobile", data.mobile);
            localStorage.setItem("type", data.type);
            // ⭐ FIX: Add status
            localStorage.setItem("status", data.status);

        });

    } else {

        localStorage.removeItem("uid");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("mobile");
        localStorage.removeItem("type");
        // ⭐ FIX: Remove status
        localStorage.removeItem("status");

    }

});

//====================================================
// Close Modal Automatically After Login
//====================================================

document.addEventListener("click", function(e) {

    if (e.target.id === "loginModal") {

        closeLogin();

    }

});

//====================================================
// Open Login Shortcut
//====================================================

window.openLogin = openLogin;

//====================================================
// Logout Shortcut
//====================================================

window.logout = logout;

//====================================================
// Check Login Shortcut
//====================================================

window.checkLogin = checkLogin;

//====================================================
// Current User Shortcut
//====================================================

window.getCurrentUser = getCurrentUser;

//====================================================
// Logged In Shortcut
//====================================================

window.isLoggedIn = isLoggedIn;

//====================================================
// Initialize
//====================================================

document.addEventListener("DOMContentLoaded", function() {

    createLoginModal();

    checkLogin();

});
