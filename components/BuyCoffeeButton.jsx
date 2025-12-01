import React from 'react';

const BuyCoffeeButton = ({ className = "" }) => {
    return (
        <a 
            href='https://ko-fi.com/ljcamargo' 
            target='_blank' 
            rel="noopener noreferrer" 
            className={`transition-opacity hover:opacity-100 opacity-80 ${className}`}
        >
            <img 
                src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' 
                alt='Buy Me a Coffee' 
                className="h-6" 
            />
        </a>
    );
};

export default BuyCoffeeButton;
