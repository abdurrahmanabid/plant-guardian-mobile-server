import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

export const deleteImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { imageUrl } = req.body as { imageUrl?: string };

    if (!imageUrl) {
      return res.status(400).json({ message: "Please provide imageUrl" });
    }

    // Resolve absolute target path from provided relative url/path
    const uploadsRoot = path.resolve(process.cwd(), "uploads");
    const absoluteTargetPath = path.isAbsolute(imageUrl)
      ? imageUrl
      : path.resolve(process.cwd(), imageUrl);

    // Normalize and validate that target is inside uploads directory to prevent traversal
    const normalizedTarget = path.normalize(absoluteTargetPath);
    if (!normalizedTarget.startsWith(uploadsRoot + path.sep)) {
      return res.status(400).json({ message: "Invalid image path" });
    }

    // Check file exists and is a file
    let stat: fs.Stats;
    try {
      stat = await fs.promises.stat(normalizedTarget);
    } catch {
      return res.status(404).json({ message: "File not found" });
    }

    if (!stat.isFile()) {
      return res.status(400).json({ message: "Path is not a file" });
    }

    await fs.promises.unlink(normalizedTarget);

    return res.status(200).json({ ok: true, message: "Image deleted" });
  } catch (error) {
    return next(error);
  }
};


