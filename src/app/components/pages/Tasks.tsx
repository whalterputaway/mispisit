import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Task, TaskStatus, Priority } from '../../types';
import { tasks as initialTasks, users, currentUser, comments } from '../../mockData';
import { Plus, MessageSquare, CheckCircle, User as UserIcon, Calendar } from 'lucide-react';

const ITEM_TYPE = 'TASK';

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const columns: TaskStatus[] = ['Todo', 'InProgress', 'Review', 'Done'];

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              completeDate: newStatus === 'Done' ? new Date().toISOString() : task.completeDate
            }
          : task
      )
    );
  };

  const handleCompleteTask = (taskId: string) => {
    if (currentUser.role === 'Developer') {
      moveTask(taskId, 'Done');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-8 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl text-slate-900">Задачи - Kanban Board</h1>
          </div>
          {currentUser.role === 'Developer' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="size-4" />
              Create Task
            </button>
          )}
        </div>

        <div className="flex-1 grid grid-cols-4 gap-4 overflow-hidden">
          {columns.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasks.filter((t) => t.status === status)}
              moveTask={moveTask}
              onSelectTask={setSelectedTask}
              onCompleteTask={handleCompleteTask}
            />
          ))}
        </div>

        {/* Task Detail Modal */}
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        )}

        {/* Create Task Modal */}
        {showCreateModal && (
          <CreateTaskModal onClose={() => setShowCreateModal(false)} />
        )}
      </div>
    </DndProvider>
  );
}

function TaskColumn({
  status,
  tasks,
  moveTask,
  onSelectTask,
  onCompleteTask,
}: {
  status: TaskStatus;
  tasks: Task[];
  moveTask: (taskId: string, status: TaskStatus) => void;
  onSelectTask: (task: Task) => void;
  onCompleteTask: (taskId: string) => void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { id: string }) => moveTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`bg-slate-100 rounded-lg p-4 flex flex-col ${isOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''}`}
    >
      <div className="mb-4">
        <h3 className="text-slate-900">{status}</h3>
        <p className="text-xs text-slate-500">{tasks.length} задачи</p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onSelectTask(task)}
            onComplete={onCompleteTask}
          />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, onClick, onComplete }: { task: Task; onClick: () => void; onComplete: (id: string) => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const assignedUser = users.find((u) => u.id === task.assignedUserId);
  const priorityColors = {
    Низкий: 'bg-slate-100 text-slate-700',
    Средний: 'bg-blue-100 text-blue-700',
    Высокий: 'bg-orange-100 text-orange-700',
    Критический: 'bg-red-100 text-red-700',
  };

  return (
    <div
      ref={drag}
      onClick={onClick}
      className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs text-slate-500">Идентификатор задачи: {task.id}</p>
        <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <p className="text-sm text-slate-900 mb-2">{task.title}</p>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-slate-600">SP: {task.storyPoints}</span>
        {assignedUser && (
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <UserIcon className="size-3" />
            {assignedUser.name}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <MessageSquare className="size-3" />
          {task.comments.length}
        </span>
        {currentUser.role === 'Developer' && task.status !== 'Done' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComplete(task.id);
            }}
            className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Выполнено
          </button>
        )}
      </div>
    </div>
  );
}

function TaskDetailModal({ task, onClose }: { task: Task; onClose: () => void }) {
  const assignedUser = users.find((u) => u.id === task.assignedUserId);
  const [newComment, setNewComment] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[600px] max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Идентификатор задачи: {task.id}</p>
          <h2 className="text-2xl text-slate-900">{task.title}</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Описание:</p>
            <p className="text-slate-700">{task.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Статус:</p>
              <p className="text-slate-900">{task.status}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Приоритет:</p>
              <p className="text-slate-900">{task.priority}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Story Points:</p>
              <p className="text-slate-900">{task.storyPoints}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Исполнитель:</p>
              <p className="text-slate-900">{assignedUser?.name || 'Unassigned'}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-1">Время создания:</p>
            <p className="text-sm text-slate-700">{new Date(task.createDate).toLocaleString()}</p>
          </div>

          {task.completeDate && (
            <div>
              <p className="text-xs text-slate-500 mb-1">Время сдачи:</p>
              <p className="text-sm text-slate-700">{new Date(task.completeDate).toLocaleString()}</p>
            </div>
          )}

          {/* Comments Section */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-sm text-slate-900 mb-3">Комментарий:</h3>
            <div className="space-y-3 mb-4">
              {task.comments.map((comment) => {
                const commentUser = users.find((u) => u.id === comment.userId);
                return (
                  <div key={comment.id} className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-slate-600">{commentUser?.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded ${comment.resolved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {comment.resolved ? 'Resolved' : 'Open'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-900">{comment.text}</p>
                    <p className="text-xs text-slate-500 mt-1">Идентификатор комментария: {comment.id}</p>
                  </div>
                );
              })}
            </div>

            {currentUser.role === 'Developer' && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add comment..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  Add Comment
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateTaskModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[500px]" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl text-slate-900">Создать задание</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Название:</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Описание:</label>
            <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Приоритет:</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                <option>Низкий</option>
                <option>Средний</option>
                <option>Высокий</option>
                <option>Критический</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Story Points:</label>
              <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Создать
          </button>
        </div>
      </div>
    </div>
  );
}
