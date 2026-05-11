import { useState } from 'react';
import { useNavigate } from 'react-router';
import { users, setCurrentUser } from '../../mockData';
import { User } from '../../types';

export default function Login() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loginInput, setLoginInput] = useState('');

  const handleLogin = () => {
    if (selectedUser) {
      setCurrentUser(selectedUser);
      navigate('/dashboard');
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[480px]">
        <h1 className="text-3xl mb-2 text-slate-900">Project Manager</h1>
        <p className="text-slate-600 mb-8">Task Management System</p>

        <div className="space-y-6">
          {/* User selection */}
          <div>
            <label className="block text-sm mb-2 text-slate-700">
              Выберите пользователя
            </label>
            <div className="space-y-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user);
                    setLoginInput(user.login);
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedUser?.id === user.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-full bg-slate-200 flex items-center justify-center">
                      <span className="text-lg">{user.name[0]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-500 text-xs">Пользователь</p>
                      <p className="text-slate-900">{user.name}</p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-slate-500">
                          Роль: <span className="text-slate-700">{user.role}</span>
                        </span>
                        <span className="text-xs text-slate-500">
                          Идентификатор: <span className="text-slate-700">{user.id}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={!selectedUser}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Войти
          </button>
        </div>

        <div className="mt-8 p-4 bg-slate-100 rounded-lg">
          <p className="text-xs text-slate-600 mb-2">Возможности:</p>
          <ul className="text-xs text-slate-700 space-y-1">
            <li><span className="text-blue-600">Developer:</span> создавать/закрывать задачи, создавать PR</li>
            <li><span className="text-purple-600">PM:</span> задавать приоритет, назначать исполнителя, добавлять задачи к спринту, высчитывать продуктивность</li>
            <li><span className="text-orange-600">DevOps:</span> сообщать о багах, смотреть CI</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
