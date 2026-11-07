
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

dotenv.config();

const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

// ---------- AUTHENTICATION ----------

const requireAdmin = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Admin login required.",
    });
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please log in again.",
    });
  }
};

// ---------- DATABASE MODELS ----------

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const reservationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true, min: 1 },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    total: { type: Number, required: true, min: 0 },
    address: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, default: "" },
    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MenuItem = mongoose.model("CafeMenuItem", menuSchema);
const Reservation = mongoose.model("CafeReservation", reservationSchema);
const Order = mongoose.model("CafeOrder", orderSchema);
const ContactMessage = mongoose.model("CafeContactMessage", messageSchema);

// ---------- BASIC ROUTES ----------

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CafeCloud API is running successfully!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Backend is healthy" });
});

// Admin setup/login routes
app.use("/api/admin", adminRoutes);

// ---------- MENU ----------

// Public: view available menu
app.get("/api/menu", async (req, res) => {
  try {
    const items = await MenuItem.find({ available: true }).sort({
      createdAt: -1,
    });

    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not load menu." });
  }
});

// Admin: view all menu items
app.get("/api/menu/admin", requireAdmin, async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not load menu." });
  }
});

// Admin: add menu item
app.post("/api/menu", requireAdmin, async (req, res) => {
  try {
    const { name, description, price, category, image, available } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price and category are required.",
      });
    }

    const item = await MenuItem.create({
      name,
      description,
      price,
      category,
      image,
      available,
    });

    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(400).json({ success: false, message: "Could not add menu item." });
  }
});

// Admin: edit menu item
app.patch("/api/menu/:id", requireAdmin, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found." });
    }

    res.json({ success: true, item });
  } catch (error) {
    res.status(400).json({ success: false, message: "Could not update item." });
  }
});

// Admin: delete menu item
app.delete("/api/menu/:id", requireAdmin, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found." });
    }

    res.json({ success: true, message: "Menu item deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: "Could not delete item." });
  }
});

// ---------- RESERVATIONS ----------

// Public: submit reservation
app.post("/api/reservations", async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, message } = req.body;

    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required reservation fields.",
      });
    }

    const reservation = await Reservation.create({
      name,
      email,
      phone,
      date,
      time,
      guests,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Reservation submitted successfully.",
      reservation,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Could not save reservation." });
  }
});

// Admin: list reservations
app.get("/api/reservations", requireAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json({ success: true, reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not load reservations." });
  }
});

// Admin: update reservation status
app.patch("/api/reservations/:id", requireAdmin, async (req, res) => {
  try {
    const allowed = ["pending", "confirmed", "cancelled", "completed"];

    if (!allowed.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation not found." });
    }

    res.json({ success: true, reservation });
  } catch (error) {
    res.status(400).json({ success: false, message: "Could not update reservation." });
  }
});

// ---------- ORDERS ----------

// Public: submit an order
app.post("/api/orders", async (req, res) => {
  try {
    const { customerName, email, phone, items, address } = req.body;

    if (
      !customerName ||
      !email ||
      !phone ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Customer details and order items are required.",
      });
    }

    // Calculate total from current database prices, not browser-supplied prices.
    let verifiedItems = [];
    let total = 0;

    for (const requested of items) {
      const menuItem = await MenuItem.findOne({
        _id: requested.menuItemId,
        available: true,
      });

      const quantity = Number(requested.quantity);

      if (!menuItem || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
        return res.status(400).json({
          success: false,
          message: "An order item or quantity is invalid.",
        });
      }

      verifiedItems.push({
        name: menuItem.name,
        price: menuItem.price,
        quantity,
      });

      total += menuItem.price * quantity;
    }

    const order = await Order.create({
      customerName,
      email,
      phone,
      items: verifiedItems,
      total,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Order submitted successfully.",
      order,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Could not save order." });
  }
});

// Admin: list orders
app.get("/api/orders", requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not load orders." });
  }
});

// Admin: update order status
app.patch("/api/orders/:id", requireAdmin, async (req, res) => {
  try {
    const allowed = ["pending", "confirmed", "preparing", "completed", "cancelled"];

    if (!allowed.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(400).json({ success: false, message: "Could not update order." });
  }
});

// ---------- CONTACT MESSAGES ----------

// Public: submit contact form
app.post("/api/messages", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required.",
      });
    }

    const savedMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Your message has been received.",
      contactMessage: savedMessage,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Could not save message." });
  }
});

// Admin: list messages
app.get("/api/messages", requireAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not load messages." });
  }
});

// Admin: mark a message as read/unread
app.patch("/api/messages/:id", requireAdmin, async (req, res) => {
  try {
    const savedMessage = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: Boolean(req.body.isRead) },
      { new: true }
    );

    if (!savedMessage) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }

    res.json({ success: true, contactMessage: savedMessage });
  } catch (error) {
    res.status(400).json({ success: false, message: "Could not update message." });
  }
});

// ---------- ADMIN DASHBOARD STATS ----------

app.get("/api/admin/stats", requireAdmin, async (req, res) => {
  try {
    const [menuCount, reservationCount, orderCount, messageCount, pendingReservations, pendingOrders, unreadMessages] =
      await Promise.all([
        MenuItem.countDocuments(),
        Reservation.countDocuments(),
        Order.countDocuments(),
        ContactMessage.countDocuments(),
        Reservation.countDocuments({ status: "pending" }),
        Order.countDocuments({ status: "pending" }),
        ContactMessage.countDocuments({ isRead: false }),
      ]);

    res.json({
      success: true,
      stats: {
        menuCount,
        reservationCount,
        orderCount,
        messageCount,
        pendingReservations,
        pendingOrders,
        unreadMessages,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not load dashboard stats." });
  }
});

// ---------- ERROR HANDLING ----------

app.use((req, res) => {
  res.status(404).json({ success: false, message: "API route not found." });
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`CafeCloud backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
};

startServer();