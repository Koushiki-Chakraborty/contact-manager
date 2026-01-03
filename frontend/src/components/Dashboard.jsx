import React, { useEffect, useState, useContext } from "react";
import Layout from "./Layout";
import ContactForm from "./ContactForm";
import ContactList from "./ContactList";
import GuestCTA from "./GuestCTA";
import { getContacts, deleteContact } from "../api/axios";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { isAuthenticated } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fetch contacts on mount ONLY if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    } else {
      setContacts([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await getContacts();
      setContacts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
      showNotification(
        "error",
        "Failed to load contacts. Please ensure backend is running."
      );
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    // Auto clear after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateSuccess = (newContact) => {
    showNotification("success", "Contact added successfully!");
    setContacts((prev) => [newContact, ...prev]);
  };

  const handleError = (message) => {
    showNotification("error", message);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteContact(id);
      showNotification("success", "Contact deleted successfully");
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
      showNotification("error", "Failed to delete contact");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Layout>
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all transform translate-y-0 ${
            notification.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <XCircle size={20} />
          )}
          <p className="font-medium text-sm">{notification.message}</p>
        </div>
      )}

      {/* Grid Layout: Form on Left (Desktop), List on Right (Desktop) or stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form or Guest CTA */}
        <div className="lg:col-span-1">
          {isAuthenticated ? (
            <ContactForm
              onSuccess={handleCreateSuccess}
              onError={handleError}
            />
          ) : (
            <GuestCTA />
          )}
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              My Contacts
              <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {contacts.length}
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
              <Loader2 size={32} className="text-blue-500 animate-spin mb-3" />
              <p className="text-gray-500 text-sm">Loading contacts...</p>
            </div>
          ) : contacts.length > 0 ? (
            <ContactList
              contacts={contacts}
              onDelete={handleDelete}
              deletingId={deletingId}
              isAuthenticated={isAuthenticated}
            />
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 italic">
                No contacts added yet. Start by filling the form!
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
