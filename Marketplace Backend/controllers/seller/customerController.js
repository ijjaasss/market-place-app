import Order from "../../models/Order.js";
import User from "../../models/User.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import AppError from "../../utils/appError.js";

export const getSellerCustomers = asyncHandler(async (req, res) => {
  const sellerId = req.seller._id;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search } = req.query;

  // Orders containing this seller's products
  const orders = await Order.find({
    "items.seller": sellerId,
  }).populate("user", "name email phone createdAt");

  const customersMap = new Map();

  orders.forEach((order) => {
    const id = order.user._id.toString();

    if (!customersMap.has(id)) {
      customersMap.set(id, {
        _id: order.user._id,
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone,
        joinedDate: order.user.createdAt,
        orderCount: 0,
        totalSpent: 0,
        lastOrder: order.createdAt,
      });
    }

    const customer = customersMap.get(id);

    customer.orderCount++;

    order.items.forEach((item) => {
      if (item.seller.toString() === sellerId.toString()) {
        customer.totalSpent += item.price * item.quantity;
      }
    });

    if (order.createdAt > customer.lastOrder) {
      customer.lastOrder = order.createdAt;
    }
  });

  let customers = [...customersMap.values()];

  if (search) {
    const keyword = search.toLowerCase();

    customers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(keyword) ||
        c.email.toLowerCase().includes(keyword) ||
        c.phone.includes(keyword)
    );
  }

  switch (req.query.sort) {
    case "most-orders":
      customers.sort((a, b) => b.orderCount - a.orderCount);
      break;

    case "highest-spending":
      customers.sort((a, b) => b.totalSpent - a.totalSpent);
      break;

    case "oldest":
      customers.sort((a, b) => a.lastOrder - b.lastOrder);
      break;

    default:
      customers.sort((a, b) => b.lastOrder - a.lastOrder);
  }

  // Filters
  const filter = req.query.filter;

  if (filter === "repeat") {
    customers = customers.filter((c) => c.orderCount > 1);
  }

  if (filter === "high-spending") {
    customers = customers.filter((c) => c.totalSpent >= 10000);
  }

  if (filter === "new") {
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() - 30);

    customers = customers.filter(
      (c) => new Date(c.joinedDate) >= thirtyDays
    );
  }

  const totalRecords = customers.length;

  customers = customers.slice(skip, skip + limit);

  res.json({
    success: true,

    cards: {
      totalCustomers: totalRecords,
      activeCustomers: totalRecords,
      newCustomers: customers.filter((c) => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return new Date(c.joinedDate) >= d;
      }).length,
      totalOrders: orders.length,
    },

    customers,

    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
    limit,
  });
});




export const getCustomerDetails = asyncHandler(async (req, res, next) => {
  const sellerId = req.seller._id;
  const customerId = req.params.id;

  const customer = await User.findById(customerId).select(
    "name email phone createdAt"
  );

  if (!customer) {
    return next(new AppError("Customer not found", 404));
  }

  const orders = await Order.find({
    user: customerId,
    "items.seller": sellerId,
  }).populate("items.product", "name images");

  if (!orders.length) {
    return next(new AppError("Customer not found", 404));
  }

  let totalSpent = 0;
  let totalProducts = 0;

  const orderList = [];
  const products = [];
  const addresses = [];

  orders.forEach((order) => {
    let sellerAmount = 0;

    order.items.forEach((item) => {
      if (item.seller.toString() !== sellerId.toString()) return;

      sellerAmount += item.price * item.quantity;
      totalSpent += item.price * item.quantity;
      totalProducts += item.quantity;

      products.push({
        _id: item.product._id,
        name: item.product.name,
        image: item.product.images[0],
        quantity: item.quantity,
        price: item.price,
      });
    });

    orderList.push({
      _id: order._id,
      date: order.createdAt,
      amount: sellerAmount,
      status: order.orderStatus,
    });

    addresses.push(order.shippingAddress);
  });

  const uniqueAddresses = [
    ...new Map(
      addresses.map((a) => [
        `${a.address}${a.pincode}`,
        a,
      ])
    ).values(),
  ];

  res.json({
    success: true,

    customer: {
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      joinedDate: customer.createdAt,
    },

    statistics: {
      totalOrders: orders.length,
      totalProductsPurchased: totalProducts,
      totalSpent,
      lastOrderDate: orders[0].createdAt,
    },

    orders: orderList,

    products,

    shippingAddresses: uniqueAddresses,
  });
});