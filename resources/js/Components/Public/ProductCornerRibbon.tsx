import React from 'react';

interface ProductCornerRibbonProps {
    discount?: string | number | null;
    label?: string;
    className?: string;
}

export default function ProductCornerRibbon({
    discount,
    label,
    className = '',
}: ProductCornerRibbonProps) {
    // Format teks diskon: misal 50 -> "50% OFF", atau string kustom "50% OFF" / "SALE"
    const text = React.useMemo(() => {
        if (label) return String(label).trim().toUpperCase();
        if (!discount && discount !== 0) return null;
        if (typeof discount === 'number') {
            return `${Math.round(discount)}% OFF`;
        }
        const str = String(discount).trim().toUpperCase();
        if (/^\d+$/.test(str)) {
            return `${str}% OFF`;
        }
        return str;
    }, [discount, label]);

    // PENTING: Jika tidak ada diskon, jangan tampilkan badge sama sekali
    if (!text) {
        return null;
    }

    return (
        <div
            className={`absolute -top-1.5 -left-1.5 z-30 pointer-events-none select-none ${className}`}
            style={{ width: '84px', height: '84px' }}
            aria-label={`Diskon: ${text}`}
        >
            <svg
                viewBox="0 0 92 92"
                className="w-full h-full overflow-visible"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* 1. Gradasi Diskon Elegan #E63854 (Vibrant Crimson Rose) */}
                    <linearGradient
                        id="ribbon-discount-grad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor="#FF5E79" />
                        <stop offset="45%" stopColor="#E63854" />
                        <stop offset="100%" stopColor="#B31A33" />
                    </linearGradient>

                    {/* 2. Bayangan Timbul Mengambang (Clean 3D Drop Shadow) */}
                    <filter id="ribbon-discount-shadow" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="1" dy="2.5" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.32" />
                    </filter>

                    {/* 3. Bayangan Teks Elegan & Tajam */}
                    <filter id="ribbon-discount-text-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="1.2" stdDeviation="0.6" floodColor="#000000" floodOpacity="0.65" />
                    </filter>
                </defs>

                {/* ─── A. 3D FOLD EARS: Melipat ke belakang sudut kartu (Pop Out Effect) ─── */}
                {/* Lipatan Sisi Kiri (Tepi vertikal kartu pada x = 7) */}
                <polygon
                    points="7,67 7,74 0,67"
                    fill="#7A0E20"
                />

                {/* Lipatan Sisi Atas (Tepi horizontal kartu pada y = 7) */}
                <polygon
                    points="67,7 74,7 67,0"
                    fill="#7A0E20"
                />

                {/* ─── B. PITA DIAGONAL UTAMA ─── */}
                <g filter="url(#ribbon-discount-shadow)">
                    {/* Bodi Pita */}
                    <polygon
                        points="0,35 35,0 67,0 0,67"
                        fill="url(#ribbon-discount-grad)"
                    />

                    {/* Garis Kilau Halus Tepi Atas (Top Rim Light) */}
                    <line
                        x1="0"
                        y1="35"
                        x2="35"
                        y2="0"
                        stroke="rgba(255, 255, 255, 0.75)"
                        strokeWidth="1"
                        strokeLinecap="round"
                    />

                    {/* Garis Aksen Tipis Elegan (Sleek Hairlines) */}
                    <line
                        x1="2"
                        y1="38"
                        x2="38"
                        y2="2"
                        stroke="rgba(255, 255, 255, 0.45)"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                    />
                    <line
                        x1="2"
                        y1="64"
                        x2="64"
                        y2="2"
                        stroke="rgba(255, 255, 255, 0.45)"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                    />

                    {/* ─── C. TIPOGRAFI INTER ELEGAN & TEGAS ─── */}
                    <g transform="translate(25.5, 25.5) rotate(-45)">
                        <text
                            x="0"
                            y="0"
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill="#ffffff"
                            fontSize={text.length > 7 ? '9' : '10'}
                            fontWeight="800"
                            fontFamily="var(--font-family, 'Inter', system-ui, -apple-system, sans-serif)"
                            letterSpacing="0.06em"
                            filter="url(#ribbon-discount-text-shadow)"
                            style={{
                                textTransform: 'uppercase',
                            }}
                        >
                            {text}
                        </text>
                    </g>
                </g>
            </svg>
        </div>
    );
}
