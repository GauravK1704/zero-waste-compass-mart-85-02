
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { COUNTRY_CODES } from '@/utils/countryCodes';
import { cn } from '@/lib/utils';

const phoneSchema = z.object({
  countryCode: z.string().min(1, { message: 'Country code is required' }),
  phoneNumber: z.string().min(5, { message: 'Phone number must be at least 5 characters' })
});

export type PhoneFormValues = z.infer<typeof phoneSchema>;

interface PhoneNumberFormProps {
  onSubmit: (values: PhoneFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const PhoneNumberForm: React.FC<PhoneNumberFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [open, setOpen] = useState(false);

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: '+1', // Default to US
      phoneNumber: ''
    }
  });

  const handleCountrySelect = (countryCode: string) => {
    phoneForm.setValue('countryCode', countryCode);
    setOpen(false);
  };

  return (
    <Form {...phoneForm}>
      <form onSubmit={phoneForm.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={phoneForm.control}
          name="countryCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country Code</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:border-zwm-primary focus:border-zwm-primary focus:ring-2 focus:ring-zwm-primary/20"
                      type="button"
                      onClick={() => setOpen(!open)}
                    >
                      {field.value ? (
                        <div className="flex items-center gap-2">
                          <span>
                            {COUNTRY_CODES.find(country => country.code === field.value)?.flag}
                          </span>
                          <span className="font-medium">{field.value}</span>
                          <span className="text-muted-foreground">
                            {COUNTRY_CODES.find(country => country.code === field.value)?.label}
                          </span>
                        </div>
                      ) : (
                        "Select country code"
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-white border shadow-lg z-[9999] max-w-sm" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search country..." 
                      className="h-10"
                    />
                    <CommandList className="max-h-60 overflow-y-auto">
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {COUNTRY_CODES.map((country) => (
                          <CommandItem
                            key={`${country.code}-${country.label}`}
                            value={`${country.code} ${country.label}`}
                            onSelect={() => handleCountrySelect(country.code)}
                            className="cursor-pointer hover:bg-gray-100 transition-colors duration-150 px-3 py-2 flex items-center"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === country.code ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span className="mr-2">{country.flag}</span>
                            <span className="font-medium mr-2">{country.code}</span>
                            <span className="text-muted-foreground">{country.label}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={phoneForm.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="123-456-7890" 
                  {...field}
                  className="w-full transition-all duration-200 focus:border-zwm-primary focus:ring-2 focus:ring-zwm-primary/20" 
                  type="tel"
                  inputMode="tel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-between gap-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 transition-all duration-200 hover:bg-gray-50"
          >
            Back
          </Button>
          <Button 
            type="submit" 
            className="zwm-gradient flex-1 transition-all duration-200 hover:scale-105"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Code'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PhoneNumberForm;
