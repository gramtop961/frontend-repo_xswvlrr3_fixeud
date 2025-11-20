import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'

export default function InsightPanel({ dataset }) {
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    setInsight(null)
    setError('')
  }, [dataset?.id])

  const generate = async () => {
    if (!dataset?.id) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${backend}/api/insights/${dataset.id}`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to generate insights')
      const data = await res.json()
      setInsight(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-zinc-900">
          <Sparkles size={18} />
          <h3 className="font-semibold">AI Insights</h3>
        </div>
        <button
          onClick={generate}
          disabled={!dataset || loading}
          className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-sm hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? <span className="inline-flex items-center gap-2"><Loader2 className="animate-spin" size={14}/> Generating</span> : 'Generate'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!dataset ? (
          <motion.p key="empty" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-sm text-zinc-500">Upload a dataset to enable insights.</motion.p>
        ) : error ? (
          <motion.p key="err" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-sm text-red-600">{error}</motion.p>
        ) : insight ? (
          <motion.div key="ins" initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-6}} className="space-y-3">
            <p className="text-sm text-zinc-600">{insight.summary}</p>
            <ul className="space-y-2">
              {insight.details?.map((d, i) => (
                <li key={i} className="text-sm text-zinc-800 leading-relaxed">• {d}</li>
              ))}
            </ul>
          </motion.div>
        ) : (
          <motion.p key="hint" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-sm text-zinc-500">Click Generate to get quick findings from your data sample.</motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
