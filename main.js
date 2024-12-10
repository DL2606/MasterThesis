const ajaxCall = (apiKey, prompt) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: "https://api.openai.com/v1/completions",
        type: "POST",
        dataType: "json",
        data: JSON.stringify({
          model: "text-davinci-003",
          prompt: prompt,
          max_tokens: 1024,
          n: 1,
          temperature: 0.5,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        success: function (response) {
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
  
  (function () {
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
          const response = await ajaxCall(apiKey, prompt);
          const text = response.choices?.[0]?.text || "No response available.";
          rootElement.textContent = text.trim();
          return text.trim();
        } catch (error) {
          console.error("Error during API call:", error);
          rootElement.textContent = "Error occurred while processing the request.";
          throw error;
        }
      }
  
      connectedCallback() {
        this.shadowRoot.getElementById("root").textContent =
          "Custom ChatGPT Widget Ready.";
      }
    }
  
    customElements.define("custom-widget", MainWebComponent);
  })();
  