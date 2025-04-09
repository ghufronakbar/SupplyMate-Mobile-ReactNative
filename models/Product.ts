import { Input } from "./Input";
import { OrderItem } from "./Order";

export interface Product {
  id: string;
  uniqueCode: string;
  name: string;
  unit: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  image: string | null;

  orderItems: OrderItem[];
  inputs: Input[]

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}
