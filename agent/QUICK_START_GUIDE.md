# Quick Start Guide - PaiTech Rebranding

## 🚀 Cara Mulai Implementasi

### Prerequisites
- [x] Laravel 13.8 installed
- [x] PHP 8.3
- [x] Node.js & NPM
- [x] Database (SQLite/MySQL)
- [x] Git repository

---

## 📋 Step-by-Step Implementation

### ⚙️ SETUP (5 menit)

```bash
# 1. Backup database dulu!
php artisan db:backup # atau manual backup

# 2. Buat branch baru
git checkout -b feature/paitech-rebranding-theme

# 3. Pull latest dari main (jika perlu)
git pull origin main

# 4. Check environment
php artisan --version  # Should be Laravel 13.x
node --version         # Should be 18+ or 20+
npm --version
```

---

## 🎯 FASE 1: Database & Model (3-5 jam)

### Step 1.1: Create Migration

```bash
# Buat migration baru
php artisan make:migration add_theme_colors_to_shop_settings
```

**Edit migration file:** `database/migrations/XXXX_add_theme_colors_to_shop_settings.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            // Theme Colors
            $table->string('theme_primary_color')->default('#3B82F6')->after('shipping_estimate_days');
            $table->string('theme_secondary_color')->default('#8B5CF6')->after('theme_primary_color');
            $table->string('theme_accent_color')->default('#F59E0B')->after('theme_secondary_color');
            $table->string('theme_background_color')->default('#FFFFFF')->after('theme_accent_color');
            $table->string('theme_background_dark_color')->default('#111827')->after('theme_background_color');
            $table->string('theme_text_color')->default('#1F2937')->after('theme_background_dark_color');
            $table->string('theme_text_light_color')->default('#6B7280')->after('theme_text_color');
            $table->string('theme_success_color')->default('#10B981')->after('theme_text_light_color');
            $table->string('theme_error_color')->default('#EF4444')->after('theme_success_color');
            $table->string('theme_warning_color')->default('#F59E0B')->after('theme_error_color');
            $table->string('theme_info_color')->default('#3B82F6')->after('theme_warning_color');
            
            // Additional Theme Options
            $table->string('theme_border_radius')->default('0.5rem')->after('theme_info_color');
            $table->string('theme_font_family')->default('inter')->after('theme_border_radius');
            $table->boolean('theme_dark_mode_enabled')->default(true)->after('theme_font_family');
        });
    }

    public function down(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            $table->dropColumn([
                'theme_primary_color',
                'theme_secondary_color',
                'theme_accent_color',
                'theme_background_color',
                'theme_background_dark_color',
                'theme_text_color',
                'theme_text_light_color',
                'theme_success_color',
                'theme_error_color',
                'theme_warning_color',
                'theme_info_color',
                'theme_border_radius',
                'theme_font_family',
                'theme_dark_mode_enabled',
            ]);
        });
    }
};
```

**Run migration:**
```bash
php artisan migrate
```

### Step 1.2: Update Model

**Edit:** `app/Models/ShopSetting.php`

Add to `$fillable` array:
```php
protected $fillable = [
    // ... existing fields
    'theme_primary_color',
    'theme_secondary_color',
    'theme_accent_color',
    'theme_background_color',
    'theme_background_dark_color',
    'theme_text_color',
    'theme_text_light_color',
    'theme_success_color',
    'theme_error_color',
    'theme_warning_color',
    'theme_info_color',
    'theme_border_radius',
    'theme_font_family',
    'theme_dark_mode_enabled',
];
```

Add font mapping constant (after class properties):
```php
private const FONT_MAP = [
    'inter' => [
        'name' => 'Inter',
        'url' => 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        'fallback' => 'system-ui, -apple-system, sans-serif',
    ],
    'roboto' => [
        'name' => 'Roboto',
        'url' => 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
        'fallback' => 'Arial, sans-serif',
    ],
    // ... copy semua fonts dari FONT_OPTIONS_REFERENCE.md
];
```

Add helper methods (before closing class bracket):
```php
public function getFontUrl(): ?string
{
    $fontSlug = $this->theme_font_family ?? 'inter';
    return self::FONT_MAP[$fontSlug]['url'] ?? null;
}

public function getFontFamily(): string
{
    $fontSlug = $this->theme_font_family ?? 'inter';
    $fontData = self::FONT_MAP[$fontSlug] ?? self::FONT_MAP['inter'];
    
    if ($fontData['url']) {
        return "'{$fontData['name']}', {$fontData['fallback']}";
    }
    
    return $fontData['fallback'];
}

public function getThemeColors(): array
{
    return [
        'primary' => $this->theme_primary_color,
        'secondary' => $this->theme_secondary_color,
        'accent' => $this->theme_accent_color,
        'background' => $this->theme_background_color,
        'backgroundDark' => $this->theme_background_dark_color,
        'text' => $this->theme_text_color,
        'textLight' => $this->theme_text_light_color,
        'success' => $this->theme_success_color,
        'error' => $this->theme_error_color,
        'warning' => $this->theme_warning_color,
        'info' => $this->theme_info_color,
        'borderRadius' => $this->theme_border_radius,
        'fontFamily' => $this->getFontFamily(),
        'darkModeEnabled' => $this->theme_dark_mode_enabled,
    ];
}
```

Update `applyDefaults()` method - change shop_name:
```php
if (empty($this->shop_name)) {
    $this->shop_name = 'PaiTech';
}
```

**Test:**
```bash
php artisan tinker
>>> $settings = App\Models\ShopSetting::getSettings();
>>> $settings->getThemeColors();
>>> exit
```

✅ **Commit:**
```bash
git add .
git commit -m "feat: add theme customization columns to shop_settings"
```

---

## 🎨 FASE 2: Filament Admin Panel (3-4 jam)

### Step 2.1: Update ShopSettingResource

**Edit:** `app/Filament/Resources/ShopSettingResource.php`

Update `form()` method, add new Tab untuk Theme:

```php
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Toggle;

public static function form(Form $form): Form
{
    return $form->schema([
        Tabs::make('Settings')
            ->tabs([
                // ... existing tabs (Shop Info, Contact, dll)
                
                // NEW TAB: Theme Customization
                Tabs\Tab::make('Theme Colors')
                    ->icon('heroicon-o-paint-brush')
                    ->schema([
                        Section::make('Primary Colors')
                            ->description('Main colors that define your brand identity')
                            ->schema([
                                ColorPicker::make('theme_primary_color')
                                    ->label('Primary Color')
                                    ->helperText('Main brand color (buttons, links)'),
                                ColorPicker::make('theme_secondary_color')
                                    ->label('Secondary Color')
                                    ->helperText('Supporting color'),
                                ColorPicker::make('theme_accent_color')
                                    ->label('Accent Color')
                                    ->helperText('Emphasis and highlights'),
                            ])->columns(3),
                        
                        Section::make('Background Colors')
                            ->schema([
                                ColorPicker::make('theme_background_color')
                                    ->label('Background (Light Mode)'),
                                ColorPicker::make('theme_background_dark_color')
                                    ->label('Background (Dark Mode)'),
                            ])->columns(2),
                        
                        Section::make('Text Colors')
                            ->schema([
                                ColorPicker::make('theme_text_color')
                                    ->label('Primary Text'),
                                ColorPicker::make('theme_text_light_color')
                                    ->label('Secondary Text'),
                            ])->columns(2),
                        
                        Section::make('Status Colors')
                            ->schema([
                                ColorPicker::make('theme_success_color')
                                    ->label('Success'),
                                ColorPicker::make('theme_error_color')
                                    ->label('Error'),
                                ColorPicker::make('theme_warning_color')
                                    ->label('Warning'),
                                ColorPicker::make('theme_info_color')
                                    ->label('Info'),
                            ])->columns(4),
                        
                        Section::make('Style Options')
                            ->schema([
                                Forms\Components\Select::make('theme_border_radius')
                                    ->label('Border Radius')
                                    ->options([
                                        '0' => 'None (Sharp)',
                                        '0.25rem' => 'Small (4px)',
                                        '0.5rem' => 'Medium (8px)',
                                        '0.75rem' => 'Large (12px)',
                                        '1rem' => 'Extra Large (16px)',
                                        '1.5rem' => 'Rounded (24px)',
                                    ])
                                    ->default('0.5rem'),
                                
                                Forms\Components\Select::make('theme_font_family')
                                    ->label('Font Family')
                                    ->options([
                                        'inter' => 'Inter (Modern, Clean)',
                                        'roboto' => 'Roboto (Google Default)',
                                        'poppins' => 'Poppins (Rounded, Friendly)',
                                        'montserrat' => 'Montserrat (Geometric)',
                                        'open-sans' => 'Open Sans (Neutral)',
                                        'lato' => 'Lato (Corporate)',
                                        'raleway' => 'Raleway (Elegant)',
                                        'nunito' => 'Nunito (Soft, Rounded)',
                                        'source-sans' => 'Source Sans Pro (Adobe)',
                                        'work-sans' => 'Work Sans (Technical)',
                                        'playfair' => 'Playfair Display (Serif)',
                                        'merriweather' => 'Merriweather (Serif)',
                                        'system' => 'System Default (Native)',
                                    ])
                                    ->default('inter')
                                    ->searchable(),
                                
                                Toggle::make('theme_dark_mode_enabled')
                                    ->label('Enable Dark Mode')
                                    ->default(true),
                            ])->columns(3),
                    ]),
            ])
            ->columnSpanFull(),
    ]);
}
```

**Test:**
```bash
# Login ke admin panel
# Navigate to Shop Settings
# Check apakah tab "Theme Colors" muncul
# Test color picker dan dropdowns
```

✅ **Commit:**
```bash
git add .
git commit -m "feat: add theme customization UI in Filament admin"
```

---

## 🎯 Continue with remaining phases...

**Lengkap di:** `agent/REBRANDING_IMPLEMENTATION_PLAN.md`

---

## ⚡ Quick Commands Reference

```bash
# Development
composer dev                    # Start dev server + queue + logs + vite
php artisan serve              # Just Laravel server
npm run dev                    # Just Vite

# Database
php artisan migrate            # Run migrations
php artisan migrate:fresh      # Fresh migration (WARNING: data loss!)
php artisan db:seed           # Run seeders
php artisan tinker            # Laravel REPL

# Cache
php artisan cache:clear       # Clear app cache
php artisan config:clear      # Clear config cache
php artisan route:clear       # Clear route cache
php artisan view:clear        # Clear view cache

# Build
npm run build                 # Build for production
php artisan optimize          # Optimize for production

# Git
git status                    # Check status
git add .                     # Stage all
git commit -m "message"       # Commit
git push origin branch-name   # Push
```

---

## 🐛 Troubleshooting

### Migration fails?
```bash
# Check migration status
php artisan migrate:status

# Rollback last migration
php artisan migrate:rollback

# Re-run
php artisan migrate
```

### Filament tidak show changes?
```bash
php artisan filament:upgrade
php artisan cache:clear
php artisan config:clear
```

### Frontend tidak update?
```bash
# Kill Vite
# Ctrl+C atau kill process

# Clear node cache
rm -rf node_modules/.vite

# Restart
npm run dev
```

### Theme tidak apply?
```bash
# Clear cache
php artisan cache:clear

# Check if settings exists
php artisan tinker
>>> App\Models\ShopSetting::getSettings()->getThemeColors()
```

---

## 📚 Resources

- **Full Plan:** `agent/REBRANDING_IMPLEMENTATION_PLAN.md`
- **Font Guide:** `agent/FONT_OPTIONS_REFERENCE.md`
- **Summary:** `agent/REBRANDING_SUMMARY.md`

---

**Ready to code!** 🚀
