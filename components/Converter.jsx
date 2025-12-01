"use client";

import React, { useState, useEffect } from 'react';
import { convert, estimateTokens, calculateReduction } from '../utils/converter';
import GoogleAdSense from './GoogleAdSense';
import CustomSelect from './ui/CustomSelect';
import CodeEditor from './ui/CodeEditor';
import { ArrowRightLeft, ArrowUpDown, Copy, AlertCircle, ArrowRight, Download, Settings, X, ArrowDown } from 'lucide-react';
import BuyCoffeeButton from './BuyCoffeeButton';

const Converter = () => {
    const [input, setInput] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [output, setOutput] = useState('');
    const [fromFormat, setFromFormat] = useState('JSON');
    const [toFormat, setToFormat] = useState('TOON');
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ inputTokens: 0, outputTokens: 0, reduction: 0 });
    const [isDragging, setIsDragging] = useState(false);

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

    const [placeholderInput, setPlaceholderInput] = useState('');
    const [placeholderOutput, setPlaceholderOutput] = useState('');

    useEffect(() => {
        handleConvert();
    }, [input, fromFormat, toFormat, indent, delimiter, keyFolding, flattenDepth, strict, expandPaths, flattenEnabled]);

    // Update placeholders when formats change
    useEffect(() => {
        const fetchAndSetPlaceholders = async () => {
            try {
                const ext = fromFormat.toLowerCase();
                const res = await fetch(`/examples/example.${ext}`);
                if (!res.ok) return;
                const text = await res.text();

                setPlaceholderInput(text);

                // Calculate output placeholder
                const options = {
                    indent,
                    delimiter,
                    keyFolding,
                    flattenDepth: flattenEnabled ? Number(flattenDepth) : Infinity,
                    strict,
                    expandPaths
                };
                try {
                    const converted = convert(text, fromFormat, toFormat, options);
                    setPlaceholderOutput(converted);
                } catch (convErr) {
                    console.error("Placeholder conversion error:", convErr);
                    setPlaceholderOutput('');
                }
            } catch (err) {
                console.error("Error fetching placeholder:", err);
            }
        };

        fetchAndSetPlaceholders();
    }, [fromFormat, toFormat, indent, delimiter, keyFolding, flattenDepth, strict, expandPaths, flattenEnabled]);

    const handleConvert = () => {
        setError(null);
        if (!input.trim()) {
            setOutput('');
            setStats({ inputTokens: 0, outputTokens: 0, reduction: 0 });
            return;
        }

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

    const detectFormat = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        if (ext === 'json') return 'JSON';
        if (ext === 'yaml' || ext === 'yml') return 'YAML';
        if (ext === 'toon') return 'TOON';
        return null;
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const format = detectFormat(file.name);
            if (format) {
                setFromFormat(format);
                if (format === toFormat) {
                    setToFormat(format === 'TOON' ? 'JSON' : 'TOON');
                }
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setInput(e.target.result);
            };
            reader.readAsText(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            const format = detectFormat(file.name);
            if (format) {
                setFromFormat(format);
                if (format === toFormat) {
                    setToFormat(format === 'TOON' ? 'JSON' : 'TOON');
                }
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setInput(e.target.result);
            };
            reader.readAsText(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const loadExample = async () => {
        try {
            const ext = fromFormat.toLowerCase();
            const response = await fetch(`/examples/example.${ext}`);
            if (!response.ok) throw new Error('Failed to load example');
            const text = await response.text();
            setInput(text);

            if (fromFormat === toFormat) {
                setToFormat(fromFormat === 'TOON' ? 'JSON' : 'TOON');
            }
        } catch (err) {
            alert('Error loading example: ' + err.message);
        }
    };

    const handleUrlSubmit = async (e) => {
        e.preventDefault();
        if (!urlInput) return;

        const format = detectFormat(urlInput);
        if (format) {
            setFromFormat(format);
            if (format === toFormat) {
                setToFormat(format === 'TOON' ? 'JSON' : 'TOON');
            }
        }

        try {
            const response = await fetch(urlInput);
            if (!response.ok) throw new Error('Failed to fetch URL');
            const text = await response.text();
            setInput(text);
            setShowUrlInput(false);
            setUrlInput('');
        } catch (err) {
            alert('Error fetching URL: ' + err.message);
        }
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
        <div className="w-full max-w-7xl mx-auto p-3 md:p-6">
            {/* Top Section: Title & Ad */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-4 lg:mb-8">
                <div className="flex-1 pt-0">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight hidden md:block">
                        TOON <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">CONVERTER</span>
                    </h1>
                    <p className="text text-gray-400 font-light mb-2 ml-2 flex flex-wrap items-center gap-4">
                        <span>Convert TOON to JSON/YAML and vs.</span>
                        <BuyCoffeeButton className="hidden md:inline-flex items-center" />
                    </p>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-4 my-4">
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
                    {/* Get Started Text */}
                    <div className="mt-6 text-gray-400 text-lg flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-4 pl-2 w-full">
                        <ArrowDown className="w-5 h-5 text-purple-400 animate-bounce hidden lg:block" />
                        <span>
                            Paste a {fromFormat} or an{' '}
                            <button
                                onClick={() => setShowUrlInput(true)}
                                className="text-purple-400 hover:text-purple-300 underline decoration-dotted underline-offset-4 transition-colors font-medium"
                            >
                                URL
                            </button>
                            , drop a file,{' '}
                            <label className="text-purple-400 hover:text-purple-300 underline decoration-dotted underline-offset-4 transition-colors cursor-pointer font-medium">
                                browse
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    accept=".json,.yaml,.yml,.toon,.txt"
                                />
                            </label>
                            , or{' '}
                            <button
                                onClick={loadExample}
                                className="text-purple-400 hover:text-purple-300 underline decoration-dotted underline-offset-4 transition-colors font-medium"
                            >
                                load an example
                            </button>{' '}
                            to begin.
                        </span>
                        <ArrowDown className="mt-1 w-5 h-5 text-purple-400 animate-bounce lg:hidden md:inline-flex" />
                        <BuyCoffeeButton className="lg:hidden md:inline-flex ml-auto" />
                    </div>
                </div>
                <div className="hidden md:block">
                    <GoogleAdSense />
                </div>
            </div >

            {/* Converter Section */}
            <div className="flex flex-col lg:flex-row gap-6 items-stretch">

                {/* Left Panel (Input) */}
                <div className="flex-1 flex flex-col bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 transition-all duration-300">
                    <div className="flex flex-col border-b border-white/5 bg-white/[0.02]">
                        <div className="flex flex-wrap items-center justify-between p-4 gap-y-2">
                            <CustomSelect
                                value={fromFormat}
                                onChange={setFromFormat}
                                options={formatOptions}
                            />
                            <div className="flex items-center gap-2 ml-auto">
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

                    <div
                        className={`relative flex-1 flex flex-col min-h-[500px] transition-all duration-200 ${isDragging ? 'ring-2 ring-purple-500 bg-purple-500/10' : ''}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <CodeEditor
                            value={input}
                            onChange={(val) => {
                                setInput(val);
                            }}
                            language={fromFormat}
                            placeholder="Paste your code here..."
                            placeholderValue={placeholderInput}
                        />

                        {/* Drag Overlay Cue */}
                        {isDragging && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10 pointer-events-none">
                                <div className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Download className="w-8 h-8 animate-bounce" />
                                    Drop file to load
                                </div>
                            </div>
                        )}
                    </div>
                </div >

                {/* Mobile Ad Placement */}
                <div className="md:hidden w-full flex justify-center">
                    <GoogleAdSense />
                </div>

                {/* Middle Actions */}
                <div className="flex lg:flex-col items-center justify-center gap-4 align-middle md:justify-center md:items-center sm:justify-center sm:items-center">
                    <button
                        onClick={handleSwap}
                        className="group px-6 py-3 lg:p-4 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/50 rounded-full transition-all duration-300 flex items-center gap-2"
                        title="Swap Formats"
                    >
                        <ArrowRightLeft className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors hidden lg:block" />
                        <ArrowUpDown className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors lg:hidden" />
                        <span className="text-sm font-medium text-gray-400 group-hover:text-purple-400 transition-colors lg:hidden">Swap</span>
                    </button>

                    <BuyCoffeeButton className="lg:hidden md:self-center sm:self-center" />

                    <div className="w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block"></div>
                </div>

                {/* Right Panel (Output) */}
                <div className="flex-1 flex flex-col bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 relative transition-all duration-300">
                    <div className="flex flex-col border-b border-white/5 bg-white/[0.02]">
                        <div className="flex flex-wrap items-center justify-between p-4 gap-y-2">
                            <CustomSelect
                                value={toFormat}
                                onChange={setToFormat}
                                options={formatOptions}
                            />
                            <div className="flex items-center gap-2 ml-auto">
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
                            placeholderValue={placeholderOutput}
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
                </div >
            </div >

            {/* URL Input Modal */}
            {showUrlInput && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
                        <button
                            onClick={() => setShowUrlInput(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-bold text-white mb-4">Load from URL</h3>
                        <form onSubmit={handleUrlSubmit} className="space-y-4">
                            <input
                                type="url"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder="https://example.com/data.json"
                                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                autoFocus
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowUrlInput(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Load
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Content Sections */}
            <div className="mt-24 space-y-24 max-w-4xl mx-auto">

                {/* About TOON */}
                <section id="about" className="space-y-6">
                    <h2 className="text-3xl font-bold text-white border-b border-white/10 pb-4">About TOON</h2>
                    <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
                        <p>
                            TOON (Token Object Object Notation) is a data serialization format designed specifically for Large Language Models (LLMs).
                            It optimizes token usage, making data representation more efficient for AI processing while maintaining human readability.
                        </p>
                        <p>
                            TOON was created by the <a href="https://toonformat.dev/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">TOON team</a> to address the inefficiencies of JSON and YAML when working with token-limited AI models.
                            It is powered by the <code>@toon-format/toon</code> library.
                        </p>
                        <p>
                            This converter is an open-source utility that allows you to easily convert between JSON, YAML, and TOON formats directly in your browser.
                            It is designed to be fast, private, and easy to use.
                        </p>
                    </div>
                </section>

                {/* Why Token Optimization Matters */}
                <section id="optimization" className="space-y-6">
                    <h2 className="text-3xl font-bold text-white border-b border-white/10 pb-4">Why Token Optimization Matters</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-purple-400">Cost Reduction</h3>
                            <p className="text-gray-400 leading-relaxed">
                                LLM providers charge by the token. By reducing the number of tokens required to represent your data, you directly reduce your API costs. TOON can often reduce token count by 20-40% compared to standard JSON.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-blue-400">Expanded Context</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Every model has a maximum context window. More efficient data serialization means you can fit more data, examples, or history into a single prompt, enabling more complex reasoning and better results.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-green-400">Faster Processing</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Fewer tokens mean less computation for the model. This translates to lower latency and faster response times for your applications, improving the overall user experience.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-pink-400">Cleaner Prompts</h3>
                            <p className="text-gray-400 leading-relaxed">
                                TOON removes much of the syntactic noise (braces, quotes, commas) found in JSON. This helps the model focus on the actual data content rather than the formatting structure.
                            </p>
                        </div>
                    </div>
                </section>

                {/* How to Use */}
                <section id="learn" className="space-y-6">
                    <h2 className="text-3xl font-bold text-white border-b border-white/10 pb-4">How to Use</h2>
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-8">
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">1</span>
                                <span><strong>Input Data:</strong> Paste your JSON or YAML into the left editor, drop a file, or load from a URL.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">2</span>
                                <span><strong>Select Formats:</strong> Choose your source format (if not auto-detected) and your desired destination format (e.g., TOON).</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">3</span>
                                <span><strong>Configure:</strong> Use the settings icon to adjust indentation, strictness, or flattening options to optimize the output further.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">4</span>
                                <span><strong>Use Output:</strong> Copy the converted code or download it as a file to use in your LLM prompts or application.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Change Log */}
                <section id="changelog" className="space-y-6">
                    <h2 className="text-3xl font-bold text-white border-b border-white/10 pb-4">Change Log</h2>
                    <div className="space-y-6">
                        <div className="border-l-2 border-purple-500/30 pl-6 py-2">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-lg font-bold text-white">v1.1.0</span>
                                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium">Current</span>
                                <span className="text-gray-500 text-sm">November 2025</span>
                            </div>
                            <ul className="list-disc list-inside text-gray-400 space-y-1">
                                <li>Added Drag & Drop file support</li>
                                <li>Added URL loading capability</li>
                                <li>Improved UI with "Get Started" guide</li>
                                <li>Enhanced mobile responsiveness</li>
                            </ul>
                        </div>
                        <div className="border-l-2 border-white/10 pl-6 py-2">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-lg font-bold text-gray-300">v1.0.0</span>
                                <span className="text-gray-500 text-sm">October 2025</span>
                            </div>
                            <ul className="list-disc list-inside text-gray-500 space-y-1">
                                <li>Initial release</li>
                                <li>Support for JSON, YAML, and TOON conversion</li>
                                <li>Basic token estimation</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>

            {/* Bottom Donation */}
            <div className="mt-24 flex justify-center pb-8">
                <BuyCoffeeButton className="hover:scale-105 transition-transform" />
            </div>
        </div >
    );
};

export default Converter;
