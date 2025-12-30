import React from 'react'
import { useWorkoutsContext } from './useWorkoutsContext'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext()

  const handleClick = async () => {
    const response = await fetch('/api/workouts/' + workout._id, {
      method: 'DELETE'
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({ type: 'DELETE_WORKOUT', payload: json })
    }
  }

  return (
    <div className="workout-details bg-white rounded-lg shadow-md p-4 mb-4">
      <h4 className="text-lg font-semibold text-indigo-600">{workout.title}</h4>
      <p><strong>Description: </strong>{workout.load}</p>
      <p><strong>Number of reps: </strong>{workout.reps}</p>
      <p className="text-gray-500 text-sm">
        {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
      </p>
      <button 
        onClick={handleClick}
        className="mt-2 text-red-500 hover:text-red-700 transition"
      >
        Delete
      </button>
    </div>
  )
}

export default WorkoutDetails
