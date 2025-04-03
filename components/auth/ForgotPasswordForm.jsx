"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import AlertMessage from "../AlertMessage";
import { useState, useTransition } from "react";
import { BeatLoader } from "react-spinners";
import { ArrowLeft, ArrowRightIcon, Shield } from "lucide-react";
import { ForgotPasswordSchema } from "@/schemas/forgot-password.schema";
import { forgotPassword } from "@/actions";
import { useRouter } from "next/navigation";
import LoadingButton from "../ui/loading-button";
import BackButton from "./BackButton";

const ForgotPasswordForm = () => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const [messageType, setMessageType] = useState("");
  const [message, setMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function handleLoginSubmit(values) {
    setMessage("");
    setMessageType("");

    startTransition(() => {
      forgotPassword(values)
        .then(({ type, message }) => {
          setMessage(message);
          setMessageType(type);
          form.reset();
        })
        .catch((error) => {
          console.log(error);
          setMessage("Something went wrong. Please try again!");
          setMessageType("error");
        });
    });
  }

  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center mx-auto">
      <div className="mx-auto flex flex-col justify-center px-6 sm:px-0 space-y-6 w-full sm:max-w-md">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot your password?
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sent password reset link.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleLoginSubmit)}
            className="space-y-6"
          >
            <div className="space-y-6">
              <FormField
                control={form.control.email}
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <AlertMessage type={messageType} message={message} />
            <LoadingButton
              isPending={isPending}
              text="Reset Password"
              icon={ArrowRightIcon}
              className="w-full"
            />
          </form>
        </Form>

        <div className="text-center">
          <BackButton label="Back to login" href="/login" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
