import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Timer,
  Award,
  BookOpen,
  MapPin,
  History,
  Landmark,
  Coins,
  ShieldCheck,
  ArrowLeft,
  Flame,
  Sparkles,
  LayoutDashboard,
  Castle,
  Target,
  CheckCircle,
  Newspaper,
  BarChart3,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { quizData, type Category, type Question, SUB_TOPICS } from './data/quizData';
import { generateAIQuestions } from './services/geminiService';

// --- Styles & Constants ---

const THEME = {
  saffron: '#F27D26',
  marigold: '#FFB800',
  royalBlue: '#0055A4',
  terracotta: '#A42A04',
  sand: '#fdfbf7',
  ink: '#1a1a1a',
};

const CATEGORIES: { id: Category; label: string; icon: any; color: string; desc: string }[] = [
  { id: 'इतिहास', label: 'इतिहास', icon: History, color: '#f43f5e', desc: 'राजवंश, युद्ध और एकीकरण' },
  { id: 'भूगोल', label: 'भूगोल', icon: Landmark, color: '#0ea5e9', desc: 'नदियाँ, पर्वत और मरुस्थल' },
  { id: 'राजव्यवस्था', label: 'राजव्यवस्था', icon: ShieldCheck, color: '#10b981', desc: 'प्रशासन और विधानसभा' },
  { id: 'कला एवं संस्कृति', label: 'कला-संस्कृति', icon: Castle, color: '#8b5cf6', desc: 'लोक देवता, मेले और त्यौहार' },
];

const DAILY_FACTS = [
"राजस्थान की सबसे लंबी नदी चम्बल है।",
"राजस्थान की पूर्णतः बहने वाली सबसे लंबी नदी बनास है।",
"राजस्थान का सबसे ऊंचा पर्वत शिखर गुरु शिखर (1722 मी.) है।",
"राजस्थान का सबसे बड़ा जिला क्षेत्रफल की दृष्टि से जैसलमेर है।",
"राजस्थान का सबसे छोटा जिला क्षेत्रफल की दृष्टि से दूदू है।",
"राजस्थान की सबसे प्राचीन पर्वत श्रृंखला अरावली है।",
"राजस्थान का सबसे बड़ा बांध राणा प्रताप सागर है।",
"राजस्थान का सबसे ऊंचा बांध जाखम बांध है।",
"राजस्थान की सबसे बड़ी मीठे पानी की कृत्रिम झील जयसमंद है।",
"राजस्थान की सबसे बड़ी खारे पानी की झील सांभर है।",
"राजस्थान का राज्य पक्षी गोडावण है।",
"राजस्थान का राज्य पशु (पालतू) ऊंट है।",
"राजस्थान का राज्य पशु (वन्य) चिंकारा है।",
"राजस्थान का राज्य वृक्ष खेजड़ी है।",
"राजस्थान का राज्य पुष्प रोहिड़ा है।",
"राजस्थान का राज्य खेल बास्केटबॉल है।",
"राजस्थान का राज्य लोक नृत्य घूमर है।",
"राजस्थान का प्रवेश द्वार भरतपुर को कहा जाता है।",
"राजस्थान का सिंह द्वार अलवर को कहा जाता है।",
"राजस्थान का 'हृदय' अजमेर को कहा जाता है।",
"मरुस्थल का गुलाब जैसलमेर को कहा जाता है।",
"राजस्थान का 'गौरव' चित्तौड़गढ़ को कहा जाता है।",
"पहाड़ों की नगरी डूंगरपुर को कहा जाता है।",
"झीलों की नगरी उदयपुर को कहा जाता है।",
"राजस्थान का सबसे गर्म स्थान फलोदी है।",
"राजस्थान का सबसे आर्द्र स्थान माउंट आबू है।",
"राजस्थान का सबसे आर्द्र जिला झालावाड़ है।",
"राजस्थान का सबसे शुष्क जिला जैसलमेर है।",
"राजस्थान की स्वर्ण नगरी जैसलमेर को कहा जाता है।",
"राजस्थान की सूर्य नगरी जोधपुर को कहा जाता है।",
"राजस्थान की गुलाबी नगरी जयपुर है।",
"सौ द्वीपों का शहर बांसवाड़ा को कहा जाता है।",
"राजस्थान का नन्दन कानन सिलीसेढ़ झील को कहा जाता है।",
"राजस्थान की धातु नगरी नागौर है।",
"शिक्षा का तीर्थ स्थल कोटा है।",
"हवेलियों का शहर जैसलमेर है।",
"बावड़ियों का शहर बूंदी को कहा जाता है।",
"राजस्थान का मैनचेस्टर भीलवाड़ा है।",
"राजस्थान का नवीन मैनचेस्टर भिवाड़ी है।",
"थार का घड़ा चांदन नलकूप है।",
"रेगिस्तान का जलमहल बाटाडू का कुआँ है।",
"राजस्थान की मोनालिसा बणी-ठणी पेंटिंग को कहा जाता है।",
"डिंगल का हैरोस पृथ्वीराज राठौड़ को कहा जाता है।",
"राजस्थान का अबुल फजल मुहणोत नैणसी को कहा जाता है।",
"वागड़ के गांधी भोगीलाल पांड्या हैं।",
"राजस्थान के गांधी गोकुल भाई भट्ट हैं।",
"मेवाड़ का उद्धारक राणा हम्मीर को माना जाता है।",
"राजस्थान की मरु कोकिला अल्लाह जिलाई बाई हैं।",
"आधुनिक राजस्थान के निर्माता मोहनलाल सुखाड़िया थे।",
"हल्दीघाटी का शेर महाराणा प्रताप को कहा जाता है।",
"किलों का सिरमौर चित्तौड़गढ़ दुर्ग है।",
"राजस्थान का सबसे बड़ा लिविंग फोर्ट चित्तौड़गढ़ है।",
"गढ़ बिठली तारागढ़ (अजमेर) को कहा जाता है।",
"सुवर्णगिरि जालौर दुर्ग को कहा जाता है।",
"स्वर्णगिरि जैसलमेर दुर्ग को कहा जाता है।",
"एशिया की सबसे बड़ी तोप जयबाण है।",
"भारतीय मूर्तिकला का विश्वकोष विजय स्तम्भ को कहा जाता है।",
"राजस्थान का वेल्लोर भैंसरोड़गढ़ दुर्ग है।",
"जागीरी किलों का सिरमौर कुचामन दुर्ग है।",
"मिट्टी का किला लोहागढ़ है।",
"ढाई साके के लिए प्रसिद्ध दुर्ग जैसलमेर है।",
"यूनेस्को विश्व विरासत में शामिल पहाड़ी दुर्ग 6 दुर्ग हैं।",
"कालीबंगा सभ्यता का स्थान हनुमानगढ़ है।",
"आहड़ सभ्यता का उपनाम ताम्रवती नगरी है।",
"गणेश्वर सभ्यता को ताम्रयुगीन सभ्यताओं की जननी कहा जाता है।",
"विराट नगर मत्स्य जनपद की राजधानी थी।",
"1857 की क्रांति का राजस्थान में केंद्र नसीराबाद है।",
"राजस्थान के प्रथम मुख्यमंत्री हीरालाल शास्त्री थे।",
"राजस्थान के प्रथम निर्वाचित मुख्यमंत्री टीकाराम पालीवाल थे।",
"राजस्थान के प्रथम राज्यपाल गुरुमुख निहाल सिंह थे।",
"राजस्थान की प्रथम महिला मुख्यमंत्री वसुंधरा राजे थीं।",
"राजस्थान की प्रथम महिला राज्यपाल प्रतिभा पाटिल थीं।",
"राजस्थान स्थापना दिवस 30 मार्च है।",
"राजस्थान एकीकरण के कुल चरण 7 चरण हैं।",
"आधुनिक राजस्थान का स्थापना वर्ष 1 नवंबर 1956 है।",
"राजस्थान का सबसे बड़ा मेला पुष्कर मेला है।",
"आदिवासियों का कुंभ बेणेश्वर मेला है।",
"सांप्रदायिक सद्भाव का प्रतीक मेला रामदेवरा मेला है।",
"तेजाजी का मुख्य पशु मेला स्थान परबतसर है।",
"करणी माता का प्रसिद्ध मंदिर देशनोक बीकानेर में है।",
"चूहों वाली देवी करणी माता हैं।",
"ऊंटों के देवता पाबूजी हैं।",
"अग्नि नृत्य का उद्गम स्थल कतरियासर है।",
"तेरहताली नृत्य का संबंध कामेड़िया पंथ से है।",
"कच्छी घोड़ी नृत्य का क्षेत्र शेखावाटी है।",
"ढोल नृत्य का प्रसिद्ध जिला जालौर है।",
"बमरसिया नृत्य का क्षेत्र भरतपुर-अलवर है।",
"ब्लू पॉटरी का केंद्र जयपुर है।",
"थेवा कला का प्रसिद्ध जिला प्रतापगढ़ है।",
"उस्ता कला का केंद्र बीकानेर है।",
"अजरक प्रिंट का संबंध बाड़मेर से है।",
"दाबू प्रिंट का केंद्र आकोला चित्तौड़गढ़ है।",
"पिछवाई पेंटिंग का केंद्र नाथद्वारा है।",
"फड़ चित्रण का मुख्य स्थान शाहपुरा है।",
"राजस्थान की सबसे लोकप्रिय फड़ पाबूजी की फड़ है।",
"सबसे लंबी गाथा वाली फड़ देवनारायण जी की फड़ है।",
"गणौर त्यौहार की तिथि चैत्र शुक्ल तृतीया है।",
"छोटी तीज का उत्सव श्रावण शुक्ल तृतीया है।",
"बड़ी तीज (सातुड़ी तीज) की तिथि भाद्रपद कृष्ण तृतीया है।",
"बिश्नोई संप्रदाय के संस्थापक जाम्भोजी थे।",
"राजस्थान का कुल क्षेत्रफल 3,42,239 वर्ग किमी है।",
"भारत के क्षेत्रफल में राजस्थान का हिस्सा 10.41% है।",
"अंतर्राष्ट्रीय सीमा (रेडक्लिफ) की लंबाई 1070 किमी है।",
"राजस्थान की अंतरराज्यीय सीमा 4850 किमी है।",
"सर्वाधिक सीमा साझा करने वाला राज्य मध्य प्रदेश है।",
"न्यूनतम सीमा साझा करने वाला राज्य पंजाब है।",
"सबसे बड़ा वन्यजीव अभयारण्य राष्ट्रीय मरु उद्यान है।",
"सबसे छोटा वन्यजीव अभयारण्य सरिस्का 'अ' है।",
"राजस्थान का प्रथम राष्ट्रीय उद्यान रणथंभौर है।",
"केवलादेव घना पक्षी विहार का स्थान भरतपुर है।",
"प्राकृतिक विश्व धरोहर स्थल केवलादेव है।",
"टाइगर प्रोजेक्ट की शुरुआत 1973 में हुई।",
"राजस्थान का खजुराहो किराडू मंदिर है।",
"मेवाड़ का खजुराहो जगत अंबिका मंदिर है।",
"हाड़ौती का खजुराहो भण्डदेवरा है।",
"सबसे बड़ा थर्मल पावर स्टेशन सूरतगढ़ है।",
"एकमात्र परमाणु बिजलीघर रावतभाटा है।",
"खनिजों का अजायबघर राजस्थान को कहा जाता है।",
"सीसा-जस्ता उत्पादन में राजस्थान का एकाधिकार है।",
"सबसे बड़ी चांदी की खान जावर है।",
"संगमरमर की सबसे बड़ी मंडी किशनगढ़ है।",
"सर्वश्रेष्ठ संगमरमर की श्रेणी मकराना है।",
"सर्वाधिक पशु संपदा वाला जिला बाड़मेर है।",
"राजस्थान की कामधेनु राठी गाय है।",
"सबसे लंबा राष्ट्रीय राजमार्ग NH-11 है।",
"सबसे छोटा राष्ट्रीय राजमार्ग NH-919 है।",
"प्रथम रेल सेवा का आरंभ 1874 में हुआ।",
"इंदिरा गांधी नहर की मुख्य फीडर लंबाई 204 किमी है।",
"राजस्थान की मरुगंगा इंदिरा गांधी नहर है।",
"सिंचाई का मुख्य स्रोत कुएं एवं नलकूप हैं।",
"प्रथम जनगणना का वर्ष 1901 है।",
"जनगणना 2011 का लिंगानुपात 928 है।",
"सर्वाधिक साक्षरता वाला जिला कोटा है।",
"न्यूनतम साक्षरता वाला जिला जालौर है।",
"काठ का रैन बसेरा महल झालावाड़ में है।",
"पन्ना धाय के बलिदान का संबंध पुत्र चन्दन से है।",
"ढोला-मारू प्रेम कथा का क्षेत्र मारवाड़ है।",
"रावण की चंवरी का स्थान मंडोर है।",
"राजकीय गीत केसरिया बालम आवो नी पधारो म्हारे देस है।",
"पाथल और पीथल के रचयिता कन्हैयालाल सेठिया हैं।",
"गोकुल भाई भट्ट का जन्म स्थान हाथल गाँव है।",
"राजस्थान की वैष्णो देवी अर्बुदा देवी हैं।",
"थार की वैष्णो देवी तनोट माता हैं।",
"रुणेचा रा धणी बाबा रामदेव हैं।",
"भक्ति आंदोलन के प्रवर्तक संत धन्ना थे।",
"मीराबाई का जन्म स्थान कुड़की है।",
"वागड़ की मीरा गवरी बाई हैं।",
"सांभर झील का निर्माता वासुदेव चौहान है।",
"राजस्थान की सबसे ऊंची झील नक्की झील है।",
  "राजस्थान क्षेत्रफल की दृष्टि से भारत का सबसे बड़ा राज्य है।",
  "चित्तौड़गढ़ किला भारत के सबसे बड़े किलों में से एक है।",
  "हवा महल में 953 छोटी खिड़कियां हैं, जिन्हें 'झरोखा' कहा जाता है।",
  "अरावली दुनिया की सबसे पुरानी पर्वत श्रृंखलाओं में से एक है।",
  "जैसलमेर को 'स्वर्ण नगरी' के नाम से भी जाना जाता है।",
  "उदयपुर को 'झीलों की नगरी' और 'पूर्व का वेनिस' कहा जाता है।",
  "राजस्थान का एकमात्र हिल स्टेशन माउंट आबू है।",
  "पुष्कर को 'तीर्थराज' या 'तीर्थों का मामा' कहा जाता है।",
  "भरतपुर पक्षी अभयारण्य (केवलादेव) यूनेस्को की विश्व धरोहर सूची में है।",
  "राजस्थान की सबसे लंबी नदी चम्बल है।",
  "विजय स्तम्भ को 'भारतीय मूर्तिकला का विश्वकोश' कहा जाता है।",
  "जोधपुर को 'ब्लू सिटी' या 'सूर्य नगरी' के नाम से जाना जाता है।",
  "बीकानेर को 'ऊँटों का देश' कहा जाता है।",
  "रणथंभौर राष्ट्रीय उद्यान टाइगर सफारी के लिए विश्व प्रसिद्ध है।",
  "कणी माता मंदिर (देशनोक) चूहों के लिए प्रसिद्ध है।"
];

// --- Components ---

type View = 'dashboard' | 'topic-list' | 'daily-targets' | 'quiz' | 'result' | 'stats';

interface QuizHistoryItem {
  date: string;
  score: number;
  total: number;
  category: string;
  missedTopics: string[];
}
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All' | 'Daily' | string>('All');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ questionId: number; isCorrect: boolean }[]>([]);
  const [dailyFactIndex, setDailyFactIndex] = useState(Math.floor(Math.random() * DAILY_FACTS.length));
  const [isLoading, setIsLoading] = useState(false);
  
  // No Repetition Logic
  const [seenQuestionIds, setSeenQuestionIds] = useState<number[]>([]);

  // Daily Target State
  const [dailyTargets, setDailyTargets] = useState<string[]>([]);
  const [completedTargets, setCompletedTargets] = useState<string[]>([]);

  // Stats History
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
  const [streak, setStreak] = useState(0);
// AI se sawal mangne wala function
 const fetchAIQuestions = async (topicName: string) => {
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Smart Prompt jo topic ke hisaab se sawal mangega
      const prompt = `Generate 10 hard multiple choice questions about "${topicName}" of Rajasthan in Hindi. 
      Return ONLY a JSON array with this structure: 
      [{"question": "...", "options": ["a", "b", "c", "d"], "correctAnswer": 0}] 
      Do not include markdown or backticks.`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleanJson = text.replace(/```json|```/g, "").trim();
      const data = JSON.parse(cleanJson);
      
      setActiveQuestions(data);
      setCurrentQuestionIndex(0);
      setScore(0);
      setView('quiz');
    } catch (error) {
      console.error("AI Error:", error);
      alert("Is topic ke sawal taiyar nahi ho paye, kripya dubara koshish karein.");
    }
    setIsLoading(false);
  };  // Initialize
  useEffect(() => {
    const allSubTopics = Object.values(SUB_TOPICS).flat();
    const shuffled = [...allSubTopics].sort(() => 0.5 - Math.random());
    setDailyTargets(shuffled.slice(0, 10));
    
    // Load all state from localStorage
    const savedTargets = localStorage.getItem('completedTargets');
    if (savedTargets) setCompletedTargets(JSON.parse(savedTargets));

    const savedSeen = localStorage.getItem('seenQuestionIds');
    if (savedSeen) setSeenQuestionIds(JSON.parse(savedSeen));

    const savedHistory = localStorage.getItem('quizHistory');
    if (savedHistory) setQuizHistory(JSON.parse(savedHistory));

    const savedStreak = localStorage.getItem('userStreak');
    if (savedStreak) {
      const { count, lastDate } = JSON.parse(savedStreak);
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (lastDate === today) {
        setStreak(count);
      } else if (lastDate === yesterday) {
        setStreak(count);
      } else {
        setStreak(0); // Streak broken
      }
    } else {
      setStreak(1); // First time
      localStorage.setItem('userStreak', JSON.stringify({ count: 1, lastDate: new Date().toDateString() }));
    }

    // Resume Session Cache
    const savedSession = localStorage.getItem('quizSession');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setView(session.view);
      setSelectedCategory(session.selectedCategory);
      setActiveQuestions(session.activeQuestions);
      setCurrentQuestionIndex(session.currentQuestionIndex);
      setScore(session.score);
      setAnswers(session.answers);
      setIsAnswered(session.isAnswered);
      setSelectedOption(session.selectedOption);
    }
  }, []);

  // Save Session Persistent Cache
  useEffect(() => {
    if (view === 'quiz') {
      const session = {
        view,
        selectedCategory,
        activeQuestions,
        currentQuestionIndex,
        score,
        answers,
        isAnswered,
        selectedOption
      };
      localStorage.setItem('quizSession', JSON.stringify(session));
    } else if (view === 'dashboard' || view === 'result') {
      localStorage.removeItem('quizSession');
    }
    localStorage.setItem('currentView', view);
  }, [view, selectedCategory, activeQuestions, currentQuestionIndex, score, answers, isAnswered, selectedOption]);

  useEffect(() => {
    localStorage.setItem('completedTargets', JSON.stringify(completedTargets));
  }, [completedTargets]);

  useEffect(() => {
    localStorage.setItem('seenQuestionIds', JSON.stringify(seenQuestionIds));
  }, [seenQuestionIds]);

  const currentQuestion = activeQuestions[currentQuestionIndex];

  useEffect(() => {
    let timer: any;
    if (view === 'quiz' && timeLeft > 0 && !isAnswered) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(-1);
    }
    return () => clearInterval(timer);
  }, [view, timeLeft, isAnswered]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDailyFactIndex((prev) => (prev + 1) % DAILY_FACTS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const selectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setView('topic-list');
  };

  const startQuiz = async (cat: Category | 'All' | 'Daily' | string) => {
    setIsLoading(true);
    setSelectedCategory(cat);
    
    try {
      let subTopic = cat;
      let category = '';

      if (cat === 'All') {
        category = 'सम्पूर्ण राजस्थान सामान्य ज्ञान';
        subTopic = 'मिश्रित टॉपिक्स';
      } else if (cat === 'Daily') {
        category = 'डेली चैलेंज';
        subTopic = dailyTargets.join(', ');
      } else {
        // Find parent category
        category = Object.entries(SUB_TOPICS).find(([_, subs]) => subs.includes(cat as string))?.[0] || 'सामान्य';
      }

      const questions = await generateAIQuestions(category, subTopic);
      
      setActiveQuestions(questions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setAnswers([]);
      setIsAnswered(false);
      setSelectedOption(null);
      setTimeLeft(30);
      setView('quiz');
    } catch (error) {
      console.error("Failed to start AI quiz:", error);
      // Fallback to local data if AI fails
      const fallback = quizData.sort(() => 0.5 - Math.random()).slice(0, 15);
      setActiveQuestions(fallback);
      setView('quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    const isCorrect = optionIndex === currentQuestion.correct;
    if (isCorrect) setScore((prev) => prev + 1);
    
    const newAnswer = { questionId: currentQuestion.id, isCorrect };
    setAnswers((prev) => [...prev, newAnswer]);
    
    // Mark as seen
    setSeenQuestionIds(prev => [...new Set([...prev, currentQuestion.id])]);

    setTimeout(() => {
      if (view === 'quiz') {
        nextQuestion(newAnswer);
      }
    }, 1500);
  };

  const nextQuestion = (lastAnswer?: { questionId: number; isCorrect: boolean }) => {
    setCurrentQuestionIndex((prev) => {
      if (prev < activeQuestions.length - 1) {
        setSelectedOption(null);
        setIsAnswered(false);
        setShowHint(false);
        setTimeLeft(30);
        return prev + 1;
      } else {
        // Quiz Finished
        const allAnswers = lastAnswer ? [...answers, lastAnswer] : answers;
        const finalScore = allAnswers.filter(a => a.isCorrect).length;
        const accuracy = (finalScore / activeQuestions.length) * 100;
        
        // Save to history
        const missed = allAnswers
          .filter(a => !a.isCorrect)
          .map(a => activeQuestions.find(q => q.id === a.questionId)?.subTopic || 'Unknown');
        
        const historyItem: QuizHistoryItem = {
          date: new Date().toISOString(),
          score: finalScore,
          total: activeQuestions.length,
          category: typeof selectedCategory === 'string' ? selectedCategory : 'Mixed',
          missedTopics: missed
        };
        
        setQuizHistory(prevHistory => {
          const newHistory = [...prevHistory, historyItem];
          localStorage.setItem('quizHistory', JSON.stringify(newHistory));
          return newHistory;
        });

        // Update Streak
        const today = new Date().toDateString();
        const savedStreak = localStorage.getItem('userStreak');
        if (savedStreak) {
          const { count, lastDate } = JSON.parse(savedStreak);
          if (lastDate !== today) {
            const newCount = count + 1;
            setStreak(newCount);
            localStorage.setItem('userStreak', JSON.stringify({ count: newCount, lastDate: today }));
          }
        }

        if (accuracy >= 80 && typeof selectedCategory === 'string' && dailyTargets.includes(selectedCategory)) {
          if (!completedTargets.includes(selectedCategory)) {
            setCompletedTargets(prev => [...prev, selectedCategory]);
          }
        }

        setView('result');
        return prev;
      }
    });
  };

  const resetToDashboard = () => {
    setView('dashboard');
    setSelectedCategory('All');
    setActiveQuestions([]);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#1a1a1a] font-sans selection:bg-[#F27D26]/30 overflow-hidden">
      {/* Mandana Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="mandana" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#mandana)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto h-screen flex flex-col p-4 md:p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F27D26] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#F27D26]/30">
              <Trophy size={24} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold tracking-tight text-slate-900">राजस्थान GK मास्टर</h1>
              <p className="text-[10px] font-bold text-[#F27D26] uppercase tracking-[0.2em]">वीर भूमि की विरासत</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView('stats')}
              className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all font-bold text-xs"
            >
              <BarChart3 size={16} className="text-[#F27D26]" />
              <span className="hidden sm:inline">सांख्यिकी</span>
            </button>
            <button 
              onClick={() => setView('daily-targets')}
              className="hidden md:flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all font-bold text-xs"
            >
              <Target size={16} className="text-[#F27D26]" />
              डेली टारगेट ({completedTargets.length}/10)
            </button>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              <Flame size={16} className="text-[#F27D26]" />
              <span className="font-bold text-sm">{streak}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#fdfbf7]/80 backdrop-blur-sm rounded-3xl"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-20 h-20 border-4 border-[#F27D26]/20 border-t-[#F27D26] rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-[#F27D26] animate-pulse" size={24} />
                  </div>
                </div>
                <div className="mt-6 text-center space-y-2">
                  <h3 className="text-xl font-serif font-bold text-slate-800">प्रश्न तैयार किए जा रहे हैं...</h3>
                  <p className="text-slate-500 text-sm animate-pulse">वीर भूमि की विरासत से बेहतरीन प्रश्न खोजे जा रहे हैं</p>
                </div>
              </motion.div>
            )}

            {view === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full bg-white rounded-3xl p-6 border border-slate-100 shadow-2xl overflow-y-auto custom-scrollbar"
              >
                <div className="flex items-center gap-4 mb-8">
                  <button 
                    onClick={() => setView('dashboard')}
                    className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-2xl font-serif font-bold text-slate-800">प्रदर्शन सांख्यिकी</h2>
                </div>

                {quizHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                      <BarChart3 size={32} />
                    </div>
                    <p className="text-slate-500 font-medium">अभी तक कोई डेटा उपलब्ध नहीं है।<br />सांख्यिकी देखने के लिए एक क्विज़ पूरा करें।</p>
                  </div>
                ) : (
                  <div className="space-y-8 pb-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                          <TrendingUp size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">औसत सटीकता</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-900">
                          {Math.round(quizHistory.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / quizHistory.length * 100)}%
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                          <CheckCircle size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">कुल क्विज़</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">{quizHistory.length}</p>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                        <div className="flex items-center gap-2 text-amber-600 mb-1">
                          <Trophy size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">सर्वश्रेष्ठ स्कोर</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-900">
                          {Math.max(...quizHistory.map(h => h.score))}/15
                        </p>
                      </div>
                    </div>

                    {/* Accuracy Trend Chart */}
                    <div className="space-y-4">
                      <h3 className="font-serif font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp size={18} className="text-[#F27D26]" />
                        प्रगति का रुझान
                      </h3>
                      <div className="h-64 w-full bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={quizHistory.slice(-10).map((h, i) => ({ name: i + 1, accuracy: Math.round((h.score / h.total) * 100) }))}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" hide />
                            <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                            <Tooltip 
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                              labelStyle={{ display: 'none' }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="accuracy" 
                              stroke="#F27D26" 
                              strokeWidth={3} 
                              dot={{ r: 4, fill: '#F27D26', strokeWidth: 2, stroke: '#fff' }}
                              activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Frequently Missed Topics */}
                    <div className="space-y-4">
                      <h3 className="font-serif font-bold text-slate-800 flex items-center gap-2">
                        <AlertCircle size={18} className="text-red-500" />
                        अक्सर गलत होने वाले विषय
                      </h3>
                      <div className="h-64 w-full bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            layout="vertical"
                            data={Object.entries(
                              quizHistory.flatMap(h => h.missedTopics).reduce((acc: any, curr) => {
                                acc[curr] = (acc[curr] || 0) + 1;
                                return acc;
                              }, {})
                            )
                            .sort((a: any, b: any) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([name, count]) => ({ name, count }))}
                          >
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} stroke="#64748b" fontSize={10} />
                            <Tooltip 
                              cursor={{ fill: 'transparent' }}
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="count" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {view === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex flex-col space-y-4 overflow-y-auto pr-2 custom-scrollbar"
              >
                {/* Topic Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-serif font-bold text-slate-800 flex items-center gap-2">
                      <LayoutDashboard className="text-[#F27D26]" size={18} />
                      विषय चुनें
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {CATEGORIES.map((cat) => (
                      <motion.button
                        key={cat.id}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectCategory(cat.id)}
                        className="group bg-white p-3 rounded-2xl border border-slate-100 shadow-md text-center relative overflow-hidden transition-all hover:border-[#F27D26]/30"
                      >
                        <div className="space-y-2 relative z-10 flex flex-col items-center">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                            style={{ backgroundColor: cat.color }}
                          >
                            <cat.icon size={20} />
                          </div>
                          <h4 className="text-sm font-bold text-slate-800">{cat.label}</h4>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Daily Quiz Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setView('daily-targets')}
                  className="w-full bg-gradient-to-r from-[#F27D26] to-[#A42A04] p-5 rounded-3xl text-white flex items-center justify-between shadow-xl shadow-[#F27D26]/20 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                      <Target size={28} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-serif font-bold">डेली क्विज़ चैलेंज</h3>
                      <p className="text-white/80 text-xs">15 कठिन प्रश्न, 80% स्कोर अनिवार्य</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </motion.button>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-100 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                      <Castle size={100} />
                    </div>
                    <div className="relative z-10 space-y-3">
                      <h2 className="text-2xl font-serif font-bold text-slate-800 leading-tight">
                        राजस्थान की विरासत को <br /> गहराई से जानें
                      </h2>
                      <p className="text-slate-500 text-xs max-w-md">
                        विषय-वार कठिन क्विज़ के साथ अपनी तैयारी को अगले स्तर पर ले जाएं।
                      </p>
                      <button 
                        onClick={fetchAIQuestions}
                        className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2"
                      >
                        सम्पूर्ण अभ्यास शुरू करें
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-[#F27D26]/10 shadow-lg flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#F27D26] font-bold uppercase tracking-widest text-[9px]">
                        <BookOpen size={10} />
                        <span>आज का तथ्य</span>
                      </div>
                      <p className="text-base font-serif font-bold text-slate-800 leading-snug">
                        "{DAILY_FACTS[dailyFactIndex]}"
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-medium">तैयारी का स्तर</span>
                        <span className="text-[#F27D26] font-bold">उत्कृष्ट</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'topic-list' && (
              <motion.div
                key="topic-list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full bg-white rounded-3xl p-6 border border-slate-100 shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-xl font-serif font-bold">{selectedCategory} - टॉपिक्स</h2>
                  <div className="w-10" />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SUB_TOPICS[selectedCategory as Category]?.map((topic) => (
                    <motion.button
                      key={topic}
                      whileHover={{ x: 5 }}
                      onClick={() => startQuiz(topic)}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-left hover:border-[#F27D26]/30 hover:bg-white transition-all flex items-center justify-between group"
                    >
                      <span className="font-bold text-slate-700 text-sm">{topic}</span>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-[#F27D26]" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {view === 'daily-targets' && (
              <motion.div
                key="daily-targets"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="h-full bg-white rounded-3xl p-6 border border-slate-100 shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-xl font-serif font-bold">डेली टारगेट</h2>
                  <div className="w-10" />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                  {dailyTargets.map((topic, idx) => {
                    const isCompleted = completedTargets.includes(topic);
                    return (
                      <div 
                        key={topic}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                          isCompleted ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100 hover:border-[#F27D26]/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isCompleted ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-200'
                          }`}>
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className={`font-bold text-sm ${isCompleted ? 'text-emerald-700' : 'text-slate-700'}`}>{topic}</h4>
                            <p className="text-[10px] text-slate-400">80% स्कोर अनिवार्य</p>
                          </div>
                        </div>
                        {isCompleted ? (
                          <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                            <CheckCircle size={14} />
                            पूर्ण
                          </div>
                        ) : (
                          <button 
                            onClick={() => startQuiz(topic)}
                            className="bg-[#F27D26] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-[#A42A04] transition-colors"
                          >
                            शुरू करें
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {view === 'quiz' && activeQuestions.length > 0 && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full bg-white rounded-3xl p-5 md:p-6 border border-slate-100 shadow-2xl flex flex-col"
              >
                {/* Quiz Header */}
                <div className="flex items-center justify-between mb-2 md:mb-4 shrink-0">
                  <div className="flex items-center gap-2 md:gap-3">
                    <button onClick={resetToDashboard} className="p-1 hover:bg-slate-50 rounded-full transition-colors">
                      <ArrowLeft size={16} md:size={18} />
                    </button>
                    <div>
                      <h3 className="font-bold text-slate-800 text-[11px] md:text-sm truncate max-w-[100px] md:max-w-none">{selectedCategory}</h3>
                      <p className="text-[9px] text-slate-400">प्रश्न {currentQuestionIndex + 1} / {activeQuestions.length}</p>
                    </div>
                  </div>
                  
                  {/* 15 Dots Progress Indicator */}
                  <div className="flex gap-0.5 md:gap-1">
                    {Array.from({ length: 15 }).map((_, idx) => {
                      const answer = answers[idx];
                      let color = "bg-slate-100";
                      if (answer) {
                        color = answer.isCorrect ? "bg-emerald-500" : "bg-red-500";
                      } else if (idx === currentQuestionIndex) {
                        color = "bg-[#F27D26] animate-pulse";
                      }
                      return (
                        <div key={idx} className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors ${color}`} />
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold text-[10px] ${timeLeft < 10 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-slate-50 text-slate-600'}`}>
                      <Timer size={12} />
                      <span>{timeLeft}s</span>
                    </div>
                  </div>
                </div>

                {/* Question Area */}
                <div className="flex-1 flex flex-col justify-start md:justify-center max-w-2xl mx-auto w-full overflow-hidden mt-1 md:mt-0">
                  <div className="space-y-3 md:space-y-5">
                    <div className="space-y-1 md:space-y-2">
                      <div className="inline-block px-2 py-0.5 rounded-md bg-[#F27D26]/10 text-[#F27D26] text-[8px] md:text-[9px] font-bold uppercase tracking-widest">
                        {currentQuestion.difficulty} • {currentQuestion.subTopic}
                      </div>
                      <h2 className="text-base md:text-xl font-serif font-bold text-slate-800 leading-tight">
                        {currentQuestion.q}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-2.5">
                      {currentQuestion.options.map((option, idx) => {
                        const isCorrect = idx === currentQuestion.correct;
                        const isSelected = idx === selectedOption;
                        
                        let stateStyles = "border-slate-100 hover:border-[#F27D26]/30 hover:bg-slate-50";
                        if (isAnswered) {
                          if (isCorrect) stateStyles = "border-emerald-500 bg-emerald-50 text-emerald-700";
                          else if (isSelected) stateStyles = "border-red-500 bg-red-50 text-red-700";
                          else stateStyles = "opacity-50 border-slate-100";
                        }

                        return (
                          <motion.button
                            key={idx}
                            whileHover={!isAnswered ? { scale: 1.01 } : {}}
                            whileTap={!isAnswered ? { scale: 0.99 } : {}}
                            onClick={() => handleAnswer(idx)}
                            disabled={isAnswered}
                            className={`p-2.5 md:p-3.5 rounded-xl border-2 text-left font-bold text-[11px] md:text-xs transition-all flex items-center justify-between ${stateStyles}`}
                          >
                            <span>{option}</span>
                            {isAnswered && isCorrect && <CheckCircle2 size={14} md:size={16} className="text-emerald-500" />}
                            {isAnswered && isSelected && !isCorrect && <XCircle size={14} md:size={16} className="text-red-500" />}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 flex items-center justify-between shrink-0">
                  <button 
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-[#F27D26] font-bold text-[10px] transition-colors"
                  >
                    <HelpCircle size={14} />
                    हिंट चाहिए?
                  </button>
                  <AnimatePresence>
                    {showHint && (
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[9px] font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 italic max-w-[180px]"
                      >
                        {currentQuestion.hint}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {view === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full bg-white rounded-3xl p-6 border border-slate-100 shadow-2xl flex flex-col items-center overflow-y-auto custom-scrollbar"
              >
                <div className="flex flex-col items-center justify-center text-center space-y-5 w-full mb-8">
                  <div className="relative">
                    <div className="w-20 h-20 bg-[#F27D26]/10 rounded-full flex items-center justify-center">
                      <Award size={40} className="text-[#F27D26]" />
                    </div>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute -top-1 -right-1 w-8 h-8 bg-[#FFB800] rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg"
                    >
                      <Sparkles size={14} />
                    </motion.div>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-2xl font-serif font-bold text-slate-800">शानदार प्रयास!</h2>
                    <p className="text-slate-500 text-xs font-medium">आपने {activeQuestions.length} में से {score} प्रश्नों के सही उत्तर दिए</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-slate-800">{Math.round((score / activeQuestions.length) * 100)}%</p>
                      <p className="text-[7px] uppercase tracking-widest font-bold text-slate-400">सटीकता</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-slate-800">{score * 10}</p>
                      <p className="text-[7px] uppercase tracking-widest font-bold text-slate-400">अंक</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-slate-800">{streak}</p>
                      <p className="text-[7px] uppercase tracking-widest font-bold text-slate-400">स्ट्राइक</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
                    <button 
                      onClick={() => startQuiz(selectedCategory)}
                      className="flex-1 bg-[#1a1a1a] text-white py-2.5 rounded-xl font-bold text-xs shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={14} />
                      पुनः प्रयास करें
                    </button>
                    <button 
                      onClick={resetToDashboard}
                      className="flex-1 bg-white text-slate-800 border border-slate-200 py-2.5 rounded-xl font-bold text-xs shadow-md hover:bg-slate-50 transition-all"
                    >
                      डैशबोर्ड
                    </button>
                  </div>
                </div>

                {/* Wrong Answers Explanations */}
                {answers.some(a => !a.isCorrect) && (
                  <div className="w-full space-y-4 text-left">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <HelpCircle size={18} className="text-[#F27D26]" />
                      <h3 className="font-serif font-bold text-slate-800">गलत उत्तरों का विश्लेषण</h3>
                    </div>
                    <div className="space-y-6">
                      {activeQuestions.map((q, idx) => {
                        const answer = answers.find(a => a.questionId === q.id);
                        if (answer && !answer.isCorrect) {
                          return (
                            <div key={q.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                              <div className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                                  {idx + 1}
                                </span>
                                <p className="font-bold text-slate-800 text-sm">{q.q}</p>
                              </div>
                              <div className="pl-9 space-y-3">
                                <div className="flex flex-wrap gap-2">
                                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-bold">
                                    सही उत्तर: {q.options[q.correct]}
                                  </span>
                                </div>
                                {q.explanation && (
                                  <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">व्याख्या</p>
                                    <p className="text-xs text-slate-600 leading-relaxed">{q.explanation}</p>
                                  </div>
                                )}
                                {q.trick && (
                                  <div className="bg-[#F27D26]/5 border border-[#F27D26]/10 rounded-xl p-3 flex gap-2">
                                    <Flame size={14} className="text-[#F27D26] shrink-0" />
                                    <div className="space-y-1">
                                      <p className="text-[10px] uppercase font-bold text-[#F27D26] tracking-wider">याद रखने की ट्रिक</p>
                                      <p className="text-xs text-slate-700 font-medium italic">"{q.trick}"</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
