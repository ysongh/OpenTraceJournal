import React, { useContext } from 'react';
import { Network } from 'lucide-react';

import { ETHContext } from '../ETHContext';

const Navbar = () => {
  const { walletAddress, connectWallet } = useContext(ETHContext);

  return (
    <nav className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
            <Network className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">DeSci Journal</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="hover:text-purple-300 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-purple-300 transition-colors">How It Works</a>
          <a href="#tokenomics" className="hover:text-purple-300 transition-colors">Tokenomics</a>
          <button
            className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            onClick={connectWallet}
          >
            {walletAddress ? walletAddress : 'Connect Wallet'}
          </button>
        </div>
      </nav>
  );
};

export default Navbar;
