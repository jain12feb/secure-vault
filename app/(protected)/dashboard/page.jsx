import DashboardPage from "@/pages/DashboardPage";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your password vault.
        </p>
      </div>

      <DashboardPage />
    </div>
  );
}
