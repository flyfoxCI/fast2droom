"use client";
import { useEffect, useState } from "react";

export default function VRPage() {
  const [url, setUrl] = useState("");
  const [embed, setEmbed] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("realsee_url");
    if (saved) {
      setUrl(saved);
      setEmbed(saved);
    }
  }, []);

  function handleEmbed() {
    if (!url) return;
    localStorage.setItem("realsee_url", url);
    setEmbed(url);
  }

  return (
    <div className="mx-auto max-w-4xl w-full p-6 space-y-4">
      <h1 className="text-2xl font-semibold">嵌入 RealSee/贝壳 VR 链接</h1>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 bg-transparent"
          placeholder="粘贴 RealSee 分享链接"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="rounded bg-black text-white px-4 py-2" onClick={handleEmbed} disabled={!url}>
          嵌入
        </button>
      </div>

      {embed && (
        <div className="w-full aspect-video border rounded overflow-hidden">
          <iframe src={embed} className="w-full h-full" allow="xr-spatial-tracking; gyroscope; accelerometer" />
        </div>
      )}
    </div>
  );
}

