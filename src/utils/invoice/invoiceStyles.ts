
import { jsPDF } from 'jspdf';

/**
 * Set up header section styling with light purple background
 */
export const setupHeaderStyle = (doc: jsPDF, pageWidth: number) => {
  // Header section with light purple background
  doc.setFillColor(148, 87, 235, 0.1);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Logo circle
  doc.setFillColor(148, 87, 235);
  doc.circle(20, 20, 10, 'F');
  
  // Add logo content
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('ZWM', 20, 20, { align: 'center' });
};

/**
 * Apply company header styling
 */
export const setupCompanyHeader = (doc: jsPDF, companyName: string, invoiceNumber: string, date: string, pageWidth: number) => {
  // Company name and invoice header
  doc.setTextColor(148, 87, 235);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(companyName, 35, 15);
  
  doc.setFontSize(14);
  doc.text('INVOICE', 35, 23);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(invoiceNumber, 35, 30);
  
  // Date on the right
  doc.setFontSize(10);
  doc.text(`Date: ${date}`, pageWidth - 15, 15, { align: 'right' });
};

/**
 * Style for customer and payment info section
 */
export const setupCustomerInfo = (doc: jsPDF, customerName: string, shippingAddress: string, paymentMethod: string, pageWidth: number) => {
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`Customer: ${customerName || 'Customer'}`, 15, 50);
  doc.text(`Shipping Address: ${shippingAddress || 'Not specified'}`, 15, 57);
  
  doc.text(`Payment Method: ${paymentMethod || 'Online Payment'}`, pageWidth - 15, 50, { align: 'right' });
};

/**
 * Style for GST information box
 */
export const addGSTInfoBox = (doc: jsPDF, gstInfo: { gstin: string, hsn: string, state: string }, finalY: number) => {
  // GST Information box
  doc.setFillColor(245, 245, 255);
  doc.rect(15, finalY + 40, 95, 35, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(148, 87, 235);
  doc.text('GST Information', 20, finalY + 50);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(`GSTIN: ${gstInfo.gstin}`, 20, finalY + 57);
  doc.text(`HSN Code: ${gstInfo.hsn}`, 20, finalY + 63);
  doc.text(`Place of Supply: ${gstInfo.state}`, 20, finalY + 69);
};

/**
 * Add redesigned Zero Waste Mart Certified circular stamp matching the reference image
 */
export const addZeroWasteCertifiedStamp = (doc: jsPDF, finalY: number, pageWidth: number, sellerName: string = 'Seller') => {
  const centerX = 140; // Position next to GST info box
  const centerY = finalY + 57; // Center vertically with GST info
  const outerRadius = 28; // Larger outer radius
  const innerRadius = 22; // Inner circle radius
  
  // Outer black border ring (thick)
  doc.setFillColor(255, 255, 255); // White background
  doc.circle(centerX, centerY, outerRadius, 'F');
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2.5);
  doc.circle(centerX, centerY, outerRadius - 1, 'S');
  
  // Inner black border ring
  doc.setLineWidth(1.5);
  doc.circle(centerX, centerY, innerRadius, 'S');
  
  // Company name curved at top "ZERO WASTE MART"
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  
  // Top text positioned in an arc
  const topText = 'ZERO WASTE MART';
  const textWidth = doc.getTextWidth(topText);
  doc.text(topText, centerX - textWidth/2, centerY - 12);
  
  // Center main text "CERTIFIED"
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFIED', centerX, centerY - 2, { align: 'center' });
  
  // Center star decoration
  doc.setTextColor(255, 193, 7); // Gold color
  doc.setFontSize(10);
  doc.text('★', centerX, centerY + 6, { align: 'center' });
  
  // Seller name at bottom
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  const sellerDisplayName = sellerName.length > 15 ? sellerName.substring(0, 15) + '...' : sellerName;
  doc.text(sellerDisplayName, centerX, centerY + 14, { align: 'center' });
  
  // Bottom curved text "SIGNATURE"
  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  doc.text('SIGNATURE', centerX, centerY + 19, { align: 'center' });
  
  // Signature line
  doc.setLineWidth(0.5);
  doc.line(centerX - 18, centerY + 22, centerX + 18, centerY + 22);
  
  // Date at bottom
  doc.setFontSize(4);
  doc.setTextColor(100, 100, 100);
  const certDate = new Date().toLocaleDateString('en-IN');
  doc.text(`Date: ${certDate}`, centerX, centerY + 26, { align: 'center' });
  
  // Add small decorative elements around the stamp
  doc.setFillColor(148, 87, 235);
  doc.circle(centerX - 32, centerY - 8, 1, 'F');
  doc.circle(centerX + 32, centerY - 8, 1, 'F');
  doc.circle(centerX - 32, centerY + 8, 1, 'F');
  doc.circle(centerX + 32, centerY + 8, 1, 'F');
};

/**
 * Add footer text to invoice
 */
export const addFooterText = (doc: jsPDF, finalY: number, pageWidth: number) => {
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for your business! Your contribution helps reduce waste.', pageWidth / 2, finalY + 95, { align: 'center' });
  doc.text('Payment made in India - All prices are inclusive of GST', pageWidth / 2, finalY + 100, { align: 'center' });
  doc.text('For any queries related to this invoice, please contact support@zerowastemart.com', pageWidth / 2, finalY + 105, { align: 'center' });
};
