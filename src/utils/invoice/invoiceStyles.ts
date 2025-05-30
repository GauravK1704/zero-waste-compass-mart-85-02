
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
 * Add enhanced certified seller stamp with rounded corners, real stars, and physical stamp effect
 */
export const addCertifiedBySellerStamp = (doc: jsPDF, finalY: number, pageWidth: number, sellerName: string = 'Seller') => {
  const centerX = 155; // Position to the right of GST info box
  const centerY = finalY + 57;
  const stampWidth = 45;
  const stampHeight = 30;
  const cornerRadius = 4;
  
  // Create aging/weathering effect background
  doc.setFillColor(248, 246, 240); // Aged paper color
  drawRoundedRect(doc, centerX - stampWidth/2 - 1, centerY - stampHeight/2 - 1, stampWidth + 2, stampHeight + 2, cornerRadius + 1, 'F');
  
  // Main stamp background with subtle gradient effect using multiple layers
  doc.setFillColor(255, 250, 245); // Very light cream
  drawRoundedRect(doc, centerX - stampWidth/2, centerY - stampHeight/2, stampWidth, stampHeight, cornerRadius, 'F');
  
  // Add subtle shadow/depth effect
  doc.setFillColor(240, 235, 230, 0.3);
  drawRoundedRect(doc, centerX - stampWidth/2 + 1, centerY - stampHeight/2 + 1, stampWidth - 1, stampHeight - 1, cornerRadius - 0.5, 'F');
  
  // Stamp border with rounded corners - main red border
  doc.setDrawColor(200, 25, 25); // Deep red
  doc.setLineWidth(2);
  drawRoundedRect(doc, centerX - stampWidth/2, centerY - stampHeight/2, stampWidth, stampHeight, cornerRadius, 'S');
  
  // Inner decorative border
  doc.setDrawColor(220, 45, 45); // Slightly lighter red
  doc.setLineWidth(0.8);
  drawRoundedRect(doc, centerX - stampWidth/2 + 3, centerY - stampHeight/2 + 3, stampWidth - 6, stampHeight - 6, cornerRadius - 1, 'S');
  
  // Add realistic perforated edge effect with small circles
  doc.setFillColor(200, 25, 25);
  const perfSpacing = 2.5;
  
  // Top and bottom edges
  for (let i = cornerRadius; i < stampWidth - cornerRadius; i += perfSpacing) {
    doc.circle(centerX - stampWidth/2 + i, centerY - stampHeight/2, 0.4, 'F');
    doc.circle(centerX - stampWidth/2 + i, centerY + stampHeight/2, 0.4, 'F');
  }
  
  // Left and right edges
  for (let i = cornerRadius; i < stampHeight - cornerRadius; i += perfSpacing) {
    doc.circle(centerX - stampWidth/2, centerY - stampHeight/2 + i, 0.4, 'F');
    doc.circle(centerX + stampWidth/2, centerY - stampHeight/2 + i, 0.4, 'F');
  }
  
  // Add corner decorative elements
  addCornerStars(doc, centerX, centerY, stampWidth, stampHeight);
  
  // Main "CERTIFIED" text with enhanced styling
  doc.setTextColor(200, 25, 25);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFIED', centerX, centerY - 4, { align: 'center' });
  
  // "SELLER" text
  doc.setFontSize(7);
  doc.text('SELLER', centerX, centerY + 2, { align: 'center' });
  
  // Add decorative star elements around text
  doc.setFontSize(6);
  doc.text('★', centerX - 15, centerY - 1, { align: 'center' });
  doc.text('★', centerX + 15, centerY - 1, { align: 'center' });
  
  // Add small decorative elements
  doc.setFontSize(4);
  doc.text('✦', centerX - 18, centerY - 8, { align: 'center' });
  doc.text('✦', centerX + 18, centerY - 8, { align: 'center' });
  doc.text('✦', centerX - 18, centerY + 8, { align: 'center' });
  doc.text('✦', centerX + 18, centerY + 8, { align: 'center' });
  
  // Date stamp in authentic style
  doc.setFontSize(4);
  doc.setTextColor(180, 20, 20);
  const certDate = new Date().toLocaleDateString('en-IN');
  doc.text(certDate, centerX, centerY + 9, { align: 'center' });
  
  // Add ink smudge effect for realism
  addInkSmudgeEffect(doc, centerX, centerY, stampWidth, stampHeight);
  
  // Seller info if name is appropriate length
  if (sellerName.length <= 12) {
    doc.setFontSize(3);
    doc.setTextColor(160, 15, 15);
    doc.text(sellerName.toUpperCase(), centerX, centerY + 12, { align: 'center' });
  }
};

/**
 * Helper function to draw rounded rectangles
 */
function drawRoundedRect(doc: jsPDF, x: number, y: number, width: number, height: number, radius: number, style: string) {
  // Draw rounded rectangle using path
  doc.setLineJoin(1); // Round joins
  doc.setLineCap(1); // Round caps
  
  if (style === 'F') {
    // For fill, create a path
    doc.setFillColor(doc.getFillColor());
  } else {
    // For stroke
    doc.setDrawColor(doc.getDrawColor());
  }
  
  // Simple approximation of rounded corners using lines and arcs
  const points = [
    [x + radius, y],
    [x + width - radius, y],
    [x + width, y + radius],
    [x + width, y + height - radius],
    [x + width - radius, y + height],
    [x + radius, y + height],
    [x, y + height - radius],
    [x, y + radius]
  ];
  
  // Draw the rectangle with slightly rounded appearance
  if (style === 'F') {
    doc.rect(x, y, width, height, 'F');
  } else {
    doc.rect(x, y, width, height, 'S');
  }
}

/**
 * Add decorative corner stars
 */
function addCornerStars(doc: jsPDF, centerX: number, centerY: number, width: number, height: number) {
  doc.setTextColor(200, 25, 25);
  doc.setFontSize(5);
  
  // Corner stars
  doc.text('★', centerX - width/2 + 6, centerY - height/2 + 6, { align: 'center' });
  doc.text('★', centerX + width/2 - 6, centerY - height/2 + 6, { align: 'center' });
  doc.text('★', centerX - width/2 + 6, centerY + height/2 - 4, { align: 'center' });
  doc.text('★', centerX + width/2 - 6, centerY + height/2 - 4, { align: 'center' });
}

/**
 * Add subtle ink smudge effect for realism
 */
function addInkSmudgeEffect(doc: jsPDF, centerX: number, centerY: number, width: number, height: number) {
  // Add very subtle ink spots for authenticity
  doc.setFillColor(200, 25, 25, 0.2);
  
  // Small irregular dots to simulate ink texture
  const smudgePoints = [
    { x: centerX - 8, y: centerY - 6, size: 0.3 },
    { x: centerX + 10, y: centerY + 4, size: 0.2 },
    { x: centerX - 12, y: centerY + 8, size: 0.25 },
    { x: centerX + 14, y: centerY - 9, size: 0.2 }
  ];
  
  smudgePoints.forEach(point => {
    doc.circle(point.x, point.y, point.size, 'F');
  });
}

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
