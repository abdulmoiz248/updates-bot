'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

export default function SendUpdatePage() {
  const [project, setProject] = useState('')
  const [progress, setProgress] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setToast(null)

    const res = await fetch('/api/send-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project, progress }),
    })

    setLoading(false)

    if (res.ok) {
      setToast({ message: 'Sent successfully!', success: true })
      setProject('')
      setProgress('')
    } else {
      setToast({ message: 'Failed to send. Check console or try again.', success: false })
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-white text-gray-900">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight text-blue-700">📤 Send Daily Update</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-5 ring-1 ring-gray-100"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Project Name</label>
          <input
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="e.g. Hygieia"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Today’s Progress</label>
          <textarea
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            placeholder="e.g. Checked all LLM form conditions and exported..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-400 outline-none"
            rows={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg flex justify-center items-center gap-2 transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Sending...
            </>
          ) : (
            'Send Update'
          )}
        </button>
      </form>

      {toast && (
        <div
          className={`mt-6 flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
            toast.success
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {toast.success ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  )
}
