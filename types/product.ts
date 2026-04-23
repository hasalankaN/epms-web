/**
 * ===== PRODUCT TYPES =====
 */

export type StockStatus = "In Stock" | "Out of Stock";

export interface ProductDataType {
  id: string;
  thumbnail: string;
  gallery?: string[];
  productId: string;
  productName: string;
  productType: "Digital" | "Delivery" | "Physical" | "Service";
  barcodeSku: string;
  shortDescription?: string;
  longDescription?: string;
  price: number;
  quantity: number;
  stockThreshold?: number;
  stockStatus: StockStatus;
  status: "ACTIVE" | "DRAFT" | "INACTIVE";
  category?: {
    id: string;
    name: string;
  };
  commissionType?: "fixed" | "percentage";
  commissionValue?: number;
  teamCommissionValue?: number;
}

export const STOCK_STATUS_CONFIG: Record<StockStatus, { bg: string; text: string }> = {
  "In Stock": { bg: "#DFFFF0", text: "#16A34A" },
  "Out of Stock": { bg: "#FFDEDE", text: "#FB2C36" },
};

export const DUMMY_PRODUCT_DATA: ProductDataType[] = [
  {
    id: "1",
    thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=100&h=100",
    gallery: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=100&h=100",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=100&h=100",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=100&h=100",
      ""
    ],
    productId: "#000001",
    productName: "Premium Cotton T-Shirt",
    productType: "Physical",
    barcodeSku: "SKU001020266347B645",
    shortDescription: "High-quality everyday tee",
    longDescription: "This premium cotton t-shirt is designed for maximum comfort and durability. Perfect for everyday wear, featuring a classic fit and breathable fabric.",
    price: 5000.0,
    quantity: 100,
    stockThreshold: 10,
    stockStatus: "In Stock",
    status: "ACTIVE",
    commissionType: "percentage",
    commissionValue: 15,
    teamCommissionValue: 5,
  },
  {
    id: "2",
    thumbnail: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=100&h=100",
    gallery: ["", "", "", ""],
    productId: "#000002",
    productName: "Advanced React Course E-Book",
    productType: "Digital",
    barcodeSku: "SKU-DIGI-8842",
    shortDescription: "Complete guide to Next.js",
    longDescription: "A comprehensive digital guide covering everything from React basics to advanced Next.js server components and API routes. Includes 10 real-world projects.",
    price: 1500.0,
    quantity: 9999,
    stockThreshold: 0,
    stockStatus: "In Stock",
    status: "ACTIVE",
    commissionType: "fixed",
    commissionValue: 200,
    teamCommissionValue: 50,
  },
  {
    id: "3",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&h=100",
    gallery: ["", "", "", ""],
    productId: "#000003",
    productName: "Wireless Noise-Cancelling Headphones",
    productType: "Delivery",
    barcodeSku: "SKU-HDPH-1092",
    shortDescription: "Premium audio experience",
    longDescription: "Over-ear wireless headphones with active noise cancellation, 30-hour battery life, and high-fidelity audio reproduction. Includes carrying case.",
    price: 25000.0,
    quantity: 5,
    stockThreshold: 10,
    stockStatus: "Out of Stock",
    status: "ACTIVE",
    commissionType: "percentage",
    commissionValue: 10,
    teamCommissionValue: 2,
  },
  {
    id: "4",
    thumbnail: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=100&h=100",
    gallery: ["", "", "", ""],
    productId: "#000004",
    productName: "Vintage Polaroid Camera",
    productType: "Delivery",
    barcodeSku: "SKU-CAM-8833",
    shortDescription: "Refurbished classic camera",
    longDescription: "Fully refurbished vintage Polaroid camera. Tests 100% functional. Comes with one pack of standard color film.",
    price: 18500.0,
    quantity: 12,
    stockThreshold: 5,
    stockStatus: "In Stock",
    status: "ACTIVE",
    commissionType: "fixed",
    commissionValue: 1500,
    teamCommissionValue: 300,
  },
  {
    id: "5",
    thumbnail: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=100&h=100",
    gallery: ["", "", "", ""],
    productId: "#000005",
    productName: "Bluetooth Smartwatch",
    productType: "Physical",
    barcodeSku: "SKU-WTCH-4421",
    shortDescription: "Fitness and health tracker",
    longDescription: "Water-resistant smartwatch with heart rate monitoring, sleep tracking, and smartphone notifications. Compatible with iOS and Android.",
    price: 12000.0,
    quantity: 45,
    stockThreshold: 15,
    stockStatus: "In Stock",
    status: "ACTIVE",
    commissionType: "percentage",
    commissionValue: 8,
    teamCommissionValue: 2,
  },
  {
    id: "6",
    thumbnail: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=100&h=100",
    gallery: ["", "", "", ""],
    productId: "#000006",
    productName: "UI/UX Design Consultation",
    productType: "Service",
    barcodeSku: "SKU-SRV-0010",
    shortDescription: "1-hour expert review",
    longDescription: "A comprehensive one-hour consultation with a senior UI/UX designer to review your application, identify usability issues, and suggest improvements.",
    price: 8000.0,
    quantity: 999,
    stockThreshold: 0,
    stockStatus: "In Stock",
    status: "ACTIVE",
    commissionType: "fixed",
    commissionValue: 1000,
    teamCommissionValue: 0,
  },
];

/**
 * ===== ORDER TYPES =====
 */

export type OrderStatus = "Processing" | "Pending" | "Downloaded" | "Refunded" | "Dispatched" | "Completed";

export interface OrderSummaryData {
  all: number;
  pending: number;
  processing: number;
  completed: number;
  dispatched: number;
  refunded: number;
  downloaded: number;
  direct: number;
  referral: number;
}

export interface OrderDataType {
  id: string;
  orderId: string;
  date: string;
  productName: string;
  productType: "Digital" | "Delivery";
  quantity: number;
  amount: number;
  customerName: string;
  paymentMethod: string;
  commissions: number;
  orderStatus: OrderStatus;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { bg: string; text: string }> = {
  "Processing": { bg: "#D9E9FF", text: "#2563EB" },
  "Pending": { bg: "#FFF7D7", text: "#F59E0B" },
  "Downloaded": { bg: "#DFFFF0", text: "#16A34A" },
  "Refunded": { bg: "#FFDEDE", text: "#FB2C36" },
  "Dispatched": { bg: "#F1F5F9", text: "#000000" },
  "Completed": { bg: "#DCFCE7", text: "#15803D" },
};

export const DUMMY_ORDER_DATA: OrderDataType[] = [
  {
    id: "1",
    orderId: "#12345",
    date: "01/21",
    productName: "T - shirt",
    productType: "Digital",
    quantity: 2,
    amount: 5000.0,
    customerName: "User Name",
    paymentMethod: "Card",
    commissions: 100.0,
    orderStatus: "Downloaded",
  },
  {
    id: "2",
    orderId: "#12345",
    date: "01/21",
    productName: "T - shirt",
    productType: "Digital",
    quantity: 2,
    amount: 5000.0,
    customerName: "User Name",
    paymentMethod: "Card",
    commissions: 100.0,
    orderStatus: "Pending",
  },
  {
    id: "3",
    orderId: "#12345",
    date: "01/21",
    productName: "T - shirt",
    productType: "Digital",
    quantity: 2,
    amount: 5000.0,
    customerName: "User Name",
    paymentMethod: "Card",
    commissions: 100.0,
    orderStatus: "Processing",
  },
  {
    id: "4",
    orderId: "#12345",
    date: "01/21",
    productName: "T - shirt",
    productType: "Digital",
    quantity: 2,
    amount: 5000.0,
    customerName: "User Name",
    paymentMethod: "Card",
    commissions: 100.0,
    orderStatus: "Dispatched",
  },
  {
    id: "5",
    orderId: "#12345",
    date: "01/21",
    productName: "T - shirt",
    productType: "Digital",
    quantity: 2,
    amount: 5000.0,
    customerName: "User Name",
    paymentMethod: "Card",
    commissions: 100.0,
    orderStatus: "Refunded",
  },
];
