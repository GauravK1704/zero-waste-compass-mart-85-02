
import { MessageCategory } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';

class LoggingService {
  private static instance: LoggingService;

  private constructor() {}

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  public async logUserInteraction(
    userId: string, 
    message: string, 
    category?: MessageCategory
  ): Promise<void> {
    try {
      if (supabase) {
        await supabase.from('ai_interactions').insert({
          user_id: userId,
          message,
          category: category || 'general',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Failed to log user interaction:', error);
    }
  }

  public async logFeedback(
    userId: string,
    messageId: string,
    feedback: 'positive' | 'negative',
    comment?: string
  ): Promise<void> {
    try {
      if (supabase) {
        await supabase.from('ai_feedback').insert({
          user_id: userId,
          message_id: messageId,
          feedback,
          comment,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Failed to log feedback:', error);
    }
  }
}

export const loggingService = LoggingService.getInstance();
