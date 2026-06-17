import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, RotateCcw } from 'lucide-react';
import { CSATPopup } from './CSATPopup';
import type { CampaignContent, CampaignStyling } from './CSATPopup';

interface DevicePreviewProps {
  content: CampaignContent;
  styling: CampaignStyling;
  activeStep: 'initial' | 'feedback' | 'thankyou';
  onStepChange: (step: 'initial' | 'feedback' | 'thankyou') => void;
  rating: number;
  setRating: (rating: number) => void;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  comment: string;
  setComment: (comment: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export const DevicePreview: React.FC<DevicePreviewProps> = ({
  content,
  styling,
  activeStep,
  onStepChange,
  rating,
  setRating,
  selectedTags,
  setSelectedTags,
  comment,
  setComment,
  onSubmit,
  onClose,
}) => {
  const [time, setTime] = useState('09:41');

  // Simple clock effect to make the phone mock feel real
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const strMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const strHours = hours < 10 ? `0${hours}` : `${hours}`;
      setTime(`${strHours}:${strMinutes}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {/* Device Mode Instructions */}
      <div className="flex items-center justify-between w-full max-w-[320px] mb-3 px-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Mobile Live Preview
        </span>
        <button
          onClick={onClose}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium hover:underline focus:outline-none transition-colors cursor-pointer"
          title="Reset Preview State"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Survey
        </button>
      </div>

      {/* High-Fidelity Phone Frame Container */}
      <div className="relative w-[340px] h-[660px] bg-slate-950 rounded-[50px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[4px] border-slate-800 ring-12 ring-slate-900 flex flex-col overflow-hidden animate-scale-in">
        
        {/* Realistic Speaker/Camera Notch (Dynamic Island Mock) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-center border border-slate-900">
          <div className="w-2.5 h-2.5 bg-[#08081a] rounded-full absolute left-4 border border-slate-950"></div>
          <div className="w-1.5 h-1.5 bg-indigo-950 rounded-full absolute left-5"></div>
          <div className="w-6 h-1 bg-[#101015] rounded-full absolute right-4"></div>
        </div>

        {/* Status Bar */}
        <div className="w-full px-7 pt-3 pb-1 flex justify-between items-center text-white text-[11px] font-semibold select-none z-20 bg-slate-950">
          <span className="text-[11px] font-bold tracking-tight text-slate-200">{time}</span>
          <div className="flex items-center gap-1.5 text-slate-200">
            <Signal className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span className="text-[9px] uppercase tracking-tighter">5G</span>
            <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
            <Battery className="w-4.5 h-4.5" strokeWidth={2} />
          </div>
        </div>

        {/* Phone Content Canvas Area */}
        <div className="relative flex-1 rounded-[40px] overflow-hidden bg-cover bg-center flex flex-col justify-end pb-12 items-center z-10"
             style={{
               backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.95)), url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80")',
             }}>
          
          {/* Top Quick Step Selector (Overlay inside phone) */}
          <div className="absolute top-6 left-0 right-0 px-4 flex justify-center z-20">
            <div className="flex bg-black/50 backdrop-blur-md rounded-full p-1 border border-white/5 shadow-lg max-w-[280px]">
              {(['initial', 'feedback', 'thankyou'] as const).map((step) => (
                <button
                  key={step}
                  onClick={() => onStepChange(step)}
                  className={`text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    activeStep === step
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {step === 'initial' && 'Start'}
                  {step === 'feedback' && 'Form'}
                  {step === 'thankyou' && 'Thank You'}
                </button>
              ))}
            </div>
          </div>

          {/* Render the actual CSAT Popup here, positioned floating from the bottom of the device */}
          <div className="w-full flex justify-center px-4 animate-slide-up z-10 mb-2">
            <CSATPopup
              content={content}
              styling={styling}
              activeStep={activeStep}
              onStepChange={onStepChange}
              rating={rating}
              setRating={setRating}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              comment={comment}
              setComment={setComment}
              onSubmit={onSubmit}
              onClose={onClose}
            />
          </div>

          {/* Interactive hints or bottom bar */}
          <div className="absolute bottom-6 text-center select-none opacity-40 hover:opacity-80 transition-opacity">
            <p className="text-[10px] text-white/60 tracking-wider">
              {activeStep === 'initial' && 'Tap Button to Start survey'}
              {activeStep === 'feedback' && 'Select rate and click Submit'}
              {activeStep === 'thankyou' && 'Tap Close to start again'}
            </p>
          </div>

          {/* Safe Area Home indicator bar at bottom */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-20"></div>
        </div>
      </div>
    </div>
  );
};
