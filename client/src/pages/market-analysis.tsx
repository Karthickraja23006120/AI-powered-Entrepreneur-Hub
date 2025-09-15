import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, BarChart3, AlertTriangle, Lightbulb } from "lucide-react";
import MarketTrendsChart from "@/components/market/market-trends-chart";

export default function MarketAnalysis() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [formData, setFormData] = useState({
    industry: "",
    businessIdea: "",
    targetMarket: "",
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

  const analysisMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/market-analysis", data);
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisData(data);
      toast({
        title: "Analysis Complete!",
        description: "Market analysis has been generated successfully.",
      });
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
        description: "Failed to generate market analysis. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!formData.industry || !formData.businessIdea || !formData.targetMarket) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate analysis.",
        variant: "destructive",
      });
      return;
    }

    analysisMutation.mutate(formData);
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
              <h1 className="text-3xl font-bold mb-4">Market Analysis & Insights</h1>
              <p className="text-muted-foreground text-lg">AI-powered market research and competitive analysis</p>
            </div>
            
            {/* Analysis Form */}
            <Card className="p-6 shadow-lg mb-8" data-testid="market-analysis-form">
              <h3 className="text-lg font-semibold mb-4">Generate Market Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="targetMarket">Target Market *</Label>
                  <Input
                    id="targetMarket"
                    placeholder="e.g., Small businesses, Consumers"
                    value={formData.targetMarket}
                    onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                    data-testid="input-target-market"
                  />
                </div>
              </div>
              <div className="mb-4">
                <Label htmlFor="businessIdea">Business Idea Description *</Label>
                <Textarea
                  id="businessIdea"
                  placeholder="Describe your business idea or concept..."
                  value={formData.businessIdea}
                  onChange={(e) => setFormData({ ...formData, businessIdea: e.target.value })}
                  rows={3}
                  data-testid="textarea-business-idea"
                />
              </div>
              <Button 
                onClick={handleAnalyze}
                disabled={analysisMutation.isPending}
                data-testid="button-analyze-market"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                {analysisMutation.isPending ? "Analyzing..." : "Analyze Market"}
              </Button>
            </Card>

            {/* Analysis Results */}
            {analysisData ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Market Overview */}
                <Card className="p-6 shadow-lg" data-testid="market-overview">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Market Overview</h3>
                    <Select defaultValue="12months">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12months">Last 12 months</SelectItem>
                        <SelectItem value="6months">Last 6 months</SelectItem>
                        <SelectItem value="3months">Last 3 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <MarketTrendsChart />
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-chart-1">{analysisData.growthRate}</div>
                      <div className="text-xs text-muted-foreground">Growth Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-chart-2">{analysisData.marketSize}</div>
                      <div className="text-xs text-muted-foreground">Market Size</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-chart-3">{analysisData.competitorCount || 0}</div>
                      <div className="text-xs text-muted-foreground">Competitors</div>
                    </div>
                  </div>
                </Card>
                
                {/* Top Competitors */}
                <Card className="p-6 shadow-lg" data-testid="competitor-analysis">
                  <h3 className="text-lg font-semibold mb-6">Top Competitors</h3>
                  
                  <div className="space-y-4">
                    {analysisData.topCompetitors?.slice(0, 3).map((competitor: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <span className="text-primary font-semibold">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{competitor.name}</h4>
                            <p className="text-sm text-muted-foreground">{competitor.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{competitor.stage}</div>
                          <div className="text-xs text-muted-foreground">Stage</div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-4 text-muted-foreground">
                        No competitor data available
                      </div>
                    )}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    View Detailed Analysis
                  </Button>
                </Card>
              </div>
            ) : (
              <Card className="p-8 text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
                <p className="text-muted-foreground">
                  Fill out the form above to generate your market analysis
                </p>
              </Card>
            )}

            {/* AI Insights */}
            {analysisData && (
              <Card className="p-6 shadow-lg" data-testid="ai-insights">
                <h3 className="text-lg font-semibold mb-6">AI-Generated Insights</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analysisData.opportunities?.length > 0 && (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold text-primary">Opportunities</h4>
                      </div>
                      <ul className="space-y-2">
                        {analysisData.opportunities.slice(0, 2).map((opportunity: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground">• {opportunity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analysisData.challenges?.length > 0 && (
                    <div className="p-4 bg-chart-3/5 border border-chart-3/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertTriangle className="h-5 w-5 text-chart-3" />
                        <h4 className="font-semibold text-chart-3">Challenges</h4>
                      </div>
                      <ul className="space-y-2">
                        {analysisData.challenges.slice(0, 2).map((challenge: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground">• {challenge}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analysisData.keyTrends?.length > 0 && (
                    <div className="p-4 bg-chart-2/5 border border-chart-2/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <TrendingUp className="h-5 w-5 text-chart-2" />
                        <h4 className="font-semibold text-chart-2">Key Trends</h4>
                      </div>
                      <ul className="space-y-2">
                        {analysisData.keyTrends.slice(0, 2).map((trend: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground">• {trend}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
