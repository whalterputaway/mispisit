import { useState } from 'react';
import { pullRequests as initialPRs, users, currentUser, tasks } from '../../mockData';
import { PullRequest, CIStatus } from '../../types';
import { GitPullRequest, Play, Check, X, Clock, MessageSquare, Code } from 'lucide-react';

export default function PullRequests() {
  const [prs, setPRs] = useState(initialPRs);
  const [selectedPR, setSelectedPR] = useState<PullRequest | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const runCI = (prId: string) => {
    if (currentUser.role === 'Developer') {
      setPRs((prev) =>
        prev.map((pr) =>
          pr.prId === prId
            ? { ...pr, ciStatus: 'В процессе' as CIStatus }
            : pr
        )
      );
      setTimeout(() => {
        setPRs((prev) =>
          prev.map((pr) =>
            pr.prId === prId
              ? { ...pr, ciStatus: 'Успешно' as CIStatus }
              : pr
          )
        );
      }, 2000);
    }
  };

  const getStatusIcon = (status: CIStatus) => {
    switch (status) {
      case 'Success':
        return <Check className="size-4 text-green-600" />;
      case 'Failed':
        return <X className="size-4 text-red-600" />;
      case 'Running':
        return <Clock className="size-4 text-yellow-600 animate-spin" />;
      case 'Pending':
        return <Clock className="size-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: CIStatus) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-700';
      case 'Failed':
        return 'bg-red-100 text-red-700';
      case 'Running':
        return 'bg-yellow-100 text-yellow-700';
      case 'Pending':
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl text-slate-900">Pull Requests</h1>
        </div>
        {currentUser.role === 'Developer' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <GitPullRequest className="size-4" />
            Создать PR
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* PR List */}
        <div className="space-y-4">
          {prs.map((pr) => {
            const author = users.find((u) => u.id === pr.createdBy);
            const relatedTask = tasks.find((t) => t.id === pr.relatedTaskId);

            return (
              <div
                key={pr.prId}
                onClick={() => setSelectedPR(pr)}
                className={`bg-white p-5 rounded-xl shadow-sm border-2 cursor-pointer hover:shadow-md transition-all ${
                  selectedPR?.prId === pr.prId ? 'border-green-500' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Идентификатор PR</p>
                    <p className="text-lg text-slate-900">{pr.prId}</p>
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(pr.ciStatus)}`}>
                    {getStatusIcon(pr.ciStatus)}
                    {pr.ciStatus}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-slate-500 mb-1">Ветка</p>
                  <code className="text-sm text-slate-900 bg-slate-100 px-2 py-1 rounded">{pr.branch}</code>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Исполнитель: {author?.name}</span>
                  <div className="flex items-center gap-3">
                    {relatedTask && (
                      <span className="text-blue-600">→ Task: {relatedTask.id}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <MessageSquare className="size-3" />
                      {pr.comments.length}
                    </span>
                  </div>
                </div>

                {currentUser.role === 'Developer' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      runCI(pr.prId);
                    }}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
                  >
                    <Play className="size-4" />
                    Запустить CI
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* PR Detail */}
        {selectedPR && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
            <h2 className="text-xl text-slate-900 mb-4">PR Details & Inline Comments</h2>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Идентификатор PR</p>
                <p className="text-slate-900">{selectedPR.prId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Статус PR</p>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedPR.ciStatus)}
                  <span className="text-slate-900">{selectedPR.ciStatus}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Задача</p>
                <p className="text-slate-900">{selectedPR.relatedTaskId || 'None'}</p>
              </div>
            </div>

            {/* Inline Comments */}
            <div className="border-t border-slate-200 pt-4">
              <h3 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
                <Code className="size-4" />
                PullRequest комментарий
              </h3>

              <div className="space-y-3 mb-4">
                {selectedPR.comments.map((comment) => {
                  const commentUser = users.find((u) => u.id === comment.userId);
                  return (
                    <div key={comment.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-slate-600">{commentUser?.name}</p>
                          {comment.lineCode && (
                            <code className="text-xs bg-slate-200 px-1.5 py-0.5 rounded">
                              Line {comment.lineCode}
                            </code>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          comment.resolved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {comment.resolved ? 'Resolved' : 'Open'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-900 mb-2">{comment.text}</p>
                      <p className="text-xs text-slate-500 mb-2">Идентификатор комментария: {comment.id}</p>

                      {!comment.resolved && currentUser.role === 'Developer' && (
                        <button className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                          Comment.resolve()
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {currentUser.role === 'Developer' && (
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Короткий комментарий"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Текст комментарий"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                    Прокомментировать
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create PR Modal */}
      {showCreateModal && (
        <CreatePRModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function CreatePRModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[500px]" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl text-slate-900">Новый Pull Requests</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Идентификатор PR:</label>
            <input type="text" placeholder="pr-123" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Ветка:</label>
            <input type="text" placeholder="feature/new-feature" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Задача:</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
              <option value="">None</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>{t.id} - {t.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Создано:</label>
            <input type="text" value={currentUser.name} disabled className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100" />
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
            Отмена
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Создать Pull Request
          </button>
        </div>
      </div>
    </div>
  );
}
