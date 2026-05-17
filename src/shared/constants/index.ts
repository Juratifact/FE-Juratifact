export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/users",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
  },
  USER: {
    BASE: "/api/users",
    GET_ALL: "/api/users",
    MY_PROFILE: (id: string) => `/api/users/${id}`,
    GET_BY_ID: (id: string) => `/api/users/${id}`,
    CREATE: "/api/users",
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
    GET_BY_USERNAME: (userName: string) => `/api/users/by-username/${userName}`,
    SHIPPERS: "/api/users/shippers",
  },
  PRODUCT: {
    BASE: "/api/products",
    GET_ALL: "/api/products",
    CREATE: "/api/products",
    GET_MY_PRODUCTS: "/api/products/me",
    BY_TITLE: "/api/products/by-title",
    BY_CONDITION: "/api/products/by-condition",
    COMMENTS_ME: "/api/products/comments/me",
    COMMENTS: (productId: string) => `/api/products/${productId}/comments`,
    COMMENT_BY_ID: (commentId: string) => `/api/products/comments/${commentId}`,
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,
  },
  REPORT: {
    BASE: "/api/reports",
    CREATE_REPORT: "/api/reports",
    GET_REPORT: "/api/reports",
    GET_BY_ID: (reportId: string) => `/api/reports/${reportId}`,
    APPROVE: (reportId: string) => `/api/reports/${reportId}/approve`,
    REJECT: (reportId: string) => `/api/reports/${reportId}/reject`,
  },
  IDENTIFY_DOCUMENT: {
    BASE: "/api/identity-documents",
    GET_BY_ID: (documentId: string) => `/api/identity-documents/${documentId}`,
    SUBMIT: "/api/identity-documents",
    GET_MY_DOCUMENT: "/api/identity-documents/me",
    RE_SUBMIT: "/api/identity-documents/me",
    GET_ALL: "/api/identity-documents",
    APPROVE: (documentId: string) =>
      `/api/identity-documents/${documentId}/approval`,
    REJECT: (documentId: string) =>
      `/api/identity-documents/${documentId}/rejection`,
  },
  CART: {
    MY_CART: "/api/carts/me",
    ADD_ITEM: (userId: string) => `/api/carts/${userId}/items`,
    REMOVE_ITEM: (userId: string, productId: string) =>
      `/api/carts/${userId}/items/${productId}`,
  },
  SHIPPER: {
    AVAILABLE_ORDERS: "/api/shippers/orders/available",
    ACCEPT_ORDER: (shipperId: string, orderId: string) =>
      `/api/shippers/${shipperId}/orders/${orderId}/acceptance`,
    GET_MY_ORDERS: (shipperId: string) => `/api/shippers/${shipperId}/orders`,
    GET_ORDER_DETAIL: (shipperId: string, orderId: string) =>
      `/api/shippers/${shipperId}/orders/${orderId}`,
    PICKUP: (shipperId: string, orderId: string) =>
      `/api/shippers/${shipperId}/orders/${orderId}/pickup`,
    DELIVERY: (shipperId: string, orderId: string) =>
      `/api/shippers/${shipperId}/orders/${orderId}/delivery`,
  },
  ORDER: {
    BASE: "/api/orders",
    GET_ALL: "/api/orders",
    CREATE: "/api/orders",
    MY_ORDERS: "/api/orders/me",
    GET_BY_ID: (orderId: string) => `/api/orders/${orderId}`,
    GET_STATUS: (orderId: string) => `/api/orders/${orderId}/status`,
    CONFIRM_RECEIPT: (sellerOrderId: string) =>
      `/api/orders/seller-orders/${sellerOrderId}/confirm-receipt`,
    CANCEL: (orderId: string) => `/api/orders/${orderId}/cancel`,
    CANCEL_CHECKOUT: (orderId: string) =>
      `/api/orders/${orderId}/cancel-checkout`,
    UPDATE_SHIPPING_ADDRESS: (orderId: string) =>
      `/api/orders/${orderId}/shipping-address`,
    GET_PRODUCTS_BY_ORDER: (orderId: string, productId: string) =>
      `/api/orders/${orderId}/products/${productId}`,
  },
  SELLER_ORDER: {
    MY_ORDERS: "/api/seller-orders/me",
    GET_BY_ID: (id: string) => `/api/seller-orders/${id}`,
  },
  PROMOTION: {
    BASE: "/api/promotions/packages",
    GET_AVAILABLE_PACKAGES: "/api/promotions/packages/available",
    SUBSCRIBE: (packageId: string) => `/api/promotions/packages/${packageId}/subscriptions`,
    MY_SUBSCRIPTION: "/api/promotions/subscriptions/me",
    APPLY: "/api/promotions/products/applications",
    GET_APPLIED_PRODUCTS: "/api/promotions/products",
    GET_PRODUCTS_WITHOUT_PROMOTION: "/api/promotions/products/without-promotion",
    GET_PRODUCTS_BY_PACKAGE: (id: string) => `/api/promotions/products/${id}`,
  },
  VIETMAP: {
    AUTOCOMPLETE: "/api/vietmap/autocomplete",
  },
  WALLET: {
    MY_WALLET: "/api/wallets/me",
  },
  TRANSACTION: {
    BASE: "/api/transaction",
  },
};
export const QUERY_KEYS = {
  PRODUCTS: ["products"] as const,
  PRODUCT_DETAIL: (id: string) => ["products", id] as const,
  PRODUCT_COMMENTS: (id: string) => ["products", id, "comments"] as const,
  MY_PRODUCTS: ["products", "my-products"] as const,
  USERS: ["users"] as const,
  MY_PROFILE: (id: string) => ["users", "my-profile", id] as const,
  USER_BY_NAME: (userName: string) => ["users", "name", userName] as const,
  USER_LOCATION: ["user-location"] as const,
  REPORTS: ["reports"] as const,
  REPORT_DETAIL: (id: string) => ["reports", id] as const,
  ORDERS: ["orders"] as const,
  ORDER_DETAIL: (id: string) => ["orders", id] as const,
  MY_ORDERS: ["orders", "my"] as const,
  SELLER_ORDERS: ["orders", "seller"] as const,
  IDENTIFY_MY_DOCUMENT: ["identify", "my-document"] as const,
  IDENTIFY_DOCUMENTS: ["identify", "documents"] as const,
  CART: ["cart"] as const,
  SHIPPER_AVAILABLE_ORDERS: ["shipper", "available-orders"] as const,
  SHIPPER_ORDERS: ["shipper", "orders"] as const,
  PROMOTIONS: ["promotions"] as const,
  MAP_AUTOCOMPLETE: (text: string) => ["map", "autocomplete", text] as const,
  WALLET: ["wallet"] as const,
  TRANSACTIONS: ["transactions"] as const,
  PRODUCTS_WITHOUT_PROMOTION: ["promotions", "products-without"] as const,
};

export const PRODUCT_CONDITIONS = [
  { value: "New", label: "Mới" },
  { value: "Like new", label: "Như mới" },
  { value: "Good", label: "Tốt" },
];

export const REPORT_STATUS_OPTIONS = [
  { value: 0, label: "Chờ xử lý" },
  { value: 1, label: "Đã duyệt" },
  { value: 2, label: "Bị từ chối" },
];
