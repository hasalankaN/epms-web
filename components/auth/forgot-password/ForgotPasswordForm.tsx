"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react"; 

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/common/BackButton";
import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

interface Step1Props {
  onSubmit: (email: string) => Promise<void> | void;
}

export function ForgotPasswordForm({ onSubmit }: Step1Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values.email);
  };

  return (
    <div className="flex flex-col">
        {/* Back Link */}
       <div className="absolute top-12 left-8"> 
        <BackButton href="/sign-in" label="Back to Login Screen" />
       </div>

      <div className="flex flex-col items-center justify-center gap-1 mb-8">
        <h1 className={AUTH_TYPOGRAPHY.title}>Forgot Password?</h1>
        <p className={AUTH_TYPOGRAPHY.subtitle}>Provide your registered email address.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-1">
                 <label className={AUTH_TYPOGRAPHY.label}>
                    Email <span className={AUTH_TYPOGRAPHY.required}>*</span>
                  </label>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="eg: ava.wright@gmail.com"
                      className={cn(
                        AUTH_INPUT.base,
                        AUTH_INPUT.placeholder,
                        fieldState.error && AUTH_INPUT.error
                      )}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className={cn(BUTTON_STYLES.primary.full, "w-full")}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
                "Go to Next Step"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}