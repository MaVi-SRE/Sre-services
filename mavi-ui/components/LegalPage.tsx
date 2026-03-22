
import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, FileText, ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  onBack: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const content = {
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'February 27, 2026',
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      sections: [
        {
          heading: '1. Information We Collect',
          text: 'We collect only the information you voluntarily provide through our contact form and chatbot, including your name, contact details, service requirements, and any additional details you choose to share This information is collected strictly to understand your needs and respond effectively to your requests.'
        },
        {
          heading: '2. How We Use Your Information',
          text: 'We use your information solely to respond to your inquiries and understand your service requirements in order to provide accurate solutions or quotations. We do not use your data for marketing, promotions, or any unsolicited communications.'
        },
        {
          heading: '3. Information Sharing',
          text: 'We do not sell, rent, or trade your personal information.Your data may be processed by trusted services (such as hosting and chatbot providers) only to support the functionality of our website and services.'
        },
        {
          heading: '4. Data Security',
          text: 'We take reasonable measures, including secure HTTPS encryption, to protect your information during transmission and storage.While we strive to safeguard your data, no system can guarantee complete security.'
        }
      ]
    },
    terms: {
      title: 'Terms and Conditions',
      lastUpdated: 'February 27, 2026',
      icon: <FileText className="w-12 h-12 text-green-600" />,
      sections: [
        {
          heading: '1. Scope of Services',
          text: 'MaVi provides IT consulting, Site Reliability Engineering (SRE), cloud migration, and infrastructure monitoring. The specific deliverables, timelines, and fees will be outlined in a separate Statement of Work (SOW) or Service Level Agreement (SLA) for each project.'
        },
        {
          heading: '2. Client Responsibilities',
          text: 'To ensure "Maxi Vision" for your systems, the Client must: - Provide necessary access to cloud consoles (AWS, Azure, Vercel, etc.) and code repositories.- Appoint a technical point of contact for emergency escalations.- Ensure all third-party licenses (e.g., Splunk, Datadog) are active and paid.'
        },
        {
          heading: '3. Fees and Payment',
          text: 'Invoicing: Services are billed as per the agreed schedule (Monthly for Managed Services / Milestone-based for Projects).- Late Payments: Payments delayed beyond 15 days from the invoice date may result in a temporary suspension of 24/7 monitoring services.'
        },
        {
          heading: '4. Uptime & Liability (The SRE Clause)',
          text: 'Reliability: While MaVi implements "Smart SRE" best practices to maximize uptime, we do not guarantee 100% availability.- Third-Party Failures: MaVi is not liable for outages caused by upstream providers (e.g., AWS, Hostinger, Vercel).- Limit of Liability: To the maximum extent permitted by law, MaVi’s total liability for any claim is limited to the amount paid by the Client for the services in the three months preceding the claim.'
        },
        {
          heading: '5. Confidentiality & Data Security',
          text: 'Non-Disclosure: MaVi will not disclose your proprietary code or business data to third parties. Security: We follow industry-standard security protocols (IAM roles, least-privilege access) to manage your infrastructure.'
        },
        {
          heading: '6.Intellectual Property',
          text: 'Client Property: All data and custom application code belong to the Client. MaVi Property: General-purpose scripts, automated monitoring templates, and SRE frameworks developed by MaVi remain the intellectual property of MaVi unless otherwise agreed in writing.'
        },
        {
          heading: '7.Termination',
          text: 'Either party may terminate the service agreement upon 30 days prior written notice. Upon termination, MaVi will provide a "Migration Handover" document to ensure your team can assume responsibility for the infrastructure.'
        },
        {
          heading: '8. Governing Law',
          text: 'These terms are governed by the laws of India, with jurisdiction held in Chennai, regardless of the Clients physical location.'
        }
      ]
    }
  };

  const activeContent = content[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-[#050B14]"
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest mb-12"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="flex items-center gap-6 mb-8">
          <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
            {activeContent.icon}
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {activeContent.title}
            </h1>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-2">
              Last Updated: {activeContent.lastUpdated}
            </p>
          </div>
        </div>

        <div className="glass-card p-8 md:p-12 rounded-[40px] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5">
          <div className="space-y-12">
            {activeContent.sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {section.heading}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {section.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-slate-200 dark:border-white/10">
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              If you have any questions about these {activeContent.title.toLowerCase()}, please contact us at support@mavisolution.com.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
