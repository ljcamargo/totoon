import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Terms() {
    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 flex flex-col">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[60%] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[60%] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

            <Header />

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-10 px-6">
                <div className="max-w-3xl w-full bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
                    <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Terms of Service</h1>
                    <div className="space-y-4 text-gray-300 leading-relaxed">
                        <p>
                            <strong>1. Acceptance of Terms</strong><br />
                            By accessing and using this TOON Converter tool, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>
                        <p>
                            <strong>2. Disclaimer of Warranties</strong><br />
                            This service is provided "as is" without warranty of any kind, either express or implied, including without limitation any implied warranties of condition, uninterrupted use, merchantability, fitness for a particular purpose, or non-infringement.
                        </p>
                        <p>
                            <strong>3. Limitation of Liability</strong><br />
                            In no event shall the creators or maintainers of this tool be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
