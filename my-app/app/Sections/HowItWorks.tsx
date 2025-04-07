import React, { useState, useEffect, memo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClipboardCheck, 
  faListCheck, 
  faMagnifyingGlass, 
  faArrowLeft, 
  faLightbulb, 
  faStar, 
  faRocket, 
  faAward, 
  faUsers
} from '@fortawesome/free-solid-svg-icons';

// Types
interface StepData {
  number: number;
  title: string;
  description: string;
  icon: any;
}

interface StepProps extends StepData {
  isVisible: boolean;
  delay: number;
}

interface TestimonialData {
  name: string;
  role: string;
  content: string;
  rating: number;
}

// Data constants - moved outside component to prevent re-creation
const STEPS: StepData[] = [
  {
    number: 1,
    title: "اختبار الميول",
    description: "ابدأ باختبار مخصص لقياس ميولك المهنية وتحديد نقاط القوة الشخصية.",
    icon: faClipboardCheck
  },
  {
    number: 2,
    title: "التوصيات الشخصية",
    description: "ستحصل على توصيات مهنية ومسارات تعليمية بناءً على نتائج الاختبار.",
    icon: faListCheck
  },
  {
    number: 3,
    title: "استكشاف الفرص",
    description: "اكتشف الفرص المتاحة في السوق وتعرف على المهارات المطلوبة للنجاح.",
    icon: faMagnifyingGlass
  }
];

const STATS = [
  { value: "+5000", label: "مستخدم استفاد من الاختبار", icon: faUsers },
  { value: "98%", label: "نسبة الرضا عن النتائج", icon: faStar },
  { value: "+200", label: "مسار وظيفي متاح", icon: faRocket }
];

const TESTIMONIALS: TestimonialData[] = [
  {
    name: "أحمد محمد",
    role: "طالب جامعي",
    content: "ساعدني الاختبار في تحديد مساري المهني بشكل دقيق، وأنا الآن أدرس في المجال الذي أحبه.",
    rating: 5
  },
  {
    name: "سارة علي",
    role: "خريجة جديدة",
    content: "توصيات الاختبار كانت مفاجأة إيجابية لي، اكتشفت مجالات لم أفكر فيها من قبل.",
    rating: 5
  }
];

const FEATURES = [
  {
    icon: faRocket,
    title: "تحليل شخصي متقدم",
    description: "يقدم الاختبار تحليلاً شاملاً لشخصيتك وميولك المهنية بناءً على نماذج نفسية معتمدة."
  },
  {
    icon: faLightbulb,
    title: "اكتشاف مهارات خفية",
    description: "يساعدك الاختبار على اكتشاف مهارات ومواهب قد لا تكون مدركاً لها."
  },
  {
    icon: faAward,
    title: "توصيات خبراء متخصصين",
    description: "نقدم توصيات بناءً على آراء خبراء في مجالات التوجيه المهني والتطوير الوظيفي."
  },
  {
    icon: faStar,
    title: "تحديثات مستمرة",
    description: "يتم تحديث قاعدة بيانات الوظائف والمهارات المطلوبة بشكل دوري لمواكبة سوق العمل."
  }
];

// Animation background component
const AnimatedBackground = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 opacity-20 pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-xl bg-blue-400"
          style={{
            width: `${Math.random() * 60 + 40}px`,
            height: `${Math.random() * 60 + 40}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 10 + 15}s linear infinite, 
                       spin ${Math.random() * 10 + 20}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.3 + Math.random() * 0.3
          }}
        />
      ))}
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

// Optimized and improved Step component with better hover effects
const Step = memo(({ number, title, description, icon, isVisible, delay }: StepProps) => (
  <div 
    className={`flex flex-col items-center md:items-start transition-all duration-700 transform bg-blue-50 rounded-xl p-6 border border-blue-100 relative overflow-hidden group hover:shadow-lg hover:bg-blue-100 hover:-translate-y-1 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}
    style={{ transitionDelay: `${delay * 150}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <div className="mb-4 relative z-10">
      <div className="bg-blue-500 rounded-full h-16 w-16 flex items-center justify-center shadow-md transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-blue-300">
        <FontAwesomeIcon icon={icon} className="h-7 w-7 text-white group-hover:animate-pulse" />
      </div>
    </div>
    
    <div className="flex items-center gap-2 mb-2 relative z-10">
      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm group-hover:bg-blue-200 transition-colors">
        {number}
      </div>
      <h3 className="text-xl font-bold text-blue-800 group-hover:text-blue-900">{title}</h3>
    </div>
    <p className="text-blue-700 text-center md:text-right max-w-xs relative z-10 group-hover:text-blue-800">{description}</p>
  </div>
));

Step.displayName = 'Step';

// Improved ActionButton with enhanced hover effects
const ActionButton = memo(({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <button 
    onClick={onClick}
    className={`relative inline-flex items-center justify-center overflow-hidden bg-blue-500 text-white font-bold py-3 px-8 rounded-lg group ${className}`}
    aria-label="Start test"
  >
    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-blue-600 rounded-full group-hover:w-56 group-hover:h-56"></span>
    <span className="relative flex items-center transition-colors duration-300 ease-in-out">
      {children}
    </span>
  </button>
));

ActionButton.displayName = 'ActionButton';

// Improved card components with hover effects
const StatDisplay = memo(({ value, label, icon }: { value: string; label: string; icon: any }) => (
  <div className="flex flex-col items-center bg-blue-50 p-4 rounded-lg border border-blue-100 transition-all duration-300 hover:shadow-md hover:bg-blue-100 hover:-translate-y-1 relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="bg-blue-100 p-2 rounded-full mb-2 transition-all duration-300 group-hover:bg-blue-200 relative z-10">
      <FontAwesomeIcon icon={icon} className="h-6 w-6 text-blue-500 group-hover:text-blue-600" />
    </div>
    <span className="text-blue-800 font-bold text-2xl mb-1 relative z-10 group-hover:text-blue-900">{value}</span>
    <span className="text-blue-600 text-sm relative z-10 group-hover:text-blue-700">{label}</span>
  </div>
));

StatDisplay.displayName = 'StatDisplay';

const Testimonial = memo(({ name, role, content, rating }: TestimonialData) => (
  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 transition-all duration-300 hover:shadow-md hover:bg-blue-100 relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="flex justify-end mb-2 relative z-10">
      {[...Array(5)].map((_, i) => (
        <FontAwesomeIcon 
          key={i} 
          icon={faStar} 
          className={`h-4 w-4 ${i < rating ? 'text-amber-400' : 'text-blue-200'} ${i < rating ? 'group-hover:animate-pulse' : ''}`} 
        />
      ))}
    </div>
    <p className="text-blue-700 text-right mb-4 italic relative z-10 group-hover:text-blue-800">{`"${content}"`}</p>
    <div className="flex items-center justify-end gap-2 relative z-10">
      <div>
        <p className="text-blue-800 font-semibold text-right group-hover:text-blue-900">{name}</p>
        <p className="text-blue-600 text-sm text-right group-hover:text-blue-700">{role}</p>
      </div>
      <div className="bg-blue-100 h-10 w-10 rounded-full flex items-center justify-center text-blue-700 font-bold group-hover:bg-blue-200 transition-colors">
        {name.charAt(0)}
      </div>
    </div>
  </div>
));

Testimonial.displayName = 'Testimonial';

const FeatureHighlight = memo(({ icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="flex items-start gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100 transition-all duration-300 hover:shadow-md hover:bg-blue-100 hover:-translate-y-1 relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="bg-blue-100 p-3 rounded-full transition-all duration-300 group-hover:bg-blue-200 relative z-10">
      <FontAwesomeIcon icon={icon} className="h-6 w-6 text-blue-500 group-hover:text-blue-600" />
    </div>
    <div className="relative z-10">
      <h4 className="text-blue-800 font-bold mb-1 text-right group-hover:text-blue-900">{title}</h4>
      <p className="text-blue-600 text-sm text-right group-hover:text-blue-700">{description}</p>
    </div>
  </div>
));

FeatureHighlight.displayName = 'FeatureHighlight';

// Add keyframe animations to the global style
const GlobalStyles = memo(() => (
  <style jsx global>{`
    @keyframes float {
      0% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(20px, -15px) rotate(5deg); }
      50% { transform: translate(-10px, 20px) rotate(-5deg); }
      75% { transform: translate(-20px, -10px) rotate(10deg); }
      100% { transform: translate(0, 0) rotate(0deg); }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}</style>
));

GlobalStyles.displayName = 'GlobalStyles';

// Optimized main component with better organization
const HowItWorks: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  // Use IntersectionObserver in a memoized callback
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    };

    const observer = new IntersectionObserver(observerCallback, { threshold: 0.15 });
    
    const section = document.getElementById('how-it-works-section');
    if (section) observer.observe(section);
    
    return () => observer.disconnect();
  }, []);

  const handleStartTest = useCallback(() => {
    console.log('Starting test...');
  }, []);

  return (
    <>
      <GlobalStyles />
      <section 
        id="how-it-works-section" 
        className="py-20 bg-white relative"
      >
        <AnimatedBackground />
        
        <div dir="rtl" className="container mx-auto px-4 md:px-8 relative z-10">
          {/* Section header */}
          <div 
            className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div className="inline-block mb-4 bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-blue-200 hover:text-blue-700 transition-colors">
              خطوات بسيطة
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">كيف يعمل النظام؟</h2>
            <p className="text-blue-700 max-w-2xl mx-auto">
              نستخدم أحدث تقنيات الذكاء الاصطناعي لتقديم توجيه دقيق يناسب ميولك واهتماماتك. اتبع هذه الخطوات البسيطة:
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
            {STEPS.map((step, index) => (
              <Step 
                key={step.number}
                {...step}
                isVisible={isVisible}
                delay={index + 2}
              />
            ))}
          </div>

          {/* Feature highlights */}
          <div 
            className={`mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '500ms' }}
          >
            <h3 className="text-2xl font-bold mb-8 text-center text-blue-900">مميزات الاختبار</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FEATURES.map((feature, index) => (
                <FeatureHighlight 
                  key={index}
                  icon={feature.icon} 
                  title={feature.title} 
                  description={feature.description}
                />
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div 
            className={`mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '550ms' }}
          >
            <h3 className="text-2xl font-bold mb-8 text-center text-blue-900">تجارب المستخدمين</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TESTIMONIALS.map((testimonial, index) => (
                <Testimonial key={index} {...testimonial} />
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div 
            className={`mt-16 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '600ms' }}
          >
            <ActionButton onClick={handleStartTest} className="mb-4">
              <span>ابدأ اختبار الميول الآن</span>
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4 w-4" />
            </ActionButton>
            <p className="mt-4 text-sm text-blue-600">استغرق الاختبار 10 دقائق فقط، وستحصل على نتائج فورية</p>
            
            {/* Stats display */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {STATS.map((stat, i) => (
                <StatDisplay key={i} value={stat.value} label={stat.label} icon={stat.icon} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;