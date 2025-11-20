import { Menu, LineChart, Sparkles } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/70 border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white grid place-items-center shadow-sm">
            <LineChart size={18} />
          </div>
          <div>
            <p className="text-sm text-zinc-500 leading-none">AI Analyst</p>
            <h1 className="text-lg font-semibold text-zinc-900">Nova BI</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 text-zinc-600">
          <Sparkles size={18} className="opacity-70" />
          <span className="text-sm">AI enabled</span>
        </div>
      </div>
    </header>
  )
}
