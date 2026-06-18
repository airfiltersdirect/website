// AirFiltersDirect — Terms of Service Page
// Design: Clean white page with glassmorphism header, consistent with site palette

import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsOfService() {
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
            Terms of Service
          </h1>
          <p className="text-slate-400 mt-2 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Last updated: June 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 container py-16 max-w-3xl mx-auto">
        <div className="prose prose-slate max-w-none" style={{ fontFamily: 'DM Sans, sans-serif' }}>

          <Section title="1. Acceptance of Terms">
            <p>
              By placing an order through the AirFiltersDirect website (<strong>airfiltersdirect.ca</strong>), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not place an order.
            </p>
            <p>
              These Terms of Service constitute the entire agreement between you and AirFiltersDirect with respect to your order and supersede any prior communications or representations.
            </p>
          </Section>

          <Section title="2. Products and Pricing">
            <p>
              All products listed on our website are subject to availability. Prices are displayed in Canadian dollars (CAD) and are subject to change without notice. The price you are quoted at the time of placing your order is the price you will be charged.
            </p>
            <p>
              All orders are subject to 13% Harmonized Sales Tax (HST) and a flat delivery fee of $12.00 CAD, which will be clearly displayed in your order summary before you confirm your order.
            </p>
            <p>
              Product images are for illustrative purposes. Actual product dimensions and specifications are listed in the product description and take precedence over images.
            </p>
          </Section>

          <Section title="3. Order Process">
            <p>
              When you submit an order through our website, you will receive an order confirmation email at the address you provided. This confirmation acknowledges receipt of your order and includes your unique order reference number. Receipt of a confirmation email does not constitute acceptance of your order — acceptance occurs when we contact you to confirm your delivery date and time.
            </p>
            <p>
              We reserve the right to cancel or refuse any order at our sole discretion, including but not limited to cases where a product is out of stock, where we are unable to deliver to your address, or where we suspect fraudulent activity. In such cases, you will be notified promptly.
            </p>
          </Section>

          <Section title="4. Payment">
            <p>
              AirFiltersDirect offers two payment methods:
            </p>
            <ul>
              <li>
                <strong>E-Transfer:</strong> Payment is due prior to delivery. Upon placing your order, you will receive instructions to send an e-transfer to <strong>info@loitteb.ca</strong> for the full order total. You must include your order reference number (e.g., AFD-XXXXX) in the memo/message field of your e-transfer. Delivery will be scheduled once payment is confirmed.
              </li>
              <li>
                <strong>Credit Card or Cash at Door:</strong> Payment is collected in full at the time of delivery. We accept cash and major credit cards. No payment is required in advance for this option.
              </li>
            </ul>
            <p>
              We do not store, process, or have access to any credit card information. All in-person card transactions are handled securely at the point of delivery.
            </p>
          </Section>

          <Section title="5. Delivery">
            <p>
              We offer direct-to-door delivery across Canada. A flat delivery fee of $12.00 CAD applies to all orders regardless of order size or location. Delivery timelines are estimates only and are not guaranteed. After your order is placed, a member of our team will contact you to confirm your expected delivery date and time window.
            </p>
            <p>
              You are responsible for ensuring that someone is available at the delivery address to receive the order. If a delivery attempt is unsuccessful due to no one being available, we will contact you to reschedule. Additional delivery attempts may incur a re-delivery fee.
            </p>
            <p>
              Risk of loss and title for products passes to you upon delivery.
            </p>
          </Section>

          <Section title="6. Returns and Refunds">
            <p>
              Due to the nature of air filtration products, we do not accept returns on opened packages for health and safety reasons. If you receive a product that is damaged, defective, or incorrect, please contact us within 48 hours of delivery at <strong>support@airfiltersdirect.ca</strong> or <strong>+1 289-440-2679</strong> and we will arrange a replacement or refund at no cost to you.
            </p>
            <p>
              Unopened, unused products in their original packaging may be returned within 14 days of delivery for a full refund, less the original delivery fee. Return shipping or delivery costs are the responsibility of the customer unless the return is due to our error.
            </p>
          </Section>

          <Section title="7. Product Compatibility">
            <p>
              It is your responsibility to verify that the product you are ordering is compatible with your HVAC system or furnace before placing an order. Product dimensions and part numbers are listed in each product description. If you are unsure about compatibility, please contact us before ordering at <strong>support@airfiltersdirect.ca</strong> and we will be happy to assist.
            </p>
            <p>
              AirFiltersDirect is not liable for any damage to HVAC equipment resulting from the installation of an incompatible filter.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable Canadian law, AirFiltersDirect shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our website or products, including but not limited to loss of revenue, loss of data, or damage to property.
            </p>
            <p>
              Our total liability to you for any claim arising from your order shall not exceed the total amount paid by you for the order giving rise to the claim.
            </p>
          </Section>

          <Section title="9. Intellectual Property">
            <p>
              All content on this website, including text, images, logos, and product descriptions, is the property of AirFiltersDirect or its content suppliers and is protected by applicable Canadian and international intellectual property laws. You may not reproduce, distribute, or create derivative works from any content on this site without our prior written consent.
            </p>
          </Section>

          <Section title="10. Governing Law">
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Ontario.
            </p>
          </Section>

          <Section title="11. Changes to These Terms">
            <p>
              We reserve the right to update or modify these Terms of Service at any time. Changes will be posted on this page with a revised "Last updated" date. Your continued use of our website or placement of an order after any changes constitutes your acceptance of the revised terms.
            </p>
          </Section>

          <Section title="12. Contact Us">
            <p>
              If you have any questions about these Terms of Service, please contact us:
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
