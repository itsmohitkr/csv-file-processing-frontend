import React, { useState } from "react";
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";

function FileUploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [requestId, setRequestId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
    
    setSelectedFile(event.target.files[0]);
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setErrorMessage("Please select a file");
      return;
    }
    console.log(selectedFile);

    try {
      setIsUploading(true); // Set uploading state to true
      setErrorMessage(""); // Clear previous error message

      // Step 1: Request presigned URL from the backend
      const metadataResponse = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/upload-csv`,
        {
          filename: selectedFile.name, // Send the file name or any other required metadata
          filetype: selectedFile.type, // Send the file type if needed
          size:selectedFile.size
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const formData = new FormData();
      formData.append("mycsvfile", selectedFile);

      const presignedUrl = metadataResponse.data.data.uploadUrl; // Get the presigned URL from the response
      setRequestId(metadataResponse.data.data.requestId);

      // Step 2: Upload the file to S3 using the presigned URL
      const uploadResponse = await axios.put(presignedUrl, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type, // Use the correct content type
        },
      });

      console.log("CSV Uploaded Successfully:", uploadResponse.data);

      setSelectedFile(null);
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
