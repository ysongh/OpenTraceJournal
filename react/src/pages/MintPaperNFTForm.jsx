import React, { useContext, useEffect, useState } from 'react';
import { FileText, Upload, Plus, X, CheckCircle, AlertCircle, Hash, Tag, BookOpen, Globe, Zap, ArrowRight } from 'lucide-react';
import lighthouse from "@lighthouse-web3/sdk";
import { Synapse, TOKENS, CONTRACT_ADDRESSES } from "@filoz/synapse-sdk";
import { ethers } from 'ethers';

import { ETHContext } from '../ETHContext';
import { useContracts } from '../utils/useContracts';
import { formatBalance } from '../utils/format';

export default function MintPaperNFTForm() {
  const { provider, signer } = useContext(ETHContext);
  const { mintPaper } = useContracts();

  const [usdfc, setusdfc] = useState(0);
  const [payments, setpayments] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    abstractText: '',
    ipfsHash: '',
    keywords: [],
    field: '',
    tokenURI: ''
  });

  const [currentKeyword, setCurrentKeyword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const academicFields = [
    'Synthetic Biology',
    'Biotechnology',
    'Computational Biology',
    'Neuroscience',
    'Machine Learning',
    'Quantum Computing',
    'Climate Science',
    'Materials Science',
    'Genetics',
    'Bioinformatics',
    'Other'
  ];
  
  useEffect(() => {
    if(provider) getUSDFCAllowance();
    if(provider) getBalance();
  }, [provider])

  const getUSDFCAllowance = async () => {
    const synapse = await Synapse.create({ provider });
    const paymentsContract = CONTRACT_ADDRESSES.PAYMENTS[synapse.getNetwork()]
    const currentAllowance = await synapse.payments.allowance(TOKENS.USDFC, paymentsContract)
    console.log(`USDFC Allowance: ${ethers.formatUnits(currentAllowance, 18)}`);
  };

  const getBalance = async () => {
    const synapse = await Synapse.create({ provider });
    const [filRaw, usdfcRaw, paymentsRaw] = await Promise.all([
      synapse.payments.walletBalance(),
      synapse.payments.walletBalance(TOKENS.USDFC),
      synapse.payments.balance(TOKENS.USDFC),
    ]);

    const usdfcDecimals = synapse.payments.decimals(TOKENS.USDFC);
    console.log(filRaw, usdfcRaw, paymentsRaw);
    setusdfc(formatBalance(usdfcRaw, usdfcDecimals));
    setpayments(formatBalance(paymentsRaw, usdfcDecimals));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!formData.abstractText.trim()) {
      newErrors.abstractText = 'Abstract is required';
    } else if (formData.abstractText.length < 100) {
      newErrors.abstractText = 'Abstract must be at least 100 characters';
    }

    if (!formData.ipfsHash.trim()) {
      newErrors.ipfsHash = 'IPFS hash is required';
    } else if (!/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(formData.ipfsHash)) {
      newErrors.ipfsHash = 'Invalid IPFS hash format';
    }

    if (formData.keywords.length === 0) {
      newErrors.keywords = 'At least one keyword is required';
    } else if (formData.keywords.length > 10) {
      newErrors.keywords = 'Maximum 10 keywords allowed';
    }

    if (!formData.field) {
      newErrors.field = 'Academic field is required';
    }

    if (formData.tokenURI && !/^https?:\/\/.+/.test(formData.tokenURI)) {
      newErrors.tokenURI = 'Token URI must be a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addKeyword = () => {
    if (currentKeyword.trim() && !formData.keywords.includes(currentKeyword.trim()) && formData.keywords.length < 10) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, currentKeyword.trim()]
      }));
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (index) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const handleKeywordKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2)
    console.log(percentageDone)
  }

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;

    const fakeHash = `Qm${Math.random().toString(36).substr(2, 44)}`;
    handleInputChange('ipfsHash', fakeHash);

    if (files && files[0]) {
      // Simulate IPFS upload
      const apiKey = import.meta.env.VITE_LIGHTHOUSE_APIKEY;

      const output = await lighthouse.upload(files, apiKey, null, progressCallback);
      console.log('Visit at https://gateway.lighthouse.storage/ipfs/' + output.data.Hash);

      //handleInputChange('ipfsHash', output.data.Hash);
    }
  };

  const handleSubmit = async () => {
    // if (!validateForm()) {
    //   return;
    // }

    setIsSubmitting(true);

    console.log( formData.title,
      formData.abstractText,
      formData.ipfsHash,
      formData.keywords,
      formData.field,
      formData.ipfsHash)
    
    // Simulate minting process
    try {
      await mintPaper(
        signer,
        formData.title,
        formData.abstractText,
        formData.ipfsHash,
        formData.keywords,
        formData.field
      );
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
      console.log('Minting paper NFT with data:', formData);
    } catch (error) {
      console.error('Minting failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const storeString = async () => {
    const synapse = await Synapse.create({ provider });

    // Deposit USDFC tokens (one-time setup)
    const amount = ethers.parseUnits('10', 18);  // 10 USDFC
    await synapse.payments.deposit(amount, TOKENS.USDFC);

    // Approve the Pandora service for automated payments
    const pandoraAddress = CONTRACT_ADDRESSES.PANDORA_SERVICE[synapse.getNetwork()]
    await synapse.payments.approveService(
      pandoraAddress,
      ethers.parseUnits('10', 18),   // Rate allowance: 10 USDFC per epoch
      ethers.parseUnits('1000', 18)  // Lockup allowance: 1000 USDFC total
    );

    const storage = await synapse.createStorage({
        callbacks: {
          onDataSetResolved: (info) => {
            console.log("Dataset resolved:", info);
            setStatus("🔗 Existing dataset found and resolved");
            setProgress(30);
          },
          onDataSetCreationStarted: (transactionResponse, statusUrl) => {
            console.log("Dataset creation started:", transactionResponse);
            console.log("Dataset creation status URL:", statusUrl);
            setStatus("🏗️ Creating new dataset on blockchain...");
            setProgress(35);
          },
          onDataSetCreationProgress: (status) => {
            console.log("Dataset creation progress:", status);
            if (status.transactionSuccess) {
              setStatus(`⛓️ Dataset transaction confirmed on chain`);
              setProgress(45);
            }
            if (status.serverConfirmed) {
              setStatus(
                `🎉 Dataset ready! (${Math.round(status.elapsedMs / 1000)}s)`
              );
              setProgress(50);
            }
          },
          onProviderSelected: (provider) => {
            console.log("Storage provider selected:", provider);
            setStatus(`🏪 Storage provider selected`);
          },
        },
      });
    const data = new TextEncoder().encode(formData.abstractText);
    const result = await storage.upload(data);
    console.log(`Stored with CommP: ${result.commp}`)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      abstractText: '',
      ipfsHash: '',
      keywords: [],
      field: '',
      tokenURI: ''
    });
    setCurrentKeyword('');
    setErrors({});
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              NFT Minted Successfully!
            </h2>
            <p className="text-gray-300 mb-8">
              Your research paper has been successfully minted as an NFT and is now available on the blockchain.
            </p>
          </div>
          <div className="space-y-4">
            <button
              onClick={resetForm}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Mint Another Paper
            </button>
            <button className="w-full border border-white/30 hover:border-purple-400 px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
              View My Papers
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
      
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Mint Research NFT</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Publish Your Research
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Transform your academic paper into an NFT and start earning from citations and downloads
            </p>
          </div>

          <p>{usdfc} USDFC</p>
          <p>{payments} USDFC</p>

          {/* Form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            <div className="space-y-8">
              
              {/* Title */}
              <div>
                <label className="flex items-center space-x-2 text-lg font-semibold mb-3">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <span>Paper Title *</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter your paper's title"
                  className={`w-full p-4 rounded-lg bg-white/10 border ${
                    errors.title ? 'border-red-400' : 'border-white/20'
                  } focus:border-purple-400 focus:outline-none transition-colors text-white placeholder-gray-400`}
                />
                {errors.title && (
                  <p className="mt-2 text-red-400 text-sm flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* Abstract */}
              <div>
                <label className="flex items-center space-x-2 text-lg font-semibold mb-3">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <span>Abstract *</span>
                </label>
                <textarea
                  value={formData.abstractText}
                  onChange={(e) => handleInputChange('abstractText', e.target.value)}
                  placeholder="Provide a comprehensive abstract of your research paper..."
                  rows={6}
                  className={`w-full p-4 rounded-lg bg-white/10 border ${
                    errors.abstractText ? 'border-red-400' : 'border-white/20'
                  } focus:border-purple-400 focus:outline-none transition-colors text-white placeholder-gray-400 resize-none`}
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.abstractText ? (
                    <p className="text-red-400 text-sm flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.abstractText}</span>
                    </p>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      {formData.abstractText.length}/100 minimum characters
                    </span>
                  )}
                </div>
              </div>

              <button
                  onClick={storeString}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                    isSubmitting
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-2xl hover:shadow-purple-500/25'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Minting NFT...</span>
                    </>
                  ) : (
                    <>
                      <span>Store onchain</span>
                    </>
                  )}
                </button>

              {/* IPFS Hash */}
              <div>
                <label className="flex items-center space-x-2 text-lg font-semibold mb-3">
                  <Hash className="w-5 h-5 text-purple-400" />
                  <span>Upload Document *</span>
                </label>
                <div className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive ? 'border-purple-400 bg-purple-400/10' : 'border-white/20'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-300 mb-2">Drag and drop your paper file here</p>
                    <p className="text-gray-500 text-sm">We'll automatically upload to IPFS and generate the hash</p>
                  </div>
                  {/* <div className="text-center text-gray-400">or</div>
                  <input
                    type="text"
                    value={formData.ipfsHash}
                    onChange={(e) => handleInputChange('ipfsHash', e.target.value)}
                    placeholder="Enter IPFS hash manually (e.g., QmYourHashHere...)"
                    className={`w-full p-4 rounded-lg bg-white/10 border ${
                      errors.ipfsHash ? 'border-red-400' : 'border-white/20'
                    } focus:border-purple-400 focus:outline-none transition-colors text-white placeholder-gray-400 font-mono text-sm`}
                  /> */}
                </div>
                {errors.ipfsHash && (
                  <p className="mt-2 text-red-400 text-sm flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.ipfsHash}</span>
                  </p>
                )}
              </div>

              {/* Keywords */}
              <div>
                <label className="flex items-center space-x-2 text-lg font-semibold mb-3">
                  <Tag className="w-5 h-5 text-purple-400" />
                  <span>Keywords *</span>
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={currentKeyword}
                      onChange={(e) => setCurrentKeyword(e.target.value)}
                      onKeyPress={handleKeywordKeyPress}
                      placeholder="Add a keyword"
                      className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 focus:border-purple-400 focus:outline-none transition-colors text-white placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      disabled={!currentKeyword.trim() || formData.keywords.length >= 10}
                      className="px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {formData.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full text-sm"
                        >
                          <span>{keyword}</span>
                          <button
                            type="button"
                            onClick={() => removeKeyword(index)}
                            className="hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-400">
                    {formData.keywords.length}/10 keywords • Press Enter to add
                  </div>
                </div>
                {errors.keywords && (
                  <p className="mt-2 text-red-400 text-sm flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.keywords}</span>
                  </p>
                )}
              </div>

              {/* Academic Field */}
              <div>
                <label className="flex items-center space-x-2 text-lg font-semibold mb-3">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span>Academic Field *</span>
                </label>
                <select
                  value={formData.field}
                  onChange={(e) => handleInputChange('field', e.target.value)}
                  className={`w-full p-4 rounded-lg bg-white/10 border ${
                    errors.field ? 'border-red-400' : 'border-white/20'
                  } focus:border-purple-400 focus:outline-none transition-colors text-white`}
                >
                  <option value="" className="bg-slate-800">Select an academic field</option>
                  {academicFields.map((field) => (
                    <option key={field} value={field} className="bg-slate-800">
                      {field}
                    </option>
                  ))}
                </select>
                {errors.field && (
                  <p className="mt-2 text-red-400 text-sm flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.field}</span>
                  </p>
                )}
              </div>

              {/* Token URI (Optional) */}
              {/* <div>
                <label className="flex items-center space-x-2 text-lg font-semibold mb-3">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span>Token URI <span className="text-gray-400 font-normal">(Optional)</span></span>
                </label>
                <input
                  type="url"
                  value={formData.tokenURI}
                  onChange={(e) => handleInputChange('tokenURI', e.target.value)}
                  placeholder="https://your-metadata-uri.com/metadata.json"
                  className={`w-full p-4 rounded-lg bg-white/10 border ${
                    errors.tokenURI ? 'border-red-400' : 'border-white/20'
                  } focus:border-purple-400 focus:outline-none transition-colors text-white placeholder-gray-400`}
                />
                <p className="mt-2 text-gray-400 text-sm">
                  Optional metadata URI for additional NFT properties. Leave empty to auto-generate.
                </p>
                {errors.tokenURI && (
                  <p className="mt-2 text-red-400 text-sm flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.tokenURI}</span>
                  </p>
                )}
              </div> */}

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  onClick={handleSubmit}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                    isSubmitting
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-2xl hover:shadow-purple-500/25'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Minting NFT...</span>
                    </>
                  ) : (
                    <>
                      <span>Mint Paper NFT</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4 border border-purple-500/30">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Publication</h3>
              <p className="text-gray-400 text-sm">Your paper becomes immediately available to the global research community upon minting.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4 border border-blue-500/30">
                <Hash className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Immutable Record</h3>
              <p className="text-gray-400 text-sm">Blockchain technology ensures your research is permanently recorded and cannot be altered.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4 border border-green-500/30">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Earn Rewards</h3>
              <p className="text-gray-400 text-sm">Start earning tokens immediately when other researchers cite or download your work.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
