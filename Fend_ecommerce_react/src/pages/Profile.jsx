import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/authService";
import { FaEdit } from "react-icons/fa";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    lastname: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { user } = await getProfile();
      setProfile(user);
      const [name, lastname] = user.full_name.split(" ");
      setFormData({
        username: user.username,
        name: name,
        lastname: lastname || "",
        email: user.email,
        password: "",
        role: user.role,
      });
    } catch {
      console.error("Failed to load profile");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (field) => {
    try {
      const payload = {};
      payload[field] = formData[field];
      if (field === "password" && formData.password) {
        payload.password = formData.password;
      }

      // ก่อนส่ง full_name จะรวม name และ lastname
      if (field === "name" || field === "lastname") {
        const fullName = `${formData.name} ${formData.lastname}`;
        payload.full_name = fullName;
      }

      await updateProfile(payload);
      setEditField(null);
      fetchProfile();
    } catch {
      alert("Failed to update profile");
    }
  };

  const handleKeyDown = (e, field) => {
    if (e.key === "Enter") {
      handleSave(field);
    }
  };

  if (!profile) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-[calc(80vh-80px)] bg-gradient-to-r from-blue-100 via-white to-blue-100 pt-10 pb-1">
      <div className="max-w-2xl mx-auto p-8 bg-white shadow-2xl rounded-2xl">
        <h2 className="text-3xl font-bold mb-10 text-left text-gray-900">
          Profile
        </h2>

        <div className="space-y-6">
          {["username", "name", "lastname", "email"].map((field) => (
            <div key={field} className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-sm font-semibold text-gray-800 capitalize">
                {field === "name"
                  ? "First Name"
                  : field === "lastname"
                  ? "Last Name"
                  : field.replace("_", " ")}
              </label>
              {editField === field ? (
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  className="col-span-8 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData[field]}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, field)}
                />
              ) : (
                <p className="col-span-8 text-gray-900">
                  {field === "name" || field === "lastname"
                    ? formData[field]
                    : profile[field]}
                </p>
              )}
              <button
                onClick={() => setEditField(editField === field ? null : field)}
                className="col-span-1 text-[#0f172a] hover:text-blue-600"
                title="Edit"
              >
                <FaEdit size={18} />
              </button>
            </div>
          ))}

          <div className="grid grid-cols-12 items-center gap-4">
            <label className="col-span-3 text-sm font-semibold text-gray-800">
              Role
            </label>
            <p className="col-span-9 text-gray-900 capitalize">
              {profile.role}
            </p>
          </div>

          {editField === "password" && (
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-sm font-semibold text-gray-800">
                New Password
              </label>
              <input
                type="password"
                name="password"
                className="col-span-9 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, "password")}
              />
            </div>
          )}

          {editField && (
            <div className="flex justify-end gap-4 pt-6">
              <button
                onClick={() => setEditField(null)}
                className="px-5 py-2 border border-gray-500 text-gray-700 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(editField)}
                className="px-5 py-2 border border-blue-700 text-blue-700 rounded-md hover:bg-blue-100"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
