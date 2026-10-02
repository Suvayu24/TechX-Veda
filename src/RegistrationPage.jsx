import { useState } from "react";
import { motion } from "framer-motion";

const initialForm = {
  name: "",
  email: "",
  whatsappNumber: "",
  gender: "",
  enrollmentNumber: "",
};

export default function RegistrationPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.message || "Unable to submit your registration.",
        );

      setStatus("success");
      setMessage(
        "Your registration has been received. We will be in touch soon.",
      );
      setForm(initialForm);
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <main className="registration-page">
      <div className="registration-backdrop" />
      <header className="registration-nav">
        <a href="/" className="brand">
          TechX <em>Veda</em>
        </a>
        <a href="/" className="back-link">
          ← Back to programme
        </a>
      </header>

      <motion.section
        className="registration-layout"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="registration-intro">
          <p className="eyebrow">Winter Bootcamp registration</p>
          <h1>
            TechX <em>Veda</em>
            <br />
            2026
          </h1>
          <p className="registration-description">
            Winter Bootcamp in association with IITB, Microsoft, Umeed
            Foundation
          </p>
          <dl className="registration-details">
            <div>
              <dt>Participating colleges</dt>
              <dd>MNNIT Prayagraj, IIIT Prayagraj, IIT Madras</dd>
            </div>
            <div>
              <dt>Dates</dt>
              <dd>6th Dec - 15th Dec</dd>
            </div>
          </dl>
        </div>

        <form className="registration-form" onSubmit={submitForm}>
          <div className="form-heading">
            <p className="eyebrow">Reserve your place</p>
            <h2>Registration form</h2>
            <p>All fields are required.</p>
          </div>
          <label>
            <span>Name</span>
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              autoComplete="name"
              required
              placeholder="Your full name"
            />
          </label>
          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
          </label>
          <div className="form-row">
            <label>
              <span>WhatsApp number</span>
              <input
                name="whatsappNumber"
                type="tel"
                value={form.whatsappNumber}
                onChange={updateField}
                autoComplete="tel"
                required
                placeholder="10-digit number"
                pattern="[0-9+() -]{10,20}"
              />
            </label>
            <label>
              <span>Gender</span>
              <select
                name="gender"
                value={form.gender}
                onChange={updateField}
                required
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </label>
          </div>
          <label>
            <span>Enrollment number</span>
            <input
              name="enrollmentNumber"
              value={form.enrollmentNumber}
              onChange={updateField}
              required
              placeholder="Your college enrollment number"
            />
          </label>
          {message && (
            <p className={`form-message ${status}`} role="status">
              {message}
            </p>
          )}
          <button
            className="form-submit"
            type="submit"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Submitting..." : "Submit registration"}{" "}
            <b>→</b>
          </button>
        </form>
      </motion.section>
    </main>
  );
}
