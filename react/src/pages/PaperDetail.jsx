import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, Share2, Star, Quote, Coins, Users, 
  Tag, TrendingUp, BookOpen, Hash, User, Settings, DollarSign
} from 'lucide-react';

import CitationPaymentModal from '../components/CitationPaymentModal';
import CitationFeeModal from '../components/CitationFeeModal';
import { formatAddress, formatDate } from '../utils/format';
import { ETHContext } from '../ETHContext';
import { useContracts } from '../utils/useContracts';

export default function PaperDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { signer, walletAddress } = useContext(ETHContext);
  const { getPaperById, payCitation, getPaperCitations, setCitationPrice } = useContracts();

  const [paperData, setPaperData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [citations, setCitations] = useState([]);
  const [isUpdatingFee, setIsUpdatingFee] = useState(false);

  // Mock paper data
  const paper = {
    id: '0x1234...5678',
    title: 'CRISPR-Cas9 Enhanced Metabolic Engineering for Sustainable Biofuel Production in Engineered Microorganisms',
    abstract: 'This research presents a novel approach to sustainable biofuel production through CRISPR-Cas9 enhanced metabolic engineering in engineered microorganisms. We demonstrate significant improvements in fuel yield and production efficiency while maintaining environmental sustainability. Our methodology combines advanced genetic engineering techniques with computational modeling to optimize metabolic pathways for enhanced biofuel synthesis.',
    authors: [
      { name: 'Dr. Sarah Chen', wallet: '0xabcd...1234', verified: true },
      { name: 'Dr. Michael Rodriguez', wallet: '0xefgh...5678', verified: true },
      { name: 'Dr. Elena Petrov', wallet: '0xijkl...9012', verified: false }
    ],
    field: 'Synthetic Biology',
    keywords: ['CRISPR-Cas9', 'Metabolic Engineering', 'Biofuel', 'Synthetic Biology', 'Sustainability'],
    publishDate: '2024-03-15',
    ipfsHash: 'QmYHGxLjsKd8p9RqwD3fG2nH5vB7cX1mE4qW8sT6uI9oL2',
    tokenURI: 'https://metadata.desci.com/papers/1234',
    citations: 127,
    downloads: 892,
    views: 3456,
    citationReward: 5, // tokens per citation
    totalEarned: 635,
    rating: 4.8,
    reviews: 23,
    license: 'Creative Commons Attribution 4.0'
  };

  const citationStyles = {
    APA: `Chen, S., Rodriguez, M., & Petrov, E. (2024). CRISPR-Cas9 Enhanced Metabolic Engineering for Sustainable Biofuel Production in Engineered Microorganisms. DeSci Journal of Synthetic Biology.`,
    MLA: `Chen, Sarah, et al. "CRISPR-Cas9 Enhanced Metabolic Engineering for Sustainable Biofuel Production in Engineered Microorganisms." DeSci Journal of Synthetic Biology, 2024.`,
    Chicago: `Chen, Sarah, Michael Rodriguez, and Elena Petrov. "CRISPR-Cas9 Enhanced Metabolic Engineering for Sustainable Biofuel Production in Engineered Microorganisms." DeSci Journal of Synthetic Biology (2024).`,
    Harvard: `Chen, S., Rodriguez, M. and Petrov, E. (2024) 'CRISPR-Cas9 Enhanced Metabolic Engineering for Sustainable Biofuel Production in Engineered Microorganisms', DeSci Journal of Synthetic Biology.`
  };

  useEffect(() => {
    setTimeout(async () => {
      if(signer) {
        const newPaper = await getPaperById(signer, id);
        setPaperData(newPaper);

        const newCitations = await getPaperCitations(signer, id);
        setCitations(newCitations);
      }
    }, 1000);
  }, [signer]);

  const copyCitation = (style) => {
    navigator.clipboard.writeText(citationStyles[style]);
  };

  const isAuthor = () => {
    return walletAddress && paperData && paperData?.author.toLowerCase() === walletAddress.toLowerCase();
  };

  const handleUpdateFee = async (newFee) => {
    setIsUpdatingFee(true);
    try {
      console.log(newFee)
      await setCitationPrice(signer, id, newFee);
      
      // Update local paper data
      setPaperData(prev => ({
        ...prev,
        citationFee: newFee
      }));
      
      // You might want to show a success message here
      console.log('Citation fee updated successfully');
    } catch (error) {
      console.error('Error updating citation fee:', error);
      throw error;
    } finally {
      setIsUpdatingFee(false);
    }
  };

  const currentCitationFee = paperData?.citationFee || 0.1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] animate-pulse"></div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" onClick={() => navigate("/paperslist")}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-purple-300 font-medium">{paperData?.field}</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-400">{formatDate(paperData?.timestamp)}</span>
                {isAuthor() && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-green-400 font-medium">Your Paper</span>
                  </>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{paperData?.title}</h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column - Paper Details */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Navigation Tabs */}
              <div className="flex space-x-6 border-b border-white/10">
                {['overview', 'citers'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-2 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab 
                        ? 'text-purple-300 border-b-2 border-purple-400' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-purple-400" />
                        <span>Abstract</span>
                      </h3>
                      <p className="text-gray-300 leading-relaxed">{paperData?.abstractText}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                        <Tag className="w-5 h-5 text-blue-400" />
                        <span>Keywords</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {paperData?.keywords?.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                        <Hash className="w-5 h-5 text-green-400" />
                        <span>Technical Details</span>
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">IPFS Hash:</span>
                            <span className="font-mono text-xs">{paper.ipfsHash}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Token ID:</span>
                            <span className="font-mono text-xs">{paper.id}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">License:</span>
                            <span className="text-xs">{paper.license}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Citation Fee:</span>
                            <span className="text-xs">{currentCitationFee} FIL</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'citers' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Citers list</h3>
                      <span className="text-sm text-gray-400">{citations.length} total citations</span>
                    </div>
                    
                    {citations.map((citation) => (
                      <div key={citation.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-purple-300">{citation?.title}</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{citation?.author}</p>
                        <p className="text-sm text-gray-300 leading-relaxed">{formatDate(citation?.timestamp)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Actions & Author Info */}
            <div className="space-y-6">
              
              {/* Author Management Panel - Only shown to paper author */}
              {isAuthor() && (
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-xl border border-green-500/20 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Settings className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold">Author Controls</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">Current Citation Fee</span>
                        <span className="text-sm font-semibold text-green-300">{currentCitationFee} FIL</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Total earned: {Number(paperData?.totalEarnings || 0) / 10 ** 18} FIL
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowFeeModal(true)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Update Citation Fee</span>
                    </button>
                     <button
                      onClick={() => navigate("/papersubmission/" + id)}
                      className="w-full bg-gradient-to-r from-blue-500 to-sky-500 px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <span>Upload Paper</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Citation Payment Card - Only shown to non-authors */}
              {!isAuthor() && (
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Quote className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold">Cite This Paper</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-2xl font-bold text-purple-300 mb-1">{currentCitationFee} FIL</div>
                      <div className="text-sm text-gray-400">Citation Fee</div>
                    </div>
                    
                    <button
                      onClick={() => setShowCitationModal(true)}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <Coins className="w-5 h-5" />
                      <span>Pay to Cite</span>
                    </button>
                    
                    <div className="text-xs text-gray-400 text-center">
                      Support the authors by paying for citations
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold mb-4">Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>Share Paper</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <Star className="w-5 h-5" />
                    <span>Add to Favorites</span>
                  </button>
                </div>
              </div>

              {/* Authors */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>Authors</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{formatAddress(paperData?.author)}</span>
                          {isAuthor() && (
                            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">You</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paper Stats */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span>Performance</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Publication Date:</span>
                    <span className="text-sm">{formatDate(paperData?.timestamp)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total Earnings:</span>
                    <span className="text-sm font-semibold text-purple-300">{Number(paperData?.totalEarnings || 0) / 10 ** 18} FIL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Citations:</span>
                    <span className="text-sm">{citations.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Reviews:</span>
                    <span className="text-sm">{paper.reviews} reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Citation Payment Modal */}
      {showCitationModal && (
        <CitationPaymentModal 
          id={id} 
          signer={signer} 
          payCitation={payCitation} 
          setShowCitationModal={setShowCitationModal} 
          citationFee={currentCitationFee}
        />
      )}

      {/* Citation Fee Management Modal */}
      {showFeeModal && (
        <CitationFeeModal
          isOpen={showFeeModal}
          onClose={() => setShowFeeModal(false)}
          currentFee={currentCitationFee}
          onUpdateFee={handleUpdateFee}
          paperTitle={paperData?.title}
          isUpdating={isUpdatingFee}
        />
      )}
    </div>
  );
}
