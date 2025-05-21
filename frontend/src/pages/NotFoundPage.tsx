// frontend/src/pages/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';

const NotFoundPage: React.FC = () => {
    return (
        <Box
            className="min-h-screen flex items-center justify-center bg-gray-100 p-4"
        >
            <Paper elevation={3} className="p-8 max-w-md w-full">
                <Box className="text-center">
                    <Typography variant="h1" className="text-9xl font-bold text-blue-600 mb-4">
                        404
                    </Typography>

                    <Typography variant="h4" className="mb-4">
                        Page Not Found
                    </Typography>

                    <Typography variant="body1" color="textSecondary" className="mb-8">
                        The page you are looking for might have been removed, had its name changed,
                        or is temporarily unavailable.
                    </Typography>

                    <Box className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/dashboard"
                            startIcon={<Home />}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Go to Dashboard
                        </Button>

                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => window.history.back()}
                            startIcon={<ArrowBack />}
                        >
                            Go Back
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default NotFoundPage;