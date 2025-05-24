
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be exactly 6 characters' })
});

export type OtpFormValues = z.infer<typeof otpSchema>;

interface ImprovedOtpFormProps {
  onSubmit: (values: OtpFormValues) => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
  phoneNumber: string;
  onResend: () => void;
  resendDisabled: boolean;
  countdownTime: number;
}

const ImprovedOtpForm: React.FC<ImprovedOtpFormProps> = ({
  onSubmit,
  onBack,
  isSubmitting,
  phoneNumber,
  onResend,
  resendDisabled,
  countdownTime
}) => {
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ''
    }
  });

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Update form value when OTP values change
    const otpString = otpValues.join('');
    otpForm.setValue('otp', otpString);
  }, [otpValues, otpForm]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const digits = pastedText.replace(/\D/g, '').slice(0, 6);
    
    if (digits.length > 0) {
      const newOtpValues = [...otpValues];
      for (let i = 0; i < digits.length && i < 6; i++) {
        newOtpValues[i] = digits[i];
      }
      setOtpValues(newOtpValues);
      
      // Focus the next empty input or the last one
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      setFocusedIndex(nextIndex);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Form {...otpForm}>
        <form onSubmit={otpForm.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={otpForm.control}
            name="otp"
            render={() => (
              <FormItem>
                <FormLabel className="text-center block text-lg font-medium">Enter Verification Code</FormLabel>
                <FormControl>
                  <div className="flex justify-center gap-3 py-6">
                    {otpValues.map((value, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Input
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={value}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={handlePaste}
                          onFocus={() => handleFocus(index)}
                          className={`w-14 h-14 text-center text-xl font-bold border-2 rounded-lg transition-all duration-300 otp-input-animate ${
                            focusedIndex === index 
                              ? 'border-zwm-primary ring-2 ring-zwm-primary/20 shadow-lg' 
                              : value 
                                ? 'border-green-400 bg-green-50' 
                                : 'border-gray-300 hover:border-zwm-primary/50'
                          }`}
                          disabled={isSubmitting}
                        />
                      </motion.div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <motion.div 
            className="flex justify-between gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            <Button 
              variant="outline" 
              type="button" 
              onClick={onBack}
              disabled={isSubmitting}
              className="flex-1 auth-button-hover transition-all duration-200"
            >
              Back
            </Button>
            <Button 
              type="submit" 
              className="zwm-gradient flex-1 auth-button-hover transition-all duration-200"
              disabled={isSubmitting || otpValues.join('').length !== 6}
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </motion.div>
                ) : (
                  <motion.span
                    key="verify"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Verify Code
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          <motion.div 
            className="text-center text-sm text-muted-foreground space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.3 }}
          >
            <p>Didn't receive a code?</p>
            <motion.button 
              type="button"
              className={`text-zwm-primary font-medium transition-all duration-200 ${
                resendDisabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:underline cursor-pointer hover:text-zwm-secondary'
              }`}
              onClick={onResend}
              disabled={resendDisabled}
              whileHover={!resendDisabled ? { scale: 1.05 } : {}}
              whileTap={!resendDisabled ? { scale: 0.95 } : {}}
            >
              <AnimatePresence mode="wait">
                {resendDisabled ? (
                  <motion.span
                    key="countdown"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Resend in {countdownTime}s
                  </motion.span>
                ) : (
                  <motion.span
                    key="resend"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Resend Code
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          <motion.div 
            className="text-xs text-center text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.3 }}
          >
            <strong>Demo Mode:</strong> Check the toast notifications for the verification code. 
            In a real app, you would receive this code via SMS.
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
};

export default ImprovedOtpForm;
