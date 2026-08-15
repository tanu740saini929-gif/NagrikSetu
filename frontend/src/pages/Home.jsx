import {
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  Users,
  FileCheck2,
  HeartHandshake,
} from "lucide-react";

import { Link } from "react-router-dom";

import "../styles/Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}

      <nav className="home-navbar">

        <Link to="/" className="home-brand">
          <div className="home-brand-icon">
            <ShieldCheck size={21} />
          </div>

          <span>NagrikSetu</span>
        </Link>


        <div className="home-nav-links">

          <a href="#how-it-works">
            How it works
          </a>

          <a href="#about">
            About
          </a>

          <Link
            to="/profile"
            className="nav-profile-button"
          >
            Create Profile
          </Link>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section className="home-hero">

        <div className="home-hero-content">

          <div className="home-eyebrow">
            <Sparkles size={14} />
            EXPLAINABLE GOVERNMENT BENEFITS
          </div>


          <h1>
            Find government benefits
            <span> made for you.</span>
          </h1>


          <p>
            Tell us about your situation in simple words.
            NagrikSetu helps identify relevant government
            schemes, explains why they may apply to you,
            and tells you what information or documents
            you may need.
          </p>


          <div className="home-actions">

            <Link
              to="/profile"
              className="home-primary-button"
            >
              Create Your Profile
              <ArrowRight size={17} />
            </Link>


            

          </div>

        </div>


        <div className="home-hero-visual">

          <div className="home-visual-circle">
            <ShieldCheck size={70} />
          </div>


          <div className="home-floating-card one">
            ✓ Transparent
          </div>


          <div className="home-floating-card two">
            ✦ Personalized
          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="home-features">

        <div className="home-feature">

          <div className="home-feature-icon">
            <ShieldCheck size={21} />
          </div>

          <h3>
            Transparent
          </h3>

          <p>
            Understand how your information is
            used to identify relevant benefits.
          </p>

        </div>


        <div className="home-feature">

          <div className="home-feature-icon">
            <Search size={21} />
          </div>

          <h3>
            Explainable
          </h3>

          <p>
            See why a government benefit may
            be relevant to your situation.
          </p>

        </div>


        <div className="home-feature">

          <div className="home-feature-icon">
            <Sparkles size={21} />
          </div>

          <h3>
            Personalized
          </h3>

          <p>
            Get recommendations based on
            your own profile and circumstances.
          </p>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section
        className="home-how"
        id="how-it-works"
      >

        <div className="home-how-inner">

          <p className="home-section-label">
            HOW IT WORKS
          </p>

          <h2>
            Government benefits,
            <br />
            made easier to understand.
          </h2>


          <div className="home-how-grid">

            <div className="home-step">

              <div className="home-step-number">
                01
              </div>

              <h3>
                Create your profile
              </h3>

              <p>
                Tell us a little about yourself,
                such as your age, state, education,
                occupation and other basic details.
              </p>

            </div>


            <div className="home-step">

              <div className="home-step-number">
                02
              </div>

              <h3>
                We understand your situation
              </h3>

              <p>
                Describe your situation in simple
                words. NagrikSetu uses the information
                to understand what kind of support
                you may need.
              </p>

            </div>


            <div className="home-step">

              <div className="home-step-number">
                03
              </div>

              <h3>
                Discover benefits
              </h3>

              <p>
                Explore government benefits that may
                match your profile and understand why
                you may be eligible.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= ABOUT ================= */}

      <section
        className="home-about"
        id="about"
      >

        <div className="home-about-inner">

          <div className="home-about-content">

            <p className="home-section-label">
              ABOUT NAGRIKSETU
            </p>

            <h2>
              Making government benefits
              <span> easier to discover.</span>
            </h2>

            <p className="home-about-description">
              Finding the right government benefit can
              sometimes be confusing. People may not know
              which schemes exist, whether they qualify,
              or which documents they need.
            </p>

            <p className="home-about-description">
              NagrikSetu is designed to simplify that
              journey. You provide information about your
              situation, and the platform helps connect
              your circumstances with potentially relevant
              government benefits.
            </p>


            <Link
              to="/profile"
              className="home-about-button"
            >
              Start with your profile
              <ArrowRight size={17} />
            </Link>

          </div>


          <div className="home-about-cards">

            <div className="about-card">

              <div className="about-card-icon">
                <Users size={22} />
              </div>

              <div>
                <h3>
                  Citizen focused
                </h3>

                <p>
                  Designed around your situation,
                  not complicated government terminology.
                </p>
              </div>

            </div>


            <div className="about-card">

              <div className="about-card-icon">
                <FileCheck2 size={22} />
              </div>

              <div>
                <h3>
                  Clear explanations
                </h3>

                <p>
                  Understand why a benefit may match
                  your profile and what you may need.
                </p>
              </div>

            </div>


            <div className="about-card">

              <div className="about-card-icon">
                <HeartHandshake size={22} />
              </div>

              <div>
                <h3>
                  Simple journey
                </h3>

                <p>
                  Create your profile, describe your
                  situation, and discover potential benefits.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}

      <section className="home-final-cta">

        <div>

          <p className="home-section-label">
            GET STARTED
          </p>

          <h2>
            Ready to discover benefits
            that may be relevant to you?
          </h2>

          <p>
            Create your profile and let NagrikSetu
            help you explore potential government benefits.
          </p>

        </div>


        <Link
          to="/profile"
          className="home-primary-button"
        >
          Create Your Profile
          <ArrowRight size={17} />
        </Link>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="home-footer">

        <div className="home-footer-brand">

          <div className="home-brand-icon">
            <ShieldCheck size={20} />
          </div>

          <div>

            <strong>
              NagrikSetu
            </strong>

            <p>
              Explainable Government Benefit Navigation
            </p>

          </div>

        </div>


        <div className="home-footer-links">

          <a href="#how-it-works">
            How it works
          </a>

          <a href="#about">
            About
          </a>

          <Link to="/profile">
            Create Profile
          </Link>

        </div>

      </footer>

    </div>
  );
}

export default Home;