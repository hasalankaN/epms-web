"use client";

import { useMemo, useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES, AUTH_DECORATIVE } from "@/lib/constants/theme";

const formSchema = z.object({
    password: z.string()
      .min(8, "Password must be at least 8 characters.")
      .max(20, "Password must be no more than 20 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character.")
      .refine((val) => !/\s/.test(val), { message: "Password cannot contain spaces." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

interface ValidationRuleProps {
  text: string;
  isValid: boolean;
}

const ValidationRule = ({ text, isValid }: ValidationRuleProps) => (
  <div className="flex items-center gap-2">
    {isValid ? (
        <CheckCircle2 className="h-4 w-4 text-[#10B981] fill-[#10B981] stroke-white" />
    ) : (
        <CheckCircle2 className="h-4 w-4 text-[#9CA3AF]" />
    )}
    <span className={AUTH_TYPOGRAPHY.helperText}>{text}</span>
  </div>
);

interface Step3Props {
  onSubmit: (password: string) => void;
}

export function SetNewPasswordForm({ onSubmit }: Step3Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange"
  });

  const { isSubmitting } = form.formState;
  const passwordValue = form.watch("password");

  const validations = useMemo(() => ({
    length8: passwordValue?.length >= 8,
    length20: passwordValue?.length <= 20,
    uppercase: /[A-Z]/.test(passwordValue),
    lowercase: /[a-z]/.test(passwordValue),
    specialChar: /[^A-Za-z0-9]/.test(passwordValue),
    noSpaces: !/\s/.test(passwordValue),
  }), [passwordValue]);


  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.password);
  };

  return (
    <div className="flex flex-col space-y-8"> 
      <div className="space-y-1 text-center">
        <h1 className={AUTH_TYPOGRAPHY.title}>Set New Password</h1>
        <p className={AUTH_TYPOGRAPHY.subtitle}>Add strong password</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                    <FormItem className="space-y-1">
                        <label className={AUTH_TYPOGRAPHY.label}>
                            Enter New Password <span className={AUTH_TYPOGRAPHY.required}>*</span>
                        </label>
                        <FormControl>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="QWERTY12345@!#"
                                    className={cn(
                                        AUTH_INPUT.base,
                                        AUTH_INPUT.placeholder,
                                        "pr-10",
                                        fieldState.error && AUTH_INPUT.error
                                    )}
                                    {...field}
                                />
                                <i
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={cn(
                                        "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer shrink-0 transition-opacity hover:opacity-75",
                                    )}
                                >
                                     {showPassword ? (
                                        <Eye className="h-4 w-4" />
                                     ) : (
                                        <EyeOff className="h-4 w-4" />
                                     )}
                                </i>
                            </div>
                        </FormControl>
                        <FormMessage className="text-xs"/>
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field, fieldState }) => (
                    <FormItem className="space-y-1">
                        <label className={AUTH_TYPOGRAPHY.label}>
                            Confirm Password <span className={AUTH_TYPOGRAPHY.required}>*</span>
                        </label>
                        <FormControl>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Re- enter Password"
                                    className={cn(
                                        AUTH_INPUT.base,
                                        AUTH_INPUT.placeholder,
                                        "pr-10",
                                        fieldState.error && AUTH_INPUT.error
                                    )}
                                    {...field}
                                />
                                <i
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className={cn(
                                        "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer shrink-0 transition-opacity hover:opacity-75",
                                    )}
                                >
                                     {showConfirmPassword ? (
                                        <Eye className="h-4 w-4" />
                                     ) : (
                                        <EyeOff className="h-4 w-4" />
                                     )}
                                </i>
                            </div>
                        </FormControl>
                        <FormMessage className="text-xs"/>
                    </FormItem>
                    )}
                />
            </div>
            
            <div className="space-y-4">
               <div className="flex items-center justify-center gap-2">
                 <div className={AUTH_DECORATIVE.dividerLine}></div>
                 <span className={AUTH_TYPOGRAPHY.subtitle}>New password should have</span>
                 <div className={AUTH_DECORATIVE.dividerLine}></div>
               </div>
               
                <div className="space-y-3.5 pl-2">
                    <ValidationRule text="Minimum length: 8 characters" isValid={validations.length8} />
                    <ValidationRule text="At least one uppercase letter(a-z)" isValid={validations.uppercase} />
                    <ValidationRule text="At least one lowercase letter (a-z)" isValid={validations.lowercase} />
                    <ValidationRule text="At least one Special characters (!@#$%^&*)" isValid={validations.specialChar} />
                     <ValidationRule text="No any spaces." isValid={validations.noSpaces} />
                    <ValidationRule text="Maximum 20 characters" isValid={validations.length20} />
                </div>
            </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || !form.formState.isValid} 
            className={cn(BUTTON_STYLES.primary.full, "w-full")}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Changing...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}