import React from 'react'
import { Link } from 'react-router-dom'
import PageLayout from './PageLayout'
import { Section, BulletList, UpdatedStamp } from './LegalSection'

export default function Terms() {
  return (
    <PageLayout
      eyebrow="Legal"
      title="Terms & Conditions"
      intro="The terms that govern your use of the sujanship website and its content."
      meta={{
        title: 'Terms & Conditions',
        description: 'Review the Terms & Conditions for using sujanship, including acceptable use, intellectual property rights, and limitations of liability.',
      }}
    >
      <UpdatedStamp date="July 17, 2026" />

      <Section title="Acceptance of terms">
        <p>
          By accessing and using sujanship (the "website"), you agree to be bound by these Terms &
          Conditions and all applicable laws and regulations. If you do not agree with any part of these
          terms, please discontinue use of the website.
        </p>
      </Section>

      <Section title="Use of the website">
        <p>You agree to use this website only for lawful purposes and in a way that does not infringe the rights of others. Specifically, you agree not to:</p>
        <BulletList
          items={[
            'Use the site in any manner that could disable, overburden, or impair its operation.',
            'Attempt to gain unauthorised access to any part of the website, its servers, or connected systems.',
            'Reproduce, duplicate, or resell any part of the website without our express written permission.',
            'Use any automated system to extract content in a way that places unreasonable load on our infrastructure.',
          ]}
        />
      </Section>

      <Section title="Intellectual property">
        <p>
          All content published on this website — including articles, text, graphics, logos, and code
          samples — is the property of sujanship unless otherwise stated, and is protected by applicable
          copyright and intellectual property laws. You may read and share links to our content freely,
          but you may not republish it as your own without attribution and permission.
        </p>
      </Section>

      <Section title="User-submitted content">
        <p>
          If you submit content to us, such as messages through the contact form, you grant us the right
          to use that content for the purpose of responding to and communicating with you. You are
          responsible for ensuring that any content you submit is accurate and does not violate the
          rights of any third party.
        </p>
      </Section>

      <Section title="Third-party links">
        <p>
          Our website may contain links to third-party websites and services that are not owned or
          controlled by us. We are not responsible for the content, privacy policies, or practices of
          any third-party sites, and you access them at your own risk.
        </p>
      </Section>

      <Section title="Limitation of liability">
        <p>
          The website and its content are provided on an "as is" and "as available" basis. To the
          fullest extent permitted by law, sujanship shall not be liable for any direct, indirect,
          incidental, or consequential damages arising from your use of, or inability to use, the
          website.
        </p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          We reserve the right to modify these Terms & Conditions at any time. Changes take effect as
          soon as they are posted on this page. Your continued use of the website after any changes
          constitutes acceptance of the revised terms.
        </p>
      </Section>

      <Section title="Contact us">
        <p>
          If you have any questions about these Terms & Conditions, please reach us through our{' '}
          <Link to="/contact" className="text-link hover:text-link-deep transition-colors">contact page</Link>.
        </p>
      </Section>
    </PageLayout>
  )
}
