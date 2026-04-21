import React, { useState, useEffect } from 'react';
import { useI18n } from '../I18nContext';
import { translateText } from '../services/translationService';

interface AITranslateProps {
  children: string;
  className?: string;
  as?: any;
}

/**
 * A component that automatically translates its children text using Gemini AI
 * based on the current application language.
 * Falls back to original text if translation fails or is in progress.
 */
export function AITranslate({ children, className, as: Tag = 'span' }: AITranslateProps) {
  const { lang } = useI18n();
  const [translatedText, setTranslatedText] = useState(children);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // If the language is English, we assume the source is already English or fine as is.
    // However, if the user wants "EVERYTHING" translated, we should check if it's already translated.
    if (lang === 'en') {
      setTranslatedText(children);
      return;
    }

    const performTranslation = async () => {
      setIsTranslating(true);
      try {
        const result = await translateText(children, lang);
        setTranslatedText(result);
      } catch (err) {
        console.error("AITranslate error:", err);
      } finally {
        setIsTranslating(false);
      }
    };

    performTranslation();
  }, [children, lang]);

  return (
    <Tag className={`${className || ''} ${isTranslating ? 'opacity-70 animate-pulse' : ''}`}>
      {translatedText}
    </Tag>
  );
}
