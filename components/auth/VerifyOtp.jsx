"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, ArrowLeft, ArrowRightIcon } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import LoadingButton from "../ui/loading-button";
import BackButton from "./BackButton";

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

export default function OtpVerificationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [countdown, setCountdown] = useState(30);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const email = searchParams.get("email");

  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) =>
        prevCountdown > 0 ? prevCountdown - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  async function onSubmit(values) {
    setIsLoading(true);

    console.log("values", values);

    try {
      // In a real app, this would be an API call to verify the OTP
      // For demo purposes, we&apos;ll simulate a successful verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "OTP verified successfully!",
        description: "Your account has been activated.",
      });

      // Redirect to login page or dashboard
      router.push("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error verifying OTP",
        description:
          "There was a problem verifying your OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function resendOtp() {
    setIsLoading(true);

    try {
      // In a real app, this would be an API call to resend the OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "OTP resent successfully!",
        description: "Please check your email for the new OTP.",
      });

      setCountdown(30);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error resending OTP",
        description: "There was a problem resending the OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!email) return router.push("/error");

  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center mx-auto">
      <div className="mx-auto flex flex-col justify-center px-6 sm:px-0 space-y-6 w-full sm:max-w-sm">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Verify your Account
          </h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a 6-digit OTP to {email || "your account"}. Enter it
            below to verify your account.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col justify-center items-center w-full mx-auto"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password (OTP)</FormLabel>
                  {/* <FormControl>
                    <Input placeholder="123456" {...field} maxLength={6} />
                  </FormControl> */}
                  <FormControl className="flex justify-center items-center w-full mx-auto">
                    <InputOTP
                      maxLength={6}
                      {...field}
                      id="code"
                      pattern={REGEXP_ONLY_DIGITS}
                      size="lg"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                      </InputOTPGroup>

                      <InputOTPGroup>
                        <InputOTPSlot index={1} />
                      </InputOTPGroup>

                      <InputOTPGroup>
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>

                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>

                      <InputOTPGroup>
                        <InputOTPSlot index={4} />
                      </InputOTPGroup>

                      <InputOTPGroup>
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>

                    {/* <Input
                        {...field}
                        id="code"
                        type="text"
                        placeholder="000000"
                        className="font-normal"
                      /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              isPending={isPending}
              text="Verify OTP"
              icon={ArrowRightIcon}
            />
          </form>
        </Form>

        <div className="text-center -mt-2 w-full">
          <p className="text-sm text-muted-foreground w-full">
            Didn&apos;t receive the OTP?{" "}
            {countdown > 0 ? (
              <span>Resend in {countdown} seconds</span>
            ) : (
              <Button
                variant="link"
                className="p-0"
                onClick={resendOtp}
                disabled={isPending}
              >
                Resend OTP
              </Button>
            )}
          </p>
        </div>

        <div className="text-center">
          <BackButton label="Back to Login" href="/login" />
        </div>
      </div>
    </div>
  );
}
