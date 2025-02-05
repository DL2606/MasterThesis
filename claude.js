console.log("✅ Loaded claude.js");

// Define the AJAX function for Anthropic
const ajaxCallClaude = (APIKey, promptClaude) => {
  console.log("📡 Sending API Request to Anthropic...");
  return new Promise((resolve, reject) => {
    if (!APIKey || APIKey.trim() === '') {
      reject(new Error('🚨 API Key is missing or empty'));
      return;
    }

    $.ajax({
      url: "https://api.anthropic.com/v1/messages",
      type: "POST",
      processData: false,
      contentType: "application/json",
      "anthropic-dangerous-direct-browser-access": "true",
      dataType: "json",
      data: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        messages: [{ role: "user", content: promptClaude }],
        max_tokens: 1000,
        temperature: 0.1,
      }),
      success: function (response) {
        console.log("✅ API Response:", response);
        resolve(response);
      },
      error: function (xhr, status, error) {
        console.error("❌ API Request Failed!", {
          status: xhr.status,
          statusText: xhr.statusText,
          responseText: xhr.responseText,
          error: error
        });
        reject(error);
      },
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

      // Use ajaxCallClaude (not ajaxCall)
      const response = await ajaxCallClaude(APIKey, promptClaude);
      const text = response.content || "No valid response received.";

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
