import React, { useState } from 'react';
import { X, DollarSign, Info, Save } from 'lucide-react';

export default function CitationFeeModal({ 
  isOpen, 
  onClose, 
  currentFee, 
  onUpdateFee, 
  paperTitle,
  isUpdating = false 
}) {
  const [newFee, setNewFee] = useState(currentFee || 0.1);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (newFee < 0) {
      setError('Citation fee cannot be negative');
      return;
    }
    
    if (newFee > 10) {
      setError('Citation fee cannot exceed 10 FIL');
      return;
    }
    
    setError('');
    
    try {
      await onUpdateFee(newFee);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update citation fee');
    }
  };

  const handleFeeChange = (e) => {
    const value = parseFloat(e.target.value);
    setNewFee(isNaN(value) ? 0 : value);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-white/10 p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-purple-400" />
            <span>Update Citation Fee</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            disabled={isUpdating}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Paper:</h3>
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
            {paperTitle}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Citation Fee (FIL)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={newFee}
                onChange={handleFeeChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter fee amount"
                disabled={isUpdating}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-gray-400 text-sm">FIL</span>
              </div>
            </div>
            
            <div className="mt-2 flex items-start space-x-2 text-xs text-gray-400">
              <Info className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
              <div>
                <p>Current fee: {currentFee} FIL</p>
                <p>Fee range: 0 - 10 FIL</p>
                <p>Lower fees encourage more citations, higher fees increase revenue per citation.</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Fee Impact Preview</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400">Current Fee:</span>
                <div className="text-purple-300 font-semibold">{currentFee} FIL</div>
              </div>
              <div>
                <span className="text-gray-400">New Fee:</span>
                <div className="text-green-300 font-semibold">{newFee} FIL</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10">
              <span className="text-gray-400 text-xs">
                {newFee > currentFee ? 'Higher fee may reduce citations but increase revenue' : 
                 newFee < currentFee ? 'Lower fee may increase citations but reduce revenue per citation' :
                 'No change in fee structure'}
              </span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              disabled={isUpdating || newFee === currentFee}
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Fee</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
