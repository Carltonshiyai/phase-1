import React, { useState, useEffect, useCallback } from 'react';


const API_BASE_URL = 'http://localhost:3000/goals';


const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KSH',
  }).format(amount);
};


const calculateDaysLeft = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};


const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <p className="text-lg font-semibold mb-4 text-gray-800">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// GoalActionPlanModal Component (New LLM-powered feature)
const GoalActionPlanModal = ({ goal, onClose }) => {
  const [actionPlan, setActionPlan] = useState('');
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [planError, setPlanError] = useState(null);

  useEffect(() => {
    const fetchActionPlan = async () => {
      setLoadingPlan(true);
      setPlanError(null);
      setActionPlan(''); // Clear previous plan

      const prompt = `Generate a detailed, actionable plan to achieve the financial goal: '${goal.name}' with a target amount of ${goal.targetAmount} USD and a deadline of ${goal.deadline}. The current saved amount is ${goal.savedAmount} USD. Include at least 5 distinct steps, potential challenges, and tips for staying motivated. Format the plan clearly with headings and bullet points using Markdown.`;

      try {
        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        const apiKey = ""; // Leave as empty string, Canvas will provide it
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API error: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
        }

        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          const text = result.candidates[0].content.parts[0].text;
          setActionPlan(text);
        } else {
          setPlanError("Could not generate an action plan. Please try again.");
        }
      } catch (err) {
        console.error("Error generating action plan:", err);
        setPlanError(`Failed to generate plan: ${err.message}`);
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchActionPlan();
  }, [goal]); // Re-fetch plan if goal changes

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Action Plan for: {goal.name}</h2>
        {loadingPlan ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="ml-3 text-gray-700">Generating plan...</p>
          </div>
        ) : planError ? (
          <p className="text-red-600 text-center py-8">{planError}</p>
        ) : (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(actionPlan) }}></div>
        )}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// GoalItem Component
const GoalItem = ({ goal, onDelete, onEdit, onDeposit, onGetActionPlan }) => {
  const progress = (goal.savedAmount / goal.targetAmount) * 100;
  const remainingAmount = goal.targetAmount - goal.savedAmount;
  const daysLeft = calculateDaysLeft(goal.deadline);
  const isCompleted = goal.savedAmount >= goal.targetAmount;
  const isOverdue = daysLeft < 0 && !isCompleted;
  const isWarning = daysLeft <= 30 && daysLeft >= 0 && !isCompleted;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800">{goal.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(goal)}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
            title="Edit Goal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
            title="Delete Goal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-2">Category: <span className="font-medium text-gray-700">{goal.category}</span></p>
      <p className="text-sm text-gray-600 mb-2">Deadline: <span className="font-medium text-gray-700">{goal.deadline}</span></p>

      <div className="mb-3">
        <p className="text-sm text-gray-700">
          Saved: <span className="font-semibold">{formatCurrency(goal.savedAmount)}</span> / Target: <span className="font-semibold">{formatCurrency(goal.targetAmount)}</span>
        </p>
        <p className="text-sm text-gray-700">
          Remaining: <span className="font-semibold text-red-600">{formatCurrency(remainingAmount)}</span>
        </p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
        <div
          className="h-2.5 rounded-full"
          style={{
            width: `${Math.min(100, progress)}%`,
            backgroundColor: isCompleted ? '#22C55E' : '#3B82F6', // Green for completed, blue otherwise
          }}
        ></div>
      </div>
      <p className="text-sm font-medium text-gray-700 mb-3">{progress.toFixed(2)}% Complete</p>

      {isCompleted ? (
        <p className="text-green-600 font-semibold">Goal Completed! 🎉</p>
      ) : isOverdue ? (
        <p className="text-red-600 font-semibold">Overdue! ⏰</p>
      ) : (
        <p className="text-gray-700">
          Days Left: <span className={`font-semibold ${isWarning ? 'text-orange-500' : ''}`}>{daysLeft}</span>
          {isWarning && <span className="ml-2 text-orange-500 font-semibold"> (Approaching Deadline!)</span>}
        </p>
      )}

      {/* New LLM-powered button */}
      <button
        onClick={() => onGetActionPlan(goal)}
        className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 flex items-center justify-center"
      >
        ✨ Get Action Plan
      </button>
    </div>
  );
};

// GoalList Component
const GoalList = ({ goals, onDelete, onEdit, onDeposit, onGetActionPlan }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.length === 0 ? (
        <p className="text-center text-gray-600 col-span-full">No goals added yet. Start by adding a new goal!</p>
      ) : (
        goals.map((goal) => (
          <GoalItem
            key={goal.id}
            goal={goal}
            onDelete={onDelete}
            onEdit={onEdit}
            onDeposit={onDeposit}
            onGetActionPlan={onGetActionPlan} // Pass the new prop
          />
        ))
      )}
    </div>
  );
};

// AddGoalForm Component
const AddGoalForm = ({ onAddGoal }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !targetAmount || !category || !deadline) {
      alert('Please fill in all fields.'); // Using alert for simplicity as per instructions, but a custom modal would be better.
      return;
    }

    const newGoal = {
      name,
      targetAmount: parseFloat(targetAmount),
      savedAmount: 0, // New goals start with 0 saved
      category,
      deadline,
      createdAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };
    onAddGoal(newGoal);
    // Clear form
    setName('');
    setTargetAmount('');
    setCategory('');
    setDeadline('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Goal</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Goal Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">Target Amount</label>
          <input
            type="number"
            id="targetAmount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
          <input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            Add Goal
          </button>
        </div>
      </form>
    </div>
  );
};

// DepositForm Component
const DepositForm = ({ goals, onMakeDeposit }) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!depositAmount || !selectedGoalId) {
      alert('Please enter an amount and select a goal.'); // Using alert for simplicity
      return;
    }
    const amount = parseFloat(depositAmount);
    if (amount <= 0) {
      alert('Deposit amount must be positive.'); // Using alert for simplicity
      return;
    }
    onMakeDeposit(selectedGoalId, amount);
    setDepositAmount('');
    setSelectedGoalId('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Make a Deposit</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700">Deposit Amount</label>
          <input
            type="number"
            id="depositAmount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            min="0.01"
            step="0.01"
            required
          />
        </div>
        <div>
          <label htmlFor="selectGoal" className="block text-sm font-medium text-gray-700">Select Goal</label>
          <select
            id="selectGoal"
            value={selectedGoalId}
            onChange={(e) => setSelectedGoalId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="">-- Select a Goal --</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Deposit
          </button>
        </div>
      </form>
    </div>
  );
};

// EditGoalModal Component
const EditGoalModal = ({ goal, onClose, onUpdateGoal }) => {
  const [name, setName] = useState(goal.name);
  const [targetAmount, setTargetAmount] = useState(goal.targetAmount);
  const [category, setCategory] = useState(goal.category);
  const [deadline, setDeadline] = useState(goal.deadline);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !targetAmount || !category || !deadline) {
      alert('Please fill in all fields.'); // Using alert for simplicity
      return;
    }

    const updatedGoal = {
      ...goal,
      name,
      targetAmount: parseFloat(targetAmount),
      category,
      deadline,
    };
    onUpdateGoal(updatedGoal);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Goal: {goal.name}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="editName" className="block text-sm font-medium text-gray-700">Goal Name</label>
            <input
              type="text"
              id="editName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="editTargetAmount" className="block text-sm font-medium text-gray-700">Target Amount</label>
            <input
              type="number"
              id="editTargetAmount"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label htmlFor="editCategory" className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              id="editCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="editDeadline" className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              id="editDeadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Update Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Overview Component
const Overview = ({ goals }) => {
  const totalGoals = goals.length;
  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const completedGoals = goals.filter(goal => goal.savedAmount >= goal.targetAmount).length;
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Goals</h3>
          <p className="text-2xl font-bold text-blue-600">{totalGoals}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Completed Goals</h3>
          <p className="text-2xl font-bold text-green-600">{completedGoals}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">Total Saved</h3>
          <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalSaved)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800">Total Target</h3>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalTarget)}</p>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Overall Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
            style={{ width: `${Math.min(100, overallProgress)}%` }}
          ></div>
        </div>
        <p className="text-sm font-medium text-gray-600 mt-1">{overallProgress.toFixed(2)}% Complete</p>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [actionPlanGoal, setActionPlanGoal] = useState(null);

  // Fetch goals from the API
  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGoals(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch goals:', err);
      setError(`Failed to fetch goals: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

 
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = async (newGoal) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGoal),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const savedGoal = await response.json();
      setGoals(prev => [...prev, savedGoal]);
    } catch (err) {
      console.error('Failed to add goal:', err);
      alert(`Failed to add goal: ${err.message}`);
    }
  };

  // Update an existing goal
  const updateGoal = async (updatedGoal) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${updatedGoal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGoal),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const savedGoal = await response.json();
      setGoals(prev => prev.map(goal => goal.id === savedGoal.id ? savedGoal : goal));
    } catch (err) {
      console.error('Failed to update goal:', err);
      alert(`Failed to update goal: ${err.message}`);
    }
  };

  // Delete a goal
  const deleteGoal = async (goalId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${goalId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    } catch (err) {
      console.error('Failed to delete goal:', err);
      alert(`Failed to delete goal: ${err.message}`);
    }
  };

  // Make a deposit to a goal
  const makeDeposit = async (goalId, amount) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) {
      alert('Goal not found');
      return;
    }

    const updatedGoal = {
      ...goal,
      savedAmount: goal.savedAmount + amount,
    };

    await updateGoal(updatedGoal);
  };

  // Handle delete confirmation
  const handleDeleteRequest = (goalId) => {
    setGoalToDelete(goalId);
    setShowConfirmModal(true);
  };

    const confirmDelete = async () => {
      if (goalToDelete) {
        await deleteGoal(goalToDelete);
        setGoalToDelete(null);
        setShowConfirmModal(false);
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">Smart Goal Planner</h1>
          <Overview goals={goals} />
          <AddGoalForm onAddGoal={addGoal} />
          <DepositForm goals={goals} onMakeDeposit={makeDeposit} />
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
              <span className="ml-4 text-lg text-blue-900">Loading goals...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <GoalList
              goals={goals}
              onDelete={handleDeleteRequest}
              onEdit={setEditingGoal}
              onDeposit={makeDeposit}
              onGetActionPlan={setActionPlanGoal}
            />
          )}
  
          {}
          {showConfirmModal && (
            <ConfirmationModal
              message="Are you sure you want to delete this goal? This action cannot be undone."
              onConfirm={confirmDelete}
              onCancel={() => setShowConfirmModal(false)}
            />
          )}
  
          {}
          {editingGoal && (
            <EditGoalModal
              goal={editingGoal}
              onClose={() => setEditingGoal(null)}
              onUpdateGoal={updateGoal}
            />
          )}
  
          {}
          {actionPlanGoal && (
            <GoalActionPlanModal
              goal={actionPlanGoal}
              onClose={() => setActionPlanGoal(null)}
            />
          )}
        </div>
      </div>
    );
  };
  
  export default App;