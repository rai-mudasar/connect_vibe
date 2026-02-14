"use client";
import { useState } from "react";
import Modal from "@/components/Modal";
import axios from "axios";

export default function CreatePostModal() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("text", text);

    setLoading(true);

    try {
      const response = await axios.post("/api/post/create", formData);

      if (response.data.success) {
        console.log("Success:", response.data);
        alert("Post created!");
      }
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal>
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-xl font-bold text-center flex-1">Create post</h2>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <span className="font-semibold">User Name</span>
      </div>

      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full h-32 resize-none text-xl outline-none"
      />

      {/* Image Preview */}
      {image && (
        <div className="relative mb-4">
          <img
            src={URL.createObjectURL(image)}
            className="w-full h-48 object-cover rounded-lg"
            alt="preview"
          />
          <button
            onClick={() => setImage(null)}
            className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      <div className="border rounded-lg p-3 mb-4 flex justify-between items-center">
        <span className="font-medium">Add to your post</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="text-sm"
        />
      </div>

      <button
        onClick={handlePost}
        disabled={loading}
        className={`w-full py-2 rounded-lg font-semibold text-white transition ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </Modal>
  );
}
