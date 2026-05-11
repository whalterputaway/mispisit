import { useState } from 'react';
import { bugs as initialBugs, users, currentUser, pullRequests, tasks } from '../../mockData';
import { Bug } from '../../types';
import { Bug as BugIcon, Plus, Link as LinkIcon, FileText, Terminal } from 'lucide-react';

export default function Bugs() {
  const [bugs, setBugs] = useState(initialBugs);
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl text-slate-900 flex items-center gap-3">
            <BugIcon className="size-8" />
            Баги
          </h1>
          <p className="text-sm text-slate-600 mt-1">
          </p>
        </div>
        {currentUser.role === 'DevOps' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Plus className="size-4" />
            Отметить баг
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Bug List */}
        <div className="space-y-4">
          {bugs.map((bug) => {
            const assignedUser = users.find((u) => u.id === bug.assignedUserId);
            const priorityColors = {
              Low: 'bg-slate-100 text-slate-700',
              Medium: 'bg-blue-100 text-blue-700',
              High: 'bg-orange-100 text-orange-700',
              Critical: 'bg-red-100 text-red-700',
            };

            return (
              <div
                key={bug.id}
                onClick={() => setSelectedBug(bug)}
                className={`bg-white p-5 rounded-xl shadow-sm border-2 cursor-pointer hover:shadow-md transition-all ${
                  selectedBug?.id === bug.id ? 'border-red-500' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Идентификатор бага:</p>
                    <p className="text-lg text-slate-900 flex items-center gap-2">
                      <BugIcon className="size-5 text-red-600" />
                      {bug.id}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${priorityColors[bug.priority]}`}>
                    {bug.priority}
                  </span>
                </div>

                <p className="text-sm text-slate-900 mb-3">{bug.title}</p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <LinkIcon className="size-3" />
                    <span>Pull Request: {bug.relatedPR || 'None'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <LinkIcon className="size-3" />
                    <span>Задача: {bug.relatedTaskId || 'None'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Статус задачи: {bug.status}</span>
                    {assignedUser && (
                      <span className="text-slate-600">Исполнитель: {assignedUser.name}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bug Detail */}
        {selectedBug && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
            <div className="flex items-center gap-3 mb-4">
              <BugIcon className="size-6 text-red-600" />
              <h2 className="text-xl text-slate-900">Информация</h2>
            </div>

            {/* Inherited Task Fields */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-600 mb-3">Информация</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Идентификатор задачи:</p>
                  <p className="text-slate-900">{selectedBug.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Название:</p>
                  <p className="text-slate-900">{selectedBug.title}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Описание:</p>
                  <p className="text-slate-900">{selectedBug.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Статус:</p>
                    <p className="text-slate-900">{selectedBug.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Приоритет:</p>
                    <p className="text-slate-900">{selectedBug.priority}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">SP:</p>
                  <p className="text-slate-900">{selectedBug.storyPoints}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Дата создания:</p>
                  <p className="text-slate-900 text-xs">{new Date(selectedBug.createDate).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Bug-Specific Fields */}
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <LinkIcon className="size-4 text-red-600" />
                  <p className="text-sm text-red-900">Подробности</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Pull Request</p>
                    <p className="text-slate-900">{selectedBug.relatedPR || 'None'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Задача</p>
                    <p className="text-slate-900">{selectedBug.relatedTaskId || 'None'}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="size-4 text-slate-600" />
                  <p className="text-sm text-slate-900">Сценарий получения</p>
                </div>
                <pre className="text-xs bg-slate-100 p-3 rounded-lg border border-slate-200 whitespace-pre-wrap text-slate-900">
                  {selectedBug.reproduceSteps}
                </pre>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="size-4 text-slate-600" />
                  <p className="text-sm text-slate-900">Логи</p>
                </div>
                <pre className="text-xs bg-slate-900 text-green-400 p-3 rounded-lg whitespace-pre-wrap font-mono">
                  {selectedBug.logs}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Bug Modal */}
      {showCreateModal && (
        <CreateBugModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function CreateBugModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[600px] max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl text-slate-900 flex items-center gap-2">
            <BugIcon className="size-5 text-red-600" />
            Новый баг
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Inherited Task Fields */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-600 mb-3">Информация</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Название:</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Описание:</label>
                <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Приоритет:</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">SP:</label>
                  <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Bug-Specific Fields */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-600 mb-3">Подробности</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Pull Request</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                  <option value="">None</option>
                  {pullRequests.map((pr) => (
                    <option key={pr.prId} value={pr.prId}>{pr.prId} - {pr.branch}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Задача</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                  <option value="">None</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>{t.id} - {t.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Сценарий получения</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  rows={4}
                  placeholder="1. Step one&#10;2. Step two&#10;3. Observe error"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Логи</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono bg-slate-900 text-green-400"
                  rows={4}
                  placeholder="Error stack trace and logs..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
            Отмена
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Отметить баг
          </button>
        </div>
      </div>
    </div>
  );
}
