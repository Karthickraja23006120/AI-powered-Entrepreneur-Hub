import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Gavel, FileText, Download } from "lucide-react";
import ComplianceChecklist from "@/components/legal/compliance-checklist";

export default function Legal() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [documentForm, setDocumentForm] = useState({
    documentType: "",
    businessType: "",
    jurisdiction: "",
    specialRequirements: [] as string[],
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

  const { data: complianceItems = [] } = useQuery({
    queryKey: ["/api/legal/compliance"],
    enabled: isAuthenticated,
  });

  const { data: legalDocuments = [] } = useQuery({
    queryKey: ["/api/legal/documents"],
    enabled: isAuthenticated,
  });

  const generateDocumentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/legal/generate", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Document Generated!",
        description: "Your legal document has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/legal/documents"] });
      setDocumentForm({
        documentType: "",
        businessType: "",
        jurisdiction: "",
        specialRequirements: [],
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
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateDocument = () => {
    if (!documentForm.documentType || !documentForm.businessType || !documentForm.jurisdiction) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate a document.",
        variant: "destructive",
      });
      return;
    }

    generateDocumentMutation.mutate(documentForm);
  };

  const handleRequirementChange = (requirement: string, checked: boolean) => {
    setDocumentForm(prev => ({
      ...prev,
      specialRequirements: checked 
        ? [...prev.specialRequirements, requirement]
        : prev.specialRequirements.filter(r => r !== requirement)
    }));
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
              <h1 className="text-3xl font-bold mb-4">Legal Compliance Assistant</h1>
              <p className="text-muted-foreground text-lg">Automated legal document generation and compliance tracking</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Compliance Checklist */}
              <div>
                <ComplianceChecklist items={complianceItems} />
              </div>
              
              {/* Document Generator */}
              <div>
                <Card className="p-6 shadow-lg" data-testid="document-generator">
                  <h3 className="text-lg font-semibold mb-6">Document Generator</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="documentType">Document Type *</Label>
                      <Select 
                        value={documentForm.documentType} 
                        onValueChange={(value) => setDocumentForm({ ...documentForm, documentType: value })}
                      >
                        <SelectTrigger data-testid="select-document-type">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="privacy_policy">Privacy Policy</SelectItem>
                          <SelectItem value="terms_of_service">Terms of Service</SelectItem>
                          <SelectItem value="nda">NDA Template</SelectItem>
                          <SelectItem value="service_agreement">Service Agreement</SelectItem>
                          <SelectItem value="employment_contract">Employment Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select 
                        value={documentForm.businessType} 
                        onValueChange={(value) => setDocumentForm({ ...documentForm, businessType: value })}
                      >
                        <SelectTrigger data-testid="select-business-type">
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS Platform</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="marketplace">Marketplace</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="jurisdiction">Jurisdiction *</Label>
                      <Select 
                        value={documentForm.jurisdiction} 
                        onValueChange={(value) => setDocumentForm({ ...documentForm, jurisdiction: value })}
                      >
                        <SelectTrigger data-testid="select-jurisdiction">
                          <SelectValue placeholder="Select jurisdiction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="california">California, USA</SelectItem>
                          <SelectItem value="delaware">Delaware, USA</SelectItem>
                          <SelectItem value="new-york">New York, USA</SelectItem>
                          <SelectItem value="texas">Texas, USA</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Special Requirements</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="coppa"
                            checked={documentForm.specialRequirements.includes("coppa")}
                            onCheckedChange={(checked) => handleRequirementChange("coppa", checked as boolean)}
                            data-testid="checkbox-coppa"
                          />
                          <Label htmlFor="coppa" className="text-sm">COPPA Compliance (Children's Privacy)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="gdpr"
                            checked={documentForm.specialRequirements.includes("gdpr")}
                            onCheckedChange={(checked) => handleRequirementChange("gdpr", checked as boolean)}
                            data-testid="checkbox-gdpr"
                          />
                          <Label htmlFor="gdpr" className="text-sm">GDPR Compliance (EU Users)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="ferpa"
                            checked={documentForm.specialRequirements.includes("ferpa")}
                            onCheckedChange={(checked) => handleRequirementChange("ferpa", checked as boolean)}
                            data-testid="checkbox-ferpa"
                          />
                          <Label htmlFor="ferpa" className="text-sm">FERPA Compliance (Educational Records)</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mb-4" 
                    onClick={handleGenerateDocument}
                    disabled={generateDocumentMutation.isPending}
                    data-testid="button-generate-document"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {generateDocumentMutation.isPending ? "Generating..." : "Generate Document"}
                  </Button>
                  
                  {/* Recent Documents */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-medium mb-3">Recent Documents</h4>
                    <div className="space-y-2">
                      {legalDocuments.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No documents generated yet</p>
                      ) : (
                        legalDocuments.slice(0, 3).map((doc: any) => (
                          <div 
                            key={doc.id} 
                            className="flex items-center justify-between p-2 hover:bg-muted rounded-lg"
                            data-testid={`document-${doc.id}`}
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-red-500" />
                              <span className="text-sm">{doc.title}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
