
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
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
    }
  };

  return (
    <Form {...otpForm}>
      <form onSubmit={otpForm.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={otpForm.control}
          name="otp"
          render={() => (
            <FormItem>
              <FormLabel className="text-center block">Enter Verification Code</FormLabel>
              <FormControl>
                <div className="flex justify-center gap-2 py-4">
                  {otpValues.map((value, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-zwm-primary focus:ring-2 focus:ring-zwm-primary/20"
                      disabled={isSubmitting}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-between gap-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onBack}
            disabled={isSubmitting}
            className="flex-1"
          >
            Back
          </Button>
          <Button 
            type="submit" 
            className="zwm-gradient flex-1"
            disabled={isSubmitting || otpValues.join('').length !== 6}
          >
            {isSubmitting ? 'Verifying...' : 'Verify Code'}
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>Didn't receive a code?</p>
          <button 
            type="button"
            className={`text-zwm-primary ${resendDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:underline cursor-pointer'}`}
            onClick={onResend}
            disabled={resendDisabled}
          >
            {resendDisabled ? `Resend in ${countdownTime}s` : 'Resend Code'}
          </button>
        </div>

        <div className="text-xs text-center text-amber-600 bg-amber-50 p-3 rounded-lg">
          <strong>Demo Mode:</strong> Check the toast notifications for the verification code. 
          In a real app, you would receive this code via SMS.
        </div>
      </form>
    </Form>
  );
};

export default ImprovedOtpForm;
