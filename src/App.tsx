import { useState } from 'react';
import { CampaignEditor } from './components/CampaignEditor';
import { DevicePreview } from './components/DevicePreview';
import type { CampaignContent, CampaignStyling } from './components/CSATPopup';
import { LayoutGrid, Laptop, Smartphone, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

// Pre-populate with realistic, attractive defaults
const DEFAULT_CONTENT: CampaignContent = {
  initialTitle: 'How was your experience?',
  initialSubtitle: 'Help us improve by sharing your thoughts. It takes less than a minute!',
  ratingType: 'stars',
  dynamicOptions: ['Fast Support', 'Friendly Agent', 'Feature Rich', 'Good Value', 'Needs Improvement'],
  commentEnabled: true,
  submitButtonText: 'Submit Feedback',
  mediaUrl: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=300&q=80', // Beautiful modern sunset/mountain abstract image
  mediaType: 'image',
  thankYouTitle: 'Thank you for your rating!',
  thankYouSubtitle: 'Your response has been registered. We appreciate your valuable feedback!',
  thankYouButtonText: 'Done',
};

const DEFAULT_STYLING: CampaignStyling = {
  backgroundColor: '#0f172a', // Slate 900
  titleColor: '#f8fafc', // Slate 50
  subtitleColor: '#94a3b8', // Slate 400
  buttonColor: '#4f46e5', // Indigo 600
  buttonTextColor: '#ffffff',
  fontSize: 'md',
  fontWeight: 'semibold',
  borderRadius: 16,
  buttonWidth: 100,
  buttonHeight: 44,
  ratingSelectedColor: '#fbbf24', // Amber 400
  ratingUnselectedColor: '#475569', // Slate 600
};

function App() {
  const [content, setContent] = useState<CampaignContent>(DEFAULT_CONTENT);
  const [styling, setStyling] = useState<CampaignStyling>(DEFAULT_STYLING);

  // Active step of the CSAT survey shown in the preview device
  const [activeStep, setActiveStep] = useState<'initial' | 'feedback' | 'thankyou'>('initial');

  // Preview-specific response data (simulating customer interaction)
  const [previewRating, setPreviewRating] = useState<number>(0);
  const [previewTags, setPreviewTags] = useState<string[]>([]);
  const [previewComment, setPreviewComment] = useState<string>('');

  // Handle survey submission inside the phone preview
  const handlePreviewSubmit = () => {
    // Check if a rating was selected
    if (previewRating === 0) {
      alert('Please select a rating before submitting!');
      return;
    }
    
    // Trigger confetti celebration
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.7 },
      colors: [styling.buttonColor, '#fbbf24', '#10b981', '#6366f1']
    });

    // Advance to thank you screen
    setActiveStep('thankyou');
  };

  // Reset survey interaction state inside the phone preview
  const handlePreviewReset = () => {
    setPreviewRating(0);
    setPreviewTags([]);
    setPreviewComment('');
    setActiveStep('initial');
  };

  return (
    <div className="min-h-screen bg-[#070b13] flex flex-col font-sans overflow-x-hidden antialiased">
      
      {/* Top Banner Navigation Header */}
      <header className="border-b border-white/5 bg-[#090e18]/80 backdrop-blur-md px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-tight">CSAT Studio</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                  Intern Project
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block">Customer Feedback Campaign Builder</span>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Laptop className="w-3.5 h-3.5" /> Workspace Configured
            </span>
            <div className="h-4 w-px bg-slate-800 hidden md:block"></div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-350 hover:text-white bg-slate-900 border border-white/5 px-3.5 py-2 rounded-xl transition-all cursor-pointer hover:bg-slate-850"
            >
              GitHub Repo <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Left Hand: Campaign Editor controls panel (60%) */}
        <section className="flex-1 lg:flex-[1.2] flex flex-col min-w-[320px]">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-slate-200 flex items-center gap-2">
              Campaign Setup
            </h1>
            <p className="text-xs text-slate-500">
              Configure copy, media, rating metrics, and customize custom visual branding.
            </p>
          </div>
          
          <CampaignEditor
            content={content}
            setContent={setContent}
            styling={styling}
            setStyling={setStyling}
            onStepChange={setActiveStep}
          />
        </section>

        {/* Right Hand: High fidelity device preview (40%) */}
        <section className="flex-1 lg:flex-[0.8] flex flex-col items-center justify-start min-w-[300px]">
          <div className="w-full text-center lg:text-left mb-4 px-1">
            <h2 className="text-xl font-bold text-slate-200 flex items-center justify-center lg:justify-start gap-2">
              Device Sandbox
            </h2>
            <p className="text-xs text-slate-500">
              Interactive mobile environment showing live updates as you configure.
            </p>
          </div>
          
          <div className="w-full flex items-center justify-center">
            <DevicePreview
              content={content}
              styling={styling}
              activeStep={activeStep}
              onStepChange={setActiveStep}
              rating={previewRating}
              setRating={setPreviewRating}
              selectedTags={previewTags}
              setSelectedTags={setPreviewTags}
              comment={previewComment}
              setComment={setPreviewComment}
              onSubmit={handlePreviewSubmit}
              onClose={handlePreviewReset}
            />
          </div>
        </section>

      </main>

      {/* Footer / Status details */}
      <footer className="border-t border-white/5 bg-[#090e18]/40 px-6 py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Powered by Vite, React and Tailwind CSS</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" /> Real-time mobile rendering active
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
