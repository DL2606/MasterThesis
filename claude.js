console.log("✅ Loaded claude.js");

// Define the AJAX function for Anthropic
const ajaxCallClaude = (APIKey, endpoint, promptClaude) => {
  console.log("📡 Sending API Request to Anthropic...");
  return new Promise((resolve, reject) => {
    if (!APIKey || APIKey.trim() === '') {
      reject(new Error('🚨 API Key is missing or empty'));
      return;
    }

    fetch(endpoint, {
      method: "POST",
      headers: {
        "x-api-key": APIKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        temperature: 0.1,
        messages: [
          {
            role: "user",
            content: promptClaude  // Remove the array wrapping
          }
        ]
      })
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
        });
      }
      return response.json();
    })
    .then(response => {
      console.log("✅ API Response:", response);
      resolve(response);
    })
    .catch(error => {
      console.error("❌ API Request Failed!", error);
      reject(error);
    });
  });
};

// Rest of your code remains the same...
