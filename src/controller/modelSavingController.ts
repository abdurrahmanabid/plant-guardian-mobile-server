import { Request, Response } from "express";
import { getUserId } from "../utils/getUserId";
import { prisma } from "../helpers/prisma";

// নতুন Image তৈরি করুন
export const createImage = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { imageUrl, diseaseName, description, confidence, treatment } =
      req.body;

    // ভ্যালিডেশন
    if (!imageUrl || !diseaseName) {
      return res.status(400).json({
        success: false,
        message: "Image URL and disease name are required",
      });
    }

    const image = await prisma.imageModel.create({
      data: {
        imageUrl,
        diseaseName,
        confidence: confidence ? parseFloat(confidence) : null,
        treatment: treatment || null,
        user: {
          connect: { id: userId },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Image analysis created successfully",
      data: image,
    });
  } catch (error) {
    console.error("Error creating image:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ব্যবহারকারীর সকল Image পড়ুন
export const getUserImages = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const images = await prisma.imageModel.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: limitNum,
    });

    const total = await prisma.imageModel.count({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
      success: true,
      data: images,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching user images:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// নির্দিষ্ট Image পড়ুন
export const getImageById = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const image = await prisma.imageModel.findFirst({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Image আপডেট করুন
export const updateImage = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { diseaseName, description, confidence, treatment } = req.body;

    // চেক করুন যে Imageটি ব্যবহারকারীর owns
    const existingImage = await prisma.imageModel.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!existingImage) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const updatedImage = await prisma.imageModel.update({
      where: {
        id: id,
      },
      data: {
        diseaseName: diseaseName || existingImage.diseaseName,
        confidence:
          confidence !== undefined
            ? parseFloat(confidence)
            : existingImage.confidence,
        treatment:
          treatment !== undefined ? treatment : existingImage.treatment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedImage,
    });
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Image ডিলিট করুন
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    // চেক করুন যে Imageটি ব্যবহারকারীর owns
    const existingImage = await prisma.imageModel.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!existingImage) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    await prisma.imageModel.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// রোগের ধরন অনুযায়ী Image খুঁজুন
export const getImagesByDisease = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { diseaseName } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const images = await prisma.imageModel.findMany({
      where: {
        userId: userId,
        diseaseName: {
          contains: diseaseName,
          mode: "insensitive",
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: limitNum,
    });

    const total = await prisma.imageModel.count({
      where: {
        userId: userId,
        diseaseName: {
          contains: diseaseName,
          mode: "insensitive",
        },
      },
    });

    res.status(200).json({
      success: true,
      data: images,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching images by disease:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// সর্বশেষ Image পড়ুন
export const getRecentImages = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { limit = 5 } = req.query;

    const limitNum = parseInt(limit as string);

    const recentImages = await prisma.imageModel.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limitNum,
    });

    res.status(200).json({
      success: true,
      data: recentImages,
    });
  } catch (error) {
    console.error("Error fetching recent images:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
