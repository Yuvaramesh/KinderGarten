import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, Send, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Message, ImageAnalysisRequest, ImageAnalysisResponse } from '@/types';
import { nanoid } from 'nanoid';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useToast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  uploadedImage: string | null;
  settings: {
    voiceAssistant: boolean;
    autoRead: boolean;
    accessibility: boolean;
  };
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  setMessages, 
  uploadedImage,
  settings
}) => {
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const sessionId = useRef(nanoid());
  const { toast } = useToast();
  
  // Speech recognition hook for voice input
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript,
    isBrowserSupported: isSpeechRecognitionSupported
  } = useSpeechRecognition();
  
  // Speech synthesis hook for reading responses
  const { 
    speak, 
    cancel,
    isBrowserSupported: isSpeechSynthesisSupported
  } = useSpeechSynthesis();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Process transcript when it changes during voice input
  useEffect(() => {
    if (transcript) {
      setUserInput(transcript);
    }
  }, [transcript]);

  // Auto-read the last assistant message if enabled
  useEffect(() => {
    if (settings.autoRead && isSpeechSynthesisSupported && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        speak(lastMessage.content);
      }
    }
  }, [messages, settings.autoRead, speak, isSpeechSynthesisSupported]);

  // // Analyze image mutation
  // const analyzeImageMutation = useMutation({
  //   mutationFn: async (data: ImageAnalysisRequest) => {
  //     const response = await apiRequest('POST', '/api/analyze', data);
  //     return response.json() as Promise<ImageAnalysisResponse>;
  //   },
  //   onSuccess: (data) => {
  //     setMessages(prev => [...prev, {
  //       role: 'assistant',
  //       content: data.content,
  //       timestamp: data.timestamp
  //     }]);
  //     setIsTyping(false);
  //   },
  //   onError: (error) => {
  //     console.error('Error analyzing image:', error);
  //     toast({
  //       title: 'Error',
  //       description: t('errors.general'),
  //       variant: 'destructive',
  //     });
  //     setIsTyping(false);
  //   }
  // });

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Check if image is uploaded
    if (!uploadedImage) {
      toast({
        title: 'No image',
        description: t('chat.noImage'),
        variant: 'destructive',
      });
      return;
    }
    
    // Add user message to chat
    setMessages(prev => [...prev, {
      role: 'user',
      content: userInput,
      timestamp: new Date().toISOString()
    }]);
    
    // Reset input and show typing indicator
    setIsTyping(true);
    setUserInput('');
    resetTranscript();
    
    // Cancel any ongoing speech
    if (settings.autoRead) {
      cancel();
    }
    
    // Prepare request data
    const requestData: ImageAnalysisRequest = {
      prompt: userInput,
      image: uploadedImage,
      sessionId: sessionId.current,
      language: i18n.language
    };
    
    // Call API
    // analyzeImageMutation.mutate(requestData);
  };

  const handleVoiceRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="material-icons text-sm">smart_toy</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm max-w-xs sm:max-w-md md:max-w-lg">
                <p className="text-sm">
                  {t('chat.welcome')}
                </p>
              </div>
            </div>
          )}

          {/* Render messages */}
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex items-start ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role !== 'user' && (
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="material-icons text-sm">smart_toy</span>
                  </div>
                </div>
              )}
              
              <div 
                className={`${
                  message.role === 'user' 
                    ? 'bg-primary text-white order-2' 
                    : 'bg-white dark:bg-gray-800'
                } rounded-lg p-4 shadow-sm max-w-xs sm:max-w-md md:max-w-lg`}
              >
                {message.role === 'assistant' && message.content.includes('- ') ? (
                  <div>
                    <p className="text-sm mb-2">
                      {message.content.split('\n')[0]}
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {message.content.split('\n')
                        .filter(line => line.trim().startsWith('- '))
                        .map((line, idx) => (
                          <li key={idx}>{line.substring(2)}</li>
                        ))}
                    </ul>
                    <p className="text-sm mt-3">
                      {message.content.split('\n')
                        .filter(line => !line.trim().startsWith('- ') && line !== message.content.split('\n')[0])
                        .join('\n')}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
              
              {message.role === 'user' && (
                <div className="flex-shrink-0 ml-3 order-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <span className="material-icons text-sm">person</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="material-icons text-sm">smart_toy</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "-0.32s" }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "-0.16s" }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            {settings.voiceAssistant && isSpeechRecognitionSupported && (
              <Button 
                type="button" 
                size="icon"
                variant="ghost"
                className={`text-gray-400 hover:text-primary ${isListening ? 'text-primary animate-pulse' : ''}`}
                onClick={handleVoiceRecording}
              >
                <Mic className="h-5 w-5" />
              </Button>
            )}
            
            <div className="relative flex-1">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={t('chat.placeholder')}
                className="w-full rounded-full pr-10"
              />
              {userInput && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setUserInput('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <Button 
              type="submit"
              size="icon"
              className="rounded-full"
              disabled={!userInput.trim() || isTyping}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          
          {isListening && (
            <div className="mt-2 text-sm text-center text-primary animate-pulse">
              {t('chat.listening')}
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay for processing images */}
      {/* {analyzeImageMutation.isPending && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm w-full">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium mb-2">{t('chat.processing')}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {t('chat.processingDesc')}
              </p>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ChatInterface;
