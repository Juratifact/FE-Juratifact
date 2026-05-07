export type CartItem = {
  id: string;
  productId: string;
  title?: string;
  price?: number;
  quantity: number;
  imageUrls?: string[];
};

export type Cart = {
  items: CartItem[];
  total?: number;
};

export type AddToCartDto = {
  productId: string;
  quantity: number;
};

export type AddToCartResponse = {
  success: boolean;
  message?: string;
  data?: unknown;
};
