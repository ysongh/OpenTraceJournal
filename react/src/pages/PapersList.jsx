import React, { useContext, useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Users, TrendingUp, Calendar, Tag, Hash, ExternalLink, Heart, Download, Share2, Award, Zap, Eye, MessageCircle, Star, ChevronDown, X, Grid, List } from 'lucide-react';

import { formatAddress } from '../utils/format';
import { ETHContext } from '../ETHContext';
import { useContracts } from '../utils/useContracts';

export default function PapersList() {
  const { signer } = useContext(ETHContext);
  const { getPapers } = useContracts();

  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('all');
  const [sortBy, setSortBy] = useState('citations');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for papers
  const mockPapers = [
    {
      id: 1,
      title: "CRISPR-Cas9 Gene Editing in Synthetic Biology: A Comprehensive Review",
      abstract: "This paper explores the revolutionary applications of CRISPR-Cas9 technology in synthetic biology, examining its potential for creating novel biological systems and addressing global challenges in medicine, agriculture, and environmental sustainability.",
      authors: ["Dr. Sarah Chen", "Dr. Michael Rodriguez", "Dr. Lisa Wang"],
      field: "Synthetic Biology",
      keywords: ["CRISPR", "Gene Editing", "Synthetic Biology", "Biotechnology"],
      citations: 1247,
      downloads: 8934,
      likes: 342,
      publishedDate: "2024-11-15",
      ipfsHash: "QmYx8K7mJ4nP9qR3sT2vU6wX1yZ5aB8cD9eF0gH2iJ3kL4m",
      tokenId: "0x1a2b3c4d5e6f7g8h9i0j",
      price: "0.05 ETH",
      owner: "0x1234...5678",
      views: 12547,
      comments: 89,
      rating: 4.8,
      verified: true,
      trending: true
    },
    {
      id: 2,
      title: "Machine Learning Applications in Protein Folding Prediction",
      abstract: "An in-depth analysis of how machine learning algorithms are transforming protein folding prediction, with implications for drug discovery and therapeutic development.",
      authors: ["Dr. James Thompson", "Dr. Maria Santos"],
      field: "Computational Biology",
      keywords: ["Machine Learning", "Protein Folding", "Drug Discovery", "AI"],
      citations: 892,
      downloads: 5431,
      likes: 198,
      publishedDate: "2024-10-22",
      ipfsHash: "QmZa1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0u1V2",
      tokenId: "0x2b3c4d5e6f7g8h9i0j1k",
      price: "0.03 ETH",
      owner: "0x2345...6789",
      views: 8932,
      comments: 67,
      rating: 4.6,
      verified: true,
      trending: false
    },
    {
      id: 3,
      title: "Quantum Computing Algorithms for Molecular Simulation",
      abstract: "This research presents novel quantum computing algorithms designed to simulate molecular interactions with unprecedented accuracy, potentially revolutionizing materials science and drug development.",
      authors: ["Dr. Alan Kumar", "Dr. Elena Petrov", "Dr. David Kim"],
      field: "Quantum Computing",
      keywords: ["Quantum Computing", "Molecular Simulation", "Materials Science", "Algorithms"],
      citations: 567,
      downloads: 3421,
      likes: 156,
      publishedDate: "2024-09-30",
      ipfsHash: "QmXy9W8v7U6t5S4r3Q2p1O0n9M8l7K6j5I4h3G2f1E0d9C8",
      tokenId: "0x3c4d5e6f7g8h9i0j1k2l",
      price: "0.08 ETH",
      owner: "0x3456...7890",
      views: 6754,
      comments: 45,
      rating: 4.9,
      verified: true,
      trending: true
    },
    {
      id: 4,
      title: "Neuromorphic Computing for Brain-Computer Interfaces",
      abstract: "Exploring the intersection of neuromorphic computing and brain-computer interfaces, this paper discusses breakthrough technologies that could enable direct neural control of digital systems.",
      authors: ["Dr. Rebecca Torres", "Dr. Alex Johnson"],
      field: "Neuroscience",
      keywords: ["Neuromorphic", "Brain-Computer Interface", "Neural Networks", "Bioengineering"],
      citations: 423,
      downloads: 2876,
      likes: 112,
      publishedDate: "2024-08-14",
      ipfsHash: "QmVw8X9y0Z1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R9",
      tokenId: "0x4d5e6f7g8h9i0j1k2l3m",
      price: "0.04 ETH",
      owner: "0x4567...8901",
      views: 4532,
      comments: 32,
      rating: 4.7,
      verified: false,
      trending: false
    },
    {
      id: 5,
      title: "Climate Change Mitigation through Synthetic Carbon Capture",
      abstract: "This study presents innovative synthetic biology approaches to carbon capture and storage, offering potential solutions for large-scale climate change mitigation efforts.",
      authors: ["Dr. Sofia Andersson", "Dr. Carlos Mendoza", "Dr. Yuki Tanaka"],
      field: "Climate Science",
      keywords: ["Climate Change", "Carbon Capture", "Synthetic Biology", "Environmental"],
      citations: 789,
      downloads: 6789,
      likes: 267,
      publishedDate: "2024-07-03",
      ipfsHash: "QmTu7V8w9X0y1Z2a3B4c5D6e7F8g9H0i1J2k3L4m5N6o7P8",
      tokenId: "0x5e6f7g8h9i0j1k2l3m4n",
      price: "0.06 ETH",
      owner: "0x5678...9012",
      views: 9876,
      comments: 123,
      rating: 4.5,
      verified: true,
      trending: true
    }
  ];

  const academicFields = [
    'All Fields',
    'Synthetic Biology',
    'Computational Biology',
    'Quantum Computing',
    'Neuroscience',
    'Climate Science',
    'Machine Learning',
    'Biotechnology',
    'Materials Science'
  ];

  const sortOptions = [
    { value: 'citations', label: 'Most Cited' },
    { value: 'downloads', label: 'Most Downloaded' },
    { value: 'date', label: 'Most Recent' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'trending', label: 'Trending' }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(async () => {
      if(signer) {
        const newPapers = await getPapers(signer);
        setPapers(newPapers);
      }
      
      setFilteredPapers(mockPapers);
      setIsLoading(false);
    }, 1000);
  }, [signer]);

  useEffect(() => {
    let filtered = papers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(paper =>
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        paper.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by field
    if (selectedField !== 'all') {
      filtered = filtered.filter(paper => paper.field === selectedField);
    }

    // Sort papers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'citations':
          return b.citations - a.citations;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'date':
          return new Date(b.publishedDate) - new Date(a.publishedDate);
        case 'rating':
          return b.rating - a.rating;
        case 'trending':
          return b.trending - a.trending;
        default:
          return 0;
      }
    });

    setFilteredPapers(filtered);
  }, [papers, searchTerm, selectedField, sortBy]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const PaperCard = ({ paper }) => (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-sm text-gray-400">#{paper.id}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-300">{paper.rating}</span>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Heart className="w-4 h-4 text-gray-400 hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold mb-3 group-hover:text-purple-300 transition-colors line-clamp-2">
        {paper.title}
      </h3>

      {/* Authors */}
      <div className="flex items-center space-x-2 mb-3">
        <Users className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-300">
          {formatAddress(paper.author || "")}
        </span>
      </div>

      {/* Abstract */}
      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
        {paper.abstractText}
      </p>

      {/* Keywords */}
      <div className="flex flex-wrap gap-2 mb-4">
        {paper.keywords.slice(0, 3).map((keyword, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
          >
            {keyword}
          </span>
        ))}
        {paper.keywords.length > 3 && (
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full border border-gray-500/30">
            +{paper.keywords.length - 3} more
          </span>
        )}
      </div>

      {/* NFT Info */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-3 mb-4 border border-purple-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">NFT Token</span>
          </div>
          <span className="text-sm font-bold text-green-400">{paper.price}</span>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          {paper.tokenId}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">{formatDate(paper.publishedDate)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">{paper.field}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Download className="w-4 h-4 text-gray-400 hover:text-blue-400 transition-colors" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Share2 className="w-4 h-4 text-gray-400 hover:text-purple-400 transition-colors" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ExternalLink className="w-4 h-4 text-gray-400 hover:text-green-400 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );

  const PaperListItem = ({ paper }) => (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300 group">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-purple-500/30 flex-shrink-0">
          <BookOpen className="w-6 h-6 text-purple-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-bold group-hover:text-purple-300 transition-colors truncate">
              {paper.title}
            </h3>
            {paper.verified && (
              <Award className="w-4 h-4 text-green-400 flex-shrink-0" />
            )}
            {paper.trending && (
              <TrendingUp className="w-4 h-4 text-orange-400 flex-shrink-0" />
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
            <span>{paper.authors.join(', ')}</span>
            <span>•</span>
            <span>{paper.field}</span>
            <span>•</span>
            <span>{formatDate(paper.publishedDate)}</span>
          </div>
          
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {paper.abstract}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">{formatNumber(paper.citations)} citations</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">{formatNumber(paper.downloads)} downloads</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">{formatNumber(paper.views)} views</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-green-400">{paper.price}</span>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-purple-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading research papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] animate-pulse"></div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Discover Research</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Research Papers
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore cutting-edge research papers minted as NFTs, earn from citations, and discover breakthrough science
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search papers, authors, keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white placeholder-gray-400"
                />
              </div>

              {/* Field Filter */}
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white"
              >
                {academicFields.map((field) => (
                  <option key={field} value={field === 'All Fields' ? 'all' : field} className="bg-slate-800">
                    {field}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-slate-800">
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400">
              Showing {filteredPapers.length} of {papers.length} papers
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Total Citations:</span>
              <span className="text-lg font-bold text-purple-400">
                {formatNumber(filteredPapers.reduce((sum, paper) => sum + paper.citations, 0))}
              </span>
            </div>
          </div>

          {/* Papers Grid/List */}
          {filteredPapers.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-300 mb-2">No papers found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredPapers.map((paper) => (
                viewMode === 'grid' ? 
                  <PaperCard key={paper.id} paper={paper} /> : 
                  <PaperListItem key={paper.id} paper={paper} />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredPapers.length > 0 && (
            <div className="text-center mt-12">
              <button className="bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto">
                <span>Load More Papers</span>
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}