
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
 * Add compact certified seller stamp to the right of GST info
 */
export const addCertifiedBySellerStamp = (doc: jsPDF, finalY: number, pageWidth: number, sellerName: string = 'Seller') => {
  const centerX = 155; // Position to the right of GST info box
  const centerY = finalY + 57;
  const stampWidth = 40;
  const stampHeight = 25;
  
  // Stamp border - rectangular like a real stamp with perforated edges effect
  doc.setDrawColor(220, 38, 38); // Red color
  doc.setLineWidth(1.5);
  
  // Main stamp rectangle
  doc.rect(centerX - stampWidth/2, centerY - stampHeight/2, stampWidth, stampHeight, 'S');
  
  // Inner border for depth
  doc.setLineWidth(0.5);
  doc.rect(centerX - stampWidth/2 + 2, centerY - stampHeight/2 + 2, stampWidth - 4, stampHeight - 4, 'S');
  
  // Perforated edge effect (small dots around border)
  doc.setFillColor(220, 38, 38);
  for (let i = 0; i < stampWidth; i += 3) {
    // Top edge dots
    doc.circle(centerX - stampWidth/2 + i, centerY - stampHeight/2, 0.5, 'F');
    // Bottom edge dots
    doc.circle(centerX - stampWidth/2 + i, centerY + stampHeight/2, 0.5, 'F');
  }
  for (let i = 0; i < stampHeight; i += 3) {
    // Left edge dots
    doc.circle(centerX - stampWidth/2, centerY - stampHeight/2 + i, 0.5, 'F');
    // Right edge dots
    doc.circle(centerX + stampWidth/2, centerY - stampHeight/2 + i, 0.5, 'F');
  }
  
  // Stamp background with slight aging effect
  doc.setFillColor(255, 252, 248); // Slightly off-white
  doc.rect(centerX - stampWidth/2 + 1, centerY - stampHeight/2 + 1, stampWidth - 2, stampHeight - 2, 'F');
  
  // Main "CERTIFIED" text
  doc.setTextColor(220, 38, 38);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFIED', centerX, centerY - 3, { align: 'center' });
  
  // "SELLER" text below
  doc.setFontSize(6);
  doc.text('SELLER', centerX, centerY + 3, { align: 'center' });
  
  // Small decorative elements
  doc.setFontSize(4);
  doc.text('★', centerX - 12, centerY);
  doc.text('★', centerX + 12, centerY);
  
  // Date stamp in small text
  doc.setFontSize(4);
  doc.setTextColor(100, 100, 100);
  const certDate = new Date().toLocaleDateString('en-IN');
  doc.text(certDate, centerX, centerY + 8, { align: 'center' });
  
  // Subtle seller info if name is short enough
  if (sellerName.length <= 15) {
    doc.setFontSize(3);
    doc.text(sellerName, centerX, centerY + 11, { align: 'center' });
  }
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
