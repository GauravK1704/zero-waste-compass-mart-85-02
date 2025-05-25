
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '@/types';
import { format } from 'date-fns';
import { formatIndianRupees, calculateGST } from './invoice/formatUtils';
import { 
  setupHeaderStyle, 
  setupCompanyHeader, 
  setupCustomerInfo,
  addGSTInfoBox,
  addCertifiedBySellerStamp,
  addFooterText
} from './invoice/invoiceStyles';

export { formatIndianRupees, calculateGST };

/**
 * Generate a PDF invoice for an order
 */
export const generateInvoicePdf = (order: Order) => {
  // Create a new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Set company info
  const companyInfo = {
    name: 'ZERO WASTE MART',
    address: '123 Green Street, Eco City',
    pincode: '400001',
    state: 'Karnataka',
    gstin: '29AADCB2230M1ZT',
    hsn: '9973',
    email: 'support@zerowastemart.com',
    phone: '+91 9876543210'
  };
  
  // Current date formatting
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  const invoiceNumber = `INV-${order.id.substring(0, 8).toUpperCase()}`;
  
  // Apply header and logo styling
  setupHeaderStyle(doc, pageWidth);
  
  // Add company header with invoice number
  setupCompanyHeader(doc, companyInfo.name, invoiceNumber, currentDate, pageWidth);
  
  // Add customer and payment info
  setupCustomerInfo(doc, order.buyerName || "Customer", order.shippingAddress || "Not specified", order.paymentMethod || "Online Payment", pageWidth);
  
  // Table headers for items - improved alignment
  const tableColumn = ['Item', 'Quantity', 'Unit Price', 'Total'];
  const tableRows = order.items.map(item => [
    item.name,
    item.quantity.toString(),
    formatIndianRupees(item.price),
    formatIndianRupees(item.quantity * item.price)
  ]);
  
  // Generate the items table with improved alignment
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 65,
    theme: 'grid',
    headStyles: { 
      fillColor: [148, 87, 235], 
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'left',
    },
    styles: { 
      fontSize: 10,
      cellPadding: 5,
      font: 'helvetica',
      lineColor: [200, 200, 200],
      overflow: 'linebreak',
    },
    columnStyles: {
      0: { cellWidth: 'auto', halign: 'left' },
      1: { cellWidth: 40, halign: 'center' },
      2: { cellWidth: 60, halign: 'right' },
      3: { cellWidth: 60, halign: 'right' },
    },
    alternateRowStyles: {
      fillColor: [248, 248, 255]
    },
    margin: { left: 15, right: 15, top: 10, bottom: 10 },
    didDrawPage: (data) => {
      // Reset margins on each page
      data.settings.margin = { left: 15, right: 15, top: 10, bottom: 10 };
    }
  });
  
  // Get the final Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Calculate GST values
  const subtotalBeforeTax = order.totalAmount / 1.18; // Remove 18% GST
  const cgst = subtotalBeforeTax * 0.09; // 9% CGST
  const sgst = subtotalBeforeTax * 0.09; // 9% SGST
  const totalGST = cgst + sgst;
  
  // Pricing summary - improve number formatting and alignment
  const summaryX = pageWidth - 110; // Start position for summary section
  const valueX = pageWidth - 15;   // Position for values
  
  doc.setFontSize(10);
  doc.text('Subtotal (before tax):', summaryX, finalY, { align: 'left' });
  doc.text(formatIndianRupees(subtotalBeforeTax), valueX, finalY, { align: 'right' });
  
  doc.text('CGST (9%):', summaryX, finalY + 7, { align: 'left' });
  doc.text(formatIndianRupees(cgst), valueX, finalY + 7, { align: 'right' });
  
  doc.text('SGST (9%):', summaryX, finalY + 14, { align: 'left' });
  doc.text(formatIndianRupees(sgst), valueX, finalY + 14, { align: 'right' });
  
  doc.setLineWidth(0.5);
  doc.line(summaryX, finalY + 17, valueX, finalY + 17);
  
  doc.text('Total GST (18%):', summaryX, finalY + 23, { align: 'left' });
  doc.text(formatIndianRupees(totalGST), valueX, finalY + 23, { align: 'right' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(148, 87, 235);
  doc.text('Total Amount (inc. GST):', summaryX, finalY + 33, { align: 'left' });
  doc.text(formatIndianRupees(order.totalAmount), valueX, finalY + 33, { align: 'right' });
  
  // Add GST Information box
  addGSTInfoBox(doc, {
    gstin: companyInfo.gstin,
    hsn: companyInfo.hsn,
    state: companyInfo.state
  }, finalY);
  
  // Add Certified by Seller stamp
  addCertifiedBySellerStamp(doc, finalY, pageWidth);
  
  // Add footer text
  addFooterText(doc, finalY, pageWidth);
  
  // Save the PDF
  doc.save(`invoice-${order.id}.pdf`);
  return doc;
};
