import { useState } from "react";
import { motion } from "framer-motion";

const initialForm = { fullName: "", enrollmentNumber: "", email: "", whatsappNumber: "", collegeName: "", programme: "", branch: "", year: "", residence: "", gender: "", introduction: "", combination: "", values: "", contribution: "", technicalExperience: "", selectionAcknowledgement: false, respectfulParticipation: false, informationAccurate: false, fullCommitment: false };

const questions = [
  ["introduction", "01", 200, "Introduce yourself. Tell us about your academic interests, key strengths, skills, what you enjoy beyond your regular coursework, and what kind of student you are."],
  ["combination", "02", 150, "What attracts you to TechX Veda's combination of technical learning, career guidance and spirituality? What do you hope to gain from this programme?"],
  ["values", "03", 150, "What does a meaningful and values-driven life mean to you? How do you think personal spirituality can influence your studies, career and relationships?"],
  ["contribution", "04", 150, "Share an instance when you personally contributed to a team or community. What was your role, what did you do, and what was the outcome?"],
  ["technicalExperience", "05", 150, "What area of technology interests you and why? Tell us about one project, idea or technical experience you have pursued beyond your regular coursework."],
];

const textFields = [
  ["collegeName", "College"],
  ["programme", "Programme"],
  ["branch", "Branch"],
  ["residence", "Hostel / residence"],
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const namePattern = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;
const wordCount = (value) => value.trim().match(/\S+/g)?.length || 0;

function validateForm(form) {
  if (!form.fullName.trim()) return "Please enter your full name.";
  if (!namePattern.test(form.fullName.trim())) return "Full name can contain letters and spaces only.";
  if (!form.email.trim()) return "Please enter your email address.";
  if (!emailPattern.test(form.email.trim())) return "Please enter a valid email address.";
  if (!form.whatsappNumber.trim()) return "Please enter your mobile number.";
  if (!/^\d+$/.test(form.whatsappNumber)) return "Mobile number can contain digits only.";
  for (const [name, label] of textFields) {
    if (!form[name].trim()) return `Please enter your ${label.toLowerCase()}.`;
  }
  if (!form.year) return "Please select your year.";
  if (!form.gender) return "Please select your gender.";
  for (const [name, number, limit] of questions) {
    const count = wordCount(form[name]);
    if (!count) return `Please complete response ${number}.`;
    if (count > limit) return `Please shorten response ${number} to ${limit} words or fewer.`;
  }
  if (![form.selectionAcknowledgement, form.respectfulParticipation, form.informationAccurate, form.fullCommitment].every(Boolean)) return "Please accept all four declaration statements.";
  return "";
}

function FormSection({ number, title, children }) {
  return <section className="application-section"><div className="application-section-title"><span>{number}</span><h3>{title}</h3></div>{children}</section>;
}

function WordCounter({ value, limit }) {
  const count = wordCount(value);
  return <span className={count > limit ? "word-count is-over" : "word-count"}>{count}/{limit} words</span>;
}

export default function RegistrationPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const updateField = ({ target }) => {
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm((current) => ({ ...current, [target.name]: value }));
    if (status !== "submitting") {
      setStatus("idle");
      setMessage("");
    }
  };
  const submitForm = async (event) => {
    event.preventDefault();
    const validationMessage = validateForm(form);
    if (validationMessage) {
      setStatus("error");
      setMessage(validationMessage);
      return;
    }
    setStatus("submitting");
    setMessage("");
    try {
      const payload = { ...form, fullName: form.fullName.trim(), enrollmentNumber: form.enrollmentNumber.trim(), email: form.email.trim(), whatsappNumber: form.whatsappNumber, collegeName: form.collegeName.trim(), programme: form.programme.trim(), branch: form.branch.trim(), residence: form.residence.trim() };
      const response = await fetch("/api/registrations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const responseMessage = result.message || "Unable to submit your application.";
        if (responseMessage === "Please complete every required field.") {
          throw new Error("The application server is using an older form schema. Restart the server to load the current application fields.");
        }
        throw new Error(responseMessage);
      }
      setStatus("success");
      setMessage(result.message || "Your application has been submitted successfully. We will reach you out personally once your application gets approved.");
      setForm(initialForm);
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <main className="registration-page application-page">
      <div className="registration-backdrop" />
      <header className="registration-nav"><a href="/" className="brand">TechX <em>Veda</em></a><a href="/" className="back-link">← Back to programme</a></header>
      <motion.section className="registration-layout application-layout" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <section className="selection-timeline" aria-labelledby="selection-timeline-title">
          <div className="selection-timeline-heading">
            <p>Selection process</p>
          </div>
          <ol className="selection-steps">
            <li><span className="selection-step-number">01</span><span>Application submission</span></li>
            <li><span className="selection-step-number">02</span><span>Application review &amp; results declaration</span></li>
            <li><span className="selection-step-number">03</span><span>Interview</span></li>
            <li><span className="selection-step-number">04</span><span>Final selection &amp; payment <small>₹3,000 + travel expenses</small></span></li>
          </ol>
        </section>
        <aside className="registration-intro application-intro">
          <p className="eyebrow">Winter Bootcamp 2026</p><h1>TechX <em>Veda</em></h1>
          <p className="registration-description">An eight-day residential programme for students who want to develop competence with character.</p>
          <p className="application-intro-copy">Alongside technical learning and career mentorship, the camp includes wellness, Indian wisdom, service, sustainability and cultural experiences.</p>
          <div className="application-note"><span>Before you begin</span><p>Please answer in your own words. Short, specific examples are more useful than impressive general statements. Originality will be appreciated. Submitting this form does not guarantee selection; applications will be screened and selected students will be invited to complete registration.</p></div>
          <dl className="registration-details camp-schedule"><div><dt>When &amp; where</dt><dd><span>13th - 16th December 2026 @ IITB Campus</span><span>17th - 20th December 2026 @ Govardhan Eco Village</span></dd></div></dl>
        </aside>

        <form className="registration-form application-form" onSubmit={submitForm} noValidate>
          <div className="form-heading"><p className="eyebrow">Winter Bootcamp 2026</p><h2>Student Application Form</h2><p>Fields marked * are required.</p></div>
          <FormSection number="A" title="Candidate Details">
            <div className="form-grid">
              <label className="form-span-two"><span>Full name *</span><input name="fullName" value={form.fullName} onChange={updateField} autoComplete="name" required placeholder="Your full name" /></label>
              
              <label><span>Email address *</span><input name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" required placeholder="you@example.com" /></label>
              <label><span>Mobile number *</span><input name="whatsappNumber" type="tel" inputMode="numeric" value={form.whatsappNumber} onChange={updateField} autoComplete="tel" required placeholder="1234567890" maxLength="24" /></label>
              <label className="form-span-two"><span>College *</span><input name="collegeName" value={form.collegeName} onChange={updateField} required placeholder="Name of your college" /></label>
              <label className="form-span-two"><span>Enrollment number *</span><input name="enrollmentNumber" value={form.enrollmentNumber} onChange={updateField} placeholder="College enrollment number" maxLength="80" /></label>
              <label><span>Programme *</span><input name="programme" value={form.programme} onChange={updateField} required placeholder="e.g. B.Tech" /></label>
              <label><span>Branch *</span><input name="branch" value={form.branch} onChange={updateField} required placeholder="e.g. Computer Science" /></label>
              <label><span>Year *</span><select name="year" value={form.year} onChange={updateField} required><option value="" disabled>Select year</option><option>1st year</option><option>2nd year</option><option>3rd year</option><option>4th year</option><option>5th year</option><option>Postgraduate</option></select></label>
              <label><span>Gender *</span><select name="gender" value={form.gender} onChange={updateField} required><option value="" disabled>Select</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label>
              <label className="form-span-two"><span>Hostel / residence *</span><input name="residence" value={form.residence} onChange={updateField} required placeholder="Hostel or residence" /></label>
            </div>
          </FormSection>
          <FormSection number="B" title="Short-answer questions">
            {questions.map(([name, number, limit, question]) => <label className="essay-question" key={name}><span className="question-number">{number}</span><span className="question-text">{number}. {question} (Max {limit} words) *</span><textarea name={name} value={form[name]} onChange={updateField} required rows="6" maxLength={limit * 8} placeholder="Write your response here..." /><WordCounter value={form[name]} limit={limit} /></label>)}
          </FormSection>
          <FormSection number="D" title="Declaration">
            <div className="declaration-items">
              <label className="declaration"><input name="selectionAcknowledgement" type="checkbox" checked={form.selectionAcknowledgement} onChange={updateField} required /><span>I understand that this is a selection-based application and final registration is offered only to selected students.</span></label>
              <label className="declaration"><input name="respectfulParticipation" type="checkbox" checked={form.respectfulParticipation} onChange={updateField} required /><span>I am willing to participate respectfully in the Career, Wellness and Culture components, including reflective and spiritual sessions.</span></label>
              <label className="declaration"><input name="informationAccurate" type="checkbox" checked={form.informationAccurate} onChange={updateField} required /><span>I confirm that the information provided is accurate and written by me.</span></label>
              <label className="declaration"><input name="fullCommitment" type="checkbox" checked={form.fullCommitment} onChange={updateField} required /><span>Yes, I commit to the complete programme and attend full bootcamp from 6th to 15th Dec 2026.</span></label>
            </div>
          </FormSection>
          {message && <p className={`form-message ${status}`} role={status === "error" ? "alert" : "status"}>{message}</p>}
          <button className="form-submit" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Submitting..." : "Submit application"} <b>→</b></button><p className="submission-note">Your application will be screened before selection.</p>
        </form>
      </motion.section>
    </main>
  );
}
