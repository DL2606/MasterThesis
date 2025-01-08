import Anthropic from '@anthropic-ai/sdk';

const ajaxCall = async (apiKey, prompt) => {
  const anthropic = new Anthropic({
    apiKey: apiKey, // Use the passed apiKey
  });

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 10000,
      messages: [{ role: "user", content: prompt }], // Use the passed prompt
    });

    console.log(msg);
    return msg; // Return the response
  } catch (error) {
    console.error("Error while making API call:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};
