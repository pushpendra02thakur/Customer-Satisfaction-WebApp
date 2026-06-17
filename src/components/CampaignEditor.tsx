import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Upload,
  Type,
  Palette,
  Layout,
  Star
} from 'lucide-react';
import type { CampaignContent, CampaignStyling } from './CSATPopup';

interface CampaignEditorProps {
  content: CampaignContent;
  setContent: React.Dispatch<React.SetStateAction<CampaignContent>>;
  styling: CampaignStyling;
  setStyling: React.Dispatch<React.SetStateAction<CampaignStyling>>;
  onStepChange: (step: 'initial' | 'feedback' | 'thankyou') => void;
}

// Preset themes for WOW factor
const PALETTE_PRESETS = [
  {
    name: 'Sunset Glow',
    backgroundColor: '#0f172a',
    titleColor: '#f8fafc',
    subtitleColor: '#94a3b8',
    buttonColor: '#f97316',
    buttonTextColor: '#ffffff',
    ratingSelectedColor: '#fbbf24',
    ratingUnselectedColor: '#475569',
  },
  {
    name: 'Ocean Breeze',
    backgroundColor: '#ffffff',
    titleColor: '#0f172a',
    subtitleColor: '#475569',
    buttonColor: '#0ea5e9',
    buttonTextColor: '#ffffff',
    ratingSelectedColor: '#eab308',
    ratingUnselectedColor: '#cbd5e1',
  },
  {
    name: 'Midnight Neon',
    backgroundColor: '#18181b',
    titleColor: '#fafafa',
    subtitleColor: '#a1a1aa',
    buttonColor: '#d946ef',
    buttonTextColor: '#ffffff',
    ratingSelectedColor: '#f59e0b',
    ratingUnselectedColor: '#3f3f46',
  },
  {
    name: 'Emerald Clean',
    backgroundColor: '#f8fafc',
    titleColor: '#0f172a',
    subtitleColor: '#64748b',
    buttonColor: '#10b981',
    buttonTextColor: '#ffffff',
    ratingSelectedColor: '#f59e0b',
    ratingUnselectedColor: '#cbd5e1',
  },
];

export const CampaignEditor: React.FC<CampaignEditorProps> = ({
  content,
  setContent,
  styling,
  setStyling,
  onStepChange,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'styling'>('content');
  const [openSection, setOpenSection] = useState<string>('initial');
  const [newTagInput, setNewTagInput] = useState('');
  const [fileError, setFileError] = useState('');

  // Toggle editor sections (Initial Feedback, Feedback Page, Thank You Page)
  const toggleSection = (section: string, targetStep?: 'initial' | 'feedback' | 'thankyou') => {
    setOpenSection(openSection === section ? '' : section);
    if (targetStep) {
      onStepChange(targetStep);
    }
  };

  // State update helpers
  const updateContent = <K extends keyof CampaignContent>(key: K, value: CampaignContent[K]) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const updateStyling = <K extends keyof CampaignStyling>(key: K, value: CampaignStyling[K]) => {
    setStyling((prev) => ({ ...prev, [key]: value }));
  };

  // Add reason tag
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    if (content.dynamicOptions.includes(newTagInput.trim())) {
      setNewTagInput('');
      return;
    }
    updateContent('dynamicOptions', [...content.dynamicOptions, newTagInput.trim()]);
    setNewTagInput('');
  };

  // Remove reason tag
  const handleRemoveTag = (indexToRemove: number) => {
    updateContent(
      'dynamicOptions',
      content.dynamicOptions.filter((_, idx) => idx !== indexToRemove)
    );
  };

  // Handle media file upload (images, gifs, lottie json)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError('');
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'json'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !validExtensions.includes(fileExtension)) {
      setFileError('Invalid format. Supported formats: PNG, JPG, JPEG, GIF, Lottie (.json)');
      return;
    }

    const reader = new FileReader();

    if (fileExtension === 'json') {
      // Read Lottie JSON file as text data URL or parse to check if it is a valid Lottie
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          // Verify it's a valid Lottie JSON
          JSON.parse(text);
          // Convert text to base64 data URI to be loaded in the <lottie-player>
          const base64Data = btoa(unescape(encodeURIComponent(text)));
          const dataUrl = `data:application/json;base64,${base64Data}`;
          setContent((prev) => ({
            ...prev,
            mediaUrl: dataUrl,
            mediaType: 'lottie',
          }));
        } catch (err) {
          setFileError('Invalid Lottie file structure. Please upload a valid JSON animation.');
        }
      };
      reader.readAsText(file);
    } else {
      // Read standard image files
      reader.onload = (event) => {
        setContent((prev) => ({
          ...prev,
          mediaUrl: event.target?.result as string,
          mediaType: 'image',
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply a preset theme
  const applyPreset = (preset: typeof PALETTE_PRESETS[0]) => {
    setStyling((prev) => ({
      ...prev,
      backgroundColor: preset.backgroundColor,
      titleColor: preset.titleColor,
      subtitleColor: preset.subtitleColor,
      buttonColor: preset.buttonColor,
      buttonTextColor: preset.buttonTextColor,
      ratingSelectedColor: preset.ratingSelectedColor,
      ratingUnselectedColor: preset.ratingUnselectedColor,
    }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-3xl border border-white/5 overflow-hidden">
      
      {/* Editor Main Tabs */}
      <div className="flex bg-slate-950/40 border-b border-white/5 p-2">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'content'
              ? 'bg-slate-800 text-white shadow-lg shadow-black/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Content
        </button>
        <button
          onClick={() => setActiveTab('styling')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'styling'
              ? 'bg-slate-800 text-white shadow-lg shadow-black/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Palette className="w-4 h-4" />
          Styling
        </button>
      </div>

      {/* Editor Inner Scroll Container */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        
        {/* ==================================================== */}
        {/* =================== CONTENT TAB =================== */}
        {/* ==================================================== */}
        {activeTab === 'content' && (
          <div className="space-y-3">
            
            {/* Accordion 1: Initial Feedback */}
            <div className="bg-slate-950/30 border border-white/5 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('initial', 'initial')}
                className="w-full flex items-center justify-between p-4 font-semibold text-slate-200 hover:text-white hover:bg-slate-850/20 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-bold border border-amber-500/10">1</span>
                  <span>Initial Feedback Screen</span>
                </div>
                {openSection === 'initial' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'initial' && (
                <div className="p-4 pt-1 border-t border-white/5 bg-slate-950/10 space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Title</label>
                    <input
                      type="text"
                      value={content.initialTitle}
                      onChange={(e) => updateContent('initialTitle', e.target.value)}
                      placeholder="e.g. How was your experience?"
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Subtitle</label>
                    <input
                      type="text"
                      value={content.initialSubtitle}
                      onChange={(e) => updateContent('initialSubtitle', e.target.value)}
                      placeholder="e.g. Tell us what you think in under 30 seconds."
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Feedback Page */}
            <div className="bg-slate-950/30 border border-white/5 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('feedback', 'feedback')}
                className="w-full flex items-center justify-between p-4 font-semibold text-slate-200 hover:text-white hover:bg-slate-850/20 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/10">2</span>
                  <span>Feedback Form Page</span>
                </div>
                {openSection === 'feedback' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'feedback' && (
                <div className="p-4 pt-1 border-t border-white/5 bg-slate-950/10 space-y-4 animate-fade-in">
                  
                  {/* Rating Type Stars / Numbers */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Rating Scale Style</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-700/40">
                      <button
                        onClick={() => updateContent('ratingType', 'stars')}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          content.ratingType === 'stars'
                            ? 'bg-slate-800 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" /> Stars (1-5)
                      </button>
                      <button
                        onClick={() => updateContent('ratingType', 'numbers')}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          content.ratingType === 'numbers'
                            ? 'bg-slate-800 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="font-extrabold text-[10px] border border-current rounded-full w-4 h-4 inline-flex items-center justify-center">5</span> Numbers (1-5)
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Options (Predefined reasons tag list) */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
                      Feedback Options (Dynamic Tags)
                    </label>
                    <p className="text-[10px] text-slate-500 mb-2">
                      Tags that users can select to justify their CSAT rating.
                    </p>
                    
                    {/* Add tag input form */}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Add tag (e.g. Support)"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                        className="flex-1 bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-500"
                      />
                      <button
                        onClick={handleAddTag}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Tag list */}
                    {content.dynamicOptions.length === 0 ? (
                      <div className="text-center py-4 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
                        <span className="text-xs text-slate-500">No options configured yet</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                        {content.dynamicOptions.map((tag, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-900 border border-slate-800 rounded-full px-3 py-1 flex items-center gap-1.5 text-xs text-slate-300 max-w-[150px] truncate"
                          >
                            <span className="truncate">{tag}</span>
                            <button
                              onClick={() => handleRemoveTag(idx)}
                              className="text-slate-500 hover:text-red-400 transition-colors focus:outline-none cursor-pointer"
                              title="Delete option"
                            >
                              <Plus className="w-3 h-3 rotate-45" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Additional Comment Switch Toggle */}
                  <div className="flex items-center justify-between py-2 border-t border-b border-white/5">
                    <div>
                      <span className="block text-xs font-semibold text-slate-200">Additional Comments</span>
                      <span className="block text-[10px] text-slate-500">Add text area for custom written reviews</span>
                    </div>
                    <button
                      onClick={() => updateContent('commentEnabled', !content.commentEnabled)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        content.commentEnabled ? 'bg-indigo-600' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          content.commentEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Submit Button Text */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Submit Button Text</label>
                    <input
                      type="text"
                      value={content.submitButtonText}
                      onChange={(e) => updateContent('submitButtonText', e.target.value)}
                      placeholder="e.g. Submit Rating"
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-500"
                    />
                  </div>

                </div>
              )}
            </div>

            {/* Accordion 3: Thank You Page */}
            <div className="bg-slate-950/30 border border-white/5 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('thankyou', 'thankyou')}
                className="w-full flex items-center justify-between p-4 font-semibold text-slate-200 hover:text-white hover:bg-slate-850/20 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/10">3</span>
                  <span>Thank You Screen</span>
                </div>
                {openSection === 'thankyou' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'thankyou' && (
                <div className="p-4 pt-1 border-t border-white/5 bg-slate-950/10 space-y-4 animate-fade-in">
                  
                  {/* Upload Media */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Upload Media Assets</label>
                    <p className="text-[10px] text-slate-500 mb-2.5">
                      Supports PNG, JPG, JPEG, GIF, Lottie (.json files).
                    </p>
                    
                    <div className="relative group border-2 border-dashed border-slate-800 hover:border-slate-650 transition-colors rounded-xl p-5 bg-slate-900/30 flex flex-col items-center justify-center text-center cursor-pointer">
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/gif, application/json"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className="w-7 h-7 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-slate-350 font-medium">Click to upload file</span>
                      <span className="text-[10px] text-slate-500 mt-1">Drag and drop files here</span>
                    </div>

                    {fileError && <p className="text-red-400 text-[10px] mt-1.5 font-medium">{fileError}</p>}
                    
                    {/* Media indicator */}
                    {content.mediaUrl && (
                      <div className="mt-3 flex items-center justify-between p-2 bg-slate-900/80 border border-white/5 rounded-xl">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-xs font-bold text-slate-300">
                            {content.mediaType === 'lottie' ? 'JSON' : 'IMG'}
                          </div>
                          <span className="text-xs text-slate-350 truncate max-w-[160px]">
                            {content.mediaType === 'lottie' ? 'Lottie Animation JSON' : 'Uploaded Image'}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            updateContent('mediaUrl', '');
                            updateContent('mediaType', 'image');
                          }}
                          className="text-slate-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                          title="Clear Asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Title</label>
                    <input
                      type="text"
                      value={content.thankYouTitle}
                      onChange={(e) => updateContent('thankYouTitle', e.target.value)}
                      placeholder="e.g. Thank you!"
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Subtitle</label>
                    <input
                      type="text"
                      value={content.thankYouSubtitle}
                      onChange={(e) => updateContent('thankYouSubtitle', e.target.value)}
                      placeholder="e.g. Your feedback helps us make AppStorys better."
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Button Text</label>
                    <input
                      type="text"
                      value={content.thankYouButtonText}
                      onChange={(e) => updateContent('thankYouButtonText', e.target.value)}
                      placeholder="e.g. Close"
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-500"
                    />
                  </div>

                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* =================== STYLING TAB =================== */}
        {/* ==================================================== */}
        {activeTab === 'styling' && (
          <div className="space-y-4">
            
            {/* Quick Presets Section */}
            <div className="bg-slate-950/20 border border-white/5 rounded-2xl p-4">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Preset Themes</span>
              <div className="grid grid-cols-2 gap-2">
                {PALETTE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyPreset(preset)}
                    className="flex flex-col text-left p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-bold text-slate-300 mb-1.5 group-hover:text-white">{preset.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: preset.backgroundColor }} title="Card Background" />
                      <span className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: preset.buttonColor }} title="Button Color" />
                      <span className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: preset.ratingSelectedColor }} title="Star Active Color" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors Accordion */}
            <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-4 space-y-3.5">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-350 uppercase tracking-wider border-b border-white/5 pb-2">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                Color Theme Customizer
              </span>
              
              {/* background color */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-350 font-medium">Background Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={styling.backgroundColor}
                    onChange={(e) => updateStyling('backgroundColor', e.target.value)}
                    className="w-20 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-center text-slate-300 uppercase font-mono"
                  />
                  <input
                    type="color"
                    value={styling.backgroundColor}
                    onChange={(e) => updateStyling('backgroundColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                  />
                </div>
              </div>

              {/* Title Color */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-350 font-medium">Title Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={styling.titleColor}
                    onChange={(e) => updateStyling('titleColor', e.target.value)}
                    className="w-20 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-center text-slate-300 uppercase font-mono"
                  />
                  <input
                    type="color"
                    value={styling.titleColor}
                    onChange={(e) => updateStyling('titleColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                  />
                </div>
              </div>

              {/* Subtitle Color */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-350 font-medium">Subtitle Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={styling.subtitleColor}
                    onChange={(e) => updateStyling('subtitleColor', e.target.value)}
                    className="w-20 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-center text-slate-300 uppercase font-mono"
                  />
                  <input
                    type="color"
                    value={styling.subtitleColor}
                    onChange={(e) => updateStyling('subtitleColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                  />
                </div>
              </div>

              {/* Button Color */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-350 font-medium">Button Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={styling.buttonColor}
                    onChange={(e) => updateStyling('buttonColor', e.target.value)}
                    className="w-20 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-center text-slate-300 uppercase font-mono"
                  />
                  <input
                    type="color"
                    value={styling.buttonColor}
                    onChange={(e) => updateStyling('buttonColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                  />
                </div>
              </div>

              {/* Button Text Color */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-350 font-medium">Button Text Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={styling.buttonTextColor}
                    onChange={(e) => updateStyling('buttonTextColor', e.target.value)}
                    className="w-20 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-center text-slate-300 uppercase font-mono"
                  />
                  <input
                    type="color"
                    value={styling.buttonTextColor}
                    onChange={(e) => updateStyling('buttonTextColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                  />
                </div>
              </div>

              {/* Star Rating Selected Color */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-350 font-medium">Rating Selected Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={styling.ratingSelectedColor}
                    onChange={(e) => updateStyling('ratingSelectedColor', e.target.value)}
                    className="w-20 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-center text-slate-300 uppercase font-mono"
                  />
                  <input
                    type="color"
                    value={styling.ratingSelectedColor}
                    onChange={(e) => updateStyling('ratingSelectedColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                  />
                </div>
              </div>

              {/* Star Rating Unselected Color */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-350 font-medium">Rating Unselected Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={styling.ratingUnselectedColor}
                    onChange={(e) => updateStyling('ratingUnselectedColor', e.target.value)}
                    className="w-20 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-center text-slate-300 uppercase font-mono"
                  />
                  <input
                    type="color"
                    value={styling.ratingUnselectedColor}
                    onChange={(e) => updateStyling('ratingUnselectedColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Layout Customizer Accordion */}
            <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-4 space-y-4">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-350 uppercase tracking-wider border-b border-white/5 pb-2">
                <Layout className="w-3.5 h-3.5 text-emerald-400" />
                Layout & Dimensions
              </span>

              {/* Border Radius */}
              <div>
                <div className="flex justify-between text-xs text-slate-350 font-medium mb-1">
                  <span>Border Radius</span>
                  <span className="font-mono text-slate-400">{styling.borderRadius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="36"
                  value={styling.borderRadius}
                  onChange={(e) => updateStyling('borderRadius', parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Button Width */}
              <div>
                <div className="flex justify-between text-xs text-slate-350 font-medium mb-1">
                  <span>Button Width</span>
                  <span className="font-mono text-slate-400">{styling.buttonWidth}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={styling.buttonWidth}
                  onChange={(e) => updateStyling('buttonWidth', parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Button Height */}
              <div>
                <div className="flex justify-between text-xs text-slate-350 font-medium mb-1">
                  <span>Button Height</span>
                  <span className="font-mono text-slate-400">{styling.buttonHeight}px</span>
                </div>
                <input
                  type="range"
                  min="32"
                  max="60"
                  value={styling.buttonHeight}
                  onChange={(e) => updateStyling('buttonHeight', parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>

            {/* Typography Customizer Accordion */}
            <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-4 space-y-3.5">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-350 uppercase tracking-wider border-b border-white/5 pb-2">
                <Type className="w-3.5 h-3.5 text-amber-400" />
                Typography
              </span>

              {/* Font Size Select */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-350 font-medium">Heading Size</span>
                <select
                  value={styling.fontSize}
                  onChange={(e) => updateStyling('fontSize', e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded px-2 py-1.5 focus:outline-none focus:border-slate-500 w-28 cursor-pointer"
                >
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                  <option value="xl">Extra Large</option>
                </select>
              </div>

              {/* Font Weight Select */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-350 font-medium">Heading Weight</span>
                <select
                  value={styling.fontWeight}
                  onChange={(e) => updateStyling('fontWeight', e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded px-2 py-1.5 focus:outline-none focus:border-slate-500 w-28 cursor-pointer"
                >
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="semibold">Semibold</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
