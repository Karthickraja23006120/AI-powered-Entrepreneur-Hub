import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Clock, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface ComplianceChecklistProps {
  items: Array<{
    id: string;
    itemType: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    completedAt: string;
    order: number;
  }>;
}

export default function ComplianceChecklist({ items }: ComplianceChecklistProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const completeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiRequest("POST", `/api/legal/compliance/${itemId}/complete`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Item Completed!",
        description: "Compliance item marked as completed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/legal/compliance"] });
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
        description: "Failed to update compliance item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-6 h-6 text-chart-2" />;
      case 'in_progress': return <Clock className="w-6 h-6 text-primary" />;
      default: return <Circle className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-chart-2 text-white">Completed</Badge>;
      case 'in_progress': return <Badge className="bg-primary text-primary-foreground">In Progress</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-chart-2/5 border-chart-2/20';
      case 'in_progress': return 'bg-primary/5 border-primary/20';
      default: return 'bg-muted/50';
    }
  };

  const completedItems = items.filter(item => item.status === 'completed').length;
  const totalItems = items.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const sortedItems = items.sort((a, b) => a.order - b.order);

  return (
    <Card className="p-6 shadow-lg" data-testid="compliance-checklist">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Compliance Checklist</h3>
        <Badge variant="outline">United States</Badge>
      </div>
      
      <div className="space-y-4 mb-6">
        {sortedItems.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Complete onboarding to generate your compliance checklist</p>
          </div>
        ) : (
          sortedItems.map((item) => (
            <div 
              key={item.id} 
              className={`flex items-start space-x-3 p-4 rounded-lg ${getStatusColor(item.status)}`}
              data-testid={`compliance-item-${item.id}`}
            >
              <button
                onClick={() => {
                  if (item.status !== 'completed') {
                    completeItemMutation.mutate(item.id);
                  }
                }}
                disabled={item.status === 'completed' || completeItemMutation.isPending}
                className="mt-1"
              >
                {getStatusIcon(item.status)}
              </button>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{item.title}</h4>
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="capitalize">{item.status.replace('_', ' ')}</span>
                  {item.completedAt && (
                    <>
                      <span>•</span>
                      <span>Completed {new Date(item.completedAt).toLocaleDateString()}</span>
                    </>
                  )}
                  {item.dueDate && item.status !== 'completed' && (
                    <>
                      <span>•</span>
                      <span>Due {new Date(item.dueDate).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
                {item.status === 'pending' && (
                  <Button variant="link" className="text-xs p-0 h-auto mt-1">
                    {item.itemType === 'privacy_policy' || item.itemType === 'terms_of_service' 
                      ? 'Generate Document' 
                      : 'Continue Application'}
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Progress Bar */}
      {totalItems > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {completedItems} of {totalItems} items completed
          </p>
        </div>
      )}
    </Card>
  );
}
