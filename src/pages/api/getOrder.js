import conn_to_mon from "@/features/mongoose";
import Order from "@/models/Order";
import Products from "@/models/Products";
export default async function addproducts(req, res) {
  if (req.method === "POST") {
    await conn_to_mon();

    let imageUrl = [];

    const getProduct = async () => {
      const order = await Order.findById(req.body.id);

      for (const item of order.products) {
        const product = await Products.findById(item.id);
        if (product && product.image.length > 0) {
          imageUrl.push(product.image[0].secure_url);
        }
      }

      res.status(200).json({ order: order, imageUrl: imageUrl });
    };
    getProduct();
  } else {
    res.status(400).json({ error: "This method is not premitted" });
  }
}
