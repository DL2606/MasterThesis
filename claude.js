const ajaxCall = (apiKey, prompt) => {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString();
    const dynamicPrompt = `${prompt}\n\nTimestamp: ${timestamp}`;

    console.log("Sending Prompt to API:", dynamicPrompt);

    $.ajax({
      url: "https://api.anthropic.com/v1/messages",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: dynamicPrompt
          }
        ],
        temperature: 0.8
      }),
      headers: {
        "Content-Type": "application/json",
        "x-anthropic-api-key": apiKey,
        "anthropic-version": "2024-01-01"
      },
      success: function (response) {
        console.log("Full API Response Received:", response);

        if (!response || !response.content || !response.content[0]) {
          console.error("Unexpected API response format:", response);
          throw new Error("Unexpected API response format.");
        }

        resolve(response);
      },
      error: function (xhr, status, error) {
        const err = new Error(`XHR Error: ${error}`);
        err.status = xhr.status;
        err.response = xhr.responseText;
        reject(err);
      },
    });
  });
};

(async function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      #root {
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Arial, sans-serif;
        color: #333;
        height: 100%;
        padding: 10px;
        text-align: center;
        box-sizing: border-box;
      }
    </style>
    <div id="root">Loading...</div>
  `;

  class MainWebComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    async post(apiKey, prompt) {
      const rootElement = this.shadowRoot.getElementById("root");
      try {
        rootElement.textContent = "Processing...";
        console.log("Received Prompt from SAC:", prompt);

        const response = await ajaxCall(apiKey, prompt);

        const text = response.content[0]?.text || "No valid response received.";
        rootElement.textContent = text.trim();
        return text.trim();
      } catch (error) {
        console.error("Error during API call:", error);
        let errorMessage = "Error occurred while processing the request.";
        if (error.status === 429) {
          errorMessage = "Rate limit exceeded. Please try again later.";
        } else if (error.status === 401) {
          errorMessage = "Invalid API key. Please check your credentials.";
        } else if (error.response) {
          errorMessage = `Error: ${error.response}`;
        }
        rootElement.textContent = errorMessage;
        throw error;
      }
    }

    connectedCallback() {
      this.shadowRoot.getElementById("root").textContent = "Claude 3.5 Sonnet Widget Ready.";
    }
  }

  customElements.define("custom-widget", MainWebComponent);
})();
