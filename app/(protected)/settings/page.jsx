"use client";

import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSidebarLayout } from "@/context-api/SidebarLayoutContext";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { sidebarLayout, setSidebarLayout } = useSidebarLayout();
  const {setTheme, theme} = useTheme()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable dark mode for a different visual experience.
              </p>
            </div>
            <Switch checked={theme === "dark" ? true : false} onCheckedChange={(val) => val ? setTheme("dark") : setTheme("light")} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Sidebar Layout</Label>
          <div className="flex flex-col lg:flex-row items-center justify-start w-full gap-4">
            <Card
              className={`cursor-pointer w-full ${
                sidebarLayout === "sidebar" ? "border-primary" : ""
              }`}
              onClick={() => {
                setSidebarLayout("sidebar");
                window.localStorage.setItem("sidebar:layout", "sidebar");
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-x-2">
                  Default
                  {sidebarLayout === "sidebar" && <Badge>Current</Badge>}
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
                sidebarLayout === "floating" ? "border-primary" : ""
              }`}
              onClick={() => {
                setSidebarLayout("floating");
                window.localStorage.setItem("sidebar:layout", "floating");
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-x-2">
                  Floating
                  {sidebarLayout === "floating" && <Badge>Current</Badge>}
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
          <p className="text-sm text-muted-foreground">
            Choose the layout style for your sidebar.
          </p>
        </div>
      </div>
      <div className=""></div>
    </div>
  );
}
