import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, useReducedMotion } from "framer-motion";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegistrationPage from "./RegistrationPage";
import "./styles.css";

const registrationUrl = "https://tinyurl.com/TechXVeda2026";
const heroImages = [
  { src: "/hero-campus.jpg", alt: "Govardhan Ecovillage campus courtyard" },
  { src: "/hero-govardhan.jpg", alt: "Green Govardhan Ecovillage landscape" },
  {
    src: "/hero-landscape.jpg",
    alt: "Pavilion and water garden at Govardhan Ecovillage",
  },
];
const partnerLogos = [
  { src: "/Logo_1_transparent.png", alt: "IIT Bombay" },
  { src: "/Logo_2_transparent.png", alt: "Microsoft" },
  { src: "/Logo_3_transparent.png", alt: "UMEED Agents Of Hope" },
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
  useEffect(() => {
    if (reduce) return undefined;
    const timer = window.setInterval(
      () => setActiveSlide((slide) => (slide + 1) % heroImages.length),
      5200,
    );
    return () => window.clearInterval(timer);
  }, [reduce]);
  return (
    <div>
      <Navbar />
      <main>
        <section className="hero" id="home">
          <div className="hero-background" aria-hidden="true">
            <motion.img
              key={heroImages[activeSlide].src}
              className="hero-background-image"
              src={heroImages[activeSlide].src}
              alt=""
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9 }}
            />
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
            <p className="kicker"></p>
            <h1>
              WINTER
              <br />
              <span>BOOTCAMP</span>
            </h1>
            <p className="hero-description">
              A ten-day programme combining technical learning, personal
              development and experiential education.
            </p>
            <div className="hero-meta">
              <span>6–15 December 2026</span>
              <span>Govardhan Ecovillage</span>
            </div>
            <div className="hero-actions">
              <a className="button button-light" href="#register">
                Register now <b>↗</b>
              </a>
              <a className="text-link" href="#wellness">
                Explore the programme <span>↓</span>
              </a>
            </div>
          </div>
        </section>

        <section className="pillars">
          <div className="pillar">
            <span>01</span>
            <h3>Wellness</h3>
            <p>Meditation, yoga and life skills</p>
          </div>
          <div className="pillar">
            <span>02</span>
            <h3>Career</h3>
            <p>AI & ML, hackathon and mentorship</p>
          </div>
          <div className="pillar">
            <span>03</span>
            <h3>Culture</h3>
            <p>Service, sustainability and shared experiences</p>
          </div>
        </section>

        <section className="partners" aria-label="Our partners">
          <p className="partners-kicker"><h2>PRESENTED BY</h2></p>
          
          <div className="partners-logos">
            {partnerLogos.map((logo) => (
              <div className="partner-logo" key={logo.src}>
                <img src={logo.src} alt={logo.alt} />
              </div>
            ))}
          </div>
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
                  <p className="culture-no">0{i + 1}</p>
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
          <div className="register-inner">
            <div>
              <p className="eyebrow">The next chapter</p>
              <h2>
                Make space
                <br />
                <em>for more.</em>
              </h2>
              <p>Scan the QR code or use the link below.</p>

              <a className="button button-gold" href="/register">
                Register Now <b>↗</b>
              </a>
            </div>
            <div className="qr-frame">
              <div className="qr-code">
                <img src="/QR.png" alt="QR code for registration" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div className="footer-brand">
          TechX <em>Veda</em>
        </div>
        <div>
          <p className="eyebrow">Winter Bootcamp 2026</p>
          <p>6-15 December 2026 · Govardhan Ecovillage</p>
        </div>
        <a href={registrationUrl} target="_blank" rel="noreferrer">
          tinyurl.com/TechXVeda2026 ↗
        </a>
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
