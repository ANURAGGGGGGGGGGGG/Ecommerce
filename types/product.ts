export interface Product {
  id: string | number;
  _id?: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  stock?: number;
  sellerId?: string;
}