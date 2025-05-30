
class StreamHandler {
  private static instance: StreamHandler;
  private currentStream: AbortController | null = null;

  private constructor() {}

  public static getInstance(): StreamHandler {
    if (!StreamHandler.instance) {
      StreamHandler.instance = new StreamHandler();
    }
    return StreamHandler.instance;
  }

  public cancelCurrentStream(): void {
    if (this.currentStream) {
      this.currentStream.abort();
      this.currentStream = null;
    }
  }

  public setCurrentStream(controller: AbortController): void {
    this.currentStream = controller;
  }
}

export const streamHandler = StreamHandler.getInstance();
