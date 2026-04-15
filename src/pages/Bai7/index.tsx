import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, message, Form } from 'antd';
import { CalendarOutlined, BarChartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import moment from 'moment';
import './style.less';
import type { Task, StorageType } from './types';
import LoginModal from './components/LoginModal';
import TaskModal from './components/TaskModal';
import TaskTable from './components/TaskTable';
import TaskCalendar from './components/TaskCalendar';
import StatsCards from './components/StatsCards';

const { Header, Content, Sider } = Layout;

const Bai7: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState('all');
  const [form] = Form.useForm();
  const [storageType, setStorageType] = useState<StorageType>('localStorage');

  useEffect(() => {
    const userFromLS = localStorage.getItem('currentUser');
    const userFromSS = sessionStorage.getItem('currentUser');
    const storageTypeLS = localStorage.getItem('storageType');

    if (storageTypeLS) {
      setStorageType(storageTypeLS as StorageType);
    }

    if (userFromLS) {
      setCurrentUser(userFromLS);
    } else if (userFromSS) {
      setCurrentUser(userFromSS);
    } else {
      setIsLoginModalVisible(true);
    }

    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    let filtered = tasks;
    if (searchKeyword) {
      filtered = filtered.filter(task => task.name.toLowerCase().includes(searchKeyword.toLowerCase()));
    }
    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    if (assigneeFilter) {
      filtered = filtered.filter(task => task.assignee === assigneeFilter);
    }
    if (activeTab === 'my') {
      filtered = filtered.filter(task => task.assignee === currentUser);
    }
    setFilteredTasks(filtered);
  }, [tasks, searchKeyword, statusFilter, assigneeFilter, activeTab, currentUser]);

  useEffect(() => {
    if (editingTask) {
      form.setFieldsValue({
        ...editingTask,
        deadline: moment(editingTask.deadline),
      });
    } else {
      form.resetFields();
    }
  }, [editingTask, form]);

  const handleLogin = (values: { username: string }) => {
    const username = values.username.trim();

    if (username.length < 2) {
      message.error('Tên người dùng phải có ít nhất 2 ký tự!');
      return;
    }

    setCurrentUser(username);

    if (storageType === 'localStorage') {
      localStorage.setItem('currentUser', username);
      localStorage.removeItem('storageType');
    } else {
      sessionStorage.setItem('currentUser', username);
      localStorage.setItem('storageType', 'sessionStorage');
    }

    setIsLoginModalVisible(false);
    message.success(`Đăng nhập thành công! Chào mừng ${username}`);
  };

  const handleLogout = () => {
    const username = currentUser;
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('storageType');
    setIsLoginModalVisible(true);
    message.info(`Đăng xuất thành công! Tạm biệt ${username}`);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalVisible(true);
  };

  const handleDeleteTask = (id: string) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const handleTaskSubmit = (values: any) => {
    const newTask: Task = {
      id: editingTask ? editingTask.id : Date.now().toString(),
      name: values.name,
      assignee: values.assignee,
      priority: values.priority,
      deadline: values.deadline.format('YYYY-MM-DD'),
      status: values.status,
    };
    const newTasks = editingTask
      ? tasks.map(task => (task.id === editingTask.id ? newTask : task))
      : [...tasks, newTask];

    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
    setIsTaskModalVisible(false);
  };

  const events = tasks.map(task => ({
    title: task.name,
    start: new Date(task.deadline),
    end: new Date(task.deadline),
    resource: task,
  }));

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Đã xong').length;
  const myTasks = tasks.filter(task => task.assignee === currentUser);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#fff', margin: 0 }}>Bài 7 - Quản lý Công việc Nhóm</h2>
        <div>
          {currentUser ? (
            <div style={{ color: '#fff' }}>
              <span style={{ marginRight: 16 }}>
                <UserOutlined /> Xin chào: <strong>{currentUser}</strong>
              </span>
              <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
                Đăng xuất
              </Button>
            </div>
          ) : (
            <Button type="primary" onClick={() => setIsLoginModalVisible(true)}>
              Đăng nhập
            </Button>
          )}
        </div>
      </Header>

      <Layout>
        <Sider width={250} className="site-layout-background">
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            onClick={e => setActiveTab(e.key as string)}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.SubMenu key="task" icon={<BarChartOutlined />} title="Quản lý công việc">
              <Menu.Item key="all" icon={<BarChartOutlined />}>
                📋 Tất cả công việc
              </Menu.Item>
              <Menu.Item key="my" icon={<UserOutlined />}>
                👤 Công việc của tôi
              </Menu.Item>
              <Menu.Item key="calendar" icon={<CalendarOutlined />}>
                📅 Lịch công việc
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Sider>

        <Layout style={{ padding: '0 24px 24px' }}>
          <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
            <StatsCards
              totalTasks={totalTasks}
              completedTasks={completedTasks}
              myTasksCount={myTasks.length}
            />

            {activeTab === 'all' && (
              <div>
                <h3>📋 Tất cả công việc</h3>
                <TaskTable
                  tasks={tasks}
                  filteredTasks={filteredTasks}
                  searchKeyword={searchKeyword}
                  statusFilter={statusFilter}
                  assigneeFilter={assigneeFilter}
                  onSearchChange={setSearchKeyword}
                  onStatusFilterChange={setStatusFilter}
                  onAssigneeFilterChange={setAssigneeFilter}
                  onAdd={handleAddTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              </div>
            )}

            {activeTab === 'my' && (
              <div>
                <h3>
                  👤 Công việc được giao cho:{' '}
                  <span style={{ color: '#1890ff' }}>{currentUser}</span>
                </h3>
                <TaskTable
                  tasks={tasks}
                  filteredTasks={filteredTasks}
                  searchKeyword={searchKeyword}
                  statusFilter={statusFilter}
                  assigneeFilter={assigneeFilter}
                  onSearchChange={setSearchKeyword}
                  onStatusFilterChange={setStatusFilter}
                  onAssigneeFilterChange={setAssigneeFilter}
                  onAdd={handleAddTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              </div>
            )}

            {activeTab === 'calendar' && (
              <div>
                <h3>📅 Lịch công việc</h3>
                <TaskCalendar events={events} />
              </div>
            )}
          </Content>
        </Layout>
      </Layout>

      <LoginModal
        visible={isLoginModalVisible}
        currentUser={currentUser}
        storageType={storageType}
        onStorageTypeChange={setStorageType}
        onLogin={handleLogin}
        onClose={() => setIsLoginModalVisible(false)}
      />

      <TaskModal
        visible={isTaskModalVisible}
        editingTask={editingTask}
        form={form}
        onCancel={() => setIsTaskModalVisible(false)}
        onSubmit={handleTaskSubmit}
      />
    </Layout>
  );
};

export default Bai7;
