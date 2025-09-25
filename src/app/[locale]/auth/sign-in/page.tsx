"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail, signUpWithEmail } from "../../auth/actions";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-md w-full py-12 space-y-6">
      <h1 className="text-2xl font-semibold mb-6">邮箱登录</h1>
      <form
        action={async (formData) => {
          const res = await signInWithEmail(formData);
          if (res.ok) {
            router.push("/");
          } else {
            setMessage(res.message || "登录失败");
          }
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label className="block text-sm">邮箱</label>
          <input
            name="email"
            type="email"
            className="w-full border rounded px-3 py-2 bg-transparent"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">密码</label>
          <input
            name="password"
            type="password"
            className="w-full border rounded px-3 py-2 bg-transparent"
            placeholder="至少 8 位"
            minLength={8}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-black text-white py-2 hover:opacity-90"
        >
          登录
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-500">没有账号？注册一个</div>
      <form
        action={async (formData) => {
          const res = await signUpWithEmail(formData);
          if (res.ok) {
            router.push("/");
          } else {
            setMessage(res.message || "注册失败");
          }
        }}
        className="mt-2 space-y-4"
      >
        <div className="space-y-2">
          <label className="block text-sm">邮箱</label>
          <input
            name="email"
            type="email"
            className="w-full border rounded px-3 py-2 bg-transparent"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">密码</label>
          <input
            name="password"
            type="password"
            className="w-full border rounded px-3 py-2 bg-transparent"
            placeholder="至少 8 位"
            minLength={8}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-gray-900 text-white py-2 hover:opacity-90"
        >
          注册
        </button>
      </form>
      {message && (
        <p className="mt-4 text-sm text-red-500" role="alert">
          {message}
        </p>
      )}

      <div className="text-center text-white/60">或使用社交账号一键登录</div>
      <div className="grid grid-cols-1 gap-3">
        <button
          className="glass px-4 py-2 rounded hover:opacity-90"
          onClick={async () => {
            try {
              await authClient.signIn.social({ provider: "google", callbackURL: "/" });
            } catch (e) { /* ignore */ }
          }}
        >
          使用 Google 登录
        </button>
        <button
          className="glass px-4 py-2 rounded hover:opacity-90"
          onClick={async () => {
            try {
              await authClient.signIn.social({ provider: "facebook", callbackURL: "/" });
            } catch (e) { /* ignore */ }
          }}
        >
          使用 Facebook 登录
        </button>
      </div>
    </div>
  );
}
