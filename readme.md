# Zoom-Neural-Search-Assistant-Sample

A Zoom Team Chat bot that combines Cerebras' Llama 3.1-8b model with Exa search capabilities to provide intelligent responses. The bot can search for current information when needed and maintain conversation context.

## Core Features

* Integration with Zoom Team Chat for message handling
* Cerebras Llama 3.1-8b model for response generation
* Exa neural search integration for current information
* Per-user conversation history tracking
* Automatic search decision system
* Response streaming for better performance

## Technical Components

### 1. Zoom Integration
* Handles incoming webhooks for chat messages
* Supports bot installation/uninstallation events
* Manages OAuth authentication
* Sends formatted responses back to Zoom

### 2. Cerebras Integration
* Uses Llama 3.1-8b model
* Maintains conversation context per user
* Streams responses for better performance
* Makes intelligent decisions about when to search

### 3. Exa Search
* Neural search with automatic prompt optimization
* Configures for 3 results per search
* Retrieves full text content
* Integrates search results into responses

## Setup Requirements

* Node.js (version 12 or later)
* Zoom Team Chat app credentials
* Cerebras API key
* Exa API key

## Environment Variables

Create a `.env` file with:

```
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_BOT_JID=your_zoom_bot_jid
ZOOM_WEBHOOK_SECRET_TOKEN=your_zoom_webhook_secret_token
CEREBRAS_API_KEY=your_cerebras_api_key
EXA_API_KEY=your_exa_api_key
BOT_NOTIFICATION_URL=your_custom_endpoint
PORT=4000
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/zoom/-Zoom-Neural-Search-Assistant-Sample
cd zoom-cerebras-chatbot
```

2. Install dependencies:

```bash
npm install
```

## Running the Bot

Start the server:

```bash
npm start
```

The server will:
* Run on the specified PORT (default: 4000)
* Listen for webhook events at BOT_NOTIFICATION_URL

## How It Works

### Message Reception
* Zoom sends webhook event to server
* System processes incoming message

### Response Generation
* Checks if current information is needed
* Performs Exa search if necessary
* Uses Cerebras to generate response
* Maintains conversation context
* Streams response back to Zoom

## Project Structure

* `index.js` - Main server setup
* `src/clients/cerebrasClient.js` - Cerebras integration and conversation management
* `src/clients/exaClient.js` - Exa search functionality
* `src/zoom/zoomAuth.js` - Zoom authentication
* `src/zoom/sendChatbotMessage.js` - Message sending to Zoom
* `src/zoom/zoomWebhookHandler.js` - Webhook event processing

## License

MIT License - See LICENSE file for details

## Author

Ojus Save