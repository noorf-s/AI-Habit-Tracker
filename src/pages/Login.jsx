import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { getFriendlyErrorMessage, signInWithPassword } from '../services/supabase'

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const nextErrors = {}

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.'
    } else if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    setStatusMessage('')

    try {
      const { error } = await signInWithPassword({ email: form.email.trim(), password: form.password })

      if (error) {
        setErrors((current) => ({ ...current, submit: getFriendlyErrorMessage(error) }))
        return
      }

      navigate('/dashboard')
    } catch (error) {
      setErrors((current) => ({ ...current, submit: getFriendlyErrorMessage(error) }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page-shell">
      <div className="auth-card">
        <div className="auth-card-header">
          <p className="eyebrow">Welcome back</p>
          <h1>Log in to North</h1>
          <p className="auth-copy">Return to the rhythm you are building with quiet intention.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Email"
            id="login-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <div className="password-field">
            <Input
              label="Password"
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}

          <div className="auth-row">
            <label className="checkbox-row">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a className="text-link" href="#forgot-password">
              Forgot Password?
            </a>
          </div>

          {errors.submit && <p className="error-text">{errors.submit}</p>}
          {statusMessage && <p className="error-text">{statusMessage}</p>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Login'}
          </Button>
        </form>

        <p className="auth-switch">
          Don’t have an account?{' '}
          <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
