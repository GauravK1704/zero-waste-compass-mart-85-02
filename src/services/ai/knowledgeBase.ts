
interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  keywords: string[];
  lastUpdated: Date;
  helpful: number;
  views: number;
}

class KnowledgeBaseService {
  private static instance: KnowledgeBaseService;
  private articles: Map<string, KnowledgeArticle> = new Map();

  private constructor() {
    this.initializeKnowledgeBase();
  }

  public static getInstance(): KnowledgeBaseService {
    if (!KnowledgeBaseService.instance) {
      KnowledgeBaseService.instance = new KnowledgeBaseService();
    }
    return KnowledgeBaseService.instance;
  }

  private initializeKnowledgeBase(): void {
    const articles: KnowledgeArticle[] = [
      {
        id: 'sustainability-101',
        title: 'Understanding Sustainability',
        content: 'Sustainability means meeting our current needs without compromising the ability of future generations to meet their own needs. At Zero Waste Mart, we focus on products that minimize environmental impact through reduced waste, renewable materials, and circular economy principles.',
        category: 'sustainability',
        keywords: ['sustainability', 'environment', 'eco-friendly', 'green'],
        lastUpdated: new Date(),
        helpful: 45,
        views: 120
      },
      {
        id: 'zero-waste-living',
        title: 'Zero Waste Living Guide',
        content: 'Zero waste living involves reducing what you need, reusing what you can, and recycling what you cannot refuse or reduce. Start with simple swaps like reusable bags, water bottles, and containers. Gradually incorporate more sustainable practices into your daily routine.',
        category: 'lifestyle',
        keywords: ['zero waste', 'lifestyle', 'reduce', 'reuse', 'recycle'],
        lastUpdated: new Date(),
        helpful: 67,
        views: 89
      },
      {
        id: 'shipping-policy',
        title: 'Shipping and Delivery Information',
        content: 'We offer free shipping on orders over $50. Standard delivery takes 3-5 business days, while express delivery takes 1-2 business days. All packages are shipped in plastic-free, biodegradable packaging materials.',
        category: 'shipping',
        keywords: ['shipping', 'delivery', 'packaging', 'free shipping'],
        lastUpdated: new Date(),
        helpful: 34,
        views: 156
      },
      {
        id: 'return-policy',
        title: 'Return and Refund Policy',
        content: 'We accept returns within 30 days of purchase. Items must be in original condition. Refunds are processed within 5-7 business days. For sustainability reasons, we encourage exchanges over returns when possible.',
        category: 'returns',
        keywords: ['return', 'refund', 'exchange', 'policy'],
        lastUpdated: new Date(),
        helpful: 28,
        views: 78
      }
    ];

    articles.forEach(article => {
      this.articles.set(article.id, article);
    });
  }

  public searchArticles(query: string): KnowledgeArticle[] {
    const lowerQuery = query.toLowerCase();
    const results: Array<{ article: KnowledgeArticle; relevance: number }> = [];

    for (const article of this.articles.values()) {
      let relevance = 0;

      // Check title match
      if (article.title.toLowerCase().includes(lowerQuery)) {
        relevance += 10;
      }

      // Check keyword matches
      article.keywords.forEach(keyword => {
        if (lowerQuery.includes(keyword.toLowerCase())) {
          relevance += 5;
        }
      });

      // Check content match
      if (article.content.toLowerCase().includes(lowerQuery)) {
        relevance += 3;
      }

      if (relevance > 0) {
        results.push({ article, relevance });
      }
    }

    // Sort by relevance and return top 3
    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 3)
      .map(result => result.article);
  }

  public getArticleByCategory(category: string): KnowledgeArticle[] {
    return Array.from(this.articles.values())
      .filter(article => article.category === category)
      .slice(0, 3);
  }

  public incrementViews(articleId: string): void {
    const article = this.articles.get(articleId);
    if (article) {
      article.views++;
    }
  }

  public markHelpful(articleId: string): void {
    const article = this.articles.get(articleId);
    if (article) {
      article.helpful++;
    }
  }
}

export const knowledgeBase = KnowledgeBaseService.getInstance();
