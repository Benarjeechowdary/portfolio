const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the website directory
app.use(express.static(path.join(__dirname, "website")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/projects", express.static(path.join(__dirname, "projects")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Handle SPA routing - serve index.html for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "website", "index.html"));
});

app.listen(PORT, () => {
  console.log(
    `🚀 Data Analyst Portfolio server running on http://localhost:${PORT}`
  );
  console.log(`📁 Serving files from: ${path.join(__dirname, "website")}`);
  console.log("🎯 Ready for development!");
});

module.exports = app;
