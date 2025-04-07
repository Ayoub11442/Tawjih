import React, { useRef, useState, memo, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInstagram, 
  faLinkedin, 
  faTwitter 
} from '@fortawesome/free-brands-svg-icons';
import { 
  faEnvelope,
  faCircleInfo,
  faShield,
  faFileContract
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// Define intersection observer hook types
interface IntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
}

const useIntersectionObserver = (options: IntersectionObserverOptions = { threshold: 0.1, rootMargin: '50px' }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement | null>(null);
  
  React.useEffect(() => {
    const currentElement = elementRef.current;
    
    if (!currentElement || isVisible) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      options
    );
    
    observer.observe(currentElement);
    
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, isVisible]);

  return { elementRef, isVisible };
};

// AnimatedElement component types
interface AnimatedElementProps {
  children: ReactNode;
  isVisible: boolean;
  delay?: number;
  className?: string;
}

const AnimatedElement = memo(({ 
  children, 
  isVisible, 
  delay = 0, 
  className = '' 
}: AnimatedElementProps) => (
  <div
    className={`transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    } ${className}`}
    style={{ transitionDelay: `${delay * 100}ms` }}
  >
    {children}
  </div>
));
AnimatedElement.displayName = 'AnimatedElement';

// FooterLink component types
interface FooterLinkProps {
  href: string;
  icon?: IconDefinition;
  children: ReactNode;
}

const FooterLink = memo(({ href, icon, children }: FooterLinkProps) => (
  <a 
    href={href} 
    className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
  >
    {icon && (
      <FontAwesomeIcon 
        icon={icon} 
        className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" 
      />
    )}
    <span className="group-hover:underline">{children}</span>
  </a>
));
FooterLink.displayName = 'FooterLink';

// SocialIcon component types
interface SocialIconProps {
  href: string;
  icon: IconDefinition;
  label: string;
}

const SocialIcon = memo(({ href, icon, label }: SocialIconProps) => (
  <a 
    href={href}
    aria-label={label}
    className="bg-blue-800 hover:bg-blue-700 text-blue-200 hover:text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
  >
    <FontAwesomeIcon icon={icon} className="h-5 w-5" />
  </a>
));
SocialIcon.displayName = 'SocialIcon';

// Define submit result type
interface SubmitResult {
  success: boolean;
  message: string;
}

// Main Footer Component
const Footer: React.FC = () => {
  const { elementRef, isVisible } = useIntersectionObserver();
  const [email, setEmail] = useState<string>('');
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmail('');
      setSubmitResult({ success: true, message: 'تم استلام بريدك الإلكتروني بنجاح!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitResult(null), 3000);
    } catch (error) {
      setSubmitResult({ success: false, message: 'حدث خطأ. يرجى المحاولة مرة أخرى.' });
    }
  };

  return (
    <footer 
      ref={elementRef}
      className="bg-blue-900 text-white py-12 relative overflow-hidden"
      dir="rtl"
    >
      {/* Background subtle pattern */}
      <div 
        className="absolute inset-0 opacity-5" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px' 
        }}
        aria-hidden="true" 
      />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {/* Company Info */}
          <AnimatedElement isVisible={isVisible} delay={0}>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white border-b border-blue-700 pb-2 mb-4">
                عن الموقع
              </h3>
              <p className="text-blue-100 mb-4 text-sm">
                منصتنا توفر خدمات احترافية للتوجيه المهني وتطوير المهارات وفرص عمل مميزة في جميع المجالات.
              </p>
              <div className="flex gap-3">
                <SocialIcon href="#instagram" icon={faInstagram} label="انستقرام" />
                <SocialIcon href="#linkedin" icon={faLinkedin} label="لينكد إن" />
                <SocialIcon href="#twitter" icon={faTwitter} label="تويتر" />
              </div>
            </div>
          </AnimatedElement>
          
          {/* Links */}
          <AnimatedElement isVisible={isVisible} delay={1}>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white border-b border-blue-700 pb-2 mb-4">
                روابط أساسية
              </h3>
              <ul className="space-y-3">
                <li>
                  <FooterLink href="/about" icon={faCircleInfo}>
                    عن الموقع
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/terms" icon={faFileContract}>
                    شروط الاستخدام
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/privacy" icon={faShield}>
                    الخصوصية
                  </FooterLink>
                </li>
              </ul>
            </div>
          </AnimatedElement>
          
          {/* Contact Form */}
          <AnimatedElement isVisible={isVisible} delay={2}>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white border-b border-blue-700 pb-2 mb-4">
                تواصل معنا
              </h3>
              <p className="text-blue-100 text-sm mb-4">
                هل لديك سؤال؟ تواصل معنا عبر البريد الإلكتروني
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-900">
                    <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
                  </div>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    className="w-full pl-3 pr-10 py-2 rounded-lg text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 border-2 border-transparent text-right"
                    required
                  />
                </div>
                
                <button 
                  type="submit"
                  className="group w-full relative inline-flex items-center justify-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-300 hover:bg-blue-500"
                >
                  <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out bg-blue-500 rounded-lg scale-0 group-hover:scale-100 group-hover:opacity-100 opacity-0" aria-hidden="true"></span>
                  <span className="relative">إرسال</span>
                </button>
                
                {submitResult && (
                  <div 
                    className={`mt-2 p-2 rounded-lg text-sm ${
                      submitResult.success 
                        ? 'bg-green-800 text-green-100' 
                        : 'bg-red-800 text-red-100'
                    } animate-fadeIn`}
                  >
                    {submitResult.message}
                  </div>
                )}
              </form>
            </div>
          </AnimatedElement>
        </div>
        
        {/* Copyright */}
        <AnimatedElement isVisible={isVisible} delay={3}>
          <div className="mt-10 pt-6 border-t border-blue-800 text-center text-blue-200 text-sm">
            <p>© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
          </div>
        </AnimatedElement>
      </div>
    </footer>
  );
};

export default Footer;