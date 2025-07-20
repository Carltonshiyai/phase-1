import React from 'react';

function GoalCard({ goal, deleteGoal, setSelectedGoal }) {
  const progress = (goal.savedAmount / goal.targetAmount) * 100;
  const today = new Date();
  const deadline = new Date(goal.targetDate);
  const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  let status = '';
  if (goal.savedAmount >= goal.targetAmount) {
    status = 'Completed!';
  } else if (daysLeft < 0) {
    status = 'Overdue!';
  } else if (daysLeft <= 30) {
    status = `${daysLeft} days left!`;
  }

  return (
    <div className={`goal-card ${status.includes('Completed') ? 'completed' : ''}`}>
      <div className="goal-header">
        <h3>{goal.title}</h3>
      </div>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <span className="progress-text">{Math.round(progress)}%</span>
      </div>

      <div className="goal-details">
        <p>Saved: ${goal.savedAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}</p>
        <p>Deadline: {new Date(goal.targetDate).toLocaleDateString()} ({daysLeft} days)</p>
        {status && <p className="status">{status}</p>}
      </div>

      <div className="card-actions">
        <button onClick={() => setSelectedGoal(goal)}>Edit</button>
        <button onClick={() => deleteGoal(goal.id)}>Delete</button>
      </div>
    </div>
  );
}

export default GoalCard;