import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import DatasetUploader from './components/DatasetUploader'
import InsightPanel from './components/InsightPanel'
import ChartBuilder from './components/ChartBuilder'

function App() {
  const [datasets, setDatasets] = useState([])
  const [current, setCurrent] = useState(null)
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const loadDatasets = async () => {
    try {
      const res = await fetch(`${backend}/api/datasets`)
      const data = await res.json()
      setDatasets(data)
      if (!current && data.length) setCurrent(data[0])
    } catch (e) {}
  }

  useEffect(() => { loadDatasets() }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="mb-8">
          <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">Business Analysis, Reimagined</h2>
          <p className="text-zinc-600 mt-1">Upload data, get instant insights and craft clean visualizations. Minimal. Modern. Fast.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DatasetUploader onUploaded={(d)=>{ setCurrent(d); loadDatasets() }} />

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white grid place-items-center text-xs">CSV</div>
                <h3 className="font-semibold text-zinc-900">Datasets</h3>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {datasets.map(ds => (
                  <button key={ds.id} onClick={()=>setCurrent(ds)} className={`px-3 py-1.5 rounded-lg border text-sm transition ${current?.id===ds.id? 'bg-zinc-900 text-white border-zinc-900':'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'}`}>
                    {ds.name}
                  </button>
                ))}
                {datasets.length===0 && <p className="text-sm text-zinc-500">No datasets yet. Upload a CSV to begin.</p>}
              </div>
            </div>

            <ChartBuilder dataset={current} />
          </div>

          <div className="space-y-6">
            <InsightPanel dataset={current} />

            {current && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-zinc-900 mb-3">Preview</h3>
                <div className="overflow-auto border border-zinc-100 rounded-lg">
                  <table className="min-w-full text-sm">
                    <thead className="bg-zinc-50 text-zinc-600">
                      <tr>
                        {current.columns?.map(c => <th key={c.name} className="px-3 py-2 text-left font-medium">{c.name}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {current.sample?.slice(0,10).map((row, i) => (
                        <tr key={i} className="odd:bg-white even:bg-zinc-50">
                          {current.columns?.map(c => <td key={c.name} className="px-3 py-2 text-zinc-800">{String(row[c.name] ?? '')}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-zinc-500 mt-2">Rows in file: ~{current.row_count.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
