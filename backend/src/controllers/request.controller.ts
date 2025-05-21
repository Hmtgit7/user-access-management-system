// src/controllers/request.controller.ts
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Request as AccessRequest } from "../entities/Request";
import { Software } from "../entities/Software";
import { User } from "../entities/User";

export const createRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { softwareId, accessType, reason } = req.body;
    const userId = req.user?.userId;

    if (!softwareId || !accessType || !reason) {
      res
        .status(400)
        .json({ message: "Software ID, access type, and reason are required" });
      return;
    }

    // Validate access type
    const validAccessTypes = ["Read", "Write", "Admin"];
    if (!validAccessTypes.includes(accessType)) {
      res
        .status(400)
        .json({ message: "Access type must be one of: Read, Write, Admin" });
      return;
    }

    const softwareRepository = getRepository(Software);
    const userRepository = getRepository(User);
    const requestRepository = getRepository(AccessRequest);

    // Convert softwareId to number if it's a string
    const softwareIdNum =
      typeof softwareId === "string" ? parseInt(softwareId, 10) : softwareId;

    // Check if software exists
    const software = await softwareRepository.findOne({
      where: { id: softwareIdNum },
    });
    if (!software) {
      res.status(404).json({ message: "Software not found" });
      return;
    }

    // Check if software supports requested access level
    if (!software.accessLevels.includes(accessType)) {
      res.status(400).json({
        message: `Software does not support ${accessType} access level`,
      });
      return;
    }

    // Check if user exists
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check for existing pending request
    const existingRequest = await requestRepository.findOne({
      where: {
        userId: userId,
        softwareId: softwareIdNum,
        accessType: accessType,
        status: "Pending",
      },
    });

    if (existingRequest) {
      res.status(409).json({ message: "A similar request is already pending" });
      return;
    }

    // Create new request
    const newRequest = requestRepository.create({
      userId,
      softwareId: softwareIdNum,
      accessType,
      reason,
      status: "Pending",
    });

    await requestRepository.save(newRequest);

    res.status(201).json({
      message: "Request submitted successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Create request error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const requestRepository = getRepository(AccessRequest);

    const requests = await requestRepository.find({
      where: { userId },
      relations: ["software"],
    });

    res.status(200).json({ requests });
  } catch (error) {
    console.error("Get user requests error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPendingRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check if user is authorized (must be Manager or Admin)
    const userRole = req.user?.role;
    if (!userRole || !["Manager", "Admin"].includes(userRole)) {
      res
        .status(403)
        .json({
          message: "You don't have permission to view pending requests",
        });
      return;
    }

    const requestRepository = getRepository(AccessRequest);

    // Get all pending requests with their relations
    const requests = await requestRepository.find({
      where: { status: "Pending" },
      relations: ["software", "user"],
    });

    // Remove sensitive information from user objects
    const sanitizedRequests = requests.map((request) => {
      // Make sure user exists before trying to destructure it
      if (!request.user) {
        return {
          ...request,
          user: {
            id: null,
            username: "Unknown User",
            fullName: "",
            email: "",
            role: "",
          },
        };
      }

      // Make sure software exists before referencing it
      if (!request.software) {
        return {
          ...request,
          user: {
            id: request.user.id,
            username: request.user.username,
            fullName: request.user.fullName || "",
            email: request.user.email || "",
            role: request.user.role,
          },
          software: {
            id: null,
            name: "Unknown Software",
            description: "",
            accessLevels: [],
          },
        };
      }

      // Normal case when both user and software exist
      return {
        ...request,
        user: {
          id: request.user.id,
          username: request.user.username,
          fullName: request.user.fullName || "",
          email: request.user.email || "",
          role: request.user.role,
        },
      };
    });

    res.status(200).json({ requests: sanitizedRequests });
  } catch (error) {
    console.error("Get pending requests error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRequestById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const requestRepository = getRepository(AccessRequest);

    // Check if id is a valid number
    const requestId = parseInt(id);
    if (isNaN(requestId)) {
      res.status(400).json({ message: "Invalid request ID format" });
      return;
    }

    const request = await requestRepository.findOne({
      where: { id: requestId },
      relations: ["software", "user"],
    });

    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    // Check if user is authorized to view this request
    const currentUserId = req.user?.userId;
    const currentUserRole = req.user?.role;

    // Add null check for currentUserRole
    if (
      request.userId !== currentUserId &&
      currentUserRole &&
      !["Manager", "Admin"].includes(currentUserRole)
    ) {
      res.status(403).json({ message: "Unauthorized to view this request" });
      return;
    }

    // Handle possible null or undefined user
    if (!request.user) {
      res.status(500).json({ message: "Request data is incomplete" });
      return;
    }

    // Remove sensitive information from user object
    const sanitizedRequest = {
      ...request,
      user: {
        id: request.user.id,
        username: request.user.username,
        fullName: request.user.fullName || "",
        email: request.user.email || "",
        role: request.user.role,
      },
    };

    res.status(200).json({ request: sanitizedRequest });
  } catch (error) {
    console.error("Get request by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRequestStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, reviewComment } = req.body;
    const reviewerId = req.user?.userId;

    if (!status || !["Approved", "Rejected"].includes(status)) {
      res
        .status(400)
        .json({ message: "Valid status (Approved/Rejected) is required" });
      return;
    }

    const requestRepository = getRepository(AccessRequest);

    // Find request
    const request = await requestRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["software", "user"],
    });

    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    if (request.status !== "Pending") {
      res.status(400).json({ message: "Request has already been processed" });
      return;
    }

    // Handle possible null or undefined user or software
    if (!request.user || !request.software) {
      res.status(500).json({ message: "Request data is incomplete" });
      return;
    }

    // Update request
    request.status = status;
    // Use null for reviewerId if it's undefined
    request.reviewedBy = reviewerId || null;
    request.reviewComment = reviewComment || null;
    request.updatedAt = new Date();

    await requestRepository.save(request);

    res.status(200).json({
      message: `Request ${status.toLowerCase()} successfully`,
      request: {
        id: request.id,
        status: request.status,
        accessType: request.accessType,
        software: request.software,
        user: {
          id: request.user.id,
          username: request.user.username,
        },
        reason: request.reason,
        reviewComment: request.reviewComment,
        updatedAt: request.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update request status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
