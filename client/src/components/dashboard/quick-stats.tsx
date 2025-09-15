import { Card } from "@/components/ui/card";
import { Lightbulb, ChartLine, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function QuickStats() {
  const { data: businessIdeas = [] } = useQuery({
    queryKey: ["/api/business-ideas"],
  });

  const { data: badges = [] } = useQuery({
    queryKey: ["/api/badges"],
  });

  const { data: fundingMatches = [] } = useQuery({
    queryKey: ["/api/funding"],
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="quick-stats">
      <Card className="p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Ideas Generated</h4>
          <Lightbulb className="h-5 w-5 text-primary" />
        </div>
        <div className="text-2xl font-bold text-primary" data-testid="stat-ideas">
          {businessIdeas.length}
        </div>
        <p className="text-sm text-muted-foreground">Total business ideas</p>
      </Card>
      
      <Card className="p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Badges Earned</h4>
          <ChartLine className="h-5 w-5 text-chart-2" />
        </div>
        <div className="text-2xl font-bold text-chart-2" data-testid="stat-badges">
          {badges.length}
        </div>
        <p className="text-sm text-muted-foreground">Achievement badges</p>
      </Card>
      
      <Card className="p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Funding Matches</h4>
          <DollarSign className="h-5 w-5 text-chart-3" />
        </div>
        <div className="text-2xl font-bold text-chart-3" data-testid="stat-funding">
          {fundingMatches.length}
        </div>
        <p className="text-sm text-muted-foreground">Opportunities found</p>
      </Card>
    </div>
  );
}
