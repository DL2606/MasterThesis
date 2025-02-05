const ajaxCall = (apiKey, prompt) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://api.anthropic.com/v1/messages",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        messages: [{
          role: "user",
          content: prompt
        }],
        max_tokens: 1000,
        temperature: 0.1,
      }),
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": apiKey
      },
      success: function (response) {
        if (response.content && response.content[0] && response.content[0].text) {
          resolve(response.content[0].text);
        } else {
          reject(new Error("Unexpected API response format"));
        }
      },
      error: function (xhr, status, error) {
        const err = new Error(`API Error: ${error}`);
        err.status = xhr.status;
        err.response = xhr.responseText;
        reject(err);
      },
    });
  });
};
