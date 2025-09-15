import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, ExternalLink, Clock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface RoadmapPhaseProps {
  phase: {
    id: string;
    phaseNumber: number;
    title: string;
    description: string;
    status: string;
    progressPercentage: string;
    milestones?: Array<{
      id: string;
      title: string;
      description: string;
      resourceType: string;
      resourceProvider: string;
      resourceUrl: string;
      estimatedHours: number;
      completed: boolean;
      order: number;
    }>;
  };
  onMilestoneComplete: () => void;
}

export default function RoadmapPhase({ phase, onMilestoneComplete }: RoadmapPhaseProps) {
  const { toast } = useToast();
  
  const completeMilestoneMutation = useMutation({
    mutationFn: async (milestoneId: string) => {
      const response = await apiRequest("POST", `/api/roadmaps/${phase.id}/milestone/${milestoneId}/complete`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Milestone Completed!",
        description: "Great job! You've completed another milestone.",
      });
      onMilestoneComplete();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to complete milestone. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-chart-2';
      case 'in_progress': return 'text-primary';
      case 'unlocked': return 'text-chart-3';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-chart-2 text-white">Completed</Badge>;
      case 'in_progress': return <Badge className="bg-primary text-primary-foreground">In Progress</Badge>;
      case 'unlocked': return <Badge className="bg-chart-3 text-white">Unlocked</Badge>;
      default: return <Badge variant="secondary">Locked</Badge>;
    }
  };

  const progress = parseFloat(phase.progressPercentage || "0");
  const sortedMilestones = phase.milestones?.sort((a, b) => a.order - b.order) || [];

  return (
    <Card className="p-6 shadow-lg" data-testid={`phase-${phase.phaseNumber}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">Phase {phase.phaseNumber}: {phase.title}</h3>
          <p className="text-muted-foreground">{phase.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            phase.status === 'completed' ? 'bg-chart-2' :
            phase.status === 'in_progress' ? 'bg-primary' :
            phase.status === 'unlocked' ? 'bg-chart-3' : 'bg-muted'
          }`} />
          {getStatusBadge(phase.status)}
        </div>
      </div>
      
      {phase.status !== 'locked' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {sortedMilestones.map((milestone) => (
              <div 
                key={milestone.id} 
                className={`flex items-start space-x-3 p-4 rounded-lg ${
                  milestone.completed ? 'bg-chart-2/5' : 'bg-muted/50'
                }`}
                data-testid={`milestone-${milestone.id}`}
              >
                <button
                  onClick={() => {
                    if (!milestone.completed) {
                      completeMilestoneMutation.mutate(milestone.id);
                    }
                  }}
                  disabled={milestone.completed || completeMilestoneMutation.isPending}
                  className="mt-1"
                >
                  {milestone.completed ? (
                    <CheckCircle className="w-6 h-6 text-chart-2" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
                  )}
                </button>
                <div className="flex-1">
                  <h4 className="font-medium">{milestone.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{milestone.resourceProvider}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{milestone.estimatedHours}h</span>
                      </div>
                    </div>
                    {milestone.resourceUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a 
                          href={milestone.resourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          data-testid={`link-resource-${milestone.id}`}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Phase Progress</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </>
      )}

      {phase.status === 'locked' && (
        <div className="text-center py-8">
          <Circle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Complete previous phases to unlock this section</p>
        </div>
      )}
    </Card>
  );
}
