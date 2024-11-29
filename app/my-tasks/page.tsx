'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Calendar, CheckCircle, Clock } from 'lucide-react'

interface Task {
  id: string
  title: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed'
}

export default function MyTasks() {
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review maintenance reports',
      dueDate: '2024-03-20',
      priority: 'high',
      status: 'pending'
    },
    // Add more mock tasks
  ])

  return (
    <DashboardLayout title="My Tasks">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Task List</h2>
            </div>
            <div className="divide-y">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-gray-400" size={20} />
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock size={14} />
                          <span>Due {task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} />
            <h2 className="font-semibold">Calendar</h2>
          </div>
          {/* Calendar implementation would go here */}
        </div>
      </div>
    </DashboardLayout>
  )
} 