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
    <div className="mx-auto max-w-xl w-full p-6 space-y-4">
      <h1 className="text-2xl font-semibold">订阅与积分</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button className="rounded bg-black text-white px-4 py-2" onClick={() => go({ type: "subscription", plan: "monthly" })}>
          月度订阅
        </button>
        <button className="rounded bg-black text-white px-4 py-2" onClick={() => go({ type: "subscription", plan: "yearly" })}>
          年度订阅
        </button>
        <button className="rounded bg-black text-white px-4 py-2" onClick={() => go({ type: "credits", quantity: 100 })}>
          购买 100 积分
        </button>
      </div>
      {msg && <div className="text-sm text-red-500">{msg}</div>}
      <div className="text-xs text-gray-500">用户ID：{uid}</div>
    </div>
  );
}

