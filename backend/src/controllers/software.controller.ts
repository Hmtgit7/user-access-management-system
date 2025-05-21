// src/controllers/software.controller.ts
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Software } from "../entities/Software";

export const getAllSoftware = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const softwareRepository = getRepository(Software);
    const softwareList = await softwareRepository.find();

    res.status(200).json({ software: softwareList });
  } catch (error) {
    console.error("Get all software error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSoftwareById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const softwareRepository = getRepository(Software);

    const software = await softwareRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!software) {
      res.status(404).json({ message: "Software not found" });
      return;
    }

    res.status(200).json({ software });
  } catch (error) {
    console.error("Get software by id error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createSoftware = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, accessLevels } = req.body;

    if (
      !name ||
      !description ||
      !accessLevels ||
      !Array.isArray(accessLevels)
    ) {
      res
        .status(400)
        .json({ message: "Name, description, and accessLevels are required" });
      return;
    }

    // Validate access levels
    const validAccessLevels = ["Read", "Write", "Admin"];
    const isValidAccessLevels = accessLevels.every((level) =>
      validAccessLevels.includes(level)
    );

    if (!isValidAccessLevels) {
      res
        .status(400)
        .json({ message: "Access levels must be one of: Read, Write, Admin" });
      return;
    }

    const softwareRepository = getRepository(Software);

    // Check if software with the same name already exists
    const existingSoftware = await softwareRepository.findOne({
      where: { name },
    });
    if (existingSoftware) {
      res
        .status(409)
        .json({ message: "Software with this name already exists" });
      return;
    }

    // Create new software
    const newSoftware = softwareRepository.create({
      name,
      description,
      accessLevels,
    });

    await softwareRepository.save(newSoftware);

    res.status(201).json({
      message: "Software created successfully",
      software: newSoftware,
    });
  } catch (error) {
    console.error("Create software error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSoftware = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, accessLevels } = req.body;

    const softwareRepository = getRepository(Software);

    // Find software
    const software = await softwareRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!software) {
      res.status(404).json({ message: "Software not found" });
      return;
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
        res.status(400).json({
          message: "Access levels must be one of: Read, Write, Admin",
        });
        return;
      }

      software.accessLevels = accessLevels;
    }

    await softwareRepository.save(software);

    res.status(200).json({
      message: "Software updated successfully",
      software,
    });
  } catch (error) {
    console.error("Update software error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSoftware = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const softwareRepository = getRepository(Software);

    // Find software
    const software = await softwareRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!software) {
      res.status(404).json({ message: "Software not found" });
      return;
    }

    await softwareRepository.remove(software);

    res.status(200).json({ message: "Software deleted successfully" });
  } catch (error) {
    console.error("Delete software error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
