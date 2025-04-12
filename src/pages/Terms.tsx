
import PageLayout from "@/components/layout/PageLayout";

const Terms = () => {
  return (
    <PageLayout 
      title="Terms and Conditions" 
      description="Please read these terms of service carefully before using our website"
    >
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
        <p>
          By accessing or using Tiffah Thrift Store website, you agree to be bound by these Terms and Conditions 
          and our Privacy Policy. If you disagree with any part of the terms, you may not access the website.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials on Tiffah Thrift Store's website for personal, 
          non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and 
          under this license you may not:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Modify or copy the materials;</li>
          <li>Use the materials for any commercial purpose, or for any public display;</li>
          <li>Attempt to decompile or reverse engineer any software contained on Tiffah Thrift Store's website;</li>
          <li>Remove any copyright or other proprietary notations from the materials; or</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Account Registration</h2>
        <p>
          To access certain features of the website, you may be required to register for an account. 
          You agree to provide accurate, current, and complete information during the registration process 
          and to update such information to keep it accurate, current, and complete.
        </p>
        <p className="mt-2">
          You are responsible for safeguarding your password and for all activities that occur under your account. 
          You agree to notify us immediately of any unauthorized use of your account.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Purchases</h2>
        <p>
          All purchases made through our website are subject to our Order Acceptance Policy. 
          We reserve the right to refuse or cancel your order at any time for reasons including but not limited to:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Product availability</li>
          <li>Errors in product or pricing information</li>
          <li>Errors in your order</li>
          <li>Suspected fraudulent activity</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Product Descriptions</h2>
        <p>
          We strive to describe all products as accurately as possible. However, we do not warrant that 
          product descriptions or other content of the website is accurate, complete, reliable, current, or error-free. 
          If a product offered by us is not as described, your sole remedy is to return it in unused condition.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
        <p>
          In no event shall Tiffah Thrift Store, its officers, directors, employees, or agents, be liable to you for 
          any direct, indirect, incidental, special, punitive, or consequential damages whatsoever resulting from any:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Errors, mistakes, or inaccuracies of content;</li>
          <li>Personal injury or property damage, of any nature whatsoever, resulting from your access to and use of our website;</li>
          <li>Any unauthorized access to or use of our secure servers and/or any and all personal information and/or financial information stored therein;</li>
          <li>Any interruption or cessation of transmission to or from our website;</li>
          <li>Any bugs, viruses, trojan horses, or the like, which may be transmitted to or through our website by any third party;</li>
          <li>Any errors or omissions in any content or for any loss or damage of any kind incurred as a result of your use of any content posted, emailed, transmitted, or otherwise made available via the website.</li>
        </ul>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
          By continuing to access or use our website after those revisions become effective, 
          you agree to be bound by the revised terms.
          <br /><br />
          These terms and conditions were last updated on April 12, 2025.
        </p>
      </section>
    </PageLayout>
  );
};

export default Terms;
