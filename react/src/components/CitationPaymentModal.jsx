import React, { useState } from 'react';
import { Quote, CheckCircle, Wallet, Copy } from 'lucide-react';

function CitationPaymentModal({ id, signer, payCitation, setShowCitationModal }) {
  const [citerTitle, setCiterTitle] = useState('');
  const [citerAuthorName, setCiterAuthorName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [citationAmount, setCitationAmount] = useState('5');
  const [selectedCitationStyle, setSelectedCitationStyle] = useState('APA');

  const citationStyles = {
    APA: `Chen, S., Rodriguez, M., & Petrov, E. (2024). CRISPR-Cas9 Enhanced Metabolic Engineering for Sustainable Biofuel Production in Engineered Microorganisms. DeSci Journal of Synthetic Biology.`,
    MLA: `Chen, Sarah, et al. "CRISPR-Cas9 Enhanced Metabolic Engineering for Sustainable Biofuel Production in Engineered Microorganisms." DeSci Journal of Synthetic Biology, 2024.`,
    Chicago: `Chen, Sarah, Michael Rodriguez, and Elena Petrov. "CRISPR-Cas9 Enhanced Metabolic Engineering for Sustainable Biofuel Production in Engineered Microorganisms." DeSci Journal of Synthetic Biology (2024).`,
    Harvard: `Chen, S., Rodriguez, M. and Petrov, E. (2024) 'CRISPR-Cas9 Enhanced Metabolic Engineering for Sustainable Biofuel Production in Engineered Microorganisms', DeSci Journal of Synthetic Biology.`
  };

  const handleCitationPayment = async () => {
    setIsProcessing(true);
    
    try {
      await payCitation(signer, id, citerTitle, citerAuthorName);
      
      setPaymentSuccess(true);
      
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCitationModal = () => {
    setShowCitationModal(false);
    setPaymentSuccess(false);
    setCitationAmount('5');
    setSelectedCitationStyle('APA');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-md w-full p-6">
        {!paymentSuccess ? (
          <div className="space-y-6">
            <div className="text-center">
              <Quote className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-2xl font-bold mb-2">Pay to Cite</h3>
              <p className="text-gray-400">Support the authors by paying for your citation</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Citation Amount</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={citationAmount}
                      onChange={(e) => setCitationAmount(e.target.value)}
                      min="0.1"
                      step="0.1"
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:border-purple-400 focus:outline-none text-white"
                    />
                    <span className="absolute right-3 top-3 text-gray-400">₮</span>
                  </div>
                  <button
                    onClick={() => setCitationAmount(paper.citationReward.toString())}
                    className="px-4 py-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm hover:bg-purple-500/30 transition-colors"
                  >
                    Default
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Citer Title</label>
                <input
                  value={citerTitle}
                  onChange={(e) => setCiterTitle(e.target.value)}
                  placeholder="Name of your paper."
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:border-purple-400 focus:outline-none text-white placeholder-gray-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Citer Author Name</label>
                <input
                  value={citerAuthorName}
                  onChange={(e) => setCiterAuthorName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:border-purple-400 focus:outline-none text-white placeholder-gray-400 resize-none"
                />
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-400">Citation Fee:</span>
                  <span>₮{citationAmount}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-400">Network Fee:</span>
                  <span>₮0.05</span>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total:</span>
                    <span className="text-purple-300">₮{(parseFloat(citationAmount) + 0.05).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={resetCitationModal}
                className="flex-1 px-4 py-3 border border-white/30 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCitationPayment}
                disabled={isProcessing}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isProcessing
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-lg hover:shadow-purple-500/25'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>Pay Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-green-400">Payment Successful!</h3>
              <p className="text-gray-400">Your citation payment has been processed</p>
            </div>

            <div className="bg-white/5 p-4 rounded-lg text-left">
              <h4 className="font-semibold mb-2">Citation ({selectedCitationStyle})</h4>
              <p className="text-sm text-gray-300 leading-relaxed">{citationStyles[selectedCitationStyle]}</p>
              <button
                onClick={() => copyCitation(selectedCitationStyle)}
                className="mt-3 flex items-center space-x-2 text-purple-300 hover:text-purple-200 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Citation</span>
              </button>
            </div>

            <button
              onClick={resetCitationModal}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CitationPaymentModal;