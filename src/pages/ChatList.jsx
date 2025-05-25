import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const ChatList = ({ user }) => {
    const [list, setList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Organizer lấy danh sách volunteer, volunteer lấy danh sách organizer
        const url =
            user.role === "organizer"
                ? `${API_BASE_URL}/api/users/organizer/volunteers`
                : `${API_BASE_URL}/api/users/organizers`;
        axios.get(url).then(res => setList(res.data));
    }, [user.role]);

    return (
        <div className="max-w-xl mx-auto bg-white rounded shadow p-6 mt-8">
            <h2 className="text-xl font-bold mb-4">
                {user.role === "organizer"
                    ? "Chọn tình nguyện viên để chat"
                    : "Chọn tổ chức để chat"}
            </h2>
            <ul>
                {list.map(item => (
                    <li
                        key={
                            user.role === "organizer"
                                ? item.VolunteerId
                                : item.OrganizerId
                        }
                        className="flex items-center justify-between py-2 border-b"
                    >
                        <span>
                            {user.role === "organizer"
                                ? item.VolunteerName
                                : item.OrganizerName}
                        </span>
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={() =>
                                user.role === "organizer"
                                    ? navigate(`/organizer/messages/${item.VolunteerId}`)
                                    : navigate(`/chat/${item.OrganizerId}`)
                            }
                        >
                            Nhắn tin
                        </button>
                    </li>
                ))}
                {list.length === 0 && (
                    <li className="text-gray-500 py-4 text-center">Không có ai để chat.</li>
                )}
            </ul>
        </div>
    );
};

export default ChatList;