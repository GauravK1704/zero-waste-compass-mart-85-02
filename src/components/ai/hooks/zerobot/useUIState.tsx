
import { useState } from 'react';

export function useUIState() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [showSettings, setShowSettings] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return {
    isOpen,
    setIsOpen,
    activeTab,
    setActiveTab,
    showSettings,
    setShowSettings,
    hasUnreadMessages,
    setHasUnreadMessages,
    inputValue,
    setInputValue,
  };
}
