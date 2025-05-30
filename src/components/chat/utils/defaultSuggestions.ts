
import { MessageCategory } from '@/types/chat';

export const defaultSuggestions: Record<MessageCategory, string[]> = {
  general: [
    "How does Zero Waste Mart work?",
    "What impact have we made so far?",
    "Tips for sustainable living?",
    "How can I track my environmental impact?"
  ],
  sustainability: [
    "How can I reduce my plastic usage?",
    "What are the best composting methods?",
    "How to start a zero-waste lifestyle?",
    "Which products have the lowest environmental impact?"
  ],
  climate: [
    "How does my shopping affect climate change?",
    "What's my carbon footprint?",
    "Climate-friendly product alternatives?",
    "How to offset my environmental impact?"
  ],
  personal: [
    "Show me my order history",
    "Update my preferences",
    "What's my sustainability score?",
    "Personalized recommendations"
  ],
  tracking: [
    "When will my package arrive?",
    "Is there a delay with my order?",
    "Can I change my delivery address?",
    "How do I track my recent order?"
  ],
  product: [
    "What materials is this made from?",
    "Is this product recyclable?",
    "How long does this product last?",
    "Is there a warranty on this item?"
  ],
  order: [
    "Check my recent orders",
    "Cancel my order",
    "Modify my order",
    "Reorder previous items"
  ],
  invoice: [
    "Download my invoice",
    "Payment details",
    "Billing information",
    "Receipt for tax purposes"
  ],
  support: [
    "I need help with a problem",
    "Speak to a human agent",
    "Report an issue",
    "Get technical support"
  ],
  account: [
    "Update my profile",
    "Change password",
    "Privacy settings",
    "Delete my account"
  ]
};
