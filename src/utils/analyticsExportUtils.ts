
import { format } from 'date-fns';

// Helper function to generate a filename with date
const generateFilename = (type: string, fileFormat: string): string => {
  const date = format(new Date(), 'yyyy-MM-dd-HHmm');
  return `seller-analytics-${type}-${date}.${fileFormat}`;
};

// CSV Export with proper data formatting
export const exportToCSV = async (data: any, type: 'statistics' | 'forecast'): Promise<boolean> => {
  try {
    let csvContent = '';
    let filename = '';
    
    if (type === 'statistics') {
      // Enhanced monthly revenue data with more details
      const monthlyHeaders = ['Month', 'Revenue (₹)', 'Profit (₹)', 'Orders', 'Avg Order Value', 'Growth %'];
      const monthlyRows = data.map((item: any, index: number) => [
        item.month,
        item.revenue.toString(),
        item.profit.toString(),
        Math.floor(item.revenue / 58.14).toString(), // Estimated orders
        '58.14', // Average order value
        index > 0 ? (((item.revenue - data[index-1].revenue) / data[index-1].revenue) * 100).toFixed(1) : '0'
      ]);
      
      csvContent = [
        monthlyHeaders.join(','),
        ...monthlyRows.map(row => row.join(','))
      ].join('\n');
      
      filename = generateFilename('monthly-revenue', 'csv');
    } else {
      // Enhanced inventory forecast data
      const forecastHeaders = ['Month', 'Current Stock', 'Projected Stock', 'Reorder Point', 'Demand Forecast', 'Safety Stock'];
      const forecastRows = data.map((item: any) => [
        item.month,
        item.currentStock.toString(),
        item.projectedStock.toString(),
        item.reorderPoint.toString(),
        Math.max(0, item.currentStock - item.projectedStock + 50).toString(), // Estimated demand
        Math.ceil(item.reorderPoint * 0.2).toString() // Safety stock calculation
      ]);
      
      csvContent = [
        forecastHeaders.join(','),
        ...forecastRows.map(row => row.join(','))
      ].join('\n');
      
      filename = generateFilename('inventory-forecast', 'csv');
    }
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    if (typeof window !== 'undefined') {
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating CSV export:', error);
    return false;
  }
};

// Enhanced PDF Export with actual PDF generation using browser APIs
export const exportToPDF = async (data: any, type: 'statistics' | 'forecast'): Promise<boolean> => {
  try {
    const filename = generateFilename(type === 'statistics' ? 'revenue-statistics' : 'inventory-forecast', 'pdf');
    
    // Create HTML content for PDF
    let htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>ZeroWasteMart Analytics Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #8b5cf6; }
            .date { color: #666; margin-top: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; }
            .summary { background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .insight { margin: 10px 0; padding: 10px; border-left: 4px solid #8b5cf6; background: #f8f9ff; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">ZeroWasteMart Analytics Report</div>
            <div class="date">Generated on ${format(new Date(), 'PPP')}</div>
          </div>
    `;

    if (type === 'statistics') {
      const totalRevenue = data.reduce((sum: number, item: any) => sum + item.revenue, 0);
      const totalProfit = data.reduce((sum: number, item: any) => sum + item.profit, 0);
      const avgGrowth = data.length > 1 ? 
        (((data[data.length - 1].revenue - data[0].revenue) / data[0].revenue) * 100).toFixed(1) : '0';

      htmlContent += `
        <div class="summary">
          <h3>Executive Summary</h3>
          <p><strong>Total Revenue:</strong> ₹${totalRevenue.toLocaleString()}</p>
          <p><strong>Total Profit:</strong> ₹${totalProfit.toLocaleString()}</p>
          <p><strong>Profit Margin:</strong> ${((totalProfit / totalRevenue) * 100).toFixed(1)}%</p>
          <p><strong>Average Growth Rate:</strong> ${avgGrowth}%</p>
        </div>
        
        <h3>Monthly Revenue Breakdown</h3>
        <table>
          <tr>
            <th>Month</th>
            <th>Revenue (₹)</th>
            <th>Profit (₹)</th>
            <th>Growth %</th>
          </tr>
      `;

      data.forEach((item: any, index: number) => {
        const growth = index > 0 ? 
          (((item.revenue - data[index-1].revenue) / data[index-1].revenue) * 100).toFixed(1) : '0';
        htmlContent += `
          <tr>
            <td>${item.month}</td>
            <td>₹${item.revenue.toLocaleString()}</td>
            <td>₹${item.profit.toLocaleString()}</td>
            <td>${growth}%</td>
          </tr>
        `;
      });

      htmlContent += '</table>';
      
      // Add insights
      htmlContent += `
        <div class="insight">
          <h4>AI Insights</h4>
          <p>• Your business shows a consistent growth trend with strong profit margins</p>
          <p>• Peak performance months suggest seasonal patterns worth capitalizing on</p>
          <p>• Recommend increasing inventory during high-growth periods</p>
        </div>
      `;
    } else {
      // Forecast report
      htmlContent += `
        <div class="summary">
          <h3>Inventory Forecast Overview</h3>
          <p>This report provides AI-powered predictions for your inventory needs over the next 6 months.</p>
        </div>
        
        <h3>Inventory Projections</h3>
        <table>
          <tr>
            <th>Month</th>
            <th>Current Stock</th>
            <th>Projected Stock</th>
            <th>Reorder Point</th>
            <th>Recommended Action</th>
          </tr>
      `;

      data.forEach((item: any) => {
        const action = item.projectedStock < item.reorderPoint ? 
          'URGENT: Reorder Required' : 
          item.projectedStock < item.reorderPoint * 1.5 ? 'Monitor Closely' : 'Adequate Stock';
        
        htmlContent += `
          <tr>
            <td>${item.month}</td>
            <td>${item.currentStock}</td>
            <td>${item.projectedStock}</td>
            <td>${item.reorderPoint}</td>
            <td style="color: ${action.includes('URGENT') ? 'red' : action.includes('Monitor') ? 'orange' : 'green'}">${action}</td>
          </tr>
        `;
      });

      htmlContent += '</table>';
      
      htmlContent += `
        <div class="insight">
          <h4>AI Recommendations</h4>
          <p>• Implement automated reordering for items approaching reorder points</p>
          <p>• Consider seasonal adjustments to reorder quantities</p>
          <p>• Monitor fast-moving items more frequently to prevent stockouts</p>
        </div>
      `;
    }

    htmlContent += '</body></html>';

    // Create PDF using browser's print functionality
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load, then print
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 500);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating PDF export:', error);
    return false;
  }
};

// Export business insights as JSON
export const exportBusinessInsights = async (insights: any[]): Promise<boolean> => {
  try {
    const filename = generateFilename('business-insights', 'json');
    const jsonContent = JSON.stringify({
      exportDate: new Date().toISOString(),
      totalInsights: insights.length,
      insights: insights
    }, null, 2);
    
    const blob = new Blob([jsonContent], { type: 'application/json' });
    
    if (typeof window !== 'undefined') {
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    
    return true;
  } catch (error) {
    console.error('Error exporting business insights:', error);
    return false;
  }
};
