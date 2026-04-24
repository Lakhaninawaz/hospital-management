import { useEffect, useState } from "react";
import SectionCard from "../components/SectionCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { apiRequest, getFileUrl } from "../utils/api";

const getMinDateTime = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

function PatientDashboard() {
  const { token, user } = useAuth();
  const { showError, showSuccess } = useToast();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [bills, setBills] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({ doctorId: "", date: "" });

  const loadData = async () => {
    try {
      const [doctorData, appointmentData, prescriptionData, billData, notificationData] =
        await Promise.all([
          apiRequest("/doctors"),
          apiRequest("/appointments", "GET", null, token),
          apiRequest("/prescriptions/my", "GET", null, token),
          apiRequest("/bills/my", "GET", null, token),
          apiRequest("/notifications", "GET", null, token)
        ]);

      setDoctors(doctorData);
      setAppointments(appointmentData);
      setPrescriptions(prescriptionData);
      setBills(billData);
      setNotifications(notificationData);
      if (!formData.doctorId && doctorData.length > 0) {
        setFormData((prev) => ({ ...prev, doctorId: doctorData[0]._id }));
      }
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBookAppointment = async (event) => {
    event.preventDefault();

    if (!formData.doctorId) {
      showError("Please select a doctor");
      return;
    }

    if (!formData.date) {
      showError("Please select appointment date and time");
      return;
    }

    if (new Date(formData.date) <= new Date()) {
      showError("You cannot book an appointment for a past date or time");
      return;
    }

    try {
      await apiRequest("/appointments", "POST", formData, token);
      showSuccess("Appointment booked successfully");
      setFormData((prev) => ({ ...prev, date: "" }));
      loadData();
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="patient-hero">
          <div className="page-heading">
            <h2>Welcome, {user?.name}</h2>
            <p>Manage your appointments, prescriptions, bills, and updates in one place.</p>
          </div>
          <div className="hero-summary">
            <div className="summary-chip">
              <strong>{appointments.length}</strong>
              <span>Appointments</span>
            </div>
            <div className="summary-chip">
              <strong>{prescriptions.length}</strong>
              <span>Prescriptions</span>
            </div>
            <div className="summary-chip">
              <strong>{bills.length}</strong>
              <span>Bills</span>
            </div>
          </div>
        </div>

        <div className="grid two-column">
          <SectionCard title="Book Appointment">
            <form className="simple-form" onSubmit={handleBookAppointment}>
              {doctors.length === 0 ? (
                <p>No doctors available right now.</p>
              ) : (
                <>
                  <label className="form-label">Select a Doctor</label>
                  <select
                    value={formData.doctorId}
                    onChange={(event) =>
                      setFormData({ ...formData, doctorId: event.target.value })
                    }
                  >
                    <option value="">-- Choose a doctor --</option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </>
              )}
              <label className="form-label">Select Date & Time</label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(event) =>
                  setFormData({ ...formData, date: event.target.value })
                }
                min={getMinDateTime()}
                required
              />
              <button
                type="submit"
                className="primary-btn"
                disabled={doctors.length === 0 || !formData.doctorId}
              >
                Book Appointment
              </button>
            </form>
          </SectionCard>

          <SectionCard title="Notifications">
            {notifications.length === 0 ? (
              <p>No notifications yet.</p>
            ) : (
              <div className="list-stack">
                {notifications.map((item) => (
                  <div key={item.id} className="list-item">
                    <strong>{item.message}</strong>
                    <span>{new Date(item.date).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="grid two-column">
          <SectionCard title="Doctors List">
            {doctors.length === 0 ? (
              <p>No doctors available.</p>
            ) : (
              <div className="doctor-card-grid">
                {doctors.map((doctor) => (
                  <div key={doctor._id} className="doctor-card">
                    <div className="doctor-avatar">{doctor.name?.slice(0, 2)}</div>
                    <strong>{doctor.name}</strong>
                    <span>{doctor.specialization}</span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="My Appointments">
            {appointments.length === 0 ? (
              <p>No appointments booked yet.</p>
            ) : (
              <div className="list-stack">
                {appointments.map((appointment) => (
                  <div key={appointment._id} className="list-item">
                    <strong>{appointment.doctorId?.name}</strong>
                    <span>{new Date(appointment.date).toLocaleString()}</span>
                    <span className={`badge ${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="grid two-column">
          <SectionCard title="Prescriptions">
            <div className="list-stack">
              {prescriptions.length === 0 ? (
                <p>No prescriptions available.</p>
              ) : (
                prescriptions.map((prescription) => (
                  <div key={prescription._id} className="list-item">
                    <strong>
                      {prescription.appointmentId?.doctorId?.name || "Doctor"}
                    </strong>
                    <span>
                      Medicines: {prescription.medicines.join(", ") || "None"}
                    </span>
                    <span>Notes: {prescription.notes || "No notes"}</span>
                  </div>
                ))
              )}
            </div>
          </SectionCard>

          <SectionCard title="Bills">
            <div className="list-stack">
              {bills.length === 0 ? (
                <p>No bills generated yet.</p>
              ) : (
                bills.map((bill) => (
                  <div key={bill._id} className="list-item">
                    <strong>Amount: Rs. {bill.amount}</strong>
                    <span>
                      Appointment:{" "}
                      {new Date(bill.appointmentId?.date).toLocaleString()}
                    </span>
                    <a
                      className="download-link"
                      href={getFileUrl(bill.pdfUrl)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download PDF
                    </a>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
