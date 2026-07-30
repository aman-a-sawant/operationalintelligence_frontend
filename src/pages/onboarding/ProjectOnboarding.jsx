import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectOnboardingWizard from '../../components/onboarding/ProjectOnboardingWizard';

export default function ProjectOnboarding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-100 flex items-center justify-center p-4">
      <ProjectOnboardingWizard
        isOpen={true}
        onClose={() => navigate('/dashboard?view=organization')}
        onProjectCreated={(project) => {
          console.log('Project created via standalone onboarding route', project);
        }}
      />
    </div>
  );
}
