import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Button, Select, Space } from 'antd';
import { deleteTask } from '../../store/TasksSlice';

const { Option } = Select;

export default function TasksTable() {
  const tasks = useSelector((state) => state.tasks.items);
  const [statusFilter, setStatusFilter] = useState(null);
  const dispatch = useDispatch();

  const filteredTasks = statusFilter
    ? tasks.filter((task) => task.status === statusFilter)
    : tasks;

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  const columns = [
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record.id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <span>Status Filter:</span>
        <Select
          allowClear
          placeholder="Select status"
          onChange={setStatusFilter}
          style={{ width: 150 }}
        >
          <Option value="pending">Pending</Option>
          <Option value="done">Done</Option>
        </Select>
      </Space>

      <Table
        dataSource={filteredTasks}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </>
  );
}
