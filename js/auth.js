/* ========================================
   ROYAL STORE V2
   AUTH.JS
   VERSION : 2.0
   BUILD : 2026.08.15
======================================== */


/* ========================================
   AUTH CONFIGURATION
======================================== */

const AUTH = {

    /* Login Settings */

    requireLogin: true,

    rememberUser: true,

    autoLogin: true,


    /* Validation */

    minimumNameLength: 3,

    mobileLength: 10,

    minimumPasswordLength: 6,


    /* Local Storage Keys */

    userKey: "royalUser",

    loginKey: "loggedIn"

};


/* ========================================
   DOM ELEMENTS
======================================== */

const loginForm = document.getElementById("login-form");

const signupForm = document.getElementById("signup-form");

const loginMobile = document.getElementById("login-mobile");

const loginPassword = document.getElementById("login-password");

const signupName = document.getElementById("signup-name");

const signupMobile = document.getElementById("signup-mobile");

const signupEmail = document.getElementById("signup-email");

const signupPassword = document.getElementById("signup-password");

const logoutButton = document.getElementById("logout-btn");


/* ========================================
   LOCAL STORAGE MANAGER
======================================== */

let currentUser = JSON.parse(

    localStorage.getItem(AUTH.userKey)

) || null;


function saveUser(userData) {

    localStorage.setItem(

        AUTH.userKey,

        JSON.stringify(userData)

    );

}


function loadUser() {

    return JSON.parse(

        localStorage.getItem(AUTH.userKey)

    );

}


function setLoginStatus(status) {

    localStorage.setItem(

        AUTH.loginKey,

        status

    );

}


function isLoggedIn() {

    return localStorage.getItem(

        AUTH.loginKey

    ) === "true";

}

/* ========================================
   SIGN UP SYSTEM
======================================== */

function validateSignup() {

    if (!signupName || !signupMobile || !signupPassword) {

        alert("Signup form not found.");

        return false;

    }

    const name = signupName.value.trim();

    const mobile = signupMobile.value.trim();

    const email = signupEmail ? signupEmail.value.trim() : "";

    const password = signupPassword.value.trim();


    /* Name Validation */

    if (name.length < AUTH.minimumNameLength) {

        alert("Please enter a valid full name.");

        return false;

    }


    /* Mobile Validation */

    if (mobile.length !== AUTH.mobileLength || isNaN(mobile)) {

        alert("Please enter a valid 10-digit mobile number.");

        return false;

    }


    /* Password Validation */

    if (password.length < AUTH.minimumPasswordLength) {

        alert(
            `Password must be at least ${AUTH.minimumPasswordLength} characters.`
        );

        return false;

    }

    return true;

}


/* ========================================
   CREATE ACCOUNT
======================================== */

function createAccount() {

    if (!validateSignup()) return;

    const user = {

        id: Date.now(),

        name: signupName.value.trim(),

        mobile: signupMobile.value.trim(),

        email: signupEmail
            ? signupEmail.value.trim()
            : "",

        password: signupPassword.value.trim(),

        createdAt: new Date().toISOString()

    };

    saveUser(user);
   
   setLoginStatus(false);

    alert("Account created successfully.");

    window.location.href = "login.html";

}


/* ========================================
   SIGNUP FORM EVENT
======================================== */

if (signupForm) {

    signupForm.addEventListener("submit", function (event) {

        event.preventDefault();

        createAccount();

    });

}


/* ========================================
   LOGIN SYSTEM
======================================== */

function validateLogin() {

    if (!loginMobile || !loginPassword) {

        alert("Login form not found.");

        return false;

    }

    const mobile = loginMobile.value.trim();

    const password = loginPassword.value.trim();

    /* Mobile Validation */

    if (
        mobile.length !== AUTH.mobileLength ||
        isNaN(mobile)
    ) {

        alert("Please enter a valid 10-digit mobile number.");

        return false;

    }

    /* Password Validation */

    if (
        password.length < AUTH.minimumPasswordLength
    ) {

        alert("Invalid password.");

        return false;

    }

    return true;

}


/* ========================================
   LOGIN ACCOUNT
======================================== */

function loginAccount() {

    if (!validateLogin()) return;

    const savedUser = loadUser();

    if (!savedUser) {

        alert("No account found. Please sign up first.");

        window.location.href = "signup.html";

        return;

    }

    if (
        loginMobile.value.trim() !== savedUser.mobile ||
        loginPassword.value.trim() !== savedUser.password
    ) {

        alert("Invalid mobile number or password.");

        return;

    }

    currentUser = savedUser;

    setLoginStatus(true);
   
   saveUser(savedUser);

    alert(`Welcome ${savedUser.name}!`);

    window.location.href = "index.html";

}


/* ========================================
   LOGIN FORM EVENT
======================================== */

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        loginAccount();

    });

}

/* ========================================
   LOGOUT SYSTEM
======================================== */

function logoutAccount() {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    currentUser = null;

    localStorage.removeItem(AUTH.loginKey);

    alert("Logged out successfully.");

    window.location.href = "login.html";

}


/* ========================================
   SESSION MANAGER
======================================== */

function checkSession() {

    if (!AUTH.requireLogin) return true;

    if (!isLoggedIn()) {

        window.location.href = "login.html";

        return false;

    }

    return true;

}


function getCurrentUser() {

    return currentUser;

}


/* ========================================
   AUTO LOGIN CHECK
======================================== */

function autoLoginCheck() {

    if (!AUTH.autoLogin) return;

    const user = loadUser();

    if (user && isLoggedIn()) {

        currentUser = user;

    }

}


/* ========================================
   EVENT LISTENERS
======================================== */

if (logoutButton) {

    logoutButton.addEventListener(

        "click",

        logoutAccount

    );

}


/* ========================================
   AUTH INITIALIZATION
======================================== */

function initializeAuth() {

    autoLoginCheck();

    console.log(

        "Royal Store Authentication Initialized"

    );

}


initializeAuth();

/* ========================================
   FORGOT PASSWORD (Future)
======================================== */

function forgotPassword() {

    console.log("Forgot Password Module");

}


/* ========================================
   PASSWORD RESET (Future)
======================================== */

function resetPassword() {

    console.log("Reset Password Module");

}


/* ========================================
   OTP VERIFICATION (Future)
======================================== */

function verifyOTP() {

    console.log("OTP Verification Module");

}

/* ========================================
   ACCOUNT MANAGEMENT (Future)
======================================== */

function updateProfile() {

    console.log("Update Profile Module");

}

function changePassword() {

    console.log("Change Password Module");

}

function deleteAccount() {

    console.log("Delete Account Module");

}


/* ========================================
   SECURITY (Future)
======================================== */

function loginAttemptLimit() {

    console.log("Login Attempt Limit");

}

function accountLock() {

    console.log("Account Lock Module");

}

function sessionExpiry() {

    console.log("Session Expiry Module");

}

