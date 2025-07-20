// src/components/SmartGoalForm.jsx
import React, { useState } from "react";

function SmartGoalForm({ onAddGoal }) {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    category: "",
    deadline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newGoal = {
      ...formData,
      id: crypto.randomUUID(),
      targetAmount: Number(formData.targetAmount),
      savedAmount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Send new goal to parent
    onAddGoal(newGoal);

    // Clear form
    setFormData({
      name: "",
      targetAmount: "",
      category: "",
      deadline: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="smart-goal-form">
      <h2>Create a SMART Goal</h2>

      <label>
        Goal Name (Specific):
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Target Amount (Measurable & Achievable):
        <input
          type="number"
          name="targetAmount"
          value={formData.targetAmount}
          onChange={handleChange}
          required
          min="1"
        />
      </label>

      <label>
        Category (Relevant):
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">-- Select --</option>
          <option>Travel</option>
          <option>Emergency</option>
          <option>Education</option>
          <option>Electronics</option>
          <option>Home</option>
          <option>Retirement</option>
          <option>Real Estate</option>
          <option>Shopping</option>
          <option>Vehicle</option>
          <option>Other</option>
        </select>
      </label>

      <label>
        Deadline (Time-bound):
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit">Add Goal</button>
    </form>
  );
}

export default SmartGoalForm;
