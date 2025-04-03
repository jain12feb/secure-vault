"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  RefreshCw,
  Check,
  X,
  AlertTriangle,
  MoveLeft,
  Plus,
} from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { cn, generateStrongPassword } from "@/lib/utils";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { useCategory, usePassword } from "@/context-api/AppProvider";

const passwordSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  url: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  categoryId: z.string().min(1, { message: "Category is required" }),
  notes: z.string().optional(),
});

export default function NewPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState({
    score: 0,
    feedback: [],
  });
  const router = useRouter();

  const { addPassword } = usePassword();

  const { categories, isCategoriesLoading } = useCategory();

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      title: "",
      username: "",
      password: "",
      url: "",
      categoryId: "",
      notes: "",
    },
    mode: "all",
  });

  const generatePassword = () => {
    const password = generateStrongPassword();

    form.setValue("password", password);
    checkPasswordStrength(password);

    return password;
  };

  const checkPasswordStrength = (password) => {
    // Simple password strength checker
    let score = 0;
    const feedback = [];

    if (password.length >= 12) {
      score += 25;
    } else if (password.length >= 8) {
      score += 15;
    } else {
      feedback.push("Password is too short");
    }

    if (/[A-Z]/.test(password)) {
      score += 15;
    } else {
      feedback.push("Add uppercase letters");
    }

    if (/[a-z]/.test(password)) {
      score += 15;
    } else {
      feedback.push("Add lowercase letters");
    }

    if (/[0-9]/.test(password)) {
      score += 15;
    } else {
      feedback.push("Add numbers");
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 20;
    } else {
      feedback.push("Add special characters");
    }

    // Check for common patterns
    if (/123|abc|qwerty|password|admin|welcome/i.test(password)) {
      score -= 30;
      feedback.push("Avoid common patterns");
    }

    // Ensure score is between 0-100
    score = Math.max(0, Math.min(100, score));

    setPasswordStrength(score);
    setPasswordFeedback({
      score: score < 40 ? 0 : score < 70 ? 1 : 2,
      feedback: feedback,
    });
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-destructive";
    if (passwordStrength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Moderate";
    return "Strong";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => router.back()}
        >
          <MoveLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Add New Password
          </h1>
          <p className="text-muted-foreground">
            Create a new password entry in your vault
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(addPassword)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(
                        form.formState.errors.title && "ring-1 ring-destructive"
                      )}
                      placeholder="e.g. Gmail, Facebook, Bank"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-10",
                          form.formState.errors.categoryId &&
                            "ring-1 ring-destructive"
                        )}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isCategoriesLoading ? (
                        <Spinner size="small" />
                      ) : (
                        categories.length > 0 &&
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                      {/* </SelectContent> */}
                      <SelectSeparator />
                      {/* <SelectContent> */}
                      <Link
                        href="/categories"
                        className="relative mt-1 flex gap-2 w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-4 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Category</span>
                      </Link>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username / Email</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(
                        form.formState.errors.username &&
                          "ring-1 ring-destructive"
                      )}
                      placeholder="username or email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(
                        form.formState.errors.url && "ring-1 ring-destructive"
                      )}
                      placeholder="https://example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Enter the website address
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <div className="relative flex-1">
                      <Input
                        className={cn(
                          form.formState.errors.password &&
                            "ring-1 ring-destructive"
                        )}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          checkPasswordStrength(e.target.value);
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generatePassword}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                </div>

                {field.value && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm text-white font-semibold rounded px-1 ${getStrengthColor()}`}
                      >
                        {getStrengthLabel()}
                      </span>
                      <Progress
                        value={passwordStrength}
                        className="h-3"
                        getStrengthColor={getStrengthColor}
                      />
                    </div>

                    {passwordFeedback.feedback.length > 0 && (
                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            {passwordFeedback.score === 0 ? (
                              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                            ) : passwordFeedback.score === 1 ? (
                              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                            ) : (
                              <Check className="h-4 w-4 text-green-500 mt-0.5" />
                            )}
                            <div className="text-sm">
                              <p className="font-medium">Password strength:</p>
                              <ul className="mt-1 space-y-1">
                                {passwordFeedback.feedback.map(
                                  (item, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center gap-1"
                                    >
                                      <X className="h-3 w-3 text-destructive" />
                                      <span>{item}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any additional information about this password"
                    className={cn(
                      "min-h-[100px]",
                      form.formState.errors.notes && "ring-1 ring-destructive"
                    )}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional: Add notes or recovery information
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit">Save Password</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
