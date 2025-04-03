"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { Shield } from "lucide-react";
import { useTheme } from "next-themes";
import AlertMessage from "../AlertMessage";
import BackButton from "./BackButton";
import { newVerification } from "@/actions";

const TITLE = "Verifying your email";
const DESCRIPTION =
  "Please wait until we verify that this account belongs to you.";
const ERROR_MESSAGE = "Something went wrong. Please try again later.";

const MemoizedAlertMessage = memo(AlertMessage);
const MemoizedBackButton = memo(BackButton);

const useTokenVerification = (token) => {
  const [messageType, setMessageType] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    console.log("use effect called")

    if (!token) {
      setMessageType("error");
      setMessage("Please provide valid email verification token");
      setIsLoading(false);
      return;
    }

    newVerification(token)
      .then(({ type, message }) => {
        console.log("newVerification called")
        setMessageType(type);
        setMessage(message);
        console.log("type", type)
        console.log("message", message)
      })
      .catch((error) => {
        console.error(error);
        setMessageType("error");
        setMessage("Something went wrong. Please try again later.");
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  return { messageType, message, isLoading };
};

const EmailVerificationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { theme } = useTheme();

  const { messageType, message, isLoading } = useTokenVerification(token);

  useEffect(() => {
    if (!token) router.push("/error");
  }, [token, router]);

  if (!token) return null;

  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center mx-auto">
      <div className="mx-auto flex h-full flex-col justify-center items-center px-6 sm:px-0 gap-y-8 w-fit">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{TITLE}</h1>
          <p className="text-sm text-muted-foreground">{DESCRIPTION}</p>
        </div>
        <div className="flex items-center w-full justify-center h-10 ">
          {isLoading ? (
            <BeatLoader
              size={16}
              color={theme === "light" ? "white" : "black"}
            />
          ) : (
            <MemoizedAlertMessage type={messageType} message={message} />
          )}
        </div>
        <div className="text-center">
          <MemoizedBackButton label="Back to Login" href="/login" />
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
