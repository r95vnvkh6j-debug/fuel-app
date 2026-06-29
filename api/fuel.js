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

    // hitta alla rader
    const rows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/g);

    if (rows) {
      rows.forEach(row => {

        // hitta ALLA <td>
        const cols = row.match(/<td[^>]*>(.*?)<\/td>/g);

        if (!cols || cols.length < 2) return;

        // hitta priskolumn (den som innehåller "kr")
        const priceCol = cols.find(col => col.includes("kr"));

        if (!priceCol) return;

        const priceText = priceCol
          .replace(/<[^>]+>/g, "")
          .replace("kr", "")
          .trim();

        if (!priceText.includes(",")) return;

        const price = parseFloat(priceText.replace(",", "."));

        if (isNaN(price)) return;

        // station = första kolumnen
        const name = cols[0]
          .replace(/<[^>]+>/g, "")
          .trim();

        // adress = andra kolumnen
        const address = cols[1]
          .replace(/<[^>]+>/g, "")
          .trim();

        stations.push({
          station: name + " " + address,
          price: price
        });

      });
    }

    // ✅ sortera billigast först
    stations.sort((a, b) => a.price - b.price);

    res.status(200).json(stations);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}
``
