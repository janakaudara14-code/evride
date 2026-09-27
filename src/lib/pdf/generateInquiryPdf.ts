import jsPDF from 'jspdf';
import { CONTACT_INFO } from '@/lib/sriLanka';

export interface InquiryPdfData {
  inquiryRef: string;
  name: string;
  email: string;
  phone: string;
  vehicleModel: string;
  message: string;
  dateStr: string;
}

export function generateInquiryPdf(data: InquiryPdfData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Background Header Bar (Dark Slate)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 42, 'F');

  // Accent Line (Cyan)
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.rect(0, 41, 210, 2, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('VOLTRIDER EV SRI LANKA', 14, 18);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('High-Voltage EV Motorbikes, 3-Wheelers & 4-Wheeler Conversion Engineering', 14, 25);
  doc.text(`Official Hotline / WhatsApp: ${CONTACT_INFO.phone} | Web: voltrider.lk`, 14, 32);

  // Document Title Pill on Right
  doc.setFillColor(6, 182, 212);
  doc.roundedRect(140, 12, 56, 18, 2, 2, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('OFFICIAL INQUIRY', 144, 20);
  doc.setFontSize(8);
  doc.text(`REF: ${data.inquiryRef}`, 144, 26);

  // Date and Time
  doc.setTextColor(51, 65, 85); // slate-700
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated Date: ${data.dateStr}`, 14, 52);

  // Box 1: Customer Details
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(14, 58, 182, 36, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(14, 58, 182, 36, 3, 3, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. Customer & Contact Details', 18, 66);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Customer Name:`, 18, 74);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(data.name || 'Valued Customer', 55, 74);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Phone / WhatsApp:`, 18, 81);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(data.phone || 'Not provided', 55, 81);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Email Address:`, 18, 88);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(data.email || 'Not provided', 55, 88);

  // Box 2: Target Vehicle Specifications
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 100, 182, 30, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 100, 182, 30, 3, 3, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. Target EV / Conversion Vehicle', 18, 108);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Vehicle / Frame Model:`, 18, 117);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 182, 212); // cyan text
  doc.text(data.vehicleModel || 'Electric Scooter / Motorcycle / 3-Wheeler', 62, 117);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Market Region:`, 18, 124);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Sri Lanka (Islandwide 25 Districts Dispatch & Workshop Support)', 62, 124);

  // Box 3: Inquiry Message / Technical Target
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 136, 182, 60, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 136, 182, 60, 3, 3, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. Technical Requirements & Questions', 18, 144);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const splitMessage = doc.splitTextToSize(data.message || 'Standard conversion consultation and battery spec request.', 170);
  doc.text(splitMessage, 18, 153);

  // Box 4: Standard VoltRider Sri Lanka Warranty & Technical Guarantee
  doc.setFillColor(240, 253, 250); // emerald-50
  doc.roundedRect(14, 202, 182, 42, 3, 3, 'F');
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.roundedRect(14, 202, 182, 42, 3, 3, 'S');

  doc.setTextColor(6, 95, 70); // emerald-800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('4. VoltRider Engineering Standard Service Standards', 18, 210);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('• Genuine Grade-A Cell Certification with Active Balancer BMS protection.', 18, 217);
  doc.text('• Direct bolt-on compatibility for Yadea T5, Super Soco, GN125, Pulsar & Bajaj RE.', 18, 223);
  doc.text(`• Instant direct technician review via WhatsApp: ${CONTACT_INFO.phone}`, 18, 229);
  doc.text('• Priority warranty backing with local cell replacement in Colombo.', 18, 235);

  // Footer & Official Stamp
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 275, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('VOLTRIDER EV (PVT) LTD - SRI LANKA', 14, 283);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Workshop: ${CONTACT_INFO.workshopAddress} | WhatsApp: ${CONTACT_INFO.phone}`, 14, 289);

  // Save the PDF
  const filename = `VoltRider_Inquiry_${data.inquiryRef}.pdf`;
  doc.save(filename);
  return filename;
}
