import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "@/lib/auth/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AgentHub - AI Agent Marketplace",
  description: "Discover, deploy, and monetize AI agents built on Vercel AI Cloud",
  keywords: ["AI", "agents", "automation", "productivity", "marketplace"],
  authors: [{ name: "JoeProAI" }],
  openGraph: {
    title: "AgentHub - AI Agent Marketplace",
    description: "Discover, deploy, and monetize AI agents",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
