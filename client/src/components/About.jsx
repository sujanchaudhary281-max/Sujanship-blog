import React from 'react'
import { Link } from 'react-router-dom'
import PageLayout from './PageLayout'
import { Section, BulletList } from './LegalSection'

export default function About() {
  return (
    <PageLayout
      eyebrow="About"
      title="About sujanship"
      intro="A developer-focused publication covering the MERN stack, Generative AI, and the craft of building for the modern web."
      meta={{
        title: 'About Us',
        description: 'Learn about sujanship — in-depth, practical writing on the MERN stack, Generative AI, and modern web development, written for builders.',
      }}
    >
      <Section title="Who we are">
        <p>
          sujanship is an independent technology blog created and maintained by Sujan. It began as a
          personal notebook for documenting real problems encountered while shipping full-stack
          applications, and has grown into a resource read by developers who want practical, no-fluff
          explanations they can apply the same day.
        </p>
        <p>
          Every article is written from hands-on experience. Instead of surface-level summaries, we
          focus on the decisions, trade-offs, and edge cases that actually matter when you are building
          software that has to run in production.
        </p>
      </Section>

      <Section title="What we write about">
        <BulletList
          items={[
            'MERN stack development — MongoDB, Express, React, and Node.js, from fundamentals to production patterns.',
            'Generative AI — integrating large language models, prompt design, and building AI-assisted product features.',
            'Modern web engineering — performance, architecture, developer experience, and clean, maintainable code.',
          ]}
        />
      </Section>

      <Section title="Our mission">
        <p>
          Our goal is simple: help developers build better software, faster. We believe technical
          writing should respect the reader's time — clear, accurate, and grounded in working code
          rather than hype. If an article saves you an afternoon of debugging, it has done its job.
        </p>
      </Section>

      <Section title="Get in touch">
        <p>
          Have a question, a correction, or a topic you would like us to cover? We would love to hear
          from you. Visit our{' '}
          <Link to="/contact" className="text-link hover:text-link-deep transition-colors">contact page</Link>{' '}
          to reach out, or explore the latest articles on the{' '}
          <Link to="/" className="text-link hover:text-link-deep transition-colors">home page</Link>.
        </p>
      </Section>
    </PageLayout>
  )
}
