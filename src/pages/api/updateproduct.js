import conn_to_mon from "@/features/mongoose";
import Products from "@/models/Products";

export default async function getproducts(req, res) {
  if (req.method === "POST") {
    await conn_to_mon();


    const updateProduct = await Products.findByIdAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          image: req.body.image.image,
          category: req.body.category,
          foodCategory: req.body.foodCategory,
          price: req.body.price,
        },
      },
      { new: true }
    );

    if (updateProduct) {
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: updateProduct,
      });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } else {
    res.status(400).json({ error: "This method is not premitted" });
  }
}
