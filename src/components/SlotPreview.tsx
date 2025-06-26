import Image from "next/image";


type SlotPreviewProps = {
  label: string;
  file: File | null;
  onClick: () => void;
};

export default function SlotPreview({ label, file, onClick }:SlotPreviewProps) {
  return (
    <div
      className="w-24 h-24 border rounded flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-blue-50"
      onClick={onClick}
    >
      <div className="text-xs text-gray-500">{label}</div>
      {file ? (
        <Image src={URL.createObjectURL(file)} className=" object-cover rounded" alt={"upload preview"} width={40} height={40} />
      ) : (
        <div className="text-gray-400 text-xs">Click to assign</div>
      )}
    </div>
  );
}