import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import heroImg from '../assets/Homepage.png';

export default function Hero() {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between bg-blue-600 text-white px-8 py-16">
      <div className="md:w-1/2 space-y-6">
        <p className="text-lg text-cyan-200 font-medium">Hi, There!</p>
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
          We are a dynamic volunteer platform
          <br />
          growing across <span className="text-cyan-300">Vietnam!</span>
        </h2>
        <p className="text-lg text-blue-100">
          We provide you with transparent, inspiring, and professional volunteering
          opportunities – where technology empowers compassion.
        </p>
        <Link to="/login">
          <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-200">
            Connect with V-Hub →
          </button>
        </Link>
      </div>
      <div className="md:w-1/2 mb-10 md:mb-0">
        <img src={heroImg} alt="Volunteer" className="w-full max-w-lg rounded-xl shadow-lg" />
      </div>
    </section>
  );
}