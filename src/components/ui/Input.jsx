const Input = ({ label, id, type = 'text', placeholder, value, onChange, autoComplete, required = false, className = '' }) => {
  return (
    <div className={`auth-field ${className}`.trim()}>
      {label && (
        <label htmlFor={id} className="auth-label">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        className="auth-input"
      />
    </div>
  )
}

export default Input
