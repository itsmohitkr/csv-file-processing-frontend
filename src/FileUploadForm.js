import React, { useState } from "react";
import axios from "axios";

function FileUploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [requestId, setRequestId] = useState(""); // State for storing request ID

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("mycsvfile", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:5001/upload-csv",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
      setRequestId(response.data.data.requestId); // Assuming your API response has requestId
      setSelectedFile(null); // Reset the selected file
      console.log("CSV Uploaded Successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="formFileLg" className="form-label">
          Upload CSV File:
        </label>
        <input
          className="form-control form-control-lg"
          id="formFileLg"
          accept=".csv"
          type="file"
          onChange={handleFileChange}
        />
      </div>

      <button className="btn btn-primary w-100" type="submit">
        Upload
      </button>

      {requestId && ( // Conditionally render the request ID
        <div className="mt-3 alert alert-info">
          Your Request ID is: <strong>{requestId}</strong>
        </div>
      )}
    </form>
  );
}

export default FileUploadForm;
