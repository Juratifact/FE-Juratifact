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
  IDENTIFY_DOCUMENT: {
    BASE: "/api/IdentifyDocument",
    GET_BY_ID: "/api/IdentifyDocument/GetById",
    SUBMIT: "/api/IdentifyDocument/Submit",
    GET_MY_DOCUMENT: "/api/IdentifyDocument/GetMyDocument",
    RE_SUBMIT: "/api/IdentifyDocument/Re-Submit",
    GET_ALL: "/api/IdentifyDocument/GetAll/StatusPending",
    APPROVE: "/api/IdentifyDocument/Approve",
    REJECT: "/api/IdentifyDocument/Reject",
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
  RITUALS: ["rituals"] as const,
  RITUAL_DETAIL: (id: string) => ["rituals", id] as const,
  RITUAL_CATEGORIES: ["ritual-categories"] as const,
  IDENTIFY_MY_DOCUMENT: ["identify", "my-document"] as const,
  IDENTIFY_DOCUMENTS: ["identify", "documents"] as const,
};

export const PRODUCT_CONDITIONS = [
  { value: "New", label: "New" },
  { value: "Like new", label: "Like new" },
  { value: "Good", label: "Good" },
];

export const DIFFICULTY_LEVELS = [
  { value: "dễ", label: "Dễ" },
  { value: "trung bình", label: "Trung bình" },
  { value: "khó", label: "Khó" },
  { value: "rất khó", label: "Rất khó" },
];

export const REPORT_STATUS_OPTIONS = [
  { value: 0, label: "Chờ xử lý" },
  { value: 1, label: "Đã duyệt" },
  { value: 2, label: "Bị từ chối" },
  { value: 3, label: "Bị từ chối" },
];
