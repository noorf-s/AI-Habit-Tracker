const Button = ({ children, variant = 'primary', type = 'button', className = '', ...props }) => {
  const buttonClass = `auth-button ${variant === 'secondary' ? 'secondary' : 'primary'} ${className}`.trim()

  return (
    <button type={type} className={buttonClass} {...props}>
      {children}
    </button>
  )
}

export default Button
