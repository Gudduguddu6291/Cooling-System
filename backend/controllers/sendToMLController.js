import axios from "axios";

export const sendToML = async (req, res) => {
  try {

    const { lag1, lag2, lag3, rolling_mean, month } = req.body;

    if (
      lag1 === undefined ||
      lag2 === undefined ||
      lag3 === undefined ||
      rolling_mean === undefined ||
      month === undefined
    ) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/predict",
      {
        lag1,
        lag2,
        lag3,
        rolling_mean,
        month
      }
    );

    return res.status(200).json({
      predictedTemp: mlResponse.data.predicted_temperature
    });

  } catch (error) {

    console.error("ML Prediction Error:", error.response?.data || error.message);

    return res.status(500).json({
      error: "ML prediction failed"
    });

  }
};