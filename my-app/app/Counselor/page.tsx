'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import Header from './Componenets/Header';

import {
  ChevronDown, ChevronUp, Save, RefreshCw, Calendar,
  Briefcase, User, TrendingUp, Globe, MessageSquare,
  Send, BookOpen, Award, Compass, Star, Zap, ArrowUpRight,
  UserPlus, FileText, Bell, Play, Download, Clock
} from 'lucide-react';

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
    salary: { min: 60000, max: 95000, currency: "ريال" },
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
    salary: { min: 55000, max: 90000, currency: "ريال" },
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
    salary: { min: 65000, max: 110000, currency: "ريال" },
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
    location: "الرياض (عن بعد)",
    type: "دوام كامل",
    salary: "80,000 - 95,000 ريال",
    posted: "منذ يومين",
    logo: "TF"
  },
  {
    id: 2,
    title: "مصمم UX/UI",
    company: "إبداع الرقمية",
    location: "جدة",
    type: "دوام كامل",
    salary: "75,000 - 85,000 ريال",
    posted: "منذ 3 أيام",
    logo: "إر"
  },
  {
    id: 3,
    title: "مطور React",
    company: "تطبيقات السحاب",
    location: "الدمام (مرن)",
    type: "دوام كامل",
    salary: "85,000 - 100,000 ريال",
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

// ==================== REUSABLE COMPONENTS ====================

// Animations as a component
const CustomStyles = () => (
  <style jsx global>{`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes pulseGlow {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out forwards;
    }
    .animate-slideIn {
      animation: slideIn 0.3s ease-out forwards;
    }
    .animate-pulse-glow {
      animation: pulseGlow 2s infinite;
    }
  `}</style>
);

// Reusable badge component
const Badge = ({ text, color = "emerald" }: { text: string; color?: string }) => (
  <span className={`bg-${color}-100 text-${color}-800 text-xs px-2 py-1 rounded-full font-medium`}>
    {text}
  </span>
);

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < fullStars ? "text-yellow-400" : (i === fullStars && hasHalfStar ? "text-yellow-400" : "text-gray-300")}>
          ★
        </span>
      ))}
      <span className="mr-1 text-sm">{rating.toFixed(1)}</span>
    </div>
  );
};

// Section header component
const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <h2 className="text-xl font-bold mb-4 flex items-center text-emerald-700">
    {icon}
    <span className="mr-2">{title}</span>
  </h2>
);

// Panel component
const Panel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 ${className}`}>
    {children}
  </div>
);

// Action button component
const ActionButton = ({ icon, text, onClick = () => {}, primary = false }: { 
  icon: React.ReactNode; 
  text: string; 
  onClick?: () => void;
  primary?: boolean;
}) => (
  <button 
    className={`rounded-lg p-4 text-center flex items-center justify-center transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 ${
      primary 
        ? "bg-gradient-to-l from-emerald-600 to-teal-500 text-black" 
        : "bg-gray-100 hover:bg-emerald-100 text-black"
    }`}
    onClick={onClick}
  >
    {icon}
    <span className="mr-2">{text}</span>
  </button>
);

// ==================== FEATURE COMPONENTS ====================

// Component for career card with toggle expansion
const CareerCard = ({ career, isExpanded, onToggle }: {
  career: CareerRecommendation;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const getMatchColor = (match: number) => {
    if (match > 80) return THEME.colors.primary;
    if (match > 70) return THEME.colors.secondary;
    return THEME.colors.accent;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div 
        className="p-4 cursor-pointer hover:bg-emerald-50 transition-colors duration-200"
        onClick={onToggle}
        role="button"
        aria-expanded={isExpanded}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-black">💼 المجال المقترح: {career.title}</h3>
          <div className="flex items-center">
            <Badge text={`نمو: +${career.growth}%`} color="blue" />
            <span className="mx-2">
              {isExpanded ? 
                <ChevronUp size={20} className="text-emerald-600" /> : 
                <ChevronDown size={20} className="text-emerald-600" />
              }
            </span>
          </div>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full transition-all duration-1000 ease-out" 
              style={{ 
                width: `${career.match}%`,
                backgroundColor: getMatchColor(career.match)
              }}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={career.match}
            ></div>
          </div>
          <span className="text-emerald-600 font-medium mr-2">✅ {career.match}٪</span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          متوسط الراتب: {career.salary.min.toLocaleString()} - {career.salary.max.toLocaleString()} {career.salary.currency} سنوياً
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 bg-emerald-50 border-t border-emerald-100 animate-fadeIn">
          <p className="mb-3 text-black">🎯 الوصف: {career.description}</p>
          
          <div className="mb-4">
            <p className="font-medium text-black mb-2">🔑 المهارات المطلوبة:</p>
            <div className="flex flex-wrap gap-2">
              {career.skills.map((skill, idx) => (
                <Badge key={idx} text={skill} color="indigo" />
              ))}
            </div>
          </div>
          
          <p className="mb-3 text-black">🔗 دورات تعليمية مقترحة:</p>
          <div className="space-y-3 mb-4">
            {career.courses.map((course, idx) => (
              <div key={idx} className="bg-white p-3 rounded-md shadow-sm">
                <div className="flex justify-between items-center">
                  <a href={course.url} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 font-medium">
                    {course.name}
                  </a>
                  <StarRating rating={course.rating} />
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>{course.provider}</span>
                  <span>⏱️ {course.duration}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-black px-4 py-2 rounded-md flex items-center transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
              <Globe size={16} className="ml-2" />
              استكشاف بيئة العمل (AR)
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-black px-4 py-2 rounded-md flex items-center transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
              <UserPlus size={16} className="ml-2" />
              التواصل مع محترفين
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Component for profile summary
const ProfileSummaryCard = () => (
  <Panel>
    <div className="flex justify-between items-start mb-4">
      <SectionHeader icon={<User size={20} />} title="نبذة مختصرة عن المستخدم" />
      <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center">
        تعديل الملف الشخصي
        <ArrowUpRight size={16} className="mr-1" />
      </button>
    </div>
    
    <div className="grid md:grid-cols-2 gap-4">
      <div className="flex">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl font-bold text-emerald-600 ml-4">
          أي
        </div>
        <div>
          <h3 className="font-bold text-lg">أيوب محمد</h3>
          <p className="text-gray-600 mb-1">طالب جامعي • تقنية المعلومات</p>
          <div className="flex gap-2 mt-2">
            <Badge text="مبدع" color="indigo" />
            <Badge text="تحليلي" color="purple" />
            <Badge text="متعلم نشط" color="blue" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50 p-3 rounded-lg">
          <div className="text-emerald-700 font-bold mb-1">الاهتمامات</div>
          <div className="text-sm">التصميم، البرمجة، التحليل، الإبداع، تطوير الألعاب</div>
        </div>
        <div className="bg-indigo-50 p-3 rounded-lg">
          <div className="text-indigo-700 font-bold mb-1">المهارات</div>
          <div className="text-sm">React، CSS، JavaScript، التفكير المنطقي، حل المشكلات</div>
        </div>
        <div className="bg-blue-500 p-3 rounded-lg">
          <div className="text-indigo-700 font-bold mb-1">نقاط القوة</div>
          <div className="text-sm">الإبداع، التواصل، العمل الجماعي، التعلم السريع</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-purple-700 font-bold mb-1">أهداف التطوير</div>
          <div className="text-sm">إتقان React، تعلم تحليل البيانات، تطوير مهارات القيادة</div>
        </div>
      </div>
    </div>
  </Panel>
);

// Component for learning path
const LearningPathCard = () => (
  <Panel>
    <div className="flex justify-between items-center mb-4">
      <SectionHeader icon={<Compass size={20} />} title="مسار التعلم المخصص" />
      <Badge text="تم إنشاؤه بالذكاء الاصطناعي" color="purple" />
    </div>
    
    <div className="space-y-3 mb-4">
      {LEARNING_PATH.map((item, idx) => (
        <div key={item.id} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
            item.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
          }`}>
            {item.completed ? <span>✓</span> : idx + 1}
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <span className={`font-medium ${item.completed ? 'text-emerald-600' : 'text-black'}`}>{item.title}</span>
              <span className="text-sm text-gray-500">{item.duration}</span>
            </div>
            {idx < LEARNING_PATH.length - 1 && (
              <div className="h-6 w-px bg-gray-200 mr-4 my-1"></div>
            )}
          </div>
        </div>
      ))}
    </div>
    
    <div className="mt-4 flex justify-center">
      <button className="bg-gradient-to-l from-indigo-600 to-purple-600 text-black py-2 px-4 rounded-md hover:shadow-lg transition-all duration-300">
        عرض الخطة التفصيلية وبدء التعلم
      </button>
    </div>
  </Panel>
);

// Component for job postings
const JobPostingsCard = () => (
  <Panel>
    <div className="flex justify-between items-center mb-4">
      <SectionHeader icon={<Briefcase size={20} />} title="وظائف مناسبة لك" />
      <Badge text="جديد" color="emerald" />
    </div>
    
    <div className="space-y-3">
      {JOBS_DATA.map(job => (
        <div key={job.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors duration-200">
          <div className="flex justify-between">
            <div className="flex">
              <div className="w-10 h-10 bg-emerald-100 rounded-md flex items-center justify-center text-emerald-700 font-bold ml-3">
                {job.logo}
              </div>
              <div>
                <h3 className="font-medium">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
              </div>
            </div>
            <Badge text={job.posted} color="blue" />
          </div>
          <div className="mt-2 flex justify-between items-center">
            <div className="flex gap-2">
              <Badge text={job.type} color="gray" />
              <span className="text-sm text-gray-700">{job.salary}</span>
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              عرض التفاصيل
            </button>
          </div>
        </div>
      ))}
    </div>
    
    <div className="mt-4 text-center">
      <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center mx-auto">
        عرض المزيد من الوظائف
        <ArrowUpRight size={16} className="mr-1" />
      </button>
    </div>
  </Panel>
);

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
    <Panel className="h-80 hover:shadow-lg transition-shadow duration-300">
      <SectionHeader icon={<TrendingUp size={20} />} title="تطور المهارات المطلوبة" />
      
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={SKILL_TREND_DATA as SkillTrendItem[]} layout="vertical">
          <defs>
            <linearGradient id="currentGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={THEME.colors.primary} stopOpacity={0.8} />
              <stop offset="100%" stopColor={THEME.colors.primary} stopOpacity={1} />
            </linearGradient>
            <linearGradient id="previousGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={THEME.colors.secondary} stopOpacity={0.8} />
              <stop offset="100%" stopColor={THEME.colors.secondary} stopOpacity={1} />
            </linearGradient>
          </defs>
          <XAxis 
            type="number" 
            domain={[0, 100]} 
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={100} 
            tick={{ fill: '#374151', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number) => [`${value}%`, 'نسبة الطلب']}
          />
          <Bar 
            dataKey="current" 
            fill="url(#currentGradient)" 
            name="حالياً"
            animationDuration={1500}
            animationBegin={200}
            radius={[0, 4, 4, 0]}
          />
          <Bar 
            dataKey="previous" 
            fill="url(#previousGradient)" 
            name="العام الماضي"
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

// Component for market analysis
const MarketAnalysisCard = () => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const currentSkills = [
    { name: "JavaScript", growth: 15, level: 85, color: "emerald", trend: "↗️" },
    { name: "تحليل البيانات", growth: 22, level: 78, color: "blue", trend: "⬆️" },
    { name: "تصميم UI/UX", growth: 18, level: 75, color: "purple", trend: "↗️" },
    { name: "React", growth: 25, level: 90, color: "amber", trend: "⬆️" }
  ];

  const futureSkills = [
    { name: "الذكاء الاصطناعي وتعلم الآلة", readiness: 65, timing: "6-12 شهر" },
    { name: "Web3 وتقنية Blockchain", readiness: 45, timing: "12-18 شهر" },
    { name: "الواقع المعزز والافتراضي (AR/VR)", readiness: 55, timing: "6-12 شهر" }
  ];

  return (
    <Panel>
      <SectionHeader icon={<TrendingUp size={20} />} title="تحليل سوق العمل" />
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-emerald-600">🧭 المهارات الأكثر طلباً</h3>
          <RefreshCw size={16} className="text-gray-400 hover:text-emerald-600 cursor-pointer" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {currentSkills.map((skill) => (
            <div
              key={skill.name}
              className={`p-3 rounded-md transition-all duration-300 cursor-pointer
                ${selectedSkill === skill.name 
                  ? `bg-${skill.color}-100 shadow-md transform -translate-y-1` 
                  : `bg-${skill.color}-50 hover:bg-${skill.color}-100`}`}
              onClick={() => setSelectedSkill(skill.name)}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-sm">{skill.trend}</span>
                </div>
                <Badge text={`+${skill.growth}% نمو`} color={skill.color} />
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-${skill.color}-500 transition-all duration-1000`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <span className="absolute -top-6 right-0 text-xs text-gray-600">
                  مستوى الطلب: {skill.level}%
                </span>
              </div>

              {selectedSkill === skill.name && (
                <div className="mt-3 text-sm text-gray-600 animate-fadeIn">
                  <div className="flex justify-between mb-1">
                    <span>متوسط الراتب:</span>
                    <span className="font-medium">15,000 - 25,000 ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span>عدد الوظائف المتاحة:</span>
                    <span className="font-medium">120+ وظيفة</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-emerald-600">⏳ المهارات الناشئة للمستقبل</h3>
          <Badge text="توقعات 2024" color="indigo" />
        </div>

        <div className="space-y-3">
          {futureSkills.map((skill) => (
            <div key={skill.name} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{skill.name}</span>
                <span className="text-sm text-gray-600">خلال {skill.timing}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: `${skill.readiness}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-gray-500">
                جاهزية السوق: {skill.readiness}%
              </div>
            </div>
          ))}
        </div>
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
              <div className="grid grid-cols-2 gap-3">
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
            <h3 className="font-medium">مستوى التقدم الإجمالي</h3>
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
      
      <div className="space-y-4">
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
                  <p className="font-medium">{notification.title}</p>
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
const TimeInvestmentCard = () => (
  <Panel>
    <SectionHeader icon={<Clock size={20} />} title="توصيات استثمار الوقت" />
    
    <div className="bg-emerald-50 p-4 rounded-lg mb-4">
      <h3 className="font-medium text-emerald-700 mb-2">خطة أسبوعية مقترحة</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span>تعلم React</span>
          <Badge text="8 ساعات" color="emerald" />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: '40%' }}></div>
        </div>
        
        <div className="flex justify-between items-center">
          <span>تطوير مشروع عملي</span>
          <Badge text="5 ساعات" color="blue" />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="h-1.5 rounded-full bg-blue-500" style={{ width: '25%' }}></div>
        </div>
        
        <div className="flex justify-between items-center">
          <span>دراسة تصميم UI/UX</span>
          <Badge text="4 ساعات" color="purple" />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="h-1.5 rounded-full bg-purple-500" style={{ width: '20%' }}></div>
        </div>
        
        <div className="flex justify-between items-center">
          <span>التواصل المهني</span>
          <Badge text="3 ساعات" color="amber" />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="h-1.5 rounded-full bg-amber-500" style={{ width: '15%' }}></div>
        </div>
      </div>
    </div>
    
    <button className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 rounded-md transition-colors duration-200">
      إنشاء جدول زمني مخصص
    </button>
  </Panel>
);

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
      </div>
    </div>
  );
}