/* ========================================
   ROYAL STORE V2
   AUTH.JS
   VERSION : 2.0
   BUILD : 2026.08.15
======================================== */


/* ========================================
   AUTH CONFIGURATION
======================================== */

const AUTH_CONFIG = {

    appName: "Royal Store",

    loginKey: "royalLoggedIn",

    userKey: "royalUser",

    sessionKey: "royalSession",

    rememberKey: "royalRemember",

    redirectPage: "index.html",

    loginPage: "login.html",

    signupPage: "signup.html",

    minimumPasswordLength: 6,

    mobileLength: 10,

    enableRememberMe: true,

    requireEmailVerification: false,

    autoLoginAfterSignup: true

};


/* ========================================
   LOCAL STORAGE KEYS
======================================== */

const AUTH_KEYS = {

    LOGIN: AUTH_CONFIG.loginKey,

    USER: AUTH_CONFIG.userKey,

    SESSION: AUTH_CONFIG.sessionKey,

    REMEMBER: AUTH_CONFIG.rememberKey

};


/* ========================================
   GLOBAL VARIABLES
======================================== */

let currentUser = null;

let isLoggedIn = false;


/* ========================================
   INITIALIZATION
======================================== */

console.log(

    "Royal Store Auth System Initialized"

);

/* ========================================
   DOM ELEMENTS
======================================== */

const loginForm =

    document.getElementById("login-form");

const signupForm =

    document.getElementById("signup-form");


const loginEmail =

    document.getElementById("login-email");

const loginPassword =

    document.getElementById("login-password");

const rememberMe =

    document.getElementById("remember-me");


const signupName =

    document.getElementById("signup-name");

const signupMobile =

    document.getElementById("signup-mobile");

const signupEmail =

    document.getElementById("signup-email");

const signupPassword =

    document.getElementById("signup-password");

const signupConfirmPassword =

    document.getElementById("signup-confirm-password");


const logoutButton =

    document.getElementById("logout-btn");


/* ========================================
   AUTH STATUS
======================================== */

function loadAuthStatus() {

    currentUser = JSON.parse(

        localStorage.getItem(AUTH_KEYS.USER)

    );

    isLoggedIn =

        localStorage.getItem(AUTH_KEYS.LOGIN)

        === "true";

}


/* ========================================
   AUTH HELPERS
======================================== */

function saveUser(userData) {

    localStorage.setItem(

        AUTH_KEYS.USER,

        JSON.stringify(userData)

    );

}


function getUser() {

    return JSON.parse(

        localStorage.getItem(AUTH_KEYS.USER)

    );

}

/* ========================================
   SIGNUP VALIDATION
======================================== */

function validateSignup() {

    if (!signupName.value.trim()) {

        showToast("Enter your full name.");

        return false;

    }

    if (

        signupMobile.value.trim().length !==

        AUTH_CONFIG.mobileLength

    ) {

        showToast("Enter a valid mobile number.");

        return false;

    }

    if (!signupEmail.value.trim()) {

        showToast("Enter your email.");

        return false;

    }

    if (

        signupPassword.value.length <

        AUTH_CONFIG.minimumPasswordLength

    ) {

        showToast(

            `Password must be at least ${AUTH_CONFIG.minimumPasswordLength} characters.`

        );

        return false;

    }

    if (

        signupPassword.value !==

        signupConfirmPassword.value

    ) {

        showToast("Passwords do not match.");

        return false;

    }

    return true;

}


/* ========================================
   CREATE ACCOUNT
======================================== */

function createAccount() {

    if (!validateSignup()) return;

    const userData = {

        name: signupName.value.trim(),

        mobile: signupMobile.value.trim(),

        email: signupEmail.value.trim().toLowerCase(),

        password: signupPassword.value,

        createdAt: new Date().toISOString()

    };

    saveUser(userData);

    if (AUTH_CONFIG.autoLoginAfterSignup) {

        localStorage.setItem(

            AUTH_KEYS.LOGIN,

            "true"

        );

        localStorage.setItem(

            AUTH_KEYS.SESSION,

            Date.now().toString()

        );

        currentUser = userData;

        isLoggedIn = true;

    }

    showToast("Account created successfully.");

    setTimeout(() => {

        window.location.href =

            AUTH_CONFIG.redirectPage;

    }, 1200);

}

/* ========================================
   LOGIN VALIDATION
======================================== */

function validateLogin() {

    if (!loginEmail.value.trim()) {

        showToast("Enter your email.");

        return false;

    }

    if (!loginPassword.value.trim()) {

        showToast("Enter your password.");

        return false;

    }

    return true;

}


/* ========================================
   LOGIN SYSTEM
======================================== */

function loginUser() {

    if (!validateLogin()) return;

    const savedUser = getUser();

    if (!savedUser) {

        showToast("Account not found.");

        return;

    }

    if (

        loginEmail.value.trim().toLowerCase() !==

        savedUser.email

    ) {

        showToast("Invalid email.");

        return;

    }

    if (

        loginPassword.value !==

        savedUser.password

    ) {

        showToast("Incorrect password.");

        return;

    }

    localStorage.setItem(

        AUTH_KEYS.LOGIN,

        "true"

    );

    localStorage.setItem(

        AUTH_KEYS.SESSION,

        Date.now().toString()

    );

    if (

        AUTH_CONFIG.enableRememberMe &&

        rememberMe &&

        rememberMe.checked

    ) {

        localStorage.setItem(

            AUTH_KEYS.REMEMBER,

            "true"

        );

    }

    currentUser = savedUser;

    isLoggedIn = true;

    showToast("Login successful.");

    setTimeout(() => {

        window.location.href =

            AUTH_CONFIG.redirectPage;

    }, 1000);

}

/* ========================================
   LOGOUT SYSTEM
======================================== */

function logoutUser() {

    localStorage.removeItem(

        AUTH_KEYS.LOGIN

    );

    localStorage.removeItem(

        AUTH_KEYS.SESSION

    );

    localStorage.removeItem(

        AUTH_KEYS.REMEMBER

    );

    currentUser = null;

    isLoggedIn = false;

    showToast("Logged out successfully.");

    setTimeout(() => {

        window.location.href =

            AUTH_CONFIG.loginPage;

    }, 1000);

}


/* ========================================
   SESSION CHECK
======================================== */

function checkLoginSession() {

    loadAuthStatus();

    if (

        !isLoggedIn ||

        !currentUser

    ) {

        return false;

    }

    return true;

}


/* ========================================
   PROTECTED PAGE
======================================== */

function requireLogin() {

    if (

        !checkLoginSession()

    ) {

        showToast(

            "Please login first."

        );

        setTimeout(() => {

            window.location.href =

                AUTH_CONFIG.loginPage;

        }, 1000);

        return false;

    }

    return true;

}


/* ========================================
   UPDATE USER INTERFACE
======================================== */

function updateAuthUI() {

    loadAuthStatus();

    if (

        logoutButton

    ) {

        logoutButton.style.display =

            isLoggedIn

                ? "inline-flex"

                : "none";

    }

}

/* ========================================
   REMEMBER ME SYSTEM
======================================== */

function saveRememberMe() {

    if (

        !AUTH_CONFIG.enableRememberMe ||

        !rememberMe

    ) {

        return;

    }

    if (rememberMe.checked) {

        localStorage.setItem(

            AUTH_KEYS.REMEMBER,

            "true"

        );

    } else {

        localStorage.removeItem(

            AUTH_KEYS.REMEMBER

        );

    }

}


/* ========================================
   AUTO LOGIN
======================================== */

function autoLogin() {

    const rememberStatus =

        localStorage.getItem(

            AUTH_KEYS.REMEMBER

        ) === "true";

    if (

        rememberStatus &&

        checkLoginSession()

    ) {

        currentUser = getUser();

        isLoggedIn = true;

        updateAuthUI();

    }

}


/* ========================================
   USER PROFILE
======================================== */

function loadUserProfile() {

    if (

        !checkLoginSession()

    ) {

        return;

    }

    currentUser = getUser();

    if (!currentUser) {

        return;

    }

    const profileName =

        document.getElementById("profile-name");

    const profileEmail =

        document.getElementById("profile-email");

    if (profileName) {

        profileName.textContent =

            currentUser.name;

    }

    if (profileEmail) {

        profileEmail.textContent =

            currentUser.email;

    }

}


/* ========================================
   AUTH DASHBOARD
======================================== */

function initializeUser() {

    loadAuthStatus();

    autoLogin();

    updateAuthUI();

    loadUserProfile();

}

/* ========================================
   ROUTE PROTECTION
======================================== */

function protectPage() {

    const protectedPages = [

        "cart.html",

        "orders.html",

        "wishlist.html"

    ];

    const currentPage =

        window.location.pathname

        .split("/")

        .pop();

    if (

        protectedPages.includes(currentPage)

    ) {

        if (!requireLogin()) {

            return;

        }

    }

}


/* ========================================
   ADD TO CART AUTH CHECK
======================================== */

function canAddToCart() {

    if (!requireLogin()) {

        return false;

    }

    return true;

}


/* ========================================
   CHECKOUT AUTH CHECK
======================================== */

function canCheckout() {

    if (!requireLogin()) {

        return false;

    }

    return true;

}


/* ========================================
   LOGIN BUTTON UPDATE
======================================== */

function updateNavigation() {

    const loginButton =

        document.getElementById("login-btn");

    const signupButton =

        document.getElementById("signup-btn");

    const logoutButton =

        document.getElementById("logout-btn");

    if (checkLoginSession()) {

        if (loginButton) {

            loginButton.style.display =

                "none";

        }

        if (signupButton) {

            signupButton.style.display =

                "none";

        }

        if (logoutButton) {

            logoutButton.style.display =

                "inline-flex";

        }

    } else {

        if (loginButton) {

            loginButton.style.display =

                "inline-flex";

        }

        if (signupButton) {

            signupButton.style.display =

                "inline-flex";

        }

        if (logoutButton) {

            logoutButton.style.display =

                "none";

        }

    }

}


/* ========================================
   AUTH INITIALIZATION
======================================== */

function initializeAuthProtection() {

    protectPage();

    updateNavigation();

}

/* ========================================
   FORM EVENT LISTENERS
======================================== */

if (signupForm) {

    signupForm.addEventListener(

        "submit",

        function (event) {

            event.preventDefault();

            createAccount();

        }

    );

}


if (loginForm) {

    loginForm.addEventListener(

        "submit",

        function (event) {

            event.preventDefault();

            loginUser();

        }

    );

}


if (logoutButton) {

    logoutButton.addEventListener(

        "click",

        logoutUser

    );

}


/* ========================================
   PASSWORD VISIBILITY
======================================== */

function togglePassword(inputId, iconId) {

    const input =

        document.getElementById(inputId);

    const icon =

        document.getElementById(iconId);

    if (!input) return;

    if (input.type === "password") {

        input.type = "text";

        if (icon) {

            icon.classList.remove("fa-eye");

            icon.classList.add("fa-eye-slash");

        }

    } else {

        input.type = "password";

        if (icon) {

            icon.classList.remove("fa-eye-slash");

            icon.classList.add("fa-eye");

        }

    }

}


/* ========================================
   INPUT VALIDATION
======================================== */

function numbersOnly(event) {

    event.target.value =

        event.target.value.replace(

            /\D/g,

            ""

        );

}


if (signupMobile) {

    signupMobile.addEventListener(

        "input",

        numbersOnly

    );

}


if (cartCustomerMobile) {

    cartCustomerMobile.addEventListener(

        "input",

        numbersOnly

    );

}


if (cartCustomerPin) {

    cartCustomerPin.addEventListener(

        "input",

        numbersOnly

    );

}


/* ========================================
   ENTER KEY SUPPORT
======================================== */

document.addEventListener(

    "keydown",

    function (event) {

        if (

            event.key === "Enter" &&

            loginForm

        ) {

            return;

        }

    }

);

/* ========================================
   TOAST NOTIFICATION
======================================== */

function showToast(message) {

    const toast =

        document.getElementById("toast-popup");

    const toastMessage =

        document.getElementById("toast-message");

    if (!toast || !toastMessage) {

        alert(message);

        return;

    }

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* ========================================
   GLOBAL ERROR HANDLER
======================================== */

window.addEventListener(

    "error",

    function (event) {

        console.error(

            "Royal Store Error:",

            event.message

        );

    }

);


/* ========================================
   SAFE ELEMENT FINDER
======================================== */

function getElement(id) {

    return document.getElementById(id);

}


/* ========================================
   AUTH UTILITIES
======================================== */

function isUserLoggedIn() {

    return localStorage.getItem(

        AUTH_KEYS.LOGIN

    ) === "true";

}


function getCurrentUser() {

    return JSON.parse(

        localStorage.getItem(

            AUTH_KEYS.USER

        )

    );

}


/* ========================================
   PAGE INFORMATION
======================================== */

function getCurrentPage() {

    return window.location.pathname

        .split("/")

        .pop();

}


/* ========================================
   DEBUG MODE
======================================== */

if (AUTH_CONFIG.debugMode) {

    console.log(

        "Royal Store Auth Debug Mode Enabled"

    );

}

/* ========================================
   AUTH INITIALIZATION
======================================== */

function initializeAuth() {

    loadAuthStatus();

    autoLogin();

    initializeUser();

    initializeAuthProtection();

    updateAuthUI();

    console.log(

        "Royal Store Auth Initialized"

    );

}


/* ========================================
   DOM READY
======================================== */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        initializeAuth();

    }

);


/* ========================================
   GLOBAL AUTH API
======================================== */

window.RoyalAuth = {

    login: loginUser,

    logout: logoutUser,

    signup: createAccount,

    isLoggedIn: isUserLoggedIn,

    getUser: getCurrentUser,

    requireLogin: requireLogin,

    showToast: showToast

};


/* ========================================
   FUTURE MODULES (LOCKED)
======================================== */

/*

✔ Forgot Password

✔ Reset Password

✔ OTP Verification

✔ Email Verification

✔ Google Login

✔ Facebook Login

✔ Apple Login

✔ Two Factor Authentication

✔ Device Management

✔ Session History

✔ Login Activity

✔ Profile Management

✔ Change Password

✔ Delete Account

✔ Multi User Support

✔ Admin Authentication

✔ Security Logs

✔ JWT / API Authentication

✔ Firebase Authentication

✔ Cloud Authentication

*/


/* ========================================
   END OF AUTH.JS
   ROYAL STORE V2
   VERSION : 2.0
   BUILD : LOCKED
======================================== */
