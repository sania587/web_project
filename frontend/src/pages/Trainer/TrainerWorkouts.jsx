import React, { useEffect } from "react"
import { useWorkoutsContext } from "../../components/Trainer/Workouts/useWorkoutsContext"
import WorkoutDetails from "../../components/Trainer/Workouts/WorkoutDetails"
import WorkoutForm from "../../components/Trainer/Workouts/WorkoutForm"
import TrainerLayout from "../../components/Trainer/TrainerLayout"
import { useTheme } from "../../context/ThemeContext"
import { FaDumbbell, FaPlus } from "react-icons/fa"

const TrainerWorkouts = () => {
  const { workouts, dispatch } = useWorkoutsContext()
  const { theme } = useTheme()

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch('http://localhost:5000/api/workouts')
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_WORKOUTS', payload: json })
      }
    }

    fetchWorkouts()
  }, [dispatch])

  return (
    <TrainerLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 
              className="text-3xl font-bold mb-2 flex items-center gap-3"
              style={{ color: theme.colors.text }}
            >
              <FaDumbbell style={{ color: theme.colors.primary }} />
              Manage Workouts
            </h1>
            <p style={{ color: theme.colors.textSecondary }}>
              Create and manage workout plans for your clients
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workout List */}
          <div className="lg:col-span-2">
            <h2 
              className="text-xl font-semibold mb-4"
              style={{ color: theme.colors.text }}
            >
              Your Workouts
            </h2>
            <div className="space-y-4">
              {workouts && workouts.length > 0 ? (
                workouts.map(workout => (
                  <div 
                    key={workout._id}
                    className="rounded-2xl p-4 border"
                    style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
                  >
                    <WorkoutDetails workout={workout} />
                  </div>
                ))
              ) : (
                <div 
                  className="rounded-2xl p-8 text-center border"
                  style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
                >
                  <div 
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${theme.colors.primary}20` }}
                  >
                    <FaDumbbell className="text-2xl" style={{ color: theme.colors.primary }} />
                  </div>
                  <p style={{ color: theme.colors.textSecondary }}>
                    No workouts created yet. Add your first workout!
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Workout Form */}
          <div className="lg:col-span-1">
            <div 
              className="rounded-2xl p-6 border sticky top-6"
              style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
            >
              <h2 
                className="text-xl font-semibold mb-4 flex items-center gap-2"
                style={{ color: theme.colors.text }}
              >
                <FaPlus style={{ color: theme.colors.primary }} />
                Add New Workout
              </h2>
              <WorkoutForm />
            </div>
          </div>
        </div>
      </div>
    </TrainerLayout>
  )
}

export default TrainerWorkouts
