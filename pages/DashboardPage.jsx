"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  Key,
  Tag,
} from "lucide-react";
import { Fragment } from "react";
// import { usePassword } from "@/context-api/PasswordContext";
// import { useCategory } from "@/context-api/CategoryContext";
import { formatDistanceToNow } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useCategory, usePassword } from "@/context-api/AppProvider";

const DashboardPage = () => {
  const {
    passwords,
    isPasswordsLoading,
    weakPasswordsCount,
    passwordHealth,
    weakPasswords,
  } = usePassword();
  const { categories, isCategoriesLoading } = useCategory();

  const router = useRouter();

  const securityAlerts = [
    ...weakPasswords.map((password) => ({
      type: "warning",
      title: "Weak Password Detected",
      description: `Your password for ${password.title} is weak and should be updated.`,
      icon: AlertTriangle,
      passwordId: password.id, // Store password ID for linking
    })),
  ];

  // Mock data for dashboard
  const stats = [
    {
      title: "Total Passwords",
      icon: Key,
      value: passwords.length,
      isLoading: isPasswordsLoading,
    },
    {
      title: "Categories",
      icon: Tag,
      value: categories.length,
      isLoading: isCategoriesLoading,
    },
    {
      title: "Weak Passwords",
      icon: null,
      isLoading: false,
      value: weakPasswordsCount,
    },
    {
      title: "Password Health",
      icon: null,
      isLoading: false,
      value: passwordHealth,
    },
  ];

  const recentPasswords = [...passwords]
    .filter((pwd) => pwd.lastUsedAt) // Ensure passwords with lastUsedAt exist
    .sort((a, b) => new Date(b.lastUsedAt) - new Date(a.lastUsedAt)); // Sort in descending order

  //   console.log("recentPasswordss", recentPasswordss);

  //   const recentPasswords = [
  //     {
  //       title: "Gmail",
  //       username: "john.doe@gmail.com",
  //       category: "Email",
  //       lastUpdated: "2 days ago",
  //     },
  //     {
  //       title: "Netflix",
  //       username: "johndoe",
  //       category: "Entertainment",
  //       lastUpdated: "1 week ago",
  //     },
  //     {
  //       title: "GitHub",
  //       username: "johndoe",
  //       category: "Development",
  //       lastUpdated: "3 days ago",
  //     },
  //     {
  //       title: "Amazon",
  //       username: "john.doe@gmail.com",
  //       category: "Shopping",
  //       lastUpdated: "5 days ago",
  //     },
  //   ];

  //   const securityAlerts = [
  //     {
  //       type: "warning",
  //       title: "Weak Password",
  //       description: "Your Netflix password is weak and should be updated.",
  //       icon: AlertTriangle,
  //     },
  //     {
  //       type: "success",
  //       title: "Password Updated",
  //       description: "Your GitHub password was successfully updated.",
  //       icon: CheckCircle,
  //     },
  //     {
  //       type: "info",
  //       title: "Password Expiring",
  //       description: "Your work email password will expire in 5 days.",
  //       icon: Clock,
  //     },
  //   ];

  return (
    <Fragment>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon ? (
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Shield className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              {stat.isLoading ? (
                <Loader2 className="animate-spin text-primary size-6" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* recent used passwords */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Used Passwords</CardTitle>
            <CardDescription>
              Your recently used passwords are below
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPasswordsLoading ? (
              <Spinner size="small" />
            ) : recentPasswords.length > 0 ? (
              <div className="space-y-4">
                {recentPasswords.map((password) => (
                  <div
                    key={password.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {password.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {password.username}
                      </p>
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                      <div><Badge>{password.category?.name}</Badge></div>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(password.updatedAt, {
                          includeSeconds: true,
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Show No Recent Passwords UI
              <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                <Key  className="w-16 h-16 text-gray-400" />
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg> */}
                <p className="mt-3 text-sm">No recent passwords used yet. 🚀</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* security alerts */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Security Alerts</CardTitle>
            <CardDescription>
              Important notifications about your passwords
            </CardDescription>
          </CardHeader>
          <CardContent>
            {securityAlerts.length > 0 ? (
              <div className="space-y-4">
                {securityAlerts.map((alert, index) => (
                  <Alert
                    key={index}
                    variant={
                      alert.type === "warning" ? "destructive" : "default"
                    }
                    onClick={() => {
                      router.push(`/passwords?edit=${alert.passwordId}`);
                    }}
                    className="cursor-pointer"
                  >
                    <alert.icon className="h-4 w-4" />
                    <AlertTitle>{alert.title}</AlertTitle>
                    <AlertDescription>{alert.description}</AlertDescription>
                  </Alert>
                ))}
              </div>
            ) : (
              // Show No Security Alerts UI
              <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                <p className="mt-3 text-sm">
                  No Security Alerts! Your passwords are safe. 🔒
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Fragment>
  );
};

export default DashboardPage;
