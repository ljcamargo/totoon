import React from 'react';

const Header = () => {
    return (
        <header className="w-full border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="/totoon.svg" alt="TOTOON Logo" className="w-8 h-8" />
                    <span className="font-bold text-xl tracking-tight text-white">TOTOON</span>
                </div>
                <nav className="flex items-center gap-6 text-sm font-medium text-gray-400">
                    <a href="/info" className="hover:text-white transition-colors">Info</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
