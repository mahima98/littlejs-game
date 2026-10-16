import { useEffect, useRef } from 'react'
import { startGame } from './walk'

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => startGame(root.current!), [])
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">The Walk</h1>
      <div ref={root} className="relative w-[800px] h-[450px] rounded-xl overflow-hidden shadow-2xl" />
    </main>
  )
}
