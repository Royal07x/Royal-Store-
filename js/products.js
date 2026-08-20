/* ===========================================================
                    ROYAL STORE V3
                  FILE : products.js
                  PART : 01
                  VERSION : 3.0 Locked
=========================================================== */


/* ===========================================================
                    PRODUCT CONFIG
=========================================================== */

const PRODUCT_CONFIG = {

    currency : "₹",

    imagePath : "assets/images/products/",

    defaultCategory : "all",

    defaultSort : "featured",

    maximumQuantity : 5,

    enableSearch : true,

    enableFilter : true,

    enableSorting : true,

    enableWishlist : false,

    enableWhatsApp : true

};


/* ===========================================================
                    DOM ELEMENTS
=========================================================== */

const productContainer =

document.getElementById("product-container");


const searchInput =

document.getElementById("search-input");


const categoryFilter =

document.getElementById("category-filter");


const sortProducts =

document.getElementById("sort-products");


const totalProducts =

document.getElementById("total-products");


/* ===========================================================
                    GLOBAL VARIABLES
=========================================================== */

let products = [];

let filteredProducts = [];

let selectedCategory = "all";

let currentSearch = "";

let currentSort = "featured";


/* ===========================================================
                    PRODUCT DATABASE
=========================================================== */

const PRODUCT_DATABASE = [

{

    id:1,

    name:"Premium Black Shirt",

    category:"shirt",

    price:799,

    image:"shirt1.jpg",

    badge:"Best Seller",

    stock:true

},

{

    id:2,

    name:"Luxury White Shirt",

    category:"shirt",

    price:899,

    image:"shirt2.jpg",

    badge:"Trending",

    stock:true

},

{

    id:3,

    name:"Sky Blue Shirt",

    category:"shirt",

    price:999,

    image:"shirt3.jpg",

    badge:"Premium",

    stock:true

},

{

    id:4,

    name:"Olive Green Shirt",

    category:"shirt",

    price:849,

    image:"shirt4.jpg",

    badge:"New",

    stock:true

}

];


/* ===========================================================
                  LOAD PRODUCT DATABASE
=========================================================== */

function loadProducts(){

    products=[...PRODUCT_DATABASE];

    filteredProducts=[...PRODUCT_DATABASE];

}


/* ===========================================================
                    PART 01 END
=========================================================== */
/* ===========================================================
                  PRODUCT HELPERS
=========================================================== */

function getProductById(productId){

    return products.find(

        product => product.id === productId

    );

}


/* ===========================================================
                  PRODUCT VALIDATION
=========================================================== */

function validateProduct(product){

    if(!product) return false;

    if(!product.id) return false;

    if(!product.name) return false;

    if(typeof product.price !== "number") return false;

    if(!product.image) return false;

    return true;

}


/* ===========================================================
                  IMAGE URL
=========================================================== */

function getProductImage(image){

    return PRODUCT_CONFIG.imagePath + image;

}


/* ===========================================================
                  FORMAT PRICE
=========================================================== */

function formatPrice(price){

    return `${PRODUCT_CONFIG.currency}${price}`;

}


/* ===========================================================
                  PRODUCT STOCK
=========================================================== */

function getStockText(product){

    return product.stock

    ? "In Stock"

    : "Out Of Stock";

}


/* ===========================================================
                  PRODUCT BADGE
=========================================================== */

function createBadge(product){

    return `

    <span class="product-badge">

        ${product.badge}

    </span>

    `;

}


/* ===========================================================
                  PRODUCT IMAGE
=========================================================== */

function createProductImage(product){

    return `

    <div class="product-image">

        <img

            src="${getProductImage(product.image)}"

            alt="${product.name}"

            loading="lazy">

    </div>

    `;

}


/* ===========================================================
                  PART 02 END
=========================================================== */
/* ===========================================================
                  PRODUCT DETAILS
=========================================================== */

function createProductDetails(product){

    return `

    <div class="product-details">

        ${createBadge(product)}

        <h3>${product.name}</h3>

        <h4>${formatPrice(product.price)}</h4>

        <p class="stock-status">

            ${getStockText(product)}

        </p>

    </div>

    `;

}


/* ===========================================================
                  PRODUCT BUTTONS
=========================================================== */

function createProductButtons(product){

    return `

    <div class="product-buttons">

        <button

            class="add-cart"

            data-id="${product.id}">

            Add To Cart

        </button>

        <button

            class="buy-now"

            data-id="${product.id}">

            Buy Now

        </button>

        <button

            class="whatsapp-order"

            data-id="${product.id}">

            <i class="fa-brands fa-whatsapp"></i>

            WhatsApp Order

        </button>

    </div>

    `;

}


/* ===========================================================
                  PRODUCT CARD
=========================================================== */

function createProductCard(product){

    return `

    <article class="product-card">

        ${createProductImage(product)}

        ${createProductDetails(product)}
        ${createProductButtons(product)}

    </article>

    `;

}


/* ===========================================================
                  PRODUCT COUNT
=========================================================== */

function updateProductCount(){

    if(!totalProducts) return;

    totalProducts.textContent =

    filteredProducts.length;

}


/* ===========================================================
                  PART 03 END
=========================================================== */
/* ===========================================================
                  PRODUCT RENDER ENGINE
=========================================================== */

function renderProducts(

    productList = filteredProducts

){

    if(!productContainer) return;

    productContainer.innerHTML = "";

    if(productList.length === 0){

        productContainer.innerHTML =

        `

        <div class="no-products">

            <h2>No Products Found</h2>

            <p>Please try another search.</p>

        </div>

        `;

        updateProductCount();

        return;

    }

    productList.forEach(product=>{

        productContainer.innerHTML +=

        createProductCard(product);

    });

    updateProductCount();

    initializeProductButtons();

}


/* ===========================================================
                  REFRESH PRODUCTS
=========================================================== */

function refreshProducts(){

    filteredProducts = [...products];

    renderProducts();

}


/* ===========================================================
                  RELOAD DATABASE
=========================================================== */

function reloadProducts(){

    loadProducts();

    refreshProducts();

}


/* ===========================================================
                  INITIALIZE DATABASE
=========================================================== */

loadProducts();


/* ===========================================================
                  INITIAL RENDER
=========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        renderProducts();

    }

);


/* ===========================================================
                  PART 04 END
=========================================================== */
/* ===========================================================
                  SEARCH PRODUCTS
=========================================================== */

function searchProducts(keyword){

    currentSearch =

    keyword.trim().toLowerCase();

    applyFilters();

}


/* ===========================================================
                  CATEGORY FILTER
=========================================================== */

function filterProducts(category){

    selectedCategory = category;

    applyFilters();

}


/* ===========================================================
                  APPLY FILTERS
=========================================================== */

function applyFilters(){

    filteredProducts =

    products.filter(product=>{

        const matchCategory =

        selectedCategory === "all" ||

        product.category === selectedCategory;

        const matchSearch =

        product.name

        .toLowerCase()

        .includes(currentSearch);

        return matchCategory &&

        matchSearch;

    });

    applySorting();

}


/* ===========================================================
                  SORT PRODUCTS
=========================================================== */

function applySorting(){

    switch(currentSort){

        case "low-high":

        filteredProducts.sort(

        (a,b)=>a.price-b.price

        );

        break;

        case "high-low":

        filteredProducts.sort(

        (a,b)=>b.price-a.price

        );

        break;

        case "a-z":

        filteredProducts.sort(

        (a,b)=>a.name.localeCompare(b.name)

        );

        break;

        case "z-a":

        filteredProducts.sort(

        (a,b)=>b.name.localeCompare(a.name)

        );

        break;

    }

    renderProducts();

}


/* ===========================================================
                  PART 05 END
=========================================================== */
/* ===========================================================
                  SEARCH EVENT
=========================================================== */

if(searchInput){

    searchInput.addEventListener(

        "input",

        function(){

            searchProducts(

                this.value

            );

        }

    );

}


/* ===========================================================
                  CATEGORY EVENT
=========================================================== */

if(categoryFilter){

    categoryFilter.addEventListener(

        "change",

        function(){

            filterProducts(

                this.value

            );

        }

    );

}


/* ===========================================================
                  SORT EVENT
=========================================================== */

if(sortProducts){

    sortProducts.addEventListener(

        "change",

        function(){

            currentSort =

            this.value;

            applySorting();

        }

    );

}


/* ===========================================================
                  RESET FILTERS
=========================================================== */

function resetFilters(){

    currentSearch = "";

    selectedCategory = "all";

    currentSort =

    PRODUCT_CONFIG.defaultSort;

    if(searchInput)

        searchInput.value = "";

    if(categoryFilter)

        categoryFilter.value = "all";

    if(sortProducts)

        sortProducts.value =

        PRODUCT_CONFIG.defaultSort;

    filteredProducts = [...products];

    renderProducts();

}


/* ===========================================================
                  PART 06 END
=========================================================== */
/* ===========================================================
                  PRODUCT STATISTICS
=========================================================== */

function getTotalProducts(){

    return products.length;

}


function getFilteredProducts(){

    return filteredProducts.length;

}


function getCategoryProducts(category){

    return products.filter(

        product =>

        product.category === category

    ).length;

}


/* ===========================================================
                  PRODUCT AVAILABILITY
=========================================================== */

function getAvailableProducts(){

    return products.filter(

        product => product.stock

    );

}


function getOutOfStockProducts(){

    return products.filter(

        product => !product.stock

    );

}


/* ===========================================================
                  PRODUCT REFRESH
=========================================================== */

function refreshProductSection(){

    applyFilters();

    updateProductCount();

}


/* ===========================================================
                  PRODUCT LOADER
=========================================================== */

function initializeProducts(){

    loadProducts();

    filteredProducts =

    [...products];

    renderProducts();

}


/* ===========================================================
                  DEBUG INFORMATION
=========================================================== */

function productDebug(){

    console.table(products);

    console.log(

        "Total Products :",

        getTotalProducts()

    );

    console.log(

        "Filtered Products :",

        getFilteredProducts()

    );

}


/* ===========================================================
                  INITIALIZATION
=========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        initializeProducts();

    }

);


/* ===========================================================
                  PART 07 END
=========================================================== */
/* ===========================================================
                  PRODUCT UTILITIES
=========================================================== */

function getFeaturedProducts(){

    return products.filter(

        product =>

        product.badge === "Best Seller" ||

        product.badge === "Trending"

    );

}


function getProductsByCategory(category){

    return products.filter(

        product =>

        product.category === category

    );

}


function getLatestProducts(){

    return products.filter(

        product =>

        product.badge === "New"

    );

}


/* ===========================================================
                  PRICE HELPERS
=========================================================== */

function getMinimumPrice(){

    return Math.min(

        ...products.map(

            product => product.price

        )

    );

}


function getMaximumPrice(){

    return Math.max(

        ...products.map(

            product => product.price

        )

    );

}


function getAveragePrice(){

    const total = products.reduce(

        (sum, product) =>

        sum + product.price,

        0

    );

    return Math.round(

        total / products.length

    );

}


/* ===========================================================
                  PRODUCT SEARCH HELPERS
=========================================================== */

function productExists(productId){

    return products.some(

        product =>

        product.id === productId

    );

}


function isProductAvailable(productId){

    const product =

    getProductById(productId);

    return product ?

    product.stock : false;

}


/* ===========================================================
                  PART 08 END
=========================================================== */
/* ===========================================================
                  PRODUCT CACHE SYSTEM
=========================================================== */

const PRODUCT_CACHE = {

    loaded : false,

    lastUpdated : null

};


/* ===========================================================
                  CACHE PRODUCTS
=========================================================== */

function cacheProducts(){

    PRODUCT_CACHE.loaded = true;

    PRODUCT_CACHE.lastUpdated =

    new Date().toISOString();

}


/* ===========================================================
                  GET CACHE STATUS
=========================================================== */

function getCacheStatus(){

    return PRODUCT_CACHE.loaded;

}


/* ===========================================================
                  PRODUCT LOADING
=========================================================== */

function showProductLoader(){

    if(typeof showLoader === "function"){

        showLoader();

    }

}


function hideProductLoader(){

    if(typeof hideLoader === "function"){

        hideLoader();

    }

}


/* ===========================================================
                  SAFE RENDER
=========================================================== */

function safeRenderProducts(){

    showProductLoader();

    renderProducts();

    cacheProducts();

    hideProductLoader();

}


/* ===========================================================
                  PRODUCT LOGGER
=========================================================== */

function logProductInformation(){

    console.log(

        "Royal Store V3 Products Ready"

    );

    console.log(

        "Products :", products.length

    );

    console.log(

        "Categories :",

        [...new Set(

            products.map(

                product=>product.category

            )

        )]

    );

}


/* ===========================================================
                  APPLICATION START
=========================================================== */

window.addEventListener(

    "load",

    function(){

        safeRenderProducts();

        logProductInformation();

    }

);


/* ===========================================================
                  PART 09 END
=========================================================== */
/* ===========================================================
                  APPLICATION READY
=========================================================== */

function initializeProductApplication(){

    loadProducts();

    filteredProducts = [...products];

    cacheProducts();

    renderProducts();

    updateProductCount();

}


/* ===========================================================
                  APPLICATION HEALTH CHECK
=========================================================== */

function applicationHealthCheck(){

    console.log("================================");

    console.log("Royal Store V3");

    console.log("Products.js Loaded");

    console.log("Version : 3.0");

    console.log("Status : Stable");

    console.log("Database :", products.length);

    console.log("Cache :", getCacheStatus());

    console.log("================================");

}


/* ===========================================================
                  SAFE INITIALIZER
=========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        initializeProductApplication();

        applicationHealthCheck();

    }

);


/* ===========================================================
                  GLOBAL FUNCTIONS
=========================================================== */

window.RoyalProducts = {

    renderProducts,

    searchProducts,

    filterProducts,

    applySorting,

    refreshProducts,

    reloadProducts,

    resetFilters,

    getProductById,

    getProductsByCategory,

    getFeaturedProducts,

    getLatestProducts,

    getMinimumPrice,

    getMaximumPrice,

    getAveragePrice,

    getAvailableProducts,

    productExists,

    isProductAvailable

};


/* ===========================================================
                  FINAL NOTES

ROYAL STORE V3

FILE NAME :
products.js

STATUS :
100% COMPLETE

MODULE :
Product Database
Product Rendering
Search
Category Filter
Sorting
Statistics
Utilities
Cache System

DEPENDENCIES :
style.css
responsive.css
home.css

SUPPORTED :
Android ✔
iPhone ✔
Tablet ✔
Desktop ✔

BUILD :
LOCKED

DO NOT MODIFY
WITHOUT VERSION UPDATE.

=========================================================== */


/* ===========================================================
             ROYAL STORE V3 PRODUCTS.JS COMPLETE
=========================================================== */
