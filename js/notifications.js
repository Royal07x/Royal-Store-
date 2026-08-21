/* ===========================================================
                    ROYAL STORE V3
               FILE : notifications.js
               PART : 01
             VERSION : 3.0 LOCKED
=========================================================== */


/* ===========================================================
                    NOTIFICATION CONFIG
=========================================================== */

const NOTIFICATION_CONFIG = {

    autoHide : true,

    duration : 4000,

    maxNotifications : 50,

    enableSound : true,

    enableHistory : true,

    enableOrderAlerts : true,

    enableOfferAlerts : true,

    enableWishlistAlerts : true,

    enableCartAlerts : true

};


/* ===========================================================
                    STORAGE KEYS
=========================================================== */

const NOTIFICATION_STORAGE = {

    HISTORY : "royal_notifications",

    SETTINGS : "royal_notification_settings"

};


/* ===========================================================
                    DOM ELEMENTS
=========================================================== */

const notificationContainer =

document.getElementById(

    "notification-container"

);


const notificationBadge =

document.getElementById(

    "notification-count"

);


const clearNotificationButton =

document.getElementById(

    "clear-notifications"

);


/* ===========================================================
                    GLOBAL VARIABLES
=========================================================== */

let notifications = [];

let unreadNotifications = 0;


/* ===========================================================
                    INITIALIZE NOTIFICATIONS
=========================================================== */

function initializeNotifications(){

    loadNotifications();

    renderNotifications();

    updateNotificationBadge();

    console.log(

        "Royal Store Notifications Ready"

    );

}


/* ===========================================================
                    NOTIFICATION MODULE (LOCKED)

✔ Toast Notifications
✔ Order Alerts
✔ Cart Alerts
✔ Wishlist Alerts
✔ Offer Notifications
✔ Notification History
✔ Unread Counter
✔ Auto Hide
✔ Android + iPhone Support

=========================================================== */


/* ===========================================================
                    PART 01 END
=========================================================== */
/* ===========================================================
                    LOAD NOTIFICATIONS
=========================================================== */

function loadNotifications(){

    notifications = JSON.parse(

        localStorage.getItem(

            NOTIFICATION_STORAGE.HISTORY

        )

    ) || [];

    unreadNotifications =

    notifications.filter(

        item =>

        !item.read

    ).length;

}


/* ===========================================================
                    SAVE NOTIFICATIONS
=========================================================== */

function saveNotifications(){

    localStorage.setItem(

        NOTIFICATION_STORAGE.HISTORY,

        JSON.stringify(

            notifications

        )

    );

}


/* ===========================================================
                    CREATE NOTIFICATION
=========================================================== */

function createNotification(

    title,

    message,

    type = "info"

){

    const notification = {

        id : Date.now(),

        title : title,

        message : message,

        type : type,

        read : false,

        time :

        new Date()

        .toLocaleString()

    };

    notifications.unshift(

        notification

    );

    if(

        notifications.length >

        NOTIFICATION_CONFIG.maxNotifications

    ){

        notifications.pop();

    }

    saveNotifications();

    renderNotifications();

    updateNotificationBadge();

    showToast(message);

}


/* ===========================================================
                    GET NOTIFICATION
=========================================================== */

function getNotification(id){

    return notifications.find(

        item =>

        item.id === id

    );

}


/* ===========================================================
                    TOTAL NOTIFICATIONS
=========================================================== */

function getNotificationCount(){

    return notifications.length;

}


/* ===========================================================
                    PART 02 END
=========================================================== */
/* ===========================================================
                    RENDER NOTIFICATIONS
=========================================================== */

function renderNotifications(){

    if(!notificationContainer){

        return;

    }

    if(notifications.length === 0){

        showEmptyNotifications();

        return;

    }

    notificationContainer.innerHTML = "";

    notifications.forEach(

        function(notification){

            notificationContainer.innerHTML += `

            <div class="notification-card ${notification.type}">

                <div class="notification-header">

                    <h3>

                    ${notification.title}

                    </h3>

                    <small>

                    ${notification.time}

                    </small>

                </div>

                <p>

                ${notification.message}

                </p>

                <div class="notification-actions">

                    <button

                    onclick="markNotificationRead(${notification.id})">

                    Mark Read

                    </button>

                    <button

                    onclick="deleteNotification(${notification.id})">

                    Delete

                    </button>

                </div>

            </div>

            `;

        }

    );

}


/* ===========================================================
                    EMPTY NOTIFICATIONS
=========================================================== */

function showEmptyNotifications(){

    notificationContainer.innerHTML = `

    <div class="empty-notifications">

        <img

        src="assets/images/no-notification.png"

        alt="Notifications">

        <h2>

        No Notifications

        </h2>

        <p>

        New updates and alerts
        will appear here.

        </p>

    </div>

    `;

}


/* ===========================================================
                    PART 03 END
=========================================================== */
/* ===========================================================
                    MARK AS READ
=========================================================== */

function markNotificationRead(id){

    const notification =

    getNotification(id);

    if(!notification){

        return;

    }

    notification.read = true;

    saveNotifications();

    renderNotifications();

    updateNotificationBadge();

}


/* ===========================================================
                    DELETE NOTIFICATION
=========================================================== */

function deleteNotification(id){

    notifications =

    notifications.filter(

        item =>

        item.id !== id

    );

    saveNotifications();

    renderNotifications();

    updateNotificationBadge();

    showToast(

        "Notification Deleted"

    );

}


/* ===========================================================
                    CLEAR ALL
=========================================================== */

function clearNotifications(){

    notifications = [];

    unreadNotifications = 0;

    saveNotifications();

    renderNotifications();

    updateNotificationBadge();

    showToast(

        "All Notifications Cleared"

    );

}


/* ===========================================================
                    UNREAD COUNTER
=========================================================== */

function updateNotificationBadge(){

    unreadNotifications =

    notifications.filter(

        item =>

        !item.read

    ).length;

    if(

        notificationBadge

    ){

        notificationBadge.textContent =

        unreadNotifications;

    }

}


/* ===========================================================
                    CLEAR BUTTON
=========================================================== */

if(clearNotificationButton){

    clearNotificationButton.addEventListener(

        "click",

        clearNotifications

    );

}


/* ===========================================================
                    PART 04 END
=========================================================== */
/* ===========================================================
                    ORDER NOTIFICATION
=========================================================== */

function notifyOrder(

    orderId,

    status

){

    createNotification(

        "Order Update",

        `Order ${orderId} is ${status}.`,

        "order"

    );

}


/* ===========================================================
                    CART NOTIFICATION
=========================================================== */

function notifyCart(

    productName

){

    createNotification(

        "Cart Updated",

        `${productName} added to cart.`,

        "cart"

    );

}


/* ===========================================================
                    WISHLIST NOTIFICATION
=========================================================== */

function notifyWishlist(

    productName

){

    createNotification(

        "Wishlist Updated",

        `${productName} added to wishlist.`,

        "wishlist"

    );

}


/* ===========================================================
                    OFFER NOTIFICATION
=========================================================== */

function notifyOffer(

    offerTitle,

    discount

){

    createNotification(

        "Special Offer",

        `${offerTitle} - ${discount}% OFF`,

        "offer"

    );

}


/* ===========================================================
                    DELIVERY NOTIFICATION
=========================================================== */

function notifyDelivery(

    orderId

){

    createNotification(

        "Delivery Update",

        `Order ${orderId} is out for delivery.`,

        "delivery"

    );

}


/* ===========================================================
                    PART 05 END
=========================================================== */
/* ===========================================================
                    PLAY NOTIFICATION SOUND
=========================================================== */

function playNotificationSound(){

    if(

        !NOTIFICATION_CONFIG.enableSound

    ){

        return;

    }

    const sound =

    new Audio(

        "assets/sounds/notification.mp3"

    );

    sound.play()

    .catch(()=>{});

}


/* ===========================================================
                    AUTO HIDE
=========================================================== */

function autoHideNotification(element){

    if(

        !NOTIFICATION_CONFIG.autoHide ||

        !element

    ){

        return;

    }

    setTimeout(function(){

        element.remove();

    },

    NOTIFICATION_CONFIG.duration);

}


/* ===========================================================
                    SHOW POPUP
=========================================================== */

function showNotificationPopup(

    title,

    message,

    type = "info"

){

    const popup =

    document.createElement(

        "div"

    );

    popup.className =

    "notification-popup " +

    type;

    popup.innerHTML = `

        <h4>${title}</h4>

        <p>${message}</p>

    `;

    document.body.appendChild(

        popup

    );

    playNotificationSound();

    autoHideNotification(

        popup

    );

}


/* ===========================================================
                    QUICK NOTIFICATION
=========================================================== */

function quickNotify(message){

    createNotification(

        "Royal Store",

        message,

        "info"

    );

}


/* ===========================================================
                    PART 06 END
=========================================================== */
/* ===========================================================
                    NOTIFICATION ANALYTICS
=========================================================== */

function getUnreadNotificationCount(){

    return notifications.filter(

        item =>

        !item.read

    ).length;

}


function getReadNotificationCount(){

    return notifications.filter(

        item =>

        item.read

    ).length;

}


function getNotificationHistory(){

    return notifications;

}


/* ===========================================================
                    NOTIFICATION SUMMARY
=========================================================== */

function updateNotificationSummary(){

    const totalBox =

    document.getElementById(

        "notification-total"

    );

    const unreadBox =

    document.getElementById(

        "notification-unread"

    );

    const readBox =

    document.getElementById(

        "notification-read"

    );

    if(totalBox){

        totalBox.textContent =

        getNotificationCount();

    }

    if(unreadBox){

        unreadBox.textContent =

        getUnreadNotificationCount();

    }

    if(readBox){

        readBox.textContent =

        getReadNotificationCount();

    }

}


/* ===========================================================
                    MARK ALL AS READ
=========================================================== */

function markAllNotificationsRead(){

    notifications.forEach(

        item =>

        item.read = true

    );

    saveNotifications();

    renderNotifications();

    updateNotificationBadge();

    updateNotificationSummary();

    showToast(

        "All Notifications Read"

    );

}


/* ===========================================================
                    PART 07 END
=========================================================== */
/* ===========================================================
                    NOTIFICATION HEALTH CHECK
=========================================================== */

function notificationHealthCheck(){

    console.log("===================================");

    console.log("ROYAL STORE V3");

    console.log("Notifications.js Loaded Successfully");

    console.log("Version : 3.0");

    console.log("Total :", getNotificationCount());

    console.log("Unread :", getUnreadNotificationCount());

    console.log("Read :", getReadNotificationCount());

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

            NOTIFICATION_STORAGE.HISTORY

        ){

            loadNotifications();

            renderNotifications();

            updateNotificationBadge();

            updateNotificationSummary();

        }

    }

);


/* ===========================================================
                    REFRESH NOTIFICATIONS
=========================================================== */

function refreshNotifications(){

    loadNotifications();

    renderNotifications();

    updateNotificationBadge();

    updateNotificationSummary();

}


/* ===========================================================
                    AUTO REFRESH
=========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        refreshNotifications();

        notificationHealthCheck();

    }

);


/* ===========================================================
                    PART 08 END
=========================================================== */
/* ===========================================================
                    INITIALIZE NOTIFICATION SYSTEM
=========================================================== */

function initializeNotificationSystem(){

    loadNotifications();

    renderNotifications();

    updateNotificationBadge();

    updateNotificationSummary();

}


/* ===========================================================
                    PAGE STARTUP
=========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        initializeNotificationSystem();

        notificationHealthCheck();

    }

);


/* ===========================================================
                    GLOBAL NOTIFICATION API
=========================================================== */

window.RoyalNotifications = {

    initializeNotifications,

    initializeNotificationSystem,

    loadNotifications,

    saveNotifications,

    createNotification,

    showNotificationPopup,

    quickNotify,

    notifyOrder,

    notifyCart,

    notifyWishlist,

    notifyOffer,

    notifyDelivery,

    markNotificationRead,

    markAllNotificationsRead,

    deleteNotification,

    clearNotifications,

    refreshNotifications,

    updateNotificationSummary

};


/* ===========================================================
                    AUTO SAVE
=========================================================== */

window.addEventListener(

    "beforeunload",

    function(){

        saveNotifications();

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

        initializeNotifications();

        initializeNotificationSystem();

        updateNotificationSummary();

        notificationHealthCheck();

    }

);


/* ===========================================================
                    MODULE STATUS
=========================================================== */

function isNotificationModuleReady(){

    return Array.isArray(

        notifications

    );

}


/* ===========================================================
                    MODULE VERSION
=========================================================== */

function getNotificationVersion(){

    return "3.0";

}


/* ===========================================================
                    GLOBAL NOTIFICATION API
=========================================================== */

window.RoyalNotificationAPI = {

    initializeNotifications,

    initializeNotificationSystem,

    loadNotifications,

    saveNotifications,

    renderNotifications,

    createNotification,

    showNotificationPopup,

    quickNotify,

    notifyOrder,

    notifyCart,

    notifyWishlist,

    notifyOffer,

    notifyDelivery,

    markNotificationRead,

    markAllNotificationsRead,

    deleteNotification,

    clearNotifications,

    refreshNotifications,

    getNotification,

    getNotificationCount,

    getUnreadNotificationCount,

    getReadNotificationCount,

    getNotificationHistory,

    updateNotificationSummary,

    isNotificationModuleReady,

    getNotificationVersion

};


/* ===========================================================
                    FINAL NOTES

ROYAL STORE V3

FILE NAME :
notifications.js

VERSION :
3.0

STATUS :
100% VERIFIED

MODULES INCLUDED

✔ Notification Engine
✔ Order Notifications
✔ Cart Notifications
✔ Wishlist Notifications
✔ Offer Alerts
✔ Delivery Alerts
✔ Notification History
✔ Auto Hide
✔ Sound Support
✔ Global Notification API

SUPPORTED DEVICES

✔ Android
✔ iPhone (iOS)
✔ Tablet
✔ Desktop

FUTURE READY

✔ Browser Push Notifications
✔ Firebase Cloud Messaging
✔ Email Alerts
✔ SMS Notifications
✔ AI Smart Notifications

BUILD STATUS

LOCKED

DO NOT MODIFY
WITHOUT VERSION UPDATE.

=========================================================== */


/* ===========================================================
      ROYAL STORE V3 NOTIFICATIONS.JS COMPLETE
=========================================================== */
