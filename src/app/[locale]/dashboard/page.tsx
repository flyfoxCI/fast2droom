import { db } from "@/db";
import { job } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function DashboardPage() {
  const rows = await db.select().from(job).orderBy(desc(job.createdAt)).limit(20);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">最近任务</h1>
      <div className="grid grid-cols-1 gap-4">
        {rows.map((r) => {
          const input = r.input ? JSON.parse(r.input) : {};
          const output = r.output ? JSON.parse(r.output) : {};
          return (
            <div key={r.id} className="border rounded p-4">
              <div className="text-sm text-gray-500">{r.id}</div>
              <div className="text-sm">状态：{r.status}</div>
              {r.error && <div className="text-sm text-red-500">错误：{r.error}</div>}
              {output.images?.length ? (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {output.images.map((src: string, i: number) => (
                    <img key={i} src={src} className="rounded border" />
                  ))}
                </div>
              ) : null}
              <div className="text-xs text-gray-500 mt-2 truncate">prompt: {input.prompt}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

