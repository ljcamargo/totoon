import React, { useEffect } from 'react';

const GoogleAdSense = () => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

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

    return (
        <div className="w-[300px] h-[250px] overflow-hidden rounded-xl bg-white/5 mx-auto">
            <ins
                className="adsbygoogle"
                style={{ display: 'inline-block', width: '300px', height: '250px' }}
                data-ad-client={clientId}
                data-ad-slot={slotId}
            ></ins>
        </div>
    );
};

export default GoogleAdSense;
