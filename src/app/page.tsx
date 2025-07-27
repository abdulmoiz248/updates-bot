'use client'

import { useState } from 'react'

export default function SendUpdatePage() {
  const [project, setProject] = useState('')
  const [progress, setProgress] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setToast('')

    const res = await fetch('/api/send-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project, progress }),
    })

    setLoading(false)

    if (res.ok) {
      setToast('✅ Sent successfully!')
      setProject('')
      setProgress('')
    } else {
      setToast('❌ Failed to send. Check console or try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50 text-gray-900">
      <h1 className="text-2xl font-bold mb-6">Send Daily Update</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">Project Name</label>
          <input
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="e.g. Hygieia"
            className="mt-1 w-full border rounded-md p-2 outline-none focus:ring-2 ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Today’s Progress</label>
          <textarea
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            placeholder="e.g. Fixed login issue, updated API..."
            className="mt-1 w-full border rounded-md p-2 outline-none focus:ring-2 ring-blue-400"
            rows={5}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Update'}
        </button>
      </form>

      {toast && <p className="mt-4 text-center text-sm">{toast}</p>}
    </div>
  )
}
