import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);

  // Fade-up animation on scroll
  useEffect(() => {
    const items = document.querySelectorAll(".fade-up");

    const onScroll = () => {
      items.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 120) {
          el.classList.add("show");
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="landing">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo-circle" />

        <nav className="nav-links">
          <a href="#about">About</a>
          <a href="#footer">Contact</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-bg" />

        <div className="hero-content fade-up">
          <h1>
            AI Powered <span>Fitness Planner</span>
          </h1>

          <p>
            Personalized fitness guidance using intelligent analysis and
            visual exercise demonstrations.
          </p>

          <button
            className="primary-btn"
            onClick={() => setShowAuth(true)}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section fade-up" id="about">
        <div className="container">
          <h2>Project Motivation</h2>
          <p>
            This platform analyzes user health parameters and fitness
            goals to generate personalized workout and wellness plans.
          </p>
          <p>
            By combining AI-based analysis with visual guidance, users
            can exercise safely and effectively without confusion.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer fade-up" id="footer">
        <div className="container footer-grid">
          <div>
            <h4>Project</h4>
            <p>Home</p>
            <p>About Project</p>
            <p>Careers</p>
            <p>Safety & Health</p>
            <p>Blog</p>
            <p>Press</p>
            <p>Privacy Policy</p>
          </div>

          <div>
            <h4>Terms & Policies</h4>
            <p>User Terms – Fitness Planner</p>
            <p>User Terms – AI Guidance</p>
            <p>Corporate & Academic Use</p>
            <p>Trainer Terms – Exercises</p>
            <p>Trainer Terms – Yoga & Cardio</p>
          </div>
        </div>

        <p className="footer-copy">
          © 2025 AI Fitness Planner. All rights reserved.
        </p>
      </footer>

      {/* AUTH MODAL */}
      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          setShowAuth(false);
          navigate("/planner");
        }}
      />
    </div>
  );
};

export default Landing;
