import AudioButton from "@/components/AudioButton";
import {
  AnimatedTextBlockWrapper,
  DialogWrapper,
  StaticTextBlockWrapper,
} from "@/components/DialogWrapper";
import { RefreshCcw, Home } from "lucide-react";
import React from "react";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { removeConversationIdFromUrl, isBogusConversationUrl } from "@/utils/urlUtils";

export const ConversationError: React.FC<{ 
  onClick?: () => void;
  error?: string;
}> = ({
  onClick,
  error
}) => {
  const [, setScreenState] = useAtom(screenAtom);

  const handleRetry = () => {
    if (onClick) {
      onClick();
    } else {
      // Reload the page to retry
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    removeConversationIdFromUrl();
    setScreenState({ currentScreen: "intro" });
  };

  const getErrorMessage = () => {
    if (error) {
      // Check if this is a bogus URL error
      if (error.includes("The meeting you're trying to join does not exist")) {
        return error;
      }
      if (error.includes("not found")) {
        return "This conversation could not be found. It may have expired or been deleted.";
      }
      if (error.includes("Invalid access token")) {
        return "Invalid API key. Please check your Tavus API configuration.";
      }
      if (error.includes("Access forbidden")) {
        return "You don't have permission to access this conversation.";
      }
      if (error.includes("service temporarily unavailable")) {
        return "The Tavus service is temporarily unavailable. Please try again in a few moments.";
      }
      return error;
    }
    return "We're having trouble connecting to this conversation. Please try again in a few moments.";
  };

  const getErrorTitle = () => {
    if (error?.includes("The meeting you're trying to join does not exist")) {
      return "Meeting Not Found";
    }
    if (error?.includes("not found")) {
      return "Conversation Not Found";
    }
    if (error?.includes("Invalid access token")) {
      return "Authentication Error";
    }
    if (error?.includes("Access forbidden")) {
      return "Access Denied";
    }
    if (error?.includes("service temporarily unavailable")) {
      return "Service Unavailable";
    }
    return "Connection Error";
  };

  const shouldShowRetryButton = () => {
    // Don't show retry button for bogus URLs since retrying won't help
    return !error?.includes("The meeting you're trying to join does not exist");
  };

  return (
    <DialogWrapper>
      <AnimatedTextBlockWrapper>
        <StaticTextBlockWrapper
          title={getErrorTitle()}
          titleClassName="sm:max-w-full"
          description={getErrorMessage()}
        >
          <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:mt-8">
            {shouldShowRetryButton() && (
              <AudioButton onClick={handleRetry} className="flex items-center gap-2">
                <RefreshCcw className="size-5" /> Try Again
              </AudioButton>
            )}
            <AudioButton 
              onClick={handleGoHome} 
              className="flex items-center gap-2"
              variant="outline"
            >
              <Home className="size-5" /> Go Home
            </AudioButton>
          </div>
        </StaticTextBlockWrapper>
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};