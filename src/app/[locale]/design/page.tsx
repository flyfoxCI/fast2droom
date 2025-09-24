"use client";
import React, { useState } from "react";

export default function DesignPage() {
  const [prompt, setPrompt] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [ref, setRef] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [uid, setUid] = useState("");

  // 与 billing 页面保持一致，匿名ID占位（未接鉴权时可用）
  React.useEffect(() => {
    const saved = localStorage.getItem("uid");
    if (saved) setUid(saved);
    else {
      const v = `guest-${crypto.randomUUID()}`;
      localStorage.setItem("uid", v);
      setUid(v);
    }
  }, []);

  async function submit() {
    setStatus("提交中...");
    setImages([]);
    const fd = new FormData();
    fd.set("prompt", prompt);
    if (photo) fd.set("photo", photo);
    if (ref) fd.set("ref", ref);
    fd.set("userId", uid);
    const res = await fetch("/api/jobs/generate", { method: "POST", body: fd });
    const data = await res.json();
    setJobId(data.id);
    setStatus("生成中...");

    const timer = setInterval(async () => {
      const q = await fetch(`/api/jobs/generate?id=${data.id}`);
      const job = await q.json();
      if (job.status === "succeeded") {
        clearInterval(timer);
        const out = job.output ? JSON.parse(job.output) : {};
        setImages(out.images || []);
        setStatus("已完成");
      } else if (job.status === "failed") {
        clearInterval(timer);
        setStatus(`失败：${job.error || "unknown"}`);
      }
    }, 2000);
  }

  return (
    <div className="mx-auto max-w-2xl w-full p-6 space-y-6">
      <h1 className="text-2xl font-semibold">生成装修效果图（MVP）</h1>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm">现场照片（必选）</label>
          <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">参考风格图（可选）</label>
          <input type="file" accept="image/*" onChange={(e) => setRef(e.target.files?.[0] || null)} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">需求描述 / 风格提示</label>
          <textarea
            className="w-full border rounded p-2 bg-transparent"
            rows={4}
            placeholder="例如：原木北欧风，奶油色墙面，保留原有采光布局，沙发换成灰色织物..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <button
          className="rounded bg-black text-white px-4 py-2 hover:opacity-90"
          onClick={submit}
          disabled={!photo || !prompt}
        >
          提交生成
        </button>
      </div>

      {jobId && <div className="text-sm text-gray-500">任务ID：{jobId}</div>}
      {status && <div className="text-sm">{status}</div>}

      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {images.map((src: string, i: number) => (
            <img key={i} src={src} alt={`result-${i}`} className="w-full h-auto rounded border" />
          ))}
        </div>
      )}
    </div>
  );
}
