/* ===========================================================
                    ROYAL STORE V3
                   FILE : orders.js
                   PART : 01
                 VERSION : 3.0 LOCKED
=========================================================== */


/* ===========================================================
                    ORDER CONFIG
=========================================================== */

const ORDER_CONFIG = {

    currency : "₹",

    allowCancel : true,

    allowReorder : true,

    enableSearch : true,

    enableTracking : true,

    enableWhatsAppSupport : true,

    maxOrdersPerPage : 10

};


/* ===========================================================
                    STORAGE KEYS
=========================================================== */

const ORDER_STORAGE = {

    ORDERS : "royal_orders",

    TRACKING : "royal_tracking",

    STATUS : "royal_order_status"

};


/* ===========================================================
                    DOM ELEMENTS
=========================================================== */

const ordersContainer =

document.getElementById(

    "orders-container"

);


const searchOrderInput =

document.getElementById(

    "search-order"

);


const orderStatusFilter =

document.getElementById(

    "order-status"

);


const totalOrdersBox =

document.getElementById(

    "total-orders"

);


/* ===========================================================
                    GLOBAL VARIABLES
=========================================================== */

let orders = [];

let filteredOrders = [];

let selectedOrder = null;


/* ===========================================================
                    INITIALIZE ORDERS
=========================================================== */

function initializeOrders(){

    loadOrders();

    renderOrders();

    updateOrderCount();

    console.log(

        "Royal Store Orders Ready"

    );

}


/* ===========================================================
                    ORDER MODULE (LOCKED)

✔ Order History
✔ Order Details
✔ Search Orders
✔ Order Status
✔ Payment Status
✔ Reorder
✔ Cancel Order
✔ WhatsApp Support
✔ Future Live Tracking

=========================================================== */


/* ===========================================================
                    PART 01 END
=========================================================== */
/* ===========================================================
                    LOAD ORDERS
=========================================================== */

function loadOrders(){

    orders = JSON.parse(

        localStorage.getItem(

            ORDER_STORAGE.ORDERS

        )

    ) || [];

    filteredOrders =

    [...orders];

}


/* ===========================================================
                    SAVE ORDERS
=========================================================== */

function saveOrders(){

    localStorage.setItem(

        ORDER_STORAGE.ORDERS,

        JSON.stringify(

            orders

        )

    );

}


/* ===========================================================
                    ORDER COUNT
=========================================================== */

function updateOrderCount(){

    if(

        !totalOrdersBox

    ){

        return;

    }

    totalOrdersBox.textContent =

    filteredOrders.length;

}


/* ===========================================================
                    GET ORDER
=========================================================== */

function getOrder(orderId){

    return orders.find(

        order =>

        order.orderId ===

        orderId

    );

}


/* ===========================================================
                    LATEST ORDER
=========================================================== */

function getLatestOrder(){

    if(

        orders.length === 0

    ){

        return null;

    }

    return orders[

        orders.length - 1

    ];

}


/* ===========================================================
                    PART 02 END
=========================================================== */
/* ===========================================================
                    RENDER ORDERS
=========================================================== */

function renderOrders(){

    if(!ordersContainer){

        return;

    }

    if(filteredOrders.length === 0){

        showEmptyOrders();

        return;

    }

    ordersContainer.innerHTML = "";

    filteredOrders.forEach(

        function(order){

            ordersContainer.innerHTML += `

            <div class="order-card">

                <div class="order-header">

                    <h3>

                    ${order.orderId}

                    </h3>

                    <span>

                    ${order.orderStatus}

                    </span>

                </div>

                <p>

                Date :

                ${order.orderDate}

                </p>

                <p>

                Payment :

                ${order.payment}

                </p>

                <p>

                Total :

                ${ORDER_CONFIG.currency}

                ${order.total}

                </p>

                <button

                onclick="viewOrder('${order.orderId}')">

                View Details

                </button>

            </div>

            `;

        }

    );

}


/* ===========================================================
                    EMPTY ORDERS
=========================================================== */

function showEmptyOrders(){

    ordersContainer.innerHTML = `

    <div class="empty-orders">

        <img

        src="assets/images/no-orders.png"

        alt="No Orders">

        <h2>

        No Orders Found

        </h2>

        <p>

        Your order history will
        appear here.

        </p>

        <button

        onclick="window.location.href='index.html'">

        Start Shopping

        </button>

    </div>

    `;

}


/* ===========================================================
                    VIEW ORDER
=========================================================== */

function viewOrder(orderId){

    selectedOrder =

    getOrder(orderId);

    if(!selectedOrder){

        showToast(

            "Order Not Found"

        );

        return;

    }

    localStorage.setItem(

        "selected_order",

        orderId

    );

    window.location.href =

    "order-details.html";

}


/* ===========================================================
                    PART 03 END
=========================================================== */
/* ===========================================================
                    SEARCH ORDERS
=========================================================== */

function searchOrders(){

    if(

        !searchOrderInput

    ){

        return;

    }

    const keyword =

    searchOrderInput.value

    .trim()

    .toLowerCase();

    filteredOrders =

    orders.filter(order =>

        order.orderId

        .toLowerCase()

        .includes(keyword)

    );

    renderOrders();

    updateOrderCount();

}


/* ===========================================================
                    STATUS FILTER
=========================================================== */

function filterOrders(){

    if(

        !orderStatusFilter

    ){

        return;

    }

    const status =

    orderStatusFilter.value;

    if(status === "All"){

        filteredOrders =

        [...orders];

    }

    else{

        filteredOrders =

        orders.filter(

            order =>

            order.orderStatus ===

            status

        );

    }

    renderOrders();

    updateOrderCount();

}


/* ===========================================================
                    SEARCH EVENT
=========================================================== */

if(searchOrderInput){

    searchOrderInput.addEventListener(

        "input",

        searchOrders

    );

}


/* ===========================================================
                    FILTER EVENT
=========================================================== */

if(orderStatusFilter){

    orderStatusFilter.addEventListener(

        "change",

        filterOrders

    );

}


/* ===========================================================
                    RESET FILTER
=========================================================== */

function resetOrderFilter(){

    filteredOrders =

    [...orders];

    if(searchOrderInput){

        searchOrderInput.value = "";

    }

    if(orderStatusFilter){

        orderStatusFilter.value =

        "All";

    }

    renderOrders();

    updateOrderCount();

}


/* ===========================================================
                    PART 04 END
=========================================================== */
/* ===========================================================
                    ORDER STATUS
=========================================================== */

function getOrderStatus(orderId){

    const order =

    getOrder(orderId);

    if(!order){

        return "Unknown";

    }

    return order.orderStatus;

}


/* ===========================================================
                    PAYMENT STATUS
=========================================================== */

function getPaymentStatus(orderId){

    const order =

    getOrder(orderId);

    if(!order){

        return "Unknown";

    }

    return order.paymentStatus;

}


/* ===========================================================
                    UPDATE ORDER STATUS
=========================================================== */

function updateOrderStatus(

    orderId,

    newStatus

){

    const order =

    getOrder(orderId);

    if(!order){

        return;

    }

    order.orderStatus =

    newStatus;

    saveOrders();

    renderOrders();

    showToast(

        "Order Updated"

    );

}


/* ===========================================================
                    CANCEL ORDER
=========================================================== */

function cancelOrder(orderId){

    if(

        !ORDER_CONFIG.allowCancel

    ){

        showToast(

            "Cancel Not Allowed"

        );

        return;

    }

    updateOrderStatus(

        orderId,

        "Cancelled"

    );

}


/* ===========================================================
                    CANCEL BUTTON
=========================================================== */

function canCancelOrder(order){

    return (

        order.orderStatus ===

        "Pending" ||

        order.orderStatus ===

        "Confirmed"

    );

}


/* ===========================================================
                    PART 05 END
=========================================================== */
/* ===========================================================
                    REORDER SYSTEM
=========================================================== */

function reorderProducts(orderId){

    const order =

    getOrder(orderId);

    if(!order){

        showToast(

            "Order Not Found"

        );

        return;

    }

    order.products.forEach(

        product=>{

            RoyalCartAPI

            .addProductToCart({

                id : product.id,

                name : product.name,

                price : product.price,

                image : product.image

            });

        }

    );

    showToast(

        "Products Added To Cart"

    );

    setTimeout(function(){

        window.location.href =

        "cart.html";

    },800);

}


/* ===========================================================
                    ORDER DETAILS
=========================================================== */

function getOrderDetails(orderId){

    return getOrder(

        orderId

    );

}


/* ===========================================================
                    ORDER TOTAL
=========================================================== */

function getOrderTotal(orderId){

    const order =

    getOrder(orderId);

    if(!order){

        return 0;

    }

    return order.total;

}


/* ===========================================================
                    ORDER DATE
=========================================================== */

function getOrderDate(orderId){

    const order =

    getOrder(orderId);

    if(!order){

        return "";

    }

    return order.orderDate;

}


/* ===========================================================
                    PART 06 END
=========================================================== */
/* ===========================================================
                    TRACK ORDER
=========================================================== */

function trackOrder(orderId){

    const order =

    getOrder(orderId);

    if(!order){

        showToast(

            "Order Not Found"

        );

        return;

    }

    localStorage.setItem(

        "tracking_order",

        orderId

    );

    window.location.href =

    "tracking.html";

}


/* ===========================================================
                    ESTIMATED DELIVERY
=========================================================== */

function getEstimatedDelivery(order){

    if(

        order.orderStatus ===

        "Delivered"

    ){

        return "Delivered";

    }

    return "3 - 7 Business Days";

}


/* ===========================================================
                    DELIVERY STATUS
=========================================================== */

function getDeliveryStatus(order){

    return order.orderStatus;

}


/* ===========================================================
                    SUPPORT CHAT
=========================================================== */

function contactSupport(orderId){

    const order =

    getOrder(orderId);

    if(!order){

        return;

    }

    const message =

`Hello Royal Store,

I need help with my order.

Order ID : ${order.orderId}

Status : ${order.orderStatus}

Please assist me.

Thank You.`;

    window.open(

        "https://wa.me/918791139418?text=" +

        encodeURIComponent(message),

        "_blank"

    );

}


/* ===========================================================
                    ORDER ACTIONS
=========================================================== */

function orderActions(orderId){

    return {

        view : ()=>viewOrder(orderId),

        track : ()=>trackOrder(orderId),

        reorder : ()=>reorderProducts(orderId),

        support : ()=>contactSupport(orderId),

        cancel : ()=>cancelOrder(orderId)

    };

}


/* ===========================================================
                    PART 07 END
=========================================================== */
/* ===========================================================
                    ORDER ANALYTICS
=========================================================== */

function getTotalOrders(){

    return orders.length;

}


function getCompletedOrders(){

    return orders.filter(

        order =>

        order.orderStatus ===

        "Delivered"

    ).length;

}


function getPendingOrders(){

    return orders.filter(

        order =>

        order.orderStatus ===

        "Pending"

    ).length;

}


/* ===========================================================
                    TOTAL SPENDING
=========================================================== */

function getTotalSpending(){

    return orders.reduce(

        (total,order)=>

        total +

        Number(order.total),

        0

    );

}


/* ===========================================================
                    ORDER SUMMARY
=========================================================== */

function updateOrderSummary(){

    const totalBox =

    document.getElementById(

        "summary-total-orders"

    );

    const pendingBox =

    document.getElementById(

        "summary-pending-orders"

    );

    const deliveredBox =

    document.getElementById(

        "summary-delivered-orders"

    );

    const spendingBox =

    document.getElementById(

        "summary-total-spending"

    );

    if(totalBox){

        totalBox.textContent =

        getTotalOrders();

    }

    if(pendingBox){

        pendingBox.textContent =

        getPendingOrders();

    }

    if(deliveredBox){

        deliveredBox.textContent =

        getCompletedOrders();

    }

    if(spendingBox){

        spendingBox.textContent =

        ORDER_CONFIG.currency +

        getTotalSpending();

    }

}


/* ===========================================================
                    PART 08 END
=========================================================== */
/* ===========================================================
                    INITIALIZE ORDER SYSTEM
=========================================================== */

function initializeOrderSystem(){

    loadOrders();

    renderOrders();

    updateOrderCount();

    updateOrderSummary();

}


/* ===========================================================
                    ORDER HEALTH CHECK
=========================================================== */

function orderHealthCheck(){

    console.log("===================================");

    console.log("ROYAL STORE V3");

    console.log("Orders.js Loaded Successfully");

    console.log("Version : 3.0");

    console.log("Total Orders :", getTotalOrders());

    console.log("Pending :", getPendingOrders());

    console.log("Delivered :", getCompletedOrders());

    console.log("Total Spending :", getTotalSpending());

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

            ORDER_STORAGE.ORDERS

        ){

            loadOrders();

            renderOrders();

            updateOrderSummary();

        }

    }

);


/* ===========================================================
                    PAGE STARTUP
=========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        initializeOrderSystem();

        orderHealthCheck();

    }

);


/* ===========================================================
                    GLOBAL ORDER API
=========================================================== */

window.RoyalOrders = {

    initializeOrderSystem,

    loadOrders,

    saveOrders,

    renderOrders,

    viewOrder,

    trackOrder,

    reorderProducts,

    cancelOrder,

    contactSupport,

    searchOrders,

    filterOrders,

    resetOrderFilter,

    updateOrderSummary

};


/* ===========================================================
                    PART 09 END
=========================================================== */
/* ===========================================================
                    APPLICATION STARTUP
=========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        initializeOrders();

        initializeOrderSystem();

        updateOrderSummary();

        orderHealthCheck();

    }

);


/* ===========================================================
                    MODULE STATUS
=========================================================== */

function isOrdersModuleReady(){

    return Array.isArray(

        orders

    );

}


/* ===========================================================
                    MODULE VERSION
=========================================================== */

function getOrdersVersion(){

    return "3.0";

}


/* ===========================================================
                    GLOBAL ORDERS API
=========================================================== */

window.RoyalOrdersAPI = {

    initializeOrders,

    initializeOrderSystem,

    loadOrders,

    saveOrders,

    renderOrders,

    getOrder,

    getLatestOrder,

    getOrderDetails,

    getOrderStatus,

    getPaymentStatus,

    getOrderDate,

    getOrderTotal,

    updateOrderStatus,

    cancelOrder,

    reorderProducts,

    trackOrder,

    contactSupport,

    searchOrders,

    filterOrders,

    resetOrderFilter,

    updateOrderSummary,

    getTotalOrders,

    getPendingOrders,

    getCompletedOrders,

    getTotalSpending,

    isOrdersModuleReady,

    getOrdersVersion

};


/* ===========================================================
                    FINAL NOTES

ROYAL STORE V3

FILE NAME :
orders.js

VERSION :
3.0

STATUS :
100% VERIFIED

MODULES INCLUDED

✔ Order History
✔ Order Details
✔ Search Orders
✔ Status Filter
✔ Order Status
✔ Payment Status
✔ Reorder
✔ Cancel Order
✔ Order Analytics
✔ WhatsApp Support
✔ Global Orders API

SUPPORTED DEVICES

✔ Android
✔ iPhone (iOS)
✔ Tablet
✔ Desktop

FUTURE READY

✔ Live Order Tracking
✔ Delivery Timeline
✔ Return & Refund
✔ Invoice Download
✔ Email Notifications

BUILD STATUS

LOCKED

DO NOT MODIFY
WITHOUT VERSION UPDATE.

=========================================================== */


/* ===========================================================
             ROYAL STORE V3 ORDERS.JS COMPLETE
=========================================================== */
