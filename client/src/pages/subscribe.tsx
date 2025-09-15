import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, CreditCard, Shield } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/dashboard",
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "You are now subscribed to Entrepreneur Hub Pro!",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="subscribe-form">
      <div className="mb-6">
        <PaymentElement />
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe}
        data-testid="button-subscribe"
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Subscribe to Pro Plan
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (isAuthenticated) {
      // Create subscription as soon as the page loads
      apiRequest("POST", "/api/create-subscription")
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error creating subscription:", error);
          toast({
            title: "Error",
            description: "Failed to initialize payment. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
        });
    }
  }, [isAuthenticated, toast]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (loading || !clientSecret) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">Setting up your subscription...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Upgrade to Pro</h1>
              <p className="text-muted-foreground text-lg">Unlock the full potential of Entrepreneur Hub</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Plan Details */}
              <Card data-testid="plan-details">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Pro Plan</CardTitle>
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                  <div className="text-3xl font-bold">
                    $49
                    <span className="text-lg font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-chart-2" />
                      <span>Unlimited AI-generated business ideas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-chart-2" />
                      <span>Advanced market analysis & insights</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-chart-2" />
                      <span>Unlimited learning roadmaps</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-chart-2" />
                      <span>24/7 AI business mentor chat</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-chart-2" />
                      <span>Funding opportunity matching</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-chart-2" />
                      <span>Legal document generator</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-chart-2" />
                      <span>Priority customer support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-chart-2" />
                      <span>Cancel anytime</span>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Shield className="h-4 w-4" />
                        <span>Secure payments</span>
                      </div>
                      <span>•</span>
                      <span>Cancel anytime</span>
                      <span>•</span>
                      <span>30-day money back</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Form */}
              <Card data-testid="payment-form">
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <p className="text-muted-foreground">
                    Complete your subscription to Entrepreneur Hub Pro
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Make SURE to wrap the form in <Elements> which provides the stripe context. */}
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <SubscribeForm />
                  </Elements>
                </CardContent>
              </Card>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">Secure payment processing powered by</p>
              <div className="flex items-center justify-center space-x-8 opacity-60">
                <span className="text-2xl font-bold">STRIPE</span>
                <CreditCard className="h-8 w-8" />
                <Shield className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
