import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const EventRegistrations = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [eventName, setEventName] = useState("");

  useEffect(() => {
    // Lấy thông tin sự kiện
    axios.get(`${API_BASE_URL}/api/events/${eventId}`)
      .then(res => setEventName(res.data.name || res.data.Name))
      .catch(() => setEventName(""));

    // Lấy danh sách đăng ký
    axios.get(`${API_BASE_URL}/api/events/${eventId}/registrations`)
      .then(res => setRegistrations(res.data))
      .catch(() => setRegistrations([]));
  }, [eventId]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">
          Danh sách tình nguyện viên đã đăng ký: {eventName}
        </h1>
        {registrations.length > 0 ? (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-4 border">STT</th>
                <th className="py-2 px-4 border">Tên</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Mã tình nguyện viên</th>
                <th className="py-2 px-4 border">Thời gian đăng ký</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg, idx) => (
                <tr key={reg.VolunteerId}>
                  <td className="py-2 px-4 border">{idx + 1}</td>
                  <td className="py-2 px-4 border">{reg.VolunteerName}</td>
                  <td className="py-2 px-4 border">{reg.VolunteerEmail}</td>
                  <td className="py-2 px-4 border">{reg.VolunteerId}</td>
                  <td className="py-2 px-4 border">{reg.RegisteredAt ? new Date(reg.RegisteredAt).toLocaleString() : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Chưa có ai đăng ký sự kiện này.</p>
        )}
        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default EventRegistrations;