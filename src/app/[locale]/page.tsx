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

      {/* Brand strip */}
      <section className="grid grid-cols-3 sm:grid-cols-6 gap-4 items-center opacity-70">
        {['室内云','光合空间','ArchiLab','渲染社','OptiBuild','LoftWorks'].map((b,i)=> (
          <div key={i} className="text-center text-sm glass py-2 rounded">{b}</div>
        ))}
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

      {/* Inspired Gallery */}
      <section className="space-y-4">
        <div className="text-2xl font-semibold">灵感画廊</div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {t:'原木北欧客厅',p:'原木北欧风：奶油色墙面+浅木地板+织物沙发+暖色灯光'},
            {t:'现代极简卧室',p:'现代极简：白灰配色+大面积留白+线性灯+金属点缀'},
            {t:'日式侘寂餐厅',p:'日式侘寂：米白墙面+原木格栅+亚麻织物+自然光'},
            {t:'质感灰工业风',p:'工业风：水泥灰+黑色金属+暖光源+皮革家具'},
            {t:'法式复古风',p:'法式复古：线条墙板+复古绿+铜色灯具+花纹织物'},
            {t:'地中海清新',p:'地中海：白蓝配色+拱形门+马赛克+原木家具'},
          ].map((g,i)=> (
            <a key={i} href={`design?prompt=${encodeURIComponent(g.p)}`} className="group block glass p-6 rounded-xl h-36 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent group-hover:from-white/10"/>
              <div className="absolute right-4 bottom-4 text-sm opacity-80">点击生成</div>
              <div className="text-lg font-semibold">{g.t}</div>
              <div className="text-xs text-white/70 mt-1 line-clamp-2">{g.p}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-4">
        <div className="text-2xl font-semibold">用户评价</div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {n:'王女士 · 业主',c:'三天内定了风格与主色，和设计师沟通效率高很多。'},
            {n:'刘工 · 设计师',c:'几分钟就能出两三版方案，保留结构，不担心“跑偏”。'},
            {n:'陈先生 · 房产经纪',c:'配合 VR 链接效果演示，成交率确实提升。'},
          ].map((t,i)=> (
            <div key={i} className="glass p-6 rounded-xl space-y-2">
              <div className="text-sm text-white/60">{t.n}</div>
              <div className="text-base">“{t.c}”</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing 预览（首页放置） */}
      <section className="space-y-4">
        <div className="text-2xl font-semibold">定价方案</div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="glass p-6 rounded-xl space-y-2">
            <div className="text-xl font-semibold">月度订阅</div>
            <div className="text-3xl font-bold">¥ 29<span className="text-sm text-white/60"> / 月</span></div>
            <ul className="text-sm text-white/70 list-disc pl-4 space-y-1">
              <li>无限生成（合理使用）</li>
              <li>优先队列</li>
              <li>基础支持</li>
            </ul>
            <a href="billing" className="btn-primary mt-2 inline-block">立即订阅</a>
          </div>
          <div className="glass p-6 rounded-xl space-y-2 border-white/20">
            <div className="text-xl font-semibold">年度订阅</div>
            <div className="text-3xl font-bold">¥ 299<span className="text-sm text-white/60"> / 年</span></div>
            <ul className="text-sm text-white/70 list-disc pl-4 space-y-1">
              <li>无限生成（合理使用）</li>
              <li>优先队列</li>
              <li>邮件支持</li>
            </ul>
            <a href="billing" className="btn-primary mt-2 inline-block">立即订阅</a>
          </div>
          <div className="glass p-6 rounded-xl space-y-2">
            <div className="text-xl font-semibold">积分包</div>
            <div className="text-3xl font-bold">¥ 9<span className="text-sm text-white/60"> / 100积分</span></div>
            <ul className="text-sm text白/70 list-disc pl-4 space-y-1">
              <li>灵活按次使用</li>
              <li>适合轻量需求</li>
            </ul>
            <a href="billing" className="btn-primary mt-2 inline-block">购买积分</a>
          </div>
        </div>
      </section>
    </div>
  );
}
