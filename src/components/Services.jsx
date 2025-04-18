import { FaHandsHelping, FaBullhorn, FaClock } from "react-icons/fa";

const services = [
  {
    icon: <FaHandsHelping className="text-5xl text-blue-500 mb-4" />,
    title: "Volunteer Activities",
    desc: "Discover and join meaningful volunteer programs with ease and speed.",
  },
  {
    icon: <FaBullhorn className="text-5xl text-blue-500 mb-4" />,
    title: "Connect with Organizers",
    desc: "Engage and stay updated with clubs and event organizers.",
  },
  {
    icon: <FaClock className="text-5xl text-blue-500 mb-4" />,
    title: "Volunteer Hours & Reports",
    desc: "Track your contributed hours and generate transparent reports effortlessly.",
  },
];

export default function Services() {
  return (
    <section className="px-8 py-16 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {services.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
          >
            {item.icon}
            <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}