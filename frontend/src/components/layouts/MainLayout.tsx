// frontend/src/components/layouts/MainLayout.tsx
import React from 'react';
import { Container, Box } from '@mui/material';
import Navbar from '../common/Navbar';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <Container maxWidth="lg" className="py-8">
                <Box className="bg-white rounded-lg shadow-md p-6">
                    {children}
                </Box>
            </Container>
        </div>
    );
};

export default MainLayout;