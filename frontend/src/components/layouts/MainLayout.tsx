// frontend/src/components/layouts/MainLayout.tsx
import React from 'react';
import { Container, Box } from '@mui/material';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer'; // This will be our simplified footer

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <Container
                maxWidth="lg"
                className="py-6 flex-grow"
            >
                <Box
                    className="bg-white rounded-lg shadow-md p-6"
                >
                    {children}
                </Box>
            </Container>
            <Footer />
        </div>
    );
};

export default MainLayout;