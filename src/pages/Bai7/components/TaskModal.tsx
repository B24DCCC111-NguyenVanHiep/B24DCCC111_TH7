import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import type { Task } from '../types';
import type { FormInstance } from 'antd';

const { Option } = Select;

interface TaskModalProps {
  visible: boolean;
  editingTask: Task | null;
  form: FormInstance;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  editingTask,
  form,
  onCancel,
  onSubmit,
}) => (
  <Modal
    title={editingTask ? 'Chỉnh sửa công việc' : 'Thêm công việc'}
    visible={visible}
    onCancel={onCancel}
    footer={null}
  >
    <Form form={form} onFinish={onSubmit} layout="vertical">
      <Form.Item
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}
      >
        <Input placeholder="Tên công việc" />
      </Form.Item>

      <Form.Item
        name="assignee"
        rules={[{ required: true, message: 'Vui lòng nhập tên người được giao!' }]}
      >
        <Input placeholder="Nhập tên người được giao" />
      </Form.Item>

      <Form.Item
        name="priority"
        rules={[{ required: true, message: 'Vui lòng chọn ưu tiên!' }]}
      >
        <Select placeholder="Ưu tiên">
          <Option value="Thấp">Thấp</Option>
          <Option value="Trung bình">Trung bình</Option>
          <Option value="Cao">Cao</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="deadline"
        rules={[{ required: true, message: 'Vui lòng chọn deadline!' }]}
      >
        <DatePicker placeholder="Deadline" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="status"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
      >
        <Select placeholder="Trạng thái">
          <Option value="Chưa làm">Chưa làm</Option>
          <Option value="Đang làm">Đang làm</Option>
          <Option value="Đã xong">Đã xong</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {editingTask ? 'Cập nhật' : 'Thêm'}
        </Button>
      </Form.Item>
    </Form>
  </Modal>
);

export default TaskModal;
