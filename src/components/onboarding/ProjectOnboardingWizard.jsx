import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderPlus, 
  Server, 
  GitMerge, 
  Cpu, 
  Activity, 
  ShoppingCart, 
  Users, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  X, 
  Save,
  RotateCcw,
  Check
} from 'lucide-react';

import Step1CreateProject from './steps/Step1CreateProject';
import Step2DefineServices from './steps/Step2DefineServices';
import Step3DependencyMapping from './steps/Step3DependencyMapping';
import Step4Infrastructure from './steps/Step4Infrastructure';
import Step5TelemetrySources from './steps/Step5TelemetrySources';
import Step6BusinessJourneys from './steps/Step6BusinessJourneys';
import Step7TeamAssignment from './steps/Step7TeamAssignment';
import Step8ReviewAndComplete from './steps/Step8ReviewAndComplete';

import { completeFullOnboarding } from '../../api/projectOnboardingApi';

const stepsMeta = [
  { id: 1, name: 'Project Details', endpoint: 'POST /api/projects', icon: FolderPlus },
  { id: 2, name: 'Services', endpoint: 'POST /api/services', icon: Server },
  { id: 3, name: 'Dependencies', endpoint: 'POST /api/dependencies', icon: GitMerge },
  { id: 4, name: 'Infrastructure', endpoint: 'POST /api/infrastructure', icon: Cpu },
  { id: 5, name: 'Telemetry', endpoint: 'POST /api/telemetry/sources', icon: Activity },
  { id: 6, name: 'Journeys', endpoint: 'POST /api/business-journeys', icon: ShoppingCart },
  { id: 7, name: 'Team Invitations', endpoint: 'POST /api/users/invite', icon: Users },
  { id: 8, name: 'Review', endpoint: 'POST /api/.../complete', icon: CheckCircle2 }
];

// Production-grade mock fixture initialization matching user specification
const mockFixtureWizardState = {
  step1: {
    _id: 'proj_001',
    id: 'proj_001',
    name: 'Checkout Platform',
    description: 'Customer checkout application, cart validation, payment processing and order routing.',
    businessDomain: 'E-Commerce & Retail',
    owner: 'Payments Team',
    criticality: 'Critical'
  },
  step2: [
    { _id: 'svc_1', id: 'svc_1', name: 'Checkout Service', type: 'Backend', environment: 'Production', owner: 'Checkout Team', description: 'Handles shopping cart validation & checkout' },
    { _id: 'svc_2', id: 'svc_2', name: 'Payment Service', type: 'API', environment: 'Production', owner: 'Payments Team', description: 'Payment tokenization & gateway adapter' }
  ],
  step3: [
    {
      id: 'dep_1',
      sourceService: 'Checkout Service',
      targetService: 'Payment Service',
      dependencyType: 'API',
      endpointUrl: 'https://payment.company.com/api/pay',
      protocol: 'HTTP/REST',
      method: 'POST',
      criticality: 'Critical',
      healthImpact: 'Direct Outage'
    }
  ],
  step4: [
    { id: 'inf_1', name: 'MongoDB Cluster', type: 'Database', environment: 'Production', criticality: 'Critical', linkedServices: ['Checkout Service', 'Payment Service'], description: 'Primary MongoDB sharded cluster' },
    { id: 'inf_2', name: 'Redis Cache', type: 'Cache', environment: 'Production', criticality: 'High', linkedServices: ['Checkout Service'], description: 'Redis Enterprise session cache' }
  ],
  step5: [
    {
      id: 'tel_1',
      provider: 'Prometheus',
      endpointUrl: 'http://prometheus:9090',
      authType: 'None',
      enabled: true,
      status: 'Connected'
    }
  ],
  step6: [
    {
      id: 'j_1',
      name: 'Checkout Flow',
      description: 'User → Frontend → Checkout Service → Payment Service → Database',
      criticality: 'Critical',
      revenueImportance: 'Critical Revenue',
      revenueImpactCategory: 'Critical Revenue',
      estimatedUsers: 24500,
      healthScore: 92,
      linkedServices: ['Checkout Service', 'Payment Service']
    }
  ],
  step7: [
    { id: 'tm_1', email: 'owner@company.com', role: 'Owner', department: 'Engineering Leadership', status: 'Accepted' },
    { id: 'tm_2', email: 'admin@company.com', role: 'Admin', department: 'DevOps Engineering', status: 'Pending' }
  ]
};

export default function ProjectOnboardingWizard({ isOpen, onClose, onProjectCreated }) {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wizardState, setWizardState] = useState(mockFixtureWizardState);
  const [draftSaved, setDraftSaved] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('opintel_onboarding_draft');
    if (saved) {
      setHasDraft(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleSaveDraft = () => {
    localStorage.setItem('opintel_onboarding_draft', JSON.stringify({ wizardState, currentStep }));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  const handleResumeDraft = () => {
    const saved = localStorage.getItem('opintel_onboarding_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.wizardState) setWizardState(parsed.wizardState);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        setHasDraft(false);
      } catch (e) {
        console.error('Failed to parse onboarding draft', e);
      }
    }
  };

  const updateStepData = (stepKey, newContent) => {
    setValidationError(null);
    setWizardState((prev) => ({
      ...prev,
      [stepKey]: newContent
    }));
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!wizardState.step1.name || !wizardState.step1.name.trim()) {
        setValidationError('Please enter a Project Name before continuing.');
        return false;
      }
    } else if (currentStep === 2) {
      if (!wizardState.step2 || wizardState.step2.length === 0) {
        setValidationError('Please register at least 1 service for this project.');
        return false;
      }
    }
    setValidationError(null);
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (currentStep < 8) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleCompleteSetup = async () => {
    setIsSubmitting(true);
    try {
      const res = await completeFullOnboarding(wizardState);
      localStorage.removeItem('opintel_onboarding_draft');
      if (onProjectCreated) {
        onProjectCreated(res.project);
      }
      onClose();
      // Redirect User to /monitor/project/:projectId
      const targetUrl = res.redirectUrl || `/monitor/project/${res.projectId || 'proj_001'}`;
      navigate(targetUrl);
    } catch (err) {
      console.error('Failed to complete onboarding setup', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = Math.round((currentStep / 8) * 100);

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <Step1CreateProject data={wizardState.step1} updateData={(d) => updateStepData('step1', { ...wizardState.step1, ...d })} />;
      case 2:
        return <Step2DefineServices data={wizardState.step2} updateData={(d) => updateStepData('step2', d)} />;
      case 3:
        return <Step3DependencyMapping data={wizardState.step3} updateData={(d) => updateStepData('step3', d)} />;
      case 4:
        return <Step4Infrastructure data={wizardState.step4} updateData={(d) => updateStepData('step4', d)} />;
      case 5:
        return <Step5TelemetrySources data={wizardState.step5} updateData={(d) => updateStepData('step5', d)} />;
      case 6:
        return <Step6BusinessJourneys data={wizardState.step6} updateData={(d) => updateStepData('step6', d)} />;
      case 7:
        return <Step7TeamAssignment data={wizardState.step7} updateData={(d) => updateStepData('step7', d)} />;
      case 8:
        return <Step8ReviewAndComplete wizardState={wizardState} isSubmitting={isSubmitting} onComplete={handleCompleteSetup} onBack={handlePrev} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0B1437] border border-purple-500/30 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl shadow-purple-950/60 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-md font-bold text-sm">
              OP
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Project Onboarding Wizard</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  {progressPercent}% Completed
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">Production-grade setup flow transforming empty project into live operational telemetry</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-purple-400" />
              <span>{draftSaved ? 'Draft Saved! ✅' : 'Save Draft'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resume Draft Banner */}
        {hasDraft && (
          <div className="px-6 py-2 bg-purple-500/15 border-b border-purple-500/30 flex items-center justify-between text-xs text-purple-200">
            <span className="flex items-center gap-2 font-medium">
              <RotateCcw className="w-4 h-4 text-purple-400" />
              Saved onboarding draft detected. Would you like to resume?
            </span>
            <button
              type="button"
              onClick={handleResumeDraft}
              className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors"
            >
              Resume Draft
            </button>
          </div>
        )}

        {/* 8-Step Progress Line */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-900/60 shrink-0 space-y-2">
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-400 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="flex items-center justify-between overflow-x-auto scrollbar-none pb-1 pt-1 min-w-[760px]">
            {stepsMeta.map((step) => {
              const isCurrent = currentStep === step.id;
              const isPassed = currentStep > step.id;

              return (
                <div 
                  key={step.id} 
                  onClick={() => {
                    if (step.id < currentStep || validateStep()) {
                      setCurrentStep(step.id);
                    }
                  }}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all text-xs font-bold ${
                    isCurrent
                      ? 'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-500/30 scale-105'
                      : isPassed
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400 group-hover:border-slate-600'
                  }`}>
                    {isPassed ? <Check className="w-3.5 h-3.5" /> : step.id}
                  </div>

                  <div className="flex flex-col text-left">
                    <span className={`text-xs font-bold transition-colors ${
                      isCurrent ? 'text-purple-300' : isPassed ? 'text-slate-200' : 'text-slate-500'
                    }`}>
                      {step.name} {isPassed && '✅'}
                    </span>
                  </div>

                  {step.id < 8 && (
                    <div className={`w-4 h-0.5 mx-1.5 rounded ${
                      isPassed ? 'bg-emerald-500/60' : 'bg-slate-800'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <span>⚠️ {validationError}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {renderStepComponent()}
        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1 || isSubmitting}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all ${
              currentStep === 1 || isSubmitting
                ? 'opacity-40 text-slate-600 cursor-not-allowed'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
              Step {currentStep} of 8
            </span>

            {currentStep < 8 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs md:text-sm font-semibold shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02]"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteSetup}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs md:text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <span>Initializing Monitoring...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Setup & Launch</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
