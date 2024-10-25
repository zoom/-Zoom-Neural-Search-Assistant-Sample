require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { handleZoomWebhook } = require('./src/zoom/zoomWebhookHandler');
const app = express();
const port = process.env.PORT || 4000;
const customEndpoint = process.env.BOT_NOTIFICATION_URL;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('OK');
});

app.post(customEndpoint, (req, res) => {
  handleZoomWebhook(req, res);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Listening for events on endpoint: ${customEndpoint}`);
});