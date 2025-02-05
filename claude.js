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
        model: "claude-3-5-haiku-20241022",
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

// Define the custom web component
class MainWebComponent extends HTMLElement { 
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const rootElement = document.createElement("div");
    rootElement.id = "root";
    rootElement.textContent = "Claude Widget Ready!";
    this.shadowRoot.appendChild(rootElement);
  }

  async post(APIKey, promptClaude) {
    const rootElement = this.shadowRoot.getElementById("root");
    try {
      rootElement.textContent = "Processing...";
      console.log("📩 Received promptClaude from SAC:", promptClaude);
      const response = await ajaxCallClaude(APIKey, "https://api.anthropic.com/v1/messages", promptClaude);
      const text = response.content[0].text || "No valid response received.";
      rootElement.textContent = text.trim();
      return text.trim();
    } catch (error) {
      console.error("❌ Error during API call:", error);
      let errorMessage = "Error occurred while processing the request.";
      if (error.status === 429) {
        errorMessage = "⚠️ Rate limit exceeded. Please try again later.";
      } else if (error.status === 401) {
        errorMessage = "🔑 Invalid API key. Please check your credentials.";
      } else if (error.response) {
        errorMessage = `Error: ${error.response}`;
      }
      rootElement.textContent = errorMessage;
      throw error;
    }
  }

  connectedCallback() {
    this.shadowRoot.getElementById("root").textContent = "Claude 3.5 Widget Ready!";
  }
}

customElements.define("custom-widget", MainWebComponent);
