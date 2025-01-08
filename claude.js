import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: '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', // defaults to process.env["ANTHROPIC_API_KEY"]
});

const msg = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello, Claude" }],
});
console.log(msg);
