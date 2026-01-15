import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login, type LoginFormValues } from "../api/auth";
import { clearAccessToken, getAccessToken, setAccessToken } from "../lib/auth";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function LoginPage() {
  const navigate = useNavigate();
  const { data: currentUser, isError: isUserError } = useCurrentUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const { mutate, isPending, isError: isLoginError } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAccessToken(data.access_token);
      navigate("/dashboard");
    },
  });

  const emailField = register("email", {
    required: "Email is required",
  });

  const passwordField = register("password", {
    required: "Password is required",
  });

  useEffect(() => {
    const token = getAccessToken();
    if (token && currentUser) {
      navigate("/dashboard");
    }
    if (isUserError) {
      clearAccessToken();
    }
  }, [currentUser, isUserError, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f4ef] px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Job Tracker
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Welcome back
          </h1>
        <p className="mt-2 text-sm text-slate-500">
          Track every application, every step, every win.
        </p>
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Heads up: The server may take a few seconds to start if it hasn’t been used recently. Please wait before logging in.
        </p>
      </div>

        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Email
          </label>
          <input
            type="email"

            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            {...emailField}
          />
          {errors.email && (
            <p className="mt-2 text-xs text-red-500">{errors.email.message}</p>
          )}

          <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Password
          </label>
          <input
            type="password"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            {...passwordField}
          />
          {errors.password && (
            <p className="mt-2 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}

          {isLoginError && (
            <p className="mt-4 text-sm text-red-500">
              Invalid email or password.
            </p>
          )}

        <button
          type="submit"
          disabled={isPending}
          className="btn btn-rect btn-lg btn-primary btn-block mt-8"
        >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
