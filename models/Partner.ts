import { Order } from "./Order";

export interface Partner {
  id: string;
  name: string;
  pic: string;
  countryCode: string;
  phone: string;
  address: string;
  image: string | null;

  orders: Order[];

  isDeleted: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}
