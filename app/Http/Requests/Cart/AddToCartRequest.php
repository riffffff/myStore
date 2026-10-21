<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class AddToCartRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:100'],
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
            'quantity.min' => 'Jumlah minimal 1.',
            'quantity.max' => 'Jumlah maksimal 100.',
        ];
    }

    /**
     * Get product ID from request.
     */
    public function getProductId(): int
    {
        return (int) $this->input('product_id');
    }

    /**
     * Get quantity from request (default 1).
     */
    public function getQuantity(): int
    {
        return max(1, (int) ($this->input('quantity', 1)));
    }
}
