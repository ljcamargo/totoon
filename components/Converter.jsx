"use client";

import React, { useState, useEffect } from 'react';
import { convert, estimateTokens, calculateReduction } from '../utils/converter';
import EthicalAds from './EthicalAds';
import CustomSelect from './ui/CustomSelect';
import { ArrowRightLeft, ArrowUpDown, Copy, AlertCircle } from 'lucide-react';

const Converter = () => {
    const [input, setInput] = useState('{\n  "hello": "world",\n  "foo": [\n    "bar",\n    "baz"\n  ]\n}');
    const [output, setOutput] = useState('');
    const [fromFormat, setFromFormat] = useState('JSON');
    const [toFormat, setToFormat] = useState('TOON');
    const [indent, setIndent] = useState(2);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ inputTokens: 0, outputTokens: 0, reduction: 0 });

    useEffect(() => {
        handleConvert();
    }, [input, fromFormat, toFormat, indent]);

    const handleConvert = () => {
        setError(null);
        try {
            const result = convert(input, fromFormat, toFormat, indent);
            setOutput(result);

            const inTokens = estimateTokens(input);
            const outTokens = estimateTokens(result);
            const reduction = calculateReduction(inTokens, outTokens);

            setStats({
                inputTokens: inTokens,
                outputTokens: outTokens,
                reduction: reduction
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSwap = () => {
        setInput(output);
        setFromFormat(toFormat);
        setToFormat(fromFormat);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const formatOptions = [
        { value: 'JSON', label: 'JSON' },
        { value: 'YAML', label: 'YAML' },
        { value: 'TOON', label: 'TOON' },
    ];

    const indentOptions = [
        { value: 2, label: '2 Spaces' },
        { value: 4, label: '4 Spaces' },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto p-6">
            {/* Top Section: Title & Ad */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
                <div className="flex-1 pt-4">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
                        TOON <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">CONVERTER</span>
                    </h1>
                    <p className="text-xl text-gray-400 font-light">
                        Convert TOON to JSON/YAML and vice versa.
                        <br />
                        <span className="text-sm text-gray-500 mt-2 block">Optimized for LLM token efficiency.</span>
                    </p>
                </div>
                <div className="hidden md:block">
                    <EthicalAds />
                </div>
            </div>

            {/* Converter Section */}
            <div className="flex flex-col lg:flex-row gap-6 items-stretch">

                {/* Left Panel (Input) */}
                <div className="flex-1 flex flex-col bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
                        <CustomSelect
                            value={fromFormat}
                            onChange={setFromFormat}
                            options={formatOptions}
                        />
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-gray-500">{stats.inputTokens} tokens</span>
                            <button
                                onClick={() => copyToClipboard(input)}
                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                title="Copy Input"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 w-full bg-transparent text-gray-200 font-mono text-sm p-6 focus:outline-none resize-none min-h-[500px]"
                        placeholder="Paste your code here..."
                        spellCheck="false"
                    />
                </div>

                {/* Middle Actions */}
                <div className="flex lg:flex-col items-center justify-center gap-4">
                    <button
                        onClick={handleSwap}
                        className="group p-4 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/50 rounded-full transition-all duration-300"
                        title="Swap Formats"
                    >
                        {/* Desktop: Horizontal Arrows */}
                        <ArrowRightLeft className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors hidden lg:block" />
                        {/* Mobile: Vertical Arrows */}
                        <ArrowUpDown className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors lg:hidden" />
                    </button>

                    <div className="w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block"></div>
                </div>

                {/* Right Panel (Output) */}
                <div className="flex-1 flex flex-col bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 relative">
                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <CustomSelect
                                value={toFormat}
                                onChange={setToFormat}
                                options={formatOptions}
                            />
                            <CustomSelect
                                value={indent}
                                onChange={setIndent}
                                options={indentOptions}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            {toFormat === 'TOON' && Number(stats.reduction) > 0 && (
                                <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                                    -{stats.reduction}%
                                </span>
                            )}
                            <span className="text-xs font-mono text-gray-500">{stats.outputTokens} tokens</span>
                            <button
                                onClick={() => copyToClipboard(output)}
                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                title="Copy Output"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="relative flex-1 min-h-[500px]">
                        <textarea
                            readOnly
                            value={output}
                            className="absolute inset-0 w-full h-full bg-transparent text-gray-200 font-mono text-sm p-6 focus:outline-none resize-none"
                            placeholder="Output will appear here..."
                            spellCheck="false"
                        />
                        {error && (
                            <div className="absolute bottom-6 left-6 right-6 bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-4 rounded-xl backdrop-blur-md animate-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-2 mb-1 font-bold">
                                    <AlertCircle className="w-4 h-4" />
                                    Conversion Error
                                </div>
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Converter;
