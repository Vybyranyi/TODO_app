import React from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../../store/TasksSlice';
import { Form, Input, Button } from 'antd';

export default function TaskAddForm() {
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const task = {
      title: values.title,
      description: values.description,
      status: 'todo',
    };

    dispatch(createTask(task)).then(() => {
      form.resetFields();
    });
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
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

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Task
        </Button>
      </Form.Item>
    </Form>
  );
}
