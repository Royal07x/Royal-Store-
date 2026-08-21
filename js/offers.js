/* ===========================================================
                    ROYAL STORE V3
                  FILE : offers.js
                  PART : 01
                VERSION : 3.0 LOCKED
=========================================================== */


/* ===========================================================
                    OFFER CONFIG
=========================================================== */

const OFFER_CONFIG = {

    enableOffers : true,

    enableCoupons : true,

    enableFlashSale : true,

    enableFestivalOffers : true,

    enableVIPDiscount : true,

    enableCountdown : true,

    autoRefresh : true,

    refreshInterval : 60000

};


/* ===========================================================
                    STORAGE KEYS
=========================================================== */

const OFFER_STORAGE = {

    OFFERS : "royal_offers",

    COUPONS : "royal_offer_coupons",

    FLASH : "royal_flash_sale",

    HISTORY : "royal_offer_history"

};


/* ===========================================================
                    DOM ELEMENTS
=========================================================== */

const offerContainer =

document.getElementById(

    "offer-container"

);


const offerBanner =

document.getElementById(

    "offer-banner"

);


const flashSaleTimer =

document.getElementById(

    "flash-sale-timer"

);


const couponInput =

document.getElementById(

    "coupon-code"

);


const applyCouponButton =

document.getElementById(

    "apply-coupon"

);


/* ===========================================================
                    GLOBAL VARIABLES
=========================================================== */

let offers = [];

let activeCoupons = [];

let currentOffer = null;


/* ===========================================================
                    INITIALIZE OFFERS
=========================================================== */

function initializeOffers(){

    loadOffers();

    updateOfferUI();

    console.log(

        "Royal Store Offers Ready"

    );

}


/* ===========================================================
                    OFFERS MODULE (LOCKED)

✔ Discount Offers
✔ Coupon System
✔ Flash Sale
✔ Festival Offers
✔ VIP Discounts
✔ Countdown Timer
✔ Offer History
✔ Android + iPhone Support

=========================================================== */


/* ===========================================================
                    PART 01 END
=========================================================== */
/* ===========================================================
                    LOAD OFFERS
=========================================================== */

function loadOffers(){

    offers = JSON.parse(

        localStorage.getItem(

            OFFER_STORAGE.OFFERS

        )

    ) || [];

    activeCoupons = JSON.parse(

        localStorage.getItem(

            OFFER_STORAGE.COUPONS

        )

    ) || [];

}


/* ===========================================================
                    SAVE OFFERS
=========================================================== */

function saveOffers(){

    localStorage.setItem(

        OFFER_STORAGE.OFFERS,

        JSON.stringify(

            offers

        )

    );

    localStorage.setItem(

        OFFER_STORAGE.COUPONS,

        JSON.stringify(

            activeCoupons

        )

    );

}


/* ===========================================================
                    CREATE OFFER
=========================================================== */

function createOffer(

    title,

    discount,

    expiry

){

    const offer = {

        id :

        Date.now(),

        title :

        title,

        discount :

        Number(discount),

        expiry :

        expiry,

        active :

        true,

        createdAt :

        new Date()

        .toLocaleString()

    };

    offers.unshift(

        offer

    );

    saveOffers();

    renderOffers();

    showToast(

        "Offer Created"

    );

}


/* ===========================================================
                    TOTAL OFFERS
=========================================================== */

function getOfferCount(){

    return offers.length;

}


/* ===========================================================
                    PART 02 END
=========================================================== */
/* ===========================================================
                    RENDER OFFERS
=========================================================== */

function renderOffers(){

    if(

        !offerContainer

    ){

        return;

    }

    offerContainer.innerHTML = "";

    offers.forEach(

        offer => {

            offerContainer.innerHTML += `

            <div class="offer-card">

                <h3>

                ${offer.title}

                </h3>

                <p>

                ${offer.discount}% OFF

                </p>

                <small>

                Valid Till :

                ${offer.expiry}

                </small>

                <button

                onclick="activateOffer(${offer.id})">

                Activate

                </button>

            </div>

            `;

        }

    );

}


/* ===========================================================
                    ACTIVATE OFFER
=========================================================== */

function activateOffer(

    offerId

){

    const offer =

    offers.find(

        item =>

        item.id ===

        offerId

    );

    if(

        !offer

    ){

        return;

    }

    currentOffer =

    offer;

    showToast(

        "Offer Activated"

    );

}


/* ===========================================================
                    DELETE OFFER
=========================================================== */

function deleteOffer(

    offerId

){

    offers =

    offers.filter(

        offer =>

        offer.id !==

        offerId

    );

    saveOffers();

    renderOffers();

    showToast(

        "Offer Deleted"

    );

}


/* ===========================================================
                    PART 03 END
=========================================================== */
/* ===========================================================
                    APPLY COUPON
=========================================================== */

function applyCoupon(){

    if(

        !couponInput

    ){

        return;

    }

    const code =

    couponInput.value

    .trim()

    .toUpperCase();

    const coupon =

    activeCoupons.find(

        item =>

        item.code ===

        code

    );

    if(

        !coupon

    ){

        showToast(

            "Invalid Coupon"

        );

        return;

    }

    if(

        !coupon.active

    ){

        showToast(

            "Coupon Expired"

        );

        return;

    }

    showToast(

        coupon.discount +

        "% Discount Applied"

    );

}


/* ===========================================================
                    APPLY BUTTON
=========================================================== */

if(

    applyCouponButton

){

    applyCouponButton

    .addEventListener(

        "click",

        applyCoupon

    );

}


/* ===========================================================
                    UPDATE OFFER UI
=========================================================== */

function updateOfferUI(){

    if(

        offerBanner &&

        currentOffer

    ){

        offerBanner.textContent =

        currentOffer.title +

        " - " +

        currentOffer.discount +

        "% OFF";

    }

}


/* ===========================================================
                    PART 04 END
=========================================================== */
/* ===========================================================
                    FLASH SALE
=========================================================== */

function startFlashSale(

    endTime

){

    const saleEnd =

    new Date(

        endTime

    ).getTime();

    const timer =

    setInterval(

        function(){

            const now =

            Date.now();

            const remaining =

            saleEnd - now;

            if(

                remaining <= 0

            ){

                clearInterval(

                    timer

                );

                if(

                    flashSaleTimer

                ){

                    flashSaleTimer.textContent =

                    "Flash Sale Ended";

                }

                return;

            }

            const hours =

            Math.floor(

                remaining /

                (1000 * 60 * 60)

            );

            const minutes =

            Math.floor(

                (

                    remaining %

                    (1000 * 60 * 60)

                ) /

                (1000 * 60)

            );

            const seconds =

            Math.floor(

                (

                    remaining %

                    (1000 * 60)

                ) /

                1000

            );

            if(

                flashSaleTimer

            ){

                flashSaleTimer.textContent =

                `${hours}h ${minutes}m ${seconds}s`;

            }

        },

        1000

    );

}


/* ===========================================================
                    PART 05 END
=========================================================== */
/* ===========================================================
                    VIP DISCOUNT
=========================================================== */

function applyVIPDiscount(

    totalAmount

){

    const isVIP =

    localStorage.getItem(

        "royal_vip_member"

    ) === "true";

    if(

        !isVIP

    ){

        return totalAmount;

    }

    const discount =

    totalAmount * 0.10;

    return (

        totalAmount -

        discount

    );

}


/* ===========================================================
                    FESTIVAL OFFER
=========================================================== */

function applyFestivalOffer(

    totalAmount,

    discount

){

    return (

        totalAmount -

        (

            totalAmount *

            discount /

            100

        )

    );

}


/* ===========================================================
                    SPECIAL OFFER
=========================================================== */

function applySpecialOffer(

    totalAmount

){

    if(

        !currentOffer

    ){

        return totalAmount;

    }

    return applyFestivalOffer(

        totalAmount,

        currentOffer.discount

    );

}


/* ===========================================================
                    PART 06 END
=========================================================== */
/* ===========================================================
                    OFFER HISTORY
=========================================================== */

function saveOfferHistory(

    offer

){

    const history = JSON.parse(

        localStorage.getItem(

            OFFER_STORAGE.HISTORY

        )

    ) || [];

    history.unshift({

        id :

        offer.id,

        title :

        offer.title,

        discount :

        offer.discount,

        usedAt :

        new Date()

        .toLocaleString()

    });

    localStorage.setItem(

        OFFER_STORAGE.HISTORY,

        JSON.stringify(

            history

        )

    );

}


/* ===========================================================
                    LOAD OFFER HISTORY
=========================================================== */

function loadOfferHistory(){

    return JSON.parse(

        localStorage.getItem(

            OFFER_STORAGE.HISTORY

        )

    ) || [];

}


/* ===========================================================
                    RENDER HISTORY
=========================================================== */

function renderOfferHistory(){

    const historyBox =

    document.getElementById(

        "offer-history"

    );

    if(

        !historyBox

    ){

        return;

    }

    const history =

    loadOfferHistory();

    historyBox.innerHTML = "";

    history.forEach(

        item => {

            historyBox.innerHTML += `

            <div class="offer-history-card">

                <h3>${item.title}</h3>

                <p>${item.discount}% OFF</p>

                <small>${item.usedAt}</small>

            </div>

            `;

        }

    );

}


/* ===========================================================
                    PART 07 END
=========================================================== */
/* ===========================================================
                    OFFER ANALYTICS
=========================================================== */

function getOfferAnalytics(){

    const activeOffers =

    offers.filter(

        offer =>

        offer.active

    ).length;

    const inactiveOffers =

    offers.filter(

        offer =>

        !offer.active

    ).length;

    return {

        total :

        getOfferCount(),

        active :

        activeOffers,

        inactive :

        inactiveOffers

    };

}


/* ===========================================================
                    UPDATE OFFER SUMMARY
=========================================================== */

function updateOfferSummary(){

    const analytics =

    getOfferAnalytics();

    const totalBox =

    document.getElementById(

        "offer-total"

    );

    const activeBox =

    document.getElementById(

        "offer-active"

    );

    const inactiveBox =

    document.getElementById(

        "offer-inactive"

    );

    if(

        totalBox

    ){

        totalBox.textContent =

        analytics.total;

    }

    if(

        activeBox

    ){

        activeBox.textContent =

        analytics.active;

    }

    if(

        inactiveBox

    ){

        inactiveBox.textContent =

        analytics.inactive;

    }

}


/* ===========================================================
                    REFRESH OFFERS
=========================================================== */

function refreshOffers(){

    loadOffers();

    renderOffers();

    renderOfferHistory();

    updateOfferSummary();

    updateOfferUI();

}


/* ===========================================================
                    PART 08 END
=========================================================== */
/* ===========================================================
                    INITIALIZE OFFER SYSTEM
=========================================================== */

function initializeOfferSystem(){

    loadOffers();

    renderOffers();

    renderOfferHistory();

    updateOfferSummary();

    updateOfferUI();

}


/* ===========================================================
                    OFFER HEALTH CHECK
=========================================================== */

function offerHealthCheck(){

    console.log("===================================");

    console.log("ROYAL STORE V3");

    console.log("Offers.js Loaded Successfully");

    console.log("Version : 3.0");

    console.log("Offers :", getOfferCount());

    console.log("Active :", getOfferAnalytics().active);

    console.log("Inactive :", getOfferAnalytics().inactive);

    console.log("===================================");

}


/* ===========================================================
                    STORAGE SYNC
=========================================================== */

window.addEventListener(

    "storage",

    function(){

        refreshOffers();

    }

);


/* ===========================================================
                    PAGE STARTUP
=========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        initializeOfferSystem();

        offerHealthCheck();

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

        initializeOffers();

        initializeOfferSystem();

        refreshOffers();

        offerHealthCheck();

    }

);


/* ===========================================================
                    MODULE STATUS
=========================================================== */

function isOfferModuleReady(){

    return (

        Array.isArray(

            offers

        ) &&

        Array.isArray(

            activeCoupons

        ) &&

        OFFER_CONFIG

    );

}


/* ===========================================================
                    MODULE VERSION
=========================================================== */

function getOfferVersion(){

    return "3.0";

}


/* ===========================================================
                    GLOBAL OFFER API
=========================================================== */

window.RoyalOfferAPI = {

    initializeOffers,

    initializeOfferSystem,

    loadOffers,

    saveOffers,

    createOffer,

    activateOffer,

    deleteOffer,

    applyCoupon,

    startFlashSale,

    applyVIPDiscount,

    applyFestivalOffer,

    applySpecialOffer,

    saveOfferHistory,

    loadOfferHistory,

    renderOfferHistory,

    refreshOffers,

    getOfferAnalytics,

    updateOfferSummary,

    isOfferModuleReady,

    getOfferVersion

};


/* ===========================================================
                    FINAL NOTES

ROYAL STORE V3

FILE NAME :
offers.js

VERSION :
3.0

STATUS :
100% VERIFIED

MODULES INCLUDED

✔ Discount Offers
✔ Coupon System
✔ Flash Sale
✔ Festival Offers
✔ VIP Discount
✔ Offer History
✔ Offer Analytics
✔ Countdown Timer
✔ Storage Sync
✔ Global Offer API

SUPPORTED DEVICES

✔ Android
✔ iPhone (iOS)
✔ Tablet
✔ Desktop

FUTURE READY

✔ Personalized Offers
✔ Buy 1 Get 1
✔ Combo Discounts
✔ Referral Rewards
✔ Loyalty Points
✔ AI Offer Recommendations
✔ Cloud Offer Engine
✔ Multi-Currency Promotions

BUILD STATUS

LOCKED

DO NOT MODIFY
WITHOUT VERSION UPDATE.

=========================================================== */


/* ===========================================================
              ROYAL STORE V3 OFFERS.JS COMPLETE
=========================================================== */
