"use client";

import React, { useState, useEffect } from 'react';
import { convert, estimateTokens, calculateReduction } from '../utils/converter';
import EthicalAds from './EthicalAds';
import CustomSelect from './ui/CustomSelect';
import CodeEditor from './ui/CodeEditor';
import { ArrowRightLeft, ArrowUpDown, Copy, AlertCircle, ArrowRight, Download, Settings, X } from 'lucide-react';

const Converter = () => {
    const [input, setInput] = useState('{\n  "hello": "world",\n  "foo": [\n    "bar",\n    "baz"\n  ]\n}');
    const [output, setOutput] = useState('');
    const [fromFormat, setFromFormat] = useState('JSON');
    const [toFormat, setToFormat] = useState('TOON');
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ inputTokens: 0, outputTokens: 0, reduction: 0 });

    // Config Toggles
    const [showInputConfig, setShowInputConfig] = useState(false);
    const [showOutputConfig, setShowOutputConfig] = useState(false);

    // Configuration State
    const [indent, setIndent] = useState(2);
    const [delimiter, setDelimiter] = useState(',');
    const [keyFolding, setKeyFolding] = useState('off');
    const [flattenDepth, setFlattenDepth] = useState(Infinity);
    const [strict, setStrict] = useState(true);
    const [expandPaths, setExpandPaths] = useState('off');

    // Flatten Control State
    const [flattenEnabled, setFlattenEnabled] = useState(false);

    useEffect(() => {
        handleConvert();
    }, [input, fromFormat, toFormat, indent, delimiter, keyFolding, flattenDepth, strict, expandPaths, flattenEnabled]);

    const handleConvert = () => {
        setError(null);
        try {
            const options = {
                indent,
                delimiter,
                keyFolding,
                flattenDepth: flattenEnabled ? Number(flattenDepth) : Infinity,
                strict,
                expandPaths
            };
            const result = convert(input, fromFormat, toFormat, options);
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

    const handleQuickAction = (newFrom, newTo) => {
        if (fromFormat === newTo && toFormat === newFrom) {
            handleSwap();
        } else {
            setFromFormat(newFrom);
            setToFormat(newTo);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const downloadFile = (content, format, prefix) => {
        const extension = format.toLowerCase();
        const filename = `${prefix}.${extension}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Options Definitions
    const formatOptions = [
        { value: 'JSON', label: 'JSON' },
        { value: 'YAML', label: 'YAML' },
        { value: 'TOON', label: 'TOON' },
    ];

    const indentOptions = [
        { value: 2, label: 'Indent: 2' },
        { value: 4, label: 'Indent: 4' },
    ];

    const delimiterOptions = [
        { value: ',', label: 'Delimiter: Comma' },
        { value: '\t', label: 'Delimiter: Tab' },
        { value: '|', label: 'Delimiter: Pipe' },
    ];

    const keyFoldingOptions = [
        { value: 'off', label: 'Fold: Off' },
        { value: 'safe', label: 'Fold: Safe' },
    ];

    const expandPathsOptions = [
        { value: 'off', label: 'Expand: Off' },
        { value: 'safe', label: 'Expand: Safe' },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto p-6">
            {/* Top Section: Title & Ad */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
                <div className="flex-1 pt-4">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
                        TOON <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">CONVERTER</span>
                    </h1>
                    <p className="text-xl text-gray-400 font-light mb-6">
                        Convert TOON to JSON/YAML and vice versa.
                        <br />
                        <span className="text-sm text-gray-500 mt-2 block">Optimized for LLM token efficiency.</span>
                    </p>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => handleQuickAction('JSON', 'TOON')}
                            className="px-6 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            JSON <ArrowRight className="w-3 h-3" /> TOON
                        </button>
                        <button
                            onClick={() => handleQuickAction('TOON', 'JSON')}
                            className="px-6 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            TOON <ArrowRight className="w-3 h-3" /> JSON
                        </button>
                    </div>
                </div>
                <div className="hidden md:block">
                    <EthicalAds />
                </div>
            </div>

            {/* Converter Section */}
            <div className="flex flex-col lg:flex-row gap-6 items-stretch">

                {/* Left Panel (Input) */}
                <div className="flex-1 flex flex-col bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 transition-all duration-300">
                    <div className="flex flex-col border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center justify-between p-4">
                            <CustomSelect
                                value={fromFormat}
                                onChange={setFromFormat}
                                options={formatOptions}
                            />
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-gray-500 mr-2">{stats.inputTokens} tokens</span>

                                {/* Config Toggle */}
                                {fromFormat === 'TOON' && (
                                    <button
                                        onClick={() => setShowInputConfig(!showInputConfig)}
                                        className={`p-2 rounded-lg transition-colors ${showInputConfig ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                                        title="Configuration"
                                    >
                                        <Settings className="w-4 h-4" />
                                    </button>
                                )}

                                <button
                                    onClick={() => downloadFile(input, fromFormat, 'input')}
                                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                    title="Download Input"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => copyToClipboard(input)}
                                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                    title="Copy Input"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Input Config Panel */}
                        {showInputConfig && fromFormat === 'TOON' && (
                            <div className="px-4 pb-4 flex flex-wrap gap-3 animate-in slide-in-from-top-2">
                                <CustomSelect
                                    value={expandPaths}
                                    onChange={setExpandPaths}
                                    options={expandPathsOptions}
                                />
                                <label className="flex items-center gap-2 cursor-pointer group bg-white/5 border border-white/10 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={strict}
                                        onChange={(e) => setStrict(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/10 bg-black/50 text-purple-500 focus:ring-purple-500/50"
                                    />
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Strict Mode</span>
                                </label>
                            </div>
                        )}
                    </div>

                    <CodeEditor
                        value={input}
                        onChange={setInput}
                        language={fromFormat}
                        placeholder="Paste your code here..."
                    />
                </div>

                {/* Middle Actions */}
                <div className="flex lg:flex-col items-center justify-center gap-4">
                    <button
                        onClick={handleSwap}
                        className="group p-4 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/50 rounded-full transition-all duration-300"
                        title="Swap Formats"
                    >
                        <ArrowRightLeft className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors hidden lg:block" />
                        <ArrowUpDown className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors lg:hidden" />
                    </button>

                    <div className="w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block"></div>
                </div>

                {/* Right Panel (Output) */}
                <div className="flex-1 flex flex-col bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 relative transition-all duration-300">
                    <div className="flex flex-col border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center justify-between p-4">
                            <CustomSelect
                                value={toFormat}
                                onChange={setToFormat}
                                options={formatOptions}
                            />
                            <div className="flex items-center gap-2">
                                {stats.reduction !== 0 && (
                                    <span className={`text-xs font-bold px-2 py-1 rounded mr-2 ${Number(stats.reduction) > 0
                                            ? 'text-green-400 bg-green-400/10'
                                            : 'text-red-400 bg-red-400/10'
                                        }`}>
                                        {Number(stats.reduction) > 0
                                            ? `-${stats.reduction}%`
                                            : `+${Math.abs(Number(stats.reduction)).toFixed(2)}%`
                                        }
                                    </span>
                                )}
                                <span className="text-xs font-mono text-gray-500 mr-2">{stats.outputTokens} tokens</span>

                                {/* Config Toggle */}
                                <button
                                    onClick={() => setShowOutputConfig(!showOutputConfig)}
                                    className={`p-2 rounded-lg transition-colors ${showOutputConfig ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                                    title="Configuration"
                                >
                                    <Settings className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => downloadFile(output, toFormat, 'output')}
                                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                    title="Download Output"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => copyToClipboard(output)}
                                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                    title="Copy Output"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Output Config Panel */}
                        {showOutputConfig && (
                            <div className="px-4 pb-4 flex flex-wrap gap-3 animate-in slide-in-from-top-2">
                                <CustomSelect
                                    value={indent}
                                    onChange={setIndent}
                                    options={indentOptions}
                                />

                                {toFormat === 'TOON' && (
                                    <>
                                        <CustomSelect
                                            value={delimiter}
                                            onChange={setDelimiter}
                                            options={delimiterOptions}
                                        />
                                        <CustomSelect
                                            value={keyFolding}
                                            onChange={setKeyFolding}
                                            options={keyFoldingOptions}
                                        />
                                        <label className={`flex items-center gap-2 cursor-pointer group bg-white/5 border border-white/10 rounded-lg px-3 py-2 transition-colors ${flattenEnabled ? 'hover:bg-white/10' : 'opacity-75'}`}>
                                            <input
                                                type="checkbox"
                                                checked={flattenEnabled}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    setFlattenEnabled(isChecked);
                                                    if (isChecked) {
                                                        setFlattenDepth(10);
                                                    } else {
                                                        setFlattenDepth(Infinity);
                                                    }
                                                }}
                                                className="w-4 h-4 rounded border-white/10 bg-black/50 text-purple-500 focus:ring-purple-500/50"
                                            />
                                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors mr-1">Flatten</span>
                                            {flattenEnabled && (
                                                <input
                                                    type="number"
                                                    value={flattenDepth === Infinity ? '' : flattenDepth}
                                                    placeholder="10"
                                                    onChange={(e) => setFlattenDepth(e.target.value === '' ? Infinity : e.target.value)}
                                                    className="bg-transparent text-sm text-white w-12 focus:outline-none text-center border-b border-white/20"
                                                />
                                            )}
                                        </label>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="relative flex-1 min-h-[500px]">
                        <CodeEditor
                            value={output}
                            readOnly={true}
                            language={toFormat}
                            placeholder="Output will appear here..."
                        />
                        {error && (
                            <div className="absolute bottom-6 left-6 right-6 bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-4 rounded-xl backdrop-blur-md animate-in slide-in-from-bottom-2 z-10">
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
