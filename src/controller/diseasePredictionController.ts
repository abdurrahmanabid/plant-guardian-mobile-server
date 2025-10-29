import { NextFunction, Request, Response } from "express";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

export const diseasePredictionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { imagePath } = req.body as { imagePath?: string };
    const requestBaseURL = process.env.PREDICT_SITE;

    if (!requestBaseURL) {
      return res.status(500).json({ message: "PREDICT_SITE env not set" });
    }
    if (!imagePath) {
      return res.status(400).json({ message: "Please provide imagePath" });
    }

    // রিলেটিভ হলে অ্যাবসলিউট করো (uploads/... এই ধরণের পাথ সাপোর্ট)
    const absPath = path.isAbsolute(imagePath)
      ? imagePath
      : path.resolve(process.cwd(), imagePath);

    if (!fs.existsSync(absPath)) {
      return res.status(404).json({ message: `File not found: ${imagePath}` });
    }

    const form = new FormData();
    form.append("file", fs.createReadStream(absPath), {
      filename: path.basename(absPath),
    });

    // base url + /predict সেফলি জোড়া দাও
    const requestURL = new URL("/predict", requestBaseURL).toString();

    const axiosRes = await axios.post(requestURL, form, {
      headers: form.getHeaders(),     // multipart boundary
      timeout: 150000,                 // optional but good
    });

    // 5000 সার্ভারের রেসপন্স ক্লায়েন্টকে ফেরত দেই
    return res.status(200).json({
      ok: true,
      data: axiosRes.data,
    });
  } catch (error) {
    // ডাবল-রেসপন্স এড়াতে next(error) করাই ভালো
    return next(error);
  }
};
