console.log("Using ajaxCall for Anthropic API")
const ajaxCallClaude = (apiKey, endpoint, prompt) => {
  return new Promise((resolve, reject) => {
    // Validate API key before making the call
    if (!apiKey || apiKey.trim() === '') {
      reject(new Error('API Key is missing or empty'));
      return;
    }

    $.ajax({
      url: endpoint,
          type: "POST",
          processData: false, // Prevent jQuery from processing data
          contentType: "application/json",
          dataType: "json",
          data: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
            temperature: 0.1,
  }),
      success: function (response) {
        resolve(response);
      },
      error: function (xhr, status, error) {
        // Detailed error logging
        console.error("Full Error Details:", {
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
