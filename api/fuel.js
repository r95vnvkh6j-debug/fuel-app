import axios from "axios";
import cheerio from "cheerio";

let cache = null;
let lastFetch = 0;

export default async function handler(req, res) {

  // 🧠 cache 1 timme
  if (cache && Date.now() - lastFetch < 3600000) {
    return res.status(200).json(cache);
  }

  try {
    const url = "https://bensinpriser.nu/stationer/95/vasterbottens-lan/skelleftea";

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(response.data);

    let stations = [];

    $("table tr").each((i, el) => {
      const cols = $(el).find("td");

      if(cols.length < 2) return;

      const name = $(cols[0]).text().trim();
      const priceText = $(cols[1]).text().trim();

      // fixa svenska format
      const price = parseFloat(
        priceText.replace("kr", "")
                 .replace(",", ".")
                 .trim()
      );

      if (name && !isNaN(price)) {
        stations.push({
          station: name,
          price: price
        });
      }
    });

    cache = stations;
    lastFetch = Date.now();

    res.status(200).json(stations);

  } catch (err) {
    res.status(500).json({ error: "Scraping failed" });
  }
}
``
