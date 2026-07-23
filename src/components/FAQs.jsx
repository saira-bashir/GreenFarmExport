import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function FAQs() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqsList = [
    {
      question: "What is your Minimum Order Quantity (MOQ) for export?",
      answer: "For most of our farm-fresh fruits and vegetables, the standard MOQ starts from a 20ft or 40ft refrigerated container, or specific pallet loads depending on the destination and shipping mode."
    },
    {
      question: "What payment terms do you accept for international shipments?",
      answer: "We accept secure payment methods including Advance Wire Transfer (T/T), Letter of Credit (L/C) at sight, and other mutually agreed international trade terms."
    },
    {
      question: "How do you ensure the freshness of produce during transit?",
      answer: "We utilize advanced cold-chain logistics, temperature-controlled reefer containers, and high-grade export packaging (ventilated cartons and mesh bags) to ensure farm-fresh quality upon arrival."
    },
    {
      question: "Are your products certified for international export?",
      answer: "Yes, our packaging facilities and agricultural sourcing comply with international quality standards, including ISO 9001, HACCP, and GLOBAL G.A.P certifications."
    },
    {
      question: "How can I track my bulk export order?",
      answer: "You can easily track your order status and view complete shipment details by logging into your account and visiting the 'My Orders' section on our website."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Got questions about our export process, shipping, or payments? Find answers here.
        </p>

        <div className="space-y-4">
          {faqsList.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition"
            >
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 text-left font-semibold text-gray-800 hover:text-green-700 focus:outline-none"
              >
                <span>{faq.question}</span>
                <span className="text-xl font-bold text-green-700 ml-4">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-5 pb-5 text-gray-600 border-t border-gray-100 pt-3 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQs;