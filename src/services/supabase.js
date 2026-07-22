import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

const friendlyFallback = 'We could not reach your habits right now. Please try again in a moment.'

export const getFriendlyErrorMessage = (error) => {
  const message = error?.message || ''

  if (!message) return friendlyFallback
  if (message.includes('JWT') || message.includes('token')) return 'Your session has expired. Please sign in again.'
  if (message.includes('relation') || message.includes('does not exist')) return 'Your habits table is not ready yet. Please connect the Supabase table and try again.'
  if (message.includes('failed') || message.includes('fetch')) return friendlyFallback

  return message
}

export const getDisplayName = (user) => {
  const metadataName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.user_metadata?.display_name

  if (metadataName) return metadataName

  const email = user?.email || ''
  if (!email) return 'there'

  const localPart = email.split('@')[0] || email
  const friendly = localPart
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

  return friendly || 'there'
}

export const normalizeHabit = (habit) => ({
  id: habit.id,
  title: habit.title || '',
  category: habit.category || 'Personal',
  difficulty: habit.difficulty || 'Easy',
  completed: Boolean(habit.completed),
  created_at: habit.created_at || null,
  updated_at: habit.updated_at || null,
  streak: habit.current_streak ?? habit.streak ?? 0
})

export const getDashboardStats = (habits) => {
  const totalHabits = habits.length
  const completedCount = habits.filter((habit) => habit.completed).length
  const completionPercentage = totalHabits ? Math.round((completedCount / totalHabits) * 100) : 0
  const currentStreak = habits.reduce((highest, habit) => Math.max(highest, Number(habit.streak) || 0), 0)
  const weeklyCompletion = completionPercentage

  return {
    completedCount,
    totalHabits,
    completionPercentage,
    currentStreak,
    longestStreak: currentStreak,
    weeklyCompletion
  }
}

export const signInWithPassword = async ({ email, password }) => {
  return supabase.auth.signInWithPassword({ email, password })
}

export const signUpWithPassword = async ({ email, password, fullName }) => {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  })
}

export const signOutSession = async () => {
  return supabase.auth.signOut()
}

export const resetPassword = async (email) => {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin
  })
}

export const fetchHabitsForUser = async (userId) => {
  if (!userId) return []

  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data || []).map(normalizeHabit)
}

export const createHabitRecord = async ({ userId, title, category, difficulty }) => {
  const { data, error } = await supabase
    .from('habits')
    .insert({
      user_id: userId,
      title,
      category,
      difficulty,
      completed: false
    })
    .select('*')
    .single()

  if (error) throw error
  return normalizeHabit(data)
}

export const updateHabitRecord = async ({ userId, id, values }) => {
  const { data, error } = await supabase
    .from('habits')
    .update(values)
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) throw error
  return normalizeHabit(data)
}

export const deleteHabitRecord = async ({ userId, id }) => {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
}
