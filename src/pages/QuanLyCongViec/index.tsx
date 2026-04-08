import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Input, Modal, Form, Select, DatePicker, Table, Tag, Space, Card, Statistic, Row, Col, message, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FilterOutlined, CalendarOutlined, BarChartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './style.less';

const { Header, Content, Sider } = Layout;
const { Option } = Select;

const localizer = momentLocalizer(moment);

interface Task {
  id: string;
  name: string;
  assignee: string;
  priority: 'Thấp' | 'Trung bình' | 'Cao';
  deadline: string;
  status: 'Chưa làm' | 'Đang làm' | 'Đã xong';
}

const QuanLyCongViec: React.FC = () => {
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
  const [storageType, setStorageType] = useState<'localStorage' | 'sessionStorage'>('localStorage');

  useEffect(() => {
    const userFromLS = localStorage.getItem('currentUser');
    const userFromSS = sessionStorage.getItem('currentUser');
    const storageTypeLS = localStorage.getItem('storageType');
    
    if (storageTypeLS) {
      setStorageType(storageTypeLS as 'localStorage' | 'sessionStorage');
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

  const handleLogin = (values: { username: string }) => {
    const username = values.username.trim();
    
    if (username.length < 2) {
      message.error('Tên người dùng phải có ít nhất 2 ký tự!');
      return;
    }
    
    setCurrentUser(username);
    
    // Lưu vào storage được chọn
    if (storageType === 'localStorage') {
      localStorage.setItem('currentUser', username);
      localStorage.removeItem('storageType'); // Xóa sessionStorage để ưu tiên localStorage
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
    form.resetFields();
    setIsTaskModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      deadline: moment(task.deadline),
    });
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
    let newTasks;
    if (editingTask) {
      newTasks = tasks.map(task => task.id === editingTask.id ? newTask : task);
    } else {
      newTasks = [...tasks, newTask];
    }
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
    setIsTaskModalVisible(false);
  };

  const columns = [
    {
      title: 'Tên công việc',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Người được giao',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const color = priority === 'Cao' ? 'red' : priority === 'Trung bình' ? 'orange' : 'green';
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Đã xong' ? 'green' : status === 'Đang làm' ? 'blue' : 'gray';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text: string, record: Task) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEditTask(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDeleteTask(record.id)} danger />
        </Space>
      ),
    },
  ];

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
        <h2 style={{ color: '#fff', margin: 0 }}>Quản lý Công việc Nhóm</h2>
        <div>
          {currentUser ? (
            <Space size="large" style={{ color: '#fff' }}>
              <span><UserOutlined /> Xin chào: <strong>{currentUser}</strong></span>
              <Button 
                type="primary" 
                danger 
                icon={<LogoutOutlined />} 
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </Space>
          ) : (
            <Button 
              type="primary" 
              onClick={() => setIsLoginModalVisible(true)}
            >
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
            onClick={(e) => setActiveTab(e.key as string)}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="all" icon={<BarChartOutlined />}>
              📋 Tất cả công việc
            </Menu.Item>
            <Menu.Item key="my" icon={<UserOutlined />}>
              👤 Công việc của tôi
            </Menu.Item>
            <Menu.Item key="calendar" icon={<CalendarOutlined />}>
              📅 Lịch công việc
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Card>
                  <Statistic title="Tổng công việc" value={totalTasks} />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic title="Đã hoàn thành" value={completedTasks} />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic title="Công việc của tôi" value={myTasks.length} />
                </Card>
              </Col>
            </Row>
            {activeTab === 'all' && (
              <div>
                <h3>📋 Tất cả công việc</h3>
                <div style={{ marginBottom: 20 }}>
                  <Space>
                    <Input
                      placeholder="Tìm kiếm theo tên"
                      prefix={<SearchOutlined />}
                      value={searchKeyword}
                      onChange={e => setSearchKeyword(e.target.value)}
                    />
                    <Select placeholder="Lọc theo trạng thái" value={statusFilter} onChange={setStatusFilter} style={{ width: 150 }}>
                      <Option value="">Tất cả</Option>
                      <Option value="Chưa làm">Chưa làm</Option>
                      <Option value="Đang làm">Đang làm</Option>
                      <Option value="Đã xong">Đã xong</Option>
                    </Select>
                    <Select placeholder="Lọc theo người giao" value={assigneeFilter} onChange={setAssigneeFilter} style={{ width: 150 }}>
                      <Option value="">Tất cả</Option>
                      {Array.from(new Set(tasks.map(task => task.assignee))).map(assignee => (
                        <Option key={assignee} value={assignee}>{assignee}</Option>
                      ))}
                    </Select>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTask}>
                      Thêm công việc
                    </Button>
                  </Space>
                </div>
                <Table columns={columns} dataSource={filteredTasks} rowKey="id" />
              </div>
            )}
            
            {activeTab === 'my' && (
              <div>
                <h3>👤 Công việc được giao cho: <span style={{ color: '#1890ff' }}>{currentUser}</span></h3>
                <Table columns={columns} dataSource={filteredTasks} rowKey="id" />
              </div>
            )}
            
            {activeTab === 'calendar' && (
              <div>
                <h3>📅 Lịch công việc</h3>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500 }}
                />
              </div>
            )}
          </Content>
        </Layout>
      </Layout>

      <Modal
        title="Đăng nhập"
        visible={isLoginModalVisible}
        onCancel={() => currentUser || setIsLoginModalVisible(false)}
        footer={null}
        closable={!!currentUser}
      >
        <Form onFinish={handleLogin} layout="vertical">
          <Form.Item 
            label="Tên người dùng"
            name="username" 
            rules={[
              { required: true, message: 'Vui lòng nhập tên người dùng!' },
              { min: 2, message: 'Tên người dùng phải có ít nhất 2 ký tự!' },
              { max: 50, message: 'Tên người dùng không được vượt quá 50 ký tự!' }
            ]}
          >
            <Input 
              placeholder="Nhập tên người dùng của bạn" 
              autoFocus
            />
          </Form.Item>
          
          <Divider />
          
          <Form.Item 
            label="Chọn loại lưu trữ:"
          >
            <Select 
              value={storageType} 
              onChange={setStorageType}
            >
              <Option value="localStorage">
                localStorage (Lưu lâu dài)
              </Option>
              <Option value="sessionStorage">
                sessionStorage (Xóa khi đóng trình duyệt)
              </Option>
            </Select>
          </Form.Item>
          <p style={{ fontSize: '12px', color: '#666' }}>
            <strong>localStorage:</strong> Thông tin sẽ được lưu lâu dài<br/>
            <strong>sessionStorage:</strong> Thông tin sẽ bị xóa khi đóng trình duyệt
          </p>
          
          <Divider />
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingTask ? 'Chỉnh sửa công việc' : 'Thêm công việc'}
        visible={isTaskModalVisible}
        onCancel={() => setIsTaskModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleTaskSubmit}>
          <Form.Item name="name" rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}>
            <Input placeholder="Tên công việc" />
          </Form.Item>
          <Form.Item name="assignee" rules={[{ required: true, message: 'Vui lòng nhập tên người được giao!' }]}>
            <Input placeholder="Nhập tên người được giao" />
          </Form.Item>
          <Form.Item name="priority" rules={[{ required: true, message: 'Vui lòng chọn ưu tiên!' }]}>
            <Select placeholder="Ưu tiên">
              <Option value="Thấp">Thấp</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Cao">Cao</Option>
            </Select>
          </Form.Item>
          <Form.Item name="deadline" rules={[{ required: true, message: 'Vui lòng chọn deadline!' }]}>
            <DatePicker placeholder="Deadline" />
          </Form.Item>
          <Form.Item name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
            <Select placeholder="Trạng thái">
              <Option value="Chưa làm">Chưa làm</Option>
              <Option value="Đang làm">Đang làm</Option>
              <Option value="Đã xong">Đã xong</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingTask ? 'Cập nhật' : 'Thêm'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default QuanLyCongViec;