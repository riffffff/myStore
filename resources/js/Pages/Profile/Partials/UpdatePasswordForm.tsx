import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-6">
                <div className="space-y-1.5">
                    <InputLabel
                        htmlFor="current_password"
                        value="Kata Sandi Saat Ini"
                        className="ml-1 text-[13px] font-bold text-gray-600"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="block w-full"
                        autoComplete="current-password"
                        placeholder="••••••••"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-1 ml-1"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <InputLabel
                            htmlFor="password"
                            value="Kata Sandi Baru"
                            className="ml-1 text-[13px] font-bold text-gray-600"
                        />

                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className="block w-full"
                            autoComplete="new-password"
                            placeholder="Minimal 8 karakter"
                        />

                        <InputError message={errors.password} className="mt-1 ml-1" />
                    </div>

                    <div className="space-y-1.5">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Konfirmasi Kata Sandi"
                            className="ml-1 text-[13px] font-bold text-gray-600"
                        />

                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            type="password"
                            className="block w-full"
                            autoComplete="new-password"
                            placeholder="Ulangi kata sandi baru"
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-1 ml-1"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
