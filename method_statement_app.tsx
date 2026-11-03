import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Save,
  ChevronDown,
  ChevronUp,
  HardHat,
  Wrench,
  Construction,
  ArrowUpToLine,
  RefreshCw
} from 'lucide-react';

// --- Data Models ---
const emergencyContacts = [
  { role: 'Foreman (Site Controller)', name: 'คุณธวัชชัย', phone: '081-826-9874' },
  { role: 'Ass. Manager (Installation)', name: 'คุณศุภชัย', phone: '089-967-3942' },
  { role: 'รพ. เกษมราษฎร์ ปราจีนบุรี', name: 'ฉุกเฉินการแพทย์', phone: '037-627-000' },
  { role: 'ดับเพลิง สวนอุตสาหกรรม 304', name: 'แจ้งเหตุไฟไหม้', phone: '081-304-3041' },
];

const initialChecklist = [
  // PPE
  { id: 'ppe-1', category: 'อุปกรณ์ความปลอดภัย (PPE)', text: 'หมวกนิรภัย (Hard hat)', checked: false },
  { id: 'ppe-2', category: 'อุปกรณ์ความปลอดภัย (PPE)', text: 'รองเท้านิรภัย (Safety shoes)', checked: false },
  { id: 'ppe-3', category: 'อุปกรณ์ความปลอดภัย (PPE)', text: 'ถุงมือกันบาด (Cut-resistant gloves)', checked: false },
  { id: 'ppe-4', category: 'อุปกรณ์ความปลอดภัย (PPE)', text: 'เข็มขัดนิรภัยเต็มตัวแบบ 2 ตะขอ (Full body harness)', checked: false },
  { id: 'ppe-5', category: 'อุปกรณ์ความปลอดภัย (PPE)', text: 'เสื้อสะท้อนแสงสำหรับผู้ให้สัญญาณ', checked: false },
  
  // Step 1
  { id: 's1-1', category: '1. การติดตั้งไลฟ์ไลน์ (Life Line)', text: 'ตรวจสอบพื้นที่ตั้งเครน (เรียบ ได้ระดับ ไม่มีน้ำท่วมขัง)', checked: false },
  { id: 's1-2', category: '1. การติดตั้งไลฟ์ไลน์ (Life Line)', text: 'ติดตั้งเสา Life Line ระยะห่าง 6 เมตร', checked: false },
  { id: 's1-3', category: '1. การติดตั้งไลฟ์ไลน์ (Life Line)', text: 'ขึงลวดสลิงกันตกโดยรอบโครงสร้าง', checked: false },
  
  // Step 2
  { id: 's2-1', category: '2. การตั้งเครื่องและรีดแผ่นหลังคา', text: 'ตรวจสอบสลิง สะเก็น และทำ Lifting Plan ก่อนยก', checked: false },
  { id: 's2-2', category: '2. การตั้งเครื่องและรีดแผ่นหลังคา', text: 'รองแผ่นเหล็กใต้ขาเครนทั้ง 4 ด้าน', checked: false },
  { id: 's2-3', category: '2. การตั้งเครื่องและรีดแผ่นหลังคา', text: 'ยกเครื่องรีด (V-650) ลงสู่พื้นอย่างปลอดภัย', checked: false },
  { id: 's2-4', category: '2. การตั้งเครื่องและรีดแผ่นหลังคา', text: 'คนงานยกย้ายแผ่นหลังคาที่รีดเสร็จยืนสลับฟันปลา', checked: false },

  // Step 3
  { id: 's3-1', category: '3. การยกแผ่นขึ้นโครงสร้าง (Lifting)', text: 'จัดทำ Lifting Plan และตรวจสอบน็อต/สลิงพาเลท', checked: false },
  { id: 's3-2', category: '3. การยกแผ่นขึ้นโครงสร้าง (Lifting)', text: 'ทดสอบยกลอย 1-1.5 เมตร เพื่อเช็คความสมดุล', checked: false },
  { id: 's3-3', category: '3. การยกแผ่นขึ้นโครงสร้าง (Lifting)', text: 'ใช้เชือกบังคับทิศทาง (Tagline) ขณะยกแผ่นหลังคา', checked: false },
  { id: 's3-4', category: '3. การยกแผ่นขึ้นโครงสร้าง (Lifting)', text: 'ผู้ให้สัญญาณ (Signal Man) ควบคุมการยกตลอดเวลา', checked: false },

  // Step 4
  { id: 's4-1', category: '4. การรื้อถอนและติดตั้ง (Take Off & Install)', text: 'ผู้ปฏิบัติงานเกี่ยวตะขอ Safety Harness เข้ากับ Life Line', checked: false },
  { id: 's4-2', category: '4. การรื้อถอนและติดตั้ง (Take Off & Install)', text: 'รื้อถอนหลังคาเดิมและ Connector บนทางเดิน (Walkway)', checked: false },
  { id: 's4-3', category: '4. การรื้อถอนและติดตั้ง (Take Off & Install)', text: 'ติดตั้งแผ่น V-650 พร้อมฉนวน Glass Wool', checked: false },
  { id: 's4-4', category: '4. การรื้อถอนและติดตั้ง (Take Off & Install)', text: 'จัดเวลาให้ผู้ปฏิบัติงานพัก 10-15 นาที ทุก 2 ชั่วโมง', checked: false },
];

// --- Components ---

const Accordion = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="mb-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center space-x-3 text-slate-800 font-semibold">
          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
          <span className="text-left">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [tasks, setTasks] = useState(initialChecklist);
  const [showToast, setShowToast] = useState(false);

  // Group tasks by category
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {});

  const completedCount = tasks.filter(t => t.checked).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getCategoryIcon = (category) => {
    if (category.includes('PPE')) return ShieldCheck;
    if (category.includes('ไลฟ์ไลน์')) return Construction;
    if (category.includes('ตั้งเครื่อง')) return Wrench;
    if (category.includes('ยกแผ่น')) return ArrowUpToLine;
    if (category.includes('รื้อถอน')) return RefreshCw;
    return ShieldCheck;
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-24 font-sans selection:bg-blue-200">
      
      {/* --- Sticky Header & Progress --- */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="p-4 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">HATC Sawadi Change Roof Damage</h1>
              <p className="text-xs text-slate-500 mt-1">SIAM STEEL SERVICE CENTER (SSSC) & TNC</p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap">
              {completedCount} / {tasks.length} สำเร็จ
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 sm:max-w-xl md:max-w-2xl">
        
        {/* --- Emergency Contacts --- */}
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-sm p-4">
          <div className="flex items-center space-x-2 text-red-700 font-bold mb-3">
            <AlertTriangle className="w-5 h-5" />
            <h2>แจ้งเหตุฉุกเฉิน (Emergency Contacts)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {emergencyContacts.map((contact, idx) => (
              <a 
                key={idx} 
                href={`tel:${contact.phone.replace(/-/g, '')}`}
                className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-100 hover:border-red-300 transition-colors shadow-sm active:bg-red-50"
              >
                <div>
                  <p className="text-xs text-slate-500 font-medium">{contact.role}</p>
                  <p className="text-sm font-bold text-slate-800">{contact.name}</p>
                </div>
                <div className="flex items-center space-x-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-full">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-sm font-bold">{contact.phone}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* --- Checklists --- */}
        <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">รายการตรวจสอบความปลอดภัย & ขั้นตอนการทำงาน</h2>
        
        {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
          <Accordion 
            key={category} 
            title={category} 
            icon={getCategoryIcon(category)}
            defaultOpen={category.includes('PPE')}
          >
            <div className="space-y-1">
              {categoryTasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    task.checked ? 'bg-green-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <button className="flex-shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                    {task.checked ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300" />
                    )}
                  </button>
                  <span className={`text-sm select-none transition-colors duration-200 ${
                    task.checked ? 'text-slate-500 line-through' : 'text-slate-700'
                  }`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </Accordion>
        ))}
      </div>

      {/* --- Fixed Bottom Action Bar --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-md mx-auto sm:max-w-xl md:max-w-2xl flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-600">
            สถานะ: <span className={progressPercent === 100 ? 'text-green-600' : 'text-blue-600'}>{progressPercent}%</span>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-md active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกรายงาน</span>
          </button>
        </div>
      </div>

      {/* --- Toast Notification --- */}
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span>บันทึกรายงานการตรวจสอบเรียบร้อยแล้ว</span>
        </div>
      </div>

    </div>
  );
}