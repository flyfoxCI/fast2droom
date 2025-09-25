import Link from "next/link";

export default async function HomePage() {
  return (
    <div className="mx-auto max-w-6xl w-full px-4 py-10 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl sm:text-6xl font-semibold leading-[1.1]">
          用 AI 重塑你的室内空间
          <br />
          <span className="bg-clip-text text-transparent" style={{backgroundImage:'linear-gradient(135deg,#7c3aed,#06b6d4)'}}>快速、真实、可落地</span>
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          上传现场照片与参考风格，AI 将在保留空间几何与尺度关系的前提下，生成高质量装修效果图，并支持 VR 场景与专业导出。
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="design" className="btn-primary">立即开始</Link>
          <Link href="dashboard" className="glass px-5 py-2">查看示例</Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid sm:grid-cols-3 gap-4">
        <div className="card glass space-y-2">
          <div className="text-xl font-semibold">真实几何</div>
          <p className="text-sm text-white/70">基于深度/结构约束生成，保持墙体、门窗、家具相对关系与尺度。</p>
        </div>
        <div className="card glass space-y-2">
          <div className="text-xl font-semibold">风格可控</div>
          <p className="text-sm text-white/70">使用参考风格图或风格预设，快速切换侘寂、现代、原木等风格。</p>
        </div>
        <div className="card glass space-y-2">
          <div className="text-xl font-semibold">VR 与导出</div>
          <p className="text-sm text-white/70">支持嵌入贝壳/RealSee 链接预览，可探索专业导出格式对接。</p>
        </div>
      </section>

      {/* How it works */}
      <section className="grid sm:grid-cols-3 gap-4">
        {[
          {t:'上传现场',d:'拍摄或选择现有室内照片'},
          {t:'选择风格',d:'上传参考图或选择风格预设'},
          {t:'生成与预览',d:'查看效果图，进入 VR 探索并导出'}
        ].map((s,i)=> (
          <div key={i} className="glass p-6 rounded-xl">
            <div className="text-sm text-white/60">STEP {i+1}</div>
            <div className="text-lg font-semibold mt-1">{s.t}</div>
            <p className="text-sm text-white/70 mt-1">{s.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
