import React, { useState, useCallback, useMemo, FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faPalette, 
  faCode, 
  faBullhorn,
  faChevronLeft
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// Types
interface CareerPathData {
  id: string;
  title: string;
  description: string;
  icon: IconDefinition;
  bgColor: string;
  accentColor: string;
}

// Custom hook for career path data
const useCareerPaths = () => useMemo(() => [
  {
    id: "graphic-design",
    title: "التصميم الجرافيكي",
    description: "هل أنت مبدع؟ ابدأ في تعلم التصميم الجرافيكي.",
    icon: faPalette,
    bgColor: "bg-purple-50",
    accentColor: "bg-purple-500"
  },
  {
    id: "software-dev",
    title: "تطوير البرمجيات",
    description: "إذا كنت مهتمًا بالتكنولوجيا، فدور المطورين في تزايد دائم.",
    icon: faCode,
    bgColor: "bg-blue-50",
    accentColor: "bg-blue-500"
  },
  {
    id: "digital-marketing",
    title: "التسويق الرقمي",
    description: "هل تحب التسويق؟ تعلم كيفية إدارة الحملات الرقمية.",
    icon: faBullhorn,
    bgColor: "bg-green-50",
    accentColor: "bg-green-500"
  }
], []);

// Improved hook for intersection observer with better cleanup
const useElementVisibility = (elementId: string, threshold = 0.15) => {
  const [isVisible, setIsVisible] = useState(false);
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    
    const element = document.getElementById(elementId);
    if (element) observer.observe(element);
    
    return () => observer.disconnect();
  }, [elementId, threshold]);

  return isVisible;
};

// Background animation component
const AnimatedBackground: FC = () => (
  <div className="absolute inset-0 overflow-hidden z-0 opacity-20 pointer-events-none">
    {Array.from({ length: 5 }).map((_, i) => {
      const size = Math.random() * 50 + 30;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const floatDuration = Math.random() * 8 + 12;
      const spinDuration = Math.random() * 8 + 15;
      const delay = Math.random() * 4;
      const opacity = 0.2 + Math.random() * 0.3;
      
      return (
        <div
          key={i}
          className="absolute rounded-xl bg-blue-400"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            animation: `float ${floatDuration}s linear infinite, spin ${spinDuration}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
            opacity
          }}
        />
      );
    })}
  </div>
);

// Smaller, more focused components
const SectionHeader: FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
    <div className="inline-block mb-4 bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-blue-200 hover:text-blue-700 transition-colors">
      مسارات مهنية مميزة
    </div>
    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900 tracking-tight">
      اكتشف مجالات جديدة تستحق الاهتمام!
    </h2>
    <p className="text-blue-700 max-w-2xl mx-auto">
      إليك بعض التوصيات المتعلقة بالمسارات المهنية الأكثر طلبًا في المستقبل.
    </p>
  </div>
);

// Career card component with animation
const CareerCard: FC<{
  career: CareerPathData;
  isVisible: boolean;
  index: number;
}> = React.memo(({ career, isVisible, index }) => {
  const { id, title, description, icon, bgColor, accentColor } = career;
  const textColor = accentColor.replace('bg-', 'text-');
  const delay = (index + 2) * 150;
  
  const handleLearnMore = useCallback(() => {
    console.log(`Learn more about ${id}`);
    // Implementation for navigation or modal opening would go here
  }, [id]);

  return (
    <div 
      className={`${bgColor} border border-blue-100 rounded-xl p-6 transition-all duration-700 transform relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
      data-testid={`career-card-${id}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div className={`${textColor} text-xl font-bold relative z-10`}>
          {title}
        </div>
        <div className={`${accentColor} rounded-full h-12 w-12 flex items-center justify-center shadow-md transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-blue-300`}>
          <FontAwesomeIcon icon={icon} className="h-5 w-5 text-white group-hover:animate-pulse" />
        </div>
      </div>
      
      <p className="text-blue-700 text-right mb-6 relative z-10 group-hover:text-blue-800">
        {description}
      </p>
      
      <button 
        onClick={handleLearnMore}
        className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg w-full text-white transition-all duration-300 relative z-10 ${accentColor} hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:outline-none`}
        aria-label={`تعرف على تفاصيل ${title}`}
      >
        <span>تعرف على التفاصيل</span>
        <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" />
      </button>
    </div>
  );
});

// Call to action component
const CallToAction: FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const handleExploreAll = useCallback(() => {
    console.log('Exploring all career paths...');
  }, []);

  return (
    <div 
      className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: '550ms' }}
    >
      <button 
        onClick={handleExploreAll}
        className="relative inline-flex items-center justify-center overflow-hidden bg-blue-500 text-white font-bold py-3 px-8 rounded-lg group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="استكشف جميع المسارات المهنية"
      >
        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-blue-600 rounded-full group-hover:w-56 group-hover:h-56"></span>
        <span className="relative flex items-center gap-2 transition-colors duration-300 ease-in-out">
          <span>استكشف جميع المسارات المهنية</span>
          <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
        </span>
      </button>
      <p className="mt-4 text-sm text-blue-600">أكثر من 50 مسار مهني متاح للاستكشاف</p>
    </div>
  );
};

// Main component with improved structure
const FeaturedRecommendations: FC = () => {
  const careers = useCareerPaths();
  const isVisible = useElementVisibility('featured-recommendations-section');

  return (
    <section 
      id="featured-recommendations-section" 
      className="py-20 bg-white relative overflow-hidden"
      aria-label="المسارات المهنية المميزة"
    >
      <AnimatedBackground />
      
      <div dir="rtl" className="container mx-auto px-4 md:px-8 relative z-10">
        <SectionHeader isVisible={isVisible} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {careers.map((career, index) => (
            <CareerCard 
              key={career.id}
              career={career}
              isVisible={isVisible}
              index={index}
            />
          ))}
        </div>

        <CallToAction isVisible={isVisible} />
      </div>
      
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default FeaturedRecommendations;