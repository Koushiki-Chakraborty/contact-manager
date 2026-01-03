import React, { useState } from "react";
import {
  Trash2,
  Phone,
  Mail,
  Calendar,
  Users,
} from "lucide-react";

const ContactList = ({ contacts, onDelete, deletingId, isAuthenticated }) => {
  if (contacts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          {isAuthenticated ? "No contacts yet" : "No contacts to display"}
        </h3>
        <p className="text-gray-500">
          {isAuthenticated 
            ? "Fill out the form to add your first contact." 
            : "Sign in to see your saved contacts."}
        </p>
      </div>
    );
  }

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Contact Details</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">Message</th>
              {isAuthenticated && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.isArray(contacts) &&
              contacts.map((contact) => (
                <tr
                  key={contact._id}
                  className="group hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {contact.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        <Calendar size={12} />
                        {formatDate(contact.createdAt)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-blue-500" />
                        {contact.phone}
                      </div>
                      {contact.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} className="text-blue-500" />
                          {contact.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {contact.message ? (
                      <p
                        className="text-sm text-gray-600 line-clamp-2 max-w-xs"
                        title={contact.message}
                      >
                        {contact.message}
                      </p>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        No message
                      </span>
                    )}
                  </td>
                  {isAuthenticated && (
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onDelete(contact._id)}
                        disabled={deletingId === contact._id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Contact"
                      >
                        {deletingId === contact._id ? (
                          <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ContactList;
