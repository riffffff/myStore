@auth
@php
    $currentRoute = request()->route()?->getName() ?? '';
    // Sembunyikan bottom navigation bar jika sedang di halaman formulir (create / edit)
    // agar tidak bertumpuk / berantakan dengan tombol simpan perubahan.
    $isFormPage = str_contains($currentRoute, '.edit') || str_contains($currentRoute, '.create');
@endphp

@if(! $isFormPage)
@php
    $isDashboard = request()->routeIs('filament.admin.pages.dashboard');
    $isProducts = request()->routeIs('filament.admin.resources.products.*');
    $isArticles = request()->routeIs('filament.admin.resources.articles.*');
    $isReviews = request()->routeIs('filament.admin.resources.reviews.*');
    $isSettings = request()->routeIs('filament.admin.resources.shop-settings.*');

    $pendingReviewsCount = \App\Models\Review::where('is_approved', false)->count();
@endphp

<!-- Mobile Bottom Navigation Bar (Hanya tampil di daftar tabel / dashboard) -->
<nav class="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border-t border-stone-200/90 dark:border-stone-800 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] select-none">
    <div class="flex items-center justify-around px-1.5 py-1.5 pb-[calc(env(safe-area-inset-bottom,0px)+0.35rem)]">
        
        <!-- 1. Dashboard -->
        <a href="{{ route('filament.admin.pages.dashboard') }}"
           class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 {{ $isDashboard ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800' }}">
            <div class="relative p-1 rounded-lg {{ $isDashboard ? 'bg-teal-500/10 dark:bg-teal-400/15' : '' }}">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="{{ $isDashboard ? '2.3' : '1.8' }}">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
            </div>
            <span class="text-[10px] tracking-tight mt-0.5">Ringkasan</span>
        </a>

        <!-- 2. Produk -->
        <a href="{{ route('filament.admin.resources.products.index') }}"
           class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 {{ $isProducts ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800' }}">
            <div class="relative p-1 rounded-lg {{ $isProducts ? 'bg-teal-500/10 dark:bg-teal-400/15' : '' }}">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="{{ $isProducts ? '2.3' : '1.8' }}">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                </svg>
            </div>
            <span class="text-[10px] tracking-tight mt-0.5">Produk</span>
        </a>

        <!-- 3. Artikel -->
        <a href="{{ route('filament.admin.resources.articles.index') }}"
           class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 {{ $isArticles ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800' }}">
            <div class="relative p-1 rounded-lg {{ $isArticles ? 'bg-teal-500/10 dark:bg-teal-400/15' : '' }}">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="{{ $isArticles ? '2.3' : '1.8' }}">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                </svg>
            </div>
            <span class="text-[10px] tracking-tight mt-0.5">Artikel</span>
        </a>

        <!-- 4. Ulasan -->
        <a href="{{ route('filament.admin.resources.reviews.index') }}"
           class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 relative {{ $isReviews ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800' }}">
            <div class="relative p-1 rounded-lg {{ $isReviews ? 'bg-teal-500/10 dark:bg-teal-400/15' : '' }}">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="{{ $isReviews ? '2.3' : '1.8' }}">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                @if($pendingReviewsCount > 0)
                    <span class="absolute -top-0.5 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-stone-900 animate-pulse"></span>
                @endif
            </div>
            <span class="text-[10px] tracking-tight mt-0.5">Ulasan</span>
        </a>

        <!-- 5. Pengaturan Toko -->
        <a href="{{ \App\Filament\Resources\ShopSettingResource::getUrl('edit', ['record' => 1]) }}"
           class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 {{ $isSettings ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800' }}">
            <div class="relative p-1 rounded-lg {{ $isSettings ? 'bg-teal-500/10 dark:bg-teal-400/15' : '' }}">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="{{ $isSettings ? '2.3' : '1.8' }}">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.651V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009 9.35c.66 0 1.28-.213 1.78-.577.5.364 1.12.577 1.78.577.66 0 1.28-.213 1.78-.577.5.364 1.12.577 1.78.577a3 3 0 003.75.615v11.65m-16.5-11.65L12 3l8.25 6.35" />
                </svg>
            </div>
            <span class="text-[10px] tracking-tight mt-0.5">Toko</span>
        </a>

    </div>
</nav>
@endif
@endauth
