import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  try {

    const url = "https://bensinpriser.nu/stationer/95/vasterbottens-lan/skelleftea";

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "sv-SE"
      }
    });

    const $ = cheerio.load(response.data);

    let stations = [];

    // 🔥 rätt selector (baserat på sidan)
    $("table tr").each((i, el) => {

      const cols = $(el).find("td");

      if (cols.length < 2) return;

      const name = $(cols[0]).text().trim();

      const priceText = $(cols[1]).text().trim();

      const cleaned = priceText
        .replace("kr", "")
        .replace(",", ".")
        .trim();

      const price = parseFloat(cleaned);

      if (name && !isNaN(price)) {
        stations.push({
          station: name,
          price: price
        });
      }

    });

    res.status(200).json(stations);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
}
