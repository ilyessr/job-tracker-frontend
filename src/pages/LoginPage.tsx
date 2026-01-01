import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, type LoginFormValues } from '../api/auth';



export default function LoginPage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>();

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            localStorage.setItem('access_token', data.access_token);
            navigate('/dashboard');
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        loginMutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded shadow w-80"
            >
                <h1 className="text-xl font-bold mb-4 text-center">
                    Login
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 w-full mb-1"
                    {...register('email', {
                        required: 'Email is required',
                    })}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mb-2">
                        {errors.email.message}
                    </p>
                )}

                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 w-full mb-1"
                    {...register('password', {
                        required: 'Password is required',
                    })}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mb-3">
                        {errors.password.message}
                    </p>
                )}

                {loginMutation.isError && (
                    <p className="text-red-500 text-sm mb-2">
                        Invalid email or password
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="bg-blue-600 text-white w-full py-2 rounded disabled:opacity-50"
                >
                    {loginMutation.isPending ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}
