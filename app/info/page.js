import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Info() {
    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 flex flex-col">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[60%] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[60%] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

            <Header />

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-10 px-6">
                <div className="max-w-3xl w-full bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
                    <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">About TOON</h1>
                    <div className="space-y-6 text-gray-300 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">What is TOON?</h2>
                            <p>
                                TOON (Token Object Object Notation) is a data serialization format designed specifically for Large Language Models (LLMs).
                                It optimizes token usage, making data representation more efficient for AI processing while maintaining human readability.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">Who Created It?</h2>
                            <p>
                                TOON was created by the <a href="https://toonformat.dev/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">TOON team</a> to address the inefficiencies of JSON and YAML when working with token-limited AI models.
                                It is powered by the <code>@toon-format/toon</code> library.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">About This Tool</h2>
                            <p>
                                This converter is an open-source utility that allows you to easily convert between JSON, YAML, and TOON formats directly in your browser.
                                It is designed to be fast, private, and easy to use.
                            </p>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
