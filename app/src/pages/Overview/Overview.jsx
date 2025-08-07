import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../store/TasksSlice';
import TaskAddForm from '../../components/TaskAddForm/TaskAddForm';
import TasksTable from '../../components/TasksTable/TasksTable';
import { Typography, Divider, Button } from 'antd';
import { logout } from '../../store/AuthSlice';

const { Title } = Typography;

export default function Overview() {
  const dispatch = useDispatch();
  const tasksStatus = useSelector((state) => state.tasks.status); 
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (tasksStatus === 'idle' || tasksStatus === 'succeeded') {
      dispatch(fetchTasks());
    }
  }, [dispatch, tasksStatus]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleFormCancel = () => {
    setEditingTask(null);
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Task Manager</Title>
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <TaskAddForm editingTask={editingTask} onCancelEdit={handleFormCancel} />

      <Divider />

      <TasksTable onEdit={handleEdit} />
    </div>
  );
}