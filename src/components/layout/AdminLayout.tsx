
import React from "react";
import {
  Laptop,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  Settings,
  BarChart,
  MessageSquare,
  FileText,
  Bell,
  Clock,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  const routes = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
      active: location.pathname === "/admin",
    },
    {
      label: "Products",
      icon: <Package className="h-5 w-5" />,
      href: "/admin/products",
      active: location.pathname.includes("/admin/products"),
    },
    {
      label: "Inventory",
      icon: <Warehouse className="h-5 w-5" />,
      href: "/admin/inventory",
      active: location.pathname.includes("/admin/inventory"),
    },
    {
      label: "Orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/admin/orders",
      active: location.pathname.includes("/admin/orders"),
    },
    {
      label: "Customers",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/customers",
      active: location.pathname.includes("/admin/customers"),
    },
    {
      label: "Analytics",
      icon: <BarChart className="h-5 w-5" />,
      href: "/admin/analytics",
      active: location.pathname.includes("/admin/analytics"),
    },
    {
      label: "Marketing",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/admin/marketing",
      active: location.pathname.includes("/admin/marketing"),
    },
    {
      label: "Reports",
      icon: <FileText className="h-5 w-5" />,
      href: "/admin/reports",
      active: location.pathname.includes("/admin/reports"),
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
      active: location.pathname.includes("/admin/settings"),
    },
  ];

  return (
    <div>
      {/* Mobile Navigation */}
      <div className="flex items-center p-4 border-b lg:hidden">
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <div className="p-6 flex items-center border-b">
              <h2 className="text-xl font-bold">Admin Dashboard</h2>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="my-4 h-[calc(100vh-10rem)] pb-10">
              <div className="flex flex-col gap-1 px-3">
                {routes.map((route) => (
                  <Link
                    key={route.label}
                    to={route.href}
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <span
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-all",
                        route.active && "bg-accent"
                      )}
                    >
                      {route.icon}
                      {route.label}
                    </span>
                  </Link>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t p-3">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/">
                  <Laptop className="mr-2 h-4 w-4" />
                  View Store
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="mx-auto font-bold">Admin Dashboard</div>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex h-screen w-64 flex-col fixed inset-y-0">
          <div className="flex h-14 items-center border-b px-4">
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold cursor-pointer"
            >
              <Package className="h-6 w-6" />
              <span className="text-xl font-bold">Tiffah</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm">
              {routes.map((route, i) => (
                <Link
                  key={i}
                  to={route.href}
                  className={`${
                    route.active
                      ? "bg-accent text-accent-foreground"
                      : "transparent"
                  } flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent text-sm transition-all`}
                >
                  {route.icon}
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t p-4">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <div className="rounded-full w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
                A
              </div>
              <div>
                <div className="text-sm font-medium">Admin User</div>
                <div className="text-xs text-muted-foreground">
                  admin@tiffahthrift.com
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-64 min-h-screen">
          <header className="hidden lg:flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
            <Link to="/" className="lg:hidden">
              <Package className="h-6 w-6" />
            </Link>
            <div className="w-full flex items-center gap-2 md:ml-auto md:gap-5">
              <Button variant="outline" size="icon" className="ml-auto">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Clock className="h-4 w-4" />
              </Button>
              <Link
                to="/"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Laptop className="h-4 w-4" />
                View Store
              </Link>
            </div>
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
