import React, { useState } from "react";
import axios from "axios";
import { BsDownload } from "react-icons/bs"; // Import download icon

function RequestIdForm() {
  const [requestId, setRequestId] = useState("");
  const [fileExists, setFileExists] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!requestId) {
      alert("Please enter a Request ID");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5001/get-processed-csv/${requestId}`
      );
      console.log("Processed CSV:", response.data.data);
      if (response.data.data.updated_file_url) {
        setFileExists(true);
          setFileUrl(response.data.data.updated_file_url); // Store file URL
          setRequestId("");
      } else {
        setFileExists(false);
        alert("No file found for the given Request ID");
      }
    } catch (error) {
      console.error("Error retrieving CSV:", error);
      alert("Failed to retrieve file");
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
