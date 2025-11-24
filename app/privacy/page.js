import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Privacy() {
    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 flex flex-col">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[60%] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[60%] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

            <Header />

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-10 px-6">
                <div className="max-w-3xl w-full bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
                    <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Privacy Policy</h1>
                    <div className="space-y-4 text-gray-300 leading-relaxed">
                        <p>
                            <strong>1. Local Processing</strong><br />
                            We respect your privacy and the security of your data. All conversion operations (JSON, YAML, TOON) are performed entirely locally within your web browser.
                        </p>
                        <p>
                            <strong>2. No Data Collection</strong><br />
                            We do not collect, store, or transmit any of the code or data you paste into this converter. Your data never leaves your device.
                        </p>
                        <p>
                            <strong>3. No Tracking</strong><br />
                            We do not use cookies or third-party tracking scripts. This website is designed to be a simple, private utility.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
