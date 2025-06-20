# Tavus Vibecode Quickstart

## 🚀 Introduction

The fastest way to get started vibecoding with Tavus CVI. This React quickstart template provides everything you need to create interactive video experiences powered by Tavus's Conversational Video Interface technology.

> ⚠️ **Security Note**: This template uses environment variables to securely handle your Tavus API key. The API key is never exposed in the frontend code and is loaded from environment variables only.

<br></br>
## 🛠️ Tech Stack
- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Daily.co for WebRTC
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
   - Click the settings gear icon (⚙️) to access configuration options
   - Update the `persona_id` with your own custom persona
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

**How URL routing works:**
- When accessing a conversation directly, the app automatically attempts to join the specified conversation
- If the conversation exists and is accessible, you'll be taken directly to the fullscreen video chat
- If the conversation doesn't exist or there's an error, you'll be redirected to the normal intro flow
- The conversation_id is automatically added to the URL when you start a new conversation for easy sharing
- URL routing works regardless of API key status (useful for server-side configurations)

<br></br>
## 🎥 Fullscreen Video Experience

The conversation interface has been designed for maximum immersion:

- **Fullscreen Layout**: Video chat takes up the entire screen without header/footer distractions
- **Overlaid Controls**: Settings gear icon (⚙️) is positioned over the video in the top-right corner
- **Responsive Design**: Optimized for all screen sizes from mobile to desktop
- **Picture-in-Picture**: Your local video appears as a small overlay in the bottom-right
- **Control Bar**: Audio/video toggle and end call buttons are centered at the bottom

<br></br>
## ⚙️ Settings & Configuration

Access the settings panel by clicking the gear icon (⚙️) in the top-right corner during any screen:

### Available Settings:
- **Your Name**: Personalize the conversation context
- **Language**: Choose from multiple supported languages
- **Interrupt Sensitivity**: Control how easily the AI can be interrupted
- **Custom Greeting**: Set a personalized greeting message
- **Custom Context**: Provide additional context for the conversation
- **Persona ID**: Use your own custom Tavus persona
- **Replica ID**: Configure specific replica settings
- **API Token Status**: View current API key configuration status

### API Key Management:
- API keys are managed via environment variables only
- Settings screen shows API key status (configured/not configured)
- Green indicator = API key is properly configured
- Red indicator = API key is missing or invalid

<br></br>
## 🔒 Security & Environment Setup

### Environment Variables
Create a `.env` file in your project root:
```bash
# Required: Your Tavus API key
VITE_TAVUS_API_KEY=your_tavus_api_key_here
```

### Security Best Practices:
- **Never commit** your `.env` file to version control
- API keys are loaded from environment variables only
- No API key input fields in the UI for enhanced security
- Use your deployment platform's environment variable settings for production

### Production Deployment:
Most hosting platforms support environment variables:

**Vercel:**
```bash
vercel env add VITE_TAVUS_API_KEY
```

**Netlify:**
Add environment variables in Site Settings → Environment Variables

**Railway/Render/Heroku:**
Use their respective environment variable configuration panels

<br></br>
## 🚨 Troubleshooting

### Common Issues:

**"API Key Required" Message:**
- Ensure `VITE_TAVUS_API_KEY` is set in your `.env` file
- Restart your development server after adding environment variables
- Check that your API key is valid on the [Tavus Platform](https://platform.tavus.io/api-keys)

**Direct Conversation Access Not Working:**
- Verify the conversation_id exists and is accessible
- Check that your API key has permissions for the conversation
- Ensure the conversation hasn't expired or been terminated

**Video/Audio Issues:**
- Grant camera and microphone permissions in your browser
- Check browser compatibility (Chrome/Firefox/Safari recommended)
- Ensure you're using HTTPS in production (required for WebRTC)

<br></br>
## 📚 Resources

- [Tavus Documentation](https://docs.tavus.io/)
- [API Reference](https://docs.tavus.io/api-reference/)
- [Tavus Platform](https://platform.tavus.io/)
- [Daily React Reference](https://docs.daily.co/reference/daily-react)
- [Creating Custom Personas](https://docs.tavus.io/sections/conversational-video-interface/creating-a-persona)

<br></br>
## 🤝 Contributing

This is a quickstart template designed to get you up and running quickly. Feel free to:
- Fork the repository and customize for your needs
- Submit issues for bugs or feature requests
- Share your implementations and use cases

---

**Happy vibecoding with Tavus! 🚀**