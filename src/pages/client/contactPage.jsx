import { motion } from "framer-motion";
import "./contactPage.css";

const contactMethods = [
  {
    label: "Email us",
    value: "pasindujaya687@gmail.com",
    description: "Expect a thoughtful reply within one business day.",
    action: "Send an email",
  },
  {
    label: "Call / WhatsApp",
    value: "+94 71 569 3636",
    description: "Talk directly with the founder team from 9am - 7pm IST.",
    action: "Tap to call",
  },
  {
    label: "Studio address",
    value: "No 41, Siyanee Sobha Uyana, Yakkala",
    description: "Visit by appointment for tactile previews and fittings.",
    action: "Plan a visit",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function ContactPage() {
  return (
    <div className="contact-page">
      <div className="contact-shell">
        <section className="contact-hero">
          <motion.p className="eyebrow" initial="hidden" animate="show" variants={fadeIn}>
            Contact Wealth
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeIn}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Let’s build your next ritual together.
          </motion.h1>
          <motion.p
            className="lead"
            initial="hidden"
            animate="show"
            variants={fadeIn}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            Reach out the way you prefer. Every message is answered by our core crew—no bots, no escalations.
          </motion.p>
        </section>

        <section className="contact-grid">
          {contactMethods.map((method, index) => (
            <motion.article
              key={method.label}
              className="contact-card"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              variants={fadeIn}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
            >
              <p className="contact-label">{method.label}</p>
              <h3>{method.value}</h3>
              <p className="contact-copy">{method.description}</p>
              <div className="contact-action">
                <span>{method.action}</span>
                <span className="contact-pulse" />
              </div>
            </motion.article>
          ))}
        </section>

        <motion.section
          className="contact-note"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeIn}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2>Office hours</h2>
          <p>Monday – Saturday · 9:00 AM – 7:00 PM IST · Sunday by appointment only.</p>
          <p>We’re usually faster than these hours suggest—ping us anytime and we’ll get back as soon as possible.</p>
        </motion.section>
      </div>
    </div>
  );
}
