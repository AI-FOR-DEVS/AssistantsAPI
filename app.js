import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
})

// Step 1: Create an assistant

const assistant = await openai.beta.assistants.create({
  name: 'Math Tutor',
  instructions:
    'You are a personal math tutor. Write and run code to answer math questions.',
  tools: [{ type: 'code_interpreter' }],
  model: 'gpt-4-1106-preview',
})

// Step 2: Create a thread

const thread = await openai.beta.threads.create()


// Step 3: Create a message

const message = await openai.beta.threads.messages.create(thread.id, {
  role: 'user',
  content: 'I need to solve the equation `3x + 11 = 14`. Can you help me?',
})

// Step 4: Create a run

const run = await openai.beta.threads.runs.create(thread.id, {
  assistant_id: assistant.id,
  instructions:
    'Please address the user as Jane Doe. The user has a premium account.',
})

// Step 5: Wait and log out the messages

let runStatus = null

while (runStatus !== 'completed') {
  const currentRun = await openai.beta.threads.runs.retrieve(thread.id, run.id)
  runStatus = currentRun.status

  await new Promise((resolve) => setTimeout(resolve, 1000)) 
}

const messages = await openai.beta.threads.messages.list(thread.id)

messages.body.data.forEach((message) => {
  console.log(message.content)
})
