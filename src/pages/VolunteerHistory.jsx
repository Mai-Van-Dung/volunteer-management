import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import formatDateTime from "../utils/formatDateTime";

const VolunteerHistory = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/users/${user.id}/registrations`);
                setHistory(res.data);
            } catch (err) {
                setHistory([]);
            }
        };
        fetchHistory();
    }, [user.id]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Lịch sử tham gia sự kiện</h2>
            {history.length === 0 ? (
                <p>Bạn chưa tham gia sự kiện nào.</p>
            ) : (
                <ul>
                    {history.map((event) => (
                        <li key={event.id} className="mb-2">
                            <strong>{event.name}</strong> - {formatDateTime(event.date)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default VolunteerHistory;