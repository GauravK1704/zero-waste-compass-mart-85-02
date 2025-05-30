
import React from 'react';
import { Bot, Cog, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ZeroBotV5HeaderProps {
  sellerMode?: boolean;
  showSettings: boolean;
  onClose: () => void;
  onSettings?: () => void;
  badgeVersion?: string;
}

const ZeroBotV5Header: React.FC<ZeroBotV5HeaderProps> = ({
  sellerMode = false,
  showSettings,
  onClose,
  onSettings,
  badgeVersion = 'v5.0'
}) => (
  <div className={`px-4 py-3 flex justify-between items-center rounded-t-2xl
    ${sellerMode
      ? 'bg-gradient-to-r from-amber-500 to-amber-600'
      : 'bg-gradient-to-r from-emerald-500 to-teal-600'
    } text-white`}>
    <div className="flex items-center space-x-2">
      <span className="h-9 w-9 flex items-center justify-center bg-white/20 rounded-full shadow-sm border border-white/10">
        <Bot className="h-6 w-6 text-white" />
      </span>
      <div>
        <div className="font-semibold text-base flex items-center gap-2">
          ZeroBot AI
          <span className="ml-1 bg-white/30 px-1.5 py-0.5 rounded-full text-xs font-bold tracking-wide">{badgeVersion}</span>
        </div>
        <p className="text-[13px] opacity-80">{sellerMode ? "Seller Assistant" : "Shopping Assistant"}</p>
      </div>
    </div>
    <div className="flex items-center space-x-1">
      {!showSettings && onSettings && (
        <Button
          variant="ghost"
          className="h-7 w-7 text-white/80 hover:text-white/90 hover:bg-white/10 rounded-full"
          size="icon"
          onClick={onSettings}
          aria-label="Bot Settings"
        >
          <Cog size={16} />
        </Button>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-white/80 hover:text-white/90 hover:bg-white/10 rounded-full"
        onClick={onClose}
        aria-label="Close Bot"
      >
        <X size={16} />
      </Button>
    </div>
  </div>
);

export default ZeroBotV5Header;
