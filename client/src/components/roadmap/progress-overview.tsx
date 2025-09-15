import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Medal, Clock, Target, CheckCircle } from "lucide-react";

interface ProgressOverviewProps {
  roadmap: {
    id: string;
    title: string;
    progressPercentage: string;
    currentPhase: number;
    totalPhases: number;
    estimatedDuration: string;
    phases?: Array<{
      id: string;
      status: string;
      milestones?: Array<{
        id: string;
        completed: boolean;
      }>;
    }>;
  };
}

export default function ProgressOverview({ roadmap }: ProgressOverviewProps) {
  const progress = parseFloat(roadmap.progressPercentage || "0");
  const completedMilestones = roadmap.phases?.reduce((total, phase) => {
    return total + (phase.milestones?.filter(m => m.completed).length || 0);
  }, 0) || 0;
  
  const totalMilestones = roadmap.phases?.reduce((total, phase) => {
    return total + (phase.milestones?.length || 0);
  }, 0) || 0;

  // Calculate estimated hours invested (mock calculation)
  const hoursInvested = Math.floor((completedMilestones / Math.max(totalMilestones, 1)) * 50);

  return (
    <Card className="p-6 shadow-lg sticky top-8" data-testid="progress-overview">
      <h3 className="text-lg font-semibold mb-4">Progress Overview</h3>
      
      {/* Progress Ring */}
      <div className="text-center mb-6">
        <div className="relative w-24 h-24 mx-auto">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
            <path 
              className="text-muted stroke-current stroke-2 fill-none" 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
            />
            <path 
              className="text-primary stroke-current stroke-2 fill-none" 
              strokeDasharray={`${progress}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">{Math.round(progress)}%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Overall Progress</p>
      </div>
      
      {/* Stats */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-chart-2" />
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <span className="font-semibold">{completedMilestones}/{totalMilestones}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-chart-3" />
            <span className="text-sm text-muted-foreground">Time Invested</span>
          </div>
          <span className="font-semibold">{hoursInvested}h</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Current Phase</span>
          </div>
          <span className="font-semibold">{roadmap.currentPhase}/{roadmap.totalPhases}</span>
        </div>
        {roadmap.estimatedDuration && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Est. Duration</span>
            <span className="font-semibold">{roadmap.estimatedDuration}</span>
          </div>
        )}
      </div>
      
      {/* Badges */}
      <div>
        <h4 className="text-sm font-medium mb-3">Earned Badges</h4>
        <div className="grid grid-cols-3 gap-2">
          {progress >= 25 && (
            <div className="bg-primary/10 rounded-lg p-2 text-center">
              <Star className="h-5 w-5 text-primary mx-auto" />
              <div className="text-xs text-primary mt-1">Starter</div>
            </div>
          )}
          {progress >= 50 && (
            <div className="bg-chart-2/10 rounded-lg p-2 text-center">
              <Medal className="h-5 w-5 text-chart-2 mx-auto" />
              <div className="text-xs text-chart-2 mt-1">Progress</div>
            </div>
          )}
          {progress >= 75 && (
            <div className="bg-chart-3/10 rounded-lg p-2 text-center">
              <Trophy className="h-5 w-5 text-chart-3 mx-auto" />
              <div className="text-xs text-chart-3 mt-1">Expert</div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
