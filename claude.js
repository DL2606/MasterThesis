const ajaxCall = (apiKey, prompt) => {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString();
    const dynamicPrompt = `${prompt}\n\nTimestamp: ${timestamp}`;
    
    console.log("API Key Length:", apiKey.length);
    console.log("API Key First/Last Chars:", 
      apiKey.substring(0,3) + "..." + apiKey.slice(-3)
    );
    console.log("Sending Prompt to Claude API:", dynamicPrompt);

    $.ajax({
      url: "https://api.anthropic.com/v1/messages",
      type: "POST",
      dataType: "json",
      contentType: "application/json", // Add this
      data: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        messages: [{ role: "user", content: dynamicPrompt }],
        max_tokens: 1000,
        temperature: 0.1,
      }),
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": apiKey,
      },
      success: function (response) {
        console.log("Full API Response Received:", response);
        if (!response || !response.content || !response.content[0]) {
          console.error("Unexpected API response format:", response);
          reject(new Error("Unexpected API response format."));
        }
        resolve(response);
      },
      error: function (xhr, status, error) {
        console.error("Comprehensive Error Details:", {
          status: xhr.status,
          statusText: xhr.statusText,
          responseText: xhr.responseText,
          error: error
        });
        const err = new Error(`XHR Error: ${error}`);
        err.status = xhr.status;
        err.response = xhr.responseText;
        reject(err);
      },
    });
  });
};
