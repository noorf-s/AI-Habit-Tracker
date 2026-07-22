const HabitCard = ({ habit, onEdit, onDelete, onToggleComplete }) => {
  const categoryTone = {
    Study: 'study',
    Health: 'health',
    Personal: 'personal'
  }

  return (
    <article className={`habit-card ${habit.completed ? 'is-complete' : ''}`}>
      <div className="habit-main">
        <div className="habit-left">
          <div className={`habit-indicator ${categoryTone[habit.category] || 'study'}`} />
          <div>
            <p className="habit-meta">{habit.category} • {habit.difficulty}</p>
            <h4>{habit.title}</h4>
          </div>
        </div>

        <label className="checkbox-pill">
          <input
            type="checkbox"
            checked={habit.completed}
            onChange={() => onToggleComplete(habit.id)}
          />
          <span>{habit.completed ? 'Done' : 'Mark done'}</span>
        </label>
      </div>

      <div className="habit-footer">
        <div className="completion-badge">
          <span className="completion-dot" />
          {habit.completed ? 'Completed today' : 'In progress'}
        </div>

        <div className="habit-actions">
          <button type="button" className="ghost-button" onClick={() => onEdit(habit)}>
            Edit
          </button>
          <button type="button" className="ghost-button danger" onClick={() => onDelete(habit.id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}

export default HabitCard
