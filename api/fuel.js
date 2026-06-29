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

    const html = response.data;

    const stations = [];

    // dela upp i rader
    const rows = html.split("<tr");

    rows.forEach(row => {

      // hoppa över "okänt"
      if (row.includes("Okänt")) return;

      // hitta pris som slutar med kr
      const priceMatch = row.match(/(\d+,\d+)\s*kr/);

      // hitta första td (stationsnamn)
      const nameMatch = row.match(/<td[^>]*>(.*?)<\/td>/);

      if (!priceMatch || !nameMatch) return;

      const name = nameMatch[1]
        .replace(/<[^>]+>/g, "")
        .trim();

      const price = parseFloat(
        priceMatch[1].replace(",", ".")
      );

      // filtrera rimliga priser
      if (price > 15 && price < 30 && name.length > 2) {
        stations.push({
          station: name,
          price: price
        });
      }

    });

    // ✅ sortera billigast först
    stations.sort((a, b) => a.price - b.price);

    res.status(200).json(stations);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
}
