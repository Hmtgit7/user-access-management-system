// frontend/src/pages/CreateSoftwarePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Typography,
    TextField,
    Button,
    FormHelperText,
    Chip,
    Box,
    Alert,
    Paper,
    Divider,
    LinearProgress
} from '@mui/material';
import { Add } from '@mui/icons-material';
import MainLayout from '../components/layouts/MainLayout';
import SoftwareService from '../services/software.service';

const accessLevels = ['Read', 'Write', 'Admin'];

const CreateSoftwarePage: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            accessLevels: [] as string[]
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Name is required')
                .max(100, 'Name must be at most 100 characters'),
            description: Yup.string()
                .required('Description is required')
                .min(10, 'Description must be at least 10 characters'),
            accessLevels: Yup.array()
                .of(Yup.string())
                .min(1, 'At least one access level is required')
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true);
                setError(null);
                setSuccess(null);

                await SoftwareService.createSoftware(values);

                setSuccess('Software created successfully!');

                // Reset form after successful submission
                formik.resetForm();

                // Redirect after a short delay
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to create software. Please try again.');
                console.error('Create software error:', err);
            } finally {
                setLoading(false);
            }
        }
    });

    const handleAccessLevelSelect = (level: string) => {
        const currentLevels = formik.values.accessLevels;

        if (currentLevels.includes(level)) {
            // Remove level if already selected
            formik.setFieldValue(
                'accessLevels',
                currentLevels.filter(l => l !== level)
            );
        } else {
            // Add level if not selected
            formik.setFieldValue('accessLevels', [...currentLevels, level]);
        }
    };

    return (
        <MainLayout>
            <Box className="mb-6">
                <Typography variant="h4" className="mb-2">
                    Add New Software
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Create a new software entry in the system
                </Typography>
            </Box>

            {loading && <LinearProgress className="mb-4" />}

            {error && (
                <Alert severity="error" className="mb-4">
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" className="mb-4">
                    {success}
                </Alert>
            )}

            <Paper elevation={2} className="p-6">
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Software Name"
                        variant="outlined"
                        margin="normal"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        disabled={loading}
                    />

                    <TextField
                        fullWidth
                        id="description"
                        name="description"
                        label="Description"
                        variant="outlined"
                        margin="normal"
                        multiline
                        rows={4}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                        disabled={loading}
                    />

                    <Box className="mt-4">
                        <Typography variant="subtitle1" className="mb-2">
                            Access Levels
                        </Typography>

                        <Box className="flex flex-wrap gap-2 mb-2">
                            {accessLevels.map((level) => (
                                <Chip
                                    key={level}
                                    label={level}
                                    color={formik.values.accessLevels.includes(level) ? 'primary' : 'default'}
                                    onClick={() => handleAccessLevelSelect(level)}
                                    disabled={loading}
                                    clickable
                                />
                            ))}
                        </Box>

                        {formik.touched.accessLevels && formik.errors.accessLevels && (
                            <FormHelperText error>
                                {formik.errors.accessLevels as string}
                            </FormHelperText>
                        )}

                        <Box className="mt-3">
                            <Typography variant="body2" color="textSecondary">
                                Selected Access Levels:
                            </Typography>
                            <Box className="flex flex-wrap gap-1 mt-1">
                                {formik.values.accessLevels.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary" className="italic">
                                        No access levels selected
                                    </Typography>
                                ) : (
                                    formik.values.accessLevels.map((level) => (
                                        <Chip
                                            key={level}
                                            label={level}
                                            onDelete={() => handleAccessLevelSelect(level)}
                                            size="small"
                                            color="primary"
                                            disabled={loading}
                                        />
                                    ))
                                )}
                            </Box>
                        </Box>
                    </Box>

                    <Divider className="my-6" />

                    <Box className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outlined"
                            color="inherit"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!formik.isValid || formik.isSubmitting || loading}
                            startIcon={<Add />}
                        >
                            Create Software
                        </Button>
                    </Box>
                </form>
            </Paper>
        </MainLayout>
    );
};

export default CreateSoftwarePage;