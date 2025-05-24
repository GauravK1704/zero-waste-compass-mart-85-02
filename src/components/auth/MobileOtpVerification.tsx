
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import PhoneNumberForm, { PhoneFormValues } from './mobile-verification/PhoneNumberForm';
import ImprovedOtpForm, { OtpFormValues } from './mobile-verification/ImprovedOtpForm';
import VerificationHeader from './mobile-verification/VerificationHeader';
import useCountdown from './mobile-verification/useCountdown';

interface MobileOtpVerificationProps {
  onVerificationComplete: (phoneNumber: string) => void;
  onCancel: () => void;
}

const MobileOtpVerification: React.FC<MobileOtpVerificationProps> = ({ 
  onVerificationComplete, 
  onCancel 
}) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { countdownTime, isActive, startCountdown } = useCountdown(30);

  const handleSendOtp = async (values: PhoneFormValues) => {
    setIsSubmitting(true);
    try {
      // Format the phone number with country code
      const fullPhoneNumber = `${values.countryCode}${values.phoneNumber}`;
      
      // In a real implementation, we would call an API to send the OTP
      // For now, simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a random 6-digit code for demo purposes
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Show the code in a toast - in a real app this would be sent via SMS
      toast.info(`Demo: Your OTP is ${randomCode}`, {
        description: "In a real app, this would be sent via SMS. For the demo, please use this code.",
        duration: 10000
      });
      
      setFormattedPhoneNumber(fullPhoneNumber);
      setStep('otp');
      toast.success(`OTP sent to ${fullPhoneNumber}`);
      
      // Start countdown for resend button
      startCountdown();
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (values: OtpFormValues) => {
    setIsSubmitting(true);
    try {
      // In a real implementation, this would call an API to verify the OTP
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For this mock, we'll consider any 6-digit OTP as valid
      if (values.otp.length === 6) {
        onVerificationComplete(formattedPhoneNumber);
        toast.success('Phone number verified successfully!');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('OTP verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (isActive) return;
    
    toast.info('Resending code...');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a new random 6-digit code for demo purposes
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Show the code in a toast - in a real app this would be sent via SMS
      toast.info(`Demo: Your new OTP is ${randomCode}`, {
        description: "In a real app, this would be sent via SMS. For the demo, please use this code.",
        duration: 10000
      });
      
      toast.success('New code sent!');
      startCountdown();
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-lg border-0">
        <VerificationHeader step={step} phoneNumber={formattedPhoneNumber} />
        
        <CardContent className="p-6">
          {step === 'phone' ? (
            <PhoneNumberForm 
              onSubmit={handleSendOtp} 
              onCancel={onCancel}
              isSubmitting={isSubmitting}
            />
          ) : (
            <ImprovedOtpForm
              onSubmit={handleVerifyOtp}
              onBack={() => setStep('phone')}
              isSubmitting={isSubmitting}
              phoneNumber={formattedPhoneNumber}
              onResend={handleResendOtp}
              resendDisabled={isActive}
              countdownTime={countdownTime}
            />
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2 p-6 pt-0">
          <div className="text-center text-sm text-muted-foreground">
            {step === 'phone' && 'We\'ll send a verification code to this number'}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MobileOtpVerification;
