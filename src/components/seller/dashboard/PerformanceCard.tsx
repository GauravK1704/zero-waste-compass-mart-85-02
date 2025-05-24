
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import VerificationForm from '../VerificationForm';

interface PerformanceCardProps {
  trustScore: number;
  verified: boolean;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ trustScore: initialTrustScore, verified }) => {
  const [currentTrustScore, setCurrentTrustScore] = useState(initialTrustScore || 0);
  
  const handleTrustScoreUpdate = useCallback((additionalScore: number) => {
    setCurrentTrustScore(prev => Math.min(prev + additionalScore, 5.0));
  }, []);

  const trustScorePercentage = (currentTrustScore / 5) * 100;
  
  return (
    <div className="col-span-2 md:col-span-1 seller-card-enter seller-card-delay-2">
      <motion.div
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Seller Performance</CardTitle>
            <CardDescription>
              Your trust score and metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Trust Score</div>
                  <motion.div 
                    className="text-sm font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    key={currentTrustScore}
                  >
                    {currentTrustScore.toFixed(1)}/5.0
                  </motion.div>
                </div>
                <div className="mt-1 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-zwm-primary progress-animate" 
                    initial={{ width: 0 }}
                    animate={{ width: `${trustScorePercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="text-sm font-medium flex items-center">
                  {verified ? (
                    <motion.span 
                      className="flex items-center text-green-600"
                      animate={{ 
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Your seller account is verified
                    </motion.span>
                  ) : (
                    <span className="flex items-center text-amber-600">
                      ⚠️ Complete verification to improve your trust score
                    </span>
                  )}
                </div>
                {!verified && (
                  <motion.div 
                    className="mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <VerificationForm onTrustScoreUpdate={handleTrustScoreUpdate} />
                  </motion.div>
                )}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PerformanceCard;
