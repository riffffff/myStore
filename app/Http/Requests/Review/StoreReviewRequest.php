<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Public can submit reviews (will be moderated)
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'review' => ['required', 'string', 'min:10', 'max:2000'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'product_id.required' => 'Produk harus dipilih.',
            'product_id.exists' => 'Produk tidak ditemukan.',
            'name.required' => 'Nama harus diisi.',
            'name.min' => 'Nama minimal 2 karakter.',
            'rating.required' => 'Rating harus dipilih.',
            'rating.min' => 'Rating minimal 1 bintang.',
            'rating.max' => 'Rating maksimal 5 bintang.',
            'review.required' => 'Review harus diisi.',
            'review.min' => 'Review minimal 10 karakter.',
            'review.max' => 'Review maksimal 2000 karakter.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Check honeypot field (spam detection)
        if ($this->filled('website')) {
            $this->merge(['is_spam' => true]);
        }
    }

    /**
     * Get validated data without honeypot field.
     */
    public function validated($key = null, $default = null)
    {
        $validated = parent::validated($key, $default);

        // Remove honeypot field from validated data
        unset($validated['website']);

        return $validated;
    }
}
