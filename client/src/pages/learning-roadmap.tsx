import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Construction, Plus } from "lucide-react";
import ProgressOverview from "@/components/roadmap/progress-overview";
import RoadmapPhase from "@/components/roadmap/roadmap-phase";

export default function LearningRoadmap() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    skills: "",
    industry: "",
    experienceLevel: "",
    targetRole: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: roadmaps = [], refetch: refetchRoadmaps } = useQuery({
    queryKey: ["/api/roadmaps"],
    enabled: isAuthenticated,
  });

  const { data: selectedRoadmap, refetch: refetchRoadmap } = useQuery({
    queryKey: ["/api/roadmaps", selectedRoadmapId],
    enabled: !!selectedRoadmapId,
  });

  const createRoadmapMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/roadmaps/generate", data);
      return response.json();
    },
    onSuccess: (newRoadmap) => {
      toast({
        title: "Roadmap Created!",
        description: "Your personalized learning roadmap has been generated.",
      });
      setShowCreateForm(false);
      setSelectedRoadmapId(newRoadmap.id);
      refetchRoadmaps();
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
        description: "Failed to create roadmap. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateRoadmap = () => {
    if (!formData.skills || !formData.industry || !formData.targetRole) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to create a roadmap.",
        variant: "destructive",
      });
      return;
    }

    const skills = formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    createRoadmapMutation.mutate({
      skills,
      industry: formData.industry,
      experienceLevel: formData.experienceLevel || user?.experienceLevel || "first-time",
      targetRole: formData.targetRole,
    });
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 ml-64 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Learning Roadmaps</h1>
                <p className="text-muted-foreground text-lg">AI-curated learning paths to master your chosen field</p>
              </div>
              <Button 
                onClick={() => setShowCreateForm(true)}
                data-testid="button-create-roadmap"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Roadmap
              </Button>
            </div>

            {/* Create Roadmap Form */}
            {showCreateForm && (
              <Card className="p-6 shadow-lg mb-8" data-testid="create-roadmap-form">
                <h3 className="text-lg font-semibold mb-4">Create New Learning Roadmap</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="targetRole">Target Role/Position *</Label>
                    <Input
                      id="targetRole"
                      placeholder="e.g., Digital Marketing Manager"
                      value={formData.targetRole}
                      onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                      data-testid="input-target-role"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select 
                      value={formData.industry} 
                      onValueChange={(value) => setFormData({ ...formData, industry: value })}
                    >
                      <SelectTrigger data-testid="select-industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="skills">Current Skills *</Label>
                  <Textarea
                    id="skills"
                    placeholder="List your current skills (comma-separated)"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    data-testid="textarea-skills"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={handleCreateRoadmap}
                    disabled={createRoadmapMutation.isPending}
                    data-testid="button-generate-roadmap"
                  >
                    {createRoadmapMutation.isPending ? "Generating..." : "Generate Roadmap"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                    data-testid="button-cancel-create"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            )}

            {/* Roadmap Selection */}
            {roadmaps.length > 0 && (
              <Card className="p-6 shadow-lg mb-8" data-testid="roadmap-selector">
                <h3 className="text-lg font-semibold mb-4">Your Roadmaps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roadmaps.map((roadmap: any) => (
                    <div
                      key={roadmap.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedRoadmapId === roadmap.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedRoadmapId(roadmap.id)}
                      data-testid={`roadmap-card-${roadmap.id}`}
                    >
                      <h4 className="font-semibold mb-2">{roadmap.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{roadmap.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{roadmap.category}</span>
                        <span>{roadmap.progressPercentage}% complete</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Selected Roadmap Details */}
            {selectedRoadmap ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                  <ProgressOverview roadmap={selectedRoadmap} />
                </div>
                
                <div className="lg:col-span-3">
                  <div className="space-y-6">
                    {selectedRoadmap.phases?.map((phase: any) => (
                      <RoadmapPhase 
                        key={phase.id} 
                        phase={phase} 
                        onMilestoneComplete={refetchRoadmap}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : roadmaps.length === 0 ? (
              <Card className="p-8 text-center">
                <Construction className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Roadmaps Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first learning roadmap to get started on your journey
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Roadmap
                </Button>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <Construction className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Roadmap</h3>
                <p className="text-muted-foreground">
                  Choose a roadmap above to view its details and track your progress
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
