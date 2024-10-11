import React, { useState } from "react";
import RequestIdForm from "./RequestIdForm";
import FileUploadForm from "./FileUploadForm";

function App() {
  const [showRequestIdForm, setShowRequestIdForm] = useState(false);

  const handleLinkClick = (e) => {
    e.preventDefault();
    setShowRequestIdForm(true);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2 className="text-center mb-4">CSV File Processing</h2>

        {/* File Upload Form */}
        <FileUploadForm />

        {/* Request ID Link and Form */}
        <div className="text-center mt-3">
          <a href="/" onClick={handleLinkClick}>
            Check Status by Request ID
          </a>
        </div>

        {/* Conditionally show Request ID form */}
        {showRequestIdForm && <RequestIdForm />}
      </div>
    </div>
  );
}

export default App;
