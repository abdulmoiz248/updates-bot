"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Loader2, CheckCircle2, XCircle, Send, Calendar, Briefcase, User } from "lucide-react"
import Image from "next/image"

export default function SendUpdatePage() {
  const [name, setName] = useState("Abdul Moiz")
  const [project, setProject] = useState("")
  const [progress, setProgress] = useState("")
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null)


  useEffect(()=>{
    const naam=localStorage.getItem('name') 
    if(naam) setName(naam)
  },[])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setToast(null)

    const res = await fetch("/api/send-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, project, progress }),
    })

    setLoading(false)

    if (res.ok) {
      setToast({ message: "Update sent successfully!", success: true })
      localStorage.setItem("name",name)
     setName(name)
      setProject("")
      setProgress("")
      setTimeout(() => setToast(null), 3000)
    } else {
      setToast({ message: "Failed to send update. Please try again.", success: false })
      setTimeout(() => setToast(null), 5000)
    }
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl shadow-xl overflow-hidden">
              <Image src={"/logo.png"} alt="Logo" width={100} height={100} className="object-contain" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Daily Updates</h1>
          </div>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            {today}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6 transition-all duration-300 hover:shadow-3xl"
        >
          <div className="space-y-2 text-black">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="w-4 h-4 text-purple-500" />
              Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="space-y-2 text-black">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Briefcase className="w-4 h-4 text-blue-500" />
              Project Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="e.g. Hygieia, Dashboard Redesign..."
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2 text-black">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Today&apos;s Progress
            </label>
            <div className="relative">
              <textarea
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                placeholder="Share what you accomplished today, challenges faced, and next steps..."
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 resize-none"
                rows={6}
                required
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">{progress.length} characters</div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !progress.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl flex justify-center items-center gap-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Sending Update...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Daily Update
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

        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">Keep your team updated with your daily progress</p>
        </div>
      </div>
    </div>
  )
}
