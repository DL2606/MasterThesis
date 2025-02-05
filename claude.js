console.log("Using ajaxCall for Anthropic API");

const ajaxCallClaude = (apiKey, prompt) => {
  console.log("API Key:", apiKey);
  console.log("Prompt BEFORE API Call:", prompt);

  return new Promise((resolve, reject) => {
    if (!apiKey || apiKey.trim() === '') {
      reject(new Error('API Key is missing or empty'));
      return;
    }

    console.log("Sending request to Anthropic API...");

    $.ajax({
      url: "https://api.anthropic.com/v1/messages",
      type: "POST",
      processData: false,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.1,
      }),
      success: function (response) {
        console.log("API Response:", response);
        resolve(response);
      },
      error: function (xhr, status, error) {
        console.error("API Request Failed!", {
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
