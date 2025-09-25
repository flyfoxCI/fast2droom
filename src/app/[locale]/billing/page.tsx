"use client";
import { useEffect, useState } from "react";

type Kind =
  | { type: "subscription"; plan: "monthly" | "yearly" }
  | { type: "credits"; quantity: number };

async function createCheckout(userId: string, kind: Kind) {
  const res = await fetch("/api/billing/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, kind }),
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as { id: string; url: string };
}

export default function BillingPage() {
  const [uid, setUid] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    // 简单的匿名用户ID占位，未接入 better-auth 前先用
    const saved = localStorage.getItem("uid");
    if (saved) setUid(saved);
    else {
      const v = `guest-${crypto.randomUUID()}`;
      localStorage.setItem("uid", v);
      setUid(v);
    }
  }, []);

  async function go(kind: Kind) {
    setMsg(null);
    try {
      const session = await createCheckout(uid, kind);
      window.location.href = session.url;
    } catch (e: any) {
      setMsg(e?.message || "创建支付失败，请检查 creem 配置");
    }
  }

  return (
    <div className="mx-auto max-w-6xl w-full p-6 space-y-6">
      <h1 className="text-3xl font-semibold">订阅与积分</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass p-6 rounded-xl space-y-2">
          <div className="text-xl font-semibold">月度订阅</div>
          <div className="text-3xl font-bold">¥ 29<span className="text-sm text-white/60"> / 月</span></div>
          <ul className="text-sm text-white/70 list-disc pl-4 space-y-1">
            <li>无限生成（合理使用）</li>
            <li>优先队列</li>
            <li>基础支持</li>
          </ul>
          <button className="btn-primary mt-2" onClick={() => go({ type: "subscription", plan: "monthly" })}>立即订阅</button>
        </div>
        <div className="glass p-6 rounded-xl space-y-2 border-white/20">
          <div className="text-xl font-semibold">年度订阅</div>
          <div className="text-3xl font-bold">¥ 299<span className="text-sm text-white/60"> / 年</span></div>
          <ul className="text-sm text-white/70 list-disc pl-4 space-y-1">
            <li>无限生成（合理使用）</li>
            <li>优先队列</li>
            <li>邮件支持</li>
          </ul>
          <button className="btn-primary mt-2" onClick={() => go({ type: "subscription", plan: "yearly" })}>立即订阅</button>
        </div>
        <div className="glass p-6 rounded-xl space-y-2">
          <div className="text-xl font-semibold">积分包</div>
          <div className="text-3xl font-bold">¥ 9<span className="text-sm text-white/60"> / 100积分</span></div>
          <ul className="text-sm text-white/70 list-disc pl-4 space-y-1">
            <li>灵活按次使用</li>
            <li>适合轻量需求</li>
          </ul>
          <button className="btn-primary mt-2" onClick={() => go({ type: "credits", quantity: 100 })}>购买积分</button>
        </div>
      </div>
      {msg && <div className="text-sm text-red-500">{msg}</div>}
      <div className="text-xs text-white/60">用户ID：{uid}</div>
    </div>
  );
}
