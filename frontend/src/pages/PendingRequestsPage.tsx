// frontend/src/pages/PendingRequestsPage.tsx
import React, { useState, useEffect } from 'react';
import {
    Typography,
    Paper,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    LinearProgress,
    Alert,
    IconButton,
    Tooltip,
    TablePagination
} from '@mui/material';
import {
    Check,
    Close,
    Refresh,
    InfoOutlined,
    AccessTime
} from '@mui/icons-material';
import MainLayout from '../components/layouts/MainLayout';
import RequestService, { Request } from '../services/request.service';

const PendingRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Dialog state
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [dialogType, setDialogType] = useState<'approve' | 'reject'>('approve');
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [reviewComment, setReviewComment] = useState<string>('');
    const [actionLoading, setActionLoading] = useState<boolean>(false);

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Fetch pending requests
    const fetchPendingRequests = async () => {
        try {
            setLoading(true);
            setError(null);

            // Debugging
            console.log("Fetching pending requests...");

            const pendingRequests = await RequestService.getPendingRequests();
            console.log("Received requests:", pendingRequests);

            // Filter out any invalid requests that might cause issues
            const validRequests = pendingRequests.filter(req =>
                req && typeof req.id === 'number'
            );

            setRequests(validRequests);
        } catch (err: any) {
            console.error("Fetch pending requests error:", err);
            setError(err.response?.data?.message || 'Failed to load pending requests. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const handleOpenDialog = (request: Request, type: 'approve' | 'reject') => {
        setSelectedRequest(request);
        setDialogType(type);
        setReviewComment('');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedRequest(null);
        setReviewComment('');
    };

    const handleRequestAction = async () => {
        if (!selectedRequest) return;

        try {
            setActionLoading(true);

            await RequestService.updateRequestStatus(selectedRequest.id, {
                status: dialogType === 'approve' ? 'Approved' : 'Rejected',
                reviewComment
            });

            // Update local state by removing the approved/rejected request
            setRequests(requests.filter(r => r.id !== selectedRequest.id));

            setSuccess(
                `Request ${dialogType === 'approve' ? 'approved' : 'rejected'} successfully!`
            );

            // Close dialog
            handleCloseDialog();

            // Clear success message after 5 seconds
            setTimeout(() => {
                setSuccess(null);
            }, 5000);
        } catch (err: any) {
            console.error(`${dialogType} request error:`, err);
            setError(
                err.response?.data?.message ||
                `Failed to ${dialogType} request. Please try again.`
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchPendingRequests();
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Format date string safely
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'Unknown date';
        try {
            return new Date(dateString).toLocaleString();
        } catch (err) {
            return 'Invalid date';
        }
    };

    return (
        <MainLayout>
            <Box className="mb-6 flex justify-between items-center">
                <div>
                    <Typography variant="h4" className="mb-2">
                        Pending Access Requests
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Review and manage user access requests
                    </Typography>
                </div>

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={handleRefresh}
                    disabled={loading}
                >
                    Refresh
                </Button>
            </Box>

            {error && (
                <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" className="mb-4" onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            {loading ? (
                <Box className="text-center py-10">
                    <LinearProgress />
                    <Typography variant="body1" className="mt-4">
                        Loading pending requests...
                    </Typography>
                </Box>
            ) : (
                <Paper elevation={2}>
                    {requests.length === 0 ? (
                        <Box className="p-8 text-center">
                            <Typography variant="h6" color="textSecondary">
                                No pending requests found.
                            </Typography>
                            <Typography variant="body2" color="textSecondary" className="mt-2">
                                All access requests have been processed.
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead className="bg-gray-50">
                                        <TableRow>
                                            <TableCell>User</TableCell>
                                            <TableCell>Software</TableCell>
                                            <TableCell>Access Type</TableCell>
                                            <TableCell>Reason</TableCell>
                                            <TableCell>Requested On</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {requests
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((request) => (
                                                <TableRow key={request.id} hover>
                                                    <TableCell>
                                                        {/* Use conditional rendering with optional chaining */}
                                                        <Typography variant="body2" component="div" className="font-medium">
                                                            {request.user?.username || 'Unknown'}
                                                        </Typography>
                                                        <Typography variant="caption" component="div" className="text-gray-500">
                                                            {request.user?.role || ''}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        {request.software?.name || 'Unknown Software'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={request.accessType}
                                                            size="small"
                                                            color={
                                                                request.accessType === 'Admin'
                                                                    ? 'error'
                                                                    : request.accessType === 'Write'
                                                                        ? 'warning'
                                                                        : 'info'
                                                            }
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box className="flex items-center">
                                                            <Typography variant="body2" component="div" className="truncate max-w-xs">
                                                                {request.reason && request.reason.length > 30
                                                                    ? `${request.reason.substring(0, 30)}...`
                                                                    : request.reason || 'No reason provided'}
                                                            </Typography>
                                                            <Tooltip title={request.reason || 'No reason provided'}>
                                                                <IconButton size="small">
                                                                    <InfoOutlined fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box className="flex items-center text-gray-500">
                                                            <AccessTime fontSize="small" className="mr-1" />
                                                            <Typography variant="body2" component="span">
                                                                {formatDate(request.createdAt)}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box className="flex justify-end gap-2">
                                                            <Tooltip title="Approve">
                                                                <Button
                                                                    variant="contained"
                                                                    color="success"
                                                                    size="small"
                                                                    startIcon={<Check />}
                                                                    onClick={() => handleOpenDialog(request, 'approve')}
                                                                >
                                                                    Approve
                                                                </Button>
                                                            </Tooltip>
                                                            <Tooltip title="Reject">
                                                                <Button
                                                                    variant="outlined"
                                                                    color="error"
                                                                    size="small"
                                                                    startIcon={<Close />}
                                                                    onClick={() => handleOpenDialog(request, 'reject')}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={requests.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </>
                    )}
                </Paper>
            )}

            {/* Confirmation Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="request-dialog-title"
            >
                <DialogTitle id="request-dialog-title">
                    {dialogType === 'approve' ? 'Approve Request' : 'Reject Request'}
                </DialogTitle>
                <DialogContent>
                    {selectedRequest && (
                        <>
                            <DialogContentText className="mb-4">
                                {dialogType === 'approve'
                                    ? `Are you sure you want to approve ${selectedRequest.user?.username || 'Unknown'}'s request for ${selectedRequest.accessType} access to ${selectedRequest.software?.name || 'Unknown Software'}?`
                                    : `Are you sure you want to reject ${selectedRequest.user?.username || 'Unknown'}'s request for ${selectedRequest.accessType} access to ${selectedRequest.software?.name || 'Unknown Software'}?`}
                            </DialogContentText>

                            <TextField
                                autoFocus
                                margin="dense"
                                id="reviewComment"
                                label="Comment (optional)"
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={3}
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder={`Add an optional comment about why you're ${dialogType === 'approve' ? 'approving' : 'rejecting'} this request...`}
                                disabled={actionLoading}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    {actionLoading && <LinearProgress className="w-full absolute top-0 left-0" />}
                    <Button
                        onClick={handleCloseDialog}
                        color="inherit"
                        disabled={actionLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRequestAction}
                        color={dialogType === 'approve' ? 'success' : 'error'}
                        variant="contained"
                        disabled={actionLoading}
                        startIcon={dialogType === 'approve' ? <Check /> : <Close />}
                    >
                        {actionLoading
                            ? (dialogType === 'approve' ? 'Approving...' : 'Rejecting...')
                            : (dialogType === 'approve' ? 'Approve' : 'Reject')}
                    </Button>
                </DialogActions>
            </Dialog>
        </MainLayout>
    );
};

export default PendingRequestsPage;