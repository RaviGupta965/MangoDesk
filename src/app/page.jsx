"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [Error, setError] = useState("");
  const [prompt, setprompt] = useState("");
  const [AIres, setAIres] = useState("");
  const [sendingmail,setsendinmail] = useState(false);
  const [loading, setloading] = useState(false);
  const [receiverInput, setReceiverInput] = useState("");
  const [receivers, setReceivers] = useState([]);
  const [editing, setediting] = useState(false);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEdit =(e) => {
    setAIres(e.target.value)
  };

  const handlesend = async (recipients) => {
    setsendinmail(true);
    for (const recipient of recipients) {
      await fetch("/api/Mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recipient, content: AIres }),
      });
    }
    setsendinmail(false)
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first!");
      return;
    }

    if (!prompt) {
      setError("Please Enter the Prompt");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);

    try {
      setloading(true);
      const res = await fetch("./api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setAIres(data.response);
        setError("");
      } else {
        setError("Upload failed: " + data.error);
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setloading(false);
    }
  };

  // Add a new receiver to array
  const handleAddReceiver = () => {
    if (receiverInput.trim() && !receivers.includes(receiverInput.trim())) {
      setReceivers([...receivers, receiverInput.trim()]);
      setReceiverInput(""); // clear input after adding
    }
  };

  // Remove receiver
  const handleRemoveReceiver = (email) => {
    setReceivers(receivers.filter((r) => r !== email));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Upload & Generate Response
        </h2>

        {/* File Upload */}
        <div className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-lg file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100"
          />
        </div>

        {/* Message */}
        <div className="mb-4">
          <label
            htmlFor="file-msg"
            className="text-sm font-medium text-gray-700 mb-1 block"
          >
            Message
          </label>
          <textarea
            id="file-msg"
            rows={6}
            onChange={(e) => setprompt(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="What is in your mind..."
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Upload
        </button>

        {Error && (
          <p className="mt-4 text-center text-sm text-red-500 font-medium">
            {Error}
          </p>
        )}
      </div>

      {/* AI Response */}
      <div className="w-full max-w-lg mt-6">
        {loading ? (
          <div className="border border-gray-300 bg-white rounded-lg p-4 shadow-sm text-gray-600">
            Model is Preparing Your Response...
          </div>
        ) : (
          AIres?.toString().trim().length > 0 && (
            <div className="bg-white shadow-lg rounded-xl p-4 space-y-4">
              {/* Editable Response */}
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                {editing ? (
                  <textarea
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    onChange={(e) =>handleEdit(e)}
                    rows={6}
                    value={AIres}
                  />
                ) : (
                  <p dangerouslySetInnerHTML={{ __html: AIres }} className="text-gray-800 whitespace-pre-wrap" />
                )}
                <button
                  onClick={() => setediting(!editing)}
                  className="mt-3 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition"
                >
                  {editing ? "Save" : "Edit"}
                </button>
              </div>


              {/* Receiver Input */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Receiver Emails
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter Receiver Email"
                    className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    value={receiverInput}
                    onChange={(e) => setReceiverInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAddReceiver}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Receiver List */}
              <div className="space-y-2">
                {receivers.map((email, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center border rounded-lg px-3 py-2 bg-gray-50"
                  >
                    <span className="text-gray-800">{email}</span>
                    <button
                      onClick={() => handleRemoveReceiver(email)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={()=>handlesend(receivers)} className="bg-blue-500 hover:bg-blue-700 rounded-md text-white py-2 px-3">Send</button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
