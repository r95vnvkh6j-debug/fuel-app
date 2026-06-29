export default async function handler(req, res) {
  res.status(200).json([
    { station: "Test OKQ8", price: 16.45 }
  ]);
}
