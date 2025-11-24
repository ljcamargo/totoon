import Converter from "../components/Converter";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[60%] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[60%] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <Header />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <Converter />
      </div>

      <Footer />
    </main>
  );
}
