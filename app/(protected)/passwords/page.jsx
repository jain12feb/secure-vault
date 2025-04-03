"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Copy,
  MoreHorizontal,
  Edit,
  Trash2,
  PlusCircle,
  Search,
  Filter,
  CalendarDays,
  ExternalLink,
  CheckCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { getDecryptedPassword } from "@/actions/passwordActions";
import { format } from "date-fns";
import { decryptPassword } from "@/lib/cryptoUtils";
import { cn, generateStrongPassword } from "@/lib/utils";
import { PasswordInput } from "@/components/ui/password-input";
import { debounce } from "lodash";
import PasswordEntryCardSkelton from "@/components/skeleton/password-entry-card-skeleton";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { useSearchParams } from "next/navigation";
import {
  useCategory,
  usePassword,
  useUserProfile,
} from "@/context-api/AppProvider";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Category is required"),
  notes: z.string().optional(),
});

export default function PasswordsPage() {
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isUsernameCopied, setIsUsernameCopied] = useState(false);
  const [isPasswordCopied, setIsPasswordCopied] = useState(false);

  const searchParams = useSearchParams();
  const editPasswordId = searchParams.get("edit");

  const { toast } = useToast();

  const {
    passwords,
    setPasswords,
    isPasswordsLoading,
    changePassword,
    removePassword,
    editingPassword,
    setEditingPassword,
    deletingPassword,
    setDeletingPassword,
    isPasswordDeleting,
    isPasswordUpdating,
  } = usePassword();

  const { categories, isCategoriesLoading } = useCategory();

  const { user } = useUserProfile();

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      title: "",
      username: "",
      password: "",
      url: "",
      categoryId: "",
      notes: "",
    },
  });

  const togglePasswordVisibility = async (passwordId) => {
    try {
    } catch (error) {}

    if (Object.keys(visiblePasswords).includes(passwordId)) {
      setVisiblePasswords((prev) => ({
        ...prev,
        [passwordId]: {
          showPassword: !prev[passwordId]?.showPassword,
          decryptedPassword: prev[passwordId]?.decryptedPassword,
        },
      }));
    } else {
      try {
        const { success, decryptedPassword, lastUsedAt, message } =
          await getDecryptedPassword(passwordId, user?.id);
        if (success) {
          setVisiblePasswords((prev) => ({
            ...prev,
            [passwordId]: {
              showPassword: !prev[passwordId]?.showPassword,
              decryptedPassword: decryptedPassword,
            },
          }));

          // 🔹 Update lastUsedAt in passwords state
          setPasswords((prevPasswords) =>
            prevPasswords.map((pwd) =>
              pwd.id === passwordId ? { ...pwd, lastUsedAt } : pwd
            )
          );
        } else {
          toast({
            title: "Error",
            description:
              message || "Failed to decrypt password. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.log("Error copying password:", error);
        toast({
          title: "Error",
          description:
            error.message || "Failed to copy password. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const copyToClipboard = async (text, type) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          variant: "success",
          title: "Copied to clipboard",
          description: `${type} has been copied to your clipboard.`,
        });
        if (type === "Username") {
          setIsUsernameCopied(true);
          setTimeout(() => {
            setIsUsernameCopied(false);
          }, 3000);
        } else {
          setIsPasswordCopied(true);
          setTimeout(() => {
            setIsPasswordCopied(false);
          }, 3000);
        }
      })
      .catch((error) => {
        console.log("Failed to copy to clipboard:", error);
        toast({
          variant: "error",
          title: "Failed to copy to clipboard",
          description: "Failed to copy to your clipboard. Please try again.",
        });
      });
  };

  const handleEdit = (password) => {
    setEditingPassword(password);
    form.reset({
      title: password.title,
      username: password.username,
      password: decryptPassword(password.password),
      url: password.url,
      categoryId: password.categoryId,
      notes: password.notes || "",
    });
  };

  const handleDelete = (id) => {
    setDeletingPassword(id);
  };

  const onSubmit = async (values) => {
    await changePassword(values);
    form.reset();
  };

  const filteredPasswords = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return passwords.filter(
      (password) =>
        password.title.toLowerCase().includes(query) ||
        password.notes.toLowerCase().includes(query) ||
        password.category.name.toLowerCase().includes(query)
    );
  }, [passwords, searchQuery]);

  const debouncedSetSearchQuery = useCallback(
    debounce((value) => setSearchQuery(value), 300),
    []
  );

  const generatePassword = () => {
    const password = generateStrongPassword();

    form.setValue("password", password);
    // checkPasswordStrength(password);
  };

  const checkPasswordStrength = (password) => {
    // Simple password strength checker
    let score = 0;

    if (password.length >= 12) {
      score += 25;
    } else if (password.length >= 8) {
      score += 15;
    }

    if (/[A-Z]/.test(password)) {
      score += 15;
    }

    if (/[a-z]/.test(password)) {
      score += 15;
    }

    if (/[0-9]/.test(password)) {
      score += 15;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 20;
    }

    // Check for common patterns
    if (/123|abc|qwerty|password|admin|welcome/i.test(password)) {
      score -= 20;
    }

    // Ensure score is between 0-100
    score = Math.max(0, Math.min(100, score));

    return score;
  };

  const getStrengthColor = () => {
    const passwordStrength = checkPasswordStrength(form.watch("password"));
    if (passwordStrength < 40) return "bg-destructive";
    if (passwordStrength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
    const passwordStrength = checkPasswordStrength(form.watch("password"));
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Moderate";
    return "Strong";
  };

  const passwordCopyHandler = async (passwordId) => {
    try {
      const isPasswordDecrypted = await getDecryptedPassword(
        passwordId,
        user?.id
      );
      if (isPasswordDecrypted.success) {
        copyToClipboard(isPasswordDecrypted.decryptedPassword, "Password");
      } else {
        toast({
          title: "Error",
          description:
            isPasswordDecrypted?.message ||
            "Failed to decrypt password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("Error copying password:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to copy password. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (editPasswordId) {
      const passwordToEdit = passwords.find((pwd) => pwd.id === editPasswordId);
      if (passwordToEdit) {
        setEditingPassword(passwordToEdit);
        form.reset({
          title: passwordToEdit.title,
          username: passwordToEdit.username,
          password: decryptPassword(passwordToEdit.password),
          url: passwordToEdit.url,
          categoryId: passwordToEdit.categoryId,
          notes: passwordToEdit.notes || "",
        });
      }
    }
  }, [editPasswordId, passwords]);

  // Auto-clear decrypted passwords after a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(visiblePasswords).length > 0) {
        setVisiblePasswords({});
        toast({
          title: "Decrypted password cleared",
          description: "All decrypted passwords have been cleared.",
        });
      }
    }, 60000); // Clear after 1 minute of inactivity

    return () => clearTimeout(timer);
  }, [visiblePasswords]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        document
          // .querySelector('input[placeholder="Search passwords..."]')
          .getElementById("password-search-input")
          .focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Passwords</h1>
          <p className="text-muted-foreground">
            Manage and organize all your passwords securely.
          </p>
        </div>
        <Button asChild>
          <Link href="/passwords/new">
            <PlusCircle />
           <span className="hidden sm:block">Add Password</span>
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between gap-2 w-full">
        <div className="relative flex-1 items-center max-w-sm">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password-search-input"
            placeholder="Press Ctrl + f to Search passwords..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 hover:bg-transparent"
              onClick={() => setSearchQuery("")}
            >
              <X onClick={() => setSearchQuery("")} className="h-4 w-4" />
              <span className="sr-only">Clear Search</span>
            </Button>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[14rem]">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSearchQuery("")}>
              All
            </DropdownMenuItem>
            {isCategoriesLoading ? (
              <Spinner size="small" />
            ) : (
              categories.length > 0 &&
              categories
                // .filter((category) => category.count > 0)
                .map(
                  (category) =>
                    category.count > 0 && (
                      <DropdownMenuItem
                        className="flex items-center justify-between w-full mx-auto"
                        key={category.id}
                        onClick={() =>
                          setSearchQuery(category.name.toLowerCase())
                        }
                      >
                        <p> {category.name} </p>
                        <p>{category.count}</p>
                      </DropdownMenuItem>
                    )
                )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isPasswordsLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from([1, 2]).map((item) => (
            <PasswordEntryCardSkelton key={item} />
          ))}
        </div>
      ) : filteredPasswords.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPasswords.map((password) => (
            <Suspense key={password.id} fallback={<PasswordEntryCardSkelton />}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{password.title}</CardTitle>
                    <Badge>{password.category.name}</Badge>
                  </div>
                  <CardDescription className="flex items-center truncate">
                    <Link
                      href={password.url}
                      target="_blank"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-1 cursor-pointer hover:text-black dark:hover:text-white" />
                      {password.url}
                    </Link>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Username</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">{password.username}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          copyToClipboard(password.username, "Username")
                        }
                      >
                        {isUsernameCopied ? (
                          <CheckCheck className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span className="sr-only">Copy username</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Password</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-mono">
                        {visiblePasswords[password.id]?.showPassword
                          ? visiblePasswords[password.id]?.decryptedPassword
                          : "••••••••••••"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => togglePasswordVisibility(password.id)}
                      >
                        {visiblePasswords[password.id]?.showPassword ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                        <span className="sr-only">
                          {visiblePasswords[password.id]?.showPassword
                            ? "Hide password"
                            : "Show password"}
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => passwordCopyHandler(password.id)}
                      >
                        {isPasswordCopied ? (
                          <CheckCheck className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span className="sr-only">Copy password</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between gap-1 w-full">
                    {/* <span className="text-sm font-medium">Notes</span> */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs w-full text-justify leading-tight">
                        {password.notes}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-muted-foreground w-full">
                    <div className="flex gap-1 items-center justify-start w-full text-xs">
                      <CalendarDays className="w-4 h-4" />{" "}
                      <p className="text-xs">
                        {format(password.updatedAt, "PPPPpppp")}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEdit(password)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Update</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(password.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            </Suspense>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground">
         <svg
      width="400px"
      height="400px"
      viewBox="0 0 24 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="#ccc" strokeWidth="1" fill="#f9f9f9" />
      <line x1="7" y1="12" x2="17" y2="12" stroke="#aaa" strokeWidth="1" strokeLinecap="round" />
      <line x1="12" y1="7" x2="12" y2="17" stroke="#aaa" strokeWidth="1" strokeLinecap="round" />
      <text x="12" y="30" fontSize="3" textAnchor="middle" fill="#777">
        No Password Entries Found
      </text>
    </svg>
        </div>
      )}

      <Dialog
        open={editingPassword !== null}
        onOpenChange={() => setEditingPassword(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingPassword ? "Edit Password" : "Add New Password"}
            </DialogTitle>
            <DialogDescription>
              {editingPassword
                ? "Update the details of your password entry."
                : "Add a new password to your vault."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-1/2">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} error={form.formState.errors.title} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-1/2">
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
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
                          {categories.length > 0 &&
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-1/2">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          error={form.formState.errors.username}
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
                    <FormItem className="w-full sm:w-1/2">
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input {...field} error={form.formState.errors.url} />
                      </FormControl>
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
                    <FormControl>
                      {/* <Input type="password" {...field} /> */}
                      <PasswordInput
                        {...field}
                        id="password"
                        placeholder="************"
                        error={form.formState.errors.password}
                      />
                    </FormControl>

                    {field.value && form.getFieldState("password").isDirty && (
                      <div className="flex items-center justify-between gap-2 w-full mx-auto">
                        <div className="space-y-2 w-full">
                          <div className="flex items-center gap-2 w-full">
                            <span
                              className={`text-sm text-white font-semibold rounded px-1 ${getStrengthColor()}`}
                            >
                              {getStrengthLabel()}
                            </span>
                            <Progress
                              value={checkPasswordStrength(
                                form.watch("password")
                              )}
                              className="h-3"
                              getStrengthColor={getStrengthColor}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="link"
                          onClick={generatePassword}
                          className="h-0"
                        >
                          {/* <RefreshCw className="mr-2 h-4 w-4" /> */}
                          Generate
                        </Button>
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
                        {...field}
                        error={form.formState.errors.notes}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Add any additional notes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingPassword(null)}
                >
                  Cancel
                </Button>

                <Button
                  disabled={
                    isPasswordUpdating ||
                    Object.keys(form.formState.errors).filter(
                      (e) => e != null
                    )[0]
                  }
                  type="submit"
                >
                  {isPasswordUpdating ? "Updating..." : "Update"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deletingPassword !== null}
        onOpenChange={() => setDeletingPassword(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this password? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingPassword(null)}
            >
              Cancel
            </Button>
            <Button
              disabled={isPasswordDeleting}
              type="submit"
              variant="destructive"
              onClick={() => removePassword(deletingPassword)}
            >
              {isPasswordDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
