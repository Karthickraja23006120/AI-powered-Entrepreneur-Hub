import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { User } from "@shared/schema";

interface WelcomeSectionProps {
  user: User | null;
}

export default function WelcomeSection({ user }: WelcomeSectionProps) {
  const userName = user?.firstName || "there";

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-accent/10 p-6" data-testid="welcome-section">
      <h3 className="text-xl font-semibold mb-2">Welcome back, {userName}!</h3>
      <p className="text-muted-foreground mb-4">
        Ready to take your business to the next level? Check out your personalized recommendations.
      </p>
      <Button data-testid="button-view-progress">
        View Progress
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Card>
  );
}
