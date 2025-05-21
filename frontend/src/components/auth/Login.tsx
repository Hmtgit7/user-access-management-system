// frontend/src/components/auth/Login.tsx
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

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required')
        }),
        onSubmit: async (values) => {
            try {
                setError(null);
                await login(values.username, values.password);
                navigate('/dashboard');
            } catch (err: any) {
                setError(err.response?.data?.message || 'Login failed. Please try again.');
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
                    Login
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

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        className="mt-6 mb-4 bg-blue-600 hover:bg-blue-700"
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <Box className="mt-4 text-center">
                    <Typography variant="body2" className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-600 hover:underline">
                            Sign up
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </div>
    );
};

export default Login;