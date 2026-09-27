export interface District {
  name: string;
  province: string;
}

export const SRI_LANKA_DISTRICTS: District[] = [
  // Western Province
  { name: 'Colombo', province: 'Western' },
  { name: 'Gampaha', province: 'Western' },
  { name: 'Kalutara', province: 'Western' },
  // Central Province
  { name: 'Kandy', province: 'Central' },
  { name: 'Matale', province: 'Central' },
  { name: 'Nuwara Eliya', province: 'Central' },
  // Southern Province
  { name: 'Galle', province: 'Southern' },
  { name: 'Matara', province: 'Southern' },
  { name: 'Hambantota', province: 'Southern' },
  // North Western Province
  { name: 'Kurunegala', province: 'North Western' },
  { name: 'Puttalam', province: 'North Western' },
  // Sabaragamuwa Province
  { name: 'Ratnapura', province: 'Sabaragamuwa' },
  { name: 'Kegalle', province: 'Sabaragamuwa' },
  // North Central Province
  { name: 'Anuradhapura', province: 'North Central' },
  { name: 'Polonnaruwa', province: 'North Central' },
  // Uva Province
  { name: 'Badulla', province: 'Uva' },
  { name: 'Monaragala', province: 'Uva' },
  // Eastern Province
  { name: 'Trincomalee', province: 'Eastern' },
  { name: 'Batticaloa', province: 'Eastern' },
  { name: 'Ampara', province: 'Eastern' },
  // Northern Province
  { name: 'Jaffna', province: 'Northern' },
  { name: 'Kilinochchi', province: 'Northern' },
  { name: 'Mannar', province: 'Northern' },
  { name: 'Vavuniya', province: 'Northern' },
  { name: 'Mullaitivu', province: 'Northern' },
];

export const BANK_ACCOUNTS = [
  {
    bankName: 'Commercial Bank of Ceylon',
    accountName: 'EV SPARE MART (PVT) LTD',
    accountNumber: '1000 4892 3120',
    branch: 'Kollupitiya Branch (012)',
    swiftCode: 'CCEYLKFX',
  },
  {
    bankName: 'Sampath Bank PLC',
    accountName: 'EV SPARE MART (PVT) LTD',
    accountNumber: '0139 1000 8924',
    branch: 'Colombo Super Branch (001)',
    swiftCode: 'BSAMLKLX',
  },
  {
    bankName: 'Bank of Ceylon (BOC)',
    accountName: 'EV SPARE MART (PVT) LTD',
    accountNumber: '8934 1120 45',
    branch: 'Corporate Branch, Colombo',
    swiftCode: 'BCEYLKLX',
  },
  {
    bankName: 'Hatton National Bank (HNB)',
    accountName: 'EV SPARE MART (PVT) LTD',
    accountNumber: '0030 1029 4810',
    branch: 'Head Office Branch',
    swiftCode: 'HBLILKLX',
  },
];

export const CONTACT_INFO = {
  phone: '071 054 8278',
  hotline: '071 054 8278',
  whatsappNumber: '94710548278',
  whatsappDisplay: '071 054 8278',
  email: 'sales@evsparemart.lk',
  supportEmail: 'support@evsparemart.lk',
  address: 'No. 142, Galle Road, Colombo 03, Sri Lanka',
  workshopAddress: 'EV Spare Mart Tech Center, 88 Nawala Road, Nugegoda, Sri Lanka',
  operatingHours: 'Monday - Saturday: 8:30 AM - 7:00 PM (Islandwide WhatsApp Support 24/7)',
};

/**
 * Formats an amount into Sri Lankan Rupees (Rs.)
 */
export function formatLKR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rs. 0';
  }
  return `Rs. ${Math.round(amount).toLocaleString('en-LK')}`;
}

/**
 * Calculates 3-month installment for Koko / Mintpay
 */
export function calculateInstallment(amount: number): string {
  const installment = Math.round(amount / 3);
  return `Rs. ${installment.toLocaleString('en-LK')}`;
}

/**
 * Generates a WhatsApp inquiry link with pre-filled message
 */
export function getWhatsAppInquiryUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encoded}`;
}
