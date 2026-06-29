import axios from "axios";

export default async function handler(req, res) {
  try {

    const url = "https://bensinpriser.nu/stationer/95/vasterbottens-lan/skelleftea";

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "sv-SE"
      },
      timeout: 5000
    });

    // ✅ returnera RAW html (för debug)
    res.status(200).json({
      ok: true,
      preview: response.data.substring(0, 300)
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
      info: "fetch failed"
    });

  }
}
