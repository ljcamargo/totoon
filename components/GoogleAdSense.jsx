"use client";

import React, { useEffect, useState, useRef } from 'react';

const GoogleAdSense = () => {

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
    const slotId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_ID;

    useEffect(() => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
        const slotId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_ID;
        if (!clientId || !slotId) return;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            console.log("AdSense loaded");
        } catch (e) {
          console.error("AdSense error:", e);
        }
    }, []);

    if (!clientId || !slotId) {
        return (
            <div className="w-[325px] h-[275px] bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center text-center p-4">
                <span className="text-xs font-mono text-gray-500 mb-2">AdSense Placeholder</span>
                <span className="text-xs text-gray-600">Configure env vars to see ads</span>
            </div>
        );
    }

    return (
        <div className="adsense-container w-[325px] h-[275px] overflow-hidden rounded-xl bg-white/5 mx-auto flex items-center justify-center">
            <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '300px', height: '250px' }}
                data-ad-client={clientId}
                data-ad-slot={slotId}
            ></ins>
        </div>
    );
};

export default GoogleAdSense;
