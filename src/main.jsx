import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, useReducedMotion } from "framer-motion";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegistrationPage from "./RegistrationPage";
import "./styles.css";

const registrationUrl = "https://tinyurl.com/TechXVeda2026";
const heroImages = [
  { src: "/hero_ (1).png", alt: "TechX Veda programme" },
  { src: "/hero_ (2).png", alt: "TechX Veda programme" },
  { src: "/hero_ (3).png", alt: "TechX Veda programme" },
  { src: "/hero_ (4).png", alt: "TechX Veda programme" },
];
const partnerLogos = [
  { src: "/logo-1.png", alt: "IIT Bombay" },
  { src: "/logo-2.png", alt: "Microsoft" },
  { src: "/logo-3.png", alt: "UMEED Agents Of Hope" },
];

const wellness = [
  [
    "01",
    "MEDITATION",
    "Mantra meditation",
    "Guided chanting, attentive listening and time for reflection in a peaceful setting.",
    "/Wellness_1.png",
  ],
  [
    "02",
    "DISCUSSIONS",
    "Life sutras & life skills",
    "Interactive Gita discussions on choices, purpose, relationships and the challenges of college life.",
    "/Wellness_2.png",
  ],
  [
    "03",
    "YOGA",
    "Yoga",
    "Movement, breathing and mindful practice as part of the daily wellness programme.",
    "/Wellness_3.png",
  ],
];
const career = [
  [
    "01",
    "IIT BOMBAY",
    "AI & ML workshop",
    "A workshop conducted by IIT Bombay with a hands-on project to apply the concepts you learn.",
    "/Career_1.png",
  ],
  [
    "02",
    "MICROSOFT",
    "Three-day hackathon",
    "Work in teams to explore a problem, develop an idea and build a prototype in a hackathon by Microsoft.",
    "/Career_2.png",
  ],
  [
    "03",
    "CORPORATE ALUMNI",
    "Corporate mentorship",
    "Learn from alumni from Microsoft, Adobe, NVIDIA, Google and Cisco through conversations on skills and careers.",
    "/Career_3.png",
  ],
];
const culture = [
  [
    "Sustainability visits", 
    "Organic farming and environmental projects, including water and energy conservation.",
    "/Culture_1.png",
  ],
  [
    "Social outreach",
    "Community engagement and opportunities for service and social impact.",
    "/Culture_2.png",
  ],
  ["Trekking", "Explore the outdoors with fellow students.", "/Culture_3.png"],
  [
    "Evening soulful music",
    "Shared musical evenings and time together.",
    "/Culture_4.png",
  ],
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["Home", "home"],
    ["About Us", "about"],
    ["Wellness", "wellness"],
    ["Career", "career"],
    ["Culture", "culture"],
    ["Register", "register"],
  ];
  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`nav ${scrolled ? "nav-scrolled" : ""}`}
    >
      <a href="#home" className="brand">
        TechX <em>Veda</em>
      </a>

      <button
        className="menu-button"
        aria-label="Toggle navigation"
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
      </button>
      <div className={`nav-links ${open ? "is-open" : ""}`}>
        {links.map(([label, id]) => (
          <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}

function SectionHeader({ number, eyebrow, title, intro }) {
  return (
    <div className="section-header">
      <div className="section-number">{number}</div>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="intro">{intro}</p>
      </div>
    </div>
  );
}

function FeatureCard({ item, index }) {
  const [number, label, title, desc, image] = item;
  return (
    <motion.article
      className={`feature-card ${index % 2 ? "reverse" : ""}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, delay: index * 0.08 }}
    >
      <div className="feature-art">
        <img className="feature-image" src={image} alt={title} loading="lazy" />
        <span className="art-index">{number}</span>
      </div>
      <div className="feature-copy">
        <p className="eyebrow">{label}</p>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </motion.article>
  );
}

function App() {
  const reduce = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);
  const [registerGlow, setRegisterGlow] = useState({
    x: "50%",
    y: "50%",
    visible: false,
  });
  const [aboutGlow, setAboutGlow] = useState({
    x: "50%",
    y: "50%",
    visible: false,
  });
  const moveGlow = (event, setGlow) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setGlow({
      x: `${event.clientX - bounds.left}px`,
      y: `${event.clientY - bounds.top}px`,
      visible: true,
    });
  };
  useEffect(() => {
    if (reduce) return undefined;
    const timer = window.setInterval(
      () => setActiveSlide((slide) => (slide + 1) % heroImages.length),
      8200,
    );
    return () => window.clearInterval(timer);
  }, [reduce]);
  return (
    <div>
      <Navbar />
      <main>
        <section className="hero" id="home">
          <div className="hero-background" aria-hidden="true">
            {heroImages.map((image, index) => (
              <motion.img
                key={image.src}
                className="hero-background-image"
                src={image.src}
                alt=""
                initial={false}
                animate={{
                  opacity: index === activeSlide ? 1 : 0,
                  scale: index === activeSlide ? 1 : 1.02,
                }}
                transition={{ duration: reduce ? 0 : 0.45, ease: "easeInOut" }}
                style={{ zIndex: index === activeSlide ? 1 : 0 }}
              />
            ))}
            <div className="hero-background-overlay" />
            <div
              className="hero-slide-controls"
              aria-label="Hero slideshow controls"
            >
              {heroImages.map((image, index) => (
                <button
                  key={image.src}
                  className={index === activeSlide ? "active" : ""}
                  aria-label={`Show slide ${index + 1}`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </div>
          <div className="hero-copy">
            <h1 className="hero-title">
              <span className="hero-title-techx">TechX</span>
              <span className="hero-title-veda">Veda</span>
            </h1>
            
            <p className="hero-subtitle">Winter Bootcamp</p>
            <p className="hero-description">
              An eight-day programme combining technical learning, personal
              development and experiential education.
            </p>
            <br/>
            <div className="hero-meta">
              <span>13th - 16th December 2026 @ IIT Bombay Campus</span>
              <span>17th - 20th December 2026 @ Govardhan Eco Village</span>
            </div>
            <div className="hero-actions">
              <a className="button button-light" href="#register">
                Register now <b>↗</b>
              </a>
              <a className="text-link" href="#about">
                Explore the programme <span>↓</span>
              </a>
            </div>
          </div>
        </section>

        <section
          id="about"
          className={`about-section ${aboutGlow.visible ? "has-cursor-glow" : ""}`}
          style={{ "--glow-x": aboutGlow.x, "--glow-y": aboutGlow.y }}
          onPointerMove={(event) => moveGlow(event, setAboutGlow)}
          onPointerLeave={() =>
            setAboutGlow((glow) => ({ ...glow, visible: false }))
          }
        >
          <motion.div
            className="about-content"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="about-kicker">The programme</p>
            <h2>
              What is <span className="hero-title-techx">TechX </span><span className="hero-title-veda">Veda</span>?
            </h2>
            <p className="about-description">
              TechX Veda is an eight-day programme for students who want to
              develop competence with character. Alongside technical learning
              and career mentorship, the camp includes wellness, Indian
              wisdom, service, sustainability and cultural experiences.
            </p>
            <div className="about-details">
              <div>
                <strong>WELLNESS</strong>
                
              </div>
              <div>
                <strong>CAREER</strong>
                
              </div>
              <div>
                <strong>CULTURE</strong>
                
              </div>
            </div>
            <div className="about-partners" aria-label="Our partners">
              <p className="partners-kicker">Presented by</p>
              <div className="partners-logos">
                {partnerLogos.map((logo) => (
                  <div className="partner-logo" key={logo.src}>
                    <img src={logo.src} alt={logo.alt} />
                  </div>
                ))}
              </div>
            </div>
            {/* <div className="about-details">
              <div>
                <strong>Programme</strong>
                <span>Career &bull; Wellness &bull; Culture</span>
              </div>
              <div>
                <strong>Selection</strong>
                <span>Application screening</span>
              </div>
              <div>
                <strong>Support</strong>
                <span>&#8377;3,000 + travel</span>
              </div>
            </div> */}
          </motion.div>
          <p className="about-scroll-note">
            Scroll down to see events <span>↓</span>
          </p>
        </section>

        <section className="section" id="wellness">
          <SectionHeader
            number="01"
            eyebrow="The inner practice"
            title="Wellness"
            intro="Guided practices and discussions for everyday student life."
          />
          <div className="feature-list">
            {wellness.map((item, i) => (
              <FeatureCard key={item[2]} item={item} index={i} />
            ))}
          </div>
          <p className="closing-line">
            Sessions invite participation, reflection and questions.
          </p>
        </section>
        <section className="section career-section" id="career">
          <div className="grid-texture" />
          <SectionHeader
            number="02"
            eyebrow="The applied practice"
            title="Career"
            intro="Applied learning, collaborative problem-solving and industry mentorship."
          />
          <div className="feature-list">
            {career.map((item, i) => (
              <FeatureCard key={item[2]} item={item} index={i} />
            ))}
          </div>
        </section>
        <section className="section culture-section" id="culture">
          <SectionHeader
            number="03"
            eyebrow="The shared practice"
            title="Culture"
            intro="Community service, environmental learning and shared experiences."
          />
          <div className="culture-grid">
            {culture.map(([title, desc, image], i) => (
              <motion.article
                className="culture-card"
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
              >
                <div className="culture-art">
                  <img
                    className="culture-image"
                    src={image}
                    alt={title}
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="culture-no">Culture</p>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </motion.article>
            ))}
          </div>
          <p className="also">
            Also included:{" "}
            <strong>Vrindavan Forest Tour within Govardhan Ecovillage.</strong>
          </p>
        </section>
        <section className="register" id="register">
          <div className="register-orbit orbit-one" />
          <div className="register-orbit orbit-two" />
          <div
            className={`register-inner ${registerGlow.visible ? "has-cursor-glow" : ""}`}
            style={{ "--glow-x": registerGlow.x, "--glow-y": registerGlow.y }}
            onPointerMove={(event) => moveGlow(event, setRegisterGlow)}
            onPointerLeave={() =>
              setRegisterGlow((glow) => ({ ...glow, visible: false }))
            }
          >
            <div>
              <p className="eyebrow">The next chapter</p>
              <h2>
                Secure <em>your spot</em>
              </h2>
              <p>Register online using the link below.</p>

              <a className="button button-gold" href="/register">
                Register Now <b>↗</b>
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div className="footer-brand">
          TechX <em>Veda</em>
        </div>
        <div className="footer-contact">
          <p className="eyebrow">Contact us for any queries</p>
          <a className="footer-contact-row" href="tel:+919521277960">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.64a2 2 0 0 1-.45 2.11L8 9.75a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 2.11-.45c.86.29 1.74.5 2.64.62A2 2 0 0 1 22 16.92Z" />
            </svg>
            <span><strong>Student Coordinator: </strong> <span aria-hidden="true">·</span> +91 80034 33540</span>
          </a>
          <a className="footer-contact-row" href="mailto:wellnessclubiiita@gmail.com">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            <span>Or email us at: <strong>wellnessclubiiita@gmail.com</strong></span>
          </a>
        </div>
        <small>TECHX VEDA / 2026</small>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<RegistrationPage />} />
    </Routes>
  </BrowserRouter>,
);
