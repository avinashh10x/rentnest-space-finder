import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary mb-6">Get in Touch with Us</h1>
        <p className="text-center text-lg text-gray-600 mb-10">
          Whether you’re looking to rent, list a property, or just have questions — the RentNest team is here for you!
        </p>

        <div className="grid md:grid-cols-2 gap-10 text-gray-700">
          <div className="flex items-start space-x-4">
            <span className="text-3xl">📧</span>
            <div>
              <h2 className="text-xl font-semibold mb-1">Email Us</h2>
              <a href="mailto:info@rentnest.com" className="text-primary hover:underline">
                info@rentnest.com
              </a>
              <p className="text-sm text-gray-500">We usually reply within a few hours.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <span className="text-3xl">📞</span>
            <div>
              <h2 className="text-xl font-semibold mb-1">Call Us</h2>
              <p className="text-primary font-medium">+91 98765 43210</p>
              <p className="text-sm text-gray-500">Mon to Sat, 10:00 AM – 6:00 PM</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <span className="text-3xl">📍</span>
            <div>
              <h2 className="text-xl font-semibold mb-1">Our Office</h2>
              <p>RentNest HQ</p>
              <p className="text-sm text-gray-500">Jalandhar, Punjab, India</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <span className="text-3xl">💬</span>
            <div>
              <h2 className="text-xl font-semibold mb-1">Customer Support</h2>
              <p>We’re always happy to assist you.</p>
              <p className="text-sm text-gray-500">Expect helpful, friendly service every time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
