import { AnimatedWrapper } from "@/components/DialogWrapper";
import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { Play, Lock, AlertTriangle } from "lucide-react";
import AudioButton from "@/components/AudioButton";
import { apiTokenAtom, tokenValidationAtom, isValidatingTokenAtom } from "@/store/tokens";
import { validateToken } from "@/api";
import gloriaVideo from "@/assets/video/gloria.mp4";
import { quantum } from 'ldrs';

quantum.register();

export const Intro: React.FC = () => {
  const [, setScreenState] = useAtom(screenAtom);
  const [token] = useAtom(apiTokenAtom);
  const [tokenValidation, setTokenValidation] = useAtom(tokenValidationAtom);
  const [isValidating, setIsValidating] = useAtom(isValidatingTokenAtom);

  // Validate token on component mount
  useEffect(() => {
    const validateApiToken = async () => {
      if (!token) {
        setTokenValidation({ valid: false, error: "No access token" });
        return;
      }

      setIsValidating(true);
      try {
        const validation = await validateToken(token);
        setTokenValidation(validation);
      } catch (error) {
        setTokenValidation({ valid: false, error: "Validation failed" });
      } finally {
        setIsValidating(false);
      }
    };

    validateApiToken();
  }, [token, setTokenValidation, setIsValidating]);

  const handleClick = () => {
    if (tokenValidation?.valid) {
      setScreenState({ currentScreen: "instructions" });
    }
  };

  const getStatusMessage = () => {
    if (isValidating) {
      return "Validating API key...";
    }
    
    if (!token) {
      return "No access token configured";
    }
    
    if (tokenValidation?.error === "Invalid access token") {
      return "Invalid access token";
    }
    
    if (tokenValidation?.error) {
      return `Error: ${tokenValidation.error}`;
    }
    
    if (tokenValidation?.valid) {
      return "API key validated successfully";
    }
    
    return "Checking API key...";
  };

  const getStatusColor = () => {
    if (isValidating) return "text-yellow-200";
    if (!token) return "text-red-200";
    if (tokenValidation?.error) return "text-red-200";
    if (tokenValidation?.valid) return "text-green-200";
    return "text-gray-200";
  };

  const canStartDemo = tokenValidation?.valid === true && !isValidating;

  return (
    <AnimatedWrapper>
      <div className="flex size-full flex-col items-center justify-center">
        <video
          src={gloriaVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-overlay backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col items-center gap-2 py-4 px-4 rounded-xl border border-[rgba(255,255,255,0.2)]" 
          style={{ 
            fontFamily: 'Inter, sans-serif',
            background: 'rgba(0,0,0,0.3)'
          }}>
          <img src="/public/images/vector.svg" alt="Logo" className="mt-2 mb-1" style={{ width: '40px', height: 'auto' }} />

          <h1 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Source Code Pro, monospace' }}>CVI Demo Playground</h1>

          <p className="text-sm text-white text-center mb-4 max-w-sm">
            Experience face-to-face conversation with AI so real, it feels human.
          </p>

          {/* API Key Status */}
          <div className="mb-4 p-3 bg-black/20 border border-white/20 rounded-lg text-center min-w-[300px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              {isValidating ? (
                <l-quantum size="16" speed="1.75" color="white"></l-quantum>
              ) : (
                <div className={`w-2 h-2 rounded-full ${
                  tokenValidation?.valid ? 'bg-green-500' : 'bg-red-500'
                }`} />
              )}
              <span className={`text-sm font-mono ${getStatusColor()}`}>
                {getStatusMessage()}
              </span>
            </div>
            
            {!token && (
              <p className="text-xs text-gray-400 font-mono">
                Set VITE_TAVUS_API_KEY in your .env file
              </p>
            )}
            
            {tokenValidation?.error === "Invalid access token" && (
              <div className="flex items-center justify-center gap-1 text-red-200 text-xs mt-1">
                <AlertTriangle className="size-3" />
                <span>Please check your API key on the Tavus Platform</span>
              </div>
            )}
          </div>

          <AudioButton 
            onClick={handleClick}
            className="relative z-20 flex items-center justify-center gap-2 rounded-3xl border border-[rgba(255,255,255,0.3)] px-4 py-2 text-sm text-white transition-all duration-200 hover:text-primary mt-4 disabled:opacity-50"
            disabled={!canStartDemo}
            style={{
              height: '44px',
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
            {isValidating ? (
              <>
                <l-quantum size="16" speed="1.75" color="white"></l-quantum>
                Validating...
              </>
            ) : canStartDemo ? (
              <>
                <Play className="size-4" />
                Start Demo
              </>
            ) : (
              <>
                <Lock className="size-4" />
                {!token ? "API Key Required" : "Invalid Token"}
              </>
            )}
          </AudioButton>
        </div>
      </div>
    </AnimatedWrapper>
  );
};