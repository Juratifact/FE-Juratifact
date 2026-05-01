export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/Identity/login",
    REGISTER: "/api/User/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
  },
  USER: {
    BASE: "/api/User",
    GET_ALL: "/api/User/GetAll",
    GET_BY_NAME: "/api/User/GetUserByName",
    MY_PROFILE: "/api/User/MyProfile",
    PROFILE: "/api/User/Profile",
  },
  PRODUCT: {
    BASE: "/api/Product",
    POST: "/api/Product/Post",
    TITLE: "/api/Product/Title",
    CONDITION: "/api/Product/Condition",
    COMMENT: "/api/Product/Comment",
    COMMENTS: (productId: string) => `/api/Product/${productId}/comments`,
  },
  REPORT: {
    BASE: "/api/Report",
    CREATE_REPORT: "/api/Report/CreateReport",
    GET_REPORT: "/api/Report/GetReport",
    APPROVE: "/api/Report/AproveReport/BannedProduct",
    REJECT: "/api/Report/RejectReport",
  },
};
export const QUERY_KEYS = {
  PRODUCTS: ["products"] as const,
  PRODUCT_DETAIL: (id: string) => ["products", id] as const,
  PRODUCT_COMMENTS: (id: string) => ["products", id, "comments"] as const,
  USERS: ["users"] as const,
  MY_PROFILE: (id: string) => ["users", "my-profile", id] as const,
  USER_BY_NAME: (userName: string) => ["users", "name", userName] as const,
  USER_LOCATION: ["user-location"] as const,
  REPORTS: ["reports"] as const,
  REPORT_DETAIL: (id: string) => ["reports", id] as const,
};

export const PRODUCT_CONDITIONS = [
  { value: "New", label: "New" },
  { value: "Like new", label: "Like new" },
  { value: "Good", label: "Good" },
];

export const REPORT_STATUS_OPTIONS = [
  { value: 0, label: "Chờ xử lý" },
  { value: 1, label: "Đã duyệt" },
  { value: 2, label: "Bị từ chối" },
  { value: 3, label: "Bị từ chối" },
];
