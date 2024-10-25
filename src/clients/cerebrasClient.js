const axios = require('axios');
const { getChatbotToken } = require('../zoom/zoomAuth');
const { sendChatToZoom } = require('../zoom/sendChatbotMessage');
const { performExaSearch } = require('./exaClient');

let conversationHistory = {};

async function callCerebrasAPI(payload) {
  try {
    const userJid = payload.toJid;
    const history = conversationHistory[userJid] || [];
    
    const needsSearch = await getDecision(createDecisionRequest(payload.cmd));
    
    let searchContext = '';
    if (needsSearch) {
      const searchResults = await performExaSearch(payload.cmd);
      searchContext = `Here is what I found from searching: ${searchResults}\n\nBased on this information, `;
    }

    const responseRequestData = createResponseRequest(history, searchContext, payload.cmd);
    const completion = await streamCerebrasResponse(responseRequestData);

    conversationHistory[userJid] = [
      ...responseRequestData.messages,
      { role: 'assistant', content: completion }
    ];

    const chatbotToken = await getChatbotToken();
    await sendChatToZoom(chatbotToken, completion, payload);
  } catch (error) {
    console.error('Error calling Cerebras API:', error);
  }
}

function createDecisionRequest(cmd) {
  return {
    model: 'llama3.1-8b',
    messages: [
      { 
        role: 'system', 
        content: `You are an expert AI assistant with access to current information through Exa search.
        When a user asks about current events, sports, or real-time information:
        1. Output "SEARCH" on first line
        2. Format a precise search query on second line
        3. Never apologize or mention limitations`
      },
      { role: 'user', content: cmd }
    ],
    max_tokens: 100,
    stream: true
  };
}

function createResponseRequest(history, searchContext, cmd) {
  return {
    model: 'llama3.1-8b',
    messages: [
      { 
        role: 'system', 
        content: `You are a helpful assistant with access to current information.
        When given search results:
        - Extract the relevant information
        - Present it clearly and directly
        - Focus on answering the specific question
        - Never apologize or mention being an AI model
        - If search results aren't helpful, suggest checking official sources`
      },
      ...history,
      { role: 'user', content: searchContext + cmd }
    ],
    max_tokens: 500,
    stream: true
  };
}

async function streamCerebrasResponse(requestData) {
  const response = await axios.post('https://api.cerebras.ai/v1/chat/completions', 
    requestData, 
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`,
      },
      responseType: 'stream'
    }
  );

  let completion = '';
  for await (const chunk of response.data) {
    const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
    for (const line of lines) {
      const trimmedLine = line.replace(/^data: /, '');
      if (trimmedLine !== '[DONE]') {
        try {
          const parsed = JSON.parse(trimmedLine);
          const content = parsed.choices[0]?.delta?.content;
          if (content) completion += content;
        } catch (parseError) {
          console.log('Skipping malformed JSON chunk:', trimmedLine);
          continue;
        }
      }
    }
  }
  return completion;
}

async function getDecision(requestData) {
  const completion = await streamCerebrasResponse(requestData);
  return completion.trim().toUpperCase() === 'SEARCH';
}

module.exports = { callCerebrasAPI };
