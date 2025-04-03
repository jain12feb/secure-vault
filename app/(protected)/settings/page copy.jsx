"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSidebarLayout } from "@/context-api/SidebarLayoutContext";
import { Badge } from "@/components/ui/badge";

const settingsFormSchema = z.object({
  // twoFactorAuth: z.boolean().default(false),
  // passwordStrength: z.enum(["low", "medium", "high"]),
  // sessionTimeout: z.number().min(5).max(60),
  darkMode: z.boolean().default(false),
  sidebarLayout: z.enum(["sidebar", "floating"]),
});

export default function SettingsPage() {
  const { sidebarLayout, setSidebarLayout } = useSidebarLayout();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      // twoFactorAuth: false,
      // passwordStrength: "medium",
      // sessionTimeout: 30,
      darkMode: false,
      sidebarLayout: null,
    },
  });

  function onSubmit(data) {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log(data);
      toast({
        title: "Settings updated",
        description: "Your settings have been successfully updated.",
      });
    }, 1000);
  }

  useEffect(() => {
    form.setValue(
      "sidebarLayout",
      // window.localStorage.getItem("sidebar:layout") || "sidebar"
      sidebarLayout
    );
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* <FormField
            control={form.control}
            name="twoFactorAuth"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Two-factor Authentication
                  </FormLabel>
                  <FormDescription>
                    Enable two-factor authentication for enhanced security.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          /> */}
          {/* <FormField
            control={form.control}
            name="passwordStrength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Strength Requirement</FormLabel>
                <FormControl>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...field}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </FormControl>
                <FormDescription>
                  Set the minimum strength required for new passwords.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sessionTimeout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Timeout (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number.parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormDescription>
                  Set the duration of inactivity before automatic logout (5-60
                  minutes).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="darkMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Dark Mode</FormLabel>
                  <FormDescription>
                    Enable dark mode for a different visual experience.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sidebarLayout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sidebar Layout</FormLabel>
                <FormControl>
                  <div className="flex flex-col lg:flex-row items-center justify-start w-full gap-4">
                    <Card
                      className={`cursor-pointer w-full ${
                        field.value === "sidebar" ? "border-primary" : ""
                      }`}
                      onClick={() => {
                        field.onChange("sidebar");
                        setSidebarLayout("sidebar");
                        window.localStorage.setItem(
                          "sidebar:layout",
                          "sidebar"
                        );
                      }}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-x-2">
                          Default{" "}
                          {field.value === "sidebar" && <Badge>Current</Badge>}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-56 flex items-center justify-center rounded-lg w-full">
                          <div className="w-28 h-full bg-primary/20 rounded-lg rounded-tr-none rounded-br-none">
                            <div className="flex flex-col justify-center w-full gap-y-2">
                              <div className="w-fit mx-auto my-2 text-xs">
                                Secure Vault
                              </div>
                              <div className="ml-2 flex items-center w-full gap-x-1">
                                <div className="bg-muted h-1 w-1" />
                                <div className="bg-muted h-1 w-10" />
                              </div>
                              <div className="ml-2 flex items-center w-full gap-x-1">
                                <div className="bg-muted h-1 w-1" />
                                <div className="bg-muted h-1 w-16" />
                              </div>
                              <div className="ml-2 flex items-center w-full gap-x-1">
                                <div className="bg-muted h-1 w-1" />
                                <div className="bg-muted h-1 w-14" />
                              </div>
                              <div className="ml-2 flex items-center w-full gap-x-1">
                                <div className="bg-muted h-1 w-1" />
                                <div className="bg-muted h-1 w-12" />
                              </div>
                              <div className="ml-2 flex items-center w-full gap-x-1">
                                <div className="bg-muted h-1 w-1" />
                                <div className="bg-muted h-1 w-20" />
                              </div>
                              <div className="ml-2 flex items-center w-full gap-x-1">
                                <div className="bg-muted h-1 w-1" />
                                <div className="bg-muted h-1 w-8" />
                              </div>
                            </div>
                          </div>
                          <div className="w-3/4 h-full bg-muted bg-stripes rounded-lg rounded-tl-none rounded-bl-none"></div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card
                      className={`cursor-pointer w-full ${
                        field.value === "floating" ? "border-primary" : ""
                      }`}
                      onClick={() => {
                        field.onChange("floating");
                        setSidebarLayout("floating");
                        window.localStorage.setItem(
                          "sidebar:layout",
                          "floating"
                        );
                      }}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-x-2">
                          Floating{" "}
                          {field.value === "floating" && <Badge>Current</Badge>}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-56 border flex items-center justify-center rounded-lg w-full">
                          <div className="rounded-lg rounded-tr-none rounded-br-none border-r-0">
                            <div className="w-28 h-52 mx-2 bg-primary/20 rounded">
                              <div className="flex flex-col justify-center w-full gap-y-2">
                                <div className="w-fit mx-auto my-2 text-xs">
                                  Secure Vault
                                </div>
                                <div className="ml-2 flex items-center w-full gap-x-1">
                                  <div className="bg-muted h-1 w-1" />
                                  <div className="bg-muted h-1 w-10" />
                                </div>
                                <div className="ml-2 flex items-center w-full gap-x-1">
                                  <div className="bg-muted h-1 w-1" />
                                  <div className="bg-muted h-1 w-16" />
                                </div>
                                <div className="ml-2 flex items-center w-full gap-x-1">
                                  <div className="bg-muted h-1 w-1" />
                                  <div className="bg-muted h-1 w-14" />
                                </div>
                                <div className="ml-2 flex items-center w-full gap-x-1">
                                  <div className="bg-muted h-1 w-1" />
                                  <div className="bg-muted h-1 w-12" />
                                </div>
                                <div className="ml-2 flex items-center w-full gap-x-1">
                                  <div className="bg-muted h-1 w-1" />
                                  <div className="bg-muted h-1 w-20" />
                                </div>
                                <div className="ml-2 flex items-center w-full gap-x-1">
                                  <div className="bg-muted h-1 w-1" />
                                  <div className="bg-muted h-1 w-8" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-3/4 h-full bg-muted bg-stripes rounded-lg rounded-tl-none rounded-bl-none" />
                          {/* <div className="w-full h-full bg-background p-2">
                            <div className="bg-muted border rounded h-full w-full bg-stripes"></div>
                          </div> */}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </FormControl>
                <FormDescription>
                  Choose the layout style for your sidebar.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </Form>
      <div className=""></div>
    </div>
  );
}
