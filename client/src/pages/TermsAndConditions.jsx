import React from "react";

function TermsAndConditions() {
  return (
    <div className="min-h-screen px-4">
      <div className="max-w-4xl mx-auto bg-[#1D232A] rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-white mb-6">
          Terms & Conditions
        </h1>

        <p className="text-gray-200 mb-4 leading-relaxed">
          Welcome to <span className="font-semibold text-white">AI Ticket System</span>.
          By accessing or using our platform you agree to the following terms
          and conditions. Please read them carefully.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              1. Account Registration
            </h2>
            <p className="text-gray-300">
              You must sign in using a valid Google account. You are responsible for
              maintaining the confidentiality of your account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              2. Ticket Creation & Usage
            </h2>
            <p className="text-gray-300">
              Use the AI Ticket System to submit genuine support tickets.
              Misuse, spam, or inappropriate content may lead to account suspension.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              3. Data & Privacy
            </h2>
            <p className="text-gray-300">
              We respect your privacy and handle your data according to our privacy
              policy. Data may be used to improve services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              4. Changes to Terms
            </h2>
            <p className="text-gray-300">
              We may update these Terms & Conditions at any time. Continued use of
              the platform means you accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              5. Contact Us
            </h2>
            <p className="text-gray-300">
              If you have any questions about these Terms & Conditions, please email
              us at{" "}
              <a
                href="mailto:chaipiladona@gmail.com"
                className="underline text-indigo-400 hover:text-indigo-300"
              >
                chaipiladona@gmail.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
