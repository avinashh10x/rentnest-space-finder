import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6 text-primary">About RentNest</h1>
      
      <p className="text-lg text-muted-foreground mb-6">
        Welcome to <strong>RentNest</strong> — your trusted partner in finding the perfect place to call home. Whether you're looking to rent a cozy apartment, a family house, or commercial space, we've got you covered.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-secondary text-gray-800">🏡 Who We Are</h2>
          <p className="text-base text-muted-foreground">
            We are a passionate team of real estate and tech experts driven by a single mission — making property rental smarter, simpler, and smoother. At RentNest, we believe in transparency, trust, and technology.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800 text-secondary">🚀 What We Do</h2>
          <p className="text-base text-muted-foreground">
            From verified listings to advanced search filters and real-time updates, we empower tenants and landlords with tools to connect easily. Whether you're browsing or managing properties, RentNest is your one-stop solution.
          </p>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold  mb-3 text-center">✨ Why Choose RentNest?</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>✔ Verified property listings with updated photos and descriptions</li>
          <li>✔ Easy-to-use dashboard for tenants and landlords</li>
          <li>✔ Secure communication & hassle-free rent management</li>
          <li>✔ Smart filters to match your needs — location, price, amenities & more</li>
          <li>✔ Fast and friendly customer support</li>
        </ul>
      </div>

      <div className="mt-12 text-center">
        <h4 className="text-xl font-bold mb-2">Ready to find your next home?</h4>
        <p className="text-muted-foreground mb-4">
          Browse through our listings or get in touch with our support team. We're here to help you every step of the way.
        </p>
        <a
          href="/properties"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition"
        >
          Explore Listings
        </a>
      </div>
    </div>
  );
};

export default AboutPage;
