import React from 'react';
import { Link } from '@inertiajs/react';
import { MapPin, Phone, Clock3 } from 'lucide-react';

interface FooterProps {
    shopName: string;
    logoUrl: string;
    logoDarkUrl: string;
    shopDescription: string;
    address: string;
    waNumber: string;
    operatingHours: string;
    formatWaDisplay: (num: string) => string;
}

export default function Footer({
    shopName,
    logoUrl,
    logoDarkUrl,
    shopDescription,
    address,
    waNumber,
    operatingHours,
    formatWaDisplay,
}: FooterProps) {
    return (
        <footer className="bg-primary-900 text-gray-300 border-t border-primary-800">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Info Toko */}
                    <div className="md:col-span-2 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl overflow-hidden bg-accent-500/20 border border-accent-500/30 flex items-center justify-center shrink-0">
                                <img
                                    src={logoUrl}
                                    alt={`${shopName} Logo`}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                            <h3 className="text-xl font-bold text-white">{shopName}</h3>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-400">{shopDescription}</p>
                    </div>

                    {/* Navigasi */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">Navigasi</h3>
                        <nav className="flex flex-col space-y-2.5">
                            <Link
                                href={route('home')}
                                className="text-sm hover:text-accent-400 transition inline-flex items-center group"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-700 mr-2 group-hover:bg-accent-500 transition" />
                                Beranda
                            </Link>
                            <Link
                                href={route('products.index')}
                                className="text-sm hover:text-accent-400 transition inline-flex items-center group"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-700 mr-2 group-hover:bg-accent-500 transition" />
                                Katalog Produk
                            </Link>
                            <Link
                                href={route('articles.index')}
                                className="text-sm hover:text-accent-400 transition inline-flex items-center group"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-700 mr-2 group-hover:bg-accent-500 transition" />
                                Artikel & Info
                            </Link>
                        </nav>
                    </div>

                    {/* Kontak */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">Kontak</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-accent-500 mt-0.5 shrink-0" />
                                <span className="leading-relaxed">{address}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Phone className="h-4 w-4 text-accent-500 mt-0.5 shrink-0" />
                                <a
                                    href={`https://wa.me/${waNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-accent-400 transition"
                                >
                                    {formatWaDisplay(waNumber)}
                                </a>
                            </div>
                            <div className="flex items-start gap-2">
                                <Clock3 className="h-4 w-4 text-accent-500 mt-0.5 shrink-0" />
                                <span className="leading-relaxed">{operatingHours}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-primary-800 text-center">
                    <p className="text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} <span className="font-semibold text-accent-400">{shopName}</span>. Hak Cipta Dilindungi.
                    </p>
                </div>
            </div>
        </footer>
    );
}
