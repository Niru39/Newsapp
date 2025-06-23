import React, { useState } from "react";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setMsg("Please enter a valid email.");
      return;
    }
    setMsg(`Thanks for signing up, ${email}!`);
    setEmail("");
  };

  return (
    <section className="sidebar-section newsletter">
      <h3>Newsletter Signup</h3>
      <p>
        Stay Informed with Our Weekly Newsletter! Subscribe to get the latest news, updates,
        and exclusive insights delivered straight to your inbox. 
        Join our community today and never miss out!
      </p>
      <form onSubmit={handleSubmit}>
        <input
          className="newsletter"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Subscribe</button>
      </form>
      {msg && <p className="newsletter-msg">{msg}</p>}
    </section>
  );
};

export default NewsletterSignup;
