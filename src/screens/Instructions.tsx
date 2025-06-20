import { createConversation } from "@/api";
import {
  DialogWrapper,
  AnimatedTextBlockWrapper,
  StaticTextBlockWrapper,
} from "@/components/DialogWrapper";
import { screenAtom } from "@/store/screens";
import { conversationAtom } from "@/store/conversation";
import React, { useCallback, useMemo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { AlertTriangle, Mic, Video } from "lucide-react";
import { useDaily, useDailyEvent, useDevices } from "@daily-co/daily-react";
import { ConversationError } from "./ConversationError";
import zoomSound from "@/assets/sounds/zoom.mp3";
import { Button } from "@/components/ui/button";
import { apiTokenAtom, tokenValidationAtom, isValidatingTokenAtom } from "@/store/tokens";
import { validateToken } from "@/api";
import { quantum } from 'ldrs';
import gloriaVideo from "@/assets/video/gloria.mp4";
import { ErrorIcon } from "@/components/ErrorIcon";

// Register the quantum loader
quantum.register();

const useCreateConversationMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setScreenState] = useAtom(screenAtom);
  const [, setConversation] = useAtom(conversationAtom);
  const token = useAtomValue(apiTokenAtom);

  const createConversationRequest = async () => {
    try {
      if (!token) {
        throw new Error("No access token configured");
      }

      // Validate token before creating conversation
      const validation = await validateToken(token);
      if (!validation.valid) {
        if (validation.error === "Invalid access token") {
          throw new Error("Invalid access token - please check your API key");
        }
        throw new Error(validation.error || "Token validation failed");
      }

      const conversation = await createConversation(token);
      setConversation(conversation);
      setScreenState({ currentScreen: "conversation" });
    } catch (error) {
      console.error("Conversation creation error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      throw error; // Re-throw to be caught by the calling function
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createConversationRequest,
  };
};

export const Instructions: React.FC = () => {
  const daily = useDaily();
  const { currentMic, setMicrophone, setSpeaker } = useDevices();
  const { createConversationRequest, error: conversationError } = useCreateConversationMutation();
  const [getUserMediaError, setGetUserMediaError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [error, setError] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const token = useAtomValue(apiTokenAtom);
  const [tokenValidation] = useAtom(tokenValidationAtom);
  const [isValidatingToken] = useAtom(isValidatingTokenAtom);
  
  const audio = useMemo(() => {
    const audioObj = new Audio(zoomSound);
    audioObj.volume = 0.7;
    return audioObj;
  }, []);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  useDailyEvent(
    "camera-error",
    useCallback(() => {
      setGetUserMediaError(true);
    }, []),
  );

  const handleClick = async () => {
    try {
      setIsLoading(true);
      setTokenError(null);
      setError(false);
      setIsPlayingSound(true);
      
      audio.currentTime = 0;
      await audio.play();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsPlayingSound(false);
      setIsLoadingConversation(true);
      
      let micDeviceId = currentMic?.device?.deviceId;
      if (!micDeviceId) {
        const res = await daily?.startCamera({
          startVideoOff: false,
          startAudioOff: false,
          audioSource: "default",
        });
        // @ts-expect-error deviceId exists in the MediaDeviceInfo
        const isDefaultMic = res?.mic?.deviceId === "default";
        // @ts-expect-error deviceId exists in the MediaDeviceInfo
        const isDefaultSpeaker = res?.speaker?.deviceId === "default";
        // @ts-expect-error deviceId exists in the MediaDeviceInfo
        micDeviceId = res?.mic?.deviceId;

        if (isDefaultMic) {
          if (!isDefaultMic) {
            setMicrophone("default");
          }
          if (!isDefaultSpeaker) {
            setSpeaker("default");
          }
        }
      }
      if (micDeviceId) {
        await createConversationRequest();
      } else {
        setGetUserMediaError(true);
      }
    } catch (error) {
      console.error("Video chat start error:", error);
      
      // Handle token-specific errors
      if (error instanceof Error) {
        if (error.message.includes("Invalid access token")) {
          setTokenError("Invalid access token - please check your API key on the Tavus Platform");
        } else if (error.message.includes("No access token")) {
          setTokenError("No access token configured - please set VITE_TAVUS_API_KEY in your .env file");
        } else if (error.message.includes("persona")) {
          setTokenError("Invalid persona configuration - please check your persona ID in settings");
        } else if (error.message.includes("quota") || error.message.includes("limit")) {
          setTokenError("Account quota exceeded - please check your Tavus account limits");
        } else if (error.message.includes("Rate limit")) {
          setTokenError("Rate limit exceeded - please try again in a moment");
        } else if (error.message.includes("service temporarily unavailable")) {
          setTokenError("Tavus service temporarily unavailable - please try again later");
        } else {
          setTokenError(error.message);
        }
      } else {
        setTokenError("An unexpected error occurred");
      }
      
      setError(true);
    } finally {
      setIsLoading(false);
      setIsLoadingConversation(false);
    }
  };

  if (isPlayingSound || isLoadingConversation) {
    return (
      <DialogWrapper>
        <video
          src={gloriaVideo}
          autoPlay
          muted
          loop
          playsInline
          className="fixed inset-0 h-full w-full object-cover"
        />
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <AnimatedTextBlockWrapper>
          <div className="flex flex-col items-center justify-center gap-4">
            <l-quantum
              size="45"
              speed="1.75"
              color="white"
            ></l-quantum>
          </div>
        </AnimatedTextBlockWrapper>
      </DialogWrapper>
    );
  }

  if (error || tokenError || conversationError) {
    return (
      <DialogWrapper>
        <AnimatedTextBlockWrapper>
          <div className="flex flex-col items-center justify-center">
            <ErrorIcon 
              size={80} 
              className="mb-4 sm:mb-8 error-icon" 
            />
            <h2 className="mb-4 bg-text-primary bg-clip-text pt-1 text-center text-4.5xl text-transparent sm:max-w-[650px] sm:text-6.5xl lg:text-7xl">
              Connection Error
            </h2>
            <p className="max-w-[650px] text-center text-base sm:text-lg mb-6 sm:mb-8">
              {tokenError || conversationError || "We're having trouble connecting. Please try again in a few moments."}
            </p>
            <Button onClick={handleClick} className="flex items-center gap-2">
              <Video className="size-5" /> Try Again
            </Button>
          </div>
        </AnimatedTextBlockWrapper>
      </DialogWrapper>
    );
  }

  // Check if we can start the demo
  const canStartDemo = token && (tokenValidation?.valid === true || !tokenValidation) && !isValidatingToken;

  return (
    <DialogWrapper>
      <video
        src={gloriaVideo}
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 h-full w-full object-cover"
      />
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <AnimatedTextBlockWrapper>
        <h1 
          className="mb-4 pt-1 text-center text-3xl sm:text-4xl lg:text-5xl font-semibold"
          style={{
            fontFamily: 'Source Code Pro, monospace'
          }}
        >
          <span className="text-white">See AI?</span>{" "}
          <span style={{
            color: '#9EEAFF'
          }}>Act Natural.</span>
        </h1>
        <p className="max-w-[650px] text-center text-base sm:text-lg text-gray-400 mb-12">
          Have a face-to-face conversation with an AI so real, it feels human—an intelligent agent ready to listen, respond, and act across countless use cases.
        </p>
        
        {/* Token validation warning */}
        {(!token || tokenValidation?.valid === false) && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-center max-w-md">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="size-5 text-red-400" />
              <span className="text-red-400 font-semibold">API Key Issue</span>
            </div>
            <p className="text-sm text-red-200">
              {!token 
                ? "No API key configured. Please set VITE_TAVUS_API_KEY in your .env file."
                : tokenValidation?.error === "Invalid access token"
                ? "Invalid API key. Please check your key on the Tavus Platform."
                : "API key validation failed. Please check your configuration."
              }
            </p>
          </div>
        )}

        <Button
          onClick={handleClick}
          className="relative z-20 flex items-center justify-center gap-2 rounded-3xl border border-[rgba(255,255,255,0.3)] px-8 py-2 text-sm text-white transition-all duration-200 hover:text-primary mb-12 disabled:opacity-50"
          disabled={isLoading || !canStartDemo}
          style={{
            height: '48px',
            transition: 'all 0.2s ease-in-out',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
          onMouseEnter={(e) => {
            if (canStartDemo) {
              e.currentTarget.style.boxShadow = '0 0 15px rgba(34, 197, 254, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Video className="size-5" />
          Start Video Chat
          {getUserMediaError && (
            <div className="absolute -top-1 left-0 right-0 flex items-center gap-1 text-wrap rounded-lg border bg-red-500 p-2 text-white backdrop-blur-sm">
              <AlertTriangle className="text-red size-4" />
              <p>
                To chat with the AI, please allow microphone access. Check your
                browser settings.
              </p>
            </div>
          )}
        </Button>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:gap-8 text-gray-400 justify-center">
          <div className="flex items-center gap-3 bg-[rgba(0,0,0,0.2)] px-4 py-2 rounded-full">
            <Mic className="size-5 text-primary" />
            Mic access is required
          </div>
          <div className="flex items-center gap-3 bg-[rgba(0,0,0,0.2)] px-4 py-2 rounded-full">
            <Video className="size-5 text-primary" />
            Camera access is required
          </div>
        </div>
        <span className="absolute bottom-6 px-4 text-sm text-gray-500 sm:bottom-8 sm:px-8 text-center">
          By starting a conversation, I accept the{' '}
          <a href="#" className="text-primary hover:underline">Terms of Use</a> and acknowledge the{' '}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
        </span>
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};

export const PositiveFeedback: React.FC = () => {
  return (
    <DialogWrapper>
      <AnimatedTextBlockWrapper>
        <StaticTextBlockWrapper
          imgSrc="/images/positive.png"
          title="Great Conversation!"
          titleClassName="sm:max-w-full bg-[linear-gradient(91deg,_#43BF8F_16.63%,_#FFF_86.96%)]"
          description="Thanks for the engaging discussion. Feel free to come back anytime for another chat!"
        />
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};