
import React from 'react';
import { Clock } from 'lucide-react';

interface ExpiryAlertProps {
  daysToExpiry: number | null;
  showAlert: boolean;
  getAiExpiryAlert: (days: number) => string;
}

export const ExpiryAlert: React.FC<ExpiryAlertProps> = ({
  daysToExpiry,
  showAlert,
  getAiExpiryAlert
}) => {
  if (!showAlert || daysToExpiry === null) return null;

  const getExpiryAlertColor = (): string => {
    if (daysToExpiry > 5) return 'bg-amber-50 text-amber-800';
    if (daysToExpiry > 2) return 'bg-orange-50 text-orange-800';
    return 'bg-red-50 text-red-800';
  };

  return (
    <>
      <div className={`mt-3 p-2 rounded-md ${getExpiryAlertColor()} flex items-center text-xs`}>
        <Clock className="h-3 w-3 mr-1" />
        <span>
          {daysToExpiry === 0 ? "Expires today!" : 
           daysToExpiry === 1 ? "Expires tomorrow!" :
           daysToExpiry > 0 ? `Expires in ${daysToExpiry} days` : "Expired"}
        </span>
      </div>
      
      {/* AI-generated expiry insight */}
      {daysToExpiry > 0 && (
        <p className="text-xs italic text-gray-500 mt-1">
          {getAiExpiryAlert(daysToExpiry)}
        </p>
      )}
    </>
  );
};
