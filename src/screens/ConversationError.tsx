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
import { ErrorIcon } from "@/components/ErrorIcon";

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
        <div className="flex flex-col items-center justify-center">
          <ErrorIcon 
            size={80} 
            className="mb-4 sm:mb-8 error-icon" 
          />
          <h2 className="mb-4 bg-text-primary bg-clip-text pt-1 text-center text-4.5xl text-transparent sm:max-w-[650px] sm:text-6.5xl lg:text-7xl">
            {getErrorTitle()}
          </h2>
          <p className="max-w-[650px] text-center text-base sm:text-lg mb-6 sm:mb-8">
            {getErrorMessage()}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
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
        </div>
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};