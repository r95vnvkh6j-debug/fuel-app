import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {

  try {
    const response = await axios.get(
      "https://bensinpriser.nu/stationer/95/vasterbottens-lan/skelleftea",
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );

    const $ = cheerio.load(response.data);

    let stations = [];

    $("table tr").each((i, el) => {
      const cols = $(el).find("td");

      if(cols.length < 2) return;

      const name = $(cols[0]).text().trim();
      const priceText = $(cols[1]).text().trim();

      const price = parseFloat(
        priceText.replace("kr", "").replace(",", ".").trim()
      );

      if(name && !isNaN(price)){
        stations.push({ station: name, price });
      }
    });

    res.status(200).json(stations);

  } catch (err) {
    res.status(500).json({ error: "scraping failed" });
  }
}
