import express from "express";

const app = express();
const PORT = process.env.PORT || 3001;

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const MINECRAFT_SERVER_ADDRESS =
  process.env.MINECRAFT_SERVER_ADDRESS || "loadinghsmpp.falix.dev";

// CORS + preflight fix
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

function generateOrderCode() {
  return `#${Math.floor(100000 + Math.random() * 900000)}`;
}

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "LoadingSMP backend is running.",
  });
});

app.post("/api/create-order", async (req, res) => {
  try {
    if (!DISCORD_WEBHOOK_URL) {
      return res.status(500).json({
        error: "Discord webhook is not configured on the server.",
      });
    }

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

    const createdAt = new Date().toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const safeDescription =
      typeof description === "string" && description.trim()
        ? description.slice(0, 1000)
        : "No description provided.";

    const webhookPayload = {
      embeds: [
        {
          title: "New Store Order",
          color: 0x8b5cf6,
          fields: [
            { name: "Order Code", value: orderCode, inline: true },
            { name: "Username", value: String(username), inline: true },
            { name: "Discord", value: String(discordUsername), inline: true },
            { name: "Email", value: String(email), inline: false },
            { name: "Package", value: String(itemName), inline: true },
            { name: "Price", value: String(price), inline: true },
            { name: "Payment Method", value: String(paymentMethod), inline: true },
            {
              name: "Description",
              value: safeDescription,
              inline: false,
            },
            { name: "Status", value: "Pending", inline: true },
            { name: "Created At", value: createdAt, inline: true },
          ],
          footer: {
            text: "Waiting for customer ticket and screenshot.",
          },
        },
      ],
    };

    const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!discordResponse.ok) {
      const text = await discordResponse.text();
      return res.status(500).json({
        error: "Failed to send Discord webhook.",
        details: text,
      });
    }

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
  console.log(`Backend running on port ${PORT}`);
});