"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function DesignPage() {
  const [prompt, setPrompt] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [ref, setRef] = useState<File | null>(null);
  const [refPreview, setRefPreview] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [uid, setUid] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [mode, setMode] = useState<'single'|'multi'>("single");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  // 与 billing 页面保持一致，匿名ID占位（未接鉴权时可用）
  const search = useSearchParams();

  React.useEffect(() => {
    const saved = localStorage.getItem("uid");
    if (saved) setUid(saved);
    else {
      const v = `guest-${crypto.randomUUID()}`;
      localStorage.setItem("uid", v);
      setUid(v);
    }
    const qp = search?.get('prompt');
    if (qp) setPrompt(qp);
  }, []);

  async function submit() {
    setStatus("提交中...");
    setImages([]);
    const fd = new FormData();
    fd.set("prompt", prompt);
    if (mode === 'multi') {
      const first = photos[0];
      if (first) fd.set('photo', first);
    } else {
      if (photo) fd.set('photo', photo);
    }
    if (ref) fd.set("ref", ref);
    const photoUrl = (document.getElementById('photoUrl') as HTMLInputElement | null)?.value || '';
    const refUrl = (document.getElementById('refUrl') as HTMLInputElement | null)?.value || '';
    if (photoUrl) fd.set('photoUrl', photoUrl);
    if (refUrl) fd.set('refUrl', refUrl);
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

  const presets = [
    '原木北欧风：奶油色墙面+浅木地板+织物沙发+暖色灯光',
    '现代极简：白灰配色+大面积留白+线性灯+金属点缀',
    '日式侘寂：米白墙面+原木格栅+亚麻织物+自然光',
  ];

  return (
    <div className="mx-auto max-w-6xl w-full p-6 space-y-8">
      <h1 className="text-3xl font-semibold">生成装修效果图（MVP）</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        {/* 左侧：上传与预览 */}
        <div className="space-y-4">
          <div className="flex gap-3">
            {(['single','multi'] as const).map(t => (
              <button key={t} onClick={()=>setMode(t)} className={`glass px-3 py-1 rounded ${mode===t?'border-white/40':''}`}>{t==='single'?'单张图片':'多张图片'}</button>
            ))}
          </div>
          <div className="glass p-4 rounded-xl space-y-2">
            <div className="text-sm">现场照片（必选）</div>
            <div
              className={`dropzone ${dragOver ? 'dragover' : ''}`}
              onDragOver={(e)=>{e.preventDefault(); setDragOver(true);}}
              onDragLeave={()=>setDragOver(false)}
              onDrop={(e)=>{
                e.preventDefault(); setDragOver(false);
                const list = Array.from(e.dataTransfer.files || []);
                if (mode==='multi') {
                  const next = list.slice(0,6);
                  setPhotos(next);
                  setPhotoPreviews(next.map(f=>URL.createObjectURL(f)));
                } else {
                  const f = list[0];
                  if (f) { setPhoto(f); setPhotoPreview(URL.createObjectURL(f)); }
                }
              }}
              onPaste={(e)=>{
                const list = Array.from(e.clipboardData.files || []);
                if (mode==='multi') {
                  const next = list.slice(0,6);
                  setPhotos(next);
                  setPhotoPreviews(next.map(f=>URL.createObjectURL(f)));
                } else {
                  const item = list[0];
                  if (item) { setPhoto(item); setPhotoPreview(URL.createObjectURL(item)); }
                }
              }}
            >
              <div className="text-white/80">拖放/粘贴图片到此处</div>
              <div className="text-xs text-white/50 mt-1">或点击下方按钮选择图片</div>
            </div>
            {mode==='multi' ? (
              <input type="file" accept="image/*" multiple onChange={(e) => {
                const list = Array.from(e.target.files || []);
                setPhotos(list.slice(0,6));
                setPhotoPreviews(list.slice(0,6).map(f=>URL.createObjectURL(f)));
              }} />
            ) : (
              <input type="file" accept="image/*" onChange={(e) => {
                const f = e.target.files?.[0] || null; setPhoto(f);
                setPhotoPreview(f ? URL.createObjectURL(f) : null);
              }} />
            )}
            <div className="text-xs text-white/50">或远程图片 URL（适合 OpenRouter/Gemini 拉取）</div>
            <input id="photoUrl" name="photoUrl" placeholder="https://example.com/room.jpg" className="w-full border rounded px-3 py-2 bg-transparent"/>
            {mode==='multi' ? (
              <div className="grid grid-cols-3 gap-2">
                {photoPreviews.map((p,i)=>(<img key={i} src={p} className="rounded border"/>))}
              </div>
            ) : (
              photoPreview && <img src={photoPreview} alt="preview" className="rounded border" />
            )}
          </div>
          <div className="glass p-4 rounded-xl space-y-2">
            <div className="text-sm">参考风格图（可选）</div>
            <input type="file" accept="image/*" onChange={(e) => {
              const f = e.target.files?.[0] || null; setRef(f);
              setRefPreview(f ? URL.createObjectURL(f) : null);
            }} />
            <div className="text-xs text-white/50">或远程参考 URL</div>
            <input id="refUrl" name="refUrl" placeholder="https://example.com/style.jpg" className="w-full border rounded px-3 py-2 bg-transparent"/>
            {refPreview && <img src={refPreview} alt="ref" className="rounded border" />}
            <div className="text-xs text-white/60 mt-2">没有参考？试试这些：</div>
            <div className="flex gap-2 mt-1">
              {[
                'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600&auto=format',
                'https://images.unsplash.com/photo-1505692794403-34d4982f88aa?q=80&w=600&auto=format',
                'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=600&auto=format',
                'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=600&auto=format'
              ].map((u,i)=> (
                <img key={i} src={u} alt={`style-${i}`} className="w-12 h-12 rounded border cursor-pointer hover:opacity-80" onClick={()=>{
                  (document.getElementById('refUrl') as HTMLInputElement).value = u;
                  setRefPreview(u);
                }}/>
              ))}
            </div>
          </div>
        </div>
        {/* 右侧：参数与提交 */}
        <div className="space-y-4">
          <div className="glass p-4 rounded-xl space-y-2">
            <div className="text-sm">需求描述 / 风格提示</div>
            <textarea
              className="w-full border rounded p-2 bg-transparent"
              rows={6}
              placeholder="例如：原木北欧风，奶油色墙面，保留原有采光布局，沙发换成灰色织物..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {presets.map((p, i) => (
                <button key={i} className="glass px-3 py-1 rounded-full text-xs hover:opacity-90" onClick={() => setPrompt(p)}>{p}</button>
              ))}
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={submit}
            disabled={!photo || !prompt}
          >
            提交生成
          </button>
          {jobId && <div className="text-sm text-white/60">任务ID：{jobId}</div>}
          {status && <div className="text-sm">{status}</div>}
        </div>
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
