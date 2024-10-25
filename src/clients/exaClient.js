const axios = require('axios');

async function performExaSearch(query) {
  console.log('\nSending query to Exa:', query);
  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.exa.ai/search',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-api-key': process.env.EXA_API_KEY
      },
      data: {
        query: query,
        type: 'neural',
        useAutoprompt: true,
        numResults: 3,
        contents: {
          text: true
        }
      }
    });
    
    console.log('\nReceived response from Exa:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.results) {
      return response.data.results
        .map(result => result.text)
        .join('\n');
    }
    return '';
  } catch (error) {
    console.log('Exa search failed:', error.message);
    return '';
  }
}

module.exports = { performExaSearch };
