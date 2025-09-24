"use server";
// 中文注释：登录相关的 Server Actions
import { auth } from "@/lib/auth";

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) {
    return { ok: false, message: "请输入邮箱与密码" };
  }
  try {
    await auth.api.signInEmail({
      body: { email, password },
    });
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e?.message || "登录失败" };
  }
}

export async function signUpWithEmail(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) {
    return { ok: false, message: "请输入邮箱与密码" };
  }
  try {
    const name = email.split("@")[0] || "user";
    await auth.api.signUpEmail({
      body: { name, email, password },
    });
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e?.message || "注册失败" };
  }
}
