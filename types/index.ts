// User types
export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profileImg?: string;
    role: 'user' | 'admin';
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    phone?: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    email: string;
    newPassword: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    password: string;
    passwordConfirm: string;
}

// Product types
export interface Product {
    _id: string;
    title: string;
    description: string;
    slug: string;
    price: number;
    priceAfterDiscount?: number;
    colors: string[];
    imageCover: string;
    images: string[];
    category: Category;
    subcategory?: Subcategory;
    brand: Brand;
    ratingsAverage: number;
    ratingsQuantity: number;
    quantity: number;
    sold: number;
    createdAt: string;
    updatedAt: string;
    reviews?: Review[];
}

export interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Subcategory {
    _id: string;
    name: string;
    slug: string;
    category: string;
    createdAt: string;
    updatedAt: string;
}

export interface Brand {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

// Cart types
export interface CartItem {
    _id: string;
    product: string | Product;
    quantity: number;
    color: string;
    price: number;
    createdAt: string;
    updatedAt: string;
}

export interface Cart {
    _id: string;
    cartItems: CartItem[];
    totalCartPrice: number;
    totalPriceAfterDiscount?: number;
    user: string;
    createdAt: string;
    updatedAt: string;
}

export interface CartUpdatePayload {
    quantity: number;
}

// Wishlist types
export interface Wishlist {
    _id: string;
    user: string;
    products: string[] | Product[];
    createdAt: string;
    updatedAt: string;
}

// Order types
export interface Order {
    _id: string;
    user: User;
    cartItems: CartItem[];
    totalOrderPrice: number;
    totalPriceAfterDiscount?: number;
    paymentMethodType: 'card' | 'cash';
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    shippingAddress: Address;
    createdAt: string;
    updatedAt: string;
}

export interface Address {
    _id?: string;
    alias: string;
    details: string;
    phone: string;
    city: string;
    postalCode: string;
    isDefault?: boolean;
}

// Review types
export interface Review {
    _id: string;
    title: string;
    ratings: number;
    user: User;
    product: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReviewPayload {
    title: string;
    ratings: number;
}

// API Response types
export interface ApiResponse<T> {
    status: string;
    message?: string;
    data?: T;
    results?: number;
    paginationResult?: {
        currentPage: number;
        numberOfPages: number;
        limit: number;
    };
}

export interface ErrorResponse {
    statusCode: number;
    message: string;
    errors?: Record<string, string>;
}

// Pagination
export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    fields?: string;
    keyword?: string;
    [key: string]: any;
}

// Coupon types
export interface Coupon {
    _id: string;
    name: string;
    description: string;
    discount: number;
    expireDate: string;
    createdAt: string;
    updatedAt: string;
}