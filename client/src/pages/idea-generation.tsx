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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import IdeaCard from "@/components/idea-generation/idea-card";

export default function IdeaGeneration() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    industry: "",
    businessModel: "",
    targetMarket: "",
    budgetRange: "",
    experienceLevel: "",
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

  const { data: businessIdeas = [], refetch } = useQuery({
    queryKey: ["/api/business-ideas"],
    enabled: isAuthenticated,
  });

  const generateIdeasMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/business-ideas/generate", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ideas Generated!",
        description: "New business ideas have been created based on your profile.",
      });
      refetch();
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
        description: "Failed to generate business ideas. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateIdeas = () => {
    if (!formData.industry || !formData.businessModel || !formData.targetMarket) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate ideas.",
        variant: "destructive",
      });
      return;
    }

    generateIdeasMutation.mutate({
      ...formData,
      budgetRange: formData.budgetRange || user?.budgetRange || "under-10k",
      experienceLevel: formData.experienceLevel || user?.experienceLevel || "first-time",
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
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">AI-Powered Idea Generation</h1>
              <p className="text-muted-foreground text-lg">Get personalized business ideas based on your skills and market trends</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Panel */}
              <div className="lg:col-span-1">
                <Card className="p-6 shadow-lg sticky top-8" data-testid="idea-generation-form">
                  <h3 className="text-lg font-semibold mb-4">Generate Ideas</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="industry">Industry Focus *</Label>
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
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="businessModel">Business Model *</Label>
                      <Select 
                        value={formData.businessModel} 
                        onValueChange={(value) => setFormData({ ...formData, businessModel: value })}
                      >
                        <SelectTrigger data-testid="select-business-model">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="marketplace">Marketplace</SelectItem>
                          <SelectItem value="subscription">Subscription</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="freemium">Freemium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="targetMarket">Target Market *</Label>
                      <Select 
                        value={formData.targetMarket} 
                        onValueChange={(value) => setFormData({ ...formData, targetMarket: value })}
                      >
                        <SelectTrigger data-testid="select-target-market">
                          <SelectValue placeholder="Select market" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small-business">Small Business</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                          <SelectItem value="consumers">Consumers</SelectItem>
                          <SelectItem value="developers">Developers</SelectItem>
                          <SelectItem value="students">Students</SelectItem>
                          <SelectItem value="professionals">Professionals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="budget">Budget Range</Label>
                      <Select 
                        value={formData.budgetRange} 
                        onValueChange={(value) => setFormData({ ...formData, budgetRange: value })}
                      >
                        <SelectTrigger data-testid="select-budget">
                          <SelectValue placeholder={user?.budgetRange || "Select budget"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-10k">Under $10K</SelectItem>
                          <SelectItem value="10k-50k">$10K - $50K</SelectItem>
                          <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                          <SelectItem value="100k-plus">$100K+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={handleGenerateIdeas}
                      disabled={generateIdeasMutation.isPending}
                      data-testid="button-generate-ideas"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      {generateIdeasMutation.isPending ? "Generating..." : "Generate Ideas"}
                    </Button>
                  </div>
                </Card>
              </div>
              
              {/* Generated Ideas */}
              <div className="lg:col-span-2">
                <div className="space-y-6" data-testid="ideas-list">
                  {businessIdeas.length === 0 ? (
                    <Card className="p-8 text-center">
                      <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Ideas Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Fill out the form on the left to generate personalized business ideas
                      </p>
                    </Card>
                  ) : (
                    businessIdeas.map((idea: any) => (
                      <IdeaCard key={idea.id} idea={idea} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
