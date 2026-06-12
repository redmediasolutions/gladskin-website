export interface ProductHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  badge?: string;
  image: string;
  imageAlt: string;
  slug: string;
  description?: string;
  composition?: string;
  howItWorks?: string;
  sideEffects?: string;
  highlights?: ProductHighlight[];
  inStock?: boolean;
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
