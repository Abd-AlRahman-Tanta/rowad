import { Head, router, usePage } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";

const Login = () => {
  const { locale } = usePage().props;
  const [error, setError] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();

    const form = e.currentTarget;
    const button = form.querySelector("button[type='submit']");

    const email = form.email.value;
    const password = form.password.value;

    button.disabled = true;
    button.innerHTML = `
      <span class="flex items-center justify-center gap-2">
        <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ${locale === "ar" ? "جاري تسجيل الدخول..." : "Logging in..."}
      </span>
    `;

    setError("");

    try {
      const res = await axios.post("/login", { email, password });

      if (res.data) {
        router.reload();
        router.visit("/dashboard");
      }
    } catch {
      setError(
        locale === "ar"
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
          : "Invalid email or password"
      );
    } finally {
      button.disabled = false;
      button.innerHTML =
        locale === "ar" ? "تسجيل الدخول" : "Login";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Head title="login" />

      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">
          {locale === "ar" ? "تسجيل الدخول" : "Login"}
        </h1>

        <input
          name="email"
          type="email"
          placeholder={locale === "ar" ? "البريد الإلكتروني" : "Email"}
          className="w-full border rounded-lg px-4 py-2"
          required
        />

        <input
          name="password"
          type="password"
          placeholder={locale === "ar" ? "كلمة المرور" : "Password"}
          className="w-full border rounded-lg px-4 py-2 "
          required
        />

        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
        >
          {locale === "ar" ? "تسجيل الدخول" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;