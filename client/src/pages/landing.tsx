import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Lightbulb, 
  Rocket, 
  Play, 
  ArrowRight, 
  Home,
  Bot,
  ChartLine,
  Construction,
  DollarSign,
  Gavel,
  CheckCircle,
  Trophy,
  Star,
  Medal,
  Twitter,
  Linkedin,
  Github,
  Check,
  X
} from "lucide-react";
import AuthModal from "@/components/auth/auth-modal";

export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Lightbulb className="text-primary-foreground text-sm" />
                </div>
                <span className="text-xl font-bold text-foreground">Entrepreneur Hub</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-features"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-pricing"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-about"
              >
                About
              </button>
              <Button 
                variant="ghost" 
                onClick={() => setShowAuthModal(true)}
                data-testid="button-sign-in"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => setShowAuthModal(true)}
                data-testid="button-get-started"
              >
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-6">
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              <Rocket className="mr-2 h-4 w-4" />
              AI-Powered Business Platform
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Transform Your Business Ideas Into
            <span className="text-primary"> Reality</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get personalized business insights, AI-powered mentorship, and step-by-step roadmaps to launch and scale your startup successfully.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => setShowAuthModal(true)}
              data-testid="button-start-journey"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" data-testid="button-watch-demo">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>
          
          {/* Hero Dashboard Preview */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800" 
              alt="Dashboard preview showing business analytics" 
              className="rounded-2xl shadow-2xl w-full max-w-4xl mx-auto"
              data-testid="img-hero-dashboard"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Entrepreneurs</h2>
            <p className="text-muted-foreground text-lg">Everything you need to build and grow your business</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6" data-testid="card-feature-ideas">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Idea Generation</h3>
              <p className="text-muted-foreground">Get personalized business ideas based on your skills and market trends</p>
            </Card>
            
            <Card className="p-6" data-testid="card-feature-mentor">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Business Mentor</h3>
              <p className="text-muted-foreground">24/7 AI mentor providing guidance on funding, scaling, and strategy</p>
            </Card>
            
            <Card className="p-6" data-testid="card-feature-roadmap">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Construction className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learning Roadmaps</h3>
              <p className="text-muted-foreground">Personalized skill development paths with gamified progress tracking</p>
            </Card>
            
            <Card className="p-6" data-testid="card-feature-market">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ChartLine className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Market Analysis</h3>
              <p className="text-muted-foreground">AI-powered market research and competitive analysis</p>
            </Card>
            
            <Card className="p-6" data-testid="card-feature-funding">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Funding Matching</h3>
              <p className="text-muted-foreground">Get matched with investors, grants, and funding opportunities</p>
            </Card>
            
            <Card className="p-6" data-testid="card-feature-legal">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Gavel className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Legal Compliance</h3>
              <p className="text-muted-foreground">Automated legal document generation and compliance tracking</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-muted-foreground text-lg">Start free and scale as you grow your business</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="p-6" data-testid="card-plan-starter">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Starter</h3>
                <div className="text-3xl font-bold mb-1">Free</div>
                <p className="text-muted-foreground">Perfect for getting started</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">5 AI-generated business ideas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Basic market analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">1 learning roadmap</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Community access</span>
                </li>
                <li className="flex items-center space-x-2 text-muted-foreground">
                  <X className="h-4 w-4" />
                  <span className="text-sm">AI mentor chat</span>
                </li>
                <li className="flex items-center space-x-2 text-muted-foreground">
                  <X className="h-4 w-4" />
                  <span className="text-sm">Funding matching</span>
                </li>
              </ul>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowAuthModal(true)}
                data-testid="button-plan-starter"
              >
                Get Started Free
              </Button>
            </Card>
            
            {/* Pro Plan */}
            <Card className="p-6 ring-2 ring-primary relative" data-testid="card-plan-pro">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <div className="text-3xl font-bold mb-1">
                  $49
                  <span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">For serious entrepreneurs</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Unlimited business ideas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Advanced market analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Unlimited learning roadmaps</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">AI mentor chat (24/7)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Funding opportunity matching</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Legal document generator</span>
                </li>
              </ul>
              
              <Button 
                className="w-full" 
                onClick={() => setShowAuthModal(true)}
                data-testid="button-plan-pro"
              >
                Start Pro Trial
              </Button>
            </Card>
            
            {/* Enterprise Plan */}
            <Card className="p-6" data-testid="card-plan-enterprise">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <div className="text-3xl font-bold mb-1">Custom</div>
                <p className="text-muted-foreground">For teams and organizations</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Everything in Pro</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Team collaboration tools</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Custom integrations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Dedicated account manager</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Priority support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Custom AI training</span>
                </li>
              </ul>
              
              <Button 
                variant="outline" 
                className="w-full"
                data-testid="button-plan-enterprise"
              >
                Contact Sales
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-secondary text-secondary-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Lightbulb className="text-primary-foreground text-sm" />
                </div>
                <span className="text-xl font-bold">Entrepreneur Hub</span>
              </div>
              <p className="text-secondary-foreground/80 text-sm">
                Empowering entrepreneurs with AI-powered tools to build successful businesses.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground/80">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-secondary-foreground">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-secondary-foreground">Pricing</button></li>
                <li><a href="#" className="hover:text-secondary-foreground">API</a></li>
                <li><a href="#" className="hover:text-secondary-foreground">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground/80">
                <li><a href="#" className="hover:text-secondary-foreground">About</a></li>
                <li><a href="#" className="hover:text-secondary-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-secondary-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-secondary-foreground">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground/80">
                <li><a href="#" className="hover:text-secondary-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-secondary-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-secondary-foreground">Community</a></li>
                <li><a href="#" className="hover:text-secondary-foreground">Status</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="mb-8" />
          
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-secondary-foreground/60">
              © 2024 Entrepreneur Hub. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-secondary-foreground/60 hover:text-secondary-foreground">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-secondary-foreground">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-secondary-foreground">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
