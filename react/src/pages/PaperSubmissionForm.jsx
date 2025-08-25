import { useContext, useState } from 'react';
import { FileText, Send, CheckCircle, AlertCircle, Loader2, ArrowRight, Zap, TimerIcon } from 'lucide-react';

import { ETHContext } from '../ETHContext';
import { useContracts } from '../utils/useContracts';

export default function PaperSubmissionForm() {
  const { provider, signer } = useContext(ETHContext);
  const { encryptData } = useContracts();

  const [paperDetail, setPaperDetail] = useState('');
  const [timeamount, setTimeamount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    // Clear any previous errors
    setError('');
    
    // Basic validation
    if (!paperDetail.trim()) {
      setError('Paper detail is required');
      return;
    }

    if (paperDetail.trim().length < 50) {
      setError('Paper detail must be at least 50 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      await encryptData(provider, signer, paperDetail, timeamount);

      setIsSuccess(true);
      
    } catch (error) {
      setError('Submission failed. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPaperDetail('');
    setIsSuccess(false);
    setError('');
  };

  const wordCount = paperDetail.trim().split(' ').filter(word => word.length > 0).length;
  const charCount = paperDetail.length;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6 flex items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] animate-pulse"></div>
        
        <div className="relative z-10 max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Submission Successful!
            </h2>
            <p className="text-gray-300 mb-8">
              Your paper details have been successfully submitted on-chain.
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={resetForm}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Submit Another Paper
            </button>
            <button className="w-full border border-white/30 hover:border-purple-400 px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] animate-pulse"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Paper Submission</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Submit Paper Details
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Provide detailed information about your research paper for review and publication
            </p>
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              
              {/* Form Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Paper Details</h2>
                  <p className="text-gray-400 text-sm">Enter comprehensive details about your research paper</p>
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Paper Detail <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={paperDetail}
                    onChange={(e) => setPaperDetail(e.target.value)}
                    placeholder="Provide comprehensive details about your paper including methodology, findings, conclusions, and any other relevant information..."
                    rows={12}
                    className={`w-full p-4 rounded-lg bg-white/10 border ${
                      error ? 'border-red-400' : 'border-white/20'
                    } focus:border-purple-400 focus:outline-none transition-colors text-white placeholder-gray-400 resize-none`}
                  />
                  
                  {/* Character/Word Count */}
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-sm text-gray-400">
                      <span className="mr-4">{wordCount} words</span>
                      <span>{charCount} characters</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Minimum 50 characters required
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <label className="block text-sm font-medium mb-3">
                  Time to unlock <span className="text-red-400">*</span>
                </label>
                <input
                  value={timeamount}
                  onChange={(e) => setTimeamount(e.target.value)}
                  placeholder="Blocks Ahead"
                  className={`w-full p-4 rounded-lg bg-white/10 border ${
                    error ? 'border-red-400' : 'border-white/20'
                  } focus:border-purple-400 focus:outline-none transition-colors text-white placeholder-gray-400 resize-none`}
                />

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !paperDetail.trim()}
                    className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                      isSubmitting || !paperDetail.trim()
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-2xl hover:shadow-purple-500/25'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Submit Paper Details</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4 border border-purple-500/30">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Encryption</h3>
                <p className="text-gray-400 text-sm">Your paper is encrypted on-chain</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-lg flex items-center justify-center mb-4 border border-blue-500/30">
                  <TimerIcon className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Timelock</h3>
                <p className="text-gray-400 text-sm">Your paper is decrypted once the specified condition is met</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
