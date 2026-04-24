import { useEffect, useState } from "react";
import SectionCard from "../components/SectionCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { apiRequest } from "../utils/api";

function DoctorDashboard() {
  const { token } = useAuth();
  const { showError, showSuccess } = useToast();
  const [summary, setSummary] = useState({ totalPatients: 0, totalAppointments: 0 });
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    appointmentId: "",
    medicines: "",
    notes: ""
  });

  const loadData = async () => {
    try {
      const [summaryData, appointmentData, notificationData] = await Promise.all([
        apiRequest("/appointments/dashboard/summary", "GET", null, token),
        apiRequest("/appointments", "GET", null, token),
        apiRequest("/notifications", "GET", null, token)
      ]);

      setSummary(summaryData);
      setAppointments(appointmentData);
      setNotifications(notificationData);
      if (!formData.appointmentId && appointmentData.length > 0) {
        setFormData((prev) => ({ ...prev, appointmentId: appointmentData[0]._id }));
      }
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await apiRequest(`/appointments/${id}/status`, "PUT", { status }, token);
      showSuccess(`Appointment ${status}`);
      loadData();
    } catch (error) {
      showError(error.message);
    }
  };

  const handlePrescription = async (event) => {
    event.preventDefault();

    try {
      await apiRequest(
        "/prescriptions",
        "POST",
        {
          appointmentId: formData.appointmentId,
          medicines: formData.medicines
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          notes: formData.notes
        },
        token
      );
      showSuccess("Prescription saved and bill generated");
      setFormData((prev) => ({ ...prev, medicines: "", notes: "" }));
      loadData();
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <div className="doctor-dashboard">
      <div className="doctor-hero" id="dashboard">
        <div>
          <p className="tag light">Doctor Dashboard</p>
          <h2>Daily Overview</h2>
          <p className="doctor-subtext">
            Review requests, update status, and create prescriptions for patients.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <h4>Total Patients</h4>
          <p>{summary.totalPatients}</p>
          <span>Patients linked with your appointments</span>
        </div>
        <div className="stat-box">
          <h4>Total Appointments</h4>
          <p>{summary.totalAppointments}</p>
          <span>All appointments scheduled with you</span>
        </div>
      </div>

      <div className="grid two-column">
        <SectionCard title="Notifications">
          {notifications.length === 0 ? (
            <p>No new notifications.</p>
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

        <SectionCard title="Pharmacy">
          <div id="pharmacy" className="coming-soon">
            Coming Soon
          </div>
        </SectionCard>
      </div>

      <SectionCard title="All Appointments">
        <div className="table-wrap" id="appointments">
          {appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{appointment.patientId?.name}</td>
                    <td>{new Date(appointment.date).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="action-cell">
                      <button
                        className="small-btn accept"
                        onClick={() => updateStatus(appointment._id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="small-btn reject"
                        onClick={() => updateStatus(appointment._id, "rejected")}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Add Prescription">
        <form className="simple-form" id="prescription" onSubmit={handlePrescription}>
          {appointments.length === 0 ? (
            <p>No appointments available for prescription.</p>
          ) : (
            <select
              value={formData.appointmentId}
              onChange={(event) =>
                setFormData({ ...formData, appointmentId: event.target.value })
              }
            >
              {appointments.map((appointment) => (
                <option key={appointment._id} value={appointment._id}>
                  {appointment.patientId?.name} -{" "}
                  {new Date(appointment.date).toLocaleString()}
                </option>
              ))}
            </select>
          )}
          <input
            type="text"
            placeholder="Medicines (comma separated)"
            value={formData.medicines}
            onChange={(event) =>
              setFormData({ ...formData, medicines: event.target.value })
            }
            required
          />
          <textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={(event) =>
              setFormData({ ...formData, notes: event.target.value })
            }
            rows="4"
          />
          <button
            type="submit"
            className="primary-btn"
            disabled={appointments.length === 0}
          >
            Save Prescription
          </button>
        </form>
      </SectionCard>
    </div>
  );
}

export default DoctorDashboard;
