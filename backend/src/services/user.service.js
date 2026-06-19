const User = require("../models/User");

exports.getManagers = async () => {
  return User.find({ role: "manager" })
    .select("name email role createdAt")
    .lean();
};

exports.getCustomers = async () => {
  return User.find({ role: "customer" })
    .select("name email role createdAt")
    .lean();
};
