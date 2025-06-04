import CopyClipboard from "./Svg/CopyClipboard";

interface AccessCodeModalI {
  isOpen: boolean;
  onClose: () => void;
  accessCode: string;
  expiresAt: Date;
}
const AccessCodeModal = ({
  isOpen,
  onClose,
  accessCode,
  expiresAt,
}: AccessCodeModalI) => {
  if (!isOpen) return;

  const expiresDate = new Date(expiresAt);
  const formattedTime = expiresDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="fixed inset-0  bg-opacity-70 flex items-center justify-center z-50">
      <div
        className="bg-[#dadada] text-black rounded-xl p-6 max-w-sm w-full shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Access Code Generated</h2>
        <div className="flex items-center mb-2 gap-4">
          <span className="font-semibold ">Code:</span>
          <span className="bg-gray-700 px-3 py-1 rounded-lg font-mono tracking-wide select-all text-white">
            {accessCode}
          </span>
          <div
            onClick={async () => {
              await navigator.clipboard.writeText(accessCode);
              alert("Copied");
            }}
            className="cursor-pointer"
          >
            <CopyClipboard />
          </div>
        </div>

        <p className="mb-6">
          <span className="font-semibold">Expires at:</span> {formattedTime}
        </p>

        <button
          onClick={onClose}
          className="bg-black hover:bg-black rounded-lg px-4 py-2 font-bold text-white float-right"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AccessCodeModal;
