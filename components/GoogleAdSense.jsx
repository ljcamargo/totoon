"use client";

import React, { useEffect, useState, useRef } from 'react';

const GoogleAdSense = () => {
    const [mounted, setMounted] = useState(false);
    const hasPushed = useRef(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || hasPushed.current) return;

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
        const slotId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_ID;

        if (!clientId || !slotId || clientId.includes('XXXX')) return;

        const timer = setTimeout(() => {
            try {
                if (typeof window !== 'undefined' && window.adsbygoogle) {
                    console.log('AdSense: Pushing ad slot', slotId);
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    hasPushed.current = true;
                } else {
                    console.warn('AdSense: window.adsbygoogle not found, retrying...');
                    // Try one more time after another delay
                    setTimeout(() => {
                        if (window.adsbygoogle && !hasPushed.current) {
                            (window.adsbygoogle = window.adsbygoogle || []).push({});
                            hasPushed.current = true;
                            console.log('AdSense: Push successful on retry');
                        }
                    }, 2000);
                }
            } catch (err) {
                console.error('AdSense error:', err);
            }
        }, 500); // Small delay to ensure script is ready

        return () => clearTimeout(timer);
    }, [mounted]);

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
    const slotId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_ID;

    if (!clientId || !slotId || clientId.includes('XXXX')) {
        return (
            <div className="w-[300px] h-[250px] bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center text-center p-4">
                <span className="text-xs font-mono text-gray-500 mb-2">AdSense Placeholder</span>
                <span className="text-xs text-gray-600">Configure env vars to see ads</span>
            </div>
        );
    }

    // Always render the container and ins tag if env vars are present, 
    // even before mount, to avoid layout shift, but the push happens after mount.
    return (
        <div className="adsense-container w-[300px] h-[250px] overflow-hidden rounded-xl bg-white/5 mx-auto flex items-center justify-center">
            <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '300px', height: '250px' }}
                data-ad-client={clientId}
                data-ad-slot={slotId}
                data-ad-format="rectangle"
                data-full-width-responsive="false"
            ></ins>
        </div>
    );
};

export default GoogleAdSense;
