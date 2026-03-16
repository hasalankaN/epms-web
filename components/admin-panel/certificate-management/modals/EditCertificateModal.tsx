"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

import { X, Maximize2, RotateCcw, Grid3X3, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  motion,
  itemVariants,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import type { CertificateTemplateItem } from "@/types/certificate";
import { useGetCertificateTemplateById } from "@/hooks/api/certificates/useGetCertificateTemplateById";
import { useUpdateCertificateTemplate } from "@/hooks/api/certificates/useUpdateCertificateTemplate";
import { useUploadFile } from "@/hooks/api/files/useUploadFile";

import {
  type TagPositions,
  type TagState,
  type SignatureState,
  DEFAULT_TAG_POSITIONS,
  DEFAULT_SIGNATURE_STATE,
  ToggleSwitch,
  GridOverlay,
  CertificatePreviewTags,
  TagPropertiesPanel,
  DraggableSignature,
  SignaturePropertiesPanel,
} from "./certificate-editor-shared";
import { ExpandedPreviewModal } from "./ExpandedPreviewModal";

interface EditCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: CertificateTemplateItem | null;
}

// ===== Reusable FieldLabel helper =====
const FieldLabel = ({
  children,
  required = false,
  className,
}: {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) => (
  <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block", className)}>
    {children}
    {required && <span className="ml-0.5 text-[#E60076] font-bold">*</span>}
  </Label>
);

export function EditCertificateModal({ isOpen, onClose, certificate }: EditCertificateModalProps) {
  // ===== API Hooks =====
  const { data: templateData, isLoading: isFetching } = useGetCertificateTemplateById(
    isOpen && certificate ? certificate.id : null
  );

  const { mutateAsync: updateTemplate, isPending: isUpdating } = useUpdateCertificateTemplate(
    certificate?.id || ""
  );

  const { mutateAsync: uploadFile } = useUploadFile();

  // ===== Form state =====
  const [certificateName, setCertificateName] = useState("");
  const [price, setPrice] = useState("");
  
  // ===== Unified Editor state =====
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rawTemplateFile, setRawTemplateFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [tagPositions, setTagPositions] = useState<TagPositions>(DEFAULT_TAG_POSITIONS);
  const [isExpandedPreviewOpen, setIsExpandedPreviewOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [snapEnabled, setSnapEnabled] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [gridDensity, setGridDensity] = useState(10);
  const [showSampleValues, setShowSampleValues] = useState(true); // default true for edit
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  const [signatureState, setSignatureState] = useState<SignatureState>({ ...DEFAULT_SIGNATURE_STATE });
  const [isSignatureSelected, setIsSignatureSelected] = useState(false);
  const [rawSignatureFile, setRawSignatureFile] = useState<File | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  // ===== Loading State =====
  const [loadingStep, setLoadingStep] = useState<"idle" | "template" | "signature" | "updating">("idle");

  // ===== Dirty-state guard =====
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  // Track container width for proportional font scaling
  useEffect(() => {
    const el = containerRef.current;

    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    ro.observe(el);

    return () => ro.disconnect();
  }, [previewUrl, isOpen]);

  // Pre-fill form when templateData changes
  useEffect(() => {
    if (isOpen && templateData) {
      setCertificateName(templateData.name || "");
      setPrice(parseFloat(templateData.price || "0").toString());

      setPreviewUrl(templateData.template_file_url || null);
      setSelectedFileName(templateData.name ? `${templateData.name} Template` : "Existing Template");
      setRawTemplateFile(null); // Reset raw file as we are using existing url

      // Reset editor visual state
      setIsExpandedPreviewOpen(false);
      setSelectedTag(null);
      setSnapEnabled(false);
      setGridVisible(true);
      setGridDensity(10);
      setShowSampleValues(true);
      setImageAspectRatio(null);
      
      // Parse layout
      const dbTags = typeof templateData.tag_layout === 'string' 
        ? JSON.parse(templateData.tag_layout) 
        : (templateData.tag_layout || {});

      // Merge DB positions with default tag states
      const mergedTagPositions: TagPositions = JSON.parse(JSON.stringify(DEFAULT_TAG_POSITIONS));

      Object.keys(dbTags).forEach((key) => {
        if (mergedTagPositions[key]) {
          mergedTagPositions[key].x = dbTags[key].x;
          mergedTagPositions[key].y = dbTags[key].y;
          if (dbTags[key].fontSize) mergedTagPositions[key].properties.fontSize = dbTags[key].fontSize;
          if (dbTags[key].fontColor) mergedTagPositions[key].properties.fontColor = dbTags[key].fontColor;
          if (dbTags[key].fontFamily) mergedTagPositions[key].properties.fontFamily = dbTags[key].fontFamily;
          if (dbTags[key].fontWeight) mergedTagPositions[key].properties.fontWeight = dbTags[key].fontWeight;
          if (dbTags[key].opacity) mergedTagPositions[key].properties.opacity = dbTags[key].opacity;
        }
      });
      
      setTagPositions(mergedTagPositions);

      // Parse signature
      const dbSig = typeof templateData.signature_layout === 'string'
        ? JSON.parse(templateData.signature_layout)
        : (templateData.signature_layout || {});

      setSignatureState({
        ...DEFAULT_SIGNATURE_STATE,
        enabled: !!templateData.signature_image_url,
        imageUrl: templateData.signature_image_url ?? null,
        x: dbSig.director_sig?.x ?? DEFAULT_SIGNATURE_STATE.x,
        y: dbSig.director_sig?.y ?? DEFAULT_SIGNATURE_STATE.y,
        width: dbSig.director_sig?.width ?? DEFAULT_SIGNATURE_STATE.width,
        rotation: dbSig.director_sig?.rotation ?? DEFAULT_SIGNATURE_STATE.rotation,
        opacity: dbSig.director_sig?.opacity ?? DEFAULT_SIGNATURE_STATE.opacity,
      });
      setIsSignatureSelected(false);
      setRawSignatureFile(null);

      // Clean dirty state
      setIsDirty(false);
      setShowDiscardModal(false);
    }
  }, [isOpen, templateData]);

  const markDirty = useCallback(() => {
    setIsDirty((prev) => (prev ? prev : true));
  }, []);

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    onClose();
  };

  const handleUpdate = async () => {
    if (!certificateName.trim()) {
      toast.error("Please enter a certificate name");
      
      return;
    }

    if (!price || isNaN(Number(price))) {
      toast.error("Please enter a valid price");
      
      return;
    }

    if (!previewUrl && !rawTemplateFile) {
      toast.error("Please upload a certificate template");
      
      return;
    }

    if (signatureState.enabled && !signatureState.imageUrl && !rawSignatureFile) {
      toast.error("Please upload a signature image, or disable Digital Signature");
      
      return;
    }

    try {
      let finalTemplateUrl = previewUrl || "";
      let finalTemplateType = templateData?.file_type || "image/jpeg";

      // 1. Upload new template if changed
      if (rawTemplateFile) {
        setLoadingStep("template");
        const res = await uploadFile({ file: rawTemplateFile });

        finalTemplateUrl = res.data.url;
        finalTemplateType = rawTemplateFile.type;
      }

      // 2. Upload new signature if changed
      let finalSignatureUrl = signatureState.enabled ? signatureState.imageUrl : null;

      if (signatureState.enabled && rawSignatureFile) {
        setLoadingStep("signature");
        const res = await uploadFile({ file: rawSignatureFile });

        finalSignatureUrl = res.data.url;
      }

      // 3. Format tag layout
      setLoadingStep("updating");
      const tag_layout: Record<string, any> = {};

      Object.entries(tagPositions).forEach(([key, tag]) => {
        tag_layout[key] = {
          x: tag.x,
          y: tag.y,
          fontSize: tag.properties.fontSize,
          fontColor: tag.properties.fontColor,
          fontFamily: tag.properties.fontFamily,
          fontWeight: tag.properties.fontWeight,
          opacity: tag.properties.opacity,
        };
      });

      // 4. Format signature layout
      const signature_layout: Record<string, any> = {};

      if (signatureState.enabled) {
        signature_layout.director_sig = {
          x: signatureState.x,
          y: signatureState.y,
          width: signatureState.width,
          rotation: signatureState.rotation,
          opacity: signatureState.opacity,
        };
      }

      // 5. Build payload and mutate
      await updateTemplate({
        name: certificateName.trim(),
        price: Number(price),
        template_file_url: finalTemplateUrl,
        file_type: finalTemplateType,
        tag_layout,
        signature_layout,
        signature_image_url: signatureState.enabled ? finalSignatureUrl : null,
        status: templateData?.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      });

      onClose();
    } catch (error) {
      console.error(error);

      // Toast is handled by hook
    } finally {
      setLoadingStep("idle");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    
    setRawTemplateFile(file);
    setSelectedFileName(file.name);
    markDirty();
    setImageAspectRatio(null);
    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handlePositionChange = useCallback(
    (key: string, x: number, y: number) => {
      setTagPositions((prev) => ({
        ...prev,
        [key]: { ...prev[key], x, y },
      }));
      markDirty();
    },
    [markDirty]
  );

  const handleTagUpdate = useCallback(
    (key: string, updates: Partial<TagState>) => {
      setTagPositions((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          ...updates,
          properties: {
            ...prev[key].properties,
            ...(updates.properties ?? {}),
          },
          sampleValue: updates.sampleValue ?? prev[key].sampleValue,
        },
      }));
      markDirty();
    },
    [markDirty]
  );

  const handleResetPositions = () => {
    setTagPositions(JSON.parse(JSON.stringify(DEFAULT_TAG_POSITIONS)) as TagPositions);
    setSelectedTag(null);
    setSignatureState((prev) => ({ ...prev, x: DEFAULT_SIGNATURE_STATE.x, y: DEFAULT_SIGNATURE_STATE.y, width: DEFAULT_SIGNATURE_STATE.width, opacity: DEFAULT_SIGNATURE_STATE.opacity, rotation: DEFAULT_SIGNATURE_STATE.rotation }));
    setIsSignatureSelected(false);
    markDirty();
    toast.info("Tag positions reset to defaults");
  };

  const handleDeselectTag = () => {
    setSelectedTag(null);
    setIsSignatureSelected(false);
  };

  // Signature handlers
  const handleSignatureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG recommended)");

      return;
    }

    setRawSignatureFile(file);
    const objectUrl = URL.createObjectURL(file);

    setSignatureState((prev) => ({ ...prev, imageUrl: objectUrl, enabled: true }));
    setIsSignatureSelected(true);
    setSelectedTag(null);
    markDirty();

    e.target.value = "";
  };

  const handleRemoveSignatureImage = useCallback(() => {
    setSignatureState((prev) => ({ ...prev, imageUrl: null, enabled: false }));
    setIsSignatureSelected(false);
    setRawSignatureFile(null);
    markDirty();
  }, [markDirty]);

  const handleSignaturePositionChange = useCallback(
    (x: number, y: number) => {
      setSignatureState((prev) => ({ ...prev, x, y }));
      markDirty();
    },
    [markDirty]
  );

  const handleSignatureUpdate = useCallback(
    (updates: Partial<SignatureState>) => {
      setSignatureState((prev) => ({ ...prev, ...updates }));
      markDirty();
    },
    [markDirty]
  );

  const handleSelectSignature = useCallback(() => {
    setSelectedTag(null);
    setIsSignatureSelected(true);
  }, []);

  if (!isOpen || !certificate) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
        <DialogContent 
          isLoading={isFetching}
          animateChildren={true}
          className="flex max-h-[90vh] w-[95%] max-w-[900px] flex-col gap-4 overflow-hidden rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
        >
          
          {/* ===== HEADER ===== */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex-1 flex gap-3 items-center text-lg font-bold leading-[30px] text-[#0F172B]">
                Edit Certificate
                {isFetching && <Loader2 className="h-4 w-4 animate-spin text-[#90A1B9]" />}
              </DialogTitle>
              <button
                title="Close"
                onClick={handleCloseAttempt}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
              >
                <X className="h-4 w-4 text-[#64748B]" />
              </button>
            </div>
            <div className="border-b border-[#E2E8F0]" />
          </motion.div>

          {/* ===== BODY (scrollable) ===== */}
          <motion.div variants={itemVariants} className="flex-1 overflow-y-auto px-1 py-1 sm:px-2 sm:py-2 scrollbar-hide">
            <div className="flex flex-col gap-6">

              {/* TOP ROW: Form Fields (2 columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <FieldLabel required>Certificate Name</FieldLabel>
                  <Input
                    value={certificateName}
                    onChange={(e) => { setCertificateName(e.target.value); markDirty(); }}
                    className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                    placeholder="E.g. Full Stack Developer Boot Camp"
                  />
                </div>

                <div className="space-y-1">
                  <FieldLabel required>Assign Price</FieldLabel>
                  <div className="relative">
                    <Input
                      value={price}
                      onChange={(e) => { setPrice(e.target.value); markDirty(); }}
                      className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "pr-12 text-[#0F172B] font-semibold")}
                      placeholder="XXXX"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-sm font-semibold text-[#0F172B]">LKR</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* UPLOAD TEMPLATE */}
              <div className="space-y-1">
                <FieldLabel required>Upload the template</FieldLabel>
                <div className="relative flex items-center h-10 w-full rounded-md border border-[#E2E8F0] bg-white overflow-hidden shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] focus-within:ring-1 focus-within:ring-slate-950 focus-within:border-slate-950">
                  <button
                    type="button"
                    onClick={handleChooseFile}
                    className="h-full px-4 text-sm font-semibold text-[#0F172B] hover:bg-slate-50 transition-colors border-r border-[#E2E8F0] whitespace-nowrap"
                  >
                    Choose file
                  </button>
                  <div className="flex-1 px-3 truncate text-sm text-[#45556C]">
                    {selectedFileName || "No file chosen"}
                  </div>
                </div>
                <input
                  title="Choose File"
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp,.pdf"
                  onChange={handleFileChange}
                />
              </div>

              {/* PREVIEW CONTAINER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FieldLabel>Preview</FieldLabel>
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={() => setIsExpandedPreviewOpen(true)}
                      className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium text-[#E60076] hover:text-[#BE006B] transition-colors"
                    >
                      <Maximize2 className="h-4 w-4" />
                      Expand Preview
                    </button>
                  )}
                </div>
                
                <div
                  className={cn(
                    "rounded-md border border-dashed border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden",
                    !previewUrl ? "flex flex-col items-center justify-center p-8 min-h-[180px]" : ""
                  )}
                  style={{
                    ...(imageAspectRatio ? { aspectRatio: String(imageAspectRatio) } : { minHeight: "180px" })
                  }}
                  onClick={handleDeselectTag}
                >
                  {!previewUrl && (
                    <div className="text-center text-[#64748B] flex flex-col items-center justify-center h-full">
                      <Grid3X3 className="h-8 w-8 text-[#CBD5E1] mb-2" />
                      <p className="text-sm">No template uploaded</p>
                    </div>
                  )}

                  {previewUrl && (
                    <div
                      ref={containerRef}
                      className="relative w-full h-full flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div 
                        className="absolute inset-0 cursor-default" 
                        onClick={handleDeselectTag} 
                        aria-label="Deselect tag"
                      />
                      
                      <img
                        src={previewUrl}
                        alt="Template preview"
                        className="block w-full h-auto pointer-events-none select-none"
                        draggable={false}
                        onLoad={(e) => {
                          const img = e.target as HTMLImageElement;

                          setImageAspectRatio(img.naturalWidth / img.naturalHeight);
                        }}
                      />
                      
                      {imageAspectRatio !== null && (
                        <>
                          <GridOverlay visible={gridVisible} density={gridDensity} />
                          
                          {signatureState.enabled && signatureState.imageUrl && (
                            <DraggableSignature
                              signatureState={signatureState}
                              containerRef={containerRef}
                              isSelected={isSignatureSelected}
                              onSelect={handleSelectSignature}
                              onDeselect={handleDeselectTag}
                              onPositionChange={handleSignaturePositionChange}
                              snapEnabled={snapEnabled}
                              gridDensity={gridDensity}
                              containerWidth={containerWidth}
                            />
                          )}
                          
                          <CertificatePreviewTags
                            tagPositions={tagPositions}
                            containerRef={containerRef}
                            onPositionChange={handlePositionChange}
                            selectedTag={selectedTag}
                            onSelectTag={(key) => {
                              setSelectedTag(key);
                              setIsSignatureSelected(false);
                            }}
                            snapEnabled={snapEnabled}
                            gridDensity={gridDensity}
                            showSampleValues={showSampleValues}
                            containerWidth={containerWidth}
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* BOTTOM ROW: Editor Controls & Properties */}
              {previewUrl && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  
                  {/* LEFT TOOL COLUMN */}
                  <div className="flex flex-col gap-6">
                    {/* Editor Controls */}
                    <div className="w-full flex flex-col gap-4 border border-[#E2E8F0] rounded-xl p-4">
                      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                        <h4 className="text-sm font-semibold text-[#0F172B]">Editor Controls</h4>
                        <button
                          type="button"
                          onClick={handleResetPositions}
                          className="flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#E60076]"
                          title="Reset all tags"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Reset
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <ToggleSwitch
                          id="edit-grid"
                          label="Grid"
                          checked={gridVisible}
                          onChange={setGridVisible}
                        />
                        <ToggleSwitch
                          id="edit-snap"
                          label="Snap"
                          checked={snapEnabled}
                          onChange={setSnapEnabled}
                        />
                        <ToggleSwitch
                          id="edit-preview"
                          label="Values"
                          checked={showSampleValues}
                          onChange={setShowSampleValues}
                        />
                      </div>
                    </div>

                    {/* Signature Upload Options block */}
                    <div className="w-full flex flex-col gap-4 border border-[#E2E8F0] rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-[#0F172B]">Digital Signature</h4>
                        <ToggleSwitch
                          id="signature-toggle-edit"
                          checked={signatureState.enabled}
                          onChange={(v) => {
                            setSignatureState((prev) => ({ ...prev, enabled: v }));
                            if (!v) setIsSignatureSelected(false);
                            markDirty();
                          }}
                          label=""
                        />
                      </div>

                      {signatureState.enabled && (
                        <div className="space-y-2 mt-2">
                          {signatureState.imageUrl ? (
                            <div className="relative rounded-md border border-[#E2E8F0] bg-[#F1F5F9] p-3 flex items-center justify-center">
                              <img
                                src={signatureState.imageUrl}
                                alt="Signature preview"
                                className="max-h-14 max-w-full object-contain"
                              />
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => signatureInputRef.current?.click()}
                              className="w-full flex items-center justify-center gap-2 h-10 rounded-md border border-dashed border-[#E2E8F0] bg-[#F1F5F9] text-xs font-medium text-[#64748B] hover:bg-slate-50 hover:border-[#E60076]/40 transition-colors"
                            >
                               Upload Signature Image
                            </button>
                          )}
                          <p className="text-[10px] text-[#64748B]">
                            PNG with transparent background recommended. Drag to position on preview.
                          </p>
                        </div>
                      )}
                      <input
                        title="Choose File"
                        type="file"
                        className="hidden"
                        ref={signatureInputRef}
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleSignatureFileChange}
                      />
                    </div>
                  </div>

                  {/* RIGHT TOOL COLUMN (Properties) */}
                  <div className="flex flex-col h-full border border-[#E2E8F0] rounded-xl p-4 bg-slate-50/50">
                    {(selectedTag || isSignatureSelected) ? (
                      <div className="w-full">
                        {isSignatureSelected ? (
                          <SignaturePropertiesPanel
                            signatureState={signatureState}
                            onUpdate={handleSignatureUpdate}
                            onUploadClick={() => signatureInputRef.current?.click()}
                            onRemoveImage={handleRemoveSignatureImage}
                            compact={false}
                          />
                        ) : (
                          <TagPropertiesPanel
                            tagKey={selectedTag!}
                            tagState={tagPositions[selectedTag!]}
                            onUpdate={handleTagUpdate}
                            compact={false}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full text-center text-sm italic text-[#64748B] flex items-center justify-center min-h-[150px]">
                        Click an element in the preview to edit its properties.
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </motion.div>

          {/* ===== FOOTER (static) ===== */}
          <motion.div variants={itemVariants} className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-4 shrink-0 mt-auto">
            <Button
              onClick={handleUpdate}
              disabled={loadingStep !== "idle" || isUpdating || !isDirty}
              className={cn(BUTTON_STYLES.primary.full, "w-auto min-w-[120px] px-6 text-sm font-semibold text-white")}
            >
              {(loadingStep !== "idle" || isUpdating) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {loadingStep === "template" && "Uploading Template..."}
                  {loadingStep === "signature" && "Uploading Signature..."}
                  {(loadingStep === "updating" || isUpdating) && "Updating..."}
                  {loadingStep === "idle" && isUpdating && "Updating..."}
                </>
              ) : (
                "Update"
              )}
            </Button>
          </motion.div>

        </DialogContent>
      </Dialog>

      {/* Required for the Expanded view */}
      {previewUrl && isOpen && (
        <ExpandedPreviewModal
          open={isExpandedPreviewOpen}
          onOpenChange={setIsExpandedPreviewOpen}
          previewUrl={previewUrl}
          
          tagPositions={tagPositions}
          onPositionChange={handlePositionChange}
          onTagUpdate={handleTagUpdate}
          onResetPositions={handleResetPositions}
          selectedTag={selectedTag}
          onSelectTag={(key) => {
            setSelectedTag(key);
            if (key) setIsSignatureSelected(false);
          }}
          
          snapEnabled={snapEnabled}
          onSnapChange={setSnapEnabled}
          
          gridVisible={gridVisible}
          onGridVisibleChange={setGridVisible}
          
          gridDensity={gridDensity}
          onGridDensityChange={setGridDensity}
          
          showSampleValues={showSampleValues}
          onShowSampleValuesChange={setShowSampleValues}
          
          signatureState={signatureState}
          onSignaturePositionChange={handleSignaturePositionChange}
          onSignatureUpdate={handleSignatureUpdate}
          onRemoveSignatureImage={handleRemoveSignatureImage}
          onSignatureUploadClick={() => signatureInputRef.current?.click()}
          isSignatureSelected={isSignatureSelected}
          onSelectSignature={handleSelectSignature}
          onDeselectSignature={() => setIsSignatureSelected(false)}
        />
      )}

      {/* Discard Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleConfirmDiscard}
        title="Save Your Edits First"
        description="Unsaved changes detected, remember to save your edits before you close!"
        confirmText="Proceed Without Saving"
        cancelText="Go Back and Save"
      />
    </>
  );
}
