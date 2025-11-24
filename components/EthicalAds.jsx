import React from 'react';

const EthicalAds = () => {
    return (
        <div className="w-[200px] h-[200px] bg-[#111] border border-white/10 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="absolute top-2 right-2 text-[10px] uppercase tracking-widest text-gray-600 border border-gray-800 px-1 rounded">Ad</span>

            <div className="text-center p-4 z-10">
                <div className="w-12 h-12 bg-white/5 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <p className="text-sm text-gray-300 font-medium">Ethical Ads</p>
                <p className="text-xs text-gray-500 mt-1">Privacy-focused advertising placeholder.</p>
            </div>
        </div>
    );
};

export default EthicalAds;
