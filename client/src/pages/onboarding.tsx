import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CloudUpload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import ProgressIndicator from "@/components/onboarding/progress-indicator";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    industry: "",
    experienceLevel: "",
    budgetRange: "",
    businessGoals: "",
    skills: [] as string[],
  });

  const onboardingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/onboarding", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome to Entrepreneur Hub!",
        description: "Your profile has been set up successfully.",
      });
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onboardingMutation.mutate(formData);
    }
  };

  const handleSkillsChange = (skillsString: string) => {
    const skills = skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0);
    setFormData({ ...formData, skills });
  };

  return (
    <div className="min-h-screen bg-muted/30 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Let's Get You Started</h2>
          <p className="text-muted-foreground text-lg">Tell us about yourself so we can personalize your experience</p>
        </div>
        
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={step} />
        
        {/* Onboarding Steps */}
        <Card className="p-8 shadow-lg" data-testid="card-onboarding">
          {step === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="industry">Industry Interest</Label>
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
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select 
                    value={formData.experienceLevel} 
                    onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
                  >
                    <SelectTrigger data-testid="select-experience">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-time">First-time entrepreneur</SelectItem>
                      <SelectItem value="some-experience">Some experience</SelectItem>
                      <SelectItem value="serial">Serial entrepreneur</SelectItem>
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
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-10k">Under $10K</SelectItem>
                      <SelectItem value="10k-50k">$10K - $50K</SelectItem>
                      <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                      <SelectItem value="100k-plus">$100K+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Skills & Expertise</h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="skills">Your Skills (comma-separated)</Label>
                  <Textarea
                    id="skills"
                    placeholder="e.g., Marketing, Programming, Design, Sales, Project Management"
                    value={formData.skills.join(', ')}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                    data-testid="textarea-skills"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    List your key skills and areas of expertise
                  </p>
                </div>
                
                <div>
                  <Label>Upload Resume/CV (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center mt-2">
                    <CloudUpload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">Drag and drop your resume here, or click to browse</p>
                    <Button variant="outline" data-testid="button-upload-resume">Choose File</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Business Goals</h3>
              <div>
                <Label htmlFor="goals">What are your main business goals?</Label>
                <Textarea
                  id="goals"
                  placeholder="Describe what you want to achieve with your business..."
                  value={formData.businessGoals}
                  onChange={(e) => setFormData({ ...formData, businessGoals: e.target.value })}
                  rows={6}
                  data-testid="textarea-goals"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Tell us about your vision, target market, and what success looks like for you
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end mt-8">
            <Button 
              onClick={handleContinue}
              disabled={onboardingMutation.isPending}
              data-testid="button-continue"
            >
              {onboardingMutation.isPending ? "Setting up..." : step === 3 ? "Complete Setup" : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
