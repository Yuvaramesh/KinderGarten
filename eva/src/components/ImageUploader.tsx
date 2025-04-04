import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { XIcon, UploadIcon } from "lucide-react";

interface ImageUploaderProps {
  onImageUpload: (base64Image: string) => void;
  clearImage: () => void;
  uploadedImage: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  clearImage,
  uploadedImage,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG)",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onImageUpload(reader.result);
        }
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload, toast]
  );

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => {
      setIsDragActive(false);
      toast({
        title: "Invalid file",
        description: "Please upload a valid image file (JPG, PNG)",
        variant: "destructive",
      });
    },
  });

  const dropzoneClasses = `
    border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all
    ${
      isDragActive
        ? "border-primary bg-primary/5"
        : "border-gray-300 dark:border-gray-700"
    }
    ${isDragReject ? "border-red-500 bg-red-50 dark:bg-red-900/10" : ""}
    hover:border-primary hover:bg-primary/5
  `;

  return (
    <div className="space-y-4 text-white">
      <h2 className="text-lg font-semibold">{t("upload.heading")}</h2>

      {!uploadedImage ? (
        <div {...getRootProps()} className={dropzoneClasses}>
          <input {...getInputProps()} />
          <UploadIcon className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("upload.dragDrop")}
          </p>
          <p className="text-xs text-gray-400 mt-1">{t("upload.formats")}</p>
        </div>
      ) : (
        <div>
          <h3 className="text-sm font-medium mb-2">{t("upload.preview")}</h3>
          <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={uploadedImage}
              alt="Handwriting sample preview"
              className="w-full h-48 object-contain"
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 bg-gray-800/50 hover:bg-gray-800/70 text-white"
              onClick={clearImage}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
