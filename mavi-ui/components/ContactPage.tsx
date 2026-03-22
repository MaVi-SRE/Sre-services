import { div } from 'motion/react-client';
import React, { useState } from 'react';



export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    country_code: '+1',
    contact_number: '',
    email: '',
    service_requirement: 'SRE Managed Services',
    preferred_time: '',
    project_details: '',
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number; size: number }[]>([]);

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(button.clientWidth, button.clientHeight);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = { x, y, id: Date.now() + Math.random(), size };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "full_name") {
      const filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData({ ...formData, [name]: filteredValue });
      return;
    }

    if (name === "contact_number") {
      const filteredValue = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: filteredValue });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setPopupMessage(
          "We’ve received your request. Our Sales Team will contact you at your preferred time."
        );
        setShowPopup(true);

        setFormData({
          full_name: '',
          country_code: '+1',
          contact_number: '',
          email: '',
          service_requirement: 'SRE Managed Services',
          preferred_time: '',
          project_details: '',
        });
      } else {
        setPopupMessage(
          "Something went wrong. Please contact connect@mavisolution.com"
        );
        setShowPopup(true);
      }
    } catch (error) {
      console.error(error);
      setPopupMessage(
        "Server error. Please contact connect@mavisolution.com"
      );
      setShowPopup(true);
    }
  };

  return (
    <div className="min-h-screen pt-10 pb-20 relative overflow-hidden bg-slate-50 dark:bg-transparent">
      <style>{`
        @keyframes ripple-effect {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-ripple-effect {
          animation: ripple-effect 0.6s linear;
        }

        /* Autofill overrides for light mode */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        select:-webkit-autofill,
        select:-webkit-autofill:hover,
        select:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #f1f5f9 inset !important;
          -webkit-text-fill-color: #0f172a !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        /* Autofill overrides for dark mode */
        .dark input:-webkit-autofill,
        .dark input:-webkit-autofill:hover, 
        .dark input:-webkit-autofill:focus, 
        .dark input:-webkit-autofill:active,
        .dark textarea:-webkit-autofill,
        .dark textarea:-webkit-autofill:hover,
        .dark textarea:-webkit-autofill:focus,
        .dark select:-webkit-autofill,
        .dark select:-webkit-autofill:hover,
        .dark select:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #1e293b inset !important;
          -webkit-text-fill-color: #ffffff !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
      {/* Background flare */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 dark:bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-500/5 dark:bg-green-500/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="mb-20 text-left">
          <div className="inline-block px-4 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em]">
              Communication Portal
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-6">
            Get In <span className="text-moving-gradient">Touch</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Ready to stabilize your infrastructure? Our engineering team is standing by to analyze your requirements and build a high-reliability roadmap.
          </p>
        </div>


        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Direct Channels — UNTOUCHED */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mb-10">
                Direct Channels
              </h2>

              <div className="space-y-6">
                <a
                  href="mailto:support@mavisolution.com"
                  className="flex items-center gap-6 p-6 glass-card border border-slate-200 dark:border-white/5 rounded-3xl hover:border-blue-500/30 transition-all group"
                >
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <i className="fa-solid fa-envelope text-xl"></i>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                      Official Email
                    </span>
                    <span className="text-slate-900 dark:text-white font-bold text-lg">
                      Connect with Email
                    </span>
                  </div>
                </a>

                {/*<a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-6 p-6 glass-card border border-slate-200 dark:border-white/5 rounded-3xl hover:border-green-500/30 transition-all group"
                >
                  <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                    <i className="fa-brands fa-whatsapp text-2xl"></i>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                      WhatsApp Business
                    </span>
                    <span className="text-slate-900 dark:text-white font-bold text-lg">
                      Instant Message Support
                    </span>
                  </div>
                </a>*/}

                <a
                  href="https://www.linkedin.com/company/mavisoulutions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-6 p-6 glass-card border border-slate-200 dark:border-white/5 rounded-3xl hover:border-blue-400/30 transition-all group"
                >
                  <div className="w-14 h-14 bg-slate-900 dark:bg-white/10 rounded-2xl flex items-center justify-center text-slate-600 dark:text-white group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <i className="fa-brands fa-linkedin text-2xl"></i>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                      Corporate Profile
                    </span>
                    <span className="text-slate-900 dark:text-white font-bold text-lg">
                      LinkedIn Official
                    </span>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-card border border-slate-200 dark:border-slate-700 rounded-[40px] p-8 md:p-12 shadow-2xl transition-colors">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10">
                Submit a Request
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>

                {/* Full Name */}
                <input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 transition-all"
                  required
                />

                {/* Country Code + Contact Number */}
                <div className="grid md:grid-cols-3 gap-6">
                  <select
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleChange}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 transition-all cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                  >
                    <option value="+1">+1 (USA/Canada)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+91">+91 (India)</option>
                    <option value="+61">+61 (Australia)</option>
                    <option value="+971">+971 (UAE)</option>
                    <option value="+65">+65 (Singapore)</option>
                    <option value="+49">+49 (Germany)</option>
                    <option value="+33">+33 (France)</option>
                    <option value="+81">+81 (Japan)</option>
                    <option value="+86">+86 (China)</option>
                  </select>

                  <input
                    name="contact_number"
                    value={formData.contact_number}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={handleChange}
                    type="tel"
                    placeholder="Contact Number"
                    className="w-full md:col-span-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="john@company.com"
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 transition-all"
                  required
                />

                {/* Service + Preferred Time */}
                <div className="grid md:grid-cols-2 gap-6">
                  <select
                    name="service_requirement"
                    value={formData.service_requirement}
                    onChange={handleChange}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 transition-all cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                  >
                    <option>SRE Managed Services</option>
                    <option>Cloud Infrastructure Setup</option>
                    <option>Performance Audit</option>
                    <option>Web Development</option>
                    <option>Other Technical Support</option>
                  </select>

                  <input
                    type="time"
                    name="preferred_time"
                    value={formData.preferred_time}
                    onChange={handleChange}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 transition-all cursor-pointer [color-scheme:light] dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:transition-opacity"
                    required
                  />
                </div>

                {/* Project Details */}
                <textarea
                  name="project_details"
                  value={formData.project_details}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Briefly describe your current infrastructure or upcoming project..."
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 transition-all resize-none"
                  required
                ></textarea>

                <button
                  type="submit"
                  onMouseDown={handleRipple}
                  className="relative overflow-hidden w-full py-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-black rounded-2xl uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-blue-500/20 mt-4"
                >
                  <span className="relative z-10">Initialize Connection</span>
                  {ripples.map((ripple) => (
                    <span
                      key={ripple.id}
                      className="absolute bg-white/40 rounded-full pointer-events-none animate-ripple-effect"
                      style={{
                        top: ripple.y,
                        left: ripple.x,
                        width: ripple.size,
                        height: ripple.size,
                      }}
                    />
                  ))}
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full border border-slate-200 dark:border-slate-700">

            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
              Notification
            </h2>

            <p className="mb-6 text-slate-600 dark:text-slate-400">
              {popupMessage}
            </p>

            <button
              onClick={() => setShowPopup(false)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:scale-105 transition"
            >
              OK
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
