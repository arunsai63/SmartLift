import React, { useState, useEffect } from 'react'

const Elevator = () => {
    // Configuration state
    const [numFloors, setNumFloors] = useState(5)
    const [numElevators, setNumElevators] = useState(3)

    // Elevator state
    const [elevators, setElevators] = useState([])

    // Call queue
    const [calls, setCalls] = useState([])

    // Initialize/reset elevators when configuration changes
    useEffect(() => {
        setElevators(
            Array(numElevators).fill().map((_, index) => ({
                id: index,
                currentFloor: 1,
                targetFloor: null,
                direction: 'idle',
                isMoving: false
            }))
        )
        setCalls([])
    }, [numFloors, numElevators])

    // Get elevator color based on index
    const getElevatorColor = (index) => {
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500',
            'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500',
            'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-fuchsia-500']
        return colors[index % colors.length]
    }

    // Call an elevator (add to queue)
    const callElevator = (floor, direction) => {
        if (!calls.some(c => c.floor === floor && c.direction === direction)) {
            setCalls(prev => [...prev, { id: Date.now(), floor, direction }])
        }
    }

    // Move an elevator to a specific floor
    const moveElevator = (elevatorId, targetFloor) => {
        const elevator = elevators.find(e => e.id === elevatorId)
        if (!elevator || elevator.isMoving || elevator.currentFloor === targetFloor) return

        setElevators(prev =>
            prev.map(e =>
                e.id === elevatorId
                    ? {
                        ...e,
                        targetFloor,
                        direction: targetFloor > e.currentFloor ? 'up' : 'down',
                        isMoving: true
                    }
                    : e
            )
        )

        // Calculate movement time based on floors to travel
        const travelTime = Math.abs(targetFloor - elevator.currentFloor) * 1000

        // Update position after animation
        setTimeout(() => {
            setElevators(prev =>
                prev.map(e =>
                    e.id === elevatorId
                        ? {
                            ...e,
                            currentFloor: targetFloor,
                            targetFloor: null,
                            direction: 'idle',
                            isMoving: false
                        }
                        : e
                )
            )
        }, travelTime)
    }

    // Assign a call to an elevator
    const assignCall = (callId, elevatorId) => {
        const call = calls.find(c => c.id === callId)
        if (!call) return

        moveElevator(elevatorId, call.floor)
        setCalls(prev => prev.filter(c => c.id !== callId))
    }

    // Generate floor numbers (top to bottom)
    const floors = Array.from({ length: numFloors }, (_, i) => numFloors - i)

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Elevator Simulator</h1>

                {/* Configuration controls */}
                <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Floors (2-24):</label>
                        <input
                            type="number"
                            min="2"
                            max="24"
                            value={numFloors}
                            onChange={e => setNumFloors(Math.min(24, Math.max(2, parseInt(e.target.value) || 2)))}
                            className="border rounded p-2 w-24"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Elevators (2-12):</label>
                        <input
                            type="number"
                            min="2"
                            max="12"
                            value={numElevators}
                            onChange={e => setNumElevators(Math.min(12, Math.max(2, parseInt(e.target.value) || 2)))}
                            className="border rounded p-2 w-24"
                        />
                    </div>
                </div>

                {/* Building visualization */}
                <div className="bg-white border-4 border-gray-800 rounded-lg shadow mb-6 overflow-hidden">
                    <div className="flex">
                        {/* Left column - floor numbers */}
                        <div className="w-16 shrink-0 border-r border-gray-300">
                            <div className="h-12 flex items-center justify-center font-bold bg-gray-100 border-b border-gray-300">
                                Floor
                            </div>
                            {floors.map(floor => (
                                <div key={`floor-${floor}`} className="h-16 flex items-center justify-center font-medium border-b last:border-b-0 border-gray-300">
                                    {floor}
                                </div>
                            ))}
                        </div>

                        {/* Middle column - call buttons */}
                        <div className="w-16 shrink-0 border-r border-gray-300">
                            <div className="h-12 flex items-center justify-center font-bold bg-gray-100 border-b border-gray-300">
                                Call
                            </div>
                            {floors.map(floor => (
                                <div key={`buttons-${floor}`} className="h-16 flex flex-col items-center justify-center space-y-1 border-b last:border-b-0 border-gray-300">
                                    {floor < numFloors && (
                                        <button
                                            onClick={() => callElevator(floor, 'up')}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center
                        ${calls.some(c => c.floor === floor && c.direction === 'up')
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                }`}
                                        >
                                            ↑
                                        </button>
                                    )}

                                    {floor > 1 && (
                                        <button
                                            onClick={() => callElevator(floor, 'down')}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center
                        ${calls.some(c => c.floor === floor && c.direction === 'down')
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                }`}
                                        >
                                            ↓
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Elevator shafts */}
                        <div className="flex-1 flex">
                            {Array(numElevators).fill().map((_, elevIndex) => (
                                <div
                                    key={`shaft-${elevIndex}`}
                                    className="flex-1 border-r last:border-r-0 border-gray-300 relative"
                                >
                                    <div className="h-12 flex items-center justify-center font-bold bg-gray-100 border-b border-gray-300">
                                        Elevator {elevIndex + 1}
                                    </div>

                                    {/* Elevator shaft */}
                                    <div className="relative">
                                        {floors.map(floor => (
                                            <div
                                                key={`cell-${elevIndex}-${floor}`}
                                                className="h-16 border-b last:border-b-0 border-gray-300"
                                            />
                                        ))}

                                        {/* Elevator car */}
                                        {elevators[elevIndex] && (
                                            <div
                                                className={`absolute left-0 right-0 mx-2 h-14 rounded-md transition-all duration-1000 flex items-center justify-center text-white font-bold shadow-md ${getElevatorColor(elevIndex)}`}
                                                style={{
                                                    top: `${(numFloors - elevators[elevIndex].currentFloor) * 64 + 16}px`,
                                                    opacity: elevators[elevIndex].isMoving ? 0.7 : 1,
                                                    transform: elevators[elevIndex].isMoving ? 'scale(0.95)' : 'scale(1)'
                                                }}
                                            >
                                                {elevators[elevIndex].isMoving ? (
                                                    <>
                                                        {elevators[elevIndex].direction === 'up' ? '↑' : '↓'}
                                                    </>
                                                ) : (
                                                    <span>{elevators[elevIndex].currentFloor}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Control Panel */}
                <div className="bg-white border rounded-lg shadow p-4 mb-6">
                    <h2 className="text-xl font-bold mb-3">Control Panel</h2>

                    <div className="mb-4">
                        <h3 className="font-medium mb-2">Pending Calls ({calls.length})</h3>
                        {calls.length === 0 ? (
                            <p className="text-gray-500 italic">No pending calls</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {calls.map(call => (
                                    <div key={call.id} className="border rounded p-2 bg-gray-50">
                                        <div className="font-medium">Floor {call.floor} ({call.direction === 'up' ? '↑' : '↓'})</div>
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {elevators.map(elev => (
                                                <button
                                                    key={`assign-${call.id}-${elev.id}`}
                                                    onClick={() => assignCall(call.id, elev.id)}
                                                    disabled={elev.isMoving}
                                                    className={`px-2 py-1 text-xs rounded-full ${getElevatorColor(elev.id)} text-white
                            ${elev.isMoving ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                                                >
                                                    E{elev.id + 1} ({elev.currentFloor})
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Elevator Controls</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {elevators.map(elevator => (
                                <div key={`control-${elevator.id}`} className="border rounded p-3 bg-gray-50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-4 h-4 rounded-full ${getElevatorColor(elevator.id)}`}></div>
                                        <div className="font-medium">Elevator {elevator.id + 1}</div>
                                        <div className="text-sm text-gray-500 ml-auto">
                                            {elevator.isMoving
                                                ? `Moving to floor ${elevator.targetFloor}`
                                                : `At floor ${elevator.currentFloor}`}
                                        </div>
                                    </div>

                                    {!elevator.isMoving && (
                                        <div className="grid grid-cols-4 gap-1">
                                            {Array.from({ length: numFloors }, (_, i) => i + 1).map(floor => (
                                                <button
                                                    key={`move-${elevator.id}-${floor}`}
                                                    onClick={() => moveElevator(elevator.id, floor)}
                                                    disabled={floor === elevator.currentFloor}
                                                    className={`px-2 py-1 text-xs rounded
                            ${floor === elevator.currentFloor
                                                            ? 'bg-gray-300 cursor-not-allowed'
                                                            : 'bg-gray-200 hover:bg-gray-300'}`}
                                                >
                                                    {floor}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-white border rounded-lg shadow p-4">
                    <h2 className="text-xl font-bold mb-2">How to use</h2>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Adjust the number of floors and elevators using the controls at the top</li>
                        <li>Click the up/down buttons next to a floor to request an elevator</li>
                        <li>Assign a call to a specific elevator using the buttons in the Control Panel</li>
                        <li>You can also directly send an elevator to a specific floor using the floor buttons</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}

export default Elevator