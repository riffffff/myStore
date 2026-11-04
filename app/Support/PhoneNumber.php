<?php

namespace App\Support;

final class PhoneNumber
{
    /**
     * Kembalikan format 628xxxxxxxxx, atau null jika input kosong.
     */
    public static function normalize(?string $raw): ?string
    {
        $digits = preg_replace('/\D+/', '', (string) $raw);
        if ($digits === '') {
            return null;
        }

        if (str_starts_with($digits, '0')) {
            $digits = '62' . substr($digits, 1);
        } elseif (str_starts_with($digits, '8')) {
            $digits = '62' . $digits;
        }

        return $digits;
    }

    /**
     * Regex validasi setelah dinormalisasi: 628 + 7–11 digit.
     */
    public const REGEX = '/^628\d{7,11}$/';
}
