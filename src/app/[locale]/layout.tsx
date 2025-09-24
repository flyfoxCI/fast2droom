import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Link from "next/link";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Room Helper",
  description: "室内设计助手（MVP）",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <header className={cn("sticky top-0 z-10 border-b bg-background/70 backdrop-blur")}> 
            <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-4">
              <Link href={`/${locale}`} className="font-semibold">AI Room Helper</Link>
              <div className="flex-1" />
              <Link href={`/${locale}/design`} className="text-sm hover:underline">生成</Link>
              <Link href={`/${locale}/viewer`} className="text-sm hover:underline">3D</Link>
              <Link href={`/${locale}/vr`} className="text-sm hover:underline">VR</Link>
              <Link href={`/${locale}/billing`} className="text-sm hover:underline">订阅</Link>
              <Link href={`/${locale}/dashboard`} className="text-sm hover:underline">仪表盘</Link>
              <Link href={`/${locale}/auth/sign-in`} className="text-sm hover:underline">登录</Link>
            </nav>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
