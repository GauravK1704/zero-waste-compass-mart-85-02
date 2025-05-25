
import { jsPDF } from 'jspdf';

/**
 * Set up header section styling with light purple background
 */
export const setupHeaderStyle = (doc: jsPDF, pageWidth: number) => {
  // Header section with light purple background
  doc.setFillColor(148, 87, 235, 0.1);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Logo circle with leaf design
  doc.setFillColor(147, 51, 234); // Purple color to match theme
  doc.circle(20, 20, 10, 'F');
  
  // Add leaf symbol
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('🍃', 20, 20, { align: 'center' });
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
 * Add red circular "CERTIFIED" stamp matching the uploaded image
 */
export const addCertifiedBySellerStamp = (doc: jsPDF, finalY: number, pageWidth: number, sellerName: string = 'Seller') => {
  const centerX = 140;
  const centerY = finalY + 57;
  const outerRadius = 30;
  
  // Outer red border ring (thick)
  doc.setDrawColor(220, 38, 38); // Red color
  doc.setLineWidth(3);
  doc.circle(centerX, centerY, outerRadius, 'S');
  
  // Inner red border ring
  doc.setLineWidth(1.5);
  doc.circle(centerX, centerY, outerRadius - 4, 'S');
  
  // White background fill
  doc.setFillColor(255, 255, 255);
  doc.circle(centerX, centerY, outerRadius - 5, 'F');
  
  // Top "CERTIFIED" text
  doc.setTextColor(220, 38, 38); // Red color
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  const topText = 'CERTIFIED';
  doc.text(topText, centerX, centerY - 12, { align: 'center' });
  
  // Center large "CERTIFIED" text
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text('CERTIFIED', centerX, centerY, { align: 'center' });
  
  // Bottom "CERTIFIED" text
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFIED', centerX, centerY + 12, { align: 'center' });
  
  // Stars decoration around the text
  doc.setFontSize(6);
  doc.setTextColor(220, 38, 38);
  
  // Top stars arranged in a curve
  doc.text('★', centerX - 18, centerY - 8);
  doc.text('★', centerX - 8, centerY - 18);
  doc.text('★', centerX + 8, centerY - 18);
  doc.text('★', centerX + 18, centerY - 8);
  
  // Bottom stars arranged in a curve
  doc.text('★', centerX - 18, centerY + 8);
  doc.text('★', centerX - 8, centerY + 18);
  doc.text('★', centerX + 8, centerY + 18);
  doc.text('★', centerX + 18, centerY + 8);
  
  // Left and right stars
  doc.text('★', centerX - 22, centerY);
  doc.text('★', centerX + 22, centerY);
  
  // Small seller info at bottom
  doc.setFontSize(5);
  doc.setTextColor(100, 100, 100);
  const sellerDisplayName = sellerName.length > 25 ? sellerName.substring(0, 25) + '...' : sellerName;
  doc.text(sellerDisplayName, centerX, centerY + 20, { align: 'center' });
  
  // Date stamp
  const certDate = new Date().toLocaleDateString('en-IN');
  doc.text(`Date: ${certDate}`, centerX, centerY + 24, { align: 'center' });
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
