
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
    // Load from localStorage if available
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

    const updated = { ...existing, ...updates, lastInteraction: new Date() };
    this.userProfiles.set(userId, updated);
    this.saveToStorage();
  }

  public trackInteraction(userId: string, action: string, data?: any): void {
    const profile = this.getUserProfile(userId);
    if (!profile) {
      this.updateUserProfile(userId, {});
      return;
    }

    // Update interaction patterns
    profile.behaviorData.interactionPatterns[action] = 
      (profile.behaviorData.interactionPatterns[action] || 0) + 1;

    // Track specific actions
    switch (action) {
      case 'view_product':
        if (data?.productId && !profile.behaviorData.viewedProducts.includes(data.productId)) {
          profile.behaviorData.viewedProducts.push(data.productId);
        }
        break;
      case 'search':
        if (data?.query) {
          profile.behaviorData.searchQueries.push(data.query);
        }
        break;
      case 'purchase':
        if (data?.productId) {
          profile.behaviorData.purchaseHistory.push(data.productId);
        }
        break;
    }

    this.userProfiles.set(userId, profile);
    this.saveToStorage();
  }

  public getPersonalizedGreeting(userId: string): string {
    const profile = this.getUserProfile(userId);
    if (!profile) return "Hello! How can I help you today?";

    const name = profile.greetingName || "there";
    const style = profile.preferences.communicationStyle;
    const isReturning = profile.lastInteraction && 
      (new Date().getTime() - profile.lastInteraction.getTime()) < 24 * 60 * 60 * 1000;

    const greetings = {
      formal: isReturning ? 
        `Good day, ${name}. Welcome back to Zero Waste Mart.` :
        `Good day, ${name}. How may I assist you today?`,
      casual: isReturning ?
        `Hey ${name}! Good to see you back!` :
        `Hey ${name}! What's up?`,
      friendly: isReturning ?
        `Welcome back, ${name}! 👋 How can I help you today?` :
        `Hi ${name}! 😊 Nice to meet you! How can I assist you?`
    };

    return greetings[style] || greetings.friendly;
  }

  public generateRecommendations(userId: string): string[] {
    const profile = this.getUserProfile(userId);
    if (!profile) return [];

    const recommendations: string[] = [];

    // Based on viewed products
    if (profile.behaviorData.viewedProducts.length > 0) {
      recommendations.push("Check out similar eco-friendly products you might like");
    }

    // Based on search history
    if (profile.behaviorData.searchQueries.length > 0) {
      const lastQuery = profile.behaviorData.searchQueries[profile.behaviorData.searchQueries.length - 1];
      recommendations.push(`Continue exploring: ${lastQuery}`);
    }

    // Based on interaction patterns
    if (profile.behaviorData.interactionPatterns['track_order'] > 0) {
      recommendations.push("Track your recent orders");
    }

    if (profile.preferences.sustainability) {
      recommendations.push("Discover our newest sustainable products");
    }

    return recommendations.slice(0, 3);
  }

  private saveToStorage(): void {
    try {
      const data = Array.from(this.userProfiles.entries());
      localStorage.setItem('zerobot_user_preferences', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('zerobot_user_preferences');
      if (stored) {
        const data = JSON.parse(stored);
        this.userProfiles = new Map(data);
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  }
}

export const userPreferencesService = UserPreferencesService.getInstance();
