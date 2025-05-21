// frontend/src/services/request.service.ts
import api from "./api";
import { Software } from "./software.service";
import { User } from "./auth.service";

export interface Request {
  id: number;
  software: Software;
  softwareId: number;
  user: User;
  userId: number;
  accessType: "Read" | "Write" | "Admin";
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  updatedAt: string | null;
  reviewedBy: number | null;
  reviewComment: string | null;
}

export interface CreateRequestData {
  softwareId: number;
  accessType: "Read" | "Write" | "Admin";
  reason: string;
}

export interface UpdateRequestStatusData {
  status: "Approved" | "Rejected";
  reviewComment?: string;
}

const RequestService = {
  createRequest: async (data: CreateRequestData): Promise<Request> => {
    try {
      const response = await api.post<{ request: Request; message: string }>(
        "/requests",
        data
      );
      return response.data.request;
    } catch (error) {
      console.error("Create request error:", error);
      throw error;
    }
  },

  getUserRequests: async (): Promise<Request[]> => {
    try {
      const response = await api.get<{ requests: Request[] }>(
        "/requests/my-requests"
      );
      return response.data.requests;
    } catch (error) {
      console.error("Get user requests error:", error);
      throw error;
    }
  },

  getPendingRequests: async (): Promise<Request[]> => {
    try {
      const response = await api.get<{ requests: Request[] }>(
        "/requests/pending"
      );
      return response.data.requests;
    } catch (error) {
      console.error("Get pending requests error:", error);
      throw error;
    }
  },

  getRequestById: async (id: number): Promise<Request> => {
    try {
      const response = await api.get<{ request: Request }>(`/requests/${id}`);
      return response.data.request;
    } catch (error) {
      console.error("Get request by ID error:", error);
      throw error;
    }
  },

  updateRequestStatus: async (
    id: number,
    data: UpdateRequestStatusData
  ): Promise<Request> => {
    try {
      const response = await api.patch<{ request: Request; message: string }>(
        `/requests/${id}/status`,
        data
      );
      return response.data.request;
    } catch (error) {
      console.error("Update request status error:", error);
      throw error;
    }
  },
};

export default RequestService;
