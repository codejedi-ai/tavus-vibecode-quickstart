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
          
          // For direct conversation access, we don't require a token
          // The conversation URL itself contains the authentication
          try {
            console.log("Creating conversation object for direct access:", conversationId);
            
            // Create a conversation object with the ID from URL
            // The actual conversation_url will be provided by the Tavus API
            const conversation = {
              conversation_id: conversationId,
              conversation_name: `Direct Access - ${conversationId}`,
              status: "active" as const,
              conversation_url: `https://tavus.daily.co/${conversationId}`,
              created_at: new Date().toISOString(),
            };
            
            console.log("Direct conversation object created:", conversation);
            setConversation(conversation);
            setScreenState("conversation");
          } catch (error) {
            console.error("Failed to create direct conversation access:", error);
            setConversationError("Failed to access conversation");
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