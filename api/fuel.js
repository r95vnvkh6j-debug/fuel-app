import axios from "axios";

export default async function handler(req, res) {
  try {

    const response = await axios.get(
      "https://bensinpriser.nu/stationer/95/vasterbottens-lan/skelleftea",
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    res.status(200).json({
      ok: true,
      length: response.data.length
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
}
