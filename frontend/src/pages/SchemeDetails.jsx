import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Check,
  CheckCircle,
  ExternalLink,
  FileText,
  Info,
  LoaderCircle,
  ShieldCheck,
  X,
  CircleHelp,
} from "lucide-react";

import { getScheme } from "../services/api";
import "./SchemeDetails.css";

function SchemeDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const stateScheme = location.state?.scheme;

  const [scheme, setScheme] = useState(stateScheme || null);
  const [loading, setLoading] = useState(!stateScheme);
  const [error, setError] = useState("");

  /*
   * -------------------------------------------------------
   * LOAD SCHEME
   *
   * If the page was opened from Benefits, React Router state
   * contains the scheme.
   *
   * If the user refreshes the page, router state disappears.
   * In that case we fetch the scheme using /api/schemes/{id}.
   * -------------------------------------------------------
   */
  useEffect(() => {
    let mounted = true;

    const loadScheme = async () => {
      if (stateScheme) {
        setScheme(stateScheme);
        setLoading(false);
        return;
      }

      if (!id) {
        setError("Scheme ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getScheme(id);

        if (!mounted) return;

        setScheme(data);

        // Save for a smoother return/refresh experience.
        sessionStorage.setItem(
          `nagriksetu_scheme_${id}`,
          JSON.stringify(data)
        );
      } catch (err) {
        console.error("Unable to load scheme:", err);

        /*
         * Try sessionStorage as a fallback.
         */
        try {
          const cached = sessionStorage.getItem(
            `nagriksetu_scheme_${id}`
          );

          if (cached) {
            setScheme(JSON.parse(cached));
          } else {
            setError(
              "Unable to load this scheme. Please return to Benefits and open it again."
            );
          }
        } catch {
          setError(
            "Unable to load this scheme. Please return to Benefits and open it again."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadScheme();

    return () => {
      mounted = false;
    };
  }, [id, stateScheme]);

  /*
   * -------------------------------------------------------
   * NORMALIZE DATA
   * -------------------------------------------------------
   */

  const schemeName =
    scheme?.scheme_name ??
    scheme?.scheme ??
    scheme?.name ??
    "Government Benefit";

  const description =
    scheme?.description ??
    scheme?.summary ??
    "This government benefit may be relevant to your situation based on the information provided.";

  const score = Number(
    scheme?.match_score ??
      scheme?.score ??
      scheme?.matchScore ??
      0
  );

  const status =
    scheme?.status ??
    "potential_match";

  const benefits = Array.isArray(scheme?.benefits)
    ? scheme.benefits
    : [];

  const requiredDocuments = Array.isArray(
    scheme?.required_documents
  )
    ? scheme.required_documents
    : Array.isArray(scheme?.documents)
    ? scheme.documents
    : [];

  const passedRules = Array.isArray(
    scheme?.passed_rules
  )
    ? scheme.passed_rules
    : [];

  const failedRules = Array.isArray(
    scheme?.failed_rules
  )
    ? scheme.failed_rules
    : [];

  const missingInformation = Array.isArray(
    scheme?.missing_information
  )
    ? scheme.missing_information
    : [];

  const officialSource =
    scheme?.official_source ??
    scheme?.source ??
    "";

  const applicationUrl =
    scheme?.official_application_url ??
    scheme?.application_url ??
    scheme?.apply_url ??
    "";

  const lastVerified =
    scheme?.last_verified_date ??
    scheme?.last_verified ??
    "";

  /*
   * -------------------------------------------------------
   * DOCUMENT READINESS
   *
   * Backend currently gives us required_documents but does
   * not store document ownership in CitizenProfile.
   *
   * Therefore document status is saved locally for the
   * prototype using localStorage.
   *
   * available / missing / not_sure
   * -------------------------------------------------------
   */

  const storageKey = `nagriksetu_documents_${id}`;

  const [documentStatus, setDocumentStatus] = useState({});

  useEffect(() => {
    if (!id) return;

    try {
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        setDocumentStatus(JSON.parse(saved));
      }
    } catch (err) {
      console.error(
        "Could not read document status:",
        err
      );
    }
  }, [id, storageKey]);

  const updateDocumentStatus = (documentName, statusValue) => {
    setDocumentStatus((previous) => {
      const updated = {
        ...previous,
        [documentName]: statusValue,
      };

      localStorage.setItem(
        storageKey,
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const getDocumentName = (document) => {
    if (typeof document === "string") {
      return document;
    }

    if (!document) {
      return "Required document";
    }

    return (
      document.name ??
      document.title ??
      document.document ??
      document.description ??
      JSON.stringify(document)
    );
  };

  const documentStats = useMemo(() => {
    const total = requiredDocuments.length;

    let available = 0;
    let missing = 0;
    let notSure = 0;

    requiredDocuments.forEach((document) => {
      const name = getDocumentName(document);

      const currentStatus =
        documentStatus[name] || "not_sure";

      if (currentStatus === "available") {
        available++;
      } else if (currentStatus === "missing") {
        missing++;
      } else {
        notSure++;
      }
    });

    const percentage =
      total === 0
        ? 0
        : Math.round((available / total) * 100);

    return {
      total,
      available,
      missing,
      notSure,
      percentage,
    };
  }, [requiredDocuments, documentStatus]);

  /*
   * -------------------------------------------------------
   * TEXT HELPERS
   * -------------------------------------------------------
   */

  const getText = (item) => {
    if (typeof item === "string") {
      return item;
    }

    if (!item) {
      return "";
    }

    return (
      item.message ??
      item.reason ??
      item.description ??
      item.rule ??
      JSON.stringify(item)
    );
  };

  const formatRuleName = (rule) => {
    if (!rule) return "Requirement";

    return rule
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const statusText = () => {
    switch (status) {
      case "eligible":
        return "Eligible";

      case "partially_eligible":
        return "Partially Eligible";

      case "missing_information":
        return "More Information Needed";

      case "not_eligible":
        return "Not Eligible";

      default:
        return "Potential Match";
    }
  };

  const statusClass = () => {
    switch (status) {
      case "eligible":
        return "eligible";

      case "not_eligible":
        return "not-eligible";

      case "missing_information":
        return "missing";

      default:
        return "potential";
    }
  };

  /*
   * -------------------------------------------------------
   * APPLY
   * -------------------------------------------------------
   */

  const handleApply = () => {
    if (!applicationUrl) {
      alert(
        "The official application link has not been configured for this scheme yet."
      );
      return;
    }

    window.open(
      applicationUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /*
   * -------------------------------------------------------
   * LOADING
   * -------------------------------------------------------
   */

  if (loading) {
    return (
      <div className="scheme-loading">
        <LoaderCircle
          size={38}
          className="scheme-spinner"
        />

        <h2>Loading scheme details...</h2>

        <p>
          NagrikSetu is getting the latest available
          information for this benefit.
        </p>
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * ERROR
   * -------------------------------------------------------
   */

  if (error || !scheme) {
    return (
      <div className="scheme-error-page">
        <div className="scheme-error-card">
          <div className="scheme-error-icon">
            <Info size={28} />
          </div>

          <h1>Scheme details unavailable</h1>

          <p>
            {error ||
              "We could not find information for this scheme."}
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/benefits")}
          >
            <ArrowLeft size={17} />
            Back to Benefits
          </button>
        </div>
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * MAIN UI
   * -------------------------------------------------------
   */

  return (
    <div className="scheme-details-page">

      {/* ================= HEADER ================= */}

      <header className="scheme-topbar">

        <Link
          to="/benefits"
          className="back-link"
        >
          <ArrowLeft size={16} />
          Back to Benefits
        </Link>

        <Link
          to="/"
          className="scheme-brand"
        >
          <ShieldCheck size={19} />
          <strong>NagrikSetu</strong>
        </Link>

      </header>


      <main className="scheme-details-container">

        {/* ================= HERO ================= */}

        <section className="scheme-hero-card">

          <div className="scheme-hero-main">

            <span className="scheme-eyebrow">
              GOVERNMENT BENEFIT
            </span>

            <h1>{schemeName}</h1>

            <p className="scheme-description">
              {description}
            </p>

            <div className="scheme-meta-row">

              <span
                className={`status-badge ${statusClass()}`}
              >
                {status === "eligible" ? (
                  <CheckCircle size={16} />
                ) : (
                  <Info size={16} />
                )}

                {statusText()}
              </span>

              {scheme?.state_scope && (
                <span className="scheme-meta">
                  <ShieldCheck size={15} />
                  {Array.isArray(
                    scheme.state_scope
                  )
                    ? scheme.state_scope.join(", ")
                    : scheme.state_scope}
                </span>
              )}

            </div>

          </div>


          {/* SCORE */}

          <div className="score-panel">

            <span>YOUR MATCH SCORE</span>

            <strong>
              {Math.min(Math.max(score, 0), 100)}%
            </strong>

            <div className="score-track">
              <div
                style={{
                  width: `${Math.min(
                    Math.max(score, 0),
                    100
                  )}%`,
                }}
              />
            </div>

            <small>
              Based on your profile information
            </small>

          </div>

        </section>


        {/* ================= APPLY BAR ================= */}

        <section className="apply-card">

          <div className="apply-card-text">

            <div className="apply-icon">
              <ExternalLink size={21} />
            </div>

            <div>
              <h2>Ready to apply?</h2>

              <p>
                Continue to the official application
                portal for this benefit.
              </p>
            </div>

          </div>

          <button
            type="button"
            className="apply-button"
            onClick={handleApply}
            disabled={!applicationUrl}
          >
            {applicationUrl
              ? "Apply for this benefit"
              : "Application link unavailable"}

            <ExternalLink size={17} />
          </button>

        </section>


        {/* ================= DOCUMENT READINESS ================= */}

        <section className="document-readiness-card">

          <div className="section-header">

            <div className="section-title-group">

              <div className="section-icon document-icon">
                <FileText size={21} />
              </div>

              <div>
                <h2>Document Readiness</h2>

                <p>
                  Check what you already have and what
                  you still need before applying.
                </p>
              </div>

            </div>

          </div>


          {/* STATS */}

          <div className="document-summary">

            <div className="document-stat available-stat">
              <CheckCircle size={20} />

              <div>
                <strong>
                  {documentStats.available}
                </strong>

                <span>Available</span>
              </div>
            </div>


            <div className="document-stat missing-stat">
              <X size={20} />

              <div>
                <strong>
                  {documentStats.missing}
                </strong>

                <span>Missing</span>
              </div>
            </div>


            <div className="document-stat unsure-stat">
              <CircleHelp size={20} />

              <div>
                <strong>
                  {documentStats.notSure}
                </strong>

                <span>Not sure</span>
              </div>
            </div>


            <div className="document-total-stat">

              <strong>
                {documentStats.available} /{" "}
                {documentStats.total}
              </strong>

              <span>documents ready</span>

            </div>

          </div>


          {/* PROGRESS */}

          <div className="readiness-progress">

            <div className="progress-label">

              <span>
                Document readiness
              </span>

              <strong>
                {documentStats.percentage}%
              </strong>

            </div>

            <div className="readiness-track">
              <div
                style={{
                  width: `${documentStats.percentage}%`,
                }}
              />
            </div>

          </div>


          {/* DOCUMENT LIST */}

          {requiredDocuments.length > 0 ? (

            <div className="document-list">

              {requiredDocuments.map(
                (document, index) => {

                  const name =
                    getDocumentName(document);

                  const currentStatus =
                    documentStatus[name] ||
                    "not_sure";

                  return (
                    <div
                      className={`document-row ${currentStatus}`}
                      key={`${name}-${index}`}
                    >

                      <div className="document-row-info">

                        <div className="document-file-icon">
                          <FileText size={18} />
                        </div>

                        <div>
                          <strong>{name}</strong>

                          <span>
                            {currentStatus ===
                              "available" &&
                              "You have marked this document as available."}

                            {currentStatus ===
                              "missing" &&
                              "You have marked this document as missing."}

                            {currentStatus ===
                              "not_sure" &&
                              "Tell us whether you have this document."}
                          </span>
                        </div>

                      </div>


                      <div className="document-actions">

                        <button
                          type="button"
                          className={
                            currentStatus ===
                            "available"
                              ? "doc-action active available"
                              : "doc-action"
                          }
                          onClick={() =>
                            updateDocumentStatus(
                              name,
                              "available"
                            )
                          }
                        >
                          <Check size={14} />
                          Have it
                        </button>


                        <button
                          type="button"
                          className={
                            currentStatus ===
                            "missing"
                              ? "doc-action active missing"
                              : "doc-action"
                          }
                          onClick={() =>
                            updateDocumentStatus(
                              name,
                              "missing"
                            )
                          }
                        >
                          <X size={14} />
                          Missing
                        </button>


                        <button
                          type="button"
                          className={
                            currentStatus ===
                            "not_sure"
                              ? "doc-action active unsure"
                              : "doc-action"
                          }
                          onClick={() =>
                            updateDocumentStatus(
                              name,
                              "not_sure"
                            )
                          }
                        >
                          <CircleHelp size={14} />
                          Not sure
                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          ) : (

            <div className="no-documents">
              <FileText size={24} />

              <p>
                No required documents have been
                specified for this scheme.
              </p>
            </div>

          )}

        </section>


        {/* ================= TWO COLUMN CONTENT ================= */}

        <div className="scheme-content-grid">

          {/* ================= LEFT ================= */}

          <div className="scheme-main-column">

            {/* BENEFITS */}

            {benefits.length > 0 && (
              <section className="content-card">

                <div className="section-header">

                  <div className="section-icon benefit-icon">
                    <CheckCircle size={21} />
                  </div>

                  <div>
                    <h2>What you may receive</h2>

                    <p>
                      Benefits associated with this
                      scheme.
                    </p>
                  </div>

                </div>


                <div className="benefit-list">

                  {benefits.map(
                    (benefit, index) => (
                      <div
                        className="benefit-row"
                        key={index}
                      >
                        <CheckCircle size={17} />

                        <span>
                          {getText(benefit)}
                        </span>
                      </div>
                    )
                  )}

                </div>

              </section>
            )}


            {/* PASSED */}

            {passedRules.length > 0 && (
              <section className="content-card">

                <div className="section-header">

                  <div className="section-icon success-icon">
                    <CheckCircle size={21} />
                  </div>

                  <div>
                    <h2>Why this may match</h2>

                    <p>
                      Eligibility checks that
                      passed for your profile.
                    </p>
                  </div>

                </div>


                <div className="rule-list">

                  {passedRules.map(
                    (rule, index) => (
                      <div
                        className="rule-row passed"
                        key={index}
                      >

                        <CheckCircle size={18} />

                        <div>
                          <strong>
                            {formatRuleName(
                              rule.rule
                            )}
                          </strong>

                          <p>
                            {getText(rule)}
                          </p>
                        </div>

                      </div>
                    )
                  )}

                </div>

              </section>
            )}


            {/* FAILED */}

            {failedRules.length > 0 && (
              <section className="content-card">

                <div className="section-header">

                  <div className="section-icon danger-icon">
                    <X size={21} />
                  </div>

                  <div>
                    <h2>What doesn't match</h2>

                    <p>
                      These criteria did not match
                      your current profile.
                    </p>
                  </div>

                </div>


                <div className="rule-list">

                  {failedRules.map(
                    (rule, index) => (
                      <div
                        className="rule-row failed"
                        key={index}
                      >

                        <X size={18} />

                        <div>
                          <strong>
                            {formatRuleName(
                              rule.rule
                            )}
                          </strong>

                          <p>
                            {getText(rule)}
                          </p>
                        </div>

                      </div>
                    )
                  )}

                </div>

              </section>
            )}


            {/* MISSING INFORMATION */}

            {missingInformation.length > 0 && (
              <section className="content-card">

                <div className="section-header">

                  <div className="section-icon warning-icon">
                    <Info size={21} />
                  </div>

                  <div>
                    <h2>
                      Information still needed
                    </h2>

                    <p>
                      Additional information may
                      improve the assessment.
                    </p>
                  </div>

                </div>


                <div className="rule-list">

                  {missingInformation.map(
                    (item, index) => (
                      <div
                        className="rule-row missing"
                        key={index}
                      >

                        <Info size={18} />

                        <div>
                          <strong>
                            {formatRuleName(
                              item.rule
                            )}
                          </strong>

                          <p>
                            {getText(item)}
                          </p>
                        </div>

                      </div>
                    )
                  )}

                </div>

              </section>
            )}

          </div>


          {/* ================= RIGHT ================= */}

          <aside className="scheme-sidebar">

            {/* APPLICATION */}

            <section className="sidebar-card apply-sidebar-card">

              <div className="sidebar-card-icon">
                <ExternalLink size={20} />
              </div>

              <h3>Apply for this benefit</h3>

              <p>
                When you are ready, continue to the
                official application website.
              </p>

              <button
                type="button"
                className="sidebar-apply-button"
                onClick={handleApply}
                disabled={!applicationUrl}
              >
                {applicationUrl
                  ? "Go to official application"
                  : "Link not available"}

                {applicationUrl && (
                  <ExternalLink size={16} />
                )}
              </button>

            </section>


            {/* SOURCE */}

            <section className="sidebar-card">

              <div className="sidebar-heading">

                <ShieldCheck size={19} />

                <h3>
                  Source & Verification
                </h3>

              </div>

              <div className="source-details">

                <div>
                  <span>Source</span>

                  <strong>
                    {officialSource ||
                      "Government department / official portal"}
                  </strong>
                </div>

                {lastVerified && (
                  <div>
                    <span>Last verified</span>

                    <strong>
                      {lastVerified}
                    </strong>
                  </div>
                )}

              </div>

            </section>


            {/* TRUST */}

            <section className="trust-card">

              <ShieldCheck size={20} />

              <div>

                <strong>
                  NagrikSetu guidance
                </strong>

                <p>
                  This is a potential eligibility
                  assessment based on the information
                  provided. Final eligibility and
                  approval are determined by the
                  relevant government authority.
                </p>

              </div>

            </section>

          </aside>

        </div>


        {/* ================= BOTTOM ACTION ================= */}

        <div className="bottom-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/benefits")}
          >
            <ArrowLeft size={17} />
            Back to Benefits
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={handleApply}
            disabled={!applicationUrl}
          >
            {applicationUrl
              ? "Apply for this benefit"
              : "Application link unavailable"}

            {applicationUrl && (
              <ExternalLink size={17} />
            )}
          </button>

        </div>


        <p className="scheme-disclaimer">
          NagrikSetu provides potential eligibility
          guidance based on the information provided.
          It does not guarantee official eligibility,
          approval, or benefit delivery. Always verify
          the latest criteria with the relevant
          government authority.
        </p>

      </main>
    </div>
  );
}

export default SchemeDetails;