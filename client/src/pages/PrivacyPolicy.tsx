// AirFiltersDirect — Privacy Policy Page
// Design: Clean white page with glassmorphism header, consistent with site palette

import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';

export default function PrivacyPolicy() {
  const { totalItems } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onCartOpen={() => {}} onShopClick={() => {}} />

      {/* Hero bar */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 pt-28 pb-12">
        <div className="container">
          <Link href="/">
            <a className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 text-sm mb-4 transition-colors" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </a>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
            Privacy Policy
          </h1>
          <p className="text-slate-400 mt-2 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Last updated: June 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 container py-16 max-w-3xl mx-auto">
        <div className="prose prose-slate max-w-none" style={{ fontFamily: 'DM Sans, sans-serif' }}>

          <Section title="1. Introduction">
            <p>
              AirFiltersDirect ("we," "us," or "our") is a Canadian direct-to-consumer furnace filter company. We are committed to protecting the personal information you share with us when placing an order through our website at <strong>airfiltersdirect.ca</strong>. This Privacy Policy explains what information we collect, how we use it, and your rights with respect to that information.
            </p>
            <p>
              By submitting an order through our website, you consent to the practices described in this policy.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>When you place an order, we collect the following personal information:</p>
            <ul>
              <li><strong>Full Name</strong> — to address your order and communicate with you</li>
              <li><strong>Email Address</strong> — to send your order confirmation and follow up regarding delivery</li>
              <li><strong>Phone Number</strong> — to coordinate delivery scheduling</li>
              <li><strong>Home Address</strong> — to deliver your order to the correct location</li>
              <li><strong>Payment Method Preference</strong> — e-transfer or credit card/cash at door (we do not collect or store credit card numbers)</li>
              <li><strong>HVAC System Brand</strong> (optional) — to help us confirm product compatibility before delivery</li>
            </ul>
            <p>
              We do not collect payment card numbers, banking credentials, or any sensitive financial information. E-transfer payments are processed independently through your own banking application.
            </p>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use the information you provide solely for the following purposes:</p>
            <ul>
              <li>Processing and fulfilling your order</li>
              <li>Contacting you to arrange delivery date and time</li>
              <li>Sending you an order confirmation email</li>
              <li>Responding to any questions or concerns you raise about your order</li>
            </ul>
            <p>
              We do not use your information for marketing purposes, and we do not send unsolicited promotional emails. We do not build customer profiles or use your data for any automated decision-making.
            </p>
          </Section>

          <Section title="4. How We Store Your Information">
            <p>
              Order details submitted through our website are transmitted to us via email using SMTP2GO, a secure email delivery service. We store order information in our internal email inbox and do not maintain a separate customer database accessible from the internet.
            </p>
            <p>
              Your browser temporarily stores cart and session data in your browser's local storage. This data is cleared when you close your browser session and is never transmitted to any third party.
            </p>
          </Section>

          <Section title="5. Sharing of Information">
            <p>
              We do not sell, rent, trade, or otherwise share your personal information with third parties, except in the following limited circumstances:
            </p>
            <ul>
              <li><strong>Service Providers:</strong> We use SMTP2GO to transmit order confirmation emails. SMTP2GO processes email data on our behalf and is bound by its own privacy policy.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to a valid legal request from a government authority.</li>
            </ul>
          </Section>

          <Section title="6. Cookies and Tracking">
            <p>
              Our website does not use tracking cookies, advertising pixels, or third-party analytics services that collect personally identifiable information. We may use basic, anonymized analytics to understand aggregate traffic patterns (e.g., page views), but this data cannot be used to identify individual visitors.
            </p>
          </Section>

          <Section title="7. Your Rights (PIPEDA)">
            <p>
              As a Canadian business, we are subject to the <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA). Under PIPEDA, you have the right to:
            </p>
            <ul>
              <li>Know what personal information we hold about you</li>
              <li>Request access to your personal information</li>
              <li>Request correction of inaccurate information</li>
              <li>Withdraw consent for us to use your information (subject to legal and contractual restrictions)</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at <strong>support@airfiltersdirect.ca</strong>.
            </p>
          </Section>

          <Section title="8. Data Retention">
            <p>
              We retain order information for a period of up to two (2) years for the purposes of order history, warranty support, and accounting. After this period, order records are deleted from our systems.
            </p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>
              Our website and services are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe a minor has submitted information to us, please contact us and we will promptly delete it.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. The updated policy will be posted on this page with a revised "Last updated" date. We encourage you to review this page periodically.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our handling of your personal information, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> support@airfiltersdirect.ca</li>
              <li><strong>Phone:</strong> +1 289-440-2679</li>
            </ul>
          </Section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2
        className="text-xl font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200"
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        {title}
      </h2>
      <div className="text-slate-600 leading-relaxed space-y-3 text-[15px]">
        {children}
      </div>
    </section>
  );
}
