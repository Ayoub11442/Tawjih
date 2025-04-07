import React, { useState, memo, useEffect, lazy, Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faLaptop, faBook, faPlay, faTimes, faChevronDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';

// Lazy loaded components


// Type definitions - consolidated for cleaner code
type IconType = 'briefcase' | 'laptop' | 'book';
type BubbleConfig = { icon: IconType; color: string; position: string; animation: string };

interface ButtonProps {
  primary?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

// Font Awesome icon mapping
const icons = {
  briefcase: faBriefcase,
  laptop: faLaptop,
  book: faBook
};

// Memoized components for better performance
const Button = memo(({ primary, children, onClick, className = '' }: ButtonProps) => (
  <button
    onClick={onClick}
    className={`
      font-bold py-2 md:py-3 px-6 md:px-8 rounded-lg transition duration-300 text-base md:text-lg transform hover:-translate-y-1
      ${primary
        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/50"
        : "bg-transparent hover:bg-white/20 text-white border-2 border-white"}
      ${className}
    `}
  >
    {children}
  </button>
));

const IconBubble = memo(({ icon, color, position, animation }: BubbleConfig) => (
  <div
    className={`
      absolute ${position} bg-white/10 backdrop-blur-sm p-3 md:p-4 rounded-full
      ${animation} hidden sm:block
    `}
  >
    <FontAwesomeIcon icon={icons[icon]} className={`h-6 w-6 md:h-8 md:w-8 ${color}`} />
  </div>
));

// Loading indicator for suspense
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const HeroSection = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Animations for bubbles to make them more dynamic
  const animations = [
    'animate-pulse',
    'animate-bounce',
    'hover:scale-110 transition duration-500'
  ];

  // Icon configurations with animations
  const iconBubbles: BubbleConfig[] = [
    { icon: 'briefcase', color: 'text-blue-300', position: 'top-1/4 left-8 md:left-16', animation: animations[0] },
    { icon: 'laptop', color: 'text-green-300', position: 'bottom-1/3 left-12 md:left-24', animation: animations[1] },
    { icon: 'book', color: 'text-yellow-300', position: 'top-1/3 right-12 md:right-24', animation: animations[2] }
  ];

  // Better image loading with optimization
  const bgImageUrl = "https://plus.unsplash.com/premium_photo-1661783512537-95fd8d054fa7?q=80&w=1487&auto=format&fit=crop&ixlib=rb-4.0.3";

  // Set loaded state when component mounts
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Scroll to next section function
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Overlay and Preloading */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImageUrl}
          alt="شباب يعملون في مجالات مختلفة"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-black/60"></div>
      </div>

      {/* Content Container with improved responsiveness */}
      <div dir="rtl" className="relative z-10 h-full flex flex-col items-center justify-center text-right px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading with animation */}
          <h1 className={`text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="block">اكتشف مستقبلك المهني،</span>
            <span className="block text-blue-300">اختر مسارك بشغف وذكاء!</span>
          </h1>

          {/* Description with animation */}
          <p className={`text-base md:text-xl text-gray-200 mb-6 md:mb-8 leading-relaxed transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            من خلال التوجيه الذكي، نساعدك في اكتشاف المهارات التي تميزك والفرص المهنية التي تناسبك.
            <span className="block mt-2 font-semibold text-blue-200">ابدأ الآن لتجد مستقبلك المهني المثالي!</span>
          </p>

          {/* Stats row - new addition */}
          <div className={`flex justify-between mb-8 text-center transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="border-r border-white/20 px-4 first:pr-0 last:border-0">
              <div className="text-blue-300 text-2xl md:text-3xl font-bold">+5000</div>
              <div className="text-gray-300 text-sm">خريج ناجح</div>
            </div>
            <div className="border-r border-white/20 px-4">
              <div className="text-blue-300 text-2xl md:text-3xl font-bold">200+</div>
              <div className="text-gray-300 text-sm">مسار مهني</div>
            </div>
            <div className="px-4">
              <div className="text-blue-300 text-2xl md:text-3xl font-bold">98%</div>
              <div className="text-gray-300 text-sm">نسبة الرضا</div>
            </div>
          </div>

          {/* CTA Buttons with animation */}
          <div className={`flex flex-col sm:flex-row justify-start gap-4 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Button primary className="flex items-center justify-center gap-2">
              <span>ابدأ الآن</span>
              <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
            </Button>
            <Button>تعرف على المزيد</Button>
          </div>
        </div>

        {/* Video Button with responsive positioning */}
        <div className={`mt-8 md:mt-12 absolute bottom-16 md:bottom-12 right-4 md:right-12 transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Button primary onClick={() => setIsVideoModalOpen(true)}>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPlay} className="h-4 w-4 md:h-6 md:w-6" />
              <span className="text-sm md:text-base">شاهد كيف تساعدك منصتنا</span>
            </div>
          </Button>
        </div>

        {/* Floating career icons with animations */}
        {iconBubbles.map((bubble, index) => (
          <IconBubble
            key={index}
            icon={bubble.icon}
            color={bubble.color}
            position={bubble.position}
            animation={bubble.animation}
          />
        ))}

        {/* Scroll down indicator - new addition */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer hidden md:block"
          onClick={scrollToNextSection}
        >
          <FontAwesomeIcon
            icon={faChevronDown}
            className="h-6 w-6 text-white/80 hover:text-white"
          />
        </div>
      </div>

      {/* Video Modal with lazy loading */}
      {isVideoModalOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <VideoModalComponent
            isOpen={isVideoModalOpen}
            onClose={() => setIsVideoModalOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
};

// Separate VideoModal component for lazy loading
interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoModalComponent = ({ isOpen, onClose }: VideoModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-lg overflow-hidden max-w-3xl w-full mx-4 md:mx-0" onClick={e => e.stopPropagation()}>
        <div className="p-3 md:p-4 bg-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-base md:text-lg">كيف تساعدك منصتنا</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>
        <div className="p-4">
          <div className="bg-gray-200 h-48 md:h-64 flex items-center justify-center">
            <p className="text-gray-500">فيديو توضيحي للمنصة</p>
          </div>
        </div>
      </div>
    </div>
  );
};

Button.displayName = 'Button';
IconBubble.displayName = 'IconBubble';
VideoModalComponent.displayName = 'VideoModal';

export { VideoModalComponent };
export default HeroSection;