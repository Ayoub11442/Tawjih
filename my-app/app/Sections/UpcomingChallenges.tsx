import React, { useState, useEffect, memo, useCallback, useMemo, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faMobileAlt, 
  faBullhorn,
  faChevronLeft,
  faTrophy,
  faLaptopCode,
  faChartLine,
  faRobot,
  faClock,
  faCalendarAlt,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';

// Types
interface ChallengeData {
  id: string;
  title: string;
  description: string;
  icon: any;
  bgColor: string;
  accentColor: string;
  startDate: string;
  duration: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  participants: number;
  imageUrl?: string;
}

interface ChallengeCardProps {
  data: ChallengeData;
  isVisible: boolean;
  delay: number;
}

// Map for difficulty levels
const DIFFICULTY_MAP = {
  'مبتدئ': { bgColor: "bg-green-100", textColor: "text-green-800" },
  'متوسط': { bgColor: "bg-yellow-100", textColor: "text-yellow-800" },
  'متقدم': { bgColor: "bg-red-100", textColor: "text-red-800" }
};

// Filter mapping
const FILTER_DIFFICULTY_MAP = {
  'beginner': 'مبتدئ',
  'intermediate': 'متوسط',
  'advanced': 'متقدم'
};

// Data constants - moved outside component to prevent re-creation
const UPCOMING_CHALLENGES: ChallengeData[] = [
  {
    id: "mobile-app-challenge",
    title: "تحدي تطوير تطبيق موبايل جديد",
    description: "طور تطبيق موبايل يحل مشكلة حقيقية في مجتمعك. سيتم تقييم المشاريع من قبل خبراء في صناعة التطبيقات.",
    icon: faMobileAlt,
    bgColor: "bg-blue-50",
    accentColor: "bg-blue-500",
    startDate: "١٥ مايو ٢٠٢٥",
    duration: "٣ أسابيع",
    difficulty: "متوسط",
    participants: 124,
    imageUrl: "/api/placeholder/400/400"
  },
  {
    id: "marketing-campaign-challenge",
    title: "تحدي إنشاء حملة تسويقية ناجحة",
    description: "صمم حملة تسويقية مبتكرة لمنتج افتراضي. ستحصل على تعليقات من مديري تسويق محترفين وفرصة للتدريب.",
    icon: faBullhorn,
    bgColor: "bg-green-50",
    accentColor: "bg-green-500",
    startDate: "١ يونيو ٢٠٢٥",
    duration: "٢ أسابيع",
    difficulty: "مبتدئ",
    participants: 98,
    imageUrl: "/api/placeholder/400/400"
  },
  {
    id: "ai-solution-challenge",
    title: "تحدي تطوير حلول الذكاء الاصطناعي",
    description: "ابتكر حلاً باستخدام تقنيات الذكاء الاصطناعي لمواجهة تحديات القطاع التعليمي. فرصة للعمل مع شركات تقنية رائدة.",
    icon: faRobot,
    bgColor: "bg-purple-50",
    accentColor: "bg-purple-500",
    startDate: "١٠ يوليو ٢٠٢٥",
    duration: "٤ أسابيع",
    difficulty: "متقدم",
    participants: 76,
    imageUrl: "/api/placeholder/400/400"
  },
  {
    id: "data-analysis-challenge",
    title: "تحدي تحليل البيانات واتخاذ القرارات",
    description: "حلل مجموعة بيانات حقيقية وقدم رؤى استراتيجية قابلة للتنفيذ. سيقيم عملك خبراء في مجال تحليل البيانات.",
    icon: faChartLine,
    bgColor: "bg-yellow-50",
    accentColor: "bg-yellow-500",
    startDate: "٢٥ مايو ٢٠٢٥",
    duration: "١٠ أيام",
    difficulty: "متوسط",
    participants: 85,
    imageUrl: "/api/placeholder/400/400"
  }
];

// Pre-generated background shapes to prevent re-calculation on each render
const BACKGROUND_SHAPES = Array.from({ length: 5 }).map((_, i) => {
  const size = Math.random() * 50 + 30;
  const top = Math.random() * 100;
  const left = Math.random() * 100;
  const floatDuration = Math.random() * 8 + 12;
  const spinDuration = Math.random() * 8 + 15;
  const delay = Math.random() * 4;
  const opacity = 0.2 + Math.random() * 0.3;
  
  return { size, top, left, floatDuration, spinDuration, delay, opacity };
});

// Benefits data
const BENEFITS_DATA = [
  {
    icon: faTrophy,
    title: "شهادات معتمدة",
    description: "احصل على شهادات معتمدة يمكنك إضافتها إلى سيرتك الذاتية"
  },
  {
    icon: faLaptopCode,
    title: "تعلم عملي",
    description: "اكتسب خبرة في حل مشكلات حقيقية تواجهها الشركات"
  },
  {
    icon: faHandshake,
    title: "فرص توظيف",
    description: "تواصل مع شركات تبحث عن مواهب جديدة"
  }
];

// Filter options
const FILTER_OPTIONS = [
  { id: 'all', label: 'جميع التحديات' },
  { id: 'beginner', label: 'للمبتدئين' },
  { id: 'intermediate', label: 'مستوى متوسط' },
  { id: 'advanced', label: 'للمتقدمين' }
];

// Improved animated background component with proper styling
const AnimatedBackground = memo(() => (
  <div className="absolute inset-0 overflow-hidden z-0 opacity-20 pointer-events-none">
    {BACKGROUND_SHAPES.map((shape, i) => (
      <div
        key={i}
        className="absolute rounded-xl bg-blue-400"
        style={{
          width: `${shape.size}px`,
          height: `${shape.size}px`,
          top: `${shape.top}%`,
          left: `${shape.left}%`,
          animation: `float ${shape.floatDuration}s linear infinite, spin ${shape.spinDuration}s ease-in-out infinite`,
          animationDelay: `${shape.delay}s`,
          opacity: shape.opacity
        }}
        aria-hidden="true"
      />
    ))}
    <style jsx global>{`
      @keyframes float {
        0% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0); }
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `}</style>
  </div>
));
AnimatedBackground.displayName = 'AnimatedBackground';

// Improved Difficulty badge component with type safety
const DifficultyBadge = memo(({ difficulty }: { difficulty: 'مبتدئ' | 'متوسط' | 'متقدم' }) => {
  const { bgColor, textColor } = DIFFICULTY_MAP[difficulty];
  
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${bgColor} ${textColor}`} role="status">
      {difficulty}
    </span>
  );
});
DifficultyBadge.displayName = 'DifficultyBadge';

// Optimized Challenge Card component with better accessibility
const ChallengeCard = memo(({ data, isVisible, delay }: ChallengeCardProps) => {
  const { id, title, description, icon, bgColor, accentColor, startDate, duration, difficulty, participants } = data;
  const textColor = accentColor.replace('bg-', 'text-');
  
  const handleJoinChallenge = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    console.log(`Join challenge: ${id}`);
  }, [id]);

  return (
    <div 
      className={`${bgColor} border border-blue-100 rounded-xl p-6 transition-all duration-500 transform relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay * 100}ms` }}
      tabIndex={0}
      role="article"
      aria-labelledby={`challenge-${id}-title`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
      
      {/* Challenge icon and metadata */}
      <div className="flex justify-between items-start mb-4">
        <div className={`${accentColor} rounded-full h-12 w-12 flex items-center justify-center shadow-md transform transition-all duration-300 group-hover:scale-110`} aria-hidden="true">
          <FontAwesomeIcon icon={icon} className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col items-end">
          <DifficultyBadge difficulty={difficulty} />
          <div className="flex items-center gap-1 text-blue-700 text-sm mt-1">
            <span>{participants} مشارك</span>
            <FontAwesomeIcon icon={faTrophy} className="h-3 w-3" aria-hidden="true" />
          </div>
        </div>
      </div>
      
      {/* Challenge title and details */}
      <h3 id={`challenge-${id}-title`} className={`${textColor} text-xl font-bold text-right mb-2 relative z-10 group-hover:${textColor.replace('text-', 'text-')}/80`}>
        {title}
      </h3>
      
      {/* Challenge description with improved typography */}
      <p className="text-blue-700 text-right mb-4 relative z-10 group-hover:text-blue-800 leading-relaxed text-sm">
        {description}
      </p>
      
      {/* Challenge timing info */}
      <div className="bg-white/70 rounded-lg p-3 mb-4 flex justify-between items-center">
        <div className="flex items-center gap-1 text-blue-700">
          <span className="text-sm">{duration}</span>
          <FontAwesomeIcon icon={faClock} className="h-3 w-3" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-1 text-blue-700">
          <span className="text-sm">{startDate}</span>
          <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3" aria-hidden="true" />
        </div>
      </div>
      
      {/* Call to action button with improved hover effects and accessibility */}
      <button 
        onClick={handleJoinChallenge}
        className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg w-full text-white ${accentColor} hover:brightness-110 focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 focus:outline-none transition-all duration-200`}
        aria-label={`انضم إلى تحدي ${title}`}
      >
        <span>انضم الآن</span>
        <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" aria-hidden="true" />
      </button>
    </div>
  );
});
ChallengeCard.displayName = 'ChallengeCard';

// Optimized section header with better typography
const SectionHeader = memo(({ isVisible }: { isVisible: boolean }) => (
  <div className={`text-center mb-12 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
    <div className="inline-block mb-3 bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-blue-200 hover:text-blue-700 transition-colors">
      التحديات القادمة
    </div>
    <h2 id="upcoming-challenges-heading" className="text-3xl md:text-4xl font-bold mb-3 text-blue-900">شارك في التحديات القادمة وابدأ رحلتك المهنية!</h2>
    <p className="text-blue-700 max-w-2xl mx-auto text-sm md:text-base">
      استعد للانضمام إلى تحديات مهنية، حيث يمكنك تجربة حل مشكلات واقعية واكتساب مهارات عملية. 
      تقدم هذه التحديات فرصًا للتعلم العملي والتواصل مع خبراء في المجال.
    </p>
  </div>
));
SectionHeader.displayName = 'SectionHeader';

// Improved filter tabs with better accessibility
const ChallengeTabs = memo(({ activeFilter, setActiveFilter, isVisible }: { 
  activeFilter: string, 
  setActiveFilter: (filter: string) => void,
  isVisible: boolean
}) => {
  return (
    <div 
      className={`flex flex-wrap justify-center gap-2 mb-8 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: '100ms' }}
      role="tablist"
      aria-label="تصفية التحديات"
    >
      {FILTER_OPTIONS.map(filter => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeFilter === filter.id
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
          role="tab"
          aria-selected={activeFilter === filter.id}
          aria-controls={`challenges-${filter.id}`}
          id={`tab-${filter.id}`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
});
ChallengeTabs.displayName = 'ChallengeTabs';

// Benefits section with improved accessibility
const BenefitsSection = memo(({ isVisible }: { isVisible: boolean }) => {
  return (
    <div 
      className={`grid grid-cols-1 md:grid-cols-3 gap-6 my-12 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: '300ms' }}
    >
      {BENEFITS_DATA.map((benefit, index) => (
        <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-blue-100 flex flex-col items-center text-center">
          <div className="rounded-full bg-blue-100 text-blue-600 p-4 mb-4" aria-hidden="true">
            <FontAwesomeIcon icon={benefit.icon} className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-blue-900 mb-2">{benefit.title}</h3>
          <p className="text-blue-700 text-sm">{benefit.description}</p>
        </div>
      ))}
    </div>
  );
});
BenefitsSection.displayName = 'BenefitsSection';

// Newsletter signup component with improved form handling
const NewsletterSignup = memo(({ isVisible }: { isVisible: boolean }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{success?: boolean; message?: string} | null>(null);
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Email subscribed:', email);
      setEmail('');
      setSubmitResult({ success: true, message: 'تم الاشتراك بنجاح!' });
    } catch (error) {
      setSubmitResult({ success: false, message: 'حدث خطأ. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [email]);
  
  return (
    <div 
      className={`bg-blue-600 rounded-xl p-6 text-center my-12 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: '400ms' }}
    >
      <h3 className="text-xl font-bold text-white mb-3">احصل على تنبيهات بأحدث التحديات</h3>
      <p className="text-blue-100 mb-4">كن أول من يعرف عن التحديات الجديدة وفرص التدريب المتاحة</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="أدخل بريدك الإلكتروني" 
          className="flex-1 rounded-lg px-4 py-2 border-0 focus:ring-2 focus:ring-blue-300 text-right"
          aria-label="البريد الإلكتروني"
          disabled={isSubmitting}
          required
        />
        <button 
          type="submit"
          className="bg-white text-blue-600 font-bold px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'جاري الاشتراك...' : 'اشترك'}
        </button>
      </form>
      
      {submitResult && (
        <div className={`mt-3 text-sm ${submitResult.success ? 'text-blue-100' : 'text-red-300'}`} role="status">
          {submitResult.message}
        </div>
      )}
    </div>
  );
});
NewsletterSignup.displayName = 'NewsletterSignup';

// Improved custom hook for intersection observer
const useIntersectionObserver = (elementRef: React.RefObject<HTMLElement | null>, threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const currentElement = elementRef.current;
    
    // Only create observer if element exists and not yet visible
    if (!currentElement || isVisible) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect after becoming visible to free resources
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '50px' }
    );
    
    observer.observe(currentElement);
    
    return () => observer.disconnect();
  }, [elementRef, threshold, isVisible]);

  return isVisible;
};

// Hook to detect reduced motion preference
const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
};

// Main component with improved organization and accessibility
const UpcomingChallenges: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef);
  const [activeFilter, setActiveFilter] = useState('all');
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Filter challenges based on active filter
  const filteredChallenges = useMemo(() => {
    if (activeFilter === 'all') return UPCOMING_CHALLENGES;
    
    return UPCOMING_CHALLENGES.filter(challenge => 
      challenge.difficulty === FILTER_DIFFICULTY_MAP[activeFilter as keyof typeof FILTER_DIFFICULTY_MAP]
    );
  }, [activeFilter]);
  
  const handleViewAll = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    console.log('View all challenges...');
    // Navigation logic here
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="upcoming-challenges-section" 
      className="py-16 md:py-20 bg-white relative overflow-hidden"
      aria-labelledby="upcoming-challenges-heading"
      dir="rtl"
    >
      {!prefersReducedMotion && <AnimatedBackground />}
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <SectionHeader isVisible={isVisible} />
        
        {/* Filter tabs */}
        <ChallengeTabs 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter}
          isVisible={isVisible}
        />

        {/* Challenge cards with responsive grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10"
          id={`challenges-${activeFilter}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeFilter}`}
        >
          {filteredChallenges.map((challenge, index) => (
            <ChallengeCard 
              key={challenge.id}
              data={challenge}
              isVisible={isVisible}
              delay={index + 1}
            />
          ))}
        </div>
        
        {/* Benefits section */}
        <BenefitsSection isVisible={isVisible} />
        
        {/* Newsletter signup */}
        <NewsletterSignup isVisible={isVisible} />

        {/* CTA button with improved UI and accessibility */}
        <div 
          className={`text-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '500ms' }}
        >
          <button 
            onClick={handleViewAll}
            className="group relative inline-flex items-center justify-center bg-blue-500 text-white font-bold py-3 px-6 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-300"
            aria-label="عرض جميع التحديات المتاحة"
          >
            <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-blue-600 rounded-full group-hover:w-56 group-hover:h-56" aria-hidden="true"></span>
            <span className="relative flex items-center gap-2">
              <span>عرض جميع التحديات المتاحة</span>
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </span>
          </button>
          <p className="mt-3 text-sm text-blue-600">كن جزءًا من مجتمع المبدعين واصنع مستقبلك المهني</p>
        </div>
      </div>
    </section>
  );
};

export default UpcomingChallenges;