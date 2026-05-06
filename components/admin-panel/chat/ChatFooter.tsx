"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

import { toast } from "sonner";
import { Paperclip, X, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUploadChatFile } from "@/hooks/api/chat/useUploadChatFile";
import { Progress } from "@/components/ui/progress";

interface ChatFooterProps {
  onSendMessage: (text: string, attachment?: any) => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onTyping?: (isTyping: boolean) => void;
}

export function ChatFooter({ onSendMessage, isMuted, onToggleMute, onTyping }: ChatFooterProps) {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<any[]>([]);
  
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isChrome, setIsChrome] = useState(false);
  const { mutateAsync: uploadFile } = useUploadChatFile();
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Detect Chrome (excluding Edge and Brave)
    const isChromium = !!(window as any).chrome;
    const isEdge = navigator.userAgent.indexOf("Edg") > -1;
    const isBrave = !!(navigator as any).brave;
    
    if (isChromium && !isEdge && !isBrave) {
      setIsChrome(true);
    }
  }, []);

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
      toast.info("Speech recognition is not supported in your browser. Please use Chrome.");
      
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const currentTotal = attachedFiles.length + uploadingFiles.length;

    if (currentTotal + files.length > 5) {
      toast.error("You can only upload a maximum of 5 files.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      return;
    }

    // Process each file
    for (const file of files) {
      const tempId = Math.random().toString(36).substring(7);
      
      setUploadingFiles(prev => [...prev, { id: tempId, name: file.name, progress: 0 }]);

      try {
        const res = await uploadFile({
          file,
          onUploadProgress: (progressEvent: any) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || file.size)
            );

            setUploadingFiles(prev => 
              prev.map(f => f.id === tempId ? { ...f, progress: percentCompleted } : f)
            );
          },
        });
        
        const newAttachment = {
          id: tempId,
          url: res.data.url,
          name: file.name,
          size: (file.size / 1024).toFixed(1) + " KB",
          type: file.type,
          fileType: file.type.includes("pdf") ? "pdf" : file.type.includes("image") ? "image" : "other"
        };

        setAttachedFiles(prev => [...prev, newAttachment]);
      } catch (error) {
        console.error("Upload failed for", file.name, error);
      } finally {
        setUploadingFiles(prev => prev.filter(f => f.id !== tempId));
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSend = () => {
    console.log("[ChatFooter] handleSend called:", { inputText, attachedFilesCount: attachedFiles.length, uploadingFilesCount: uploadingFiles.length });

    if ((inputText.trim() || attachedFiles.length > 0) && uploadingFiles.length === 0) {
      // Stop recording before sending
      if (isListening) {
        stopListening();
      }

      onTyping?.(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      onSendMessage(inputText, attachedFiles);
      setInputText("");
      setAttachedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="shrink-0 border-t border-[#E2E8F0] px-[24px] py-[16px] flex flex-col gap-[12px]">
      {(attachedFiles.length > 0 || uploadingFiles.length > 0) && (
        <div className="flex flex-wrap gap-[10px] animate-in fade-in slide-in-from-bottom-2 duration-200">
          {attachedFiles.map((file) => (
            <div key={file.id} className="flex items-center gap-[8px] bg-[#F8FAFC] p-[8px] rounded-[8px] border border-[#E2E8F0] w-fit max-w-[200px]">
              <div className="bg-[#E2E8F0] p-[6px] rounded-[4px] shrink-0">
                <Paperclip className="w-[14px] h-[14px] text-[#475569]" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[12px] font-medium text-[#0F172B] truncate">
                  {file.name}
                </span>
                <span className="text-[10px] text-[#94A3B8]">
                  {file.size}
                </span>
              </div>
              <button 
                onClick={() => removeAttachment(file.id)}
                className="ml-[4px] p-[4px] hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-[14px] h-[14px] text-[#94A3B8]" />
              </button>
            </div>
          ))}

          {uploadingFiles.map((file) => (
            <div key={file.id} className="flex flex-col gap-2 bg-[#F8FAFC] p-[10px] rounded-[8px] border border-[#E2E8F0] w-fit min-w-[150px]">
              <div className="flex items-center gap-[8px]">
                <div className="bg-[#E2E8F0] p-[6px] rounded-[4px] shrink-0">
                  <Loader2 className="w-[14px] h-[14px] text-[#2563EB] animate-spin" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[12px] font-medium text-[#0F172B] truncate">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">
                    {file.progress}%
                  </span>
                </div>
              </div>
              <Progress 
                value={file.progress} 
                className="h-[4px] w-full bg-[#E2E8F0] [&>div]:bg-[#2563EB]" 
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex h-[56px] items-center gap-3 rounded-[100px] border border-[#90A1B9] bg-transparent px-[20px]">
        {/* Mic Button - Only visible on Chrome */}
        {isChrome && (
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
        )}

        <input
          ref={inputRef}
          type="text"
          placeholder="Write messages..."
          className="flex-1 bg-transparent py-2 font-inter text-[15px] font-normal leading-normal text-[#0F172B] outline-none placeholder:text-[#90A1B9]"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            onTyping?.(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
              onTyping?.(false);
            }, 1500);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <div className="flex shrink-0 items-center">
          <input
            type="file"
            multiple={true}
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button 
            aria-label="Attach file" 
            onClick={() => fileInputRef.current?.click()}
            className="flex h-[32px] w-[32px] shrink-0 items-center justify-center transition-colors hover:bg-black/5 rounded-full"
          >
            <Paperclip className="text-[#0F172B]" style={{ width: 20, height: 20, strokeWidth: 2 }} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <button
            role="switch"
            aria-checked={isMuted}
            onClick={onToggleMute}
            className={cn(
              "relative inline-flex h-[22px] w-[40px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none",
              isMuted ? "bg-[#E60076]" : "bg-[#E2E8F0]"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-[18px] w-[18px] translate-x-0 rounded-full bg-white shadow ring-0 transition-transform",
                isMuted ? "translate-x-[18px]" : "translate-x-0"
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
          <i className="paper-plane-right h-[14px] w-[14px] text-white" />
        </button>
      </div>
    </div>
  );
}
