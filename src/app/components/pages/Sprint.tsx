import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { sprints as initialSprints, tasks, currentUser } from '../../mockData';
import { Sprint, Task } from '../../types';
import { Calendar, TrendingUp, Plus } from 'lucide-react';

const ITEM_TYPE = 'BACKLOG_TASK';

export default function SprintPage() {
  const [sprints, setSprints] = useState(initialSprints);
  const [selectedSprint, setSelectedSprint] = useState(sprints[0]);

  const sprintTasks = tasks.filter((t) => selectedSprint.tasks.includes(t.id));
  const backlogTasks = tasks.filter((t) => !t.sprintId || t.sprintId === '');

  const addTaskToSprint = (taskId: string) => {
    if (currentUser.role === 'PM') {
      setSprints((prev) =>
        prev.map((sprint) =>
          sprint.id === selectedSprint.id
            ? {
                ...sprint,
                tasks: [...sprint.tasks, taskId],
                totalSP: sprint.totalSP + (tasks.find(t => t.id === taskId)?.storyPoints || 0),
              }
            : sprint
        )
      );
      setSelectedSprint((prev) => ({
        ...prev,
        tasks: [...prev.tasks, taskId],
        totalSP: prev.totalSP + (tasks.find(t => t.id === taskId)?.storyPoints || 0),
      }));
    }
  };

  const calculateVelocity = () => {
    if (currentUser.role === 'PM') {
      const completedSP = sprintTasks
        .filter((t) => t.status === 'Done')
        .reduce((sum, t) => sum + t.storyPoints, 0);
      alert(`Sprint.calculateVelocity()\nVelocity: ${completedSP} SP completed out of ${selectedSprint.totalSP} SP total`);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-8 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl text-slate-900">Планирование спринта</h1>
          </div>
          {currentUser.role === 'PM' && (
            <button
              onClick={calculateVelocity}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <TrendingUp className="size-4" />
              Расчитать продуктивность
            </button>
          )}
        </div>

        {/* Sprint Selector */}
        <div className="flex gap-4 mb-6">
          {sprints.map((sprint) => (
            <button
              key={sprint.id}
              onClick={() => setSelectedSprint(sprint)}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                selectedSprint.id === sprint.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <p className="text-xs text-slate-500 mb-1">Идентификатор спринта</p>
              <p className="text-lg text-slate-900 mb-2">{sprint.id}</p>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Calendar className="size-3" />
                <span>{sprint.startDate} - {sprint.endDate}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Всего SP: {sprint.totalSP}</p>
            </button>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">
          {/* Backlog */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <h2 className="text-lg text-slate-900 mb-4">Бэклог</h2>
            <div className="flex-1 overflow-y-auto space-y-3">
              {backlogTasks.map((task) => (
                <DraggableBacklogTask key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* Sprint Tasks */}
          <SprintDropZone
            sprint={selectedSprint}
            tasks={sprintTasks}
            onDrop={addTaskToSprint}
          />
        </div>
      </div>
    </DndProvider>
  );
}

function DraggableBacklogTask({ task }: { task: Task }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: currentUser.role === 'PM',
  }));

  return (
    <div
      ref={drag}
      className={`bg-slate-50 p-4 rounded-lg border border-slate-200 ${
        currentUser.role === 'PM' ? 'cursor-move hover:shadow-md' : 'cursor-not-allowed opacity-50'
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      <p className="text-xs text-slate-500 mb-1">Task.id: {task.id}</p>
      <p className="text-sm text-slate-900 mb-2">{task.title}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-600">SP: {task.storyPoints}</span>
        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{task.priority}</span>
      </div>
    </div>
  );
}

function SprintDropZone({
  sprint,
  tasks,
  onDrop,
}: {
  sprint: Sprint;
  tasks: Task[];
  onDrop: (taskId: string) => void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { id: string }) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const completedSP = tasks.filter((t) => t.status === 'Done').reduce((sum, t) => sum + t.storyPoints, 0);

  return (
    <div
      ref={drop}
      className={`bg-white rounded-xl shadow-sm border-2 p-6 flex flex-col ${
        isOver ? 'border-purple-500 bg-purple-50' : 'border-slate-200'
      }`}
    >
      <div className="mb-4">
        <h2 className="text-lg text-slate-900 mb-2">Задачи спринта </h2>
        <div className="flex gap-4 text-sm">
          <span className="text-slate-600">
            Задачи: <span className="text-slate-900">{tasks.length}</span>
          </span>
          <span className="text-slate-600">
            Всего SP: <span className="text-slate-900">{sprint.totalSP}</span>
          </span>
          <span className="text-slate-600">
            Выполнено: <span className="text-green-600">{completedSP} SP</span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-600 mb-1">Идентификтор задачи: {task.id}</p>
            <p className="text-sm text-slate-900 mb-2">{task.title}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">SP: {task.storyPoints}</span>
              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded">{task.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
