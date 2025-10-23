import { FaFacebook, FaGithub , FaLinkedin } from 'react-icons/fa';
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className=" max-w-[1500px] mx-auto">
      <div className="w-11/12 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Website Name */}
          <div className="flex flex-col items-center md:items-start">
            <div className=" mb-6">
              <img src={logo} className='w-20 h-20 rounded-full p-2 bg-white' alt="logo" />
            </div>
            <h2 className="text-xl font-bold">LitShelf</h2>
            <p className="text-gray-400 mt-2">Empowering your digital presence</p>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400">Shohid Mishru Sarok</p>
            <p className="text-gray-400">Jhenaidah Bangladesh</p>
            <p className="text-gray-400">Email: tamzidmolla.dev@gmail.com</p>
            <p className="text-gray-400">Phone: +8801864959549</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to='/' className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to='/bookshelf' className="text-gray-400 hover:text-white transition-colors">
                  BookShelf
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link to="https://www.facebook.com/monhara.pakhi.549668" target="_blank"  className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={24} />
              </Link>
              <Link to="https://github.com/tamzid-molla" target="_blank"  className="text-gray-400 hover:text-white transition-colors">
                <FaGithub  size={24}/>
              </Link>
              <Link to="https://www.linkedin.com/in/tamzid-molla-9b5b46371/" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin size={24} />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} LitShelf. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;