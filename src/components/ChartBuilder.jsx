import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, PieChart, LineChart, ScatterChart } from 'lucide-react'

function number(val) {
  if (val === null || val === undefined || val === '') return null
  const n = Number(val)
  return isNaN(n) ? null : n
}

function computeSeries(rows, xKey, yKey, agg) {
  if (!xKey) return []
  const groups = new Map()
  for (const r of rows) {
    const k = r[xKey]
    const yVal = yKey ? number(r[yKey]) : 1
    const g = groups.get(k) || []
    g.push(yVal)
    groups.set(k, g)
  }
  const result = []
  for (const [k, arr] of groups) {
    const nums = arr.filter(v => v !== null)
    let v = 0
    switch (agg) {
      case 'sum': v = nums.reduce((a, b) => a + b, 0); break
      case 'avg': v = nums.length ? nums.reduce((a,b)=>a+b,0)/nums.length : 0; break
      case 'count': v = arr.length; break
      case 'min': v = nums.length ? Math.min(...nums) : 0; break
      case 'max': v = nums.length ? Math.max(...nums) : 0; break
      default: v = arr.length
    }
    result.push({ name: String(k), value: v })
  }
  result.sort((a,b)=>a.name.localeCompare(b.name))
  return result
}

function Bars({ data }) {
  const max = Math.max(1, ...data.map(d => d.value || 0))
  return (
    <div className="flex items-end gap-2 h-56 w-full">
      {data.map((d, i) => (
        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(d.value/max)*100}%` }} transition={{ duration: 0.5, delay: i*0.03 }} className="flex-1 bg-zinc-900/80 rounded-t-md">
          <div className="text-[10px] text-zinc-600 text-center mt-1">{d.name}</div>
        </motion.div>
      ))}
    </div>
  )
}

function Line({ data }) {
  // Minimal sparkline-like line using divs
  const max = Math.max(1, ...data.map(d => d.value || 0))
  return (
    <div className="flex items-end gap-1 h-56 w-full">
      {data.map((d, i) => (
        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(d.value/max)*100}%` }} transition={{ duration: 0.4, delay: i*0.02 }} className="w-1.5 bg-zinc-900 rounded-full" />
      ))}
    </div>
  )
}

function Pie({ data }) {
  const total = data.reduce((a,b)=>a+(b.value||0),0)
  return (
    <div className="grid grid-cols-2 gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{backgroundColor: `hsl(${(i*47)%360} 6% 20%)`}} />
          <div className="text-sm text-zinc-700">{d.name}</div>
          <div className="ml-auto text-sm text-zinc-900">{total? Math.round((d.value/total)*100):0}%</div>
        </div>
      ))}
    </div>
  )
}

export default function ChartBuilder({ dataset }) {
  const [chartType, setChartType] = useState('bar')
  const [x, setX] = useState('')
  const [y, setY] = useState('')
  const [agg, setAgg] = useState('count')

  const rows = dataset?.sample || []
  const columns = dataset?.columns || []

  useEffect(() => {
    setX(columns[0]?.name || '')
    setY(columns.find(c => c.type !== 'string')?.name || '')
  }, [dataset?.id])

  const data = useMemo(() => computeSeries(rows, x, y, agg), [rows, x, y, agg])

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-zinc-900">
          {chartType === 'bar' && <BarChart3 size={18} />}
          {chartType === 'line' && <LineChart size={18} />}
          {chartType === 'pie' && <PieChart size={18} />}
          {chartType === 'scatter' && <ScatterChart size={18} />}
          <h3 className="font-semibold">Chart Builder</h3>
        </div>

        <div className="flex items-center gap-2">
          <select value={chartType} onChange={(e)=>setChartType(e.target.value)} className="px-2 py-1.5 rounded-lg border border-zinc-200 text-sm">
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>
          <select value={x} onChange={(e)=>setX(e.target.value)} className="px-2 py-1.5 rounded-lg border border-zinc-200 text-sm">
            {columns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
          <select value={y} onChange={(e)=>setY(e.target.value)} className="px-2 py-1.5 rounded-lg border border-zinc-200 text-sm">
            <option value="">(none)</option>
            {columns.filter(c => c.type !== 'string').map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
          <select value={agg} onChange={(e)=>setAgg(e.target.value)} className="px-2 py-1.5 rounded-lg border border-zinc-200 text-sm">
            <option value="count">count</option>
            <option value="sum">sum</option>
            <option value="avg">avg</option>
            <option value="min">min</option>
            <option value="max">max</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        {!dataset ? (
          <p className="text-sm text-zinc-500">Upload a dataset to design charts.</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-zinc-500">No data available for the selected fields.</p>
        ) : chartType === 'bar' ? (
          <Bars data={data} />
        ) : chartType === 'line' ? (
          <Line data={data} />
        ) : (
          <Pie data={data} />
        )}
      </div>
    </div>
  )
}
