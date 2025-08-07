import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createTask, updateTask } from '../../store/TasksSlice';
import { Form, Input, Button, Select, Space } from 'antd';
const { Option } = Select;

export default function TaskAddForm({ editingTask, onCancelEdit }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingTask) {
      form.setFieldsValue({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
      });
    } else {
      form.resetFields();
    }
  }, [editingTask, form]);

  const handleSubmit = (values) => {
    if (editingTask) {
      dispatch(updateTask({ id: editingTask.id, updates: values })).then(() => {
        onCancelEdit();
      });
    } else {
      const task = {
        ...values,
        status: values.status || 'todo',
      };
      dispatch(createTask(task)).then(() => {
        form.resetFields();
      });
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <h3>{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please enter a title' }]}
      >
        <Input placeholder="Enter task title" />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input.TextArea placeholder="Enter task description" rows={4} />
      </Form.Item>

      <Space>
        <Button type="primary" htmlType="submit">
          {editingTask ? 'Save Changes' : 'Add Task'}
        </Button>
        {editingTask && ( 
          <Button onClick={onCancelEdit}>Cancel</Button>
        )}
      </Space>
    </Form>
  );
}