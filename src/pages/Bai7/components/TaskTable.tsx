import React from 'react';
import { Table, Space, Button, Input, Select } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Task } from '../types';

const { Option } = Select;

interface TaskTableProps {
  tasks: Task[];
  filteredTasks: Task[];
  searchKeyword: string;
  statusFilter: string;
  assigneeFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onAssigneeFilterChange: (value: string) => void;
  onAdd: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  filteredTasks,
  searchKeyword,
  statusFilter,
  assigneeFilter,
  onSearchChange,
  onStatusFilterChange,
  onAssigneeFilterChange,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const assignees = Array.from(new Set(tasks.map(task => task.assignee)));

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
        return <span style={{ color }}>{priority}</span>;
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
        return <span style={{ color }}>{status}</span>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: unknown, record: Task) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => onDelete(record.id)} danger />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm theo tên"
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={e => onSearchChange(e.target.value)}
            style={{ minWidth: 220 }}
          />
          <Select
            placeholder="Lọc theo trạng thái"
            value={statusFilter}
            onChange={onStatusFilterChange}
            style={{ width: 160 }}
          >
            <Option value="">Tất cả</Option>
            <Option value="Chưa làm">Chưa làm</Option>
            <Option value="Đang làm">Đang làm</Option>
            <Option value="Đã xong">Đã xong</Option>
          </Select>
          <Select
            placeholder="Lọc theo người giao"
            value={assigneeFilter}
            onChange={onAssigneeFilterChange}
            style={{ width: 180 }}
          >
            <Option value="">Tất cả</Option>
            {assignees.map(assignee => (
              <Option key={assignee} value={assignee}>
                {assignee}
              </Option>
            ))}
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            Thêm công việc
          </Button>
        </Space>
      </div>

      <Table columns={columns} dataSource={filteredTasks} rowKey="id" />
    </div>
  );
};

export default TaskTable;
