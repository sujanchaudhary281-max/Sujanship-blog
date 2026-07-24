import React, { useState } from 'react'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import { FiMail, FiMessageSquare, FiSend } from 'react-icons/fi'
import PageLayout from './PageLayout'

const CONTACT_EMAIL = 'sujanchaudhary281@gmail.com'
const WEB3FORMS_ACCESS_KEY = 'a1d21953-d274-4c39-8634-15b3755ffa4f'

const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const FIELD_CLASS =
  'w-full bg-canvas border border-hairline focus:border-hairline-strong rounded-[6px] px-3.5 py-2.5 text-[14px] leading-5 text-ink placeholder:text-mute outline-none transition-colors'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const update = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!isEmail(form.email.trim())) next.email = 'Please enter a valid email address.'
    if (!form.message.trim()) next.message = 'Please enter a message.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async e => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please fix the highlighted fields.')
      return
    }

    setStatus('sending')
    const formData = new FormData()
    formData.append('access_key', WEB3FORMS_ACCESS_KEY)
    formData.append('name', form.name.trim())
    formData.append('email', form.email.trim())
    formData.append('subject', form.subject.trim() || `Message from ${form.name.trim()}`)
    formData.append('message', form.message.trim())

    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        setStatus('sent')
        toast.success('Message sent — thank you! We’ll get back to you soon.')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
        toast.error(data.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      toast.error('Network error. Please try again.')
    }
  }

  return (
    <PageLayout
      eyebrow="Contact"
      title="Contact Us"
      intro="Have a question, feedback, or a topic you'd like us to cover? We'd love to hear from you."
      meta={{
        title: 'Contact Us',
        description: 'Get in touch with sujanship. Send us your questions, feedback, or article suggestions and we will get back to you.',
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-10 md:gap-12">

        {/* Contact details */}
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <span className="w-9 h-9 shrink-0 rounded-[8px] bg-canvas-soft-2 border border-hairline flex items-center justify-center text-ink">
              <FiMail size={16} />
            </span>
            <div>
              <p className="text-[14px] font-medium leading-5 text-ink mb-0.5">Email</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[14px] leading-5 text-link hover:text-link-deep transition-colors break-all">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-9 h-9 shrink-0 rounded-[8px] bg-canvas-soft-2 border border-hairline flex items-center justify-center text-ink">
              <FiMessageSquare size={16} />
            </span>
            <div>
              <p className="text-[14px] font-medium leading-5 text-ink mb-0.5">Response time</p>
              <p className="text-[14px] leading-5 text-body">We typically reply within 1–2 business days.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-[13px] font-medium text-ink mb-1.5">Name</label>
              <input id="name" type="text" value={form.name} onChange={update('name')} placeholder="Your name" className={FIELD_CLASS} />
              {errors.name && <p className="mt-1.5 text-[12px] text-error">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-[13px] font-medium text-ink mb-1.5">Email</label>
              <input id="email" type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" className={FIELD_CLASS} />
              {errors.email && <p className="mt-1.5 text-[12px] text-error">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-[13px] font-medium text-ink mb-1.5">Subject <span className="text-mute font-normal">(optional)</span></label>
            <input id="subject" type="text" value={form.subject} onChange={update('subject')} placeholder="What's this about?" className={FIELD_CLASS} />
          </div>

          <div>
            <label htmlFor="message" className="block text-[13px] font-medium text-ink mb-1.5">Message</label>
            <textarea id="message" rows={5} value={form.message} onChange={update('message')} placeholder="Write your message…" className={`${FIELD_CLASS} resize-y`} />
            {errors.message && <p className="mt-1.5 text-[12px] text-error">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-[6px] bg-ink text-on-primary text-[14px] font-medium hover:bg-ink/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FiSend size={14} /> {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>

      <ToastContainer position="top-center" autoClose={2500} theme="light" transition={Bounce} />
    </PageLayout>
  )
}
