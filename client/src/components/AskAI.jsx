import React, { useState, useEffect, useRef } from 'react'
import { FiSend } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import ReactMarkdown from 'react-markdown'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import { askAI } from '../api/ai'

const SUGGESTIONS = [
  'What is the MERN stack and how does it work?',
  'How does Generative AI differ from traditional ML?',
  'What are best practices for building REST APIs with Node.js?',
]

export default function AskAI() {
  const [text, setText]           = useState('')
  const [messages, setMessages]   = useState([])
  const [thinking, setThinking]   = useState(false)
  const scrollRef                 = useRef(null)
  const lastUserRef               = useRef(null)
  const spacerRef                 = useRef(null)

  // ChatGPT/Gemini-style scrolling: when a new question is asked, pin that
  // question to the top of the panel so the answer reads downward from there,
  // instead of scrolling to the bottom of the reply. A trailing spacer reserves
  // just enough room below so the question can always reach the top.
  useEffect(() => {
    const el = scrollRef.current
    const q = lastUserRef.current
    const spacer = spacerRef.current
    if (!el || messages.length === 0 || !q) return

    const PAD_TOP = 24 // matches the panel's p-6 top padding
    // Reset the spacer, then measure how much content sits below the question.
    if (spacer) spacer.style.minHeight = '0px'
    const belowQuestion = el.scrollHeight - q.offsetTop
    const needed = Math.max(0, el.clientHeight - belowQuestion - PAD_TOP)
    if (spacer) spacer.style.minHeight = needed + 'px'

    // Align the question's top with the top of the visible panel.
    el.scrollTop = q.offsetTop - PAD_TOP
  }, [messages, thinking])

  // Index of the most recent user message (user turns are the even indices).
  const lastUserIndex = messages.length % 2 === 1 ? messages.length - 1 : messages.length - 2

  const send = async (input) => {
    setMessages(p => [...p, input])
    setText('')
    setThinking(true)
    try {
      const { data } = await askAI(input)
      setMessages(p => [...p, data?.reply ?? 'No response — please try again.'])
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Something went wrong — please try again.'
      setMessages(p => [...p, msg])
    }
    setThinking(false)
  }

  return (
    <div className="flex-1 bg-canvas-soft flex flex-col" style={{ minHeight: 'calc(100vh - 4rem)', padding: '32px 24px' }}>
      <div className="max-w-[768px] w-full mx-auto">

        {/* Header — left-aligned */}
        <div className="mb-8 anim-fade-up">
          <p className="font-mono text-[12px] leading-4 text-mute uppercase tracking-[0.14em] mb-3">AI Assistant</p>
          <h1 className="text-[30px] font-semibold leading-[1.1] text-ink mb-2" style={{ letterSpacing: '-1.2px' }}>Ask AI</h1>
          <p className="text-[15px] leading-6 text-body">Ask about MERN Stack, Generative AI, or web development in general.</p>
        </div>

        {/* card: canvas bg, shadow-level-4, 12px radius */}
        <div className="rounded-[12px] bg-canvas shadow-level-4 flex flex-col overflow-hidden anim-fade-up anim-delay-1" style={{ height: '65vh' }}>

          {/* nav-cta-ask-ai style header */}
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-hairline">
            <div className="w-7 h-7 rounded-[6px] bg-ink flex items-center justify-center text-on-primary">
              <HiSparkles size={13} />
            </div>
            <div>
              <p className="text-[14px] font-medium leading-5 text-ink">sujanship AI</p>
              <p className="font-mono text-[12px] leading-4 text-mute flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#50e3c2] inline-block" /> Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="relative flex-1 overflow-y-auto p-6 space-y-4 bg-canvas-soft">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                <div className="w-12 h-12 rounded-[8px] bg-canvas border border-hairline flex items-center justify-center shadow-level-1">
                  <HiSparkles size={20} className="text-mute" />
                </div>
                <div>
                  <p className="text-[16px] font-medium text-ink mb-1">Start a conversation.</p>
                  <p className="text-[14px] leading-5 text-body">Ask anything about React, Node.js, MongoDB, or AI.</p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-[24rem] mt-2">
                  {SUGGESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => !thinking && send(q)}
                      className="text-[14px] leading-5 text-left text-body px-4 py-3 rounded-[6px] bg-canvas border border-hairline hover:border-hairline-strong transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isUser = i % 2 === 0
                return (
                  <div key={i} ref={i === lastUserIndex ? lastUserRef : null} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-[8px] px-4 py-3 text-[14px] leading-5 ${
                      isUser
                        ? 'bg-ink text-on-primary'
                        : 'bg-canvas border border-hairline text-body blog-content shadow-level-1'
                    }`}>
                      <ReactMarkdown>{msg}</ReactMarkdown>
                    </div>
                  </div>
                )
              })
            )}
            {thinking && (
              <div className="flex justify-start">
                <div className="rounded-[8px] px-4 py-3 bg-canvas border border-hairline text-[14px] leading-5 text-mute flex items-center gap-2 shadow-level-1">
                  <span className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-mute dot-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-mute dot-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-mute dot-bounce" />
                  </span>
                  Thinking…
                </div>
              </div>
            )}
            {/* Reserves room so the latest question can scroll to the top. */}
            {messages.length > 0 && <div ref={spacerRef} aria-hidden="true" />}
          </div>

          {/* form-input: canvas bg, hairline border, 6px radius, 40px height */}
          <div className="p-4 border-t border-hairline bg-canvas flex gap-3 items-end">
            <textarea
              className="flex-1 bg-canvas border border-hairline focus:border-hairline-strong rounded-[6px] px-3 py-2.5 text-[14px] leading-5 text-ink placeholder:text-mute resize-none outline-none transition-colors"
              style={{ minHeight: '40px', maxHeight: '120px' }}
              rows={1}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (text.trim()) send(text.trim()) } }}
              onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }}
              placeholder="Ask me something…"
            />
            <ToastContainer position="top-center" autoClose={2000} theme="light" transition={Bounce} />
            <button
              onClick={() => text.trim() ? send(text.trim()) : toast.error('Enter a message first.')}
              disabled={thinking}
              className="h-10 w-10 flex items-center justify-center rounded-[6px] bg-ink text-on-primary hover:bg-ink/90 transition-colors disabled:opacity-50 shrink-0"
            >
              <FiSend size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
