import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GlobeIcon, ChevronDownIcon } from 'lucide-react';
import { Language } from '@/types';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages=[{
    code:"en",
    name:"English"
  },{
    code:"ta",
    name:"Tamil"
  }]
  const isLoading=false
  // Fetch available languages from API
   


  // Find current language
  const currentLanguage = languages?.find((lang: Language) => lang.code === i18n.language) || { 
    code: 'en', 
    name: 'English' 
  };

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    setIsOpen(false);
  };

  // Set initial language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <GlobeIcon className="h-4 w-4 mr-1" />
          <span>{currentLanguage.name}</span>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {isLoading ? (
          <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
        ) : (
          languages?.map((language: Language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`cursor-pointer ${language.code === i18n.language ? 'bg-accent/50' : ''}`}
            >
              {language.name}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
