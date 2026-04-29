"use client";

import React, { useState, useRef, useCallback } from "react";

import { Paperclip, Smile, Send } from "lucide-react";

import { cn } from "@/lib/utils";

interface ChatFooterProps {
  onSendMessage: (text: string) => void;
}

export function ChatFooter({ onSendMessage }: ChatFooterProps) {
  const [inputText, setInputText] = useState("");
  const [muted, setMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    // Get the API
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
      
      return;
    }

    // Create a fresh instance every time
    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = false;     // Stop after one phrase
    recognition.interimResults = false; // Only final results
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      
      console.log("🎤 Transcript:", transcript);

      // Directly set the value using the ref + state
      setInputText((prev) => {
        const combined = prev ? `${prev} ${transcript}` : transcript;
        
        return combined;
      });
    };

    recognition.onend = () => {
      console.log("🎤 Recognition ended");
      setIsListening(false);
      recognitionRef.current = null;

      // Focus the input after recording
      inputRef.current?.focus();
    };

    recognition.onerror = (event: any) => {
      console.error("🎤 Recognition error:", event.error);
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onspeechstart = () => {
      console.log("🎤 Speech detected");
    };

    recognition.onaudiostart = () => {
      console.log("🎤 Audio capture started");
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsListening(true);
      console.log("🎤 Started listening...");
    } catch (err) {
      console.error("🎤 Failed to start:", err);
      setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSend = () => {
    if (inputText.trim()) {
      if (isListening) {
        stopListening();
      }
      
      onSendMessage(inputText);
      setInputText("");
    }
  };

  return (
    <div className="shrink-0 border-t border-[#E2E8F0] px-[24px] py-[16px]">
      <div className="flex h-[56px] items-center gap-3 rounded-[100px] border border-[#90A1B9] bg-transparent px-[20px]">
        {/* Mic Button */}
        <button
          type="button"
          aria-label={isListening ? "Stop recording" : "Start voice message"}
          onClick={toggleListening}
          className={cn(
            "relative flex shrink-0 items-center justify-center transition-transform hover:scale-110 active:scale-95",
            isListening && "text-red-500"
          )}
        >
          {/* Pulsing ring while listening */}
          {isListening && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-40" />
          )}
          <i
            className={cn("mic-fill", isListening ? "text-red-500" : "text-[#0F172B]")}
            style={{ width: 20, height: 20 }}
          />
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder="Write messages..."
          className="flex-1 bg-transparent py-2 font-inter text-[15px] font-normal leading-normal text-[#0F172B] outline-none placeholder:text-[#90A1B9]"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <div className="flex shrink-0 items-center gap-[8px]">
          <button aria-label="Attach file" className="flex h-[24px] w-[24px] shrink-0 items-center justify-center">
            <Paperclip className="text-[#0F172B]" style={{ width: 12, height: 18, strokeWidth: 1.5 }} />
          </button>
          <button aria-label="Emoji" className="flex h-[24px] w-[24px] shrink-0 items-center justify-center">
            <Smile className="text-[#0F172B]" style={{ width: 12, height: 18, strokeWidth: 1.5 }} />
          </button>
        </div>
      </div>

      <div className="mt-[12px] flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <button
            role="switch"
            aria-checked={muted}
            onClick={() => setMuted((v) => !v)}
            className={cn(
              "relative inline-flex h-[22px] w-[40px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none",
              muted ? "bg-[#E60076]" : "bg-[#E2E8F0]"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-[18px] w-[18px] translate-x-0 rounded-full bg-white shadow ring-0 transition-transform",
                muted ? "translate-x-[18px]" : "translate-x-0"
              )}
            />
          </button>
          <span className="font-inter text-[12px] font-normal leading-[16px] text-[#62748E]">
            Mute this thread
          </span>
        </div>

        <button
          onClick={handleSend}
          className="inline-flex h-[36px] items-center justify-center gap-[8px] rounded-[6px] bg-[#18181B] px-[16px] py-[8px] shadow-[0_1px_2px_-1px_rgba(0,0,0,0.10),0_1px_3px_0_rgba(16,24,40,0.10)] transition-colors hover:bg-[#18181B]/90"
        >
          <span className="font-inter text-[14px] font-medium leading-[20px] text-white">
            Send
          </span>
          <Send className="h-[14px] w-[14px] text-white" />
        </button>
      </div>
    </div>
  );
}
