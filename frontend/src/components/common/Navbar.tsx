// frontend/src/components/common/Navbar.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    Box,
    Avatar
} from '@mui/material';
import {
    AccountCircle,
    Menu as MenuIcon,
    Dashboard,
    Apps,
    Add,
    ExitToApp,
    Assignment,
    CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(null);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMobileAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
        navigate('/login');
    };

    const getInitials = (name: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const isAdmin = user?.role === 'Admin';
    const isManager = user?.role === 'Manager' || isAdmin;

    return (
        <AppBar position="static" className="bg-blue-700">
            <Toolbar>
                <Typography variant="h6" component={Link} to="/dashboard" className="text-white no-underline flex-grow">
                    User Access Management
                </Typography>

                {/* Desktop menu */}
                <Box className="hidden md:flex items-center">
                    <Button
                        color="inherit"
                        component={Link}
                        to="/dashboard"
                        startIcon={<Dashboard />}
                        className="mx-1"
                    >
                        Dashboard
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/request-access"
                        startIcon={<Assignment />}
                        className="mx-1"
                    >
                        Request Access
                    </Button>

                    {isManager && (
                        <Button
                            color="inherit"
                            component={Link}
                            to="/pending-requests"
                            startIcon={<CheckCircle />}
                            className="mx-1"
                        >
                            Pending Requests
                        </Button>
                    )}

                    {isAdmin && (
                        <Button
                            color="inherit"
                            component={Link}
                            to="/create-software"
                            startIcon={<Add />}
                            className="mx-1"
                        >
                            Add Software
                        </Button>
                    )}

                    <IconButton
                        edge="end"
                        aria-label="account of current user"
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                        className="ml-2"
                    >
                        <Avatar className="w-8 h-8 bg-blue-500">
                            {user?.fullName ? getInitials(user.fullName) : <AccountCircle />}
                        </Avatar>
                    </IconButton>
                </Box>

                {/* Mobile menu icon */}
                <IconButton
                    edge="end"
                    className="md:hidden text-white"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMobileMenuOpen}
                >
                    <MenuIcon />
                </IconButton>

                {/* Profile dropdown menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    keepMounted
                >
                    <MenuItem disabled>
                        <Typography variant="body1" className="font-semibold">
                            {user?.username}
                        </Typography>
                    </MenuItem>
                    <MenuItem disabled>
                        <Typography variant="body2" className="text-gray-500">
                            Role: {user?.role}
                        </Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                        <ExitToApp className="mr-2" />
                        Logout
                    </MenuItem>
                </Menu>

                {/* Mobile menu */}
                <Menu
                    anchorEl={mobileAnchorEl}
                    open={Boolean(mobileAnchorEl)}
                    onClose={handleMenuClose}
                    keepMounted
                >
                    <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>
                        <Dashboard className="mr-2" /> Dashboard
                    </MenuItem>

                    <MenuItem component={Link} to="/request-access" onClick={handleMenuClose}>
                        <Assignment className="mr-2" /> Request Access
                    </MenuItem>

                    {isManager && (
                        <MenuItem component={Link} to="/pending-requests" onClick={handleMenuClose}>
                            <CheckCircle className="mr-2" /> Pending Requests
                        </MenuItem>
                    )}

                    {isAdmin && (
                        <MenuItem component={Link} to="/create-software" onClick={handleMenuClose}>
                            <Add className="mr-2" /> Add Software
                        </MenuItem>
                    )}

                    <Divider />

                    <MenuItem disabled>
                        <Typography variant="body2" className="text-gray-500">
                            {user?.username} ({user?.role})
                        </Typography>
                    </MenuItem>

                    <MenuItem onClick={handleLogout}>
                        <ExitToApp className="mr-2" /> Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;