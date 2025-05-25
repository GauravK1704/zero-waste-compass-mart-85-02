
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
 * Add Verified by Zero Waste Mart circular stamp with pink borders and seller signature
 */
export const addZeroWasteCertifiedStamp = (doc: jsPDF, finalY: number, pageWidth: number) => {
  const centerX = 135; // Position next to GST info box
  const centerY = finalY + 57; // Center vertically with GST info
  const radius = 25; // Larger radius for better text visibility
  
  // White background fill
  doc.setFillColor(255, 255, 255);
  doc.circle(centerX, centerY, radius, 'F');
  
  // Outer pink border ring
  doc.setDrawColor(236, 72, 153); // Pink color
  doc.setLineWidth(2);
  doc.circle(centerX, centerY, radius - 1, 'S');
  
  // Inner pink border ring
  doc.setLineWidth(1.5);
  doc.circle(centerX, centerY, radius - 5, 'S');
  
  // Top text "VERIFIED BY"
  doc.setTextColor(236, 72, 153);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('VERIFIED BY', centerX, centerY - 8, { align: 'center' });
  
  // Main text "ZERO WASTE MART"
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.text('ZERO WASTE MART', centerX, centerY - 3, { align: 'center' });
  
  // Center verification checkmark
  doc.setFillColor(236, 72, 153);
  doc.circle(centerX, centerY + 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6);
  doc.text('✓', centerX, centerY + 4, { align: 'center' });
  
  // Bottom text "SELLER SIGNATURE"
  doc.setTextColor(236, 72, 153);
  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  doc.text('SELLER SIGNATURE', centerX, centerY + 10, { align: 'center' });
  
  // Add signature line
  doc.setLineWidth(0.5);
  doc.line(centerX - 15, centerY + 15, centerX + 15, centerY + 15);
  
  // Add certification date
  doc.setFontSize(4);
  doc.setTextColor(100, 100, 100);
  const certDate = new Date().toLocaleDateString('en-IN');
  doc.text(`Date: ${certDate}`, centerX, centerY + 20, { align: 'center' });
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
