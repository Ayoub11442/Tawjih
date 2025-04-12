'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import Header from './Componenets/Header';
import {
  ChevronDown, ChevronUp, Save, RefreshCw, Calendar,
  Briefcase, User, TrendingUp, Globe, MessageSquare,
  Send, BookOpen, Award, Compass, Star, Zap, ArrowUpRight,
  UserPlus, FileText, Bell, Play, Download, Clock,
  Users, Mail
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faGithub} from '@fortawesome/free-brands-svg-icons';

// Types
interface Course {
  name: string;
  url: string;
  provider: string;
  rating: number;
  duration: string;
}

interface CareerRecommendation {
  id: number;
  title: string;
  match: number;
  description: string;
  salary: { min: number, max: number, currency: string };
  growth: number;
  courses: Course[];
  skills: string[];
}

interface JobPosting {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  logo: string;
}

// Theme constants
const THEME = {
  colors: {
    primary: '#10b981',
    secondary: '#0ea5e9',
    accent: '#8b5cf6',
    chartColors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'],
    gradients: {
      primary: 'from-emerald-600 to-teal-500',
      secondary: 'from-blue-600 to-indigo-500',
      accent: 'from-violet-600 to-purple-500',
    }
  }
};

// Mock data
const CAREER_DATA: CareerRecommendation[] = [
  {
    id: 1,
    title: "تطوير الواجهات الأمامية",
    match: 91,
    description: "مجال يجمع بين البرمجة والإبداع في تصميم الواجهات وبناء تجارب مستخدم تفاعلية جذابة",
    salary: { min: 6000, max: 9500, currency: "dh" },
    growth: 22,
    courses: [
      { name: "دورة React الشاملة", url: "#", provider: "Udemy", rating: 4.8, duration: "30 ساعة" },
      { name: "تطوير الواجهات المتقدم", url: "#", provider: "Frontend Mentor", rating: 4.6, duration: "20 ساعة" },
      { name: "CSS المتقدم وأنماط التصميم", url: "#", provider: "Scrimba", rating: 4.9, duration: "15 ساعة" }
    ],
    skills: ["JavaScript", "React", "CSS/SASS", "Responsive Design", "UI/UX Principles"]
  },
  {
    id: 2,
    title: "مصمم تجربة مستخدم",
    match: 76,
    description: "تصميم تجارب مستخدم سلسة وجذابة مع التركيز على سهولة الاستخدام وإجراء بحوث المستخدم",
    salary: { min: 5500, max: 9000, currency: "dh" },
    growth: 18,
    courses: [
      { name: "أساسيات تصميم UX", url: "#", provider: "Interaction Design Foundation", rating: 4.7, duration: "25 ساعة" },
      { name: "بحوث المستخدم المتقدمة", url: "#", provider: "Nielsen Norman Group", rating: 4.9, duration: "20 ساعة" },
      { name: "تصميم UI/UX الشامل", url: "#", provider: "Udemy", rating: 4.5, duration: "40 ساعة" }
    ],
    skills: ["User Research", "Wireframing", "Prototyping", "Usability Testing", "Figma"]
  },
  {
    id: 3,
    title: "محلل بيانات",
    match: 62,
    description: "تحليل البيانات واستخراج رؤى قيمة لاتخاذ القرارات الاستراتيجية وتحسين الأعمال",
    salary: { min: 6500, max: 11000, currency: "dh" },
    growth: 25,
    courses: [
      { name: "علم البيانات الشامل", url: "#", provider: "DataCamp", rating: 4.8, duration: "50 ساعة" },
      { name: "تحليل البيانات باستخدام Python", url: "#", provider: "Coursera", rating: 4.7, duration: "35 ساعة" },
      { name: "لوحات تحليل البيانات", url: "#", provider: "Tableau", rating: 4.6, duration: "20 ساعة" }
    ],
    skills: ["Python", "SQL", "Data Visualization", "Statistical Analysis", "Machine Learning Basics"]
  }
];

const JOBS_DATA: JobPosting[] = [
  {
    id: 1,
    title: "مطور واجهات أمامية",
    company: "شركة تقنية المستقبل",
    location: "الرباط  (عن بعد)",
    type: "دوام كامل",
    salary: "8,000 - 9,500 dh",
    posted: "منذ يومين",
    logo: "TF"
  },
  {
    id: 2,
    title: "مصمم UX/UI",
    company: "إبداع الرقمية",
    location: "أكادير",
    type: "دوام كامل",
    salary: "7,500 - 8,500 dh",
    posted: "منذ 3 أيام",
    logo: "إر"
  },
  {
    id: 3,
    title: "مطور React",
    company: "تطبيقات السحاب",
    location: "مراكش  (مرن)",
    type: "دوام كامل",
    salary: "8,500 - 10,000 dh",
    posted: "اليوم",
    logo: "تس"
  }
];

const SKILL_TREND_DATA = [
  { name: 'JavaScript', current: 85, previous: 80 },
  { name: 'React', current: 90, previous: 75 },
  { name: 'UI/UX', current: 70, previous: 60 },
  { name: 'Data Analysis', current: 65, previous: 50 },
  { name: 'Python', current: 60, previous: 45 },
];

const LEARNING_PATH = [
  { id: 1, title: "أساسيات JavaScript", duration: "4 أسابيع", completed: true },
  { id: 2, title: "React المتقدم", duration: "6 أسابيع", completed: false },
  { id: 3, title: "مشروع تطبيقي", duration: "3 أسابيع", completed: false },
  { id: 4, title: "دورة UI/UX", duration: "4 أسابيع", completed: false }
];

// Animations as a component with enhanced effects
const CustomStyles = () => (
  <style jsx global>{`
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes pulseGlow {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
      50% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    .animate-slideIn {
      animation: slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    .animate-pulse-glow {
      animation: pulseGlow 2.5s infinite;
    }
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
  `}</style>
);

// Enhanced badge component with gradient effects
const Badge = ({ text, color = "emerald" }: { text: string; color?: string }) => (
  <span 
    className={`
      px-3 py-1.5 text-xs font-medium rounded-full
      transition-all duration-300 hover:scale-105
      bg-gradient-to-r from-${color}-100 to-${color}-200 
      text-${color}-700 hover:shadow-md
    `}
  >
    {text}
  </span>
);

// Improved star rating with animations
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center group">
      {[...Array(5)].map((_, i) => (
        <span 
          key={i} 
          className={`
            transition-all duration-300
            transform group-hover:scale-110
            ${i < fullStars 
              ? "text-yellow-400" 
              : (i === fullStars && hasHalfStar 
                ? "text-yellow-400" 
                : "text-gray-300")}
          `}
        >
          ★
        </span>
      ))}
      <span className="mr-2 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

// Enhanced section header with gradient text
const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <h2 className="text-xl font-bold mb-4 flex items-center">
    <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
      {icon}
      <span className="mr-2">{title}</span>
    </span>
  </h2>
);

// Improved panel with hover effects
const Panel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div 
    className={`
      bg-white rounded-lg shadow-md p-6 
      transition-all duration-300
      hover:shadow-xl hover:transform hover:-translate-y-1
      border border-gray-100 hover:border-emerald-200
      ${className}
    `}
  >
    {children}
  </div>
);

// Enhanced action button with better visual feedback
const ActionButton = ({ icon, text, onClick = () => {}, primary = false }: { 
  icon: React.ReactNode; 
  text: string; 
  onClick?: () => void;
  primary?: boolean;
}) => (
  <button 
    className={`
      rounded-lg p-4 text-center flex items-center justify-center
      transition-all duration-300
      transform hover:-translate-y-1
      ${primary 
        ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:shadow-emerald-lg" 
        : "bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700"}
      hover:shadow-lg active:scale-95
    `}
    onClick={onClick}
  >
    <span className="mr-2 transition-transform duration-300 group-hover:rotate-12">
      {icon}
    </span>
    {text}
  </button>
);

// Career Card Component
const CareerCard = ({ 
  career, 
  isExpanded, 
  onToggle 
}: { 
  career: CareerRecommendation; 
  isExpanded: boolean; 
  onToggle: () => void;
}) => (
  <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300
                  border border-gray-100 overflow-hidden
                  ${isExpanded ? 'transform -translate-y-1' : ''}`}>
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{career.title}</h3>
          <p className="text-gray-600">{career.description}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
            {career.match}% توافق
          </div>
          <button 
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={isExpanded ? 'عرض أقل' : 'عرض المزيد'}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-full">
            <TrendingUp size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">نمو المجال</p>
            <p className="font-medium text-blue-600">+{career.growth}%</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 rounded-full">
            <Briefcase size={16} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">متوسط الراتب</p>
            <p className="font-medium text-emerald-600">
              {career.salary.min.toLocaleString()} - {career.salary.max.toLocaleString()} {career.salary.currency}
            </p>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="animate-fadeIn">
          <SkillsSection skills={career.skills} />
          <CoursesSection courses={career.courses} />
          <ActionButtons />
        </div>
      )}
    </div>
  </div>
);

// Rest of the components remain the same...
const SkillsSection = ({ skills }: { skills: string[] }) => (
  <div className="mb-6">
    <h4 className="font-medium text-black mb-3 flex items-center gap-2">
      <span className="text-xl">🔑</span>
      المهارات المطلوبة:
    </h4>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, idx) => (
        <span key={idx} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm
                                 hover:bg-indigo-200 transition-colors duration-200">
          {skill}
        </span>
      ))}
    </div>
  </div>
);

const CoursesSection = ({ courses }: { courses: Course[] }) => (
  <div className="mb-6">
    <h4 className="font-medium text-black mb-3 flex items-center gap-2">
      <span className="text-xl">🔗</span>
      دورات تعليمية مقترحة:
    </h4>
    <div className="grid gap-3">
      {courses.map((course, idx) => (
        <CourseCard key={idx} course={course} />
      ))}
    </div>
  </div>
);

const CourseCard = ({ course }: { course: Course }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200
                  transform hover:-translate-y-1">
    <div className="flex justify-between items-center">
      <a href={course.url} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2
                                    hover:underline">
        <BookOpen size={16} />
        {course.name}
      </a>
      <StarRating rating={course.rating} />
    </div>
    <div className="flex justify-between text-sm text-gray-600 mt-2">
      <span className="flex items-center gap-1">
        <Award size={14} />
        {course.provider}
      </span>
      <span className="flex items-center gap-1">
        <Clock size={14} />
        {course.duration}
      </span>
    </div>
  </div>
);

const ActionButtons = () => (
  <div className="flex flex-wrap gap-3">
    <button className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-2.5 rounded-lg
                     flex items-center gap-2 hover:shadow-lg transform hover:-translate-y-1">
      <Globe size={18} />
      استكشاف بيئة العمل (AR)
    </button>
    <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-lg
                     flex items-center gap-2 hover:shadow-lg transform hover:-translate-y-1">
      <UserPlus size={18} />
      التواصل مع محترفين
    </button>
  </div>
);

// Component for job postings
const JobPostingsCard = () => {
  const [hoveredJob, setHoveredJob] = useState<number | null>(null);

  return (
    <Panel>
      <div className="flex justify-between items-center mb-4">
        <SectionHeader icon={<Briefcase size={20} />} title="وظائف مناسبة لك" />
        <div className="flex gap-2">
          <Badge text="جديد" color="emerald" />
          <Badge text={`${JOBS_DATA.length} وظائف`} color="blue" />
        </div>
      </div>
      
      <div className="space-y-4">
        {JOBS_DATA.map(job => (
          <div 
            key={job.id} 
            className={`border border-gray-100 rounded-lg p-4 transition-all duration-300
              ${hoveredJob === job.id 
                ? 'bg-gradient-to-r from-emerald-50 to-blue-50 shadow-md transform -translate-y-1' 
                : 'hover:bg-gray-50'}`}
            onMouseEnter={() => setHoveredJob(job.id)}
            onMouseLeave={() => setHoveredJob(null)}
          >
            <div className="flex justify-between">
              <div className="flex">
                <div className={`w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 
                  rounded-lg flex items-center justify-center text-emerald-700 font-bold ml-3
                  shadow-sm transition-transform duration-300
                  ${hoveredJob === job.id ? 'scale-110' : ''}`}>
                  {job.logo}
                </div>
                <div>
                  <h3 className="font-medium text-lg text-black">{job.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase size={14} />
                    <span>{job.company}</span>
                    <span>•</span>
                    <Globe size={14} />
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Badge text={job.posted} color="blue" />
                <span className="text-sm text-emerald-600 mt-1">يغلق خلال 5 أيام</span>
              </div>
            </div>
            
            <div className="mt-3 flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Badge text={job.type} color="gray" />
                <span className="text-sm font-medium text-gray-700">{job.salary}</span>
              </div>
              <div className="flex gap-2">
                <button className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <BookOpen size={18} />
                </button>
                <button className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <Star size={18} />
                </button>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-1">
                  <Send size={16} />
                  تقديم طلب
                </button>
              </div>
            </div>

            {hoveredJob === job.id && (
              <div className="mt-3 pt-3 border-t border-gray-200 animate-fadeIn">
                <div className="flex gap-2 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Clock size={14} className="ml-1" />
                    الخبرة المطلوبة: سنتان
                  </span>
                  <span className="flex items-center">
                    <User size={14} className="ml-1" />
                    50 متقدم
                  </span>
                  <span className="flex items-center">
                    <TrendingUp size={14} className="ml-1" />
                    نسبة التوافق: 85%
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-center">
        <button className="group bg-white border border-indigo-200 hover:border-indigo-300 text-indigo-600 px-6 py-2 rounded-md transition-all duration-200 flex items-center gap-2">
          عرض المزيد من الوظائف
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </Panel>
  );
};

// Component for chat section
const ChatSection = ({ chatInput, chatResponse, setChatInput, handleChatSubmit }: {
  chatInput: string;
  chatResponse: string;
  setChatInput: (input: string) => void;
  handleChatSubmit: (e: React.FormEvent) => void;
}) => (
  <Panel>
    
    <SectionHeader icon={<MessageSquare size={20} />} title="المستشار الافتراضي (روبوت دردشة ذكي)" />
    <div className="mb-4">
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <MessageSquare size={16} />
          </div>
          <p className="font-medium text-black">المستشار المهني الذكي</p>
        </div>
        
        {chatResponse && (
          <div className="mt-2 p-3 bg-emerald-50 rounded-lg border-r-4 border-emerald-500 animate-slideIn">
            <p className="text-black">{chatResponse}</p>
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-3">
          يمكنك سؤال المستشار عن التوصيات المهنية، تفاصيل المسارات، أو طلب نصائح شخصية.
        </div>
      </div>
      
      <form onSubmit={handleChatSubmit} className="flex">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="اكتب سؤالك هنا..."
          className="flex-1 border border-gray-300 rounded-r-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
        />
        <button 
          type="submit" 
          className="bg-emerald-500 text-white px-4 py-2 rounded-l-md hover:bg-emerald-600 transition-colors duration-200"
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
    
    <div className="bg-indigo-50 p-3 rounded-lg">
      <p className="text-sm font-medium text-indigo-800 mb-2">أسئلة مقترحة:</p>
      <div className="flex flex-wrap gap-2">
        <button className="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm border border-indigo-200 hover:bg-indigo-100 transition-colors duration-200">
          لماذا تناسبني مجال تطوير الواجهات؟
        </button>
        <button className="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm border border-indigo-200 hover:bg-indigo-100 transition-colors duration-200">
          ما هي المهارات التي يجب تطويرها؟
        </button>
        <button className="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm border border-indigo-200 hover:bg-indigo-100 transition-colors duration-200">
          كيف أبدأ في مجال تحليل البيانات؟
        </button>
      </div>
    </div>
  </Panel>
);

// Component for video recommendations
const VideoRecommendationsCard = () => (
  <Panel>
    <SectionHeader icon={<Play size={20} />} title="فيديوهات تعليمية مقترحة" />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-100 rounded-lg overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="h-32 bg-emerald-800 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <Play size={40} className="text-black opacity-80 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
        <div className="p-3">
          <h3 className="font-medium">مقدمة في تطوير الواجهات الأمامية</h3>
          <p className="text-sm text-gray-600">أكاديمية البرمجة • 15:30 دقيقة</p>
        </div>
      </div>
      
      <div className="bg-gray-100 rounded-lg overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="h-32 bg-blue-800 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <Play size={40} className="text-black opacity-80 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
        <div className="p-3">
          <h3 className="font-medium">أساسيات React للمبتدئين</h3>
          <p className="text-sm text-gray-600">عالم البرمجة • 22:45 دقيقة</p>
        </div>
      </div>
    </div>
    
    <div className="mt-4 text-center">
      <button className="text-indigo-600 hover:text-indigo-800 font-medium">
        عرض المزيد من الفيديوهات
      </button>
    </div>
  </Panel>
);

// Types for chart data
interface SkillTrendItem {
  name: string;
  current: number;
  previous: number;
  trend?: 'up' | 'down' | 'stable';
}

interface CareerMatchItem {
  name: string;
  value: number;
  color?: string;
}

// Component for skill trends bar chart with animations and gradients
const SkillTrendsChart = () => {
  const gradientOffset = () => {
    const dataMax = Math.max(...SKILL_TREND_DATA.map(d => d.current));
    const dataMin = Math.min(...SKILL_TREND_DATA.map(d => d.current));
    
    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;
    
    return dataMax / (dataMax - dataMin);
  };

  return (
    <Panel className="h-80 hover:shadow-lg transition-shadow duration-300 bg-white">
      <SectionHeader icon={<TrendingUp size={20} />} title="تطور المهارات المطلوبة" />
      
      <ResponsiveContainer width="100%" height="85%">
      <BarChart 
        data={SKILL_TREND_DATA.map(item => ({
        ...item,
        trend: ((item.current - item.previous) / item.previous * 100).toFixed(1)
        }))} 
        layout="vertical"
        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        barSize={24}
        barGap={8}
      >
        <defs>
        <linearGradient id="currentGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#059669" stopOpacity={1} />
        </linearGradient>
        <linearGradient id="previousGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.7} />
          <stop offset="100%" stopColor="#2563eb" stopOpacity={0.9} />
        </linearGradient>
        </defs>
        
        <XAxis 
        type="number" 
        domain={[0, 100]} 
        tickFormatter={(value) => `${value}%`}
        tick={{ fill: '#000000', fontSize: 12 }}
        axisLine={{ stroke: '#E5E7EB' }}
        tickLine={{ stroke: '#E5E7EB' }}
        />
        
        <YAxis 
        type="category" 
        dataKey="name" 
        width={120}
        tick={{ fill: '#000000', fontSize: 13, fontWeight: 500 }}
        axisLine={false}
        tickLine={false}
        />
        
        <Tooltip 
        contentStyle={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '12px',
          color: '#000000'
        }}
        formatter={(value: number, name: string) => [
          <span className="font-medium text-black">{`${value}%`}</span>,
          <span className="text-black">
          {name === 'current' ? 'الطلب الحالي' : 'العام الماضي'}
          </span>
        ]}
        labelStyle={{ 
          color: '#000000', 
          fontWeight: 'bold', 
          marginBottom: '4px' 
        }}
        cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
        />
        
        <Bar 
        dataKey="current" 
        fill="url(#currentGradient)" 
        name="current"
        animationDuration={1500}
        animationBegin={200}
        radius={[0, 4, 4, 0]}
        label={{
          position: 'right',
          fill: '#000000',
          fontSize: 12,
          fontWeight: 500,
          formatter: (item: { trend: string }) => `+${item.trend}%`
        }}
        />
        
        <Bar 
        dataKey="previous" 
        fill="url(#previousGradient)" 
        name="previous"
        animationDuration={1500}
        animationBegin={400}
        radius={[0, 4, 4, 0]}
        />
      </BarChart>
      </ResponsiveContainer>
    </Panel>
  );
};

// Component for career match pie chart with enhanced visuals
const CareerMatchChart = ({ data }: { data: CareerMatchItem[] }) => {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Panel className="h-80 hover:shadow-lg transition-shadow duration-300">
      <SectionHeader icon={<Award size={20} />} title="مؤشر التوافق المهني" />
      
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <defs>
            {THEME.colors.chartColors.map((color, index) => (
              <linearGradient key={`gradient-${index}`} id={`pieGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={color} stopOpacity={1} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            innerRadius={40}
            dataKey="value"
            animationBegin={100}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#pieGradient-${index})`}
                stroke={THEME.colors.chartColors[index % THEME.colors.chartColors.length]}
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => `${value}%`}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Panel>
  );
};
// Renamed to avoid conflict with the existing SectionHeader component
const SectionHeaderWithAction = ({ icon, title, action }: { icon: React.ReactNode; title: string; action: React.ReactNode }) => (
  <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
    <div className="flex items-center gap-2 text-emerald-700">
      {icon}
      <h2 className="font-bold text-lg">{title}</h2>
    </div>
    {action}
  </div>
);
// Component for market analysis
const MarketAnalysisCard = () => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentSkills = [
    { name: "JavaScript", growth: 15, level: 85, color: "emerald", trend: "↗️", demand: "عالي جداً" },
    { name: "تحليل البيانات", growth: 22, level: 78, color: "blue", trend: "⬆️", demand: "متزايد" },
    { name: "تصميم UI/UX", growth: 18, level: 75, color: "purple", trend: "↗️", demand: "عالي" },
    { name: "React", growth: 25, level: 90, color: "amber", trend: "⬆️", demand: "عالي جداً" }
  ];

  const futureSkills = [
    { 
      name: "الذكاء الاصطناعي وتعلم الآلة", 
      readiness: 65, 
      timing: "6-12 شهر",
      impact: "تحويلي",
      companies: ["Google", "Microsoft", "Amazon"]
    },
    { 
      name: "Web3 وتقنية Blockchain", 
      readiness: 45, 
      timing: "12-18 شهر",
      impact: "مرتفع",
      companies: ["Coinbase", "Binance", "Meta"]
    },
    { 
      name: "الواقع المعزز والافتراضي (AR/VR)", 
      readiness: 55, 
      timing: "6-12 شهر",
      impact: "متوسط",
      companies: ["Meta", "Apple", "Unity"]
    }
  ];

  const refreshData = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <Panel className="relative overflow-hidden backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
      <SectionHeader icon={<TrendingUp size={20} className="text-emerald-600" />} title="تحليل سوق العمل" />
      <RefreshCw 
        size={16} 
        className={`text-gray-400 hover:text-emerald-600 cursor-pointer transition-all duration-500 hover:rotate-180 ${isAnimating ? 'animate-spin' : ''}`}
        onClick={refreshData}
      />
      </div>
      
      <div className="mb-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-emerald-600 flex items-center gap-2 group">
        <span className="transform group-hover:rotate-12 transition-transform duration-300">🧭</span>
        المهارات الأكثر طلباً
        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full animate-pulse">
          تحديث مباشر
        </span>
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3 relative">
        {currentSkills.map((skill) => (
        <div
          key={skill.name}
          className={`p-4 rounded-lg transition-all duration-300  cursor-pointer border group
          ${selectedSkill === skill.name 
            ? `bg-${skill.color}-100 shadow-xl transform -translate-y-1 border-${skill.color}-200` 
            : `bg-${skill.color}-50 hover:bg-${skill.color}-100 border-transparent hover:shadow-md`}`}
          onClick={() => setSelectedSkill(skill.name)}
        >
          <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-lg text-black group-hover:text-${skill.color}-700">{skill.name}</span>
            <span className="text-sm animate-bounce">{skill.trend}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge text={`+${skill.growth}% نمو`} color={skill.color} />
            <Badge text={skill.demand} color="gray" />
          </div>
          </div>
          
          <div className="relative mb-4 group">
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
            className={`h-2.5 rounded-full transition-all duration-1000
              bg-gradient-to-r from-${skill.color}-400 to-${skill.color}-600 group-hover:animate-pulse`}
            style={{ width: `${skill.level}%` }}
            />
          </div>
          <span className="absolute -top-6 right-0 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            مستوى الطلب: {skill.level}%
          </span>
          </div>

          {selectedSkill === skill.name && (
          <div className="mt-3 space-y-2 text-sm animate-fadeIn">
            <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/50 p-2 rounded hover:bg-white/70 transition-colors duration-300">
              <p className="text-gray-600">متوسط الراتب</p>
              <p className="font-medium">1,500 - 2,500 dh</p>
            </div>
            <div className="bg-white/50 p-2 rounded hover:bg-white/70 transition-colors duration-300">
              <p className="text-gray-600">الوظائف المتاحة</p>
              <p className="font-medium">120+ وظيفة</p>
            </div>
            </div>
          </div>
          )}
        </div>
        ))}
      </div>
      </div>
      
      <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-emerald-600 flex items-center gap-2 group">
        <span className="transform group-hover:rotate-180 transition-transform duration-700">⏳</span>
        المهارات الناشئة للمستقبل
        <Badge text="توقعات 2024" color="indigo" />
        </h3>
      </div>

      <div className="space-y-4">
        {futureSkills.map((skill) => (
        <div 
          key={skill.name} 
          className="bg-gradient-to-r text-black from-indigo-50 to-purple-50 p-4 rounded-lg hover:shadow-lg transition-all duration-300
              transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer"
        >
          <div className="flex justify-between items-center mb-3">
          <div>
            <h4 className="font-medium mb-1 hover:text-indigo-700 transition-colors duration-300">{skill.name}</h4>
            <div className="flex gap-2 text-sm">
            <span className="text-gray-600">خلال {skill.timing}</span>
            <span>•</span>
            <span className="text-purple-600 font-medium">تأثير {skill.impact}</span>
            </div>
          </div>
          </div>
          
          <div className="mb-3 group">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
            className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000
                 group-hover:animate-pulse"
            style={{ width: `${skill.readiness}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            جاهزية السوق: {skill.readiness}%
          </div>
          </div>

          <div className="flex gap-2 mt-2">
          {skill.companies.map((company) => (
            <span key={company} 
              className="text-xs bg-white/50 px-2 py-1 rounded hover:bg-white/80 transition-colors duration-300
                   hover:shadow-sm">
            {company}
            </span>
          ))}
          </div>
        </div>
        ))}
      </div>
      </div>
    </Panel>
  );
};

// Component for profile summary
const ProfileSummaryCard = () => {
  return (
    <Panel className="mb-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold ml-4">
            أ
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">أيوب محمد</h2>
            <p className="text-gray-600">مطور واجهات أمامية متدرب</p>
          </div>
        </div>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2">
          <User size={16} />
          تعديل الملف
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-emerald-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-emerald-600 font-medium">مستوى التقدم</span>
            <span className="text-emerald-700 font-bold">85%</span>
          </div>
          <div className="w-full bg-emerald-200 rounded-full h-2 mt-2">
            <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-blue-600 font-medium">دورات مكتملة</span>
            <span className="text-blue-700 font-bold">12</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }} />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-purple-600 font-medium">مهارات مكتسبة</span>
            <span className="text-purple-700 font-bold">8</span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['JavaScript', 'React', 'HTML/CSS', 'UI/UX', 'Git'].map((skill, index) => (
          <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            {skill}
          </span>
        ))}
      </div>
    </Panel>
  );
};

// Component for learning path visualization
const LearningPathCard = () => {
  return (
    <Panel>
      <SectionHeader icon={<BookOpen size={20} />} title="مسار التعلم المخصص" />
      
      <div className="space-y-4">
        {LEARNING_PATH.map((step, index) => (
          <div 
            key={step.id}
            className={`bg-white p-4 rounded-lg border ${
              step.completed ? 'border-emerald-500' : 'border-gray-200'
            } transition-all duration-300 hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-black">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.duration}</p>
                </div>
              </div>
              <div className={`text-sm ${step.completed ? 'text-emerald-600' : 'text-gray-400'}`}>
                {step.completed ? '✓ مكتمل' : 'قيد التقدم'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          اكتمال المسار: {Math.round((LEARNING_PATH.filter(step => step.completed).length / LEARNING_PATH.length) * 100)}%
        </span>
        <button className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-md transition-all duration-200">
          تحديث المسار
        </button>
      </div>
    </Panel>
  );
};

// Component for personalized assessment
const AssessmentCard = () => {
  const [activeSection, setActiveSection] = useState('strengths');
  
  return (
    <Panel>
      <SectionHeader icon={<FileText size={20} />} title="نتائج التقييم الشخصي" />
      
      <div className="space-y-4">
        {/* Tab navigation */}
        <div className="flex space-x-2 space-x-reverse mb-4">
          {[
            { id: 'strengths', label: 'نقاط القوة', color: 'emerald' },
            { id: 'development', label: 'مجالات التطوير', color: 'blue' },
            { id: 'overview', label: 'التقييم العام', color: 'indigo' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                activeSection === tab.id
                  ? `bg-${tab.color}-100 text-${tab.color}-700 font-medium`
                  : 'hover:bg-gray-100'
              }`}
              aria-pressed={activeSection === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="transition-all duration-300">
          {activeSection === 'strengths' && (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-2 gap-3 text-black">
                {[
                  { icon: '🎨', text: 'التفكير الإبداعي', score: 95 },
                  { icon: '🧮', text: 'التفكير المنطقي', score: 90 },
                  { icon: '🔍', text: 'الاهتمام بالتفاصيل', score: 85 },
                  { icon: '💡', text: 'حل المشكلات', score: 88 }
                ].map((strength, idx) => (
                  <div
                    key={idx}
                    className="bg-emerald-50 p-3 rounded-lg hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-xl ml-2">{strength.icon}</span>
                        <span>{strength.text}</span>
                      </div>
                      <span className="text-emerald-600 font-medium">{strength.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between mb-4">
            <h3 className="font-medium text-black">مستوى التقدم الإجمالي</h3>
            <span className="text-emerald-600 font-medium">85%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: '85%' }}
              role="progressbar"
              aria-valuenow={85}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
        
        <div className="flex justify-center gap-3 mt-6">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-black px-4 py-2 rounded-md flex items-center transition-all duration-200 transform hover:-translate-y-1">
            <Download size={16} className="ml-2" />
            تحميل التقرير
          </button>
          <button className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-md flex items-center transition-all duration-200">
            <RefreshCw size={16} className="ml-2" />
            تحديث التقييم
          </button>
        </div>
      </div>
    </Panel>
  );
};
// Component for upcoming events with enhanced interactivity
const EventsCard = () => {
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);

  return (
    <Panel>
      <div className="flex justify-between items-center mb-4">
        <SectionHeader icon={<Calendar size={20} />} title="فعاليات وورش عمل" />
        <Badge text="4 فعاليات جديدة" color="emerald" />
      </div>
      
      <div className="space-y-4 text-black">
        {[
          {
            id: 1,
            date: { day: '15', month: 'أبريل' },
            title: 'ورشة تطوير تطبيقات React',
            time: '2:00 م - 4:00 م',
            type: 'online',
            color: 'black',
            spots: 5
          },
          {
            id: 2,
            date: { day: '22', month: 'أبريل' },
            title: 'ملتقى المهنيين في تقنية المعلومات',
            time: '5:00 م - 9:00 م',
            type: 'inPerson',
            color: 'blue',
            spots: 12
          }
        ].map(event => (
          <div
            key={event.id}
            className={`border-r-4 border-${event.color}-500 bg-gray-50 p-4 rounded-lg transition-all duration-300 ${
              hoveredEvent === event.id ? 'transform -translate-x-2' : ''
            }`}
            onMouseEnter={() => setHoveredEvent(event.id)}
            onMouseLeave={() => setHoveredEvent(null)}
          >
            <div className="flex items-start">
              <div className={`bg-${event.color}-100 text-${event.color}-800 p-3 rounded-lg text-center ml-4 min-w-16`}>
                <div className="text-lg font-bold">{event.date.day}</div>
                <div className="text-sm">{event.date.month}</div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg">{event.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <Clock size={14} />
                  <span className="text-sm">{event.time}</span>
                  <Badge 
                    text={event.type === 'online' ? 'عبر الإنترنت' : 'حضوري'} 
                    color={event.color} 
                  />
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    المقاعد المتبقية: {event.spots}
                  </span>
                  <button className={`bg-${event.color}-600 hover:bg-${event.color}-700 text-black px-4 py-2 rounded-md transition-all duration-200 transform hover:-translate-y-1`}>
                    حجز مقعد
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// Enhanced notifications component with animations and interaction
const NotificationsCard = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: '📊',
      title: 'تم تحديث تحليل سوق العمل',
      time: 'منذ 3 ساعات',
      color: 'emerald',
      isNew: true
    },
    {
      id: 2,
      icon: '🔔',
      title: 'موعد ورشة React غداً',
      time: 'منذ 5 ساعات',
      color: 'blue',
      isNew: true
    },
    {
      id: 3,
      icon: '💼',
      title: 'وظائف جديدة تناسب مهاراتك',
      time: 'منذ يوم واحد',
      color: 'amber',
      isNew: true
    }
  ]);

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <Panel className="bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="flex justify-between items-center mb-4">
        <SectionHeader icon={<Bell size={20} />} title="إشعارات مهمة" />
        <Badge 
          text={`${notifications.length} جديد`} 
          color={notifications.length > 0 ? 'red' : 'gray'} 
        />
      </div>
      
      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <span className={`text-${notification.color}-500 text-xl ml-3`}>
                  {notification.icon}
                </span>
                <div>
                  <p className="font-medium text-black">{notification.title}</p>
                  <p className="text-sm text-gray-500">{notification.time}</p>
                </div>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="حذف الإشعار"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// Component for Weekly time investment recommendation
const TimeInvestmentCard = () => {
  const [hoveredActivity, setHoveredActivity] = useState<string | null>(null);
  const activities = [
    { name: 'تعلم React', hours: 8, color: 'black', percentage: 40, icon: '💻' },
    { name: 'تطوير مشروع عملي', hours: 5, color: 'blue', percentage: 25, icon: '🚀' },
    { name: 'دراسة تصميم UI/UX', hours: 4, color: 'purple', percentage: 20, icon: '🎨' },
    { name: 'التواصل المهني', hours: 3, color: 'amber', percentage: 15, icon: '🤝' }
  ];

  const totalHours = activities.reduce((sum, activity) => sum + activity.hours, 0);

  return (
    <Panel className="transition-all duration-300 hover:shadow-lg">
      <SectionHeader icon={<Clock size={20} />} title="توصيات استثمار الوقت" />
      
      <div className="bg-gradient-to-br from-emerald-50 to-blue-50 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-emerald-700">خطة أسبوعية مقترحة</h3>
          <Badge text={`${totalHours} ساعة إجمالية`} color="emerald" />
        </div>

        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.name}
              className="transform transition-all text-black duration-300"
              onMouseEnter={() => setHoveredActivity(activity.name)}
              onMouseLeave={() => setHoveredActivity(null)}
              style={{
                transform: hoveredActivity === activity.name ? 'translateX(-8px)' : 'none'
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{activity.icon}</span>
                  <span className="font-medium">{activity.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge text={`${activity.hours} ساعات`} color={activity.color} />
                  {hoveredActivity === activity.name && (
                    <span className={`text-${activity.color}-600 text-sm animate-fadeIn`}>
                      {activity.percentage}%
                    </span>
                  )}
                </div>
              </div>

              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-${activity.color}-500 transition-all duration-1000`}
                    style={{ 
                      width: `${activity.percentage}%`,
                      boxShadow: hoveredActivity === activity.name ? `0 0 10px ${activity.color}` : 'none'
                    }}
                  />
                </div>
                {hoveredActivity === activity.name && (
                  <div className={`absolute -right-2 -top-8 bg-${activity.color}-100 text-${activity.color}-700 px-2 py-1 rounded text-xs animate-fadeIn`}>
                    {activity.hours * 60} دقيقة
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex gap-2">
        <button className="flex-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 px-4 rounded-md transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md">
          إنشاء جدول مخصص
        </button>
        <button className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 p-2 rounded-md transition-all duration-200 hover:shadow-md">
          <RefreshCw size={20} />
        </button>
      </div>
    </Panel>
  );
};

// ==================== MAIN COMPONENT ====================

// Main component for career dashboard
export default function CareerDashboard() {
  // State hooks
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Chart data
  const chartData = useMemo(() => CAREER_DATA.map(career => ({
    name: career.title,
    value: career.match
  })), []);

  // Event handlers
  const toggleCardExpansion = useCallback((id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  }, [expandedCard]);

  const handleChatSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() === '') return;
    
    // Simulate AI response - this would connect to an actual AI in production
    let response = '';
    
    if (chatInput.includes('لماذا') && chatInput.includes('تطوير الواجهات')) {
      response = "بناءً على نتائج اختبار الميول، تبين أن لديك ميولاً إبداعية وتقنية عالية، مما يجعل مجال تطوير الواجهات اختياراً مثالياً لك. كما أن مهاراتك في التفكير المنطقي والاهتمام بالتفاصيل تتوافق بشكل كبير مع متطلبات هذا المجال.";
    } else if (chatInput.includes('مهارات') || chatInput.includes('تطوير')) {
      response = "أوصي بالتركيز على تعميق معرفتك بـ JavaScript وإطار العمل React، كما أن تعلم أساسيات تصميم تجربة المستخدم سيعزز من قدراتك. اقترح أيضاً بناء مشاريع عملية لتطبيق ما تتعلمه والبدء في بناء محفظة أعمال مميزة.";
    } else if (chatInput.includes('تحليل البيانات')) {
      response = "للبدء في مجال تحليل البيانات، يمكنك البدء بتعلم لغة Python وأساسيات الإحصاء، ثم التعمق في مكتبات تحليل البيانات مثل Pandas و NumPy. أقترح البدء بدورة 'علم البيانات الشامل' على منصة DataCamp، ثم التدرب على مشاريع عملية باستخدام مجموعات بيانات حقيقية.";
    } else {
      response = "يمكنني مساعدتك في فهم التوصيات المهنية المقدمة لك وتقديم خطة تطوير شخصية مناسبة لأهدافك. هل لديك سؤال محدد حول المسارات المهنية أو المهارات المطلوبة أو خطوات التطور المهني؟";
    }
    
    setChatResponse(response);
    setChatInput('');
  }, [chatInput]);

  // Tab navigation renders
  const renderDashboardTab = () => (
    <>
      {/* User Profile Summary */}
      <ProfileSummaryCard />

      {/* Career Recommendations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <SectionHeader icon={<Briefcase size={20} />} title="التوصيات المهنية" />
            <div className="space-y-4">
              {CAREER_DATA.map((career) => (
                <CareerCard 
                  key={career.id}
                  career={career}
                  isExpanded={expandedCard === career.id}
                  onToggle={() => toggleCardExpansion(career.id)}
                />
              ))}
            </div>
          </div>
          
          <JobPostingsCard />
        </div>

        <div className="space-y-6">
          <MarketAnalysisCard />
          <CareerMatchChart data={chartData} />
          <NotificationsCard />
        </div>
      </div>

      {/* Virtual Advisor Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ChatSection 
            chatInput={chatInput}
            chatResponse={chatResponse}
            setChatInput={setChatInput}
            handleChatSubmit={handleChatSubmit}
          />
        </div>
        <TimeInvestmentCard />
      </div>

      {/* Additional Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <ActionButton 
          icon={<RefreshCw size={20} className="text-emerald-600 ml-2" />}
          text="إعادة إجراء اختبار الميول"
        />
        <ActionButton 
          icon={<Save size={20} className="text-emerald-600 ml-2" />}
          text="حفظ التوصيات بصيغة PDF"
          primary
        />
        <ActionButton 
          icon={<Calendar size={20} className="text-emerald-600 ml-2" />}
          text="إنشاء خطة تعلم أسبوعية"
        />
      </div>
    </>
  );

  const renderLearningTab = () => (
    <div className="space-y-6">
      <LearningPathCard />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoRecommendationsCard />
        </div>
        <SkillTrendsChart />
      </div>
      
      <AssessmentCard />
      <EventsCard />
    </div>
  );

  return (
    <div className="font-sans bg-gray-50 min-h-screen text-right" dir="rtl">
      <CustomStyles />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="pt-24">
        {/* Dashboard Header Section */}
        <header className="bg-gradient-to-l from-emerald-600 to-teal-500 shadow-md p-4 mb-6 text-white">
          <div className="container mx-auto flex justify-between items-center flex-wrap gap-2">
            <div>
              <h1 className="text-2xl font-bold">مرحباً، أيوب 👋 | ملفك المهني الذكي 📈</h1>
              <p className="text-emerald-100 text-sm mt-1">آخر تحديث للتوصيات: منذ 3 دقائق</p>
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <button className="bg-white hover:bg-emerald-50 text-emerald-600 px-4 py-2 rounded-md text-sm flex items-center transition-all duration-200 hover:shadow-md">
                <RefreshCw size={16} className="ml-1" />
                تحديث البيانات
              </button>
              <button className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md text-sm flex items-center transition-all duration-200 hover:shadow-md">
                <UserPlus size={16} className="ml-1" />
                دعوة مرشد مهني
              </button>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="container mx-auto px-4 mb-6">
          <div className="flex border-b border-gray-200">
            <button 
              className={`py-2 px-4 font-medium ${activeTab === 'dashboard' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-emerald-600'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              لوحة البيانات
            </button>
            <button 
              className={`py-2 px-4 font-medium ${activeTab === 'learning' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-emerald-600'}`}
              onClick={() => setActiveTab('learning')}
            >
              مسار التعلم
            </button>
          </div>
        </div>
        {/* Quick Stats Section */}
        <div className="container mx-auto px-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border-r-4 border-emerald-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">درجة التوافق المهني</p>
                  <h3 className="text-2xl font-bold text-emerald-600">91%</h3>
                </div>
                <div className="bg-emerald-100 p-3 rounded-full">
                  <TrendingUp size={24} className="text-emerald-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border-r-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">فرص عمل متاحة</p>
                  <h3 className="text-2xl font-bold text-blue-600">28</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Briefcase size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border-r-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">دورات موصى بها</p>
                  <h3 className="text-2xl font-bold text-purple-600">12</h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <BookOpen size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border-r-4 border-amber-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">نسبة تطور المهارات</p>
                  <h3 className="text-2xl font-bold text-amber-600">+15%</h3>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <Star size={24} className="text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights Banner */}
          <div className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-4 text-black">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-full ml-4">
                  <Zap size={24} className="text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">توصية الذكاء الاصطناعي</h3>
                  <p className="text-indigo-100">
                    بناءً على تحليل مهاراتك، نوصي بالتركيز على تعلم React و Next.js في الأسابيع القادمة
                  </p>
                </div>
              </div>
              <button className="bg-white/10 hover:bg-white/20 text-black px-4 py-2 rounded-md transition-colors duration-200">
                عرض التفاصيل
              </button>
            </div>
          </div>

          {/* Progress Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm flex items-center">
              <Clock size={14} className="ml-1" />
              تحديث يومي
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
              <RefreshCw size={14} className="ml-1" />
              يتم تحليل البيانات تلقائياً
            </div>
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
              <UserPlus size={14} className="ml-1" />
              5 مرشدين متاحين للتواصل
            </div>
          </div>
        </div>
        <main className="container mx-auto px-4 pb-12">
          {activeTab === 'dashboard' ? renderDashboardTab() : renderLearningTab()}
        </main>
      <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Quick Links */}
            <div className="transform hover:translate-x-2 transition-transform duration-300">
              <h4 className="font-bold mb-4 text-lg flex items-center text-emerald-400">
                <Compass className="ml-2" size={20} />
                روابط سريعة
              </h4>
              <ul className="space-y-3">
                {[
                  { text: 'الملف الشخصي', icon: User },
                  { text: 'الدورات التدريبية', icon: BookOpen },
                  { text: 'فرص العمل', icon: Briefcase },
                  { text: 'المرشدين المهنيين', icon: Users }
                ].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="flex items-center group text-gray-300 hover:text-emerald-400 transition-all duration-300">
                      <link.icon size={16} className="ml-2 opacity-50 group-hover:opacity-100" />
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Section */}
            <div className="transform hover:translate-x-2 transition-transform duration-300">
              <h4 className="font-bold mb-4 text-lg flex items-center text-blue-400">
                <FileText className="ml-2" size={20} />
                مصادر مفيدة
              </h4>
              <ul className="space-y-3">
                {[
                  { text: 'مكتبة الفيديوهات', icon: Play },
                  { text: 'المدونة المهنية', icon: FileText },
                  { text: 'إحصائيات السوق', icon: TrendingUp },
                  { text: 'دليل المهارات', icon: Award }
                ].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="flex items-center group text-gray-300 hover:text-blue-400 transition-all duration-300">
                      <link.icon size={16} className="ml-2 opacity-50 group-hover:opacity-100" />
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Section */}
            <div className="transform hover:translate-x-2 transition-transform duration-300">
              <h4 className="font-bold mb-4 text-lg flex items-center text-purple-400">
                <Users className="ml-2" size={20} />
                مجتمعنا
              </h4>
              <ul className="space-y-3">
                {[
                  { text: 'منتدى النقاش', icon: MessageSquare },
                  { text: 'مجموعات التعلم', icon: BookOpen },
                  { text: 'الفعاليات القادمة', icon: Calendar },
                  { text: 'قصص النجاح', icon: Star }
                ].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="flex items-center group text-gray-300 hover:text-purple-400 transition-all duration-300">
                      <link.icon size={16} className="ml-2 opacity-50 group-hover:opacity-100" />
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Social Section */}
            <div className="space-y-6">
              <div>
                <h4 className="font-bold mb-4 text-lg flex items-center text-amber-400">
                  <Mail className="ml-2" size={20} />
                  النشرة البريدية
                </h4>
                <form className="mt-2 relative">
                  <input 
                    type="email" 
                    placeholder="بريدك الإلكتروني" 
                    className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                  />
                  <button 
                    type="submit"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 p-2 rounded-md transition-colors duration-300"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-lg flex items-center">
                  <Globe className="ml-2" size={20} />
                  تابعنا
                </h4>
                <div className="flex gap-3">
                  {[
                    { icon: faFacebook, color: 'hover:bg-blue-600' },
                    { icon: faTwitter, color: 'hover:bg-sky-500' },
                    { icon: faLinkedin, color: 'hover:bg-blue-700' },
                    { icon: faGithub, color: 'hover:bg-gray-600' }
                  ].map((social, index) => (
                    <a 
                      key={index}
                      href="#"
                      className={`bg-gray-800/50 p-2.5 rounded-lg ${social.color} transition-all duration-300 hover:scale-110`}
                    >
                      <FontAwesomeIcon icon={social.icon} width={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800/50 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                © 2024 المستشار المهني الذكي. جميع الحقوق محفوظة.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                {['سياسة الخصوصية', 'الشروط والأحكام', 'خريطة الموقع'].map((item, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="hover:text-emerald-400 transition-colors duration-300"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </div>
  );
}