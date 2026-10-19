"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";

import { useLoginMutation } from "@/hooks/api/auth/useAuth";
import { useSecureCredentials } from "@/hooks/useSecureCredentials";
import type { LoginRequest } from "@/types/dto/auth.dto";
import { loginRequestSchema } from "@/types/dto/auth.dto";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: performLogin, isPending } = useLoginMutation();

  const {
    isRemembered,
    setIsRemembered,
    saveCredentials,
    clearCredentials,
    loadCredentials,
  } = useSecureCredentials();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      email: "kasun.perera",
      password: "",
      rememberMe: true,
    },
    mode: "onSubmit",
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const loadSavedCredentials = async () => {
      const credentials = await loadCredentials();

      if (credentials) {
        form.reset({
          email: credentials.email,
          password: credentials.password,
          rememberMe: true,
        });
        setIsRemembered(true);
      }
    };

    loadSavedCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (values: LoginRequest) => {
    setErrorMessage(null);

    if (isRemembered) {
      saveCredentials({ email: values.email, password: values.password });
    } else {
      clearCredentials();
    }

    performLogin(
      { ...values, rememberMe: isRemembered },
      {
        onError: (err: any) => {
          setErrorMessage(err.message || "Invalid username or password. Please check your details and try again.");
        },
      }
    );
  };

  // Prototype quick-fill shortcut helper
  const handlePrototypeShortcut = (role: "Employee" | "Supervisor" | "HR" | "Admin") => {
    setErrorMessage(null);

    switch (role) {
      case "Admin":
        form.setValue("email", "epms.admin@yopmail.com");
        form.setValue("password", "admin1234");
        break;
      case "Employee":
        form.setValue("email", "kasun.perera");
        form.setValue("password", "admin1234");
        break;
      case "Supervisor":
        form.setValue("email", "supervisor@yopmail.com");
        form.setValue("password", "admin1234");
        break;
      case "HR":
        form.setValue("email", "hr@yopmail.com");
        form.setValue("password", "admin1234");
        break;
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Welcome back
        </h1>
        <p className="text-sm text-neutral-500 mt-1.5">
          Sign in with the account created for you by your Admin.
        </p>
      </div>

      {/* Error Banner matching Image 1 */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200/90 bg-red-50/80 p-4 text-red-900 flex items-start gap-3 transition-all">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
          <div className="flex-1 text-left">
            <h4 className="text-sm font-semibold text-red-900">Login failed</h4>
            <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form
          className="flex flex-col space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Username / Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5 text-left">
                <FormLabel className="text-xs font-medium text-neutral-900">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="kasun.perera"
                    className="h-10 text-sm rounded-lg border-neutral-200 bg-white placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-900"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-medium text-neutral-900">
                    Password
                  </FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-neutral-900 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      className="h-10 text-sm rounded-lg border-neutral-200 bg-white pr-10 placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-900"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />

          {/* Keep me signed in checkbox */}
          <div className="flex items-center space-x-2.5 pt-1">
            <Checkbox
              id="rememberMe"
              checked={isRemembered}
              onCheckedChange={(checked) => setIsRemembered(Boolean(checked))}
              className="h-4 w-4 rounded border-neutral-300 data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900"
            />
            <label
              htmlFor="rememberMe"
              className="text-xs font-normal text-neutral-800 cursor-pointer select-none"
            >
              Keep me signed in on this device
            </label>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            disabled={isSubmitting || isPending}
            className="w-full h-10 mt-2 text-sm font-medium rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-sm"
          >
            {isSubmitting || isPending ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </Form>

      {/* Prototype shortcuts divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-neutral-400 font-normal">
            Prototype shortcuts
          </span>
        </div>
      </div>

      {/* Prototype Shortcuts 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => handlePrototypeShortcut("Employee")}
          className="h-10 rounded-lg border border-neutral-200 bg-white text-xs font-medium text-neutral-800 hover:bg-neutral-50 transition-colors flex items-center justify-center"
        >
          Employee
        </button>
        <button
          type="button"
          onClick={() => handlePrototypeShortcut("Supervisor")}
          className="h-10 rounded-lg border border-neutral-200 bg-white text-xs font-medium text-neutral-800 hover:bg-neutral-50 transition-colors flex items-center justify-center"
        >
          Supervisor
        </button>
        <button
          type="button"
          onClick={() => handlePrototypeShortcut("HR")}
          className="h-10 rounded-lg border border-neutral-200 bg-white text-xs font-medium text-neutral-800 hover:bg-neutral-50 transition-colors flex items-center justify-center"
        >
          HR
        </button>
        <button
          type="button"
          onClick={() => handlePrototypeShortcut("Admin")}
          className="h-10 rounded-lg border border-neutral-200 bg-white text-xs font-medium text-neutral-800 hover:bg-neutral-50 transition-colors flex items-center justify-center"
        >
          Admin
        </button>
      </div>
    </div>
  );
}