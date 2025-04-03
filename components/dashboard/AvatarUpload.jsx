"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function AvatarUpload({ form }) {
  const [preview, setPreview] = useState(null);

  return (
    <FormField
      control={form.control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Image</FormLabel>
          <FormControl>
            <div className="relative w-full">
              <Input
                // id="image"
                type="file"
                // accept="image/*"
                // className={cn(
                //   "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                //   false && "ring-1 ring-destructive"
                // )}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                    field.onChange(e.target.files);// Ensures it works with react-hook-form
                  }
                }}
                // {...field}
              />
              {preview && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      //   size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-2 py-0.5 rounded"
                    >
                      Preview
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xs p-0">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full rounded-lg"
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
