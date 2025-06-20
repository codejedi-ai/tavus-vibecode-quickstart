# Tavus Vibecode Quickstart

## 🚀 Introduction

The fastest way to get started vibecoding with Tavus CVI. This React quickstart template provides everything you need to create interactive video experiences powered by Tavus's Conversational Video Interface technology.

<br></br>
## 🛠️ Tech Stack
- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
<br></br>
## 🧑‍💻 Try it Live
Spin up this template in under a minute with StackBlitz:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Tavus-Engineering/tavus-vibecode-quickstart?file=src%2FApp.tsx)

<br></br>
## ⚡ Quick Start

1. **Get your API credentials:**
   - Create an account on [Tavus Platform](https://platform.tavus.io/api-keys)
   - Generate your API token

2. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your Tavus API key
   VITE_TAVUS_API_KEY=your_tavus_api_key_here
   ```

3. **Run the template:**
   ```bash
   npm install
   npm run dev
   ```

4. **Customize your persona:**
   - Update the `persona_id` in the Settings screen with your own
   - Learn how to [create your own persona](https://docs.tavus.io/sections/conversational-video-interface/creating-a-persona) on the [Tavus Platform](https://platform.tavus.io/)

<br></br>
## 🔗 URL-Based Conversation Access

The application supports two modes of operation:

### 1. Normal Demo Flow
Access the application normally to start a new conversation:
```
https://your-app-url.com/
```

### 2. Direct Conversation Access
Join a specific conversation by appending the conversation_id as a URL parameter:
```
https://your-app-url.com/?conversation_id=your_conversation_id_here
```

When accessing a conversation directly:
- The app will automatically attempt to join the specified conversation
- If the conversation exists and is accessible, you'll be taken directly to the video chat
- If the conversation doesn't exist or there's an error, you'll be redirected to the normal intro flow
- The conversation_id will be automatically added to the URL when you start a new conversation for easy sharing

<br></br>
## 🔒 Security

This template uses environment variables to securely handle your Tavus API key. The API key is loaded from `VITE_TAVUS_API_KEY` environment variable and never exposed in the frontend code.

For production deployments:
- Never commit your `.env` file to version control
- Use your deployment platform's environment variable settings
- Consider implementing a backend service for additional security

<br></br>
## 📚 Resources

- [Tavus Documentation](https://docs.tavus.io/)
- [API Reference](https://docs.tavus.io/api-reference/)
- [Tavus Platform](https://platform.tavus.io/)
- [Daily React Reference](https://docs.daily.co/reference/daily-react)