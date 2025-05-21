// frontend/src/pages/RequestAccessPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Box,
    Alert,
    Paper,
    Divider,
    LinearProgress,
    Card,
    CardContent,
    Chip,
    SelectChangeEvent
} from '@mui/material';
import { Send, Apps } from '@mui/icons-material';
import MainLayout from '../components/layouts/MainLayout';
import SoftwareService, { Software } from '../services/software.service';
import RequestService from '../services/request.service';

const RequestAccessPage: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [software, setSoftware] = useState<Software[]>([]);
    const [fetchLoading, setFetchLoading] = useState<boolean>(true);
    const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(null);

    // Fetch software list on component mount
    useEffect(() => {
        const fetchSoftware = async () => {
            try {
                setFetchLoading(true);
                const softwareList = await SoftwareService.getAllSoftware();
                setSoftware(softwareList);
            } catch (err: any) {
                setError('Failed to load software list. Please try again.');
                console.error('Software fetch error:', err);
            } finally {
                setFetchLoading(false);
            }
        };

        fetchSoftware();
    }, []);

    const formik = useFormik({
        initialValues: {
            softwareId: '',
            accessType: '',
            reason: ''
        },
        validationSchema: Yup.object({
            softwareId: Yup.string()
                .required('Software selection is required'),
            accessType: Yup.string()
                .required('Access type is required'),
            reason: Yup.string()
                .required('Reason is required')
                .min(10, 'Reason must be at least 10 characters')
                .max(500, 'Reason must not exceed 500 characters')
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true);
                setError(null);
                setSuccess(null);

                await RequestService.createRequest({
                    softwareId: parseInt(values.softwareId),
                    accessType: values.accessType as 'Read' | 'Write' | 'Admin',
                    reason: values.reason
                });

                setSuccess('Access request submitted successfully!');

                // Reset form after successful submission
                formik.resetForm();
                setSelectedSoftware(null);

                // Redirect after a short delay
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
                console.error('Create request error:', err);
            } finally {
                setLoading(false);
            }
        }
    });

    const handleSoftwareChange = (event: SelectChangeEvent) => {
        const softwareId = event.target.value;
        formik.setFieldValue('softwareId', softwareId);

        // Reset access type when software changes
        formik.setFieldValue('accessType', '');

        // Find the selected software object
        const selected = software.find(s => s.id.toString() === softwareId) || null;
        setSelectedSoftware(selected);
    };

    return (
        <MainLayout>
            <Box className="mb-6">
                <Typography variant="h4" className="mb-2">
                    Request Software Access
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Submit a request for access to available software
                </Typography>
            </Box>

            {fetchLoading ? (
                <Box className="text-center py-10">
                    <LinearProgress />
                    <Typography variant="body1" className="mt-4">
                        Loading available software...
                    </Typography>
                </Box>
            ) : (
                <>
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

                    {loading && <LinearProgress className="mb-4" />}

                    {software.length === 0 ? (
                        <Alert severity="info">
                            No software is currently available in the system.
                        </Alert>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-8">
                                <Paper elevation={2} className="p-6">
                                    <form onSubmit={formik.handleSubmit}>
                                        <FormControl
                                            fullWidth
                                            margin="normal"
                                            error={formik.touched.softwareId && Boolean(formik.errors.softwareId)}
                                        >
                                            <InputLabel id="software-select-label">Select Software</InputLabel>
                                            <Select
                                                labelId="software-select-label"
                                                id="softwareId"
                                                name="softwareId"
                                                value={formik.values.softwareId}
                                                onChange={handleSoftwareChange}
                                                onBlur={formik.handleBlur}
                                                label="Select Software"
                                                disabled={loading}
                                            >
                                                {software.map((sw) => (
                                                    <MenuItem key={sw.id} value={sw.id.toString()}>
                                                        {sw.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {formik.touched.softwareId && formik.errors.softwareId && (
                                                <FormHelperText>{formik.errors.softwareId}</FormHelperText>
                                            )}
                                        </FormControl>

                                        {selectedSoftware && (
                                            <>
                                                <FormControl
                                                    fullWidth
                                                    margin="normal"
                                                    error={formik.touched.accessType && Boolean(formik.errors.accessType)}
                                                >
                                                    <InputLabel id="access-type-label">Access Type</InputLabel>
                                                    <Select
                                                        labelId="access-type-label"
                                                        id="accessType"
                                                        name="accessType"
                                                        value={formik.values.accessType}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        label="Access Type"
                                                        disabled={loading}
                                                    >
                                                        {selectedSoftware.accessLevels.map((level) => (
                                                            <MenuItem key={level} value={level}>
                                                                {level}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {formik.touched.accessType && formik.errors.accessType && (
                                                        <FormHelperText>{formik.errors.accessType}</FormHelperText>
                                                    )}
                                                </FormControl>

                                                <TextField
                                                    fullWidth
                                                    id="reason"
                                                    name="reason"
                                                    label="Reason for Access"
                                                    variant="outlined"
                                                    margin="normal"
                                                    multiline
                                                    rows={4}
                                                    value={formik.values.reason}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.reason && Boolean(formik.errors.reason)}
                                                    helperText={
                                                        (formik.touched.reason && formik.errors.reason) ||
                                                        'Please provide a detailed reason why you need access to this software'
                                                    }
                                                    placeholder="Explain why you need access to this software and how you plan to use it..."
                                                    disabled={loading}
                                                />
                                            </>
                                        )}

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
                                                startIcon={<Send />}
                                            >
                                                Submit Request
                                            </Button>
                                        </Box>
                                    </form>
                                </Paper>
                            </div>

                            <div className="md:col-span-4">
                                {selectedSoftware ? (
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" className="flex items-center mb-3">
                                                <Apps className="mr-2 text-blue-600" />
                                                {selectedSoftware.name}
                                            </Typography>

                                            <Typography variant="body2" className="mb-4">
                                                {selectedSoftware.description}
                                            </Typography>

                                            <Typography variant="subtitle2" className="mb-2">
                                                Available Access Levels:
                                            </Typography>

                                            <Box className="flex flex-wrap gap-1">
                                                {selectedSoftware.accessLevels.map((level) => (
                                                    <Chip
                                                        key={level}
                                                        label={level}
                                                        size="small"
                                                        color={formik.values.accessType === level ? 'primary' : 'default'}
                                                    />
                                                ))}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card className="bg-gray-50">
                                        <CardContent className="text-center py-10">
                                            <Apps className="text-gray-400 text-5xl mb-4" />
                                            <Typography variant="subtitle1" color="textSecondary">
                                                Select a software to see details
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </MainLayout>
    );
};

export default RequestAccessPage;