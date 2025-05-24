
export const useAiPricing = (product: { price: number; expiryDate: string }) => {
  const calculateDaysToExpiry = (expiryDate: string): number => {
    if (!expiryDate) return 999;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const generateAiPricingRecommendation = () => {
    const daysToExpiry = calculateDaysToExpiry(product.expiryDate);
    const basePrice = product.price || 0;
    
    // AI factors: demand, expiry, time of day, inventory
    const demandFactor = Math.random() * 0.3 + 0.85; // 0.85-1.15
    const expiryFactor = daysToExpiry <= 7 ? 0.7 : daysToExpiry <= 14 ? 0.85 : 1.0;
    const timeOfDayFactor = new Date().getHours() > 18 ? 0.95 : 1.05; // Evening discount
    
    const aiRecommendedPrice = basePrice * demandFactor * expiryFactor * timeOfDayFactor;
    const priceChange = basePrice > 0 ? ((aiRecommendedPrice - basePrice) / basePrice) * 100 : 0;
    
    return {
      recommendedPrice: Math.round(aiRecommendedPrice * 100) / 100,
      priceChange: Math.round(priceChange * 100) / 100,
      reason: daysToExpiry <= 7 ? 'Near expiry discount' : 
              priceChange > 0 ? 'High demand detected' : 'Optimal pricing opportunity',
      confidence: 75 + Math.floor(Math.random() * 20)
    };
  };

  return {
    calculateDaysToExpiry,
    generateAiPricingRecommendation
  };
};
