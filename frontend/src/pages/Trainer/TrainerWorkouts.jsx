import React, { useEffect } from "react"
import { useWorkoutsContext } from "../../components/Trainer/Workouts/useWorkoutsContext"
import WorkoutDetails from "../../components/Trainer/Workouts/WorkoutDetails"
import WorkoutForm from "../../components/Trainer/Workouts/WorkoutForm"

const TrainerWorkouts = () => {
  const { workouts, dispatch } = useWorkoutsContext()

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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-indigo-600 mb-8">Manage Workouts</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workout List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Your Workouts</h2>
            <div className="space-y-4">
              {workouts && workouts.length > 0 ? (
                workouts.map(workout => (
                  <WorkoutDetails workout={workout} key={workout._id} />
                ))
              ) : (
                <p className="text-gray-500">No workouts created yet. Add your first workout!</p>
              )}
            </div>
          </div>
          
          {/* Workout Form */}
          <div className="lg:col-span-1">
            <WorkoutForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainerWorkouts
