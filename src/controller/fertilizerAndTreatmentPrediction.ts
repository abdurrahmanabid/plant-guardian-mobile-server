import { NextFunction, Request, Response } from "express";
import axios from "axios";

export const fertilizerAndTreatmentPredictionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extracting the required fields from the request body
    const {
      Nitrogen,
      Phosphorus,
      Potassium,
      pH,
      Rainfall,
      Temperature,
      Soil_color,
      Crop,
      Disease,
    } = req.body;

    const requestBaseURL = process.env.PREDICT_SITE;

    // Check if the environment variable is set
    if (!requestBaseURL) {
      return res.status(500).json({ message: "PREDICT_SITE env not set" });
    }

    // Validate that all required fields are provided
    if (
      !Nitrogen ||
      !Phosphorus ||
      !Potassium ||
      !pH ||
      !Rainfall ||
      !Temperature ||
      !Soil_color ||
      !Crop ||
      !Disease
    ) {
      return res.status(400).json({
        message:
          "Please provide all the required fields: Nitrogen, Phosphorus, Potassium, pH, Rainfall, Temperature, Soil_color, Crop, Disease",
      });
    }

    // Prepare the payload for the prediction request
    const payload = {
      Nitrogen,
      Phosphorus,
      Potassium,
      pH,
      Rainfall,
      Temperature,
      Soil_color,
      Crop,
      Disease,
    };

    // Construct the prediction request URL
    const requestURL = new URL(
      "/predict-fertilizer-and-treatment",
      requestBaseURL
    ).toString();

    // Send the POST request to the prediction service
    const axiosRes = await axios.post(requestURL, payload, {
      headers: {
        "Content-Type": "application/json", // Ensure the server knows we are sending JSON
      },
      timeout: 15000, // optional timeout
    });

    // Return the response from the prediction service to the client
    return res.status(200).json({
      ok: true,
      data: axiosRes.data,
    });
  } catch (error) {
    // Pass the error to the next middleware (usually for logging)
    return next(error);
  }
};
