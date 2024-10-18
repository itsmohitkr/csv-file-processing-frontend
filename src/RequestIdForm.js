import React, { useState } from "react";
import axios from "axios";
import { BsDownload } from "react-icons/bs"; // Import download icon

function RequestIdForm() {
  const [requestId, setRequestId] = useState("");
  const [fileExists, setFileExists] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Clear previous error message
    setFileExists(false); // Reset fileExists in case of new request

    if (!requestId) {
      alert("Please enter a Request ID");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/get-processed-csv/${requestId}`
      );
      console.log("Processed CSV:", response);

      if (response.data?.data?.updated_file_url) {
        setFileExists(true);
        setFileUrl(response.data.data.updated_file_url); // Store file URL
        setRequestId(""); // Clear input field after file is ready
      } else if (response.data.data === "Under process...") {
        setFileExists(false);
        alert("Your file is still being processed. Please try again later.");
      } else {
        // Handle any other unexpected responses
        setErrorMessage(
          response.data.message || "An unexpected error occurred."
        );
      }
    } catch (error) {
      console.error("Error retrieving CSV:", error);
      if (error.response && error.response.data && error.response.data.error) {
        // Display the backend error message (e.g., invalid requestId)
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Failed to retrieve the file. Please try again.");
      }
    }
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="requestId" className="form-label">
          Enter Request ID:
        </label>
        <input
          type="text"
          className="form-control form-control-lg"
          id="requestId"
          placeholder="Enter your Request ID"
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
        />
      </div>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      {!fileExists && (
        <button className="btn btn-success btn-lg w-100" type="submit">
          Check Status
        </button>
      )}

      {fileExists && (
        <div className="mt-3 text-center">
          <p className="text-success">Your file is ready to download!</p>
          <a
            href={fileUrl}
            className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center"
            download
          >
            <BsDownload className="me-2" /> Click here to download
          </a>
        </div>
      )}
    </form>
  );
}

export default RequestIdForm;
