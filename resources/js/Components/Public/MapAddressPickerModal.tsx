import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    MapPin,
    Navigation,
    Search,
    X,
    Loader2,
    Check,
    AlertCircle,
} from 'lucide-react';

// Fix icon marker default leaflet di Vite
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapAddressPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectAddress: (fullAddress: string) => void;
    initialAddress?: string;
}

interface SearchResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

export default function MapAddressPickerModal({
    isOpen,
    onClose,
    onSelectAddress,
    initialAddress = '',
}: MapAddressPickerModalProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    // Default lokasi: Jakarta Pusat (-6.1754, 106.8272)
    const [centerCoord, setCenterCoord] = useState<[number, number]>([-6.1754, 106.8272]);
    const [detectedAddress, setDetectedAddress] = useState<string>('');
    const [benchmarkDetail, setBenchmarkDetail] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isLoadingAddress, setIsLoadingAddress] = useState<boolean>(false);
    const [isLocating, setIsLocating] = useState<boolean>(false);
    const [geoError, setGeoError] = useState<string | null>(null);

    const reverseGeocodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Fungsi Reverse Geocoding (Koordinat -> Nama Alamat Lengkap via OpenStreetMap Nominatim)
    const reverseGeocode = async (lat: number, lon: number) => {
        setIsLoadingAddress(true);
        setGeoError(null);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'id',
                    },
                }
            );
            if (!res.ok) throw new Error('Gagal mengambil detail alamat');
            const data = await res.json();
            if (data && data.display_name) {
                setDetectedAddress(data.display_name);
            } else {
                setDetectedAddress(`Titik Lokasi (${lat.toFixed(5)}, ${lon.toFixed(5)})`);
            }
        } catch {
            setDetectedAddress(`Titik Lokasi (${lat.toFixed(5)}, ${lon.toFixed(5)})`);
        } finally {
            setIsLoadingAddress(false);
        }
    };

    // Inisialisasi Peta saat Modal Terbuka
    useEffect(() => {
        if (!isOpen) return;

        // Reset state
        setGeoError(null);
        setSearchResults([]);

        const timer = setTimeout(() => {
            if (!mapContainerRef.current) return;

            // Bersihkan map instance lama jika ada
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }

            const map = L.map(mapContainerRef.current, {
                center: centerCoord,
                zoom: 16,
                zoomControl: false,
            });

            // Tambahkan tile layer OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map);

            // Pasang zoom control di posisi kanan bawah
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            // Event saat user selesai menggeser peta (moveend)
            map.on('moveend', () => {
                const center = map.getCenter();
                setCenterCoord([center.lat, center.lng]);

                if (reverseGeocodeTimeoutRef.current) {
                    clearTimeout(reverseGeocodeTimeoutRef.current);
                }

                // Debounce reverse geocoding agar tidak spam API
                reverseGeocodeTimeoutRef.current = setTimeout(() => {
                    reverseGeocode(center.lat, center.lng);
                }, 400);
            });

            mapInstanceRef.current = map;

            // Initial geocode
            reverseGeocode(centerCoord[0], centerCoord[1]);
        }, 100);

        return () => {
            clearTimeout(timer);
            if (reverseGeocodeTimeoutRef.current) {
                clearTimeout(reverseGeocodeTimeoutRef.current);
            }
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [isOpen]);

    // Deteksi Lokasi Sekarang (GPS Browser)
    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            setGeoError('Browser Anda tidak mendukung deteksi lokasi otomatis.');
            return;
        }

        setIsLocating(true);
        setGeoError(null);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setIsLocating(false);
                setCenterCoord([latitude, longitude]);

                if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([latitude, longitude], 17, {
                        animate: true,
                        duration: 1.2,
                    });
                }
            },
            (err) => {
                setIsLocating(false);
                console.error(err);
                setGeoError('Izin lokasi ditolak atau sinyal GPS tidak terdeteksi.');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    // Cari Alamat via Input Pencarian
    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setGeoError(null);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    searchQuery
                )}&countrycodes=id&limit=5`,
                {
                    headers: {
                        'Accept-Language': 'id',
                    },
                }
            );
            const data: SearchResult[] = await res.json();
            setSearchResults(data);
            if (data.length === 0) {
                setGeoError('Lokasi tidak ditemukan. Coba kata kunci lain.');
            }
        } catch {
            setGeoError('Gagal mencari lokasi. Periksa koneksi internet Anda.');
        } finally {
            setIsSearching(false);
        }
    };

    // Pilih Hasil Pencarian
    const handleSelectSearchResult = (result: SearchResult) => {
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        setCenterCoord([lat, lon]);
        setSearchResults([]);
        setSearchQuery(result.display_name.split(',')[0]);

        if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([lat, lon], 17, {
                animate: true,
                duration: 1,
            });
        }
    };

    // Konfirmasi dan Kirim Alamat ke Form Checkout
    const handleConfirm = () => {
        let finalAddress = detectedAddress;
        if (benchmarkDetail.trim()) {
            finalAddress = `${finalAddress} (${benchmarkDetail.trim()})`;
        }
        onSelectAddress(finalAddress);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full sm:max-w-xl h-full sm:h-[88vh] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                
                {/* ── HEADER MODAL ── */}
                <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between bg-white z-10 shrink-0">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                        <div>
                            <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-tight">
                                Tentukan Titik Lokasi
                            </h3>
                            <p className="text-[11px] text-stone-500">
                                Geser peta untuk menandai titik alamat yang tepat
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ── SEARCH BAR & GPS BUTTON ── */}
                <div className="px-3 sm:px-4 py-2.5 bg-stone-50/80 border-b border-stone-200/80 z-10 shrink-0">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama jalan, gedung, atau perumahan..."
                                className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 shadow-2xs"
                            />
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            {isSearching && (
                                <Loader2 className="w-4 h-4 text-stone-400 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleGetCurrentLocation}
                            disabled={isLocating}
                            title="Gunakan Lokasi Saat Ini"
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 transition shrink-0 shadow-2xs active:scale-95"
                        >
                            <Navigation className={`w-3.5 h-3.5 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Lokasi Saya</span>
                        </button>
                    </form>

                    {/* Dropdown Hasil Pencarian */}
                    {searchResults.length > 0 && (
                        <div className="mt-2 bg-white rounded-xl border border-stone-200 shadow-lg divide-y divide-stone-100 max-h-48 overflow-y-auto">
                            {searchResults.map((result) => (
                                <button
                                    key={result.place_id}
                                    type="button"
                                    onClick={() => handleSelectSearchResult(result)}
                                    className="w-full text-left px-3.5 py-2.5 text-xs text-stone-700 hover:bg-stone-50 transition flex items-start gap-2"
                                >
                                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span className="line-clamp-2 leading-relaxed">{result.display_name}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {geoError && (
                        <div className="mt-2 p-2 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-[11px] text-rose-700">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{geoError}</span>
                        </div>
                    )}
                </div>

                {/* ── AREA PETA INTERAKTIF DENGAN CENTER PIN ── */}
                <div className="relative flex-1 w-full min-h-[220px] bg-stone-100 overflow-hidden">
                    {/* Wadah Peta Leaflet */}
                    <div ref={mapContainerRef} className="w-full h-full z-0" />

                    {/* PIN ICON DI TENGAH PETA (ALA TOKOPEDIA / GOJEK) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-20 flex flex-col items-center">
                        <div className="px-2 py-0.5 rounded-full bg-stone-900 text-white text-[10px] font-semibold tracking-wide shadow-md whitespace-nowrap mb-1 animate-bounce">
                            Geser titik lokasi
                        </div>
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg border-2 border-white ring-2 ring-emerald-600/30">
                                <MapPin className="w-5 h-5 fill-white" />
                            </div>
                            <div className="w-2 h-2 rounded-full bg-black/40 blur-[1px] mx-auto mt-0.5" />
                        </div>
                    </div>
                </div>

                {/* ── FOOTER: DETAIL ALAMAT TERDETEKSI & TOMBOL PILIH ── */}
                <div className="p-4 bg-white border-t border-stone-200 z-10 space-y-3 shrink-0">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                                Alamat Terpilih
                            </span>
                            {isLoadingAddress && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-stone-400">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Membaca titik...
                                </span>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-stone-900 leading-snug line-clamp-2">
                            {detectedAddress || 'Menggeser pin untuk mendeteksi alamat...'}
                        </p>
                    </div>

                    {/* Input Tambahan Patokan (Nomor Rumah / Pagar / Blok) */}
                    <div>
                        <input
                            type="text"
                            value={benchmarkDetail}
                            onChange={(e) => setBenchmarkDetail(e.target.value)}
                            placeholder="Detail tambahan (cth: Blok B3 No. 12, Pagar hitam, samping masjid)"
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition"
                        />
                    </div>

                    {/* Tombol Konfirmasi */}
                    <div className="flex items-center gap-2 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-semibold text-stone-700 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={!detectedAddress || isLoadingAddress}
                            className="flex-[2] py-2.5 px-4 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                            <Check className="w-4 h-4" />
                            <span>Pilih Lokasi Ini</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
