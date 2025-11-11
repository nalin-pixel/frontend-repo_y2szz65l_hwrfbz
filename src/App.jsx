import React, { useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { Brain, Smile, NotebookPen, Sparkles, BarChart3, PlayCircle, MessageCircle, Home } from 'lucide-react'

const moods = [
  { key: 'joy', label: 'Joy', emoji: '😊', color: 'from-blue-200 to-blue-100', score: 5 },
  { key: 'calm', label: 'Calm', emoji: '😌', color: 'from-indigo-200 to-indigo-100', score: 4 },
  { key: 'ok', label: 'Okay', emoji: '🙂', color: 'from-violet-200 to-violet-100', score: 3 },
  { key: 'anxious', label: 'Anxious', emoji: '😟', color: 'from-amber-100 to-orange-100', score: 2 },
  { key: 'sad', label: 'Sad', emoji: '😔', color: 'from-rose-100 to-pink-100', score: 1 },
]

const prompts = [
  'What emotion stands out to you right now?',
  'What gave you energy today?',
  'What do you want to let go of?',
  'A small win I’m proud of:',
]

function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm transition shadow-sm border ${
        active
          ? 'bg-white/80 border-white/70 text-gray-800'
          : 'bg-white/60 hover:bg-white/80 border-white/60 text-gray-600'
      }`}
    >
      {children}
    </button>
  )
}

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/60 ${className}`}>
      {children}
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState('onboarding')
  const [goals, setGoals] = useState(['Reduce stress'])
  const [note, setNote] = useState('')
  const [selectedMood, setSelectedMood] = useState(null)
  const [logs, setLogs] = useState([])
  const [journal, setJournal] = useState('')
  const [entries, setEntries] = useState([])
  const latestMood = logs[0]?.mood || null

  const pastelBg = 'bg-gradient-to-br from-blue-50 via-indigo-50 to-rose-50'

  const handleSaveMood = () => {
    if (!selectedMood) return
    const newLog = {
      id: crypto.randomUUID(),
      mood: selectedMood,
      note: note.trim() || undefined,
      score: moods.find(m => m.key === selectedMood)?.score || 3,
      at: new Date().toISOString(),
    }
    setLogs(prev => [newLog, ...prev])
    setNote('')
    setSelectedMood(null)
  }

  const handleSaveEntry = () => {
    if (!journal.trim()) return
    const entry = { id: crypto.randomUUID(), body: journal.trim(), at: new Date().toISOString() }
    setEntries(prev => [entry, ...prev])
    setJournal('')
  }

  const trend = useMemo(() => {
    const last7 = [...logs].slice(0, 7).reverse()
    if (last7.length === 0) return [3,3,3,3]
    return last7.map(l => l.score)
  }, [logs])

  return (
    <div className={`min-h-screen ${pastelBg} relative text-gray-800`}>
      {/* Ambient pastel glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full blur-3xl opacity-50"
             style={{background:'radial-gradient(circle at 30% 30%, rgba(186,230,253,.8), rgba(199,210,254,.35), rgba(254,215,170,.2))'}} />
        <div className="absolute -bottom-24 right-0 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-40"
             style={{background:'radial-gradient(circle at 70% 60%, rgba(199,210,254,.8), rgba(186,230,253,.4), rgba(254,215,170,.2))'}} />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white/70 backdrop-blur border border-white/60 flex items-center justify-center shadow-sm">
            <Brain size={18} className="text-indigo-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Mindful</p>
            <p className="font-semibold">Calm Companion</p>
          </div>
        </div>
        <nav className="hidden sm:flex gap-2">
          <Chip active={screen==='onboarding'} onClick={()=>setScreen('onboarding')}>Home</Chip>
          <Chip active={screen==='mood'} onClick={()=>setScreen('mood')}>Mood</Chip>
          <Chip active={screen==='suggestions'} onClick={()=>setScreen('suggestions')}>Suggestions</Chip>
          <Chip active={screen==='journal'} onClick={()=>setScreen('journal')}>Journal</Chip>
          <Chip active={screen==='insights'} onClick={()=>setScreen('insights')}>Insights</Chip>
        </nav>
      </header>

      {/* Content */}
      <main className="relative z-10 px-6 pb-28 -mt-2">
        {screen === 'onboarding' && (
          <section>
            <div className="grid lg:grid-cols-2 gap-6 items-center">
              <Card className="overflow-hidden">
                <div className="h-[360px] sm:h-[420px] relative">
                  <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
                  <div className="absolute inset-0 pointer-events-none" />
                </div>
                <div className="p-6">
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Welcome to your calm space</h1>
                  <p className="mt-2 text-gray-600">Track your emotions, journal your thoughts, and receive gentle AI suggestions to support your mental wellness.</p>
                </div>
              </Card>

              <div className="space-y-4">
                <Card className="p-5">
                  <p className="text-sm text-gray-600 mb-3">Choose your goals</p>
                  <div className="flex flex-wrap gap-2">
                    {['Reduce stress','Build a habit','Sleep better','Be more mindful','Improve focus'].map(g => (
                      <Chip
                        key={g}
                        active={goals.includes(g)}
                        onClick={()=> setGoals(prev => prev.includes(g) ? prev.filter(x=>x!==g) : [...prev, g])}
                      >{g}</Chip>
                    ))}
                  </div>
                </Card>

                <Card className="p-5 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Ready to begin?</p>
                    <p className="text-sm text-gray-600">A few seconds each day makes a difference.</p>
                  </div>
                  <button
                    onClick={()=>setScreen('mood')}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-400 to-blue-400 text-white px-4 py-2 shadow hover:from-indigo-500 hover:to-blue-500 transition"
                  >
                    <PlayCircle size={18} /> Start
                  </button>
                </Card>
              </div>
            </div>
          </section>
        )}

        {screen === 'mood' && (
          <section className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-5 md:col-span-2">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Smile className="text-indigo-500" size={18}/> How are you feeling?</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {moods.map(m => (
                    <button
                      key={m.key}
                      onClick={()=>setSelectedMood(m.key)}
                      className={`group rounded-2xl p-4 text-left bg-gradient-to-b ${m.color} border border-white/70 shadow-sm hover:shadow transition ${selectedMood===m.key ? 'ring-2 ring-indigo-300' : ''}`}
                    >
                      <div className="text-3xl">{m.emoji}</div>
                      <div className="mt-2 font-medium">{m.label}</div>
                    </button>
                  ))}
                </div>

                <div className="mt-5">
                  <label className="text-sm text-gray-600">Add a note (optional)</label>
                  <textarea
                    value={note}
                    onChange={e=>setNote(e.target.value)}
                    placeholder="Write a few words about your mood..."
                    className="mt-2 w-full rounded-xl border border-white/70 bg-white/70 backdrop-blur p-3 outline-none focus:ring-2 focus:ring-indigo-300 min-h-[100px]"
                  />
                  <div className="mt-3 flex items-center gap-3">
                    <button onClick={handleSaveMood} className="rounded-full px-4 py-2 bg-indigo-500 text-white shadow hover:bg-indigo-600 transition">Save mood</button>
                    {selectedMood && <span className="text-sm text-gray-600">Selected: {moods.find(m=>m.key===selectedMood)?.label}</span>}
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Sparkles className="text-indigo-500" size={18}/> Quick suggestion</h3>
                <p className="text-sm text-gray-600 mb-3">Based on your latest mood</p>
                <SuggestionBlock latestMood={latestMood} />
              </Card>
            </div>

            <Card className="p-5 mt-6">
              <h3 className="font-semibold mb-4">Recent moods</h3>
              {logs.length === 0 ? (
                <p className="text-sm text-gray-600">No logs yet. Your last 7 moods will appear here.</p>
              ) : (
                <ul className="space-y-3">
                  {logs.map(l => (
                    <li key={l.id} className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{moods.find(m=>m.key===l.mood)?.emoji}</span>
                        <div>
                          <p className="font-medium">{moods.find(m=>m.key===l.mood)?.label}</p>
                          {l.note && <p className="text-sm text-gray-600">{l.note}</p>}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(l.at).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </section>
        )}

        {screen === 'suggestions' && (
          <section className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6">
              <SuggestionCard title="Breathing" subtitle="2-minute box breathing" color="from-indigo-300 to-blue-300" />
              <SuggestionCard title="Meditation" subtitle="5-minute body scan" color="from-blue-300 to-indigo-300" />
              <SuggestionCard title="Affirmations" subtitle="3 gentle reminders" color="from-violet-300 to-indigo-300" />
              <SuggestionCard title="Stretch" subtitle="Neck & shoulder release" color="from-peach-200 to-rose-200" customGradient="linear-gradient(135deg, #ffd1b5, #ffe3d2, #e9d5ff)" />
            </div>

            <Card className="p-5 mt-6">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-indigo-500/90 text-white flex items-center justify-center"><MessageCircle size={18}/></div>
                <div>
                  <p className="font-medium">Gentle AI</p>
                  <p className="text-sm text-gray-600">“I noticed your recent moods. Would you like a 3-minute guided breathing to reset?”</p>
                </div>
              </div>
            </Card>
          </section>
        )}

        {screen === 'journal' && (
          <section className="max-w-3xl mx-auto">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-2"><NotebookPen className="text-indigo-500" size={18}/> <h2 className="font-semibold">Journal</h2></div>
              <p className="text-sm text-gray-600">Prompt: {prompts[entries.length % prompts.length]}</p>
              <textarea
                value={journal}
                onChange={e=>setJournal(e.target.value)}
                placeholder="Write freely..."
                className="mt-3 w-full rounded-xl border border-white/70 bg-white/70 backdrop-blur p-3 outline-none focus:ring-2 focus:ring-indigo-300 min-h-[180px]"
              />
              <div className="mt-3 flex gap-3">
                <button onClick={handleSaveEntry} className="rounded-full px-4 py-2 bg-indigo-500 text-white shadow hover:bg-indigo-600 transition">Save</button>
                <button onClick={()=>setJournal('')} className="rounded-full px-4 py-2 bg-white border border-gray-200 shadow-sm hover:bg-gray-50">Clear</button>
              </div>
            </Card>

            <Card className="p-5 mt-6">
              <h3 className="font-semibold mb-3">Entries</h3>
              {entries.length === 0 ? (
                <p className="text-sm text-gray-600">No entries yet. Your saved notes will appear here.</p>
              ) : (
                <ul className="space-y-3">
                  {entries.map(e => (
                    <li key={e.id} className="p-3 rounded-xl bg-white/70 border border-white/70">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">{new Date(e.at).toLocaleString()}</span>
                      </div>
                      <p className="whitespace-pre-wrap text-gray-700">{e.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </section>
        )}

        {screen === 'insights' && (
          <section className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-5 md:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2"><BarChart3 className="text-indigo-500" size={18}/> Mood trend</h3>
                  <span className="text-xs text-gray-500">Last {trend.length} logs</span>
                </div>
                <TrendChart values={trend} />
              </Card>

              <Card className="p-5">
                <h3 className="font-semibold mb-2">Streak</h3>
                <p className="text-4xl font-semibold">{Math.min(logs.length, 7)}<span className="text-base font-normal text-gray-500"> days</span></p>
                <p className="text-sm text-gray-600 mt-1">Keep going! Tiny steps count.</p>
                <div className="mt-3 flex gap-2">
                  {Array.from({length:7}).map((_,i)=> (
                    <div key={i} className={`h-8 w-8 rounded-lg ${i < logs.length ? 'bg-indigo-400' : 'bg-gray-200/80'} border border-white/70`}></div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-5 mt-6">
              <h3 className="font-semibold mb-2">Achievements</h3>
              <div className="flex flex-wrap gap-3">
                <Badge>First Log</Badge>
                {logs.length >= 3 && <Badge>3-Day Check-in</Badge>}
                {entries.length >= 1 && <Badge>First Journal</Badge>}
                {logs.find(l=>l.mood==='calm') && <Badge>Found Calm</Badge>}
              </div>
            </Card>
          </section>
        )}
      </main>

      {/* Bottom nav (mobile) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div className="rounded-full bg-white/80 backdrop-blur border border-white/60 shadow-lg px-2 py-1 flex items-center gap-1">
          <NavBtn icon={<Home size={18}/>} active={screen==='onboarding'} onClick={()=>setScreen('onboarding')} label="Home" />
          <NavBtn icon={<Smile size={18}/>} active={screen==='mood'} onClick={()=>setScreen('mood')} label="Mood" />
          <NavBtn icon={<Sparkles size={18}/>} active={screen==='suggestions'} onClick={()=>setScreen('suggestions')} label="Suggestions" />
          <NavBtn icon={<NotebookPen size={18}/>} active={screen==='journal'} onClick={()=>setScreen('journal')} label="Journal" />
          <NavBtn icon={<BarChart3 size={18}/>} active={screen==='insights'} onClick={()=>setScreen('insights')} label="Insights" />
        </div>
      </div>
    </div>
  )
}

function SuggestionBlock({ latestMood }) {
  let title = 'Take a mindful breath'
  let detail = 'Inhale 4s, hold 4s, exhale 4s. Repeat 4 times.'
  if (latestMood === 'anxious') {
    title = 'Grounding 5-4-3-2-1'
    detail = 'Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.'
  } else if (latestMood === 'sad') {
    title = 'Self-kindness note'
    detail = 'Write a gentle message to yourself like you would to a close friend.'
  } else if (latestMood === 'joy') {
    title = 'Savor the moment'
    detail = 'Close your eyes and relive a joyful moment for 30 seconds.'
  }
  return (
    <div className="rounded-xl p-4 bg-gradient-to-br from-indigo-200/70 to-blue-200/70 border border-white/70">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-gray-700 mt-1">{detail}</p>
    </div>
  )
}

function SuggestionCard({ title, subtitle, color, customGradient }) {
  const gradientStyle = customGradient ? { background: customGradient } : {}
  return (
    <div className={`rounded-2xl p-5 text-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/60 bg-gradient-to-br ${color || ''}`} style={gradientStyle}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-gray-700">{subtitle}</p>
        </div>
        <button className="rounded-full bg-white/70 backdrop-blur px-3 py-1.5 text-sm border border-white/70 hover:bg-white/90 transition">Start</button>
      </div>
    </div>
  )
}

function TrendChart({ values }) {
  const width = 560
  const height = 160
  const padding = 16
  const max = 5
  const min = 1
  const stepX = (width - padding * 2) / Math.max(1, values.length - 1)
  const toY = v => {
    const t = (v - min) / (max - min)
    return height - padding - t * (height - padding * 2)
  }
  const points = values.map((v, i) => `${padding + i * stepX},${toY(v)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
      <defs>
        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="url(#grad)"
        strokeWidth="3"
        points={points}
      />
      {values.map((v,i)=> (
        <circle key={i} cx={padding + i * stepX} cy={toY(v)} r="4" fill="#6366f1" />
      ))}
    </svg>
  )
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 border border-white/70 px-3 py-1 text-sm shadow-sm">
      <Sparkles size={14} className="text-indigo-500"/>
      {children}
    </span>
  )
}

function NavBtn({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`px-3 py-2 rounded-full flex items-center gap-2 text-sm transition ${active ? 'bg-indigo-500 text-white shadow' : 'hover:bg-gray-100 text-gray-700'}`}>
      <span className="hidden sm:inline">{label}</span>
      {icon}
    </button>
  )
}
