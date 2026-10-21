import React from 'react';
import { Link } from '@inertiajs/react';
import { MapPin, Phone, Clock3, Mail } from 'lucide-react';

interface FooterProps {
    shopName: string;
    logoUrl: string;
    logoDarkUrl: string;
    shopDescription: string;
    address: string;
    waNumber: string;
    operatingHours: string;
    email: string;
    formatWaDisplay: (num: string) => string;
}

export default function Footer({
    shopName,
    logoUrl,
    shopDescription,
    address,
    waNumber,
    operatingHours,
    email,
    formatWaDisplay,
}: FooterProps) {
    const navLinks = [
        { href: route('home'), label: 'Beranda' },
        { href: route('products.index'), label: 'Katalog' },
        { href: route('articles.index'), label: 'Artikel' },
        { href: route('orders.track'), label: 'Pesanan' },
    ];

    return (
        <footer
            className="border-t"
            style={{
                backgroundColor: 'var(--color-footer-bg)',
                color: '#FFFFFF',
                borderColor: 'rgba(255,255,255,0.08)',
            }}
        >
            {/* ═══════ DESKTOP ═══════ */}
            <div className="hidden md:block max-w-[1440px] mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-4 gap-12">
                    {/* Info Toko */}
                    <div className="col-span-2 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-white/20 bg-white/10">
                                <img src={logoUrl} alt={`${shopName} Logo`} className="h-full w-full object-cover"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            </div>
                            <h3 className="text-base font-bold text-white">{shopName}</h3>
                        </div>
                        <p className="text-sm leading-relaxed text-white/70">{shopDescription}</p>
                    </div>

                    {/* Navigasi */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Navigasi</h3>
                        <nav className="flex flex-col space-y-2">
                            {navLinks.map(({ href, label }) => (
                                <Link key={label} href={href} className="text-sm text-white hover:text-white/70 transition">
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Kontak */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Kontak</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-white/50" />
                                <span className="text-white leading-relaxed">{address}</span>
                            </div>
                            {email && (
                                <div className="flex items-start gap-2">
                                    <Mail className="h-4 w-4 mt-0.5 shrink-0 text-white/50" />
                                    <a href={`mailto:${email}`} className="text-white hover:text-white/70 transition">
                                        {email}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-start gap-2">
                                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-white/50" />
                                <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
                                    className="text-white hover:text-white/70 transition">
                                    {formatWaDisplay(waNumber)}
                                </a>
                            </div>
                            <div className="flex items-start gap-2">
                                <Clock3 className="h-4 w-4 mt-0.5 shrink-0 text-white/50" />
                                <span className="text-white leading-relaxed">{operatingHours}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 text-center">
                    <p className="text-xs text-white/40">
                        &copy; {new Date().getFullYear()}{' '}
                        <span className="font-semibold text-white/70">{shopName}</span>. Hak Cipta Dilindungi.
                    </p>
                </div>
            </div>

            {/* ═══════ MOBILE — Compact & Standard ═══════ */}
            <div className="md:hidden px-5 pt-5 pb-4">
                {/* Logo + nama + nav — satu baris */}
                <div className="flex items-center justify-between gap-2 mb-4">
                    {/* Logo + nama */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="h-7 w-7 rounded-md overflow-hidden border border-white/20 bg-white/10 shrink-0">
                            <img src={logoUrl} alt={shopName} className="h-full w-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        </div>
                        <span className="text-sm font-bold text-white">{shopName}</span>
                    </div>

                    {/* Nav links — sejajar kanan */}
                    <div className="flex items-center gap-3">
                        {navLinks.map(({ href, label }) => (
                            <Link key={label} href={href} className="text-[11px] text-white/55 hover:text-white transition">
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-4">
                    <p className="text-[11px] text-white/35 text-center">
                        &copy; {new Date().getFullYear()} <span className="text-white/55">{shopName}</span>. Hak Cipta Dilindungi.
                    </p>
                </div>
            </div>

            {/* Clearance untuk fixed BottomNav di mobile */}
            <div
                className="md:hidden w-full h-16"
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
                aria-hidden="true"
            />
        </footer>
    );
}
