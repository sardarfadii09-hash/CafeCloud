
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const connectDB = require("../config/db");

const menuSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    category: String,
    image: String,
    available: Boolean,
  },
  { timestamps: true }
);

const MenuItem = mongoose.model("CafeMenuItem", menuSchema);

const seedMenu = async () => {
  try {
    await connectDB();

    const { menuItems } = await import(
      "../../frontend/src/data/menuData.js"
    );

    for (const item of menuItems) {
      await MenuItem.updateOne(
        { name: item.name, category: item.category },
        {
          $set: {
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image,
            available: true,
          },
        },
        { upsert: true }
      );
    }

    console.log("Menu migration completed successfully!");
    console.log(`${menuItems.length} menu items processed.`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Menu migration failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedMenu();
