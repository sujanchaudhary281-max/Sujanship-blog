import React from 'react'
import { Link } from 'react-router-dom'
import PageLayout from './PageLayout'
import { Section, BulletList, UpdatedStamp } from './LegalSection'

export default function Disclaimer() {
  return (
    <PageLayout
      eyebrow="Legal"
      title="Disclaimer"
      intro="Important information about the accuracy, use, and limitations of the content published on sujanship."
      meta={{
        title: 'Disclaimer',
        description: 'Read the sujanship disclaimer covering the accuracy of our content, external links, AI-generated responses, and professional advice limitations.',
      }}
    >
      <UpdatedStamp date="July 17, 2026" />

      <Section title="General information">
        <p>
          The information provided on sujanship is for general informational and educational purposes
          only. While we make every effort to keep our content accurate and up to date, we make no
          representations or warranties of any kind, express or implied, about the completeness,
          accuracy, reliability, or suitability of the information for any purpose.
        </p>
      </Section>

      <Section title="No professional advice">
        <p>
          The content on this website, including tutorials and code samples, does not constitute
          professional advice. Technologies change quickly, and what works in one context may not be
          appropriate for another. You should independently verify any information and, where necessary,
          consult a qualified professional before acting on it.
        </p>
      </Section>

      <Section title="Use at your own risk">
        <p>Any reliance you place on the material found on this website is strictly at your own risk. In particular:</p>
        <BulletList
          items={[
            'Code samples and technical guidance are provided as examples and may require adaptation for your specific environment.',
            'We are not liable for any loss or damage, including data loss or system issues, arising from the use of information on this site.',
            'You are responsible for testing and validating any solution before deploying it to production.',
          ]}
        />
      </Section>

      <Section title="AI-generated content">
        <p>
          Some features of this website, such as the AI assistant, generate responses automatically
          using artificial intelligence. These responses may occasionally be inaccurate, incomplete, or
          outdated. AI-generated content should be treated as a starting point and independently
          verified before you rely on it.
        </p>
      </Section>

      <Section title="External links">
        <p>
          This website may contain links to external sites that are not maintained by us. We have no
          control over the nature, content, and availability of those sites, and the inclusion of any
          links does not imply a recommendation or endorsement of the views expressed within them.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          If you have any questions about this disclaimer, please contact us through our{' '}
          <Link to="/contact" className="text-link hover:text-link-deep transition-colors">contact page</Link>.
        </p>
      </Section>
    </PageLayout>
  )
}
