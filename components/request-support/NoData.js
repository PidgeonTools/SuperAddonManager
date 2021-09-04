import React, { useState } from "react";
import { useRouter } from "next/router";

export const NoData = () => {
  const LATEST_BLENDER_VERSION = "2.93.4";
  const LATEST_SPM_VERSION = "1.3.1";
  const issueTypes = [
    "sam_not_supported",
    "bl_info_version_problems",
    "url_invalid",
    "endpoint_offline",
    "invalid_endpoint",
    "endpoint_invalid_schema",
  ];
  const operatingSystems = ["Windows", "Linux", "macOS", "Other"];
  const baseURL = "/request-support";

  const [formData, setFormData] = useState({});
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    router.push({
      pathname: baseURL,
      query: formData,
    });
  };

  return (
    <>
      {/* INTRO SECTION */}
      <section className="intro">
        <div className="container">
          <div className="row">
            <h1>Request support for your addon</h1>
            <p>
              Fill in the Form with all necessary data to get support, if Super
              Addon Manager doesn't work with your addon.
            </p>
          </div>
        </div>
      </section>

      {/* REQUEST SUPPORT */}
      <section className="request-support-form">
        <div className="container">
          <form className="row" onSubmit={handleSubmit}>
            {/* ISSUE TYPE */}
            <div className="col-12 col-lg-6 form-floating mb-3 required">
              <select
                className="form-select"
                id="issue_type"
                defaultValue=""
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select an Option
                </option>
                {issueTypes.map((el) => (
                  <option key={el} value={el}>
                    {el}
                  </option>
                ))}
              </select>
              <label htmlFor="issue_type" className="form-label">
                Issue Type / Error Code
              </label>
            </div>
            {/* ADDON NAME */}
            <div className="col-12 col-lg-6 form-floating mb-3 required">
              <input
                type="text"
                id="addon_name"
                className="form-control"
                placeholder="Super Project Manager"
                onChange={handleChange}
                required
              />
              <label htmlFor="addon_name">Addon Name</label>
            </div>

            {/* === SYSTEM INFORMATION === */}
            {/* OS */}
            <div className="col-12 col-lg-6 form-floating mb-3 required">
              <select
                className="form-select"
                id="os_name"
                defaultValue=""
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select an Option
                </option>
                {operatingSystems.map((el) => (
                  <option key={el} value={el}>
                    {el}
                  </option>
                ))}
              </select>
              <label htmlFor="os_name">Operating System</label>
            </div>
            {/* BLENDER VERSION */}
            <div className="col-12 col-md-6 col-lg-3 form-floating mb-3 required">
              <input
                type="text"
                id="blender_version"
                placeholder="*"
                pattern="\d+\.\d+\.\d+"
                className="form-control"
                onChange={handleChange}
                required
              />
              <label htmlFor="blender_version">
                Blender Version (e.g. {LATEST_BLENDER_VERSION})
              </label>
            </div>
            {/* ADDON VERSION */}
            <div className="col-12 col-md-6 col-lg-3 form-floating mb-3 required">
              <input
                type="text"
                id="addon_version"
                placeholder="*"
                pattern="\d+\.\d+\.\d+"
                className="form-control"
                onChange={handleChange}
                required
              />
              <label htmlFor="addon_version">
                Addon Version (e.g. {LATEST_SPM_VERSION})
              </label>
            </div>

            {/* === ISSUE DEPENDENT PARAMETERS === */}
            {/* ADDON COUNT */}
            {formData.issue_type == "sam_not_supported" ? (
              <div className="form-floating mb-3 required">
                <input
                  type="number"
                  id="addon_count"
                  className="form-control"
                  placeholder="42"
                  onChange={handleChange}
                  required
                />
                <label htmlFor="addon_count">
                  Estimated Number of installed Addons
                </label>
              </div>
            ) : (
              ""
            )}
            {/* ENDPOINT URL */}
            {[
              "url_invalid",
              "invalid_endpoint",
              "endpoint_invalid_schema",
              "endpoint_offline",
            ].includes(formData.issue_type) ? (
              <div className="form-floating mb-3">
                <input
                  type="text"
                  id="endpoint_url"
                  className="form-control"
                  onChange={handleChange}
                  placeholder="https://github.com/BlenderDefender/SuperProjectManager"
                />
                <label htmlFor="endpoint_url">Endpoint URL</label>
              </div>
            ) : (
              ""
            )}
            {/* ERROR MESSAGE */}
            {formData.issue_type == "endpoint_offline" ? (
              <div className="form-floating mb-3">
                <textarea
                  className="form-control"
                  onChange={handleChange}
                  placeholder="Error Message"
                  id="error_message"
                ></textarea>
                <label htmlFor="error_message">Error Message</label>
              </div>
            ) : (
              ""
            )}
            {/* TRACKER URL */}
            <div className="form-floating mb-3">
              <input
                type="text"
                id="tracker_url"
                className="form-control"
                onChange={handleChange}
                placeholder="https://github.com/BlenderDefender/SuperProjectManager"
                pattern="(https?://)?.+\..+"
              />
              <label htmlFor="tracker_url">Tracker URL</label>
            </div>

            <div className="d-grid col-12">
              <button className="btn btn-primary" type="submit">
                Request Support
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
