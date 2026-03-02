'use client';
import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'Is the EXAMINERLY platform secure for my institution?',
      answer:
        'Absolutely! We use industry-standard end-to-end encryption and AI-powered proctoring to ensure exam transparency and maximum security for all data.',
    },
    {
      question: 'Can I create custom question banks?',
      answer:
        'Yes, our platform allows you to easily create various types of questions, including Multiple Choice (MCQ), Descriptive, and Rich Media (Videos/Images) supported formats.',
    },
    {
      question: 'Are student results generated automatically?',
      answer:
        'For objective or MCQ questions, results are generated instantly. For descriptive questions, instructors can manually grade them through our intuitive dashboard.',
    },
    {
      question: 'Is the platform accessible from mobile and tablets?',
      answer:
        'Yes, our interface is 100% responsive. Students can take exams from any modern browser on smartphones, tablets, or desktop PCs without any extra software.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-[#f8fafc] scroll-mt-20">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Side: Text & Support Card */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-primary font-black uppercase tracking-[0.3em] text-[11px] px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                Support
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-base-content tracking-tighter leading-tight">
                Frequently <br />{' '}
                <span className="text-primary italic">Asked</span> Questions
              </h2>
              <p className="text-base-content/60 font-medium text-lg leading-relaxed">
                Have more questions? Our support team is ready to help you 24/7
                with any inquiries.
              </p>
            </div>

            {/* Support CTA Card */}
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all duration-500"></div>
              <h4 className="text-xl font-black text-base-content mb-2">
                Still confused?
              </h4>
              <p className="text-sm text-base-content/50 font-bold mb-6">
                Talk to our experts today about your requirements.
              </p>
              <button className="btn btn-primary btn-sm rounded-xl px-6 font-black text-white border-none shadow-lg shadow-primary/20">
                Contact Us
              </button>
            </div>
          </div>

          {/* Right Side: Accordion */}
          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`group shadow-md border border-primary/20 rounded-3xl transition-all duration-500 overflow-hidden ${
                  openIndex === index
                    ? 'border-primary bg-primary/[0.02] shadow-[0_20px_40px_rgba(var(--p),0.05)]'
                    : 'border-base-200 bg-transparent hover:border-primary/30'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  className="w-full p-6 md:p-8 text-left flex items-center justify-between gap-4"
                >
                  <span
                    className={`text-lg font-black transition-colors duration-300 ${
                      openIndex === index
                        ? 'text-primary'
                        : 'text-base-content/80'
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                      openIndex === index
                        ? 'bg-primary text-white rotate-180'
                        : 'bg-base-200 text-base-content/40'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>

                <div
                  className={`transition-all duration-500 ease-in-out ${
                    openIndex === index
                      ? 'max-h-96 opacity-100 pb-8 px-8'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pt-2 border-t border-primary/10">
                    <p className="text-base-content/60 font-medium leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
