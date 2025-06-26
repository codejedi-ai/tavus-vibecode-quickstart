import React, { useEffect, useState } from "react";
import { healthCheckApi, getConversation, validateToken } from "@/api";
import { screenAtom } from "@/store/screens";
import { conversationAtom } from "@/store/conversation";
import { tokenValidationAtom, isValidatingTokenAtom } from "@/store/tokens";
import { useAtom, useAtomValue } from "jotai";
import { quantum } from 'ldrs';
import { 
  getConversationIdFromUrl, 
  isDirectConversationAccess, 
  isBogusConversationUrl,
  getBogusConversationId 
} from "@/utils/urlUtils";
import { apiTokenAtom } from "@/store/tokens";

const screens = {
  error: "outage",
  success: "intro",
  outOfTime: "outOfMinutes",
  conversation: "conversation",
  conversationError: "conversationError",
} as const;

const useHealthCheck = () => {
  const [screenState, setScreenState] = useState<keyof typeof screens | null>(
    null,
  );
  const [, setConversation] = useAtom(conversationAtom);
  const [, setTokenValidation] = useAtom(tokenValidationAtom);
  const [, setIsValidating] = useAtom(isValidatingTokenAtom);
  const [conversationError, setConversationError] = useState<string | null>(null);
  const token = useAtomValue(apiTokenAtom);

  const healthCheck = async (): Promise<void> => {
    try {
      console.log("Starting health check...");
      const response = await healthCheckApi();
      
      if (response?.status) {
        console.log("Health check passed");
        
        // Check for bogus conversation URL first
        if (isBogusConversationUrl()) {
          const bogusId = getBogusConversationId();
          console.log("Bogus conversation URL detected:", bogusId);
          setConversationError(`The meeting you're trying to join does not exist for ${window.location.origin}/${bogusId}.`);
          setScreenState("conversationError");
          return;
        }

        // Check if there's a conversation_id in the URL
        const conversationId = getConversationIdFromUrl();
        console.log("Conversation ID from URL:", conversationId);
        
        if (conversationId) {
          console.log("Direct conversation access detected");
          
          if (!token) {
            console.log("No token available for conversation access");
            setConversationError("No access token configured - please set VITE_TAVUS_API_KEY in your .env file");
            setScreenState("conversationError");
            return;
          }

          // Validate token first for direct conversation access
          setIsValidating(true);
          try {
            console.log("Validating token for conversation access...");
            const validation = await validateToken(token);
            setTokenValidation(validation);
            
            if (!validation.valid) {
              console.log("Token validation failed:", validation.error);
              setConversationError(validation.error === "Invalid access token" 
                ? "Invalid access token - please check your API key" 
                : `Token validation failed: ${validation.error}`);
              setScreenState("conversationError");
              return;
            }
            
            console.log("Token validated successfully, fetching conversation...");
          } catch (error) {
            console.error("Token validation error:", error);
            setTokenValidation({ valid: false, error: "Validation failed" });
            setConversationError("Failed to validate API token");
            setScreenState("conversationError");
            return;
          } finally {
            setIsValidating(false);
          }

          // Try to fetch the conversation
          try {
            console.log("Fetching conversation:", conversationId);
            const conversation = await getConversation(token, conversationId);
            console.log("Conversation fetched successfully:", conversation);
            setConversation(conversation);
            setScreenState("conversation");
          } catch (error) {
            console.error("Failed to load conversation:", error);
            
            // Store the conversation error for display
            if (error instanceof Error) {
              setConversationError(error.message);
            } else {
              setConversationError("Failed to load conversation");
            }
            
            // Set screen to show conversation error
            setScreenState("conversationError");
          }
        } else {
          console.log("No conversation ID in URL, proceeding to normal flow");
          
          // Normal flow - validate token if available
          if (token) {
            setIsValidating(true);
            try {
              const validation = await validateToken(token);
              setTokenValidation(validation);
            } catch (error) {
              setTokenValidation({ valid: false, error: "Validation failed" });
            } finally {
              setIsValidating(false);
            }
          } else {
            setTokenValidation({ valid: false, error: "No access token" });
          }
          
          setScreenState("success");
        }
      } else {
        console.log("Health check failed");
        setScreenState("error");
      }
    } catch (error) {
      console.error("Health check error:", error);
      setScreenState("error");
    }
  };

  useEffect(() => {
    healthCheck();
  }, []);

  return { screenState, conversationError };
};

quantum.register();

export const IntroLoading: React.FC = () => {
  const { screenState, conversationError } = useHealthCheck();
  const [, setScreenState] = useAtom(screenAtom);

  useEffect(() => {
    if (screenState !== null) {
      const timer = setTimeout(() => {
        if (screenState === "conversationError") {
          // Pass the error to the conversation error screen
          setScreenState({ 
            currentScreen: "conversationError",
            error: conversationError 
          });
        } else {
          setScreenState({ currentScreen: screens[screenState] });
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [screenState, conversationError]);

  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <l-quantum
        size="45"
        speed="1.75"
        color="white"
      ></l-quantum>
    </div>
  );
};