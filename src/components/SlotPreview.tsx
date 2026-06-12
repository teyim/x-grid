import Image from "next/image";
import { cn } from "@/lib/utils";


type SlotPreviewProps = {
  label: string;
  file: File | null;
  onClick: () => void;
  className?: string;
};

export default function SlotPreview({ label, file, onClick, className }:SlotPreviewProps) {
  return (
    <div
      className={cn(
        "flex aspect-square w-full min-w-0 cursor-pointer flex-col items-center justify-center rounded border bg-gray-50 p-2 text-center hover:bg-blue-50",
        className
      )}
      onClick={onClick}
    >
      <div className="max-w-full truncate text-xs text-gray-500">{label}</div>
      {file ? (
        <Image src={URL.createObjectURL(file)} className="mt-1 h-10 w-10 rounded object-cover" alt={"upload preview"} width={40} height={40} />
      ) : (
        <div className="mt-1 text-xs leading-4 text-gray-400">Click to assign</div>
      )}
    </div>
  );
}
