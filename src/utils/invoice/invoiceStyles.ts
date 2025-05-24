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
 * Add Zero Waste Certified circular stamp - smaller design with white background and single green border
 */
export const addZeroWasteCertifiedStamp = (doc: jsPDF, finalY: number, pageWidth: number) => {
  const centerX = pageWidth - 40; // Moved closer to edge
  const centerY = finalY + 45; // Moved higher
  const radius = 20; // Made smaller
  
  // White background fill
  doc.setFillColor(255, 255, 255);
  doc.circle(centerX, centerY, radius - 1, 'F');
  
  // Single green border ring
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(2);
  doc.circle(centerX, centerY, radius - 2, 'S');
  
  // Inner decorative ring
  doc.setLineWidth(0.5);
  doc.circle(centerX, centerY, radius - 8, 'S');
  
  // Green text for "ZERO WASTE"
  doc.setTextColor(34, 197, 94);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('ZERO WASTE', centerX, centerY - 5, { align: 'center' });
  
  // Center checkmark symbol
  doc.setFontSize(10);
  doc.setTextColor(34, 197, 94);
  doc.text('✓', centerX, centerY + 1, { align: 'center' });
  
  // Bottom text "CERTIFIED"
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFIED', centerX, centerY + 8, { align: 'center' });
  
  // Add decorative stars around the stamp (using proper star symbol)
  doc.setFontSize(6);
  doc.setTextColor(34, 197, 94);
  doc.text('✦', centerX - 15, centerY - 5, { align: 'center' });
  doc.text('✦', centerX + 15, centerY - 5, { align: 'center' });
  doc.text('✦', centerX - 15, centerY + 5, { align: 'center' });
  doc.text('✦', centerX + 15, centerY + 5, { align: 'center' });
  
  // Add smaller stars for decoration
  doc.setFontSize(4);
  doc.text('✦', centerX - 12, centerY - 12, { align: 'center' });
  doc.text('✦', centerX + 12, centerY - 12, { align: 'center' });
  doc.text('✦', centerX - 12, centerY + 12, { align: 'center' });
  doc.text('✦', centerX + 12, centerY + 12, { align: 'center' });
  
  // Add date stamp in smaller text
  doc.setFontSize(4);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(new Date().toLocaleDateString('en-IN'), centerX, centerY + 15, { align: 'center' });
};

/**
 * Add footer text to invoice
 */
export const addFooterText = (doc: jsPDF, finalY: number, pageWidth: number) => {
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for your business! Your contribution helps reduce waste.', pageWidth / 2, finalY + 85, { align: 'center' });
  doc.text('Payment made in India - All prices are inclusive of GST', pageWidth / 2, finalY + 90, { align: 'center' });
  doc.text('For any queries related to this invoice, please contact support@zerowastemart.com', pageWidth / 2, finalY + 95, { align: 'center' });
};
