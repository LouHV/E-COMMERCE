const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    REGISTER: 'register',
    PRODUCTS__CATEGORY: ':category', //products
    BLOGS: 'blogs',
    COUPONS: 'coupons',
    FAQS: 'faqs',
    DETAIL_PRODUCT__CATEGORY__PID__TITLE: ':category/:pid/:title',
    DETAIL_BLOG__BID__TITLE: 'blogs/:bid/:title',
    FINAL_REGISTER: 'finalregister/:status',
    RESET_PASSWORD: 'reset-password/:token',
    DETAILORDER:'detailorder/:orderId',
    DETAIL_CART: 'my-cart',
    CHECKOUT: "checkout",
    PRODUCTS: 'products',
    SEARCH: 'search',
    CHAT:'chats',

    //admin
    ADMIN: 'admin',
    DASHBOARD: 'dasboard',

    
    MANAGE_USER: 'manage-user',
    MANAGE_PRODUCTS: 'manage-products',
    MANAGE_ORDER: 'manage-order',
    CREATE_PRODUCTS: 'create-products',
    COUPON: 'coupon',
    CREATE_COUPON: 'create-coupon',
    MANAGE_BLOG: 'manage-blog',
    CREATE_BLOG: 'create-blog',
    MANAGE_CATEGORY: 'manage-category',
    CREATE_CATEGORY: 'create-category',
    MANAGE_BRAND: 'manage-brand',
    CREATE_BRAND: 'create-brand',
    //member
    MEMBER: 'member',
    PERSONAL: 'personnal',
    MY_CART: 'my-cart',
    HISTORY: 'buy-history',
    WISHLIST: 'wishlist',
    CHANGEPASS: 'change-password'
}

export default path