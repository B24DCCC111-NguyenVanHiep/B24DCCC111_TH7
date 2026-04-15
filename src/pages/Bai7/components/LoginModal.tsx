import React from 'react';
import { Modal, Form, Input, Select, Button, Divider } from 'antd';
import type { StorageType } from '../types';

const { Option } = Select;

interface LoginModalProps {
  visible: boolean;
  currentUser: string | null;
  storageType: StorageType;
  onStorageTypeChange: (value: StorageType) => void;
  onLogin: (values: { username: string }) => void;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  visible,
  currentUser,
  storageType,
  onStorageTypeChange,
  onLogin,
  onClose,
}) => (
  <Modal
    title="Đăng nhập"
    visible={visible}
    onCancel={() => (currentUser ? undefined : onClose())}
    footer={null}
    closable={!!currentUser}
  >
    <Form onFinish={onLogin} layout="vertical">
      <Form.Item
        label="Tên người dùng"
        name="username"
        rules={[
          { required: true, message: 'Vui lòng nhập tên người dùng!' },
          { min: 2, message: 'Tên người dùng phải có ít nhất 2 ký tự!' },
          { max: 50, message: 'Tên người dùng không được vượt quá 50 ký tự!' },
        ]}
      >
        <Input placeholder="Nhập tên người dùng của bạn" autoFocus />
      </Form.Item>

      <Divider />

      <Form.Item label="Chọn loại lưu trữ:">
        <Select value={storageType} onChange={onStorageTypeChange}>
          <Option value="localStorage">localStorage (Lưu lâu dài)</Option>
          <Option value="sessionStorage">
            sessionStorage (Xóa khi đóng trình duyệt)
          </Option>
        </Select>
      </Form.Item>

      <p style={{ fontSize: 12, color: '#666' }}>
        <strong>localStorage:</strong> Thông tin sẽ được lưu lâu dài
        <br />
        <strong>sessionStorage:</strong> Thông tin sẽ bị xóa khi đóng trình duyệt
      </p>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  </Modal>
);

export default LoginModal;
