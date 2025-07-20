import React from 'react';

function GoalList({ goals, deleteGoal, setSelectedGoal, formatCurrency }) {
  return (
    <div className="goal-list-container">
      <h2>Your Current Savings Goals</h2>
      {goals.length === 0 ? (
        <p>You haven't added any goals yet! Go to the "Add Goal" tab to create one.</p>
      ) : (
        <div className="goal-list">
          {goals.map(goal => {
            const progress = (goal.savedAmount / goal.targetAmount) * 100;
            const remainingAmount = goal.targetAmount - goal.savedAmount;

            return (
              <div key={goal.id} className="goal-card">
                <div>
                  <h3>{goal.name}</h3>
                  <p><strong>Category:</strong> {goal.category}</p>
                  <p><strong>Target:</strong> {formatCurrency(goal.targetAmount)}</p>
                  <p><strong>Saved:</strong> {formatCurrency(goal.savedAmount)}</p>
                  <p><strong>Remaining:</strong> {formatCurrency(remainingAmount)}</p>
                  <p><strong>Deadline:</strong> {goal.deadline}</p>

                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                  </div>
                  <p className="progress-text">{progress.toFixed(2)}% Achieved</p>
                </div>
                
                <div className="goal-actions">
                  <button className="edit" onClick={() => setSelectedGoal(goal)}>Edit</button>
                  <button className="delete" onClick={() => deleteGoal(goal.id)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GoalList;