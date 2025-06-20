import { IConversation } from "@/types";
import { settingsAtom } from "@/store/settings";
import { getDefaultStore } from "jotai";
import { setConversationIdInUrl } from "@/utils/urlUtils";

export const createConversation = async (
  token: string,
): Promise<IConversation> => {
  // Get settings from Jotai store
  const settings = getDefaultStore().get(settingsAtom);
  
  // Add debug logs
  console.log('Creating conversation with settings:', settings);
  console.log('Greeting value:', settings.greeting);
  console.log('Context value:', settings.context);
  
  // Build the context string
  let contextString = "";
  if (settings.name) {
    contextString = `You are talking with the user, ${settings.name}. Additional context: `;
  }
  contextString += settings.context || "";
  
  const payload = {
    persona_id: settings.persona || "pd43ffef",
    custom_greeting: settings.greeting !== undefined && settings.greeting !== null 
      ? settings.greeting 
      : "Hey there! I'm your technical co-pilot! Let's get get started building with Tavus.",
    conversational_context: contextString
  };
  
  console.log('Sending payload to API:', payload);
  
  const response = await fetch("https://tavusapi.com/v2/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": token ?? "",
    },
    body: JSON.stringify(payload),
  });

  if (!response?.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Handle specific conversation creation errors
    if (response.status === 400) {
      if (errorData.message?.includes("persona")) {
        throw new Error("Invalid persona ID - please check your persona configuration");
      }
      if (errorData.message?.includes("quota") || errorData.message?.includes("limit")) {
        throw new Error("Account quota exceeded - please check your Tavus account limits");
      }
      throw new Error(`Invalid conversation request: ${errorData.message || 'Bad request'}`);
    }
    
    if (response.status === 401) {
      throw new Error("Invalid access token - please check your API key");
    }
    
    if (response.status === 403) {
      throw new Error("Access forbidden - please check your account permissions");
    }
    
    if (response.status === 429) {
      throw new Error("Rate limit exceeded - please try again in a moment");
    }
    
    if (response.status >= 500) {
      throw new Error("Tavus service temporarily unavailable - please try again later");
    }
    
    throw new Error(`Failed to create conversation: ${errorData.message || `HTTP ${response.status}`}`);
  }

  const data = await response.json();
  
  // Validate the response data
  if (!data.conversation_id || !data.conversation_url) {
    throw new Error("Invalid conversation response - missing required fields");
  }
  
  // Add conversation_id to URL for sharing/bookmarking
  if (data.conversation_id) {
    setConversationIdInUrl(data.conversation_id);
  }
  
  return data;
};