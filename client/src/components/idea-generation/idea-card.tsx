import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartLine, Star } from "lucide-react";

interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    description: string;
    industry: string;
    businessModel: string;
    targetMarket: string;
    matchScore: string;
    marketSize: string;
    competitionLevel: string;
  };
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const getCompetitionColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'text-chart-2';
      case 'medium': return 'text-chart-3';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getMatchScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 8) return 'text-chart-2';
    if (numScore >= 6) return 'text-chart-3';
    return 'text-chart-1';
  };

  return (
    <Card className="p-6 shadow-lg" data-testid={`idea-card-${idea.id}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-xl font-semibold mb-2">{idea.title}</h4>
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {idea.industry}
            </Badge>
            <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
              {idea.businessModel}
            </Badge>
            <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">
              {idea.targetMarket}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${getMatchScoreColor(idea.matchScore)}`}>
            <Star className="inline h-4 w-4 mr-1" />
            {idea.matchScore}/10
          </div>
          <div className="text-xs text-muted-foreground">Match Score</div>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-4">{idea.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground">Market Size</div>
          <div className="text-lg font-semibold">{idea.marketSize}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">Competition</div>
          <div className={`text-lg font-semibold ${getCompetitionColor(idea.competitionLevel)}`}>
            {idea.competitionLevel}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" data-testid={`button-analyze-${idea.id}`}>
          <ChartLine className="mr-1 h-4 w-4" />
          View Analysis
        </Button>
        <Button size="sm" data-testid={`button-develop-${idea.id}`}>
          Develop This Idea
        </Button>
      </div>
    </Card>
  );
}
