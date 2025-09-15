import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Lightbulb, 
  Bot, 
  ChartLine, 
  Construction, 
  DollarSign, 
  Gavel,
  CreditCard
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Idea Generation", href: "/ideas", icon: Lightbulb },
  { name: "AI Mentor", href: "/dashboard", icon: Bot }, // Links to dashboard for chat
  { name: "Market Analysis", href: "/market", icon: ChartLine },
  { name: "Learning Path", href: "/roadmap", icon: Construction },
  { name: "Funding", href: "/funding", icon: DollarSign },
  { name: "Legal", href: "/legal", icon: Gavel },
  { name: "Subscription", href: "/subscribe", icon: CreditCard },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-4 pt-8">
          <nav className="space-y-2" data-testid="sidebar-navigation">
            {navigation.map((item) => {
              const isActive = location === item.href || 
                (item.href === "/dashboard" && location === "/");
              
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
