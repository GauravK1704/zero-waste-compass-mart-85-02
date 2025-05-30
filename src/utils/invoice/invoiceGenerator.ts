
import { jsPDF } from 'jspdf';
import { Order } from '@/types';
import { setupHeaderStyle, setupCompanyHeader, setupCustomerInfo, addGSTInfoBox, addCertifiedBySellerStamp, addFooterText } from './invoiceStyles';
import { formatIndianRupees, calculateGST } from './formatUtils';

/**
 * Generate an invoice for an order
 * @param order - The order to generate an invoice for
 * @returns boolean - Whether the invoice was successfully generated
 */
export const generateInvoice = (order: Order): boolean => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const date = new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date());
    
    const invoiceNumber = `INV-${order.id.toUpperCase()}`;
    
    // Apply header styles
    setupHeaderStyle(doc, pageWidth);
    setupCompanyHeader(doc, "Zero Waste Mart", invoiceNumber, date, pageWidth);
    
    // Customer and payment info
    setupCustomerInfo(doc, order.buyerName, order.shippingAddress || 'Not specified', 'Online Payment', pageWidth);
    
    // Table header
    doc.setDrawColor(220, 220, 230);
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 65, pageWidth - 30, 10, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text('Item', 20, 71);
    doc.text('Qty', 120, 71);
    doc.text('Unit Price', 140, 71);
    doc.text('GST', 165, 71);
    doc.text('Total', pageWidth - 25, 71, { align: 'right' });
    
    // Table content
    doc.setFont('helvetica', 'normal');
    let yPos = 85;
    let totalBeforeTax = 0;
    let totalGST = 0;
    
    order.items.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      const itemGST = calculateGST(itemTotal);
      totalBeforeTax += itemTotal;
      totalGST += itemGST;
      
      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(252, 252, 255);
        doc.rect(15, yPos - 6, pageWidth - 30, 10, 'F');
      }
      
      doc.setTextColor(70, 70, 70);
      doc.text(item.name, 20, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(formatIndianRupees(item.price), 140, yPos);
      doc.text(formatIndianRupees(itemGST), 165, yPos);
      doc.text(formatIndianRupees(itemTotal + itemGST), pageWidth - 25, yPos, { align: 'right' });
      
      yPos += 10;
    });
    
    // Draw line below items
    const finalY = yPos + 5;
    doc.setLineWidth(0.5);
    doc.line(15, finalY, pageWidth - 15, finalY);
    
    // Totals section
    yPos = finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    
    doc.text('Subtotal:', pageWidth - 65, yPos);
    doc.text(formatIndianRupees(totalBeforeTax), pageWidth - 25, yPos, { align: 'right' });
    
    yPos += 8;
    doc.text('GST (18%):', pageWidth - 65, yPos);
    doc.text(formatIndianRupees(totalGST), pageWidth - 25, yPos, { align: 'right' });
    
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', pageWidth - 65, yPos);
    doc.text(formatIndianRupees(totalBeforeTax + totalGST), pageWidth - 25, yPos, { align: 'right' });
    
    // GST info box
    addGSTInfoBox(doc, {
      gstin: '29AABCU9603R1ZJ',
      hsn: 'Chapter 97',
      state: 'Karnataka'
    }, finalY);
    
    // New compact certified seller stamp (positioned to the right of GST info)
    const sellerName = order.items[0]?.name || 'Verified Seller';
    addCertifiedBySellerStamp(doc, finalY, pageWidth, sellerName);
    
    // Footer text
    addFooterText(doc, finalY, pageWidth);
    
    // Save the PDF
    doc.save(`invoice-${order.id}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating invoice:', error);
    return false;
  }
};
