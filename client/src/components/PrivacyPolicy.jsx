import React from 'react'
import { Link } from 'react-router-dom'
import PageLayout from './PageLayout'
import { Section, BulletList, UpdatedStamp } from './LegalSection'

export default function PrivacyPolicy() {
  return (
    <PageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      intro="How sujanship collects, uses, and protects your information when you visit our website."
      meta={{
        title: 'Privacy Policy',
        description: 'Read the sujanship Privacy Policy to understand what data we collect, how we use it, and the choices you have regarding your personal information.',
      }}
    >
      <UpdatedStamp date="July 17, 2026" />

      <Section title="Introduction">
        <p>
          This Privacy Policy explains how sujanship ("we", "us", or "our") collects, uses, and
          safeguards information when you visit our website. We are committed to protecting your privacy
          and handling any data we collect responsibly and transparently. By using this website, you
          consent to the practices described in this policy.
        </p>
      </Section>

      <Section title="Information we collect">
        <p>We aim to collect as little personal information as possible. Depending on how you interact with the site, this may include:</p>
        <BulletList
          items={[
            'Information you provide voluntarily, such as your name, email address, and message when you contact us through a form.',
            'Usage data collected automatically, such as your browser type, device information, pages visited, and time spent on the site.',
            'Cookies and similar technologies used to remember preferences and understand how the site is used.',
          ]}
        />
      </Section>

      <Section title="How we use your information">
        <p>Any information we collect is used only for legitimate purposes, including to:</p>
        <BulletList
          items={[
            'Respond to your enquiries and provide the information or support you request.',
            'Improve the content, performance, and usability of our website.',
            'Monitor and analyse traffic trends to better understand our audience.',
            'Maintain the security and integrity of our services.',
          ]}
        />
      </Section>

      <Section title="Cookies">
        <p>
          Our website may use cookies — small text files stored on your device — to enhance your
          browsing experience and gather anonymous analytics. You can control or disable cookies
          through your browser settings. Please note that disabling cookies may affect certain features
          of the site.
        </p>
      </Section>

      <Section title="Third-party services">
        <p>
          We may use trusted third-party services, such as analytics providers and AI features, that
          process limited data on our behalf. These providers are only permitted to use your
          information as necessary to deliver their services and are required to keep it secure. We do
          not sell your personal information to anyone.
        </p>
      </Section>

      <Section title="Data security">
        <p>
          We take reasonable technical and organisational measures to protect your information against
          unauthorised access, alteration, disclosure, or destruction. However, no method of
          transmission over the internet is completely secure, and we cannot guarantee absolute
          security.
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          You have the right to access, correct, or request deletion of the personal information we
          hold about you. To exercise any of these rights, please reach out to us through our{' '}
          <Link to="/contact" className="text-link hover:text-link-deep transition-colors">contact page</Link>.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or
          for legal reasons. Any updates will be posted on this page with a revised "last updated" date.
          We encourage you to review this policy periodically.
        </p>
      </Section>
    </PageLayout>
  )
}
