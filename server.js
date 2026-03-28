import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3001;
const MINECRAFT_SERVER_ADDRESS =
  process.env.MINECRAFT_SERVER_ADDRESS || "loadinghsmpp.falix.dev";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme123";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, x-admin-password");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

function readOrders() {
  ensureDataFile();
  const raw = fs.readFileSync(ORDERS_FILE, "utf8");
  return JSON.parse(raw);
}

function writeOrders(orders) {
  ensureDataFile();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

function generateOrderCode() {
  return `#${Math.floor(100000 + Math.random() * 900000)}`;
}

function requireAdmin(req, res, next) {
  const password = req.header("x-admin-password");

  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      error: "Unauthorized.",
    });
  }

  next();
}

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "LoadingSMP backend is running.",
  });
});

app.post("/api/create-order", (req, res) => {
  try {
    const {
      username,
      email,
      discordUsername,
      paymentMethod,
      itemName,
      price,
      description,
    } = req.body;

    if (
      !username ||
      !email ||
      !discordUsername ||
      !paymentMethod ||
      !itemName ||
      !price
    ) {
      return res.status(400).json({
        error: "Missing required fields.",
      });
    }

    const orderCode = generateOrderCode();
    const createdAt = new Date().toISOString();

    const order = {
      orderCode,
      username: String(username),
      email: String(email),
      discordUsername: String(discordUsername),
      paymentMethod: String(paymentMethod),
      itemName: String(itemName),
      price: String(price),
      description:
        typeof description === "string" && description.trim()
          ? description
          : "No description provided.",
      status: "Pending",
      createdAt,
    };

    const orders = readOrders();
    orders.unshift(order);
    writeOrders(orders);

    return res.json({
      success: true,
      orderCode,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
});

app.get("/api/orders", requireAdmin, (req, res) => {
  try {
    const orders = readOrders();
    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Read orders error:", error);
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
});

app.patch("/api/orders/:orderCode", requireAdmin, (req, res) => {
  try {
    const orderCode = req.params.orderCode;
    const status = req.body.status;

    const allowedStatuses = ["Pending", "Paid", "Completed", "Cancelled"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status.",
      });
    }

    const orders = readOrders();
    const index = orders.findIndex((order) => order.orderCode === orderCode);

    if (index === -1) {
      return res.status(404).json({
        error: "Order not found.",
      });
    }

    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();

    writeOrders(orders);

    return res.json({
      success: true,
      order: orders[index],
    });
  } catch (error) {
    console.error("Update order error:", error);
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
});

app.get("/api/server-status", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.mcsrvstat.us/3/${encodeURIComponent(MINECRAFT_SERVER_ADDRESS)}`,
      {
        headers: {
          "User-Agent": "LoadingSMP Website Status Checker",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Failed to fetch server status.",
        details: data,
      });
    }

    return res.json(data);
  } catch (error) {
    console.error("Server status fetch error:", error);
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
});

app.listen(PORT, () => {
  ensureDataFile();
  console.log(`Backend running on port ${PORT}`);
});