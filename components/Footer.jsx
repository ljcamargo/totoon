import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-md mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} TOTOON Converter. Open Source.</p>
                <div className="flex items-center gap-6">
                    <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
