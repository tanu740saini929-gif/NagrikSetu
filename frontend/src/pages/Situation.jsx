import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  LoaderCircle,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { extractProfile } from "../services/api";
import "../styles/Situation.css";

function Situation() {
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const exampleText =
    "I am a college student from Uttarakhand. My family income is around ₹2 lakh per year and I need financial help for my education.";

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!description.trim()) {
      setError("Please describe your situation before continuing.");
      return;
    }

    if (description.trim().length < 15) {
      setError("Please provide a little more information about your situation.");
      return;
    }

    try {
      setLoading(true);

      const data = await extractProfile(description.trim());

      console.log("Profile extraction response:", data);

      /*
       * Backend response:
       *
       * {
       *   success: true,
       *   extracted_profile: {...}
       * }
       */

      if (!data || !data.extracted_profile) {
        throw new Error("The backend returned an invalid profile.");
      }

      localStorage.setItem(
        "nagriksetu_extracted_profile",
        JSON.stringify(data.extracted_profile)
      );

      localStorage.setItem(
        "nagriksetu_original_description",
        description.trim()
      );

      navigate("/profile");
    } catch (err) {
      console.error("Profile extraction error:", err);

      if (err.response) {
        setError(
          err.response.data?.detail ||
            "The backend could not process your information."
        );
      } else if (err.request) {
        setError(
          "Unable to connect to the NagrikSetu backend. Please try again in a moment."
        );
      } else {
        setError(
          err.message ||
            "Something went wrong while processing your information."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const useExample = () => {
    setDescription(exampleText);
    setError("");
  };

  return (
    <div className="situation-page">

      <nav className="situation-navbar">

        <Link to="/" className="situation-brand">
          <span className="situation-brand-icon">🏛️</span>
          <span>NagrikSetu</span>
        </Link>

        <div className="progress">

          <div className="progress-step active">
            <span>1</span>
            Situation
          </div>

          <div className="progress-line" />

          <div className="progress-step">
            <span>2</span>
            Profile
          </div>

          <div className="progress-line" />

          <div className="progress-step">
            <span>3</span>
            Benefits
          </div>

        </div>

      </nav>

      <main className="situation-container">

        <div className="back-link-wrapper">
          <Link to="/" className="back-link">
            <ArrowLeft size={17} />
            Back to Home
          </Link>
        </div>

        <section className="situation-card">

          <div className="situation-header">

            <div className="situation-icon">
              <Sparkles size={26} />
            </div>

            <div>
              <p className="step-label">STEP 1</p>

              <h1>Tell us about your situation</h1>

              <p className="subtitle">
                You don't need to know the name of a government scheme.
                Just explain what kind of help you are looking for.
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            <label htmlFor="description">
              Describe your situation
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setError("");
              }}
              placeholder="For example: I am a student from Uttarakhand. My family income is ₹2 lakh per year and I need financial help for my education..."
              rows={9}
              disabled={loading}
            />

            <div className="textarea-footer">
              <span>
                {description.length} characters
              </span>

              <button
                type="button"
                className="example-button"
                onClick={useExample}
                disabled={loading}
              >
                Use example
              </button>
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="privacy-note">

              <ShieldCheck size={18} />

              <div>
                <strong>Your information</strong>

                <p>
                  Your description is used to create a profile for
                  benefit matching. You can review the information
                  before continuing.
                </p>
              </div>

            </div>

            <div className="form-actions">

              <Link to="/" className="secondary-button">
                <ArrowLeft size={18} />
                Back
              </Link>

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle
                      size={19}
                      className="spin"
                    />
                    Understanding...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight size={19} />
                  </>
                )}
              </button>

            </div>

          </form>

        </section>

        <div className="how-note">
          <Sparkles size={17} />

          <span>
            NagrikSetu will identify useful information such as
            age, state, income, occupation, education and your
            type of need.
          </span>
        </div>

      </main>

    </div>
  );
}

export default Situation;