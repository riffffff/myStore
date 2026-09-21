<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCartItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Check if cart item belongs to user
        $cartItem = $this->route('cartItem');

        return $this->user() &&
               $cartItem &&
               (int) $cartItem->cart->user_id === (int) $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'quantity' => ['required', 'integer', 'min:1', 'max:100'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'quantity.required' => 'Jumlah harus diisi.',
            'quantity.min' => 'Jumlah minimal 1.',
            'quantity.max' => 'Jumlah maksimal 100.',
        ];
    }

    /**
     * Get quantity from request.
     */
    public function getQuantity(): int
    {
        return (int) $this->input('quantity');
    }
}
