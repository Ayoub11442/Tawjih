import React, { useState, useRef, useCallback, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserTie, 
  faPaperPlane, 
  faComments, 
  faChevronLeft,
  faCircleCheck
} from '@fortawesome/free-solid-svg-icons';

// Improved custom hook with better type safety
const useIntersectionObserver = (options = { threshold: 0.1, rootMargin: '50px' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  
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

// Improved animated component with better transitions
const AnimatedElement = memo(({ 
  children, 
  isVisible, 
  delay = 0, 
  className = '' 
}: { 
  children: React.ReactNode, 
  isVisible: boolean, 
  delay?: number, 
  className?: string 
}) => (
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

// Section header with improved styling
const SectionHeader = memo(({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} className="text-center mb-10">
    <div className="inline-block mb-3 bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-blue-200 hover:text-blue-700 transition-colors duration-300">
      التواصل مع الخبراء
    </div>
    <h2 id="contact-experts-heading" className="text-3xl md:text-4xl font-bold mb-3 text-blue-900">
      تواصل مع خبرائنا للحصول على نصائح مهنية مخصصة!
    </h2>
    <p className="text-blue-700 max-w-2xl mx-auto text-sm md:text-base">
      هل تحتاج إلى استشارة مهنية؟ تواصل مع مختصين في مجالك واحصل على نصائح مباشرة.
    </p>
  </AnimatedElement>
));
SectionHeader.displayName = 'SectionHeader';

// Types for expert data
interface ExpertData {
  id: string;
  name: string;
  title: string;
  specialization: string;
  imageUrl: string;
  availability: string;
  responseTime: string;
}

// Expert data moved to separate constant
const EXPERTS_DATA: ExpertData[] = [
  {
    id: "expert-1",
    name: "أحمد الجاسم",
    title: "مستشار تطوير مهني",
    specialization: "تكنولوجيا المعلومات",
    imageUrl: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    availability: "متاح الآن",
    responseTime: "يرد خلال ٢٤ ساعة"
  },
  {
    id: "expert-2",
    name: "سارة العلي",
    title: "مديرة موارد بشرية",
    specialization: "إدارة الأعمال",
    imageUrl: "https://images.pexels.com/photos/4620842/pexels-photo-4620842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    availability: "متاح الآن",
    responseTime: "يرد خلال ١٢ ساعة"
  },
  {
    id: "expert-3",
    name: "محمد الصالح",
    title: "مستشار استراتيجي",
    specialization: "ريادة الأعمال",
    imageUrl: "https://images.pexels.com/photos/8217880/pexels-photo-8217880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    availability: "متاح الآن",
    responseTime: "يرد خلال ٤٨ ساعة"
  }
];

// Improved expert card with better hover effects
const ExpertCard = memo(({ expert, isVisible, delay }: { expert: ExpertData, isVisible: boolean, delay: number }) => (
  <AnimatedElement isVisible={isVisible} delay={delay}>
    <div className="bg-white border border-blue-100 rounded-xl p-4 flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all duration-300 group">
      <div className="relative">
        <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-blue-200 group-hover:border-blue-300 transition-colors duration-300">
          <img src={expert.imageUrl} alt={expert.name} className="h-full w-full object-cover" />
        </div>
        <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white" aria-hidden="true"></span>
      </div>
      
      <div className="flex-1">
        <h3 className="font-bold text-blue-900 group-hover:text-blue-700 transition-colors duration-300">{expert.name}</h3>
        <p className="text-blue-700 text-sm">{expert.title}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
            {expert.specialization}
          </span>
          <span className="text-green-600 text-xs flex items-center gap-1">
            <FontAwesomeIcon icon={faCircleCheck} className="h-3 w-3" />
            {expert.availability}
          </span>
        </div>
      </div>
    </div>
  </AnimatedElement>
));
ExpertCard.displayName = 'ExpertCard';

// Form result feedback component
const FormFeedback = memo(({ result }: { result: { success?: boolean; message?: string } | null }) => {
  if (!result) return null;
  
  return (
    <div 
      className={`mt-4 p-3 rounded-lg ${
        result.success 
          ? 'bg-green-100 text-green-700 border border-green-200' 
          : 'bg-red-100 text-red-700 border border-red-200'
      } animate-fadeIn`}
      role="status"
    >
      {result.message}
    </div>
  );
});
FormFeedback.displayName = 'FormFeedback';

// Main component with better structure
const ContactExperts: React.FC = () => {
  const { elementRef, isVisible } = useIntersectionObserver();
  const [inquiry, setInquiry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{success?: boolean; message?: string} | null>(null);
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiry.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInquiry('');
      setSubmitResult({ success: true, message: 'تم إرسال استفسارك بنجاح! سيتواصل معك أحد الخبراء قريبًا.' });
    } catch (error) {
      setSubmitResult({ success: false, message: 'حدث خطأ. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [inquiry]);

  return (
    <section
      ref={elementRef}
      id="contact-experts-section"
      className="py-16 md:py-20 bg-blue-50 relative overflow-hidden"
      aria-labelledby="contact-experts-heading"
      dir="rtl"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <SectionHeader isVisible={isVisible} />
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact form */}
            <AnimatedElement isVisible={isVisible} delay={1} className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                    <FontAwesomeIcon icon={faComments} className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900">أرسل استفسارك</h3>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="inquiry" className="block text-blue-900 font-medium mb-2">
                      اكتب استفسارك هنا:
                    </label>
                    <textarea
                      id="inquiry"
                      value={inquiry}
                      onChange={(e) => setInquiry(e.target.value)}
                      className="w-full rounded-lg border-blue-200 p-3 resize-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 min-h-32 text-right transition-colors duration-300"
                      placeholder="ما هي النصيحة المهنية التي تحتاجها؟"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-blue-600">سيتم الرد عليك خلال ٢٤ ساعة</p>
                    <button 
                      type="submit"
                      className="group relative inline-flex items-center justify-center bg-blue-500 text-white font-bold py-2 px-5 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 hover:bg-blue-600"
                      disabled={isSubmitting}
                    >
                      <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out bg-blue-600 rounded-lg scale-0 group-hover:scale-100 group-hover:opacity-100 opacity-0" aria-hidden="true"></span>
                      <span className="relative flex items-center gap-2">
                        <span>{isSubmitting ? 'جاري الإرسال...' : 'أرسل'}</span>
                        <FontAwesomeIcon 
                          icon={faPaperPlane} 
                          className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                        />
                      </span>
                    </button>
                  </div>
                  
                  <FormFeedback result={submitResult} />
                </form>
              </div>
            </AnimatedElement>
            
            {/* Available experts */}
            <AnimatedElement isVisible={isVisible} delay={2}>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                  <FontAwesomeIcon icon={faUserTie} className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold text-blue-900">خبراء متاحون الآن</h3>
              </div>
              
              <div className="flex flex-col gap-3">
                {EXPERTS_DATA.map((expert, index) => (
                  <ExpertCard 
                    key={expert.id} 
                    expert={expert} 
                    isVisible={isVisible} 
                    delay={index + 3}
                  />
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button 
                  className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-300 flex items-center gap-1 mx-auto hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 rounded-md px-2"
                >
                  <span>عرض المزيد من الخبراء</span>
                  <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3 group-hover:transform group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactExperts;