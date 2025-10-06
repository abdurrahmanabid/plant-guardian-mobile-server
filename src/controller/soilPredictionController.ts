import { Request, Response } from "express";
import { prisma } from "../helpers/prisma";
import { getUserId } from "../utils/getUserId";

// Create a new soil prediction entry
export const createSoilPrediction = async (req: Request, res: Response) => {
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
      predictedFertilizer,
      predictedTreatment,
      confidence,
    } = req.body;
    console.log('req.body in soilPredictionController', req.body);

    if (
      temperature === undefined ||
      phLevel === undefined ||
      !soilColor ||
      rainfall === undefined ||
      nitrogen === undefined ||
      phosphorous === undefined ||
      potassium === undefined ||
      !cropType ||
      !predictedFertilizer
    ) {
      return res.status(400).json({
        success: false,
        message:
          "temperature, phLevel, soilColor, rainfall, nitrogen, phosphorous, potassium, cropType, predictedFertilizer are required",
      });
    }

    const record = await prisma.soilPrediction.create({
      data: {
        temperature: parseFloat(temperature),
        phLevel: parseFloat(phLevel),
        soilColor,
        rainfall: parseFloat(rainfall),
        nitrogen: parseFloat(nitrogen),
        phosphorous: parseFloat(phosphorous),
        potassium: parseFloat(potassium),
        cropType,
        predictedFertilizer,
        predictedTreatment: predictedTreatment || null,
        confidence: confidence !== undefined ? parseFloat(confidence) : null,
        user: { connect: { id: userId } },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Soil prediction created successfully",
      data: record,
    });
  } catch (error) {
    console.error("Error creating soil prediction:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get paginated soil predictions for the authenticated user
export const getUserSoilPredictions = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const items = await prisma.soilPrediction.findMany({
      where: { userId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limitNum,
    });

    const total = await prisma.soilPrediction.count({ where: { userId } });

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
    console.error("Error fetching soil predictions:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get a single soil prediction by id (must belong to user)
export const getSoilPredictionById = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const item = await prisma.soilPrediction.findFirst({
      where: { id, userId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Soil prediction not found" });
    }

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error("Error fetching soil prediction:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update a soil prediction (only certain fields)
export const updateSoilPrediction = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { predictedFertilizer, predictedTreatment, confidence } = req.body;

    const exists = await prisma.soilPrediction.findFirst({ where: { id, userId } });
    if (!exists) {
      return res
        .status(404)
        .json({ success: false, message: "Soil prediction not found" });
    }

    const updated = await prisma.soilPrediction.update({
      where: { id },
      data: {
        predictedFertilizer:
          predictedFertilizer !== undefined
            ? predictedFertilizer
            : exists.predictedFertilizer,
        predictedTreatment:
          predictedTreatment !== undefined
            ? predictedTreatment
            : exists.predictedTreatment,
        confidence:
          confidence !== undefined ? parseFloat(confidence) : exists.confidence,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return res.status(200).json({
      success: true,
      message: "Soil prediction updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating soil prediction:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete a soil prediction
export const deleteSoilPrediction = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const exists = await prisma.soilPrediction.findFirst({ where: { id, userId } });
    if (!exists) {
      return res
        .status(404)
        .json({ success: false, message: "Soil prediction not found" });
    }

    await prisma.soilPrediction.delete({ where: { id } });
    return res
      .status(200)
      .json({ success: true, message: "Soil prediction deleted successfully" });
  } catch (error) {
    console.error("Error deleting soil prediction:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


