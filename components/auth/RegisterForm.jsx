"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, ArrowRightIcon } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { RegisterSchema } from "@/schemas/register.schema";
import { register } from "@/actions";
import { PasswordInput } from "../ui/password-input";
import LoadingButton from "../ui/loading-button";

export default function RegisterForm() {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    try {
      // In a real app, this would be an API call to create the user
      // For demo purposes, we&apos;ll simulate a successful signup
      startTransition(() => {
        register(values)
          .then(({ success, type, message }) => {
            if (success) {
              toast({
                title: message,
                description: "Please verify your email to continue.",
              });

              // Redirect to OTP verification page
              // router.push(
              //   `/verify-otp?email=${encodeURIComponent(values.email)}`
              // );
              router.push(
                "/login"
              );
              form.reset();
            } else {
              toast({
                variant: "destructive",
                title: "Error creating account",
                description: message,
              });
            }
          })
          .catch((error) => {
            console.log(error);
            toast({
              variant: "destructive",
              title: "Error creating account",
              description:
                "There was a problem creating your account. Please try again.",
            });
          });
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating account",
        description:
          "There was a problem creating your account. Please try again.",
      });
    }
  }
  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center mx-auto">
      <div className="mx-auto flex flex-col justify-center px-6 sm:px-0 space-y-6 w-full sm:max-w-md">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your name, email and password to create your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Dae" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.dae@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      id="password"
                      placeholder="*********"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    {/* <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword
                            ? "Hide password"
                            : "Show password"}
                        </span>
                      </Button>
                    </div> */}
                    <PasswordInput
                      {...field}
                      id="confirmPassword"
                      placeholder="*********"
                      className="font-normal"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              isPending={isPending}
              text="Create Account"
              icon={ArrowRightIcon}
              className="w-full"
            />
          </form>
        </Form>

        <div className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
