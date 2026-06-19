const Product = require("../models/Product");

exports.getProducts = async (query) => {
  const {
    page = 1,
    pageSize = 10,
    category,
    categories,
    minPrice,
    maxPrice,
    inStock,
    search,
    sortBy = "createdAt",
    order = "desc",
  } = query;

  const filter = {};

  const categoryValues = [];

  if (categories) {
    const rawCategories = Array.isArray(categories)
      ? categories
      : String(categories).split(",");

    rawCategories.forEach((value) => {
      const normalized = String(value || "").trim();
      if (normalized) {
        categoryValues.push(normalized);
      }
    });
  }

  if (category) {
    categoryValues.push(String(category).trim());
  }

  if (categoryValues.length) {
    filter.category = { $in: [...new Set(categoryValues)] };
  }

  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  if (inStock === "true") {
    filter.stock = {
      $gt: 0,
    };
  }

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  const sort = {
    [sortBy]: order === "asc" ? 1 : -1,
  };

  const skip = (Number(page) - 1) * Number(pageSize);

  // const result = await Product.aggregate([
  //   {
  //     $match: filter,
  //   },

  //   {
  //     $facet: {
  //       products: [
  //         {
  //           $sort: sort,
  //         },

  //         {
  //           $skip: skip,
  //         },

  //         {
  //           $limit: Number(pageSize),
  //         },

  //         {
  //           $project: {
  //             name: 1,
  //             category: 1,
  //             price: 1,
  //             stock: 1,
  //             createdAt: 1,
  //           },
  //         },
  //       ],

  //       totalCount: [
  //         {
  //           $count: "count",
  //         },
  //       ],

  //       categoryCounts: [
  //         {
  //           $group: {
  //             _id: "$category",
  //             count: {
  //               $sum: 1,
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   },
  // ]);

  const result = await Product.aggregate([
    {
      $facet: {
        products: [
          { $match: filter },
          { $sort: sort },
          { $skip: skip },
          { $limit: Number(pageSize) },
          {
            $project: {
              name: 1,
              category: 1,
              price: 1,
              stock: 1,
              createdAt: 1,
            },
          },
        ],

        totalCount: [{ $match: filter }, { $count: "count" }],

        categoryCounts: [
          {
            $group: {
              _id: "$category",
              count: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ],
      },
    },
  ]);
  return {
    products: result[0].products,
    total: result[0].totalCount[0]?.count || 0,
    categoryCounts: result[0].categoryCounts,
    page: Number(page),
    pageSize: Number(pageSize),
  };
};

exports.getProductById = async (id) => {
  return Product.findById(id)
    .select("name description category price stock createdAt")
    .lean();
};

exports.createProduct = async (data) => {
  return Product.create(data);
};

exports.updateProduct = async (id, data) => {
  return Product.findByIdAndUpdate(id, data, {
    new: true,
  });
};

exports.deleteProduct = async (id) => {
  return Product.findByIdAndDelete(id);
};
exports.getProductsByManager = async (managerId) => {
  return Product.find({ createdBy: managerId }).lean();
};
exports.getMyProducts = async (managerId) => {
  return Product.find({ createdBy: managerId }).sort({ createdAt: -1 }).lean();
};
