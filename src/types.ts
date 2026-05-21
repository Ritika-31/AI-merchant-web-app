export interface MerchantProfile {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  gstin: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  settlementCycle: string;
  tier: string;
  verified: boolean;
}

export interface VpaInfo {
  id: string; // e.g. "vpa-1"
  vpa: string; // e.g. "groceries@okhdfcbank"
  label: string; // e.g. "Groceries Main Stand"
  active: boolean;
}

export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface Transaction {
  id: string;
  vpaId: string;
  amount: number;
  timestamp: string; // ISO string 2026-05-...
  status: TransactionStatus;
  customerName: string;
  customerPhone: string;
  paymentMode: 'UPI_APP' | 'G_PAY' | 'PHONE_PE' | 'PAYTM' | 'NET_BANKING';
  rrn: string; // Retrieval Reference Number
  remarks?: string;
}

export type TicketCategory = 'SETTLEMENT' | 'TECHNICAL' | 'REFUND_DISPUTE' | 'QR_CODE' | 'OTHER';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface TicketMessage {
  id: string;
  sender: 'MERCHANT' | 'SUPPORT';
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  category: TicketCategory;
  subject: string;
  description: string;
  transactionId?: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}
