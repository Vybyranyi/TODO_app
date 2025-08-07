import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchTasks } from '../../store/TasksSlice';
import TaskAddForm from '../../components/TaskAddForm/TaskAddForm';
import TasksTable from '../../components/TasksTable/TasksTable';
import { Typography, Divider, Button } from 'antd';
import { logout } from '../../store/AuthSlice';

const { Title } = Typography;

export default function Overview() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Task Manager</Title>
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <TaskAddForm />

      <Divider />

      <TasksTable />
    </div>
  );
}
