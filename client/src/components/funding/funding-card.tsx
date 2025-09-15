import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Calendar, Star } from "lucide-react";

interface FundingCardProps {
  match: {
    id: string;
    matchScore: string;
    priority: string;
    funding: {
      id: string;
      name: string;
      description: string;
      type: string;
      stage: string;
      minAmount: string;
      maxAmount: string;
      equityRequired: string;
      location: string;
      applicationDeadline: string;
      website: string;
    };
  };
}

export default function FundingCard({ match }: FundingCardProps) {
  const { funding } = match;
  
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'border-primary bg-primary/5';
      case 'medium': return 'border-chart-3 bg-chart-3/5';
      default: return 'border-border';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return <Badge className="bg-primary text-primary-foreground">High Priority</Badge>;
      case 'medium': return <Badge className="bg-chart-3 text-white">Medium Priority</Badge>;
      default: return <Badge variant="secondary">Low Priority</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'accelerator': return '🚀';
      case 'vc': return '💼';
      case 'angel': return '👼';
      case 'grant': return '🎁';
      case 'crowdfunding': return '👥';
      default: return '💰';
    }
  };

  const formatAmount = (min: string, max: string) => {
    if (min && max) {
      return `$${min} - $${max}`;
    } else if (min) {
      return `From $${min}`;
    } else if (max) {
      return `Up to $${max}`;
    }
    return 'Amount varies';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <Card 
      className={`p-6 shadow-lg border-l-4 ${getPriorityColor(match.priority)}`}
      data-testid={`funding-card-${match.id}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{getTypeIcon(funding.type)}</span>
            <h4 className="text-xl font-semibold">{funding.name}</h4>
            {getPriorityBadge(match.priority)}
          </div>
          <p className="text-muted-foreground">{funding.description}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-lg font-bold text-primary">{match.matchScore}%</span>
          </div>
          <div className="text-xs text-muted-foreground">Match</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-sm text-muted-foreground">
            {funding.type === 'grant' ? 'Grant Amount' : 'Investment'}
          </div>
          <div className="font-semibold">{formatAmount(funding.minAmount, funding.maxAmount)}</div>
        </div>
        {funding.equityRequired && (
          <div>
            <div className="text-sm text-muted-foreground">Equity</div>
            <div className="font-semibold">{funding.equityRequired}%</div>
          </div>
        )}
        {funding.stage && (
          <div>
            <div className="text-sm text-muted-foreground">Stage</div>
            <div className="font-semibold">{funding.stage}</div>
          </div>
        )}
        {funding.applicationDeadline && (
          <div>
            <div className="text-sm text-muted-foreground">Deadline</div>
            <div className="font-semibold">{formatDate(funding.applicationDeadline)}</div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {funding.location && (
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{funding.location}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground capitalize">{funding.type}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {funding.website && (
            <Button variant="outline" size="sm" asChild>
              <a 
                href={funding.website} 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid={`button-learn-more-${match.id}`}
              >
                Learn More
              </a>
            </Button>
          )}
          <Button 
            size="sm"
            data-testid={`button-apply-${match.id}`}
          >
            {funding.type === 'accelerator' ? 'Apply Now' : 'Contact'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
