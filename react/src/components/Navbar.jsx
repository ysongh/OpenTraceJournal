import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Network, Menu, X } from 'lucide-react';

import { formatAddress } from '../utils/format';
import { ETHContext } from '../ETHContext';

const Navbar = () => {
  const { walletAddress, connectWallet } = useContext(ETHContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="relative z-10 p-6">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
            <Network className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Open Trace Journal
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="hover:text-purple-300 transition-colors">
            Home
          </Link>
          <Link to="/mintpapernft" className="hover:text-purple-300 transition-colors">
            Submit
          </Link>
          <Link to="/paperslist" className="hover:text-purple-300 transition-colors">
            Papers
          </Link>
          <button
            className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            onClick={connectWallet}
          >
            {walletAddress ? formatAddress(walletAddress) : 'Connect Wallet'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-black" />
          ) : (
            <Menu className="w-6 h-6 text-black" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-6 pb-4 space-y-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <Link
            to="/"
            className="block py-2 hover:text-purple-300 transition-colors"
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link
            to="/mintpapernft"
            className="block py-2 hover:text-purple-300 transition-colors"
            onClick={closeMobileMenu}
          >
            Submit
          </Link>
          <Link
            to="/paperslist"
            className="block py-2 hover:text-purple-300 transition-colors"
            onClick={closeMobileMenu}
          >
            Papers
          </Link>
          <button
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-center"
            onClick={() => {
              connectWallet();
              closeMobileMenu();
            }}
          >
            {walletAddress ? formatAddress(walletAddress) : 'Connect Wallet'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
