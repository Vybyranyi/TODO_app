import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Button, Select, Space } from 'antd';
import { deleteTask, updateTask } from '../../store/TasksSlice';

const { Option } = Select;

export default function TasksTable({ onEdit }) { 
    const tasks = useSelector((state) => state.tasks.items);
    const [statusFilter, setStatusFilter] = useState(null);
    const dispatch = useDispatch();

    const filteredTasks = statusFilter
        ? tasks.filter((task) => task.status === statusFilter)
        : tasks;

    const handleDelete = (id) => {
        dispatch(deleteTask(id));
    };

    const handleStatusChange = (id, newStatus) => {
        dispatch(updateTask({ id, updates: { status: newStatus } }));
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
            render: (status, record) => (
                <Select
                    defaultValue={status}
                    style={{ width: 150 }}
                    onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
                >
                    <Option value="todo">To Do</Option>
                    <Option value="in_progress">In Progress</Option>
                    <Option value="done">Done</Option>
                </Select>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button onClick={() => onEdit(record)}>Edit</Button>
                    <Button danger onClick={() => handleDelete(record.id)}>
                        Delete
                    </Button>
                </Space>
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
                    <Option value="todo">To Do</Option>
                    <Option value="in_progress">In Progress</Option>
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