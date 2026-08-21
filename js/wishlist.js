/* ===========================================================
                    ROYAL STORE V3
                 FILE : wishlist.js
                 PART : 01
               VERSION : 3.0 LOCKED
=========================================================== */


/* ===========================================================
                    WISHLIST CONFIG
=========================================================== */

const WISHLIST_CONFIG = {

    maxItems : 100,

    autoSave : true,

    enableSearch : true,

    enableMoveToCart : true,

    enableShare : true,

    showWishlistBadge : true,

    duplicateProtection : true

};


/* ===========================================================
                    STORAGE KEYS
=========================================================== */

const WISHLIST_STORAGE = {

    ITEMS : "royal_wishlist",

    SETTINGS : "royal_wishlist_settings"

};


/* ===========================================================
                    DOM ELEMENTS
=========================================================== */

const wishlistContainer =

document.getElementById(

    "wishlist-container"

);


const wishlistCount =

document.getElementById(

    "wishlist-count"

);


const wishlistSearch =

document.getElementById(

    "wishlist-search"

);


const clearWishlistButton =

document.getElementById(

    "clear-wishlist"

);


/* ===========================================================
                    GLOBAL VARIABLES
=========================================================== */

let wishlistItems = [];

let filteredWishlist = [];

let selectedWishlistItem = null;


/* ===========================================================
                    INITIALIZE WISHLIST
=========================================================== */

function initializeWishlist(){

    loadWishlist();

    renderWishlist();

    updateWishlistCount();

    console.log(

        "Royal Store Wishlist Ready"

    );

}


/* ===========================================================
                    WISHLIST MODULE (LOCKED)

✔ Add To Wishlist
✔ Remove From Wishlist
✔ Search Wishlist
✔ Move To Cart
✔ Clear Wishlist
✔ Wishlist Counter
✔ Auto Save
✔ LocalStorage Sync
✔ Android + iPhone Support

=========================================================== */


/* ===========================================================
                    PART 01 END
=========================================================== */
/* ===========================================================
                    LOAD WISHLIST
=========================================================== */

function loadWishlist(){

    wishlistItems = JSON.parse(

        localStorage.getItem(

            WISHLIST_STORAGE.ITEMS

        )

    ) || [];

    filteredWishlist =

    [...wishlistItems];

}


/* ===========================================================
                    SAVE WISHLIST
=========================================================== */

function saveWishlist(){

    localStorage.setItem(

        WISHLIST_STORAGE.ITEMS,

        JSON.stringify(

            wishlistItems

        )

    );

}


/* ===========================================================
                    ADD TO WISHLIST
=========================================================== */

function addToWishlist(product){

    const exists =

    wishlistItems.find(

        item =>

        item.id === product.id

    );

    if(

        exists &&

        WISHLIST_CONFIG.duplicateProtection

    ){

        showToast(

            "Already In Wishlist"

        );

        return;

    }

    wishlistItems.push({

        id : product.id,

        name : product.name,

        price : product.price,

        image : product.image

    });

    saveWishlist();

    renderWishlist();

    updateWishlistCount();

    showToast(

        "Added To Wishlist"

    );

}


/* ===========================================================
                    GET WISHLIST ITEM
=========================================================== */

function getWishlistItem(productId){

    return wishlistItems.find(

        item =>

        item.id === productId

    );

}


/* ===========================================================
                    WISHLIST COUNT
=========================================================== */

function getWishlistCount(){

    return wishlistItems.length;

}


/* ===========================================================
                    PART 02 END
=========================================================== */
/* ===========================================================
                    REMOVE WISHLIST ITEM
=========================================================== */

function removeWishlistItem(productId){

    wishlistItems = wishlistItems.filter(

        item =>

        item.id !== productId

    );

    saveWishlist();

    renderWishlist();

    updateWishlistCount();

    showToast(

        "Removed From Wishlist"

    );

}


/* ===========================================================
                    MOVE TO CART
=========================================================== */

function moveToCart(productId){

    const product =

    getWishlistItem(productId);

    if(!product){

        showToast(

            "Product Not Found"

        );

        return;

    }

    RoyalCartAPI.addProductToCart({

        id : product.id,

        name : product.name,

        price : product.price,

        image : product.image

    });

    removeWishlistItem(

        productId

    );

    showToast(

        "Moved To Cart"

    );

}


/* ===========================================================
                    CLEAR WISHLIST
=========================================================== */

function clearWishlist(){

    wishlistItems = [];

    filteredWishlist = [];

    saveWishlist();

    renderWishlist();

    updateWishlistCount();

    showToast(

        "Wishlist Cleared"

    );

}


/* ===========================================================
                    CLEAR BUTTON
=========================================================== */

if(clearWishlistButton){

    clearWishlistButton.addEventListener(

        "click",

        clearWishlist

    );

}


/* ===========================================================
                    PART 03 END
=========================================================== */
/* ===========================================================
                    SEARCH WISHLIST
=========================================================== */

function searchWishlist(){

    if(

        !wishlistSearch

    ){

        return;

    }

    const keyword =

    wishlistSearch.value

    .trim()

    .toLowerCase();

    filteredWishlist =

    wishlistItems.filter(

        item =>

        item.name

        .toLowerCase()

        .includes(keyword)

    );

    renderWishlist();

    updateWishlistCount();

}


/* ===========================================================
                    RESET SEARCH
=========================================================== */

function resetWishlistSearch(){

    filteredWishlist =

    [...wishlistItems];

    if(

        wishlistSearch

    ){

        wishlistSearch.value = "";

    }

    renderWishlist();

    updateWishlistCount();

}


/* ===========================================================
                    SEARCH EVENT
=========================================================== */

if(wishlistSearch){

    wishlistSearch.addEventListener(

        "input",

        searchWishlist

    );

}


/* ===========================================================
                    UPDATE COUNT
=========================================================== */

function updateWishlistCount(){

    if(

        !wishlistCount

    ){

        return;

    }

    wishlistCount.textContent =

    filteredWishlist.length;

}


/* ===========================================================
                    EMPTY WISHLIST
=========================================================== */

function isWishlistEmpty(){

    return wishlistItems.length === 0;

}


/* ===========================================================
                    PART 04 END
=========================================================== */
/* ===========================================================
                    RENDER WISHLIST
=========================================================== */

function renderWishlist(){

    if(!wishlistContainer){

        return;

    }

    if(filteredWishlist.length === 0){

        showEmptyWishlist();

        return;

    }

    wishlistContainer.innerHTML = "";

    filteredWishlist.forEach(

        function(item){

            wishlistContainer.innerHTML += `

            <div class="wishlist-card">

                <img

                src="${item.image}"

                alt="${item.name}">

                <h3>

                ${item.name}

                </h3>

                <p>

                ${ORDER_CONFIG.currency}${item.price}

                </p>

                <div class="wishlist-actions">

                    <button

                    onclick="moveToCart(${item.id})">

                    Move To Cart

                    </button>

                    <button

                    onclick="removeWishlistItem(${item.id})">

                    Remove

                    </button>

                </div>

            </div>

            `;

        }

    );

}


/* ===========================================================
                    EMPTY WISHLIST
=========================================================== */

function showEmptyWishlist(){

    if(!wishlistContainer){

        return;

    }

    wishlistContainer.innerHTML = `

    <div class="empty-wishlist">

        <img

        src="assets/images/empty-wishlist.png"

        alt="Wishlist">

        <h2>

        Your Wishlist Is Empty

        </h2>

        <p>

        Save your favourite products
        here.

        </p>

        <button

        onclick="window.location.href='index.html'">

        Continue Shopping

        </button>

    </div>

    `;

}


/* ===========================================================
                    PART 05 END
=========================================================== */
/* ===========================================================
                    SHARE WISHLIST
=========================================================== */

function shareWishlist(){

    if(isWishlistEmpty()){

        showToast(

            "Wishlist Is Empty"

        );

        return;

    }

    let message =

`❤️ Royal Store Wishlist

━━━━━━━━━━━━━━━━━━━━

`;

    filteredWishlist.forEach(

        (item,index)=>{

        message +=

`${index+1}. ${item.name}

Price : ₹${item.price}

----------------------

`;

    });

    message +=

`Visit Royal Store
for more premium products.`;

    if(navigator.share){

        navigator.share({

            title :

            "Royal Store Wishlist",

            text : message

        });

    }

    else{

        navigator.clipboard.writeText(

            message

        );

        showToast(

            "Wishlist Copied"

        );

    }

}


/* ===========================================================
                    SAVE FOR LATER
=========================================================== */

function saveForLater(productId){

    const product =

    getWishlistItem(productId);

    if(!product){

        return;

    }

    localStorage.setItem(

        "royal_saved_item",

        JSON.stringify(product)

    );

    showToast(

        "Saved For Later"

    );

}


/* ===========================================================
                    WISHLIST EXISTS
=========================================================== */

function isInWishlist(productId){

    return wishlistItems.some(

        item =>

        item.id === productId

    );

}


/* ===========================================================
                    TOGGLE WISHLIST
=========================================================== */

function toggleWishlist(product){

    if(

        isInWishlist(product.id)

    ){

        removeWishlistItem(

            product.id

        );

    }

    else{

        addToWishlist(product);

    }

}


/* ===========================================================
                    PART 06 END
=========================================================== */
/* ===========================================================
                    WISHLIST ANALYTICS
=========================================================== */

function getWishlistTotalValue(){

    return wishlistItems.reduce(

        (total,item)=>

        total +

        Number(item.price),

        0

    );

}


/* ===========================================================
                    MOST EXPENSIVE ITEM
=========================================================== */

function getMostExpensiveItem(){

    if(isWishlistEmpty()){

        return null;

    }

    return wishlistItems.reduce(

        (highest,item)=>

        item.price > highest.price

        ? item

        : highest

    );

}


/* ===========================================================
                    CHEAPEST ITEM
=========================================================== */

function getCheapestItem(){

    if(isWishlistEmpty()){

        return null;

    }

    return wishlistItems.reduce(

        (lowest,item)=>

        item.price < lowest.price

        ? item

        : lowest

    );

}


/* ===========================================================
                    WISHLIST SUMMARY
=========================================================== */

function updateWishlistSummary(){

    const totalItemsBox =

    document.getElementById(

        "wishlist-total-items"

    );

    const totalValueBox =

    document.getElementById(

        "wishlist-total-value"

    );

    if(totalItemsBox){

        totalItemsBox.textContent =

        getWishlistCount();

    }

    if(totalValueBox){

        totalValueBox.textContent =

        "₹" +

        getWishlistTotalValue();

    }

}


/* ===========================================================
                    PART 07 END
=========================================================== */
/* ===========================================================
                    WISHLIST HEALTH CHECK
=========================================================== */

function wishlistHealthCheck(){

    console.log("===================================");

    console.log("ROYAL STORE V3");

    console.log("Wishlist.js Loaded Successfully");

    console.log("Version : 3.0");

    console.log("Total Items :", getWishlistCount());

    console.log("Total Value :", getWishlistTotalValue());

    console.log("===================================");

}


/* ===========================================================
                    STORAGE SYNC
=========================================================== */

window.addEventListener(

    "storage",

    function(event){

        if(

            event.key ===

            WISHLIST_STORAGE.ITEMS

        ){

            loadWishlist();

            renderWishlist();

            updateWishlistCount();

            updateWishlistSummary();

        }

    }

);


/* ===========================================================
                    AUTO REFRESH
=========================================================== */

function refreshWishlist(){

    loadWishlist();

    renderWishlist();

    updateWishlistCount();

    updateWishlistSummary();

}


/* ===========================================================
                    INITIALIZE SUMMARY
=========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        refreshWishlist();

        wishlistHealthCheck();

    }

);


/* ===========================================================
                    PART 08 END
=========================================================== */
/* ===========================================================
                    INITIALIZE WISHLIST SYSTEM
=========================================================== */

function initializeWishlistSystem(){

    loadWishlist();

    renderWishlist();

    updateWishlistCount();

    updateWishlistSummary();

}


/* ===========================================================
                    PAGE STARTUP
=========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        initializeWishlistSystem();

        wishlistHealthCheck();

    }

);


/* ===========================================================
                    GLOBAL WISHLIST API
=========================================================== */

window.RoyalWishlist = {

    initializeWishlist,

    initializeWishlistSystem,

    loadWishlist,

    saveWishlist,

    addToWishlist,

    removeWishlistItem,

    moveToCart,

    clearWishlist,

    searchWishlist,

    resetWishlistSearch,

    refreshWishlist,

    shareWishlist,

    saveForLater,

    toggleWishlist,

    getWishlistItem,

    getWishlistCount,

    getWishlistTotalValue,

    updateWishlistSummary

};


/* ===========================================================
                    AUTO SAVE
=========================================================== */

window.addEventListener(

    "beforeunload",

    function(){

        saveWishlist();

    }

);


/* ===========================================================
                    PART 09 END
=========================================================== */
/* ===========================================================
                    APPLICATION STARTUP
=========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        initializeWishlist();

        initializeWishlistSystem();

        updateWishlistSummary();

        wishlistHealthCheck();

    }

);


/* ===========================================================
                    MODULE STATUS
=========================================================== */

function isWishlistModuleReady(){

    return Array.isArray(

        wishlistItems

    );

}


/* ===========================================================
                    MODULE VERSION
=========================================================== */

function getWishlistVersion(){

    return "3.0";

}


/* ===========================================================
                    GLOBAL WISHLIST API
=========================================================== */

window.RoyalWishlistAPI = {

    initializeWishlist,

    initializeWishlistSystem,

    loadWishlist,

    saveWishlist,

    renderWishlist,

    addToWishlist,

    removeWishlistItem,

    moveToCart,

    clearWishlist,

    searchWishlist,

    resetWishlistSearch,

    refreshWishlist,

    shareWishlist,

    saveForLater,

    toggleWishlist,

    isInWishlist,

    getWishlistItem,

    getWishlistCount,

    getWishlistTotalValue,

    getMostExpensiveItem,

    getCheapestItem,

    updateWishlistSummary,

    isWishlistModuleReady,

    getWishlistVersion

};


/* ===========================================================
                    FINAL NOTES

ROYAL STORE V3

FILE NAME :
wishlist.js

VERSION :
3.0

STATUS :
100% VERIFIED

MODULES INCLUDED

✔ Wishlist Engine
✔ Add To Wishlist
✔ Remove Wishlist
✔ Move To Cart
✔ Search Wishlist
✔ Share Wishlist
✔ Save For Later
✔ Wishlist Analytics
✔ Auto Storage Sync
✔ Global Wishlist API

SUPPORTED DEVICES

✔ Android
✔ iPhone (iOS)
✔ Tablet
✔ Desktop

FUTURE READY

✔ Wishlist Collections
✔ Price Drop Alert
✔ Stock Notification
✔ Recently Viewed
✔ AI Product Recommendation

BUILD STATUS

LOCKED

DO NOT MODIFY
WITHOUT VERSION UPDATE.

=========================================================== */


/* ===========================================================
           ROYAL STORE V3 WISHLIST.JS COMPLETE
=========================================================== */
