"use client";

import React from "react";
import { Card, CardFooter, CardHeader } from "../ui/card";
import BackButton from "./BackButton";
import { OctagonAlert } from "lucide-react";

const ErrorCard = () => {
  return (
    <Card className="w-fit h-fit flex flex-col items-center justify-center my-auto shadow-md mx-auto border-none">
      <CardHeader>
        <div className="w-full flex flex-col gap-y-0 items-center justify-center">
          <div className="mb-2 flex items-center justify-center gap-x-3">
            <OctagonAlert color="red" size={32} />
            
          </div>
          <p className="text-muted-foreground text-sm">
              OOPs! Something went wrong. Please try again later.
            </p>
        </div>
      </CardHeader>
      <CardFooter>
        <BackButton label="Back to login" href="/login" />
      </CardFooter>
    </Card>
  );
};

export default ErrorCard;
