import { Product } from "./Product";
import { User } from "./User";

export interface Input {
  id: string;
  amount: number;
  unit: string;

  product: Product;
  productId: string;

  userId: string;
  user: User;

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}
