// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce.routemisr.com/api/v1';

// Auth Endpoints
export const AUTH_ENDPOINTS = {
    REGISTER: '/auth/signup',
    LOGIN: '/auth/signin',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgotPassword',
    RESET_PASSWORD: '/auth/resetPassword',
    CHANGE_PASSWORD: '/auth/changeMyPassword',
    GET_PROFILE: '/users/getMe',
    UPDATE_PROFILE: '/users/updateMe',
};

// Products Endpoints
export const PRODUCTS_ENDPOINTS = {
    GET_ALL: '/products',
    GET_ONE: '/products/:id',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
};

// Categories Endpoints
export const CATEGORIES_ENDPOINTS = {
    GET_ALL: '/categories',
    GET_ONE: '/categories/:id',
    CREATE: '/categories',
    UPDATE: '/categories/:id',
    DELETE: '/categories/:id',
};

// Subcategories Endpoints
export const SUBCATEGORIES_ENDPOINTS = {
    GET_ALL: '/subcategories',
    GET_ONE: '/subcategories/:id',
    CREATE: '/subcategories',
    UPDATE: '/subcategories/:id',
    DELETE: '/subcategories/:id',
};

// Brands Endpoints
export const BRANDS_ENDPOINTS = {
    GET_ALL: '/brands',
    GET_ONE: '/brands/:id',
    CREATE: '/brands',
    UPDATE: '/brands/:id',
    DELETE: '/brands/:id',
};

// Cart Endpoints
export const CART_ENDPOINTS = {
    GET_CART: '/cart',
    ADD_TO_CART: '/cart',
    UPDATE_CART: '/cart/:itemId',
    REMOVE_FROM_CART: '/cart/:itemId',
    CLEAR_CART: '/cart',
};

// Wishlist Endpoints
export const WISHLIST_ENDPOINTS = {
    GET_WISHLIST: '/wishlist',
    ADD_TO_WISHLIST: '/wishlist',
    REMOVE_FROM_WISHLIST: '/wishlist/:productId',
};

// Orders Endpoints
export const ORDERS_ENDPOINTS = {
    GET_ALL: '/orders',
    GET_ONE: '/orders/:id',
    CREATE: '/orders',
    CHECKOUT_SESSION: '/orders/checkout-session/:cartId',
};

// Address Endpoints
export const ADDRESS_ENDPOINTS = {
    GET_ALL: '/addresses',
    CREATE: '/addresses',
    UPDATE: '/addresses/:id',
    DELETE: '/addresses/:id',
};

// Review Endpoints
export const REVIEWS_ENDPOINTS = {
    GET_ALL: '/reviews',
    GET_ONE: '/reviews/:id',
    CREATE: '/reviews',
    UPDATE: '/reviews/:id',
    DELETE: '/reviews/:id',
};

// Coupon Endpoints
export const COUPON_ENDPOINTS = {
    GET_ALL: '/coupons',
    GET_ONE: '/coupons/:id',
};

// Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'ecommerce_token',
    USER: 'ecommerce_user',
    CART: 'ecommerce_cart',
    WISHLIST: 'ecommerce_wishlist',
};

// Messages
export const API_MESSAGES = {
    SUCCESS: 'Operation completed successfully',
    ERROR: 'An error occurred. Please try again.',
    LOGIN_REQUIRED: 'Please login to continue',
    UNAUTHORIZED: 'You do not have permission to perform this action',
    NOT_FOUND: 'Resource not found',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    VALIDATION_ERROR: 'Please check your input and try again',
};

// Default Pagination
export const DEFAULT_PAGINATION = {
    LIMIT: 10,
    PAGE: 1,
};

// Product Filter Options
export const PRODUCT_FILTERS = {
    SORT_OPTIONS: [
        { label: 'Newest', value: '-createdAt' },
        { label: 'Price: Low to High', value: 'price' },
        { label: 'Price: High to Low', value: '-price' },
        { label: 'Rating', value: '-ratingsAverage' },
        { label: 'Most Popular', value: '-sold' },
    ],
};