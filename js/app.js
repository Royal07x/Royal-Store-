/* ===========================================================
                    ROYAL STORE V3
                     FILE : app.js
                     PART : 01
                  VERSION : 3.0 LOCKED
=========================================================== */


/* ===========================================================
                    APPLICATION CONFIG
=========================================================== */

const APP_CONFIG = {

    appName : "Royal Store",

    version : "3.0",

    currency : "₹",

    requireLogin : true,

    enableCart : true,

    enableBuyNow : true,

    enableWhatsApp : true,

    enableWishlist : false,

    enableLoader : true,

    enableToast : true,

    debugMode : false

};


/* ===========================================================
                    LOCAL STORAGE KEYS
=========================================================== */

const STORAGE = {

    CART : "royal_cart",

    USER : "royal_user",

    LOGIN : "royal_login",

    WISHLIST : "royal_wishlist",

    THEME : "royal_theme"

};


/* ===========================================================
                    DOM ELEMENTS
=========================================================== */

const cartCount =

document.getElementById("cart-count");


const loader =

document.getElementById("loading-screen");


const toast =

document.getElementById("toast");


const toastMessage =

document.getElementById("toast-message");


const pageOverlay =

document.getElementById("page-overlay");


/* ===========================================================
                    GLOBAL VARIABLES
=========================================================== */

let cart = [];

let currentUser = null;

let isLoggedIn = false;

let applicationReady = false;


/* ===========================================================
                    APPLICATION START
=========================================================== */

function initializeApplication(){

    loadUser();

    loadCart();

    updateCartCount();

    applicationReady = true;

    console.log(

        "Royal Store V3 Started"

    );

}


/* ===========================================================
                    PART 01 END
=========================================================== */
/* ===========================================================
                    USER SYSTEM
=========================================================== */

function loadUser(){

    currentUser = JSON.parse(

        localStorage.getItem(

            STORAGE.USER

        )

    );

    isLoggedIn =

    localStorage.getItem(

        STORAGE.LOGIN

    ) === "true";

}


/* ===========================================================
                    LOGIN STATUS
=========================================================== */

function isUserLoggedIn(){

    return isLoggedIn;

}


/* ===========================================================
                    LOGIN REQUIRED
=========================================================== */

function requireLogin(){

    if(isUserLoggedIn()){

        return true;

    }

    showToast(

        "Please login first."

    );

    setTimeout(function(){

        window.location.href =

        "login.html";

    },800);

    return false;

}


/* ===========================================================
                    LOGOUT SYSTEM
=========================================================== */

function logoutUser(){

    localStorage.removeItem(

        STORAGE.USER

    );

    localStorage.setItem(

        STORAGE.LOGIN,

        "false"

    );

    currentUser = null;

    isLoggedIn = false;

    showToast(

        "Logged out successfully."

    );

    setTimeout(function(){

        window.location.href =

        "index.html";

    },800);

}


/* ===========================================================
                    USER NAME
=========================================================== */

function getUserName(){

    if(

        currentUser &&

        currentUser.name

    ){

        return currentUser.name;

    }

    return "Guest";

}


/* ===========================================================
                    UPDATE HEADER
=========================================================== */

function updateUserInterface(){

    const userName =

    document.getElementById(

        "user-name"

    );

    if(userName){

        userName.textContent =

        getUserName();

    }

}


/* ===========================================================
                    PART 02 END
=========================================================== */
/* ===========================================================
                    CART STORAGE
=========================================================== */

function loadCart(){

    cart = JSON.parse(

        localStorage.getItem(

            STORAGE.CART

        )

    ) || [];

}


/* ===========================================================
                    SAVE CART
=========================================================== */

function saveCart(){

    localStorage.setItem(

        STORAGE.CART,

        JSON.stringify(cart)

    );

}


/* ===========================================================
                    CART COUNT
=========================================================== */

function getCartCount(){

    return cart.reduce(

        (total,item)=>

        total + item.quantity,

        0

    );

}


/* ===========================================================
                    CART TOTAL
=========================================================== */

function getCartTotal(){

    return cart.reduce(

        (total,item)=>

        total +

        (item.price * item.quantity),

        0

    );

}


/* ===========================================================
                    UPDATE CART UI
=========================================================== */

function updateCartCount(){

    if(!cartCount) return;

    cartCount.textContent =

    getCartCount();

}


/* ===========================================================
                    CART ITEM
=========================================================== */

function getCartItem(productId){

    return cart.find(

        item =>

        item.id === productId

    );

}


/* ===========================================================
                    EMPTY CART
=========================================================== */

function isCartEmpty(){

    return cart.length === 0;

}


/* ===========================================================
                    PART 03 END
=========================================================== */
/* ===========================================================
                    ADD TO CART
=========================================================== */

function addToCart(productId){

    if(APP_CONFIG.requireLogin){

        if(!requireLogin()) return;

    }

    const product =

    RoyalProducts.getProductById(

        productId

    );

    if(!product){

        showToast(

            "Product not found."

        );

        return;

    }

    const item =

    getCartItem(productId);

    if(item){

        increaseQuantity(productId);

        return;

    }

    cart.push({

        id:product.id,

        name:product.name,

        price:product.price,

        image:product.image,

        quantity:1

    });

    saveCart();

    updateCartCount();

    showToast(

        "Added to Cart"

    );

}


/* ===========================================================
                    INCREASE QUANTITY
=========================================================== */

function increaseQuantity(productId){

    const item =

    getCartItem(productId);

    if(!item) return;

    if(item.quantity >= 5){

        showToast(

            "Maximum quantity reached."

        );

        return;

    }

    item.quantity++;

    saveCart();

    updateCartCount();

}


/* ===========================================================
                    DECREASE QUANTITY
=========================================================== */

function decreaseQuantity(productId){

    const item =

    getCartItem(productId);

    if(!item) return;

    item.quantity--;

    if(item.quantity <= 0){

        removeCartItem(productId);

        return;

    }

    saveCart();

    updateCartCount();

}


/* ===========================================================
                    REMOVE CART ITEM
=========================================================== */

function removeCartItem(productId){

    cart = cart.filter(

        item =>

        item.id !== productId

    );

    saveCart();

    updateCartCount();

    showToast(

        "Item removed."

    );

}


/* ===========================================================
                    PART 04 END
=========================================================== */
/* ===========================================================
                    BUY NOW SYSTEM
=========================================================== */

function buyNow(productId){

    if(APP_CONFIG.requireLogin){

        if(!requireLogin()) return;

    }

    addToCart(productId);

    showToast(

        "Redirecting to Checkout..."

    );

    setTimeout(function(){

        window.location.href =

        "cart.html";

    },600);

}


/* ===========================================================
                    WHATSAPP ORDER
=========================================================== */

function openWhatsAppOrder(){

    if(isCartEmpty()){

        showToast(

            "Your cart is empty."

        );

        return;

    }

    const message =

    generateWhatsAppMessage();

    const url =

    `https://wa.me/918791139418?text=${encodeURIComponent(message)}`;

    window.open(

        url,

        "_blank"

    );

}


/* ===========================================================
                    ORDER MESSAGE
=========================================================== */

function generateWhatsAppMessage(){

    let message =

`🛍️ Royal Store Order

━━━━━━━━━━━━━━

`;

    cart.forEach(

        (item,index)=>{

        message +=

`${index+1}. ${item.name}

Qty : ${item.quantity}

Price : ${APP_CONFIG.currency}${item.price}

----------------------

`;

    });

    message +=

`Total Items : ${getCartCount()}

Grand Total : ${APP_CONFIG.currency}${getCartTotal()}

━━━━━━━━━━━━━━

Thank You ❤️`;

    return message;

}


/* ===========================================================
                    PART 05 END
=========================================================== */
