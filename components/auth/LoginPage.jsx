"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import AlertMessage from "../AlertMessage";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BeatLoader } from "react-spinners";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { PasswordInput } from "../ui/password-input";
import { LoginSchema } from "@/schemas/login.schema";
import {
  generateTwoFactorAuthenticationCode,
  login,
  resendTwoFactorAuthenticationCode,
} from "@/actions";
import { ArrowRightIcon, Shield, X } from "lucide-react";
import { useToast } from "../ui/use-toast";
import LoadingButton from "../ui/loading-button";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [isPending2, startTransition2] = useTransition();

  const [countdown, setCountdown] = useState(30);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [message, setMessage] = useState("");
  const [otpResentCount, setOtpResentCount] = useState(0);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const callbackUrl = searchParams.get("callbackUrl");

  const urlError = useMemo(() => {
    const errorName = searchParams?.get("error");

    switch (errorName) {
      case "OAuthAccountNotLinked":
        return {
          type: "error",
          message: "Email already used with different provider",
        };
      case "OAuthCallbackError":
        return { type: "error", message: "OAuth Provider returned an error" };
      default:
        return {};
    }
  }, [searchParams]);

  // const urlError = (function searchParamsError() {
  //   const errorName = searchParams?.get("error");

  //   switch (errorName) {
  //     case "OAuthAccountNotLinked":
  //       return {
  //         type: "error",
  //         message: "Email already used with different provider",
  //       };
  //     case "OAuthCallbackError":
  //       return {
  //         type: "error",
  //         message: "OAuth Provider returned an error",
  //       };

  //     default:
  //       return {};
  //   }
  // })();

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleLoginSubmit(values) {
    setMessage("");
    setMessageType("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data.success && data?.redirectUrl) {
            form.reset();
            toast({
              title: "Login Successful",
              description: data?.message,
            });
            router.push(data?.redirectUrl);
          } else if (data.success && data?.twofactor) {
            setMessage(data?.message);
            setMessageType(data?.type);
            setShowTwoFactor(true);
            startCountdown();
            form.reset({
              email: values?.email,
              password: values?.password,
              code: "",
            });
          } else if (data?.path === "2fa" && data?.twofactor) {
            setMessage(data?.message);
            setMessageType(data?.type);
            setShowTwoFactor(true);
            form.reset({
              email: values?.email,
              password: values?.password,
              code: "",
            });
          } else {
            setMessage(data?.message);
            setMessageType(data?.type);
          }
        })
        .catch((error) => {
          console.log(error);
          setMessage("Something went wrong. Please try again!");
          setMessageType("error");
        });
    });
  }

  async function resendOtp() {
    setMessage("");
    setMessageType("");

    if (otpResentCount >= 2) {
      // setOtpResentCount(0);
      setMessage("Maximum OTP resends reached. Please try again later.");
      setMessageType("error");
      return;
    } else {
      const email = form.getValues("email");

      startTransition2(() => {
        resendTwoFactorAuthenticationCode(email)
          .then(({ success, message }) => {
            if (success) {
              setMessage(message);
              setMessageType("success");
              // toast({
              //   title: "OTP resent successfully!",
              //   description: message,
              // });
              setCountdown(30);
              setOtpResentCount((prev) => prev + 1);
            }
          })
          .catch((error) => {
            console.log(error);
            setMessage(
              "There was a problem resending the OTP. Please try again."
            );
            setMessageType("error");
            // toast({
            //   variant: "destructive",
            //   title: "Error resending OTP",
            //   description:
            //     "There was a problem resending the OTP. Please try again.",
            // });
          });
      });
    }
  }
  const startCountdown = useCallback(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) =>
        prevCountdown > 0 ? prevCountdown - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (searchParams?.error) {
      setMessageType("error");
      setMessage("Account already exists");
    }
  }, [searchParams]);

  return (
    // <CardWrapper
    //   headerLabel="Sign in your account"
    //   backButtonLabel="Don&apos;t have an account?"
    //   backButtonHref="/register"
    //   showSocial={!showTwoFactor}
    // >
    <div className="container flex min-h-screen w-full flex-col items-center justify-center mx-auto">
      <div className="mx-auto flex flex-col justify-center px-6 sm:px-0 space-y-6 w-full sm:max-w-md">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to access your vault
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleLoginSubmit)}
            className="space-y-3"
          >
            <div className="space-y-4">
              {showTwoFactor && (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col justify-center items-center gap-y-2">
                        <FormLabel htmlFor="code">
                          Authentication Code
                        </FormLabel>
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
                        <FormDescription>
                          Please enter the two factor code sent to your email.
                        </FormDescription>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!showTwoFactor && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="email"
                            type="email"
                            placeholder="john.dae@example.com"
                            className="font-normal"
                            tabIndex={1}
                          />
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
                        <div className="flex items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          <Link
                            href="/forgot-password"
                            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <FormControl>
                          <PasswordInput
                            {...field}
                            id="password"
                            placeholder="*********"
                            tabIndex={1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
            <AlertMessage
              type={messageType || urlError?.type}
              message={message || urlError?.message}
            />
            {/* {showTwoFactor &&
              isGenerate2faCode &&
              isGenerate2faCode?.isGenerate && (
                <LoadingButton
                  type="button"
                  isPending={isPending2}
                  text="Request new code"
                  icon={ArrowRightIcon}
                  onClick={resendOtp}
                />
              )} */}

            <LoadingButton
              isPending={isPending}
              text={showTwoFactor ? "Confirm" : "Get Started"}
              icon={ArrowRightIcon}
              className="w-full"
              tabIndex={3}
            />
          </form>
        </Form>

        {showTwoFactor ? (
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
                  disabled={isPending2}
                >
                  Resend OTP
                </Button>
              )}
            </p>
          </div>
        ) : (
          <div className="px-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
