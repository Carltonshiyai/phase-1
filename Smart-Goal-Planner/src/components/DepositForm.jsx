import React, { useState } from 'react';

function DepositModal({ onClose, onDeposit, goal }) {
  const [depositAmount, setDepositAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }
    onDeposit(goal.id, amount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Deposit to {goal.name}</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Current Saved: ${goal.savedAmount.toLocaleString()} / Target: ${goal.targetAmount.toLocaleString()}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="depositAmount" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Amount to Deposit
            </label>
            <input
              type="number"
              id="depositAmount"
              className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min="0.01"
              step="0.01"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-200"
            >
              Confirm Deposit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DepositModal;
