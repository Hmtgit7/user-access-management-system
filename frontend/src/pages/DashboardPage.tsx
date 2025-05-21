// frontend/src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  LinearProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Cancel,
  Pending,
  Apps,
  AccessTime,
  Add
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import RequestService, { Request } from '../services/request.service';
import SoftwareService, { Software } from '../services/software.service';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [software, setSoftware] = useState<Software[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === 'Admin';
  const isManager = user?.role === 'Manager' || isAdmin;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user requests
        const userRequests = await RequestService.getUserRequests();
        setRequests(userRequests);

        // Fetch software list
        const softwareList = await SoftwareService.getAllSoftware();
        setSoftware(softwareList);
      } catch (err: any) {
        setError('Failed to load dashboard data. Please try again.');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Request status counts
  const pendingCount = requests.filter(req => req.status === 'Pending').length;
  const approvedCount = requests.filter(req => req.status === 'Approved').length;
  const rejectedCount = requests.filter(req => req.status === 'Rejected').length;

  return (
    <MainLayout>
      <Box className="mb-6">
        <Typography variant="h4" className="mb-2">
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Welcome back, {user?.fullName || user?.username}!
        </Typography>
      </Box>

      {loading ? (
        <LinearProgress className="my-4" />
      ) : error ? (
        <Box className="my-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Status Summary Cards */}
          <Grid item xs={12}>
            <Typography variant="h6" className="mb-3">
              Your Access Requests
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Card className="bg-blue-50 h-full">
                  <CardContent className="flex flex-col items-center p-6">
                    <Pending className="text-blue-600 text-4xl mb-2" />
                    <Typography variant="h5" className="font-bold text-blue-800">
                      {pendingCount}
                    </Typography>
                    <Typography variant="body1" className="text-blue-700">
                      Pending Requests
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card className="bg-green-50 h-full">
                  <CardContent className="flex flex-col items-center p-6">
                    <CheckCircle className="text-green-600 text-4xl mb-2" />
                    <Typography variant="h5" className="font-bold text-green-800">
                      {approvedCount}
                    </Typography>
                    <Typography variant="body1" className="text-green-700">
                      Approved Requests
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card className="bg-red-50 h-full">
                  <CardContent className="flex flex-col items-center p-6">
                    <Cancel className="text-red-600 text-4xl mb-2" />
                    <Typography variant="h5" className="font-bold text-red-800">
                      {rejectedCount}
                    </Typography>
                    <Typography variant="body1" className="text-red-700">
                      Rejected Requests
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Recent Requests */}
          <Grid item xs={12} md={6}>
            <Card className="h-full">
              <CardContent>
                <Box className="flex justify-between items-center mb-4">
                  <Typography variant="h6">
                    Recent Requests
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    component={Link}
                    to="/request-access"
                    startIcon={<Assignment />}
                  >
                    New Request
                  </Button>
                </Box>

                {requests.length === 0 ? (
                  <Typography variant="body2" className="text-gray-500 text-center py-8">
                    You haven't made any access requests yet.
                  </Typography>
                ) : (
                  <List>
                    {requests.slice(0, 5).map((request, index) => (
                      <React.Fragment key={request.id}>
                        {index > 0 && <Divider component="li" />}
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={
                              <Box className="flex items-center justify-between">
                                <span>{request.software.name}</span>
                                <Chip
                                  size="small"
                                  label={request.status}
                                  color={
                                    request.status === 'Approved'
                                      ? 'success'
                                      : request.status === 'Rejected'
                                        ? 'error'
                                        : 'primary'
                                  }
                                  variant="outlined"
                                />
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  className="block"
                                >
                                  Access Level: {request.accessType}
                                </Typography>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  className="flex items-center text-gray-500 mt-1"
                                >
                                  <AccessTime fontSize="small" className="mr-1" />
                                  {new Date(request.createdAt).toLocaleDateString()}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Available Software */}
          <Grid item xs={12} md={6}>
            <Card className="h-full">
              <CardContent>
                <Box className="flex justify-between items-center mb-4">
                  <Typography variant="h6">
                    Available Software
                  </Typography>
                  {isAdmin && (
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to="/create-software"
                      startIcon={<Add />}
                    >
                      Add Software
                    </Button>
                  )}
                </Box>

                {software.length === 0 ? (
                  <Typography variant="body2" className="text-gray-500 text-center py-8">
                    No software available in the system.
                  </Typography>
                ) : (
                  <List>
                    {software.slice(0, 5).map((sw, index) => (
                      <React.Fragment key={sw.id}>
                        {index > 0 && <Divider component="li" />}
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={
                              <Box className="flex items-center">
                                <Apps className="mr-2 text-blue-600" />
                                <span>{sw.name}</span>
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  className="block line-clamp-2"
                                >
                                  {sw.description}
                                </Typography>
                                <Box className="mt-1">
                                  {sw.accessLevels.map(level => (
                                    <Chip
                                      key={level}
                                      size="small"
                                      label={level}
                                      className="mr-1 mt-1"
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              </>
                            }
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                )}

                {software.length > 5 && (
                  <Box className="text-center mt-2">
                    <Button
                      variant="text"
                      size="small"
                      component={Link}
                      to="/request-access"
                    >
                      View All
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Box className="bg-gray-50 rounded-lg p-4">
              <Typography variant="h6" className="mb-3">
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    component={Link}
                    to="/request-access"
                    className="py-3 bg-blue-600 hover:bg-blue-700"
                    startIcon={<Assignment />}
                  >
                    New Access Request
                  </Button>
                </Grid>

                {isManager && (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Button
                      variant="contained"
                      fullWidth
                      component={Link}
                      to="/pending-requests"
                      className="py-3 bg-green-600 hover:bg-green-700"
                      startIcon={<CheckCircle />}
                    >
                      Review Requests
                    </Button>
                  </Grid>
                )}

                {isAdmin && (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Button
                      variant="contained"
                      fullWidth
                      component={Link}
                      to="/create-software"
                      className="py-3 bg-purple-600 hover:bg-purple-700"
                      startIcon={<Add />}
                    >
                      Add New Software
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      )}
    </MainLayout>
  );
};

export default DashboardPage;