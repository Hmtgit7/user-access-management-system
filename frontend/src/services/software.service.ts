// frontend/src/services/software.service.ts
import api from "./api";

export interface Software {
  id: number;
  name: string;
  description: string;
  accessLevels: string[];
  createdAt: string;
}

export interface CreateSoftwareData {
  name: string;
  description: string;
  accessLevels: string[];
}

const SoftwareService = {
  getAllSoftware: async (): Promise<Software[]> => {
    const response = await api.get<{ software: Software[] }>("/software");
    return response.data.software;
  },

  getSoftwareById: async (id: number): Promise<Software> => {
    const response = await api.get<{ software: Software }>(`/software/${id}`);
    return response.data.software;
  },

  createSoftware: async (data: CreateSoftwareData): Promise<Software> => {
    const response = await api.post<{ software: Software; message: string }>(
      "/software",
      data
    );
    return response.data.software;
  },

  updateSoftware: async (
    id: number,
    data: Partial<CreateSoftwareData>
  ): Promise<Software> => {
    const response = await api.put<{ software: Software; message: string }>(
      `/software/${id}`,
      data
    );
    return response.data.software;
  },

  deleteSoftware: async (id: number): Promise<void> => {
    await api.delete(`/software/${id}`);
  },
};

export default SoftwareService;
