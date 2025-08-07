import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminData, deleteUser } from '../../store/AdminSlice';
import { logout } from '../../store/AuthSlice';
import { Table, Button, Space, Typography, Tag, notification } from 'antd';

const { Title } = Typography;

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { users, tasks, status, error } = useSelector((state) => state.admin);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchAdminData());
  }, [dispatch]);

  const handleDeleteUser = (userId) => {
    if (userId === currentUser.id) {
      notification.error({
        message: 'Forbidden',
        description: 'You cannot delete yourself.',
      });
      return;
    }
    dispatch(deleteUser(userId)).then((action) => {
      if (deleteUser.fulfilled.match(action)) {
        notification.success({
          message: 'Success',
          description: `User with ID ${userId} deleted.`,
        });
      } else {
        notification.error({
          message: 'Error',
          description: action.payload || 'Failed to delete user.',
        });
      }
    });
  };
  
  const handleLogout = () => {
    dispatch(logout());
  };

  const getUserColumns = () => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        render: (role) => (
          <Tag color={role === 'admin' ? 'volcano' : 'green'}>{role}</Tag>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Button 
              danger 
              onClick={() => handleDeleteUser(record.id)}
              disabled={record.id === currentUser.id}
            >
              Delete
            </Button>
          </Space>
        ),
      },
    ];
  };

  const getTaskColumns = () => {
    return [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 'done' ? 'green' : 'orange'}>{status}</Tag>
        ),
      },
      {
        title: 'User ID',
        dataIndex: 'userId',
        key: 'userId',
      },
    ];
  };

  if (status === 'loading') {
    return <div>Loading admin data...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Admin Dashboard</Title>
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Title level={4}>Users</Title>
      <Table 
        dataSource={users} 
        columns={getUserColumns()} 
        rowKey="id" 
        pagination={false} 
      />

      <Title level={4} style={{ marginTop: 24 }}>Tasks</Title>
      <Table 
        dataSource={tasks} 
        columns={getTaskColumns()} 
        rowKey="id" 
        pagination={false} 
      />
    </div>
  );
}