export const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3 MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Validasi ukuran dan format file gambar.
 * Mengembalikan string pesan error berbahasa Indonesia jika tidak valid, atau null jika valid.
 */
export function validateImageFile(file: File): string | null {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return 'Format file harus berupa JPG, PNG, atau WebP.';
    }

    if (file.size > MAX_IMAGE_BYTES) {
        return `Ukuran file terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maksimal 3 MB per file.`;
    }

    return null;
}

/**
 * Validasi beberapa file gambar sekaligus.
 * Mengembalikan array file yang valid dan pesan error pertama (jika ada file yang ditolak).
 */
export function validateImageFiles(files: FileList | File[]): { valid: File[]; error: string | null } {
    const valid: File[] = [];
    let firstError: string | null = null;

    Array.from(files).forEach((file) => {
        const error = validateImageFile(file);
        if (error) {
            if (!firstError) {
                firstError = error;
            }
        } else {
            valid.push(file);
        }
    });

    return { valid, error: firstError };
}
