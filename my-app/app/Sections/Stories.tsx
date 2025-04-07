import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faUserGraduate, 
  faLaptopCode, 
  faBullseye,
  faChevronLeft,
  faQuoteRight
} from '@fortawesome/free-solid-svg-icons';

// Types
interface SuccessStoryData {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: any;
  bgColor: string;
  accentColor: string;
  imageUrl?: string;
}

interface StoryCardProps {
  data: SuccessStoryData;
  isVisible: boolean;
  delay: number;
}

// Data constants - moved outside component to prevent re-creation
const SUCCESS_STORIES: SuccessStoryData[] = [
  {
    id: "sarah-story",
    name: "سارة",
    title: "مطورة ويب",
    description: "بدأت في تعلم البرمجة عبر منصتنا ووجدت أول وظيفة لها كمطورة ويب.",
    icon: faLaptopCode,
    bgColor: "bg-blue-50",
    accentColor: "bg-blue-500",
    imageUrl: "/api/placeholder/400/400"
  },
  {
    id: "ahmed-story",
    name: "أحمد",
    title: "مدير حملات تسويق",
    description: "اكتشف شغفه في التسويق الرقمي عبر الاختبارات التفاعلية، وهو الآن يدير حملة إعلانات كبيرة.",
    icon: faBullseye,
    bgColor: "bg-green-50",
    accentColor: "bg-green-500",
    imageUrl: "/api/placeholder/400/400"
  },
  {
    id: "layla-story",
    name: "ليلى",
    title: "مصممة جرافيك",
    description: "طورت مهاراتها في التصميم الجرافيكي من خلال دوراتنا، والآن تعمل لصالح العديد من العلامات التجارية المعروفة.",
    icon: faUserGraduate,
    bgColor: "bg-purple-50",
    accentColor: "bg-purple-500",
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

// Improved animated background component with pre-generated shapes
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
      />
    ))}
  </div>
));
AnimatedBackground.displayName = 'AnimatedBackground';

// Optimized Story Card component with better UI
const StoryCard = memo(({ data, isVisible, delay }: StoryCardProps) => {
  const { id, name, title, description, icon, bgColor, accentColor } = data;
  const textColor = accentColor.replace('bg-', 'text-');
  
  const handleViewStory = useCallback(() => {
    console.log(`View full story of ${name}`);
  }, [name]);

  return (
    <div 
      className={`${bgColor} border border-blue-100 rounded-xl p-6 transition-all duration-500 transform relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay * 100}ms` }}
      tabIndex={0}
      role="article"
      aria-labelledby={`story-${id}-name`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Profile with icon first for better visual hierarchy */}
      <div className="flex justify-between items-start mb-4">
        <div className={`${accentColor} rounded-full h-12 w-12 flex items-center justify-center shadow-md transform transition-all duration-300 group-hover:scale-110`}>
          <FontAwesomeIcon icon={icon} className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col items-end">
          <div id={`story-${id}-name`} className={`${textColor} text-xl font-bold relative z-10`}>
            {name}
          </div>
          <div className="text-blue-700 text-sm font-medium">{title}</div>
        </div>
      </div>
      
      {/* Quote Icon with better positioning */}
      <div className="mb-2 text-blue-300/60">
        <FontAwesomeIcon icon={faQuoteRight} className="h-4 w-4" />
      </div>
      
      {/* Description with improved typography */}
      <p className="text-blue-700 text-right mb-5 relative z-10 group-hover:text-blue-800 leading-relaxed text-sm">
        {description}
      </p>
      
      {/* Call to action with improved hover effects */}
      <button 
        onClick={handleViewStory}
        className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg w-full text-white ${accentColor} hover:brightness-110 focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 focus:outline-none transition-all duration-200`}
        aria-label={`اقرأ القصة كاملة ${name}`}
      >
        <span>اقرأ القصة كاملة</span>
        <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" />
      </button>
    </div>
  );
});
StoryCard.displayName = 'StoryCard';

// Optimized section header with better typography
const SectionHeader = memo(({ isVisible }: { isVisible: boolean }) => (
  <div className={`text-center mb-12 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
    <div className="inline-block mb-3 bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-blue-200 hover:text-blue-700 transition-colors">
      قصص نجاح
    </div>
    <h2 className="text-3xl md:text-4xl font-bold mb-3 text-blue-900">قصص نجاح حقيقية</h2>
    <p className="text-blue-700 max-w-xl mx-auto text-sm md:text-base">
      تعرّف على كيفية مساعدة شباب مثلّك في الوصول إلى أهدافهم المهنية باستخدام منصتنا.
    </p>
  </div>
));
SectionHeader.displayName = 'SectionHeader';

// Custom hook with reduced calculations
const useIntersectionObserver = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Only create observer if not yet visible to save resources
    if (isVisible) return;
    
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
    
    const section = document.getElementById('success-stories-section');
    if (section) observer.observe(section);
    
    return () => observer.disconnect();
  }, [threshold, isVisible]);

  return isVisible;
};

// Main component with improved organization
const SuccessStories: React.FC = () => {
  const isVisible = useIntersectionObserver();
  
  const handleExploreAll = useCallback(() => {
    console.log('Exploring all success stories...');
  }, []);

  // Prefers reduced motion media query
  const prefersReducedMotion = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, []);

  return (
    <section    
      id="success-stories-section" 
      className="py-16 md:py-20 bg-white relative overflow-hidden"
      aria-labelledby="success-stories-heading"
    >
      {!prefersReducedMotion && <AnimatedBackground />}
      
      <div dir="rtl" className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <SectionHeader isVisible={isVisible} />

        {/* Success story cards with responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
          {SUCCESS_STORIES.map((story, index) => (
            <StoryCard 
              key={story.id}
              data={story}
              isVisible={isVisible}
              delay={index + 1}
            />
          ))}
        </div>

        {/* CTA button with improved UI */}
        <div 
          className={`text-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '400ms' }}
        >
          <button 
            onClick={handleExploreAll}
            className="group relative inline-flex items-center justify-center bg-blue-500 text-white font-bold py-3 px-6 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-300"
            aria-label="استعرض المزيد من قصص النجاح"
          >
            <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-blue-600 rounded-full group-hover:w-56 group-hover:h-56"></span>
            <span className="relative flex items-center gap-2">
              <span>استعرض المزيد من قصص النجاح</span>
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <p className="mt-3 text-sm text-blue-600">اكتشف كيف يمكن أن تكون القصة القادمة لك</p>
        </div>
      </div>
    </section>
  );
};

// Separate CSS file import recommendation
// import './animations.css';

// CSS module approach for animations
const styles = {
  animations: `
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
  `
};

export default SuccessStories;