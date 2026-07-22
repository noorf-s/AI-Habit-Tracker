import { useEffect, useMemo, useState } from 'react'
import Modal from '../components/ui/Modal'
import StatCard from '../components/ui/StatCard'
import HabitCard from '../components/habit/HabitCard'
import NorthLogo from '../components/ui/NorthLogo'
import { supabase, getDisplayName, getFriendlyErrorMessage, getDashboardStats, createHabitRecord, updateHabitRecord, deleteHabitRecord, fetchHabitsForUser } from '../services/supabase'

const Dashboard = () => {
  const [habits, setHabits] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'Study', difficulty: 'Easy' })
  const [editingId, setEditingId] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const completedCount = useMemo(() => habits.filter((habit) => habit.completed).length, [habits])
  const stats = useMemo(() => getDashboardStats(habits), [habits])
  const displayName = useMemo(() => getDisplayName(user), [user])
  const northGuide = useMemo(() => {
    if (!habits.length) {
      return 'Your first step will create the calm structure that carries the rest of your week.'
    }

    const completed = habits.filter((habit) => habit.completed).length
    const open = habits.length - completed
    const studyHabits = habits.filter((habit) => habit.category === 'Study')
    const studyCompletion = studyHabits.length
      ? Math.round((studyHabits.filter((habit) => habit.completed).length / studyHabits.length) * 100)
      : 0
    const morningHabits = habits.filter((habit) => /morning|rise|stretch|journal/i.test(habit.title))
    const morningCompletion = morningHabits.length
      ? Math.round((morningHabits.filter((habit) => habit.completed).length / morningHabits.length) * 100)
      : 0

    if (studyCompletion >= 80 && studyHabits.length) {
      return 'You are building excellent consistency with your study routine.'
    }

    if (morningHabits.length && morningCompletion >= 70) {
      return 'Your morning habits have the highest completion rate.'
    }

    if (open === 1) {
      return 'You are one completed habit away from extending your streak.'
    }

    if (completed >= habits.length / 2) {
      return 'Small actions are becoming lasting routines.'
    }

    if (stats.completionPercentage >= 60) {
      return 'Your consistency is improving week after week.'
    }

    return 'Quiet momentum is taking shape through your steady choices.'
  }, [habits, stats.completionPercentage])

  useEffect(() => {
    const loadUserAndHabits = async () => {
      setLoading(true)
      setErrorMessage('')

      try {
        const { data: { session } } = await supabase.auth.getSession()
        const currentUser = session?.user || null
        setUser(currentUser)

        if (!currentUser) {
          setHabits([])
          return
        }

        const nextHabits = await fetchHabitsForUser(currentUser.id)
        setHabits(nextHabits)
      } catch (error) {
        setErrorMessage(getFriendlyErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    loadUserAndHabits()
  }, [])

  const resetForm = () => {
    setForm({ title: '', category: 'Study', difficulty: 'Easy' })
    setEditingId(null)
  }

  const openAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (habit) => {
    setForm({
      title: habit.title,
      category: habit.category,
      difficulty: habit.difficulty
    })
    setEditingId(habit.id)
    setIsModalOpen(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.title.trim() || !user) return

    setSaving(true)
    setErrorMessage('')

    try {
      if (editingId) {
        await updateHabitRecord({
          userId: user.id,
          id: editingId,
          values: {
            title: form.title.trim(),
            category: form.category,
            difficulty: form.difficulty
          }
        })

        const nextHabits = await fetchHabitsForUser(user.id)
        setHabits(nextHabits)
      } else {
        const createdHabit = await createHabitRecord({
          userId: user.id,
          title: form.title.trim(),
          category: form.category,
          difficulty: form.difficulty
        })

        setHabits((current) => [...current, createdHabit])
      }

      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!user) return

    setSaving(true)
    setErrorMessage('')

    try {
      await deleteHabitRecord({ userId: user.id, id })
      const nextHabits = await fetchHabitsForUser(user.id)
      setHabits(nextHabits)
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const handleToggleComplete = async (id) => {
    if (!user) return

    const currentHabit = habits.find((habit) => habit.id === id)
    if (!currentHabit) return

    setSaving(true)
    setErrorMessage('')

    try {
      const updatedHabit = await updateHabitRecord({
        userId: user.id,
        id,
        values: {
          completed: !currentHabit.completed
        }
      })

      setHabits((current) => current.map((habit) => (habit.id === id ? updatedHabit : habit)))
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const renderHabitList = () => {
    if (loading) {
      return (
        <div className="habit-list">
          {[1, 2].map((item) => (
            <div className="habit-card skeleton-card" key={item}>
              <div className="skeleton-line wide" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          ))}
        </div>
      )
    }

    if (!habits.length) {
      return <div className="empty-state">No habits yet. Add your first one to begin.</div>
    }

    return (
      <div className="habit-list">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div>
          <div className="sidebar-brand">
            <NorthLogo showText={true} />
          </div>
          <nav className="sidebar-nav">
            <a className="active" href="#">Dashboard</a>
            <a href="#">Habits</a>
            <a href="#">Insights</a>
            <a href="#">Profile</a>
          </nav>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Good morning</p>
            <h1>Welcome back, {displayName}</h1>
          </div>
          <div className="topbar-meta">
            <span>{new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            <div className="avatar">{displayName.slice(0, 2).toUpperCase()}</div>
          </div>
        </header>

        <section className="dashboard-hero">
          <div className="focus-card">
            <p className="eyebrow">Today’s focus</p>
            <h2>Quiet progress, one thoughtful step at a time.</h2>
            <p>North is designed to hold your attention gently, so your habits feel easier to return to.</p>
            <div className="focus-metrics">
              <span className="metric-pill">{stats.completedCount} habits kept</span>
              <span className="metric-pill">{stats.totalHabits - stats.completedCount} still open</span>
            </div>
          </div>

          <div className="hero-side-stack">
            <div className="mini-panel">
              <StatCard title="Today’s Progress" value={`${stats.completedCount}/${stats.totalHabits} habits`} description="A solid start to the day." />
            </div>
            <div className="mini-panel">
              <StatCard title="Current Streak" value={`${stats.currentStreak} days`} description="You’re building something steady and lasting." />
            </div>
          </div>
        </section>

        <section className="dashboard-body">
          <section className="habits-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Habit management</p>
                <h2>Today’s habits</h2>
              </div>
              <button type="button" className="button primary" onClick={openAddModal}>
                Add Habit
              </button>
            </div>

            {errorMessage && <p className="error-text dashboard-error">{errorMessage}</p>}
            {renderHabitList()}
          </section>

          <aside className="dashboard-aside">
            <div className="aside-card">
              <p className="eyebrow">Reflection</p>
              <p className="aside-copy">Consistency grows through small acts repeated with care.</p>
              <div className="progress-block">
                <div className="progress-bar">
                  <span style={{ width: `${stats.completionPercentage}%` }} />
                </div>
                <p className="progress-label">{stats.completionPercentage}% of your list feels complete today.</p>
              </div>
            </div>

            <div className="aside-card">
              <p className="eyebrow">This week</p>
              <StatCard title="Completion" value={`${stats.completionPercentage}%`} description="Keep going to close the gap." />
            </div>

            <div className="aside-card north-guide-card">
              <p className="eyebrow">North Guide</p>
              <h3>Quiet insight for today</h3>
              <p>{northGuide}</p>
            </div>
          </aside>
        </section>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Habit' : 'Add Habit'}>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="field-label">
            Habit Title
            <input
              className="auth-input"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="e.g. Morning Journal"
            />
          </label>

          <label className="field-label">
            Category
            <select
              className="auth-input"
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
            >
              <option value="Study">Study</option>
              <option value="Health">Health</option>
              <option value="Personal">Personal</option>
            </select>
          </label>

          <label className="field-label">
            Difficulty
            <select
              className="auth-input"
              value={form.difficulty}
              onChange={(event) => setForm((current) => ({ ...current, difficulty: event.target.value }))}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Challenging">Challenging</option>
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" className="button secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="button primary">
              {editingId ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Dashboard
