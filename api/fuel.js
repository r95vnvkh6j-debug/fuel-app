import axios from "axios";

export default async function handler(req, res) {
  try {

    const url = "https://bensinpriser.nu/stationer/95/vasterbottens-lan/skelleftea";

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = response.data;

    const stations = [];

    // 🔥 hitta rader i tabellen manuellt
    const rows = html.split("<tr");

    rows.forEach(row => {

      const matchName = row.match(/<td[^>]*>(.*?)<\/td>/);
      const matchPrice = row.match(/(\d+,\d+)\s*kr/);

      if (matchName && matchPrice) {

        const name = matchName[1]
          .replace(/<[^>]+>/g, "")
          .trim();

        const price = parseFloat(
          matchPrice[1].replace(",", ".")
        );

        if (name && !isNaN(price)) {
          stations.push({
            station: name,
            price: price
          });
        }
      }

    });

    res.status(200).json(stations);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
}
``
