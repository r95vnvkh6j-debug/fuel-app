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

    // 🔥 hitta alla table rows
    const rows = html.match(/<tr[^>]*>(.*?)<\/tr>/gs);

    if (rows) {
      rows.forEach(row => {

        // hoppa över "okänt"
        if (row.includes("Okänt")) return;

        const cols = row.match(/<td[^>]*>(.*?)<\/td>/gs);

        // behöver minst 3 kolumner
        if (!cols || cols.length < 3) return;

        // ✅ station namn (kolumn 1)
        const name = cols[0]
          .replace(/<[^>]+>/g, "")
          .trim();

        // ✅ adress (kolumn 2)
        const address = cols[1]
          .replace(/<[^>]+>/g, "")
          .trim();

        // ✅ pris (kolumn 3)
        const priceText = cols[2]
          .replace(/<[^>]+>/g, "")
          .replace("kr", "")
          .trim();

        if (!priceText.includes(",")) return;

        const price = parseFloat(priceText.replace(",", "."));

        // ✅ filtrera rimliga värden
        if (price > 15 && price < 30) {
          stations.push({
            station: name + " " + address,
            price: price
          });
        }

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
