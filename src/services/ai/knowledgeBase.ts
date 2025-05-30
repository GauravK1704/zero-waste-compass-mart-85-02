
interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  keywords: string[];
}

class KnowledgeBase {
  private static instance: KnowledgeBase;
  private articles: KnowledgeArticle[] = [
    {
      id: '1',
      title: 'Getting Started with Zero Waste Living',
      content: 'Zero waste living is about reducing waste and making sustainable choices. Start by using reusable bags, water bottles, and containers.',
      category: 'sustainability',
      keywords: ['zero waste', 'sustainable', 'eco-friendly', 'reduce waste']
    },
    {
      id: '2',
      title: 'How to Track Your Orders',
      content: 'You can track your orders by going to your account dashboard and clicking on "My Orders". Each order has a tracking number for real-time updates.',
      category: 'orders',
      keywords: ['track order', 'order status', 'delivery', 'shipping']
    },
    {
      id: '3',
      title: 'Sustainable Product Materials Guide',
      content: 'Our products are made from eco-friendly materials like bamboo, recycled plastic, and organic cotton. Each product page shows detailed material information.',
      category: 'products',
      keywords: ['materials', 'sustainable products', 'eco-friendly', 'bamboo', 'recycled']
    }
  ];

  private constructor() {}

  public static getInstance(): KnowledgeBase {
    if (!KnowledgeBase.instance) {
      KnowledgeBase.instance = new KnowledgeBase();
    }
    return KnowledgeBase.instance;
  }

  public searchArticles(query: string): KnowledgeArticle[] {
    const lowerQuery = query.toLowerCase();
    return this.articles.filter(article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery) ||
      article.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
    );
  }

  public getArticlesByCategory(category: string): KnowledgeArticle[] {
    return this.articles.filter(article => article.category === category);
  }
}

export const knowledgeBase = KnowledgeBase.getInstance();
