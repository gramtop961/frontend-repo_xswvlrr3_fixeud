import { useState } from 'react'
import { motion } from 'framer-motion'
import { UploadCloud, FileSpreadsheet, Loader2 } from 'lucide-react'

export default function DatasetUploader({ onUploaded }) {
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleUpload = async (file) => {
    setError('')
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', file.name)

      const res = await fetch(`${backend}/api/datasets`, {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      onUploaded?.(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    handleUpload(file)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`group relative rounded-2xl border ${dragOver ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 bg-white'} p-8 shadow-sm`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-zinc-900 text-white grid place-items-center">
          {loading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
        </div>
        <div className="flex-1">
          <p className="font-medium text-zinc-900">Upload a CSV to get started</p>
          <p className="text-sm text-zinc-500">Drag & drop or click to browse. We infer columns automatically.</p>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
        <label className="inline-flex items-center px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm cursor-pointer hover:bg-zinc-800 transition">
          <input type="file" accept=".csv" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0])} />
          <FileSpreadsheet size={16} className="mr-2" /> Choose file
        </label>
      </div>
    </motion.div>
  )
}
