import { Partner } from "./Partner";
import { Product } from "./Product";

export interface Order {
  id: string;
  totalBuyPrice: number;
  totalSellPrice: number;
  date: Date;
  note: string | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  cancelledAt: Date | null;

  orderItems: OrderItem[];

  partnerId: string;
  partner: Partner;

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
  status: OrderStatus;
}

export type OrderStatus =
  | "Selesai"
  | "Dalam Proses"
  | "Mendatang"
  | "Dibatalkan";

export interface OrderItem {
  id: string;
  uniqueCode: string;
  quantity: number;
  unit: string;
  totalBuyPrice: number;
  totalSellPrice: number;
  image: string | null;
  name: string;

  productId: string;
  product: Product;

  orderId: string;
  order: Order;

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}
