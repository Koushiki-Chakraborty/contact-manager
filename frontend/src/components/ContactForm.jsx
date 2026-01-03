import React, { useState } from "react";
import { Loader2, Send, Save } from "lucide-react";
import { createContact } from "../api/axios";
import clsx from "clsx";

const ContactForm = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await createContact(formData);
      setFormData({ name: "", email: "", phone: "", message: "" }); // Clear form
      if (response.data && response.data.data) {
        onSuccess && onSuccess(response.data.data);
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to create contact";
      onError && onError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormInvalid =
    !formData.name.trim() ||
    !formData.phone.trim() ||
    (formData.email && errors.email);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
          <Save size={20} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Add New Contact</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={clsx(
              "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all",
              errors.name
                ? "border-red-300 focus:ring-red-100 focus:border-red-500 bg-red-50"
                : "border-gray-200 focus:ring-blue-100 focus:border-blue-500 bg-gray-50 focus:bg-white"
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email & Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={clsx(
                "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all",
                errors.email
                  ? "border-red-300 focus:ring-red-100 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:ring-blue-100 focus:border-blue-500 bg-gray-50 focus:bg-white"
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              className={clsx(
                "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all",
                errors.phone
                  ? "border-red-300 focus:ring-red-100 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:ring-blue-100 focus:border-blue-500 bg-gray-50 focus:bg-white"
              )}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="3"
            placeholder="Additional notes..."
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none bg-gray-50 focus:bg-white transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isFormInvalid}
          className={clsx(
            "w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all",
            isSubmitting || isFormInvalid
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-[0.98]"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Send size={18} />
              Save Contact
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
