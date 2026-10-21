<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name'    => ['required', 'string', 'max:255'],
            'customer_address' => ['required', 'string', 'max:1000'],
            'customer_phone'   => ['required', 'string', 'max:20'],
            'payment_method'   => ['required', 'in:cod,qris'],
            'payment_proof'    => [
                $this->input('payment_method') === 'qris' ? 'required' : 'nullable',
                'file',
                'image',
                'mimes:jpeg,png,jpg,webp',
                'max:5120', // 5MB
            ],
            'notes'            => ['nullable', 'string', 'max:1000'],
            'items'            => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity'   => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_name.required'    => 'Nama penerima wajib diisi.',
            'customer_address.required' => 'Alamat pengiriman wajib diisi.',
            'customer_phone.required'   => 'Nomor HP / WhatsApp wajib diisi.',
            'payment_method.required'   => 'Pilih metode pembayaran (COD atau QRIS).',
            'payment_method.in'         => 'Metode pembayaran tidak valid.',
            'payment_proof.required'    => 'Bukti transfer QRIS wajib diunggah.',
            'payment_proof.image'       => 'Bukti pembayaran harus berupa gambar (JPG, PNG, WebP).',
            'payment_proof.max'         => 'Ukuran bukti pembayaran maksimal 5MB.',
            'items.required'            => 'Pilih minimal satu produk untuk dipesan.',
            'items.min'                 => 'Pilih minimal satu produk untuk dipesan.',
            'items.*.product_id.exists' => 'Produk yang dipilih tidak ditemukan.',
            'items.*.quantity.min'      => 'Jumlah produk minimal 1.',
        ];
    }
}
