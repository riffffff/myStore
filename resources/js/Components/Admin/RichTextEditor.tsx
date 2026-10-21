import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Quote,
    Link2,
    RemoveFormatting,
    Undo2,
    Redo2,
    Code,
    Eye,
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
    hasError?: boolean;
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = 'Tuliskan artikel lengkap Anda di sini...',
    minHeight = '360px',
    hasError = false,
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
    const [stats, setStats] = useState({ words: 0, chars: 0 });

    // Track active states for formatting buttons
    const [activeStates, setActiveStates] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikeThrough: false,
        justifyLeft: false,
        justifyCenter: false,
        justifyRight: false,
        justifyFull: false,
        insertUnorderedList: false,
        insertOrderedList: false,
    });

    // Helper to calculate words & chars
    const updateStats = useCallback((html: string) => {
        const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const chars = text.length;
        const words = text ? text.split(/\s+/).length : 0;
        setStats({ words, chars });
    }, []);

    // Sync external value to editor HTML only if different
    useEffect(() => {
        if (editorRef.current && viewMode === 'visual') {
            if (editorRef.current.innerHTML !== (value || '')) {
                editorRef.current.innerHTML = value || '';
            }
        }
        updateStats(value || '');
    }, [value, viewMode, updateStats]);

    // Check active formatting when selection changes
    const updateActiveStates = useCallback(() => {
        if (typeof document === 'undefined') return;
        try {
            setActiveStates({
                bold: document.queryCommandState('bold'),
                italic: document.queryCommandState('italic'),
                underline: document.queryCommandState('underline'),
                strikeThrough: document.queryCommandState('strikeThrough'),
                justifyLeft: document.queryCommandState('justifyLeft'),
                justifyCenter: document.queryCommandState('justifyCenter'),
                justifyRight: document.queryCommandState('justifyRight'),
                justifyFull: document.queryCommandState('justifyFull'),
                insertUnorderedList: document.queryCommandState('insertUnorderedList'),
                insertOrderedList: document.queryCommandState('insertOrderedList'),
            });
        } catch {
            // Ignore potential security/DOM query errors
        }
    }, []);

    // Command runner
    const exec = (command: string, arg?: string) => {
        if (viewMode !== 'visual') return;
        if (editorRef.current) {
            editorRef.current.focus();
        }
        document.execCommand(command, false, arg);
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            onChange(html);
            updateStats(html);
        }
        updateActiveStates();
    };

    // Format Block (e.g. H2, H3, p, blockquote)
    const handleBlockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val) {
            exec('formatBlock', val);
        }
    };

    // Insert Link
    const handleInsertLink = () => {
        const url = window.prompt('Masukkan tautan URL (contoh: https://contoh.com):');
        if (url) {
            exec('createLink', url);
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            onChange(html);
            updateStats(html);
        }
        updateActiveStates();
    };

    return (
        <div
            className={`border rounded-2xl bg-white overflow-hidden transition shadow-xs focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 ${
                hasError ? 'border-rose-400' : 'border-stone-200'
            }`}
        >
            {/* ── Toolbar ── */}
            <div className="bg-stone-50/90 border-b border-stone-200/80 p-2 flex flex-wrap items-center justify-between gap-1 select-none">
                <div className="flex flex-wrap items-center gap-0.5 sm:gap-1">
                    {/* Undo / Redo */}
                    <button
                        type="button"
                        title="Urungkan (Undo)"
                        onMouseDown={e => {
                            e.preventDefault();
                            exec('undo');
                        }}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 transition"
                    >
                        <Undo2 className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        title="Ulangi (Redo)"
                        onMouseDown={e => {
                            e.preventDefault();
                            exec('redo');
                        }}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 transition"
                    >
                        <Redo2 className="w-4 h-4" />
                    </button>

                    <div className="h-4 w-px bg-stone-300 mx-1" />

                    {/* Block Formatter Dropdown */}
                    <select
                        onChange={handleBlockChange}
                        defaultValue="<p>"
                        className="h-8 text-xs font-semibold px-2 rounded-lg bg-white border border-stone-200 text-stone-700 focus:outline-none focus:border-teal-500 cursor-pointer"
                    >
                        <option value="<p>">Normal (Paragraf)</option>
                        <option value="<h2>">Judul Besar (H2)</option>
                        <option value="<h3>">Sub Judul (H3)</option>
                        <option value="<blockquote>">Kutipan (Quote)</option>
                    </select>

                    <div className="h-4 w-px bg-stone-300 mx-1" />

                    {/* Bold, Italic, Underline, Strikethrough */}
                    <button
                        type="button"
                        title="Tebal (Bold - Ctrl+B)"
                        onMouseDown={e => {
                            e.preventDefault();
                            exec('bold');
                        }}
                        className={`p-1.5 rounded-lg transition ${
                            activeStates.bold
                                ? 'bg-teal-100 text-teal-800 font-bold'
                                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                        }`}
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        title="Miring (Italic - Ctrl+I)"
                        onMouseDown={e => {
                            e.preventDefault();
                            exec('italic');
                        }}
                        className={`p-1.5 rounded-lg transition ${
                            activeStates.italic
                                ? 'bg-teal-100 text-teal-800 font-bold'
                                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                        }`}
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        title="Garis Bawah (Underline - Ctrl+U)"
                        onMouseDown={e => {
                            e.preventDefault();
                            exec('underline');
                        }}
                        className={`p-1.5 rounded-lg transition ${
                            activeStates.underline
                                ? 'bg-teal-100 text-teal-800 font-bold'
                                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                        }`}
                    >
                        <Underline className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        title="Coretan (Strikethrough)"
                        onMouseDown={e => {
                            e.preventDefault();
                            exec('strikeThrough');
                        }}
                        className={`p-1.5 rounded-lg transition ${
                            activeStates.strikeThrough
                                ? 'bg-teal-100 text-teal-800 font-bold'
                                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                        }`}
                    >
                        <Strikethrough className="w-4 h-4" />
                    </button>

                    <div className="h-4 w-px bg-stone-300 mx-1" />

                    {/* Alignments (Left, Center, Right, Justify) */}
                    <button
                        type="button"
                        title="Rata Kiri (Align Left)"
                        onMouseDown={e => {
                            e.preventDefault();
                            exec('justifyLeft');
                        }}
                        className={`p-1.5 rounded-lg transition ${
                            activeStates.justifyLeft
                                ? 'bg-teal-100 text-teal-800'
                                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                        }`}
                    >
                        <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        title="Rata Tengah (Align Center)"
                        onMouseDown={e => {
                            e.preventDefault();
                            exec('justifyCenter');
                        }}
                        className={`p-1.5 rounded-lg transition ${
                            activeStates.justifyCenter
                                ? 'bg-teal-100 text-teal-800'
                                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                        }`}
                    >
                        <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        title="Rata Kanan (Align Right)"
                        onMouseDown={e => {
                            e.preventDefault();
                            exec('justifyRight');
                        }}
                        className={`p-1.5 rounded-lg transition ${
                            activeStates.justifyRight
                                ? 'bg-teal-100 text-teal-800'
                                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                        }`}
                    >
                        <AlignRight className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        title="Rata Kiri Kanan (Justify Text)"
                        onMouseDown={e => {
                            e.preventDefault();
                            exec('justifyFull');
                        }}
                        className={`p-1.5 rounded-lg transition ${
                            activeStates.justifyFull
                                ? 'bg-teal-100 text-teal-800 font-bold ring-1 ring-teal-400'
                                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                        }`}
                    >
                        <AlignJustify className="w-4 h-4" />
                    </button>

                    <div className="h-4 w-px bg-stone-300 mx-1" />

                    {/* Lists */}
                    <button
                        type="button"
                        title="Daftar Poin (Bulleted List)"
                        onMouseDown={e => {
                            e.preventDefault();
                            exec('insertUnorderedList');
                        }}
                        className={`p-1.5 rounded-lg transition ${
                            activeStates.insertUnorderedList
                                ? 'bg-teal-100 text-teal-800'
                                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                        }`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        title="Daftar Nomor (Numbered List)"
                        onMouseDown={e => {
                            e.preventDefault();
                            exec('insertOrderedList');
                        }}
                        className={`p-1.5 rounded-lg transition ${
                            activeStates.insertOrderedList
                                ? 'bg-teal-100 text-teal-800'
                                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                        }`}
                    >
                        <ListOrdered className="w-4 h-4" />
                    </button>

                    <div className="h-4 w-px bg-stone-300 mx-1" />

                    {/* Link & Clear Format */}
                    <button
                        type="button"
                        title="Sisipkan Tautan Link"
                        onMouseDown={e => {
                            e.preventDefault();
                            handleInsertLink();
                        }}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 transition"
                    >
                        <Link2 className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        title="Hapus Format (Clear Formatting)"
                        onMouseDown={e => {
                            e.preventDefault();
                            exec('removeFormat');
                        }}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 transition"
                    >
                        <RemoveFormatting className="w-4 h-4" />
                    </button>
                </div>

                {/* View Mode Toggle: Visual vs Code */}
                <div className="flex items-center gap-1 bg-stone-200/60 p-0.5 rounded-lg shrink-0">
                    <button
                        type="button"
                        onClick={() => setViewMode('visual')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 ${
                            viewMode === 'visual'
                                ? 'bg-white text-stone-900 shadow-xs'
                                : 'text-stone-600 hover:text-stone-900'
                        }`}
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Visual</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('code')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 ${
                            viewMode === 'code'
                                ? 'bg-white text-stone-900 shadow-xs'
                                : 'text-stone-600 hover:text-stone-900'
                        }`}
                    >
                        <Code className="w-3.5 h-3.5" />
                        <span>HTML</span>
                    </button>
                </div>
            </div>

            {/* ── Editor Area ── */}
            {viewMode === 'visual' ? (
                <div className="relative">
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleInput}
                        onKeyUp={updateActiveStates}
                        onMouseUp={updateActiveStates}
                        data-placeholder={placeholder}
                        style={{ minHeight }}
                        className="p-4 sm:p-5 text-stone-800 text-sm leading-relaxed focus:outline-none overflow-y-auto max-h-[600px] empty:before:content-[attr(data-placeholder)] empty:before:text-stone-400 empty:before:pointer-events-none prose prose-stone max-w-none [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-stone-900 [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-stone-900 [&_h3]:mt-3 [&_h3]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-teal-500 [&_blockquote]:pl-3.5 [&_blockquote]:italic [&_blockquote]:text-stone-600 [&_blockquote]:my-3 [&_a]:text-teal-600 [&_a]:underline"
                    />
                </div>
            ) : (
                <textarea
                    rows={14}
                    value={value}
                    onChange={e => {
                        onChange(e.target.value);
                        updateStats(e.target.value);
                    }}
                    style={{ minHeight }}
                    placeholder="<p>Tulis kode HTML artikel di sini...</p>"
                    className="w-full p-4 font-mono text-xs text-stone-800 bg-stone-50/50 leading-relaxed focus:outline-none resize-y border-none"
                />
            )}

            {/* ── Footer Stats ── */}
            <div className="px-4 py-2 bg-stone-50/60 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-medium">
                <span className="hidden sm:inline">
                    {viewMode === 'visual' ? 'Mode Editor Visual (WYSIWYG)' : 'Mode Editor Kode HTML'}
                </span>
                <div className="flex items-center gap-3 ml-auto">
                    <span>{stats.words} kata</span>
                    <span>•</span>
                    <span>{stats.chars} karakter</span>
                </div>
            </div>
        </div>
    );
}
