
interface UserPreference {
  userId: string;
  preferences: {
    categories: string[];
    priceRange: { min: number; max: number };
    sustainability: boolean;
    language: string;
    communicationStyle: 'formal' | 'casual' | 'friendly';
  };
  behaviorData: {
    viewedProducts: string[];
    purchaseHistory: string[];
    searchQueries: string[];
    interactionPatterns: Record<string, number>;
  };
  lastInteraction: Date;
  greetingName?: string;
}

class UserPreferencesService {
  private static instance: UserPreferencesService;
  private userProfiles: Map<string, UserPreference> = new Map();

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): UserPreferencesService {
    if (!UserPreferencesService.instance) {
      UserPreferencesService.instance = new UserPreferencesService();
    }
    return UserPreferencesService.instance;
  }

  public getUserProfile(userId: string): UserPreference | null {
    return this.userProfiles.get(userId) || null;
  }

  public updateUserProfile(userId: string, updates: Partial<UserPreference>): void {
    const existing = this.userProfiles.get(userId) || {
      userId,
      preferences: {
        categories: [],
        priceRange: { min: 0, max: 1000 },
        sustainability: true,
        language: 'english',
        communicationStyle: 'friendly'
      },
      behaviorData: {
        viewedProducts: [],
        purchaseHistory: [],
        searchQueries: [],
        interactionPatterns: {}
      },
      lastInteraction: new Date()
    };

    this.userProfiles.set(userId, { ...existing, ...updates });
    this.saveToStorage();
  }

  public trackInteraction(userId: string, type: string, data: any): void {
    const profile = this.getUserProfile(userId);
    if (profile) {
      profile.behaviorData.interactionPatterns[type] = 
        (profile.behaviorData.interactionPatterns[type] || 0) + 1;
      profile.lastInteraction = new Date();
      this.userProfiles.set(userId, profile);
      this.saveToStorage();
    }
  }

  public generateRecommendations(userId: string): string[] {
    const profile = this.getUserProfile(userId);
    if (!profile) return [];

    const recommendations = [];
    
    if (profile.preferences.sustainability) {
      recommendations.push('Eco-friendly alternatives to everyday items');
    }
    
    if (profile.behaviorData.viewedProducts.length > 0) {
      recommendations.push('Similar products you might like');
    }
    
    recommendations.push('Trending sustainable products');
    
    return recommendations.slice(0, 3);
  }

  public getPersonalizedGreeting(userId: string): string {
    const profile = this.getUserProfile(userId);
    const name = profile?.greetingName || '';
    
    if (name) {
      return `Welcome back, ${name}! 👋 I'm ZeroBot AI v5.0, your enhanced assistant. How can I help you today?`;
    }
    
    return "Hello! 👋 I'm ZeroBot AI v5.0, your enhanced assistant. I can help with products, orders, sustainability tips, and much more. How can I assist you today?";
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('zerobot_user_preferences');
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([userId, profile]) => {
          this.userProfiles.set(userId, profile as UserPreference);
        });
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = Object.fromEntries(this.userProfiles);
      localStorage.setItem('zerobot_user_preferences', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }
}

export const userPreferencesService = UserPreferencesService.getInstance();
