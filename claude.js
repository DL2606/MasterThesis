const ajaxCall = (apiKey, prompt) => {
  return fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      messages: [{
        role: "user",
        content: prompt
      }],
      max_tokens: 1000,
      temperature: 0.1,
    })
  })
  .then(response => response.json())
  .then(data => data.content[0].text);
};
