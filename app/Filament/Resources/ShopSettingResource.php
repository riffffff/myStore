<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ShopSettingResource\Pages\CreateShopSetting;
use App\Filament\Resources\ShopSettingResource\Pages\EditShopSetting;
use App\Filament\Resources\ShopSettingResource\Pages\ListShopSettings;
use App\Models\ShopSetting;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ShopSettingResource extends Resource
{
    protected static ?string $model = ShopSetting::class;

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationLabel = 'Pengaturan Toko';

    protected static ?string $pluralLabel = 'Pengaturan Toko';

    protected static ?string $label = 'Pengaturan Toko';

    protected static ?string $slug = 'shop-settings';

    protected static ?int $navigationSort = 4;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Tabs::make('Pengaturan')
                    ->tabs([

                        // ── Tab 1: Identitas Toko ────────────────────────────
                        Forms\Components\Tabs\Tab::make('Identitas Toko')
                            ->icon('heroicon-o-building-storefront')
                            ->schema([
                                Forms\Components\Section::make('Informasi Toko')
                                    ->schema([
                                        Forms\Components\TextInput::make('shop_name')
                                            ->label('Nama Toko')
                                            ->required()
                                            ->maxLength(255)
                                            ->placeholder('Contoh: PaiTech'),

                                        Forms\Components\Textarea::make('description')
                                            ->label('Deskripsi Toko')
                                            ->rows(3)
                                            ->maxLength(1000)
                                            ->placeholder('Solusi teknologi dan produk berkualitas untuk kebutuhan bisnis modern.'),

                                        Forms\Components\Textarea::make('address')
                                            ->label('Alamat Toko')
                                            ->rows(2)
                                            ->maxLength(1000)
                                            ->placeholder('Contoh: Indonesia'),
                                    ])->columns(1),

                                Forms\Components\Section::make('Hero Banner')
                                    ->schema([
                                        Forms\Components\TextInput::make('hero_banner_text_1')
                                            ->label('Teks Baris 1')
                                            ->maxLength(255)
                                            ->placeholder('Teknologi & Produk Berkualitas'),

                                        Forms\Components\TextInput::make('hero_banner_text_2')
                                            ->label('Teks Baris 2')
                                            ->maxLength(255)
                                            ->placeholder('Solusi digital untuk transformasi bisnis Anda'),
                                    ])->columns(2),
                            ]),

                        // ── Tab 2: Branding & Logo ───────────────────────────
                        Forms\Components\Tabs\Tab::make('Branding & Logo')
                            ->icon('heroicon-o-photo')
                            ->schema([
                                Forms\Components\Section::make('Logo & Favicon')
                                    ->description('Upload logo dan favicon untuk toko Anda.')
                                    ->schema([
                                        Forms\Components\FileUpload::make('logo')
                                            ->label('Logo (Light Mode)')
                                            ->image()
                                            ->disk('public')
                                            ->directory('branding')
                                            ->maxSize(5120)
                                            ->helperText('Format: JPG, PNG, SVG. Maks: 5MB.'),

                                        Forms\Components\FileUpload::make('logo_dark')
                                            ->label('Logo (Dark Mode)')
                                            ->image()
                                            ->disk('public')
                                            ->directory('branding')
                                            ->maxSize(5120)
                                            ->helperText('Akan digunakan saat dark mode aktif. Opsional.'),

                                        Forms\Components\FileUpload::make('favicon')
                                            ->label('Favicon')
                                            ->image()
                                            ->disk('public')
                                            ->directory('branding')
                                            ->maxSize(1024)
                                            ->helperText('Format: PNG, ICO. Ukuran ideal: 32×32 atau 64×64px.'),
                                    ])->columns(3),
                            ]),

                        // ── Tab 3: Kontak & Operasional ──────────────────────
                        Forms\Components\Tabs\Tab::make('Kontak & Operasional')
                            ->icon('heroicon-o-phone')
                            ->schema([
                                Forms\Components\Section::make('Kontak WhatsApp')
                                    ->schema([
                                        Forms\Components\TextInput::make('whatsapp_number')
                                            ->label('Nomor WhatsApp')
                                            ->required()
                                            ->maxLength(20)
                                            ->placeholder('6281234567890')
                                            ->helperText('Format: 62XXXXXXXXXX (tanpa +)'),

                                        Forms\Components\Textarea::make('whatsapp_template')
                                            ->label('Template Pesan WhatsApp')
                                            ->rows(3)
                                            ->required()
                                            ->maxLength(2000)
                                            ->placeholder('Halo PaiTech, saya tertarik dengan produk *{product_name}* seharga {product_price}. Apakah tersedia?')
                                            ->helperText('Variabel: {product_name} dan {product_price}'),
                                    ])->columns(1),

                                Forms\Components\Section::make('Jam & Pengiriman')
                                    ->schema([
                                        Forms\Components\TextInput::make('operating_hours')
                                            ->label('Jam Operasional')
                                            ->maxLength(255)
                                            ->placeholder('Senin - Sabtu: 08:00 - 17:00'),

                                        Forms\Components\TextInput::make('shipping_estimate_days')
                                            ->label('Estimasi Waktu Pengiriman')
                                            ->maxLength(255)
                                            ->placeholder('7 - 14 hari kerja'),

                                        Forms\Components\TagsInput::make('shipping_areas')
                                            ->label('Area Pengiriman')
                                            ->placeholder('Tambah area...')
                                            ->separator(',')
                                            ->suggestions([
                                                'Seluruh Indonesia',
                                                'Jawa Tengah',
                                                'Jawa Barat',
                                                'Jawa Timur',
                                                'Jabodetabek',
                                                'Luar Jawa',
                                                'Pulau Sumatera',
                                                'Pulau Kalimantan',
                                                'Pulau Sulawesi',
                                            ]),
                                    ])->columns(2),
                            ]),

                        // ── Tab 4: Pembayaran & QRIS ─────────────────────────
                        Forms\Components\Tabs\Tab::make('Pembayaran & QRIS')
                            ->icon('heroicon-o-qr-code')
                            ->schema([
                                Forms\Components\Section::make('Konfigurasi QRIS Toko')
                                    ->description('Upload barcode QRIS toko Anda agar pelanggan dapat melakukan pembayaran non-tunai saat checkout (mendukung semua m-Banking & e-Wallet).')
                                    ->schema([
                                        Forms\Components\FileUpload::make('qris_image')
                                            ->label('Gambar Barcode QRIS')
                                            ->image()
                                            ->disk('public')
                                            ->directory('qris')
                                            ->visibility('public')
                                            ->maxSize(5120)
                                            ->helperText('Upload foto barcode QRIS toko Anda (JPG, PNG, WebP). Maks: 5MB.'),

                                        Forms\Components\TextInput::make('qris_account_name')
                                            ->label('Nama Akun / Merchant QRIS (Atas Nama)')
                                            ->maxLength(255)
                                            ->placeholder('Contoh: PAITECH STORE / RIFQI')
                                            ->helperText('Nama merchant / pemilik rekening QRIS yang tampil di bawah barcode QRIS.'),
                                    ])->columns(2),
                            ]),

                        // ── Tab 5: Theme Colors (Component-Based) ───────────
                        Forms\Components\Tabs\Tab::make('Theme Colors')
                            ->icon('heroicon-o-swatch')
                            ->schema([
                                Forms\Components\Section::make('Header (Navigasi Atas)')
                                    ->description('Kustomisasi tampilan navigasi dan menu atas website.')
                                    ->collapsible()
                                    ->schema([
                                        Forms\Components\ColorPicker::make('header_bg_color')
                                            ->label('Warna Background Header')
                                            ->helperText('Default: #333333 (Dark Charcoal)')
                                            ->default('#333333'),

                                        Forms\Components\ColorPicker::make('header_text_color')
                                            ->label('Warna Teks & Menu Header')
                                            ->helperText('Default: #FFFFFF (Putih)')
                                            ->default('#FFFFFF'),

                                        Forms\Components\ColorPicker::make('header_active_color')
                                            ->label('Warna Menu Aktif / Tombol Daftar')
                                            ->helperText('Tombol highlight pada menu aktif dan tombol daftar')
                                            ->default('#f53b5f'),
                                    ])->columns(3),

                                Forms\Components\Section::make('Card Product (Katalog Produk)')
                                    ->description('Kustomisasi tampilan kartu produk pada katalog dan beranda.')
                                    ->collapsible()
                                    ->schema([
                                        Forms\Components\ColorPicker::make('card_product_bg_color')
                                            ->label('Warna Background Card')
                                            ->helperText('Default: #FFFFFF')
                                            ->default('#FFFFFF'),

                                        Forms\Components\ColorPicker::make('card_product_border_color')
                                            ->label('Warna Border Card')
                                            ->helperText('Garis pinggir kartu produk')
                                            ->default('#E5E7EB'),

                                        Forms\Components\ColorPicker::make('card_product_text_color')
                                            ->label('Warna Judul Produk')
                                            ->helperText('Teks nama/judul produk')
                                            ->default('#262626'),

                                        Forms\Components\ColorPicker::make('card_product_price_color')
                                            ->label('Warna Harga Produk')
                                            ->helperText('Teks harga produk')
                                            ->default('#262626'),

                                        Forms\Components\ColorPicker::make('card_product_btn_color')
                                            ->label('Warna Tombol / Hover Card')
                                            ->helperText('Aksen tombol beli dan highlight hover kartu')
                                            ->default('#f53b5f'),
                                    ])->columns(3),

                                Forms\Components\Section::make('Card Article (Artikel & Berita)')
                                    ->description('Kustomisasi tampilan kartu artikel pada daftar info dan edukasi.')
                                    ->collapsible()
                                    ->schema([
                                        Forms\Components\ColorPicker::make('card_article_bg_color')
                                            ->label('Warna Background Card')
                                            ->helperText('Default: #FFFFFF')
                                            ->default('#FFFFFF'),

                                        Forms\Components\ColorPicker::make('card_article_border_color')
                                            ->label('Warna Border Card')
                                            ->helperText('Garis pinggir kartu artikel')
                                            ->default('#E5E7EB'),

                                        Forms\Components\ColorPicker::make('card_article_tag_color')
                                            ->label('Warna Badge Kategori')
                                            ->helperText('Badge tag/kategori di atas gambar artikel')
                                            ->default('#f53b5f'),

                                        Forms\Components\ColorPicker::make('card_article_title_color')
                                            ->label('Warna Judul Artikel')
                                            ->helperText('Teks judul artikel')
                                            ->default('#262626'),

                                        Forms\Components\ColorPicker::make('card_article_text_color')
                                            ->label('Warna Cuplikan Teks')
                                            ->helperText('Teks excerpt/deskripsi singkat')
                                            ->default('#4B5563'),
                                    ])->columns(3),

                                Forms\Components\Section::make('Hero / Banner Utama')
                                    ->description('Kustomisasi tampilan slider banner utama di halaman beranda.')
                                    ->collapsible()
                                    ->schema([
                                        Forms\Components\ColorPicker::make('hero_bg_color')
                                            ->label('Warna Background Box Hero')
                                            ->helperText('Latar belakang kotak slider hero')
                                            ->default('#F1F1F1'),

                                        Forms\Components\ColorPicker::make('hero_text_color')
                                            ->label('Warna Judul & Teks Hero')
                                            ->helperText('Teks judul promo dan deskripsi banner')
                                            ->default('#262626'),

                                        Forms\Components\ColorPicker::make('hero_btn_color')
                                            ->label('Warna Tombol CTA Hero')
                                            ->helperText('Tombol aksi utama pada banner')
                                            ->default('#f53b5f'),

                                        Forms\Components\ColorPicker::make('hero_btn_text_color')
                                            ->label('Warna Teks Tombol CTA')
                                            ->helperText('Teks di dalam tombol CTA hero')
                                            ->default('#FFFFFF'),
                                    ])->columns(2),

                                Forms\Components\Section::make('Footer (Bagian Bawah)')
                                    ->description('Kustomisasi tampilan footer dan informasi kontak toko.')
                                    ->collapsible()
                                    ->schema([
                                        Forms\Components\ColorPicker::make('footer_bg_color')
                                            ->label('Warna Background Footer')
                                            ->helperText('Default: #262626 (Charcoal)')
                                            ->default('#262626'),

                                        Forms\Components\ColorPicker::make('footer_text_color')
                                            ->label('Warna Teks Footer')
                                            ->helperText('Teks deskripsi, alamat, dan jam buka')
                                            ->default('#9CA3AF'),

                                        Forms\Components\ColorPicker::make('footer_accent_color')
                                            ->label('Warna Aksen / Link Footer')
                                            ->helperText('Icon kontak dan link hover footer')
                                            ->default('#0D9488'),
                                    ])->columns(3),

                                Forms\Components\Section::make('Halaman & Tombol Global')
                                    ->description('Pengaturan warna dasar halaman dan tombol umum.')
                                    ->collapsible()
                                    ->schema([
                                        Forms\Components\ColorPicker::make('page_bg_color')
                                            ->label('Warna Background Halaman')
                                            ->helperText('Latar belakang dasar halaman toko')
                                            ->default('#FFFFFF'),

                                        Forms\Components\ColorPicker::make('page_text_color')
                                            ->label('Warna Teks Utama Halaman')
                                            ->helperText('Warna teks heading & body halaman')
                                            ->default('#262626'),

                                        Forms\Components\ColorPicker::make('primary_btn_color')
                                            ->label('Warna Tombol Utama (Global)')
                                            ->helperText('Tombol tambah keranjang, checkout, dll.')
                                            ->default('#f53b5f'),

                                        Forms\Components\ColorPicker::make('primary_btn_text_color')
                                            ->label('Warna Teks Tombol Utama')
                                            ->helperText('Default: #FFFFFF')
                                            ->default('#FFFFFF'),
                                    ])->columns(2),

                                Forms\Components\Section::make('Opsi Gaya Tambahan')
                                    ->collapsible()
                                    ->schema([
                                        Forms\Components\Select::make('theme_font_family')
                                            ->label('Font Family')
                                            ->options([
                                                'inter'        => 'Inter (Modern, Clean) — Default',
                                                'roboto'       => 'Roboto (Google Default)',
                                                'poppins'      => 'Poppins (Rounded, Friendly)',
                                                'montserrat'   => 'Montserrat (Geometric)',
                                                'open-sans'    => 'Open Sans (Neutral)',
                                                'lato'         => 'Lato (Corporate)',
                                                'raleway'      => 'Raleway (Elegant)',
                                                'nunito'       => 'Nunito (Soft, Rounded)',
                                                'source-sans'  => 'Source Sans 3 (Adobe)',
                                                'work-sans'    => 'Work Sans (Technical)',
                                                'playfair'     => 'Playfair Display (Serif, Elegant)',
                                                'merriweather' => 'Merriweather (Serif, Readable)',
                                                'system'       => 'System Default (Native OS)',
                                            ])
                                            ->default('inter')
                                            ->searchable()
                                            ->helperText('Font dimuat dari Google Fonts CDN.'),

                                        Forms\Components\Select::make('theme_border_radius')
                                            ->label('Border Radius')
                                            ->options([
                                                '0'      => 'None — Sudut Tajam',
                                                '0.25rem' => 'Small — 4px',
                                                '0.5rem'  => 'Medium — 8px (Default)',
                                                '0.75rem' => 'Large — 12px',
                                                '1rem'    => 'Extra Large — 16px',
                                                '1.5rem'  => 'Rounded — 24px',
                                            ])
                                            ->default('0.5rem')
                                            ->helperText('Menentukan kelengkungan sudut tombol dan kartu.'),

                                        Forms\Components\Toggle::make('theme_dark_mode_enabled')
                                            ->label('Enable Dark Mode')
                                            ->helperText('Izinkan pengunjung beralih ke tampilan gelap.')
                                            ->inline(false),
                                    ])->columns(3),
                            ]),

                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('shop_name')
                    ->label('Nama Toko')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\ColorColumn::make('theme_primary_color')
                    ->label('Primary Color'),

                Tables\Columns\TextColumn::make('theme_font_family')
                    ->label('Font')
                    ->badge(),

                Tables\Columns\IconColumn::make('theme_dark_mode_enabled')
                    ->label('Dark Mode')
                    ->boolean(),

                Tables\Columns\TextColumn::make('whatsapp_number')
                    ->label('Nomor WA')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Terakhir Diubah')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->iconButton()
                    ->tooltip('Edit Pengaturan'),
            ])
            ->bulkActions([])
            ->headerActions([])
            ->defaultSort('updated_at', 'desc');
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery();
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListShopSettings::route('/'),
            'create' => CreateShopSetting::route('/create'),
            'edit'   => EditShopSetting::route('/{record}/edit'),
        ];
    }
}
