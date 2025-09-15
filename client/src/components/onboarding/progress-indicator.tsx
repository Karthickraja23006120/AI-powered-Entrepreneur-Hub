interface ProgressIndicatorProps {
  currentStep: number;
}

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps = [
    { number: 1, title: "Profile" },
    { number: 2, title: "Skills" },
    { number: 3, title: "Goals" },
  ];

  return (
    <div className="flex items-center justify-center mb-8" data-testid="progress-indicator">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step.number 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
                data-testid={`step-${step.number}`}
              >
                {step.number}
              </div>
              <span 
                className={`ml-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-12 h-0.5 bg-border ml-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
