import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Onboarding from "@/pages/onboarding";
import IdeaGeneration from "@/pages/idea-generation";
import LearningRoadmap from "@/pages/learning-roadmap";
import MarketAnalysis from "@/pages/market-analysis";
import Funding from "@/pages/funding";
import Legal from "@/pages/legal";
import Subscribe from "@/pages/subscribe";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route component={NotFound} />
        </>
      ) : (
        <>
          {/* Protected routes for authenticated users */}
          {!user?.onboardingCompleted ? (
            <Route path="/" component={Onboarding} />
          ) : (
            <Route path="/" component={Dashboard} />
          )}
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/ideas" component={IdeaGeneration} />
          <Route path="/roadmap" component={LearningRoadmap} />
          <Route path="/market" component={MarketAnalysis} />
          <Route path="/funding" component={Funding} />
          <Route path="/legal" component={Legal} />
          <Route path="/subscribe" component={Subscribe} />
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
