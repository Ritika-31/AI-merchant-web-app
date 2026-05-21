import { MerchantProfile, VpaInfo, Transaction, SupportTicket } from './types';

export const initialMerchantProfile: MerchantProfile = {
  id: "MID-882940294",
  businessName: "Aura Fresh Supermarket",
  ownerName: "Ritika Sathua",
  email: "ritikaasathua@gmail.com",
  phone: "+91 98765 43210",
  category: "Retail / Groceries",
  gstin: "27AAAAA1111A1Z1",
  bankName: "HDFC Bank Ltd",
  accountNumber: "50100482559381",
  ifscCode: "HDFC0000123",
  settlementCycle: "Daily T+1 Settlement",
  tier: "Gold Merchant Plus",
  verified: true
};

export const initialVPAs: VpaInfo[] = [
  { id: "vpa-all", vpa: "All VPAs", label: "Consolidated View", active: true },
  { id: "vpa-1", vpa: "aurafresh@okhdfcbank", label: "Main Counter (Scanner-1)", active: true },
  { id: "vpa-2", vpa: "aurafresh.express@okaxis", label: "Express Checkout (Scanner-2)", active: true },
  { id: "vpa-3", vpa: "aurafresh.delivery@okicici", label: "Home Delivery (Scanner-3)", active: true }
];

export function generateMockTransactions(): Transaction[] {
  const txns: Transaction[] = [];
  const now = new Date();
  
  // Helper to format date offset
  const getOffsetISO = (dayOffset: number, hours: number, mins: number) => {
    const d = new Date(now);
    d.setDate(now.getDate() - dayOffset);
    d.setHours(hours, mins, 0, 0);
    return d.toISOString();
  };

  const statusOptions: ('SUCCESS' | 'PENDING' | 'FAILED')[] = ['SUCCESS', 'SUCCESS', 'SUCCESS', 'SUCCESS', 'PENDING', 'SUCCESS', 'FAILED'];
  const modeOptions: ('UPI_APP' | 'G_PAY' | 'PHONE_PE' | 'PAYTM')[] = ['G_PAY', 'PHONE_PE', 'PAYTM', 'UPI_APP'];

  const customers = [
    { name: "Aditya Sharma", phone: "+91 91234 56789" },
    { name: "Priya Patel", phone: "+91 92345 67890" },
    { name: "Rahul Verma", phone: "+91 93456 78901" },
    { name: "Sneha Reddy", phone: "+91 94567 89012" },
    { name: "Vikram Malhotra", phone: "+91 95678 90123" },
    { name: "Ananya Iyer", phone: "+91 96789 01234" },
    { name: "Suresh Gupta", phone: "+91 97890 12345" },
    { name: "Pooja Rao", phone: "+91 98901 23456" },
    { name: "Amit Singh", phone: "+91 99012 34567" },
    { name: "Deepika Chawla", phone: "+91 90123 45678" }
  ];

  // Let's generate transactions for Day 0 (Today)
  const todayTxTemplates = [
    { time: [8, 15], vpaId: "vpa-1", amt: 450 },
    { time: [9, 30], vpaId: "vpa-2", amt: 1200 },
    { time: [10, 10], vpaId: "vpa-1", amt: 85 },
    { time: [11, 45], vpaId: "vpa-3", amt: 2350 },
    { time: [12, 15], vpaId: "vpa-1", amt: 620 },
    { time: [13, 0], vpaId: "vpa-2", amt: 180 },
    { time: [14, 20], vpaId: "vpa-1", amt: 740 },
    { time: [15, 35], vpaId: "vpa-2", amt: 3100 },
    { time: [16, 50], vpaId: "vpa-3", amt: 150 },
    { time: [18, 10], vpaId: "vpa-1", amt: 980 },
    { time: [19, 40], vpaId: "vpa-2", amt: 45 }
  ];

  // Let's generate transactions for Day 1 (Yesterday)
  const yesterdayTxTemplates = [
    { time: [8, 45], vpaId: "vpa-1", amt: 310 },
    { time: [9, 15], vpaId: "vpa-2", amt: 1450 },
    { time: [10, 50], vpaId: "vpa-3", amt: 4200 },
    { time: [12, 30], vpaId: "vpa-1", amt: 110 },
    { time: [13, 10], vpaId: "vpa-2", amt: 790 },
    { time: [14, 40], vpaId: "vpa-1", amt: 540 },
    { time: [15, 55], vpaId: "vpa-3", amt: 1650 },
    { time: [17, 20], vpaId: "vpa-2", amt: 125 },
    { time: [18, 30], vpaId: "vpa-1", amt: 890 },
    { time: [20, 15], vpaId: "vpa-1", amt: 220 }
  ];

  // Populate Today
  todayTxTemplates.forEach((t, index) => {
    const cust = customers[index % customers.length];
    const status = statusOptions[index % statusOptions.length];
    const mode = modeOptions[index % modeOptions.length];
    const rrn = `602112${Math.floor(100000 + Math.random() * 900000)}`;

    txns.push({
      id: `TXN-TODAY-${1000 + index}`,
      vpaId: t.vpaId,
      amount: t.amt,
      timestamp: getOffsetISO(0, t.time[0], t.time[1]),
      status: status,
      customerName: cust.name,
      customerPhone: cust.phone,
      paymentMode: mode,
      rrn: rrn,
      remarks: t.amt > 1000 ? "Bulk groc items" : "Counter retail payload"
    });
  });

  // Populate Yesterday
  yesterdayTxTemplates.forEach((t, index) => {
    const cust = customers[(index + 3) % customers.length];
    const status = statusOptions[(index + 1) % statusOptions.length];
    const mode = modeOptions[(index + 2) % modeOptions.length];
    const rrn = `602012${Math.floor(100000 + Math.random() * 900000)}`;

    txns.push({
      id: `TXN-YEST-${2000 + index}`,
      vpaId: t.vpaId,
      amount: t.amt,
      timestamp: getOffsetISO(1, t.time[0], t.time[1]),
      status: status,
      customerName: cust.name,
      customerPhone: cust.phone,
      paymentMode: mode,
      rrn: rrn,
      remarks: "Counter purchase"
    });
  });

  // Sort by date descending (newest first)
  return txns.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const initialTickets: SupportTicket[] = [
  {
    id: "TKT-31294",
    category: "SETTLEMENT",
    subject: "Yesterday's payout not received yet",
    description: "Yesterday's transactions settlement of approx ₹9,545 has not hit my HDFC Bank account yet. Usually settlements proceed around 6:00 AM.",
    transactionId: "TXN-YEST-2002",
    status: "OPEN",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: "m1",
        sender: "MERCHANT",
        message: "Yesterday's payout not received yet. Please inspect.",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
      },
      {
        id: "m2",
        sender: "SUPPORT",
        message: "Hello Ritika, we have initiated an inquiry with our banking settlement partner HDFC. Standard settlements queue can take till 2:00 PM in case of banking system maintenance. Real-time logging shows active queue.",
        timestamp: new Date(new Date().setHours(new Date().getHours() - 3)).toISOString()
      }
    ]
  },
  {
    id: "TKT-30948",
    category: "QR_CODE",
    subject: "Scanner-2 QR code laminate request",
    description: "I need a physical acrylic standee for our counter 2 express QR code. Please dispatch.",
    status: "RESOLVED",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    messages: [
      {
        id: "m1",
        sender: "MERCHANT",
        message: "Need a physical acrylic QR counter standee.",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString()
      },
      {
        id: "m2",
        sender: "SUPPORT",
        message: "Hi Ritika, we've dispatched your acrylic standee kit with BlueDart Courier. Tracking Number: BD66284918. It should reach you by Friday.",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString()
      },
      {
        id: "m3",
        sender: "MERCHANT",
        message: "Got it today! Acrylic stand looks beautiful. Thanks for the quick support.",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString()
      }
    ]
  }
];
