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

    // Check if software exists
    const software = await softwareRepository.findOne({
      where: { id: softwareId },
    });
    if (!software) {
      res.status(404).json({ message: "Software not found" });
      return;
    }

    // Check if software supports requested access level
    if (!software.accessLevels.includes(accessType)) {
      res
        .status(400)
        .json({
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
        softwareId: softwareId,
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
      softwareId,
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

    const request = await requestRepository.findOne({
      where: { id: parseInt(id) },
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
