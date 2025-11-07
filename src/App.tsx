import { useState, useEffect } from 'react';
import Header from './components/Header';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Survey from './pages/Survey';
import Result from './pages/Result';
import About from './pages/About';
import Contact from './pages/Contact';
import Reviews from './pages/Reviews';
import SituationAI from "./components/SituationAI";
import { supabaseHeart } from "./lib/supabase";

type Page = 'home' | 'survey' | 'situation' | 'result' | 'about' | 'contact' | 'reviews';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [surveyId, setSurveyId] = useState<string>('');
  const [heartRates, setHeartRates] = useState<number[]>([]);
  const resetHeartRate = () => {
    setHeartRates([]);
  };
  const resetHeartDataInSupabase = async () => {
    const { error } = await supabaseHeart
      .from("heart_data")
      .delete()
      .neq("id", 0);   // xoá tất cả hàng

    if (error) {
      console.error("Lỗi reset dữ liệu nhịp tim:", error);
    } else {
      console.log("✅ Đã reset bảng heart_data");
    }
  };

  const handleStartSurvey = () => {
    setCurrentPage('survey');
  };

  const handleSurveyComplete = (id: string) => {
    setSurveyId(id);
    setCurrentPage('situation');
  };
  
  const handleSituationComplete = () => {
    setCurrentPage('result'); // chuyển sang phần kết quả
  };

  const handleBackHome = () => {
    setCurrentPage('home');
  };

  const handleBackFromSurvey = () => {
    setCurrentPage('home');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage !== 'survey' && currentPage !== 'result' && (
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      {currentPage === 'home' && (
        <Home 
          onStartSurvey={async () => {
            await resetHeartDataInSupabase();   // ✅ Xoá dữ liệu nhịp tim
            resetHeartRate();                   // xoá local state (không bắt buộc nhưng cho sạch)
            handleStartSurvey();                // chuyển trang khảo sát
          }} 
        />
      )}

      {currentPage === 'survey' && (
        <Survey 
          onComplete={handleSurveyComplete} 
          onBack={handleBackFromSurvey}
          heartRates={heartRates}              // ✅ truyền dữ liệu
          setHeartRates={setHeartRates}        // ✅ truyền hàm ghi dữ liệu mới
        />
      )}

      {currentPage === 'situation' && (
        <SituationAI
          surveyId={surveyId}
          onBack={() => setCurrentPage('home')}
          onComplete={() => setCurrentPage('result')}  
        />
      )}
      {currentPage === 'result' && (
        <Result surveyId={surveyId} onBackHome={() => setCurrentPage('home')} />
      )}
      {currentPage === 'about' && <About />}
      {currentPage === 'contact' && <Contact />}
      {currentPage === 'reviews' && <Reviews />}

      <Chatbot />
    </div>
  );
}

export default App;
