import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import "./App.css";

/* ---------- Data ---------- */
const INITIAL_PROJECTS = [
  { id: 1, title: "Tidewatch", category: "Web", description: "Live dashboard for small-boat harbours showing tides, wind and berth availability.", tags: ["React", "D3", "Node"], link: "#" },
  { id: 2, title: "Pocket Ledger", category: "Mobile", description: "Offline-first expense tracker with shared household budgets.", tags: ["React Native", "SQLite"], link: "#" },
  { id: 3, title: "Plainform", category: "Web", description: "Accessible form builder that exports clean, semantic HTML.", tags: ["TypeScript", "React"], link: "#" },
  { id: 4, title: "Fieldnotes CLI", category: "Tools", description: "Command-line tool that turns markdown notes into a searchable site.", tags: ["Node", "CLI"], link: "#" },
];

const SKILLS = [
  { group: "Frontend", items: ["React", "TypeScript", "CSS / Sass", "Accessibility"] },
  { group: "Backend", items: ["Node.js", "Express", "PostgreSQL", "REST & GraphQL"] },
  { group: "Workflow", items: ["Git", "Jest & Testing Library", "CI/CD", "Figma"] },
];

/* ---------- Reusable components ---------- */
function Header({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo" onClick={close}>ADEKALU</Link>
        <button className="icon-btn menu-btn" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? "✕" : "☰"}
        </button>
        <nav className={`nav ${open ? "open" : ""}`}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/projects" onClick={close}>Projects</NavLink>
          <NavLink to="/contact" onClick={close}>Contact</NavLink>
          <button className="icon-btn" onClick={onToggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero container">
      <p className="hero-kicker">Frontend developer based in Lagos</p>
      <h1>I build fast, accessible interfaces for the web.</h1>
      <p className="hero-sub">Five years turning messy product ideas into clear, dependable React applications.</p>
      <div className="hero-actions">
        <Link className="btn" to="/projects">See my work</Link>
        <Link className="btn btn-ghost" to="/contact">Get in touch</Link>
      </div>
    </section>
  );
}

function ProjectCard({ project, onRemove }) {
  return (
    <article className="card">
      <span className="badge">{project.category}</span>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <ul className="tags">{project.tags.map((t) => <li key={t}>{t}</li>)}</ul>
      <div className="card-actions">
        <a href={project.link}>View project</a>
        {onRemove && <button className="link-btn" onClick={() => onRemove(project.id)}>Remove</button>}
      </div>
    </article>
  );
}

function Projects({ projects, onRemove, limit }) {
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...new Set(projects.map((p) => p.category))];
  const visible = projects.filter((p) => filter === "All" || p.category === filter).slice(0, limit || projects.length);

  return (
    <section className="section container">
      <div className="section-head">
        <h2>{limit ? "Selected projects" : "Projects"}</h2>
        {!limit && (
          <div className="filters" role="group" aria-label="Filter projects">
            {categories.map((c) => (
              <button key={c} className={`chip ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
        )}
      </div>
      {visible.length ? (
        <div className="grid">
          {visible.map((p) => <ProjectCard key={p.id} project={p} onRemove={limit ? null : onRemove} />)}
        </div>
      ) : (
        <p className="empty">No projects here yet. Pick another category.</p>
      )}
      {limit && <Link className="more" to="/projects">All projects</Link>}
    </section>
  );
}

function Skills() {
  return (
    <section className="section container">
      <h2>Skills</h2>
      <div className="grid skills">
        {SKILLS.map((s) => (
          <div className="card" key={s.group}>
            <h3>{s.group}</h3>
            <ul className="plain">{s.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = (v) => {
    const e = {};
    if (!v.name.trim()) e.name = "Enter your name.";
    if (!v.email.trim()) e.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Enter a valid email, like name@example.com.";
    if (v.message.trim().length < 10) e.message = "Write at least 10 characters.";
    return e;
  };

  const handleChange = (e) => {
    const next = { ...values, [e.target.name]: e.target.value };
    setValues(next);
    setSent(false);
    if (errors[e.target.name]) setErrors(validate(next));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      // Replace with a real request (fetch, EmailJS, etc.)
      console.log("Message sent:", values);
      setSent(true);
      setValues({ name: "", email: "", message: "" });
    }
  };

  const field = (name, label, props = {}) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {name === "message" ? (
        <textarea id={name} name={name} rows="5" value={values[name]} onChange={handleChange} aria-invalid={!!errors[name]} />
      ) : (
        <input id={name} name={name} value={values[name]} onChange={handleChange} aria-invalid={!!errors[name]} {...props} />
      )}
      {errors[name] && <span className="error" role="alert">{errors[name]}</span>}
    </div>
  );

  return (
    <section className="section container narrow">
      <h2>Contact</h2>
      <p className="hero-sub">Have a project or a role in mind? Send a message and I will reply within two working days.</p>
      <form onSubmit={handleSubmit} noValidate>
        {field("name", "Name", { type: "text", autoComplete: "name" })}
        {field("email", "Email", { type: "email", autoComplete: "email" })}
        {field("message", "Message")}
        <button className="btn" type="submit">Send message</button>
        {sent && <p className="success" role="status">Message sent. Thank you, I will be in touch.</p>}
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} ADEKALU</span>
        <span className="footer-links">
          <a href="https://github.com">GitHub</a>
          <a href="https://linkedin.com">LinkedIn</a>
        </span>
      </div>
    </footer>
  );
}

/* ---------- Pages ---------- */
const Home = ({ projects }) => (
  <>
    <Hero />
    <Projects projects={projects} limit={3} />
    <Skills />
  </>
);

/* ---------- App ---------- */
export default function App() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const removeProject = (id) => setProjects((prev) => prev.filter((p) => p.id !== id));

  return (
    <BrowserRouter>
      <Header theme={theme} onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />
      <main>
        <Routes>
          <Route path="/" element={<Home projects={projects} />} />
          <Route path="/projects" element={<Projects projects={projects} onRemove={removeProject} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<section className="section container"><h2>Page not found</h2><Link className="more" to="/">Back to home</Link></section>} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
