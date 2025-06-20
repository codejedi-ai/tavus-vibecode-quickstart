export const getConversation = async (
  token: string,
  conversationId: string
) => {
  try {
    const response = await fetch(
      `https://tavusapi.com/v2/conversations/${conversationId}`,
      {
        method: "GET",
        headers: {
          "x-api-key": token ?? "",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific conversation fetch errors
      if (response.status === 401) {
        throw new Error("Invalid access token - please check your API key");
      }
      
      if (response.status === 404) {
        throw new Error("Conversation not found - the conversation may have expired or been deleted");
      }
      
      if (response.status === 403) {
        throw new Error("Access forbidden - you don't have permission to access this conversation");
      }
      
      if (response.status >= 500) {
        throw new Error("Tavus service temporarily unavailable - please try again later");
      }
      
      throw new Error(`Failed to fetch conversation: ${errorData.message || `HTTP ${response.status}`}`);
    }

    const data = await response.json();
    
    // Validate the response data
    if (!data.conversation_id || !data.conversation_url) {
      throw new Error("Invalid conversation data - missing required fields");
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
};