import { Request, Response } from "express";
import { prisma } from "../helpers/prisma";
import { getUserId } from "../utils/getUserId";

// Create a new SoilModel entry
export const createSoilModel = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const {
      temperature,
      phLevel,
      soilColor,
      rainfall,
      nitrogen,
      phosphorous,
      potassium,
      cropType,
      diseaseDetected,
      imageUrl,
      recommendedFertilizer,
      treatmentSuggestion,
    } = req.body;

    if (
      temperature === undefined ||
      phLevel === undefined ||
      !soilColor ||
      rainfall === undefined ||
      nitrogen === undefined ||
      phosphorous === undefined ||
      potassium === undefined ||
      !cropType ||
      !diseaseDetected ||
      !imageUrl ||
      !recommendedFertilizer ||
      !treatmentSuggestion
    ) {
      return res.status(400).json({
        success: false,
        message:
          "temperature, phLevel, soilColor, rainfall, nitrogen, phosphorous, potassium, cropType, diseaseDetected, imageUrl, recommendedFertilizer, treatmentSuggestion are required",
      });
    }

    const record = await prisma.soilAndImageModel.create({
      data: {
        temperature: parseFloat(temperature),
        phLevel: parseFloat(phLevel),
        soilColor,
        rainfall: parseFloat(rainfall),
        nitrogen: parseFloat(nitrogen),
        phosphorous: parseFloat(phosphorous),
        potassium: parseFloat(potassium),
        cropType,
        diseaseDetected,
        imageUrl,
        recommendedFertilizer,
        treatmentSuggestion,
        user: { connect: { id: userId } },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Soil model saved successfully",
      data: record,
    });
  } catch (error) {
    console.error("Error creating soil model:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get paginated SoilModel entries for the authenticated user
export const getUserSoilModels = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const items = await prisma.soilAndImageModel.findMany({
      where: { userId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limitNum,
    });

    const total = await prisma.soilAndImageModel.count({ where: { userId } });

    return res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching soil models:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get a single SoilModel by id (must belong to user)
export const getSoilModelById = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const item = await prisma.soilAndImageModel.findFirst({
      where: { id, userId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Soil model not found" });
    }

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error("Error fetching soil model:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update a SoilModel (selected fields)
export const updateSoilModel = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const {
      diseaseDetected,
      imageUrl,
      recommendedFertilizer,
      treatmentSuggestion,
    } = req.body;

    const exists = await prisma.soilAndImageModel.findFirst({ where: { id, userId } });
    if (!exists) {
      return res
        .status(404)
        .json({ success: false, message: "Soil model not found" });
    }

    const updated = await prisma.soilAndImageModel.update({
      where: { id },
      data: {
        diseaseDetected:
          diseaseDetected !== undefined ? diseaseDetected : exists.diseaseDetected,
        imageUrl: imageUrl !== undefined ? imageUrl : exists.imageUrl,
        recommendedFertilizer:
          recommendedFertilizer !== undefined
            ? recommendedFertilizer
            : exists.recommendedFertilizer,
        treatmentSuggestion:
          treatmentSuggestion !== undefined
            ? treatmentSuggestion
            : exists.treatmentSuggestion,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return res.status(200).json({
      success: true,
      message: "Soil model updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating soil model:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete a SoilModel
export const deleteSoilModel = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const exists = await prisma.soilAndImageModel.findFirst({ where: { id, userId } });
    if (!exists) {
      return res
        .status(404)
        .json({ success: false, message: "Soil model not found" });
    }

    await prisma.soilAndImageModel.delete({ where: { id } });
    return res
      .status(200)
      .json({ success: true, message: "Soil model deleted successfully" });
  } catch (error) {
    console.error("Error deleting soil model:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


