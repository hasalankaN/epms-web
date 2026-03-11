"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { useLoginMutation } from "@/hooks/api/auth/useAuth";
import { useSecureCredentials } from "@/hooks/useSecureCredentials";
import type { LoginRequest } from "@/types/dto/auth.dto";
import { loginRequestSchema } from "@/types/dto/auth.dto";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  // Use the mutation hook for state management. It provides `isPending` for loading state.
  const { mutate: performLogin, isPending } = useLoginMutation();

  const {
    isRemembered,
    setIsRemembered,
    saveCredentials,
    clearCredentials,
    loadCredentials,
  } = useSecureCredentials();

  // Use the LoginRequest type from the DTO for the form
  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema), // Use the imported schema
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  // isSubmitting is still useful for disabling the button during async validation
  const { isSubmitting } = form.formState;

  useEffect(() => {
    const loadSavedCredentials = async () => {
      const credentials = await loadCredentials();

      if (credentials) {
        form.reset(credentials);
        setIsRemembered(true);
      }
    };

    loadSavedCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (values: LoginRequest) => {
    if (isRemembered) {
      saveCredentials({ email: values.email, password: values.password });
    } else {
      clearCredentials();
    }
    
    // Call the mutation. React Query and the hook handle the rest
    // (API call, loading state, success/error toasts, redirection).
    performLogin({ ...values, rememberMe: isRemembered });
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col items-center justify-center gap-1">
        <h1 className={AUTH_TYPOGRAPHY.title}>Welcome Back</h1>
        <p className={AUTH_TYPOGRAPHY.subtitle}>Enter your email below login to your account</p>
      </div>

      <Form {...form}>
        <form
          className="flex flex-col space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col space-y-4">
            {/* Email Field */}
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
                      {/* Removing icons as per design image which shows plain inputs with placeholders */}
                      <Input
                        type="email"
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

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-1">
                  <label className={AUTH_TYPOGRAPHY.label}>
                    Password <span className={AUTH_TYPOGRAPHY.required}>*</span>
                  </label>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password here.."
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
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={isRemembered}
                onCheckedChange={(checked) => setIsRemembered(Boolean(checked))}
                className="h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
              />
              <label htmlFor="rememberMe" className="text-sm font-medium leading-5 text-[#0F172B] cursor-pointer">
                Remember me!
              </label>
            </div>
            <Link href="/forgot-password" className="text-sm font-medium leading-5 text-[#0F172B] hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isPending}
            className={cn(BUTTON_STYLES.primary.full, "w-full")}
          >
            {isSubmitting || isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login to System"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}