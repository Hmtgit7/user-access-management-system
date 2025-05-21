// backend/src/controllers/request.controller.ts
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Request as AccessRequest } from "../entities/Request";
import { Software } from "../entities/Software";
import { User } from "../entities/User";

export const createRequest = async (req: Request, res: Response) => {
  try {
    const { softwareId, accessType, reason } = req.body;
    const userId = req.user?.userId;

    if (!softwareId || !accessType || !reason) {
      return res
        .status(400)
        .json({ message: "Software ID, access type, and reason are required" });
    }

    // Validate access type
    const validAccessTypes = ["Read", "Write", "Admin"];
    if (!validAccessTypes.includes(accessType)) {
      return res
        .status(400)
        .json({ message: "Access type must be one of: Read, Write, Admin" });
    }

    const softwareRepository = getRepository(Software);
    const userRepository = getRepository(User);
    const requestRepository = getRepository(AccessRequest);

    // Check if software exists
    const software = await softwareRepository.findOne({
      where: { id: softwareId },
    });
    if (!software) {
      return res.status(404).json({ message: "Software not found" });
    }

    // Check if software supports requested access level
    if (!software.accessLevels.includes(accessType)) {
      return res
        .status(400)
        .json({
          message: `Software does not support ${accessType} access level`,
        });
    }

    // Check if user exists
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for existing pending request
    const existingRequest = await requestRepository.findOne({
      where: {
        userId: userId,
        softwareId: softwareId,
        accessType: accessType,
        status: "Pending",
      },
    });

    if (existingRequest) {
      return res
        .status(409)
        .json({ message: "A similar request is already pending" });
    }

    // Create new request
    const newRequest = requestRepository.create({
      userId,
      softwareId,
      accessType,
      reason,
      status: "Pending",
    });

    await requestRepository.save(newRequest);

    return res.status(201).json({
      message: "Request submitted successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Create request error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const requestRepository = getRepository(AccessRequest);

    const requests = await requestRepository.find({
      where: { userId },
      relations: ["software"],
    });

    return res.status(200).json({ requests });
  } catch (error) {
    console.error("Get user requests error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPendingRequests = async (req: Request, res: Response) => {
  try {
    const requestRepository = getRepository(AccessRequest);

    const requests = await requestRepository.find({
      where: { status: "Pending" },
      relations: ["software", "user"],
    });

    // Remove sensitive information from user objects
    const sanitizedRequests = requests.map((request) => {
      const { user, ...rest } = request;
      return {
        ...rest,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      };
    });

    return res.status(200).json({ requests: sanitizedRequests });
  } catch (error) {
    console.error("Get pending requests error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestRepository = getRepository(AccessRequest);

    const request = await requestRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["software", "user"],
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Check if user is authorized to view this request
    const currentUserId = req.user?.userId;
    const currentUserRole = req.user?.role;

    if (
      request.userId !== currentUserId &&
      !["Manager", "Admin"].includes(currentUserRole)
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to view this request" });
    }

    // Remove sensitive information from user object
    const { user, ...rest } = request;
    const sanitizedRequest = {
      ...rest,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };

    return res.status(200).json({ request: sanitizedRequest });
  } catch (error) {
    console.error("Get request by ID error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reviewComment } = req.body;
    const reviewerId = req.user?.userId;

    if (!status || !["Approved", "Rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Valid status (Approved/Rejected) is required" });
    }

    const requestRepository = getRepository(AccessRequest);

    // Find request
    const request = await requestRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["software", "user"],
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Request has already been processed" });
    }

    // Update request
    request.status = status;
    request.reviewedBy = reviewerId;
    request.reviewComment = reviewComment || null;
    request.updatedAt = new Date();

    await requestRepository.save(request);

    return res.status(200).json({
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
    return res.status(500).json({ message: "Internal server error" });
  }
};
