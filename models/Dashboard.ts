export interface Overview {
  order: {
    total: number;
    message: string;
  };
  sales: {
    totalIncome: number;
    totalProfit: number;
    averageTransactionValue: number;
  };
  orderItem: {
    total: number;
  };
}

export interface ChartRes {
  keys: { name: string; color: string; total: number }[];
  chart: {
    date: string;
    [key: string]: number | string;
    total: number;
  }[];
  master: {
    total: number;
    totalBuyPrice: number;
    totalSellPrice: number;
    profit: number;
  };
}

export interface PartnerOverview {
  totalPartners: number;
  topPartners: {
    name: string;
    totalQuantity: number;
  }[];
  transaction: {
    averageTransactionValue: number;
    totalBuyPrice: number;
    totalSellPrice: number;
    totalQuantity: number;
  };
}
