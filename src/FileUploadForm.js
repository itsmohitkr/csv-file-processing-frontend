import React, { useState } from "react";
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";

function FileUploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [requestId, setRequestId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setErrorMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("mycsvfile", selectedFile);

    try {
      setIsUploading(true); // Set uploading state to true
      setErrorMessage(""); // Clear previous error message

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/upload-csv`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setRequestId(response.data.data.requestId);
      setSelectedFile(null);
      console.log("CSV Uploaded Successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAlertClose = () => {
    setRequestId("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="formFileLg" className="form-label">
          <FaCloudUploadAlt /> Upload CSV File:
        </label>
        <input
          className="form-control form-control-lg"
          id="formFileLg"
          accept=".csv"
          type="file"
          onChange={handleFileChange}
        />
      </div>

      {errorMessage && ( // Show error message if exists
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <button
        className="btn btn-primary w-100"
        type="submit"
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      {requestId && ( 
        <div className="mt-3 alert alert-info" role="alert">
          <button
            type="button"
            className="btn-close"
            onClick={handleAlertClose}
            aria-label="Close"
          ></button>
          Your Request ID is: <strong>{requestId}</strong>
        </div>
      )}
    </form>
  );
}

export default FileUploadForm;
