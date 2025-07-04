import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, BookOpen, Coins, Users, Shield, Zap, Globe, ArrowRight, Star, TrendingUp, Award, Network, Vote, FileText, ExternalLink } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "NFT Publications",
      description: "Authors publish papers as unique NFTs, creating verifiable ownership and enabling novel monetization models."
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: "Citation Mining",
      description: "Earn tokens based on citations and downloads. Quality research is automatically rewarded through on-chain metrics."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Curator Rewards",
      description: "Researchers and AI agents earn tokens for curating high-quality papers and linking related works."
    },
    {
      icon: <Vote className="w-6 h-6" />,
      title: "DAO Governance",
      description: "Community-driven standards with quadratic voting to prioritize funding for underrepresented fields."
    }
  ];

  const stats = [
    { label: "Papers Published", value: "12,547", icon: <FileText className="w-5 h-5" /> },
    { label: "Citations Mined", value: "89,234", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Active Curators", value: "3,891", icon: <Users className="w-5 h-5" /> },
    { label: "Tokens Distributed", value: "₮2.1M", icon: <Coins className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] animate-pulse"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">Revolutionary Academic Publishing</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Decentralized
            </span>
            <br />
            Open-Access Journal
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Where authors publish papers as NFTs, earn tokens from citations, and researchers mine knowledge to advance science through blockchain-powered incentives.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="group bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              onClick={() => navigate("/mintpapernft")}
            >
              <span>Start Publishing</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className="group border border-white/30 hover:border-purple-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
              onClick={() => navigate("/paperslist")}
            >
              <span>Explore Papers</span>
              <ExternalLink className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30 group-hover:border-purple-400 transition-colors">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transforming academic publishing through blockchain technology and economic incentives
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group p-6 rounded-2xl border transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                  activeFeature === index 
                    ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-400 shadow-2xl shadow-purple-500/25' 
                    : 'bg-white/5 border-white/10 hover:border-purple-500/50 hover:bg-white/10'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full w-fit border border-purple-500/30 group-hover:border-purple-400 transition-colors">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 px-6 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A seamless process that rewards quality research and meaningful contributions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-purple-300 transition-colors">Publish as NFT</h3>
              <p className="text-gray-400 leading-relaxed">Authors mint their research papers as unique NFTs, establishing verifiable ownership and enabling novel monetization.</p>
            </div>

            <div className="text-center group">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-purple-300 transition-colors">Mine Citations</h3>
              <p className="text-gray-400 leading-relaxed">Curators and AI agents earn tokens by linking related works, validating citations, and maintaining research networks.</p>
            </div>

            <div className="text-center group">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-purple-300 transition-colors">Earn Rewards</h3>
              <p className="text-gray-400 leading-relaxed">Authors receive tokens based on citations and downloads, while the community benefits from transparent, accessible knowledge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics */}
      <section id="tokenomics" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Economic Design
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Smart contracts and DAO governance create sustainable incentives for quality research
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Citation-Based Rewards</h3>
                  <p className="text-gray-400">Authors earn tokens proportional to citations and downloads, tracked via on-chain metadata and oracles like Crossref.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">DAO Governance</h3>
                  <p className="text-gray-400">Community sets journal standards and miner incentives through decentralized governance and quadratic voting.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Curator Incentives</h3>
                  <p className="text-gray-400">Researchers and AI agents build reputation and earn tokens for quality curation and knowledge linking.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-8 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-6 text-center">Token Distribution</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Author Rewards</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-400">40%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Citation Mining</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-18 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-400">30%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>DAO Treasury</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-sm text-gray-400">20%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Development</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-400">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Revolutionize Research?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the future of academic publishing where quality research is rewarded and knowledge flows freely through decentralized incentives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Launch DeSci Journal</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}