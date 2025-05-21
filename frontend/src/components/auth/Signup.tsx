// frontend/src/components/auth/Signup.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    Button,
    Paper,
    Typography,
    Box,
    Alert,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            fullName: ''
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, 'Username must be at least 3 characters')
                .max(20, 'Username must be less than 20 characters')
                .required('Username is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Please confirm your password'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            fullName: Yup.string()
                .required('Full name is required')
        }),
        onSubmit: async (values) => {
            try {
                setError(null);
                await signup(
                    values.username,
                    values.password,
                    values.email,
                    values.fullName
                );
                navigate('/dashboard');
            } catch (err: any) {
                setError(err.response?.data?.message || 'Registration failed. Please try again.');
            }
        }
    });

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Paper elevation={3} className="p-8 w-full max-w-md">
                <Typography variant="h4" className="text-center mb-6 font-bold text-blue-700">
                    Sign Up
                </Typography>

                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        id="username"
                        name="username"
                        label="Username"
                        variant="outlined"
                        margin="normal"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                    />

                    <TextField
                        fullWidth
                        id="fullName"
                        name="fullName"
                        label="Full Name"
                        variant="outlined"
                        margin="normal"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                        helperText={formik.touched.fullName && formik.errors.fullName}
                    />

                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />

                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        margin="normal"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleTogglePasswordVisibility}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    <TextField
                        fullWidth
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        margin="normal"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        className="mt-6 mb-4 bg-blue-600 hover:bg-blue-700"
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? 'Signing up...' : 'Sign Up'}
                    </Button>
                </form>

                <Box className="mt-4 text-center">
                    <Typography variant="body2" className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </div>
    );
};

export default Signup;