const ajaxCall = (apiKey, prompt, retries = 10, delay = 2000) => {
  return new Promise((resolve, reject) => {
    const attempt = (retryCount) => {
      $.ajax({
        url: "https://api.openai.com/v1/chat/completions",
        type: "POST",
        dataType: "json",
        data: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1024,
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
          if (xhr.status === 429 && retryCount > 0) {
            // Retry after a delay if the rate limit is exceeded
            console.log(`Rate limit exceeded. Retrying in ${delay / 1000} seconds...`);
            setTimeout(() => attempt(retryCount - 1), delay);
          } else {
            const err = new Error(`XHR Error: ${error}`);
            err.status = xhr.status;
            err.response = xhr.responseText;
            reject(err);
          }
        },
      });
    };

    attempt(retries);  // Start the first attempt
  });
};
