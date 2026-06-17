import React from 'react';
import { Star, X } from 'lucide-react';

export interface CampaignContent {
  initialTitle: string;
  initialSubtitle: string;
  ratingType: 'stars' | 'numbers';
  dynamicOptions: string[];
  commentEnabled: boolean;
  submitButtonText: string;
  mediaUrl: string;
  mediaType: 'image' | 'lottie';
  thankYouTitle: string;
  thankYouSubtitle: string;
  thankYouButtonText: string;
}

export interface CampaignStyling {
  backgroundColor: string;
  titleColor: string;
  subtitleColor: string;
  buttonColor: string;
  buttonTextColor: string;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  borderRadius: number;
  buttonWidth: number;
  buttonHeight: number;
  ratingSelectedColor: string;
  ratingUnselectedColor: string;
}

interface CSATPopupProps {
  content: CampaignContent;
  styling: CampaignStyling;
  activeStep: 'initial' | 'feedback' | 'thankyou';
  onStepChange: (step: 'initial' | 'feedback' | 'thankyou') => void;
  // Local preview interaction state
  rating: number;
  setRating: (rating: number) => void;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  comment: string;
  setComment: (comment: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export const CSATPopup: React.FC<CSATPopupProps> = ({
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
  // Map font settings
  const getFontSizeClass = (type: 'title' | 'subtitle' | 'body') => {
    if (type === 'title') {
      switch (styling.fontSize) {
        case 'sm': return 'text-base';
        case 'md': return 'text-lg';
        case 'lg': return 'text-xl';
        case 'xl': return 'text-2xl';
      }
    } else if (type === 'subtitle') {
      switch (styling.fontSize) {
        case 'sm': return 'text-xs';
        case 'md': return 'text-sm';
        case 'lg': return 'text-sm md:text-base';
        case 'xl': return 'text-base';
      }
    } else {
      switch (styling.fontSize) {
        case 'sm': return 'text-xs';
        case 'md': return 'text-xs sm:text-sm';
        case 'lg': return 'text-sm';
        case 'xl': return 'text-sm';
      }
    }
  };

  const getFontWeightClass = () => {
    switch (styling.fontWeight) {
      case 'normal': return 'font-normal';
      case 'medium': return 'font-medium';
      case 'semibold': return 'font-semibold';
      case 'bold': return 'font-bold';
    }
  };

  // Toggle feedback option tag
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Render uploaded Lottie or Image
  const renderMedia = () => {
    if (!content.mediaUrl) {
      return (
        <div className="w-24 h-24 mx-auto flex items-center justify-center bg-gray-800/50 rounded-full border border-dashed border-gray-700">
          <Star className="w-8 h-8 text-yellow-500 animate-pulse" />
        </div>
      );
    }

    if (content.mediaType === 'lottie') {
      return (
        <div className="w-28 h-28 mx-auto flex items-center justify-center">
          {/* Custom Web Component Lottie Player, rendered via React.createElement to avoid JSX intrinsic type errors */}
          {React.createElement('lottie-player', {
            src: content.mediaUrl,
            background: 'transparent',
            speed: '1',
            style: { width: '110px', height: '110px' },
            loop: true,
            autoplay: true,
          })}
        </div>
      );
    }

    return (
      <img
        src={content.mediaUrl}
        alt="Thank You Media"
        className="w-28 h-28 object-contain mx-auto rounded-lg"
        onError={(e) => {
          // If error loading, fallback
          (e.target as HTMLImageElement).src = 'https://illustrations.popsy.co/white/success.svg';
        }}
      />
    );
  };

  // Inline styling shortcuts
  const cardStyle = {
    backgroundColor: styling.backgroundColor,
    borderRadius: `${styling.borderRadius}px`,
  };

  const titleStyle = {
    color: styling.titleColor,
  };

  const subtitleStyle = {
    color: styling.subtitleColor,
  };

  const buttonStyle = {
    backgroundColor: styling.buttonColor,
    color: styling.buttonTextColor,
    borderRadius: `${styling.borderRadius}px`,
    width: `${styling.buttonWidth}%`,
    height: `${styling.buttonHeight}px`,
  };

  return (
    <div
      style={cardStyle}
      className="w-[90%] max-w-[340px] p-6 shadow-2xl relative overflow-hidden transition-all duration-300 border border-white/10 animate-scale-in"
    >
      {/* Close button in top-right */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Close CSAT Survey"
      >
        <X className="w-4 h-4" style={{ color: styling.subtitleColor }} />
      </button>

      {/* --- Step 1: Initial Feedback Screen --- */}
      {activeStep === 'initial' && (
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          {/* Subtle Icon Indicator */}
          <div className="p-3 bg-white/5 rounded-full mb-1 border border-white/5">
            <Star className="w-7 h-7 text-yellow-400 fill-yellow-400 animate-spin-slow" />
          </div>

          <h3
            style={titleStyle}
            className={`${getFontSizeClass('title')} ${getFontWeightClass()} leading-tight break-words w-full`}
          >
            {content.initialTitle || 'How was your experience?'}
          </h3>

          <p
            style={subtitleStyle}
            className={`${getFontSizeClass('subtitle')} leading-relaxed opacity-90 break-words w-full`}
          >
            {content.initialSubtitle || 'Tell us what you think in under 30 seconds.'}
          </p>

          <button
            style={buttonStyle}
            onClick={() => onStepChange('feedback')}
            className="flex items-center justify-center font-semibold text-sm transition-transform active:scale-95 duration-150 hover:brightness-110 cursor-pointer phone-btn-shadow mt-2 w-full"
          >
            Start Feedback
          </button>
        </div>
      )}

      {/* --- Step 2: Feedback Rating Screen --- */}
      {activeStep === 'feedback' && (
        <div className="flex flex-col space-y-4 text-center py-1">
          <div className="text-left">
            <h3
              style={titleStyle}
              className={`${getFontSizeClass('title')} ${getFontWeightClass()} leading-tight text-center break-words`}
            >
              {content.initialTitle || 'How was your experience?'}
            </h3>
          </div>

          {/* Rating Scale Selection */}
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((index) => {
              const isSelected = rating >= index;
              const activeColor = styling.ratingSelectedColor;
              const inactiveColor = styling.ratingUnselectedColor;

              return (
                <button
                  key={index}
                  onClick={() => setRating(index)}
                  className="rating-star-hover cursor-pointer p-1 focus:outline-none transition-all"
                  aria-label={`Rate ${index} out of 5`}
                >
                  {content.ratingType === 'stars' ? (
                    <Star
                      className="w-8 h-8"
                      style={{
                        color: isSelected ? activeColor : inactiveColor,
                        fill: isSelected ? activeColor : 'transparent',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        borderColor: isSelected ? activeColor : inactiveColor,
                        backgroundColor: isSelected ? activeColor : 'transparent',
                        color: isSelected ? styling.buttonTextColor : styling.titleColor,
                      }}
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all`}
                    >
                      {index}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dynamic Reason Tags */}
          {content.dynamicOptions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center py-1 max-h-[110px] overflow-y-auto pr-1">
              {content.dynamicOptions.map((option, idx) => {
                const isSelected = selectedTags.includes(option);
                return (
                  <button
                    key={idx}
                    onClick={() => handleTagToggle(option)}
                    style={{
                      borderColor: isSelected ? styling.buttonColor : 'rgba(156,163,175,0.3)',
                      backgroundColor: isSelected ? `${styling.buttonColor}15` : 'transparent',
                      color: isSelected ? styling.buttonColor : styling.subtitleColor,
                    }}
                    className="px-2.5 py-1 text-xs border rounded-full font-medium transition-colors hover:brightness-105 active:scale-95 cursor-pointer max-w-[140px] truncate"
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {/* Optional Text Area Comment */}
          {content.commentEnabled && (
            <textarea
              placeholder="What could we improve? (Optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                color: styling.titleColor,
                borderColor: 'rgba(156,163,175,0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
              }}
              rows={2}
              className="w-full text-xs p-2.5 rounded-lg border focus:ring-1 focus:ring-slate-500 focus:outline-none resize-none placeholder-gray-500"
            />
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-1 w-full">
            <button
              style={buttonStyle}
              onClick={onSubmit}
              className="flex items-center justify-center font-semibold text-sm transition-transform active:scale-95 duration-150 hover:brightness-110 cursor-pointer phone-btn-shadow w-full"
            >
              {content.submitButtonText || 'Submit Rating'}
            </button>
          </div>
        </div>
      )}

      {/* --- Step 3: Thank You Screen --- */}
      {activeStep === 'thankyou' && (
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          {/* Animated Media render */}
          <div className="mb-1">{renderMedia()}</div>

          <h3
            style={titleStyle}
            className={`${getFontSizeClass('title')} ${getFontWeightClass()} leading-tight break-words w-full`}
          >
            {content.thankYouTitle || 'Thank you!'}
          </h3>

          <p
            style={subtitleStyle}
            className={`${getFontSizeClass('subtitle')} leading-relaxed opacity-90 break-words w-full`}
          >
            {content.thankYouSubtitle || 'Your feedback helps us make AppStorys better.'}
          </p>

          <button
            style={buttonStyle}
            onClick={onClose}
            className="flex items-center justify-center font-semibold text-sm transition-transform active:scale-95 duration-150 hover:brightness-110 cursor-pointer phone-btn-shadow mt-2 w-full"
          >
            {content.thankYouButtonText || 'Close'}
          </button>
        </div>
      )}
    </div>
  );
};
