import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./aboutPage.css";

const stats = [
  { value: "New", label: "Launched in 2025" },
  { value: "100%", label: "Quality commitment" },
  { value: "Local", label: "Starting community-focused" },
  { value: "Growing", label: "Building our first customers" },
];

const missionCards = [
  {
    label: "Mission",
    title: "Quality you can trust",
    copy: "We're building a shop focused on carefully selected products that add real value to your daily life.",
  },
  {
    label: "Promise",
    title: "Honest service",
    copy: "As a new business, we're committed to transparency, great customer service, and earning your trust with every order.",
  },
  {
    label: "Vision",
    title: "Sustainable growth",
    copy: "We're starting small and growing responsibly, prioritizing quality products and happy customers over rapid expansion.",
  },
];

const journey = [
  {
    year: "2025",
    subtitle: "Origin drop",
    badge: "Launch",
    title: "The beginning",
    copy:
      "Bata sketched Wealth as a quietly curated corner of the internet—only the essentials that blend craftsmanship with utility made it into the first drop.",
  },
  {
    year: "Today",
    subtitle: "Beta pulse",
    badge: "Now",
    title: "Beta launch",
    copy:
      "We are still hands-on with every order: testing packaging, refining product photography, and learning from the earliest community members in real time.",
  },
  {
    year: "Tomorrow",
    subtitle: "Listening loop",
    badge: "Next",
    title: "Growing together",
    copy:
      "You tell us what belongs on the shelf, we prototype fast, and the collection adapts with every feedback call and inbox note you share.",
    meta: "Open beta feedback loop",
    tags: ["Live roadmap", "Community picks"],
    variant: "callout",
  },
  {
    year: "Future",
    subtitle: "Community-owned rituals",
    badge: "Beyond",
    title: "Building community",
    copy:
      "The long game is a member-led marketplace where sourcing trips, capsule drops, and loyalty perks are shaped by the people who collect them.",
  },
];

const values = [
  {
    number: "01",
    title: "Quality first",
    copy: "Every product we offer is personally reviewed and tested. We only stock items we'd be proud to use ourselves.",
    tags: ["Carefully curated", "Tested products"],
  },
  {
    number: "02",
    title: "Customer focused",
    copy: "As a new business, every customer matters. We're here to answer questions, solve problems, and make your experience great.",
    tags: ["Responsive support", "Personal service"],
  },
  {
    number: "03",
    title: "Honest pricing",
    copy: "Fair prices, no gimmicks. We believe in transparent pricing and delivering real value with every purchase.",
    tags: ["Fair pricing", "No hidden fees"],
  },
];

const serviceHighlights = [
  { title: "Fast dispatch", copy: "Orders leave within 24 hours from our micro hub.", note: "Avg. 19h handling" },
  { title: "Secure checkout", copy: "Encrypted payments and double-audited privacy policies.", note: "PCI-DSS + audits" },
  { title: "Founders on support", copy: "You talk directly to the core team with every ticket.", note: "< 2h response" },
];

const fadeIn = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

const popIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1 },
};

const staggerList = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export default function AboutPage() {
  return (
    <div className="about-page about-page--mono">
      <div className="about-content">
        <section className="about-hero">
          <motion.div
            className="hero-copy"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.45 }}
            variants={fadeIn}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="eyebrow">About Wealth</p>
            <h1>
              A monochrome retail lab where quality and value move in sync.
            </h1>
            <p>
              Wealth is a fresh commerce studio by Bata. We started with a mission to celebrate essentials that look sharp,
              perform daily, and arrive without noise. Every drop is hand-vetted, photographed in-house, and backed by
              concierge-level follow up.
            </p>
            <div className="hero-cta">
              <Link to="/products" className="cta-primary">
                Browse the collection
              </Link>
              <Link to="/contact-us" className="cta-secondary">
                Start a conversation
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hero-panel"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={popIn}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div className="hero-grid" variants={staggerList} initial="hidden" animate="show">
              {serviceHighlights.map((item, index) => (
                <motion.article
                  key={item.title}
                  className="hero-card"
                  variants={fadeIn}
                  animate={{ y: [0, index % 2 === 0 ? -10 : 10, 0] }}
                  transition={{ repeat: Infinity, duration: 7 + index, ease: "easeInOut" }}
                >
                  <div className="hero-card__head">
                    <span className="hero-card__chip">{`0${index + 1}`}</span>
                    <span className="hero-card__note">{item.note}</span>
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.copy}</p>
                  <div className="hero-card__divider" />
                  <div className="hero-card__foot">
                    <span>Always-on</span>
                    <span className="hero-card__pulse" />
                    <span>Human team</span>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </motion.div>
        </section>

        <section className="stats-grid">
          {stats.map((stat, index) => (
            <motion.article
              key={stat.label}
              className="stat-card"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              variants={fadeIn}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </motion.article>
          ))}
        </section>

        <section className="mission-grid">
          {missionCards.map((card, index) => (
            <motion.article
              key={card.title}
              className="mission-card"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.45 }}
              variants={fadeIn}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
            >
              <span>{card.label}</span>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </motion.article>
          ))}
        </section>

        <section className="journey">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeIn}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Our story in four beats
          </motion.h2>
          <motion.ol
            className="timeline-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={staggerList}
          >
            {journey.map((item) => (
              <motion.li
                key={item.year}
                className={`timeline-card ${item.variant === "callout" ? "timeline-card--callout" : ""}`}
                variants={fadeIn}
              >
                <div className="timeline-header">
                  <div className="timeline-marker">
                    <span>{item.year}</span>
                    {item.subtitle && <small>{item.subtitle}</small>}
                  </div>
                  {item.badge && <span className="timeline-badge">{item.badge}</span>}
                </div>
                <div className="timeline-body">
                  <div className="timeline-title-row">
                    <h3>{item.title}</h3>
                    {item.meta && <p className="timeline-meta">{item.meta}</p>}
                  </div>
                  <p>{item.copy}</p>
                  {item.tags && (
                    <div className="timeline-tags">
                      {item.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </section>

        <section className="values">
          {values.map((value, index) => (
            <motion.article
              key={value.title}
              className="value-card"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeIn}
              transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.1 }}
            >
              <span className="eyebrow">{value.number}</span>
              <h3>{value.title}</h3>
              <p>{value.copy}</p>
              <div className="value-tags">
                {value.tags.map((tag) => (
                  <span key={tag} className="value-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </section>

        <motion.section
          className="cta-panel cta-panel--mono"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={popIn}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div>
            <p className="eyebrow">Join us</p>
            <h2>Be part of the first hundred customers</h2>
            <p>
              Every insight you share now informs the catalogue, packaging, and post-purchase rituals we ship tomorrow.
              Plug into the build and claim founder perks for life.
            </p>
          </div>
          <div className="hero-cta">
            <Link to="/contact-us" className="cta-primary">
              Contact the studio
            </Link>
            <Link to="/products" className="cta-secondary">
              Start shopping
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}