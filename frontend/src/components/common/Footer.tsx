// frontend/src/components/common/Footer.tsx
import React from 'react';
import { Box, Container, Typography, Link, Divider, IconButton } from '@mui/material';
import { GitHub, LinkedIn, Twitter, Email } from '@mui/icons-material';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                py: 3,
                mt: 'auto'
            }}
        >
            <Container maxWidth="lg">
                {/* Simple three-column layout using flexbox and div elements */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                    {/* Column 1: About */}
                    <div style={{ flex: '1 1 300px' }}>
                        <Typography variant="h6" gutterBottom>
                            User Access Management
                        </Typography>
                        <Typography variant="body2" paragraph>
                            A secure platform for managing user access requests to enterprise software applications.
                        </Typography>
                        <div>
                            <IconButton color="inherit" aria-label="GitHub" component={Link} href="https://github.com/Hmtgit7" target="_blank">
                                <GitHub />
                            </IconButton>
                            <IconButton color="inherit" aria-label="LinkedIn" component={Link} href="https://linkedin.com/in/hemant-gehlod" target="_blank">
                                <LinkedIn />
                            </IconButton>
                            <IconButton color="inherit" aria-label="Twitter" component={Link} href="https://twitter.com" target="_blank">
                                <Twitter />
                            </IconButton>
                            <IconButton color="inherit" aria-label="Email" component={Link} href="mailto:hmtloharcoding3579@gmail.com">
                                <Email />
                            </IconButton>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div style={{ flex: '1 1 200px' }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Links
                        </Typography>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <Link href="/dashboard" color="inherit" underline="hover">
                                    Dashboard
                                </Link>
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <Link href="/request-access" color="inherit" underline="hover">
                                    Request Access
                                </Link>
                            </li>
                            {/* <li style={{ marginBottom: '0.5rem' }}>
                                <Link href="/pending-requests" color="inherit" underline="hover">
                                    Pending Requests
                                </Link>
                            </li> */}
                            {/* <li style={{ marginBottom: '0.5rem' }}>
                                <Link href="https://example.com/help" color="inherit" underline="hover" target="_blank">
                                    Help & Support
                                </Link>
                            </li> */}
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div style={{ flex: '1 1 200px' }}>
                        <Typography variant="h6" gutterBottom>
                            Contact Us
                        </Typography>
                        <Typography variant="body2" paragraph sx={{ mb: 0.5 }}>
                            {/* 123 Business Avenue<br />
                            Tech Park, Suite 456<br /> */}
                            Bangalore, Karnataka 560001
                        </Typography>
                        <Typography variant="body2">
                            <strong>Phone:</strong> +91 123 456 7890<br />
                            <strong>Email:</strong> support@accessmanagement.com
                        </Typography>
                    </div>
                </div>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 3 }} />

                {/* Copyright and Legal Links */}
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <Typography variant="body2">
                        © {currentYear} User Access Management System. All rights reserved.
                    </Typography>
                    <div>
                        <Link href="/privacy" color="inherit" sx={{ mr: 2 }} underline="hover">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" color="inherit" underline="hover">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </Container>
        </Box>
    );
};

export default Footer;