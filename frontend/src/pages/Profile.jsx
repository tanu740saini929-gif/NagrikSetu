import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  UserRound,
  MapPin,
  GraduationCap,
  Users,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";

import { createProfile } from "../services/api";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    age: "",
    state: "",
    district: "",
    annual_income: "",
    occupation: "",
    student_status: "",
    education_level: "",
    gender: "",
    family_situation: "",
    beneficiary: "",
    need: "",
  });

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const nextStep = () => {
    setError("");

    if (step === 1) {
      if (!form.name.trim()) {
        setError("Please enter your name.");
        return;
      }

      if (!form.age || Number(form.age) <= 0) {
        setError("Please enter a valid age.");
        return;
      }
    }

    if (step === 2) {
      if (!form.state.trim()) {
        setError("Please enter your state.");
        return;
      }

      if (!form.district.trim()) {
        setError("Please enter your district.");
        return;
      }
    }

    if (step === 3) {
      if (!form.annual_income) {
        setError("Please enter your annual household income.");
        return;
      }

      if (!form.occupation) {
        setError("Please select your occupation.");
        return;
      }
    }

    if (step < 4) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    setError("");

    if (step > 1) {
      setStep(step - 1);
    }
  };

  const submitProfile = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.education_level) {
      setError("Please select your education level.");
      return;
    }

    if (!form.gender) {
      setError("Please select your gender.");
      return;
    }

    if (!form.family_situation.trim()) {
      setError("Please describe your family situation.");
      return;
    }

    if (!form.beneficiary) {
      setError("Please select the beneficiary type.");
      return;
    }

    if (!form.need) {
      setError("Please select what you need help with.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        age: Number(form.age),
        state: form.state.trim(),
        district: form.district.trim(),
        annual_income: Number(form.annual_income),
        occupation: form.occupation,
        student_status: form.student_status || null,
        education_level: form.education_level,
        gender: form.gender,
        family_situation: form.family_situation.trim(),
        beneficiary: form.beneficiary,
        need: form.need,
        original_description: null,
      };

      console.log("Creating profile:", payload);

      const response = await createProfile(payload);

      console.log("Profile created:", response);

      const profile = response?.data || response;

      if (!profile?.id) {
        throw new Error("Profile was created but no profile ID was returned.");
      }

      localStorage.setItem(
        "nagriksetu_profile_id",
        String(profile.id)
      );

      localStorage.setItem(
        "nagriksetu_profile",
        JSON.stringify(profile)
      );

      localStorage.setItem(
        "nagriksetu_profile_data",
        JSON.stringify(profile)
      );

      navigate("/benefits");

    } catch (err) {
      console.error("Profile creation error:", err);

      if (err.response) {
        const detail = err.response.data?.detail;

        setError(
          Array.isArray(detail)
            ? detail.map((item) => item.msg).join(", ")
            : detail || "Unable to create your profile."
        );
      } else if (err.request) {
        setError(
          "Cannot connect to NagrikSetu. Please make sure FastAPI is running on port 8000."
        );
      } else {
        setError(
          err.message || "Something went wrong."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">

      {/* NAVBAR */}
      <nav className="profile-navbar">
        <Link to="/" className="brand">
          <span className="brand-icon">
            <UserRound size={20} />
          </span>

          <span>
            Nagrik<span>Setu</span>
          </span>
        </Link>

        <Link to="/" className="back-home">
          Back to Home
        </Link>
      </nav>

      {/* HEADER */}
      <section className="profile-header">
        <div className="profile-header-icon">
          <UserRound size={30} />
        </div>

        <h1>Create Your Profile</h1>

        <p>
          Tell us about yourself so NagrikSetu can find
          government benefits relevant to you.
        </p>
      </section>

      {/* PROGRESS */}
      <div className="profile-progress">

        {[1, 2, 3, 4].map((number) => (
          <div
            className={`progress-step ${
              step >= number ? "active" : ""
            }`}
            key={number}
          >
            <div className="progress-circle">
              {step > number ? (
                <CheckCircle2 size={19} />
              ) : (
                number
              )}
            </div>

            <span>
              {number === 1 && "Basic"}
              {number === 2 && "Location"}
              {number === 3 && "Income & Work"}
              {number === 4 && "Situation"}
            </span>
          </div>
        ))}

      </div>

      {/* FORM */}
      <main className="profile-container">

        <form
          className="profile-card"
          onSubmit={submitProfile}
        >

          {/* STEP 1 */}
          {step === 1 && (
            <div className="form-step">

              <div className="step-heading">
                <UserRound size={25} />

                <div>
                  <h2>Basic Information</h2>
                  <p>Let's start with some basic details.</p>
                </div>
              </div>

              <div className="form-grid">

                <div className="field full">
                  <label>Full Name *</label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) =>
                      updateField("name", e.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label>Age *</label>

                  <input
                    type="number"
                    min="1"
                    max="120"
                    placeholder="Your age"
                    value={form.age}
                    onChange={(e) =>
                      updateField("age", e.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label>Gender *</label>

                  <select
                    value={form.gender}
                    onChange={(e) =>
                      updateField("gender", e.target.value)
                    }
                  >
                    <option value="">
                      Select gender
                    </option>
                    <option value="female">
                      Female
                    </option>
                    <option value="male">
                      Male
                    </option>
                    <option value="other">
                      Other
                    </option>
                  </select>
                </div>

              </div>

            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="form-step">

              <div className="step-heading">
                <MapPin size={25} />

                <div>
                  <h2>Location</h2>
                  <p>
                    Some government schemes are state-specific.
                  </p>
                </div>
              </div>

              <div className="form-grid">

                <div className="field">
                  <label>State *</label>

                  <input
                    type="text"
                    placeholder="e.g. Uttarakhand"
                    value={form.state}
                    onChange={(e) =>
                      updateField("state", e.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label>District *</label>

                  <input
                    type="text"
                    placeholder="e.g. Dehradun"
                    value={form.district}
                    onChange={(e) =>
                      updateField("district", e.target.value)
                    }
                  />
                </div>

              </div>

            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="form-step">

              <div className="step-heading">
                <IndianRupee size={25} />

                <div>
                  <h2>Income & Occupation</h2>
                  <p>
                    These details help us determine financial eligibility.
                  </p>
                </div>
              </div>

              <div className="form-grid">

                <div className="field">
                  <label>Annual Household Income *</label>

                  <div className="input-with-icon">
                    <IndianRupee size={17} />

                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 150000"
                      value={form.annual_income}
                      onChange={(e) =>
                        updateField(
                          "annual_income",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Occupation *</label>

                  <select
                    value={form.occupation}
                    onChange={(e) =>
                      updateField(
                        "occupation",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select occupation
                    </option>

                    <option value="student">
                      Student
                    </option>

                    <option value="farmer">
                      Farmer
                    </option>

                    <option value="self employed">
                      Self Employed
                    </option>

                    <option value="private employee">
                      Private Employee
                    </option>

                    <option value="government employee">
                      Government Employee
                    </option>

                    <option value="unemployed">
                      Unemployed
                    </option>

                    <option value="daily wage worker">
                      Daily Wage Worker
                    </option>

                    <option value="other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="field">
                  <label>Student Status</label>

                  <select
                    value={form.student_status}
                    onChange={(e) =>
                      updateField(
                        "student_status",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select status
                    </option>

                    <option value="yes">
                      Yes
                    </option>

                    <option value="no">
                      No
                    </option>
                  </select>
                </div>

              </div>

            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="form-step">

              <div className="step-heading">
                <Users size={25} />

                <div>
                  <h2>Your Situation</h2>
                  <p>
                    Help us understand what kind of support you need.
                  </p>
                </div>
              </div>

              <div className="form-grid">

                <div className="field">
                  <label>Education Level *</label>

                  <select
                    value={form.education_level}
                    onChange={(e) =>
                      updateField(
                        "education_level",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select education
                    </option>

                    <option value="school">
                      School
                    </option>

                    <option value="college">
                      College
                    </option>

                    <option value="graduate">
                      Graduate
                    </option>

                    <option value="postgraduate">
                      Postgraduate
                    </option>

                    <option value="none">
                      No Formal Education
                    </option>
                  </select>
                </div>

                <div className="field">
                  <label>Who needs the benefit? *</label>

                  <select
                    value={form.beneficiary}
                    onChange={(e) =>
                      updateField(
                        "beneficiary",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select beneficiary
                    </option>

                    <option value="student">
                      Student
                    </option>

                    <option value="women">
                      Woman
                    </option>

                    <option value="farmer">
                      Farmer
                    </option>

                    <option value="senior citizen">
                      Senior Citizen
                    </option>

                    <option value="family">
                      Family
                    </option>

                    <option value="self">
                      Myself
                    </option>
                  </select>
                </div>

                <div className="field full">
                  <label>Family Situation *</label>

                  <textarea
                    rows="4"
                    placeholder="Tell us briefly about your family situation..."
                    value={form.family_situation}
                    onChange={(e) =>
                      updateField(
                        "family_situation",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="field full">
                  <label>What do you need help with? *</label>

                  <select
                    value={form.need}
                    onChange={(e) =>
                      updateField(
                        "need",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select your need
                    </option>

                    <option value="education">
                      Education
                    </option>

                    <option value="employment">
                      Employment
                    </option>

                    <option value="financial assistance">
                      Financial Assistance
                    </option>

                    <option value="healthcare">
                      Healthcare
                    </option>

                    <option value="housing">
                      Housing
                    </option>

                    <option value="agriculture">
                      Agriculture
                    </option>

                    <option value="women welfare">
                      Women Welfare
                    </option>

                    <option value="other">
                      Other
                    </option>
                  </select>
                </div>

              </div>

            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="form-actions">

            {step > 1 ? (
              <button
                type="button"
                className="secondary-btn"
                onClick={previousStep}
                disabled={loading}
              >
                <ArrowLeft size={18} />
                Back
              </button>
            ) : (
              <Link
                to="/"
                className="secondary-btn"
              >
                Cancel
              </Link>
            )}

            {step < 4 ? (
              <button
                type="button"
                className="primary-btn"
                onClick={nextStep}
              >
                Continue
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                className="primary-btn"
                disabled={loading}
              >
                {loading ? (
                  "Creating Profile..."
                ) : (
                  <>
                    Discover My Benefits
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}

          </div>

        </form>

      </main>
    </div>
  );
}

export default Profile;