"use client";

import { Fragment, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ProfileSchema } from "@/schemas/profile.schema";
import LoadingButton from "@/components/ui/loading-button";
import { changePassword } from "@/actions/profile-actions";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronsUpDown, LoaderCircle, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import AvatarUpload from "./AvatarUpload";
import { useUserProfile } from "@/context-api/AppProvider";

export default function ProfilePage() {
  const { toast } = useToast();

  const [isSessionOpen, setIsSessionOpen] = useState(false);

  const [isProfileUpdating, startProfileUpdating] = useTransition();
  const [isPasswordUpdating, startPasswordUpdating] = useTransition();
  const [isTwoFactorUpdating, startTwoFactorUpdating] = useTransition();
  const [isAccountDeleting, startAccountDeleting] = useTransition();

  const {
    user,
    sessions,
    currentSession,
    updateProfileData,
    toggleTwoFactor,
    deleteUserAccount,
    updateUserRole,
  } = useUserProfile(); // Use context

  const form = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: user || {},
  });

  const onSubmit = async (data) => {
    if (!user) return;
    else startProfileUpdating(() => updateProfileData(data));
    // else console.log("data", data);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    startPasswordUpdating(() =>
      changePassword(data)
        .then((result) =>
          toast({
            variant: result.success ? "success" : "destructive",
            title: result.success
              ? "Password changed"
              : "Password change failed",
            description: result.message,
          })
        )
        .catch((error) =>
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "An error occurred",
          })
        )
    );
  };

  const handleTwoFactorToggle = async () => {
    startTwoFactorUpdating(() => toggleTwoFactor());
    // .then(() => setIsTwoFactorEnabled((prev) => !prev));
  };

  const handleDeleteAccount = async () => {
    startAccountDeleting(() => deleteUserAccount());
  };

  const handleRoleChange = async (newRole) => {
    await updateUserRole(newRole);
  };

  useEffect(() => {
    if (user) {
      form.reset(user);
      // setIsTwoFactorEnabled(user.isTwoFactorEnabled);
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Update your account information and preferences.
        </p>
      </div>

      <div className="flex flex-col justify-between w-full mx-auto gap-y-6">
        {/* Avatar Section */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-4">
              <Avatar className="h-48 w-48">
                <AvatarImage
                  src="/placeholder.svg?height=96&width=96"
                  alt="Profile picture"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Button onClick={handleAvatarChange} disabled={isLoading}>
                {isLoading ? "Updating Avatar..." : "Update Avatar"}
              </Button>
            </div>
          </CardContent>
        </Card> */}

        {/* Profile Form */}
        <div className="w-full flex flex-col sm:flex-row items-start justify-between gap-6 p-6 border rounded-lg">
          <div className="w-full sm:w-1/2 flex flex-col gap-y-1">
            <p>Profile Information</p>
            <span className="text-sm text-muted-foreground">
              This information will be displayed publicly so be careful what you
              share.
            </span>
          </div>
          <div className="w-full sm:w-1/2 flex items-center justify-end">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <AvatarUpload form={form} /> */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Bio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-end justify-end w-full">
                  <LoadingButton
                    text={isProfileUpdating ? "Saving..." : "Save Changes"}
                    isPending={isProfileUpdating}
                  />
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Password Change */}
        <div className="w-full flex flex-col sm:flex-row items-start justify-between gap-6 p-6 border rounded-lg">
          <div className="w-full sm:w-1/2 flex flex-col gap-y-1">
            <p>Change Password</p>
            <span className="text-sm text-muted-foreground">
              This information will be displayed publicly so be careful what you
              share.
            </span>
          </div>
          <div className="w-full sm:w-1/2 flex items-center justify-end">
            <form onSubmit={handleChangePassword} className="space-y-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Old Password</Label>
                <Input
                  name="oldPassword"
                  id="oldPassword"
                  placeholder="Old Password"
                  {...form.register("oldPassword")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  name="newPassword"
                  id="newPassword"
                  placeholder="New Password"
                  {...form.register("newPassword")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  {...form.register("confirmPassword")}
                />
              </div>

              <div className="flex items-end justify-end w-full">
                <LoadingButton
                  text={
                    isPasswordUpdating
                      ? "Updating Password..."
                      : "Update Password"
                  }
                  isPending={isPasswordUpdating}
                />
              </div>
            </form>
          </div>
        </div>

        {/* Two Factor Authentication */}
        <div className="w-full flex items-center justify-between gap-6 p-6 border rounded-lg">
          <div className="w-full flex flex-col gap-y-1">
            <p>Two-Factor Authentication</p>
            <span className="text-sm text-muted-foreground">
              Enable two-factor authentication for enhanced security.
            </span>
          </div>
          <div className="w-1/4 flex items-center justify-end">
            {isTwoFactorUpdating ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Switch
                checked={user?.isTwoFactorEnabled}
                onCheckedChange={handleTwoFactorToggle}
              />
            )}
          </div>
          {/* <RadioGroup defaultValue="comfortable">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="r1" />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="r1">You agree to our Terms of Service and Privacy Policy.</Label>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Comfortable</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor="r3">Compact</Label>
            </div>
          </RadioGroup> */}
          {/* <div className="items-top flex space-x-2 w-full max-w-md">
            <Checkbox id="terms1" />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
              <p className="text-sm text-muted-foreground">
                You agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div> */}
        </div>

        {/* Account Deletion */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 p-6 border rounded-lg">
          <div className="w-full sm:w-[85%] flex flex-col gap-y-1">
            <p>Delete Account</p>
            <span className="text-sm text-muted-foreground">
              No longer want to use our service? You can delete your account
              here. This action is not reversible. All information related to
              this account will be deleted permanently.
            </span>
          </div>
          <div className="w-full sm:w-[15%] flex items-center justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    and remove your account from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={handleDeleteAccount}
                  >
                    {isAccountDeleting ? (
                      <LoaderCircle color="white" className="animate-spin" />
                    ) : (
                      "Continue"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Role Change */}
        {/* <div className="w-full flex items-center justify-between gap-6 p-6 border rounded-lg">
          <div className="w-3/4 flex flex-col gap-y-1">
            <p>Change Role</p>
          </div>
          <div className="w-1/4 flex items-center justify-end">
            <Select onValueChange={handleRoleChange} defaultValue={user?.role}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select User&apos;s Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>User&apos;s Role</SelectLabel>
                  <SelectItem value="USER">USER</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div> */}

        {/* All Sessions */}
        {/* <div className="w-full flex flex-col items-start gap-6 p-6 border rounded-lg">
          <Collapsible
            open={isSessionOpen}
            onOpenChange={setIsSessionOpen}
            className="space-y-2 w-full"
          >
            <div className="flex items-center justify-between space-x-4 mb-3">
              <div className="w-full flex flex-col gap-y-1">
                <p>Login Sessions</p>
              </div>
              {sessions?.length > 1 && (
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="px-3">
                    <span>{isSessionOpen ? "Hide" : "Show"}</span>
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              )}
            </div>
            {sessions?.length > 0 && (
              <>
                <div className="font-mono">
                  {sessions
                    .filter(
                      (session) => session.sessionToken === currentSession
                    )
                    .map((session, index) => (
                      <div
                        key={index}
                        className="font-mono flex flex-col sm:flex-row items-start justify-between gap-3 w-full mx-auto"
                      >
                        <div className="">
                          <div className="flex flex-col-reverse sm:flex-row items-start w-full gap-3">
                            <p className="text-sm">
                              ID: {session.sessionToken}
                            </p>
                            <Badge>Current</Badge>
                          </div>
                          <p className="text-xs">
                            Expires:{" "}
                            {new Date(session.expires).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full sm:w-fit"
                        >
                          <span className="">Logout All Devices</span>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
                {sessions?.length > 1 && (
                  <CollapsibleContent className="">
                    {sessions
                      .filter(
                        (session) => session.sessionToken !== currentSession
                      )
                      .map((session, index) => (
                        <Fragment key={index}>
                          <Separator className="my-6" />
                          <div className="font-mono flex flex-col sm:flex-row items-start justify-between gap-3 w-full mx-auto">
                            <div className="">
                              <div className="flex items-center w-full gap-x-3">
                                <p className="text-sm">
                                  ID: {session.sessionToken}
                                </p>
                              </div>
                              <p className="text-xs">
                                Expires:{" "}
                                {new Date(session.expires).toLocaleString()}
                              </p>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full sm:w-fit"
                            >
                              <span className="">Terminate</span>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </Fragment>
                      ))}
                  </CollapsibleContent>
                )}
              </>
            )}
          </Collapsible>
        </div> */}
      </div>
    </div>
  );
}
