import React, { useState, useEffect } from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { UserLogin, UserRegister } from '../../store/AuthSlice'; 
import styles from './LoginPage.module.scss';

const { Text } = Typography;

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email format')
        .min(5, 'Email must be at least 5 characters')
        .max(50, 'Email must be at most 50 characters')
        .required('Email is required'),
    password: Yup.string()
        .min(5, 'Password must be at least 5 characters')
        .required('Password is required'),
});

export default function LoginPage() {
    const [actionType, setActionType] = useState('login');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { error, loading, isAuth } = useSelector((state) => state.auth);

    const [form] = Form.useForm();

    useEffect(() => {
        if (isAuth) {
            navigate('/overview');
        }
    }, [isAuth, navigate]);

    const handleButtonClick = (type) => {
        setActionType(type);
    };

    return (
        <div className={styles.LoginForm}>
            <h2 className={styles.LoginTitle}>
                {actionType === 'login' ? 'Login' : 'Register'}
            </h2>

            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    rememberMe: false,
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                        if (actionType === 'login') {
                            await dispatch(UserLogin(values)).unwrap();
                        } else {
                            await dispatch(UserRegister(values)).unwrap();
                        }
                        // Перенаправлення відбудеться через useEffect
                    } catch (error) {
                        console.error('Auth error:', error);
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ handleSubmit, handleChange, values, touched, errors, handleBlur, isSubmitting }) => (
                    <Form layout="vertical" onFinish={handleSubmit} form={form}>
                        <Form.Item
                            label="Email"
                            validateStatus={touched.email && errors.email ? 'error' : ''}
                            help={touched.email && errors.email}
                        >
                            <Input
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={loading}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            validateStatus={touched.password && errors.password ? 'error' : ''}
                            help={touched.password && errors.password}
                        >
                            <Input.Password
                                name="password"
                                placeholder="Enter your password"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={loading}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Checkbox
                                name="rememberMe"
                                checked={values.rememberMe}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                Remember Me
                            </Checkbox>
                        </Form.Item>

                        {error && (
                            <Text type="danger" className={styles.FormError}>
                                {error}
                            </Text>
                        )}

                        <div className={styles.ButtonsSection}>
                            <Form.Item>
                                <Button
                                    type={actionType === 'register' ? 'primary' : 'default'}
                                    htmlType="submit"
                                    loading={isSubmitting || loading}
                                    block
                                    onClick={() => handleButtonClick('register')}
                                    disabled={loading}
                                >
                                    Register
                                </Button>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type={actionType === 'login' ? 'primary' : 'default'}
                                    htmlType="submit"
                                    loading={isSubmitting || loading}
                                    block
                                    onClick={() => handleButtonClick('login')}
                                    disabled={loading}
                                >
                                    Login
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}