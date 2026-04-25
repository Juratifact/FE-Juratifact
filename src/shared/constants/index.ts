export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/Identity/login",
    REGISTER: "/User/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  PRODUCT: {
    BASE: "/Product",
    POST: "/Product/Post",
    TITLE: "/Product/Title",
    CONDITION: "/Product/Condition",
    COMMENT: "/Product/Comment",
  },
};
export const QUERY_KEYS = {
  PRODUCTS: ["products"] as const,
  PRODUCT_DETAIL: (id: string) => ["products", id] as const,
  USER_LOCATION: ["user-location"] as const,
};

export const PRODUCT_CONDITIONS = [
  { value: "New", label: "New" },
  { value: "Like new", label: "Like new" },
  { value: "Good", label: "Good" },
];
