const Product = require("../models/Product");
const Variant = require("../models/Variant");

// ======================================
// CREATE PRODUCT
// ======================================
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      basePrice,
      description,
      variants,
    } = req.body;

    // CREATE PRODUCT
    const product = await Product.create({
      name,
      brand,
      category,
      basePrice,
      description,
    });

    // INSERT VARIANTS
    if (variants && variants.length > 0) {
      const cleanVariants = variants.map((item, index) => ({
        productId: product._id,

        size: item.size,

        color: item.color,

        stock: Number(item.stock || 0),

        // IMPORTANT
        price: Number(item.price || basePrice),

        // UNIQUE SKU
        sku: `${name
          .replace(/\s+/g, "")
          .toUpperCase()}-${item.size}-${item.color}-${Date.now()}-${index}`,

        // UNIQUE BARCODE
        barcode:
          item.barcode ||
          `BAR-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      }));

      await Variant.insertMany(cleanVariants);
    }

    res.status(201).json({
      msg: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: error.message,
    });
  }
};

// ======================================
// GET ALL PRODUCTS
// ======================================
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();

    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        const variants = await Variant.find({
          productId: product._id,
        });

        // TOTAL STOCK
        const totalStock = variants.reduce(
          (sum, item) => sum + Number(item.stock || 0),
          0
        );

        return {
          ...product,
          stock: totalStock,
          variants,
        };
      })
    );

    res.json(updatedProducts);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: error.message,
    });
  }
};

// ======================================
// GET SINGLE PRODUCT
// ======================================
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        msg: "Product not found",
      });
    }

    const variants = await Variant.find({
      productId: product._id,
    });

    const totalStock = variants.reduce(
      (sum, item) => sum + Number(item.stock || 0),
      0
    );

    res.json({
      ...product._doc,
      stock: totalStock,
      variants,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: error.message,
    });
  }
};

// ======================================
// UPDATE PRODUCT
// ======================================
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      basePrice,
      variants,
    } = req.body;

    // UPDATE PRODUCT INFO
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        brand,
        category,
        basePrice,
      },
      {
        new: true,
      }
    );

    // UPDATE VARIANTS
    if (variants && variants.length > 0) {
      for (const item of variants) {
        await Variant.findByIdAndUpdate(item._id, {
          stock: Number(item.stock),
          price: Number(item.price || basePrice),
        });
      }
    }

    res.json({
      msg: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: error.message,
    });
  }
};

// ======================================
// DELETE PRODUCT
// ======================================
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    await Variant.deleteMany({
      productId: req.params.id,
    });

    res.json({
      msg: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: error.message,
    });
  }
};