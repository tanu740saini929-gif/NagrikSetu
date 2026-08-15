import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  IndianRupee,
  MapPin,
  GraduationCap,
  Briefcase,
  Users,
  Heart,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { evaluateEligibility } from "../services/api";
import "../styles/Benefits.css";

function Benefits() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBenefits();
  }, []);

  const loadBenefits = async () => {
    try {
      setLoading(true);
      setError("");

      const savedProfile =
        localStorage.getItem("nagriksetu_profile");

      const savedProfileId =
        localStorage.getItem("nagriksetu_profile_id");

      if (!savedProfile) {
        setError(
          "Please create your profile first."
        );
        setLoading(false);
        return;
      }

      const parsedProfile =
        JSON.parse(savedProfile);

      setProfile(parsedProfile);

      const profileId =
        savedProfileId ||
        parsedProfile?.id ||
        parsedProfile?.profile_id;

      if (!profileId) {
        setError(
          "Profile ID was not found. Please create your profile again."
        );
        setLoading(false);
        return;
      }

      const data =
        await evaluateEligibility(
          Number(profileId)
        );

      console.log(
        "Eligibility response:",
        data
      );

      /*
       * Your backend returns:
       *
       * {
       *   profile_id: 1,
       *   total_schemes_evaluated: 5,
       *   results: [...]
       * }
       */

      setResults(
        Array.isArray(data?.results)
          ? data.results
          : []
      );

    } catch (err) {
      console.error(
        "Unable to load benefits:",
        err
      );

      const detail =
        err?.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Unable to load government benefits. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     STATUS HELPERS
  ========================================= */

  const getStatusLabel = (status) => {
    switch (status) {
      case "eligible":
        return "Eligible";

      case "partially_eligible":
        return "Potentially Eligible";

      case "missing_information":
        return "More Information Needed";

      case "not_eligible":
        return "Not Eligible";

      default:
        return "Unknown";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "eligible":
        return "eligible";

      case "partially_eligible":
        return "partial";

      case "missing_information":
        return "missing";

      case "not_eligible":
        return "not-eligible";

      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "eligible":
        return <CheckCircle2 size={20} />;

      case "partially_eligible":
        return <AlertCircle size={20} />;

      case "missing_information":
        return <AlertCircle size={20} />;

      case "not_eligible":
        return <XCircle size={20} />;

      default:
        return <AlertCircle size={20} />;
    }
  };

  /* =========================================
     FORMAT INCOME
  ========================================= */

  const formatIncome = (income) => {
    if (
      income === null ||
      income === undefined ||
      income === ""
    ) {
      return "Not provided";
    }

    return `₹${Number(
      income
    ).toLocaleString("en-IN")}`;
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="benefits-page">

        <header className="benefits-header">

          <div className="benefits-header-inner">

            <Link
              to="/"
              className="benefits-logo"
            >
              <div className="benefits-logo-icon">
                <ShieldCheck size={20} />
              </div>

              <div>
                <strong>
                  NagrikSetu
                </strong>

                <span>
                  Government Benefit Navigation
                </span>
              </div>
            </Link>

          </div>

        </header>

        <main className="benefits-loading">

          <LoaderCircle
            size={42}
            className="spin"
          />

          <h2>
            Finding benefits for you...
          </h2>

          <p>
            We're checking your profile
            against available government schemes.
          </p>

        </main>

      </div>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error) {
    return (
      <div className="benefits-page">

        <header className="benefits-header">

          <div className="benefits-header-inner">

            <Link
              to="/"
              className="benefits-logo"
            >
              <div className="benefits-logo-icon">
                <ShieldCheck size={20} />
              </div>

              <div>
                <strong>
                  NagrikSetu
                </strong>

                <span>
                  Government Benefit Navigation
                </span>
              </div>
            </Link>

          </div>

        </header>

        <main className="benefits-empty">

          <AlertCircle size={52} />

          <h1>
            Benefits could not be loaded
          </h1>

          <p>
            {error}
          </p>

          <div className="empty-actions">

            <button
              className="primary-button"
              onClick={() =>
                navigate("/profile")
              }
            >
              Create Profile
            </button>

            <button
              className="secondary-button"
              onClick={loadBenefits}
            >
              Try Again
            </button>

          </div>

        </main>

      </div>
    );
  }

  /* =========================================
     FILTER RESULTS
  ========================================= */

  const eligibleResults =
    results.filter(
      (item) =>
        item.status === "eligible"
    );

  const partialResults =
    results.filter(
      (item) =>
        item.status ===
        "partially_eligible"
    );

  const missingResults =
    results.filter(
      (item) =>
        item.status ===
        "missing_information"
    );

  return (
    <div className="benefits-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="benefits-header">

        <div className="benefits-header-inner">

          <Link
            to="/"
            className="benefits-logo"
          >

            <div className="benefits-logo-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <strong>
                NagrikSetu
              </strong>

              <span>
                Government Benefit Navigation
              </span>
            </div>

          </Link>

          <div className="header-actions">

            <Link
              to="/profile"
              className="edit-profile-button"
            >
              Edit Profile
            </Link>

            <Link
              to="/"
              className="back-home-button"
            >
              Home
            </Link>

          </div>

        </div>

      </header>


      {/* =====================================
          MAIN
      ===================================== */}

      <main className="benefits-container">

        {/* HERO */}

        <section className="benefits-hero">

          <div>

            <p className="benefits-eyebrow">
              YOUR PERSONALIZED RESULTS
            </p>

            <h1>
              Benefits you may be eligible for
            </h1>

            <p className="benefits-subtitle">
              We compared your profile with
              available government schemes and
              explained why each result matches.
            </p>

          </div>

          <div className="result-count">

            <strong>
              {eligibleResults.length}
            </strong>

            <span>
              eligible benefits
            </span>

          </div>

        </section>


        {/* =====================================
            PROFILE SUMMARY
        ===================================== */}

        {profile && (
          <section className="profile-summary">

            <div className="summary-heading">

              <div className="summary-icon">
                <ShieldCheck size={21} />
              </div>

              <div>

                <h2>
                  Your profile
                </h2>

                <p>
                  Eligibility is based on the
                  information you provided.
                </p>

              </div>

            </div>


            <div className="summary-grid">

              <div className="summary-item">

                <UserIcon />

                <div>
                  <span>Name</span>
                  <strong>
                    {profile.name ||
                      "Not provided"}
                  </strong>
                </div>

              </div>


              <div className="summary-item">

                <span className="summary-symbol">
                  #
                </span>

                <div>
                  <span>Age</span>
                  <strong>
                    {profile.age ||
                      "Not provided"}
                  </strong>
                </div>

              </div>


              <div className="summary-item">

                <MapPin size={19} />

                <div>
                  <span>Location</span>
                  <strong>
                    {profile.district
                      ? `${profile.district}, ${profile.state}`
                      : profile.state ||
                        "Not provided"}
                  </strong>
                </div>

              </div>


              <div className="summary-item">

                <IndianRupee size={19} />

                <div>
                  <span>Annual income</span>
                  <strong>
                    {formatIncome(
                      profile.annual_income
                    )}
                  </strong>
                </div>

              </div>


              <div className="summary-item">

                <Briefcase size={19} />

                <div>
                  <span>Occupation</span>
                  <strong>
                    {profile.occupation ||
                      "Not provided"}
                  </strong>
                </div>

              </div>


              <div className="summary-item">

                <GraduationCap size={19} />

                <div>
                  <span>Education</span>
                  <strong>
                    {profile.education_level ||
                      "Not provided"}
                  </strong>
                </div>

              </div>

            </div>

          </section>
        )}


        {/* =====================================
            NO SCHEMES
        ===================================== */}

        {results.length === 0 && (
          <section className="no-results">

            <AlertCircle size={42} />

            <h2>
              No schemes found
            </h2>

            <p>
              There are currently no government
              schemes available in the system.
            </p>

            <button
              className="primary-button"
              onClick={loadBenefits}
            >
              Check Again
            </button>

          </section>
        )}


        {/* =====================================
            ELIGIBLE
        ===================================== */}

        {eligibleResults.length > 0 && (
          <section className="benefit-section">

            <div className="section-title">

              <div>
                <span className="section-number">
                  01
                </span>

                <div>
                  <h2>
                    You're eligible
                  </h2>

                  <p>
                    These schemes match all
                    currently defined eligibility
                    requirements.
                  </p>
                </div>
              </div>

              <span className="section-count">
                {eligibleResults.length}
              </span>

            </div>


            <div className="benefits-grid">

              {eligibleResults.map(
                (result) => (
                  <BenefitCard
                    key={result.scheme_id}
                    result={result}
                  />
                )
              )}

            </div>

          </section>
        )}


        {/* =====================================
            PARTIAL
        ===================================== */}

        {partialResults.length > 0 && (
          <section className="benefit-section">

            <div className="section-title">

              <div>
                <span className="section-number">
                  02
                </span>

                <div>
                  <h2>
                    Potentially eligible
                  </h2>

                  <p>
                    Some requirements match,
                    but additional information may
                    be needed.
                  </p>
                </div>
              </div>

              <span className="section-count">
                {partialResults.length}
              </span>

            </div>


            <div className="benefits-grid">

              {partialResults.map(
                (result) => (
                  <BenefitCard
                    key={result.scheme_id}
                    result={result}
                  />
                )
              )}

            </div>

          </section>
        )}


        {/* =====================================
            MISSING
        ===================================== */}

        {missingResults.length > 0 && (
          <section className="benefit-section">

            <div className="section-title">

              <div>
                <span className="section-number">
                  03
                </span>

                <div>
                  <h2>
                    Need more information
                  </h2>

                  <p>
                    These schemes may match you,
                    but some information is missing.
                  </p>
                </div>
              </div>

              <span className="section-count">
                {missingResults.length}
              </span>

            </div>


            <div className="benefits-grid">

              {missingResults.map(
                (result) => (
                  <BenefitCard
                    key={result.scheme_id}
                    result={result}
                  />
                )
              )}

            </div>

          </section>
        )}


        {/* =====================================
            FOOTER NOTE
        ===================================== */}

        <section className="benefits-note">

          <ShieldCheck size={21} />

          <div>

            <strong>
              Transparent eligibility
            </strong>

            <p>
              NagrikSetu shows you the reasons
              behind each result. Eligibility
              information should always be verified
              with the official government
              department before applying.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}


/* =========================================
   BENEFIT CARD
========================================= */

function BenefitCard({ result }) {
  const navigate = useNavigate();

  const statusClass =
    result.status === "eligible"
      ? "eligible"
      : result.status ===
        "partially_eligible"
      ? "partial"
      : result.status ===
        "missing_information"
      ? "missing"
      : "not-eligible";

  const statusLabel =
    result.status === "eligible"
      ? "Eligible"
      : result.status ===
        "partially_eligible"
      ? "Potentially Eligible"
      : result.status ===
        "missing_information"
      ? "More Information Needed"
      : "Not Eligible";

  const handleViewDetails = () => {
    navigate(
      `/scheme/${result.scheme_id}`,
      {
        state: {
          scheme: result,
        },
      }
    );
  };

  return (
    <article className="benefit-card">

      {/* CARD HEADER */}

      <div className="benefit-card-top">

        <div className="scheme-icon">
          <ShieldCheck size={23} />
        </div>

        <div className="scheme-title">

          <h3>
            {result.scheme}
          </h3>

          <div
            className={`status-badge ${statusClass}`}
          >
            {result.status ===
            "eligible" ? (
              <CheckCircle2 size={15} />
            ) : (
              <AlertCircle size={15} />
            )}

            {statusLabel}
          </div>

        </div>

      </div>


      {/* SCORE */}

      <div className="match-section">

        <div className="match-header">

          <span>
            Eligibility match
          </span>

          <strong>
            {result.score}%
          </strong>

        </div>

        <div className="match-bar">

          <div
            className={`match-fill ${statusClass}`}
            style={{
              width: `${result.score}%`,
            }}
          />

        </div>

      </div>


      {/* BENEFITS */}

      {result.benefits?.length > 0 && (
        <div className="card-section">

          <h4>
            Benefits
          </h4>

          <ul className="benefit-list">

            {result.benefits.map(
              (benefit, index) => (
                <li key={index}>

                  <CheckCircle2 size={16} />

                  <span>
                    {benefit}
                  </span>

                </li>
              )
            )}

          </ul>

        </div>
      )}


      {/* PASSED RULES */}

      {result.passed_rules?.length > 0 && (
        <div className="card-section">

          <h4>
            Why you match
          </h4>

          <div className="rule-list">

            {result.passed_rules
              .slice(0, 4)
              .map((rule, index) => (

                <div
                  className="rule passed"
                  key={index}
                >

                  <CheckCircle2 size={16} />

                  <div>
                    <strong>
                      {formatRuleName(
                        rule.rule
                      )}
                    </strong>

                    <span>
                      {rule.message}
                    </span>
                  </div>

                </div>

              ))}

          </div>

        </div>
      )}


      {/* FAILED RULES */}

      {result.failed_rules?.length > 0 && (
        <div className="card-section">

          <h4>
            Requirements not met
          </h4>

          <div className="rule-list">

            {result.failed_rules
              .slice(0, 3)
              .map((rule, index) => (

                <div
                  className="rule failed"
                  key={index}
                >

                  <XCircle size={16} />

                  <div>
                    <strong>
                      {formatRuleName(
                        rule.rule
                      )}
                    </strong>

                    <span>
                      {rule.message}
                    </span>
                  </div>

                </div>

              ))}

          </div>

        </div>
      )}


      {/* MISSING INFORMATION */}

      {result.missing_information
        ?.length > 0 && (
        <div className="card-section">

          <h4>
            Information needed
          </h4>

          <div className="rule-list">

            {result.missing_information.map(
              (rule, index) => (

                <div
                  className="rule missing-rule"
                  key={index}
                >

                  <AlertCircle size={16} />

                  <div>
                    <strong>
                      {formatRuleName(
                        rule.rule
                      )}
                    </strong>

                    <span>
                      {rule.message}
                    </span>
                  </div>

                </div>

              )
            )}

          </div>

        </div>
      )}


      {/* DOCUMENTS */}

      {result.required_documents
        ?.length > 0 && (
        <div className="documents-section">

          <div className="documents-heading">

            <FileText size={17} />

            <strong>
              Documents you may need
            </strong>

          </div>

          <ul>

            {result.required_documents.map(
              (document, index) => (
                <li key={index}>
                  {document}
                </li>
              )
            )}

          </ul>

        </div>
      )}


      {/* VIEW DETAILS */}

      <button
        className="view-details-button"
        onClick={handleViewDetails}
      >
        View Scheme Details
      </button>

    </article>
  );
}


/* =========================================
   RULE NAME
========================================= */

function formatRuleName(rule) {
  if (!rule) {
    return "Requirement";
  }

  return rule
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}


/* =========================================
   USER ICON
========================================= */

function UserIcon() {
  return (
    <Users size={19} />
  );
}

export default Benefits;