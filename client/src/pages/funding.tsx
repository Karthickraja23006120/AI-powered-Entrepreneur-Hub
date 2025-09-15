import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Filter } from "lucide-react";
import FundingCard from "@/components/funding/funding-card";

export default function Funding() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    type: "all",
    stage: "all",
    amount: "all",
    location: "all",
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

  const { data: fundingMatches = [] } = useQuery({
    queryKey: ["/api/funding"],
    enabled: isAuthenticated,
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    },
  });

  // Calculate overall match score
  const overallMatchScore = fundingMatches.length > 0 
    ? Math.round(fundingMatches.reduce((sum: number, match: any) => sum + parseFloat(match.matchScore || "0"), 0) / fundingMatches.length)
    : 0;

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
              <h1 className="text-3xl font-bold mb-4">Funding Opportunities</h1>
              <p className="text-muted-foreground text-lg">AI-matched funding sources based on your business profile</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <Card className="p-6 shadow-lg sticky top-8" data-testid="funding-filters">
                  <div className="flex items-center space-x-2 mb-4">
                    <Filter className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Filter Opportunities</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="type">Funding Type</Label>
                      <Select 
                        value={filters.type} 
                        onValueChange={(value) => setFilters({ ...filters, type: value })}
                      >
                        <SelectTrigger data-testid="select-funding-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="vc">Venture Capital</SelectItem>
                          <SelectItem value="angel">Angel Investors</SelectItem>
                          <SelectItem value="grant">Grants</SelectItem>
                          <SelectItem value="crowdfunding">Crowdfunding</SelectItem>
                          <SelectItem value="accelerator">Accelerator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="stage">Stage</Label>
                      <Select 
                        value={filters.stage} 
                        onValueChange={(value) => setFilters({ ...filters, stage: value })}
                      >
                        <SelectTrigger data-testid="select-stage">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Stages</SelectItem>
                          <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                          <SelectItem value="seed">Seed</SelectItem>
                          <SelectItem value="series-a">Series A</SelectItem>
                          <SelectItem value="series-b">Series B+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="amount">Amount Range</Label>
                      <Select 
                        value={filters.amount} 
                        onValueChange={(value) => setFilters({ ...filters, amount: value })}
                      >
                        <SelectTrigger data-testid="select-amount">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Amounts</SelectItem>
                          <SelectItem value="10k-100k">$10K - $100K</SelectItem>
                          <SelectItem value="100k-1m">$100K - $1M</SelectItem>
                          <SelectItem value="1m-10m">$1M - $10M</SelectItem>
                          <SelectItem value="10m-plus">$10M+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Select 
                        value={filters.location} 
                        onValueChange={(value) => setFilters({ ...filters, location: value })}
                      >
                        <SelectTrigger data-testid="select-location">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Global</SelectItem>
                          <SelectItem value="north-america">North America</SelectItem>
                          <SelectItem value="europe">Europe</SelectItem>
                          <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Match Score */}
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg" data-testid="match-score">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">{overallMatchScore}%</div>
                      <div className="text-sm text-primary">Overall Match Score</div>
                      <p className="text-xs text-muted-foreground mt-2">Based on your business profile</p>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Funding Opportunities List */}
              <div className="lg:col-span-2">
                <div className="space-y-6" data-testid="funding-opportunities">
                  {fundingMatches.length === 0 ? (
                    <Card className="p-8 text-center">
                      <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Funding Matches</h3>
                      <p className="text-muted-foreground mb-4">
                        Complete your business profile to get personalized funding recommendations
                      </p>
                    </Card>
                  ) : (
                    fundingMatches.map((match: any) => (
                      <FundingCard key={match.id} match={match} />
                    ))
                  )}
                </div>
                
                {/* Load More */}
                {fundingMatches.length > 0 && (
                  <div className="text-center mt-8">
                    <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                      Load More Opportunities
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
