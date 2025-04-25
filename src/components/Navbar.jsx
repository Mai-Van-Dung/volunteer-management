export default function Navbar() {
    return (
      <nav className="flex justify-between items-center px-8 py-4 bg-blue-700 text-white shadow-md">
        <h1 className="text-2xl font-bold">
          V-<span className="text-cyan-300">Hub</span>
        </h1>
        <ul className="hidden md:flex space-x-8 text-lg">
          {["Home", "About", "Service", "Portfolio", "Blog"].map((item, i) => (
            <li key={i} className="hover:text-cyan-200 cursor-pointer transition duration-200">
              {item}
            </li>
          ))}
        </ul>
        <button className="hidden md:block bg-white text-blue-700 font-medium px-5 py-2 rounded-lg hover:bg-gray-100 transition">
          Contact Us
        </button>
      </nav>
    );
  }
  