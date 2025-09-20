"use client"

import type React from "react"
import { useState } from "react"
import { Loader2, CheckCircle2, XCircle, Send, Mail, User, KeyRound, Github } from "lucide-react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [githubUsername, setGithubUsername] = useState("")
  const [githubToken, setGithubToken] = useState("")
  const [geminiKey, setGeminiKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setToast(null)

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, githubUsername, githubToken, geminiKey }),
    })

    setLoading(false)

    if (res.ok) {
      setToast({ message: "Registration successful!", success: true })
      setEmail("")
      setName("")
      setGithubUsername("")
      setGithubToken("")
      setGeminiKey("")
      setTimeout(() => setToast(null), 3000)
    } else {
      setToast({ message: "Failed to register. Try again.", success: false })
      setTimeout(() => setToast(null), 5000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Register</h1>
          <p className="text-gray-600">Enter your details to get started</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6 transition-all duration-300 hover:shadow-3xl"
        >
          <div className="space-y-2 text-black">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Mail className="w-4 h-4 text-blue-500" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2 text-black">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="w-4 h-4 text-purple-500" />
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2 text-black">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Github className="w-4 h-4 text-black" />
              GitHub Username
            </label>
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="Enter your GitHub username"
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2 text-black">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Github className="w-4 h-4 text-black" />
              GitHub Access Token
            </label>
            <input
              type="text"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="Paste your GitHub token"
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2 text-black">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <KeyRound className="w-4 h-4 text-green-500" />
              Gemini API Key
            </label>
            <input
              type="text"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Paste your Gemini API key"
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl flex justify-center items-center gap-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Registering...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Register
              </>
            )}
          </button>
        </form>

        {toast && (
          <div
            className={`mt-6 flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-medium shadow-lg border backdrop-blur-sm transition-all duration-300 transform animate-in slide-in-from-bottom-2 ${
              toast.success
                ? "bg-green-50/90 text-green-800 border-green-200"
                : "bg-red-50/90 text-red-800 border-red-200"
            }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                toast.success ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {toast.success ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
