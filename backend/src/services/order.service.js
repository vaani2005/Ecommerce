const mongoose = require("mongoose");

const Product = require("../models/Product");
const Order = require("../models/Order");

exports.createOrder = async (userId, items) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    let totalAmount = 0;

    const orderItems = [];

    for (const item of items) {
      const product = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          stock: {
            $gte: item.quantity,
          },
        },
        {
          $inc: {
            stock: -item.quantity,
          },
        },
        {
          new: true,
          session,
        },
      );

      if (!product) {
        throw new Error("Product out of stock");
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    const [order] = await Order.create(
      [
        {
          customer: userId,
          items: orderItems,
          totalAmount,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return order;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};
exports.getOrders = async (user) => {
  const query = user.role === "customer" ? { customer: user.id } : {};

  return Order.find(query)
    .populate("customer", "name email")
    .populate("items.product", "name")
    .lean();
};

exports.getOrderById = async (id, user) => {
  const filter =
    user.role === "customer"
      ? {
          _id: id,
          customer: user.id,
        }
      : {
          _id: id,
        };

  return Order.findOne(filter)
    .populate("customer", "name email")
    .populate("items.product", "name")
    .lean();
};

exports.updateOrderStatus = async (orderId, status) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);

    if (!order) {
      throw new Error("Order not found");
    }

    const prev = order.status;

    if (prev === status) {
      await session.commitTransaction();
      return order;
    }

    // If rejecting an order that was previously accepted/pending, restore stock
    if (status === "rejected" && prev !== "rejected") {
      for (const it of order.items) {
        await Product.findByIdAndUpdate(
          it.product,
          { $inc: { stock: it.quantity } },
          { session },
        );
      }
    }

    order.status = status;
    await order.save({ session });

    await session.commitTransaction();

    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
