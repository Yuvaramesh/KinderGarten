import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, X, Send } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTranslation } from 'react-i18next';

interface VoiceAssistantProps {
  onSubmit: (text: string) => void;
  isEnabled: boolean;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onSubmit, isEnabled }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const { 
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isBrowserSupported
  } = useSpeechRecognition();

  // Don't render if voice assistant is disabled or not supported
  if (!isEnabled || !isBrowserSupported) return null;

  const handleOpenModal = () => {
    setIsModalOpen(true);
    resetTranscript();
    startListening();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    stopListening();
    resetTranscript();
  };

  const handleSendVoiceInput = () => {
    if (transcript.trim()) {
      onSubmit(transcript.trim());
    }
    handleCloseModal();
  };

  return (
    <>
      {/* Floating voice assistant button */}
      <div className="fixed bottom-6 right-6 z-10">
        <Button 
          onClick={handleOpenModal}
          className="w-14 h-14 rounded-full bg-secondary text-white shadow-lg hover:bg-violet-600"
          size="icon"
        >
          <Mic className="h-6 w-6" />
        </Button>
      </div>

      {/* Voice active modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-20">
          <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-xl p-6 shadow-xl">
            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 rounded-full bg-secondary text-white shadow-lg flex items-center justify-center mb-4 ${isListening ? 'animate-pulse' : ''}`}>
                <Mic className="h-8 w-8" />
              </div>
              <p className="text-lg font-medium mb-2">{t('voice.listening')}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('voice.speak')}</p>
              
              {transcript && (
                <div className="w-full max-w-lg mx-auto p-4 border rounded-md bg-gray-50 dark:bg-gray-700 mb-4 break-words">
                  {transcript}
                </div>
              )}
              
              <div className="flex space-x-4">
                <Button 
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('voice.cancel')}
                </Button>
                <Button 
                  onClick={handleSendVoiceInput}
                  disabled={!transcript.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {t('voice.send')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
