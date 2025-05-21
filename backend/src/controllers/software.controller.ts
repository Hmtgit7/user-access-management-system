// backend/src/controllers/software.controller.ts
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Software } from "../entities/Software";

export const getAllSoftware = async (req: Request, res: Response) => {
  try {
    const softwareRepository = getRepository(Software);
    const softwareList = await softwareRepository.find();

    return res.status(200).json({ software: softwareList });
  } catch (error) {
    console.error("Get all software error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSoftwareById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const softwareRepository = getRepository(Software);

    const software = await softwareRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!software) {
      return res.status(404).json({ message: "Software not found" });
    }

    return res.status(200).json({ software });
  } catch (error) {
    console.error("Get software by id error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createSoftware = async (req: Request, res: Response) => {
  try {
    const { name, description, accessLevels } = req.body;

    if (
      !name ||
      !description ||
      !accessLevels ||
      !Array.isArray(accessLevels)
    ) {
      return res
        .status(400)
        .json({ message: "Name, description, and accessLevels are required" });
    }

    // Validate access levels
    const validAccessLevels = ["Read", "Write", "Admin"];
    const isValidAccessLevels = accessLevels.every((level) =>
      validAccessLevels.includes(level)
    );

    if (!isValidAccessLevels) {
      return res
        .status(400)
        .json({ message: "Access levels must be one of: Read, Write, Admin" });
    }

    const softwareRepository = getRepository(Software);

    // Check if software with the same name already exists
    const existingSoftware = await softwareRepository.findOne({
      where: { name },
    });
    if (existingSoftware) {
      return res
        .status(409)
        .json({ message: "Software with this name already exists" });
    }

    // Create new software
    const newSoftware = softwareRepository.create({
      name,
      description,
      accessLevels,
    });

    await softwareRepository.save(newSoftware);

    return res.status(201).json({
      message: "Software created successfully",
      software: newSoftware,
    });
  } catch (error) {
    console.error("Create software error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSoftware = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, accessLevels } = req.body;

    const softwareRepository = getRepository(Software);

    // Find software
    const software = await softwareRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!software) {
      return res.status(404).json({ message: "Software not found" });
    }

    // Update software properties
    if (name) software.name = name;
    if (description) software.description = description;
    if (accessLevels && Array.isArray(accessLevels)) {
      // Validate access levels
      const validAccessLevels = ["Read", "Write", "Admin"];
      const isValidAccessLevels = accessLevels.every((level) =>
        validAccessLevels.includes(level)
      );

      if (!isValidAccessLevels) {
        return res
          .status(400)
          .json({
            message: "Access levels must be one of: Read, Write, Admin",
          });
      }

      software.accessLevels = accessLevels;
    }

    await softwareRepository.save(software);

    return res.status(200).json({
      message: "Software updated successfully",
      software,
    });
  } catch (error) {
    console.error("Update software error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSoftware = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const softwareRepository = getRepository(Software);

    // Find software
    const software = await softwareRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!software) {
      return res.status(404).json({ message: "Software not found" });
    }

    await softwareRepository.remove(software);

    return res.status(200).json({ message: "Software deleted successfully" });
  } catch (error) {
    console.error("Delete software error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
