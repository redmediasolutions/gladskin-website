export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  badge?: string;
  image: string;
  imageAlt: string;
  slug: string;
}

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}
