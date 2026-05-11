import { currentUser, tasks, bugs, sprints, pullRequests } from '../../mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const activeSprint = sprints[0];
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const totalTasks = tasks.length;
  const criticalBugs = bugs.filter(b => b.priority === 'Critical').length;

  const tasksByStatus = [
    { status: 'К выполению', count: tasks.filter(t => t.status === 'Todo').length },
    { status: 'В процессе', count: tasks.filter(t => t.status === 'InProgress').length },
    { status: 'Обзор', count: tasks.filter(t => t.status === 'Review').length },
    { status: 'Выполнено', count: tasks.filter(t => t.status === 'Done').length },
  ];

  const ciStatusData = [
    { name: 'Успешно', value: pullRequests.filter(pr => pr.ciStatus === 'Success').length },
    { name: 'Неудачно', value: pullRequests.filter(pr => pr.ciStatus === 'Failed').length },
    { name: 'В процессе', value: pullRequests.filter(pr => pr.ciStatus === 'Running').length },
  ];

  const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl text-slate-900">Дэшборд</h1>
        <p className="text-slate-600 mt-1">Добро пожаловать, {currentUser.name} ({currentUser.role})!</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600 mb-1">Текущий спринт</p>
          <p className="text-2xl text-slate-900">Спринт: {activeSprint.id}</p>
          <p className="text-xs text-slate-500 mt-2">Всего SP: {activeSprint.totalSP}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600 mb-1">Задач выполнено</p>
          <p className="text-2xl text-slate-900">{completedTasks}/{totalTasks}</p>
          <p className="text-xs text-slate-500 mt-2">{Math.round((completedTasks/totalTasks)*100)}% выполнено</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600 mb-1">Критических багов</p>
          <p className="text-2xl text-red-600">{criticalBugs}</p>
          <p className="text-xs text-slate-500 mt-2">Cтепень важности: Критический</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600 mb-1">Pull Requests</p>
          <p className="text-2xl text-slate-900">{pullRequests.length}</p>
          <p className="text-xs text-slate-500 mt-2">Количество PR</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg mb-4 text-slate-900">Статусы задач</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tasksByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg mb-4 text-slate-900">Cтатусы PR</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ciStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ciStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
