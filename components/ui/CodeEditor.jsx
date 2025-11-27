import React, { useRef } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Register languages
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('yaml', yaml);

const CodeEditor = ({ value, onChange, language, readOnly = false, placeholder, placeholderValue }) => {
    // Map TOON to YAML for highlighting as requested
    const highlightLanguage = language === 'TOON' ? 'yaml' : language.toLowerCase();

    const textareaRef = useRef(null);
    const preRef = useRef(null);

    const handleChange = (e) => {
        if (!readOnly && onChange) {
            onChange(e.target.value);
        }
    };

    const handleScroll = (e) => {
        if (preRef.current) {
            preRef.current.scrollTop = e.target.scrollTop;
            preRef.current.scrollLeft = e.target.scrollLeft;
        }
    };

    const showPlaceholder = !value && placeholderValue;

    return (
        <div className="relative w-full h-full min-h-[500px] group">
            {/* Syntax Highlighter (Background) */}
            <div
                ref={preRef}
                className="absolute inset-0 pointer-events-none overflow-hidden"
                aria-hidden="true"
            >
                <SyntaxHighlighter
                    language={highlightLanguage}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem', // Match textarea padding (p-6 = 1.5rem)
                        background: 'transparent',
                        minHeight: '100%',
                        width: '100%',
                        fontSize: '0.875rem', // text-sm
                        lineHeight: '1.5rem', // Standard line height for text-sm usually, need to verify
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        opacity: showPlaceholder ? 0.15 : 1, // Dim if showing placeholder
                        whiteSpace: 'pre-wrap', // Match textarea wrapping
                        wordBreak: 'break-word', // Match textarea wrapping
                        overflow: 'hidden', // Prevent internal scroll
                    }}
                    codeTagProps={{
                        style: {
                            fontFamily: 'inherit',
                        }
                    }}
                    wrapLines={true}
                >
                    {showPlaceholder ? placeholderValue : (value || ' ')}
                </SyntaxHighlighter>
            </div>

            {/* Textarea (Foreground - Editable) */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onScroll={handleScroll}
                readOnly={readOnly}
                placeholder={placeholder}
                className={`absolute inset-0 w-full h-full bg-transparent font-mono text-sm p-6 focus:outline-none resize-none ${readOnly ? 'text-transparent selection:bg-purple-500/30 selection:text-transparent cursor-default' : 'text-transparent caret-white selection:bg-purple-500/30 selection:text-transparent'
                    }`}
                spellCheck="false"
                style={{
                    lineHeight: '1.5rem', // Match syntax highlighter line height
                    color: 'transparent',
                    WebkitTextFillColor: 'transparent',
                }}
            />
        </div>
    );
};

export default CodeEditor;
