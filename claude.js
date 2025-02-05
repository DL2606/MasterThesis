const ajaxCall = (apiKey, prompt) => {
  return new Promise((resolve, reject) => {
    // Validate API key before making the call
    if (!apiKey || apiKey.trim() === '') {
      reject(new Error('API Key is missing or empty'));
      return;
    }

    $.ajax({
      url: "https://api.anthropic.com/v1/messages",
      type: "POST",
      xhrFields: {
        withCredentials: false // Ensure no unexpected credentials
      },
      dataType: "json",
      data: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.1,
      }),
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": apiKey.trim() // Trim any whitespace
      },
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
