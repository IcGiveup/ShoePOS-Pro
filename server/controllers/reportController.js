const Sale = require("../models/Sale");
const Return = require("../models/Return");
const Variant = require("../models/Variant");
const Product = require("../models/Product");

// ======================================
// DASHBOARD REPORT
// ======================================
exports.dashboardReport = async (req, res) => {
  try {
    // =========================
    // TODAY SALES
    // =========================
    const startToday = new Date();

    startToday.setHours(0, 0, 0, 0);

    const endToday = new Date();

    endToday.setHours(23, 59, 59, 999);

    const todaySales = await Sale.find({
      createdAt: {
        $gte: startToday,
        $lte: endToday,
      },
    });

    const todayReturns = await Return.find({
      createdAt: {
        $gte: startToday,
        $lte: endToday,
      },
    });

    const salesTotal = todaySales.reduce(
      (sum, sale) => sum + (sale.total || 0),
      0,
    );

    const returnTotal = todayReturns.reduce(
      (sum, r) => sum + (r.refundAmount || 0),
      0,
    );

    const todayTotal = salesTotal - returnTotal;

    // =========================
    // LOW STOCK
    // =========================
    const lowStock = await Variant.find({
      stock: { $lte: 5 },
    }).populate("productId");

    // =========================
    // INVENTORY ANALYTICS
    // =========================

    const allVariants = await Variant.find();

    const totalInventoryItems = allVariants.length;

    const outOfStock = allVariants.filter((v) => v.stock === 0).length;

    const lowStockCount = allVariants.filter(
      (v) => v.stock > 0 && v.stock <= 5,
    ).length;

    const inventoryValue = allVariants.reduce(
      (sum, item) => sum + (item.stock || 0) * (item.price || 0),
      0,
    );

    // =========================
    // RECENT SALES
    // =========================
    const recentSales = await Sale.find().sort({ createdAt: -1 }).limit(5);

    // =========================
    // TOP PRODUCT
    // =========================
    const allSales = await Sale.find();

    const productMap = {};

    allSales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (!productMap[item.productName]) {
          productMap[item.productName] = 0;
        }

        productMap[item.productName] += item.qty;
      });
    });

    let topProduct = "No sales yet";

    const sortedProducts = Object.entries(productMap).sort(
      (a, b) => b[1] - a[1],
    );

    if (sortedProducts.length > 0) {
      topProduct = sortedProducts[0][0];
    }

    // =========================
    // RESPONSE
    // =========================
    res.json({
      todaySales: {
        total: todayTotal,
        count: todaySales.length,
      },

      lowStock,

      recentSales,

      topProduct,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });
  }
};

// ======================================
// ANALYTICS REPORT
// ======================================
exports.analyticsReport = async (req, res) => {
  try {
    const filter = req.query.filter || "7days";

    let startDate = new Date();

    if (filter === "today") {
      startDate.setHours(0, 0, 0, 0);
    } else if (filter === "7days") {
      startDate.setDate(startDate.getDate() - 6);
    } else if (filter === "30days") {
      startDate.setDate(startDate.getDate() - 29);
    } else if (filter === "month") {
      startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    }

    const sales = await Sale.find({
      createdAt: { $gte: startDate },
    }).populate("customerId");

    const returns = await Return.find({
      createdAt: { $gte: startDate },
    });

    let returnedCost = 0;

    for (const ret of returns) {
      const sale = await Sale.findById(ret.saleId);

      if (!sale) continue;

      const returnedItem = sale.items.find(
        (item) => item.variantId?.toString() === ret.oldVariantId?.toString(),
      );

      if (returnedItem) {
        returnedCost += (returnedItem.costPrice || 0) * (ret.qty || 0);
      }
    }

    const salesTotal = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);

    const returnTotal = returns.reduce(
      (sum, item) => sum + (item.refundAmount || 0),
      0,
    );

    const finalRevenue = salesTotal - returnTotal;

    // Calculate Cost of Goods Sold (COGS)
    let costOfGoodsSold = 0;

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        costOfGoodsSold += (item.costPrice || 0) * (item.qty || 0);
      });
    });

    costOfGoodsSold -= returnedCost;

    const profit = Math.max(0, finalRevenue - costOfGoodsSold);
    const totalDiscount = sales.reduce(
      (sum, sale) => sum + (sale.discount || 0),
      0,
    );

    let cash = 0;
    let card = 0;
    let mobile = 0;

    sales.forEach((sale) => {
      cash += sale.payments?.cash || 0;
      card += sale.payments?.card || 0;
      mobile += sale.payments?.mobile || 0;
    });

    const lowStock = await Variant.find({
      stock: { $lte: 5 },
    });

    // =========================
    // INVENTORY ANALYTICS
    // =========================
    const allVariants = await Variant.find();

    const totalInventoryItems = allVariants.length;

    const outOfStock = allVariants.filter((v) => v.stock === 0).length;

    const lowStockCount = allVariants.filter(
      (v) => v.stock > 0 && v.stock <= 5,
    ).length;

    const inventoryValue = allVariants.reduce(
      (sum, item) => sum + (item.stock || 0) * (item.price || 0),
      0,
    );

    // =========================
    // SALES CHART DATA
    // =========================
    const salesData = [];

    if (filter === "today") {
      for (let hour = 0; hour < 24; hour++) {
        const hourStart = new Date();

        hourStart.setHours(hour, 0, 0, 0);

        const hourEnd = new Date();

        hourEnd.setHours(hour, 59, 59, 999);

        const hourSales = await Sale.find({
          createdAt: {
            $gte: hourStart,
            $lte: hourEnd,
          },
        });

        const total = hourSales.reduce(
          (sum, sale) => sum + (sale.total || 0),
          0,
        );

        salesData.push({
          date: `${hour}:00`,
          sales: total,
        });
      }
    } else {
      let totalDays = 7;

      if (filter === "30days") totalDays = 30;

      if (filter === "month") {
        totalDays = new Date().getDate();
      }

      for (let i = totalDays - 1; i >= 0; i--) {
        const dayStart = new Date();

        dayStart.setDate(dayStart.getDate() - i);

        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(dayStart);

        dayEnd.setHours(23, 59, 59, 999);

        const daySales = await Sale.find({
          createdAt: {
            $gte: dayStart,
            $lte: dayEnd,
          },
        });

        const total = daySales.reduce(
          (sum, sale) => sum + (sale.total || 0),
          0,
        );

        salesData.push({
          date: dayStart.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          sales: total,
        });
      }
    }

    // =========================
    // TOP PRODUCTS
    // =========================
    const productMap = {};

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        productMap[item.productName] =
          (productMap[item.productName] || 0) + item.qty;
      });
    });

    const topProducts = Object.entries(productMap)
      .map(([name, qty]) => ({
        name,
        qty,
      }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // =========================
    // TOP CUSTOMERS
    // =========================
    const customerMap = {};

    sales.forEach((sale) => {
      const name = sale.customerId?.name || "Walk-in Customer";

      if (!customerMap[name]) {
        customerMap[name] = {
          totalSpent: 0,
          orders: 0,
        };
      }

      customerMap[name].totalSpent += sale.total || 0;

      customerMap[name].orders += 1;
    });

    const topCustomers = Object.entries(customerMap)
      .map(([name, value]) => ({
        name,
        totalSpent: value.totalSpent,
        orders: value.orders,
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    res.json({
      monthlyRevenue: finalRevenue,

      estimatedProfit: profit,

      totalOrders: sales.length,

      totalReturns: returns.length,

      totalDiscount,

      lowStock: lowStock.length,

      inventoryValue,

      totalInventoryItems,

      outOfStock,

      lowStockCount,

      payments: {
        cash,
        card,
        mobile,
      },

      salesData,

      topProducts,

      topCustomers,

      peakHours: [],

      categoryAnalytics: [],
    });
  } catch (error) {
    console.log({
      revenue: finalRevenue,
      profit,
      totalDiscount,
      salesCount: sales.length,
    });

    res.status(500).json({
      msg: error.message,
    });
  }
};
