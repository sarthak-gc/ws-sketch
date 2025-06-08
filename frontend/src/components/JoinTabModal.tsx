import { useState } from "react";
import CopyClipboard from "./Svg/CopyClipboard";
import { AXIOS_TAB } from "../utils/axios/axios";
import { useNavigate } from "react-router-dom";
import { useUserInfoStore } from "../store/userInfoStore";
// import type { Collaborator } from "../types/types";

interface JoinTabModalI {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  // setCollaborators: React.Dispatch<React.SetStateAction<Collaborator[]>>;
}

const JoinTabModal = ({
  isOpen,
  onClose,
  initialCode = "",
}: // setCollaborators,
JoinTabModalI) => {
  const [joinCode, setJoinCode] = useState<string>(initialCode);
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleJoinClick = async () => {
    if (!joinCode.trim()) {
      alert("Please enter a code to join");
      return;
    }

    if (joinCode.trim().length === 6) {
      const response = await AXIOS_TAB.post(`/join/${joinCode.trim()}`);

      const userId = useUserInfoStore.getState().user?.userId;
      const username = useUserInfoStore.getState().user?.username;
      if (userId && username) {
        // setCollaborators((prev) => {
        //   return [
        //     ...prev,
        //     {
        //       userId,
        //       username,
        //       hexCode: "",
        //       isOnline: true,
        //     },
        //   ];
        // });
      }

      // const a = {
      //   collaborators: [
      //     {
      //       userId: "9f9a7103-56ad-47d4-8a77-80b583c7a7c4",
      //       username: "b",
      //       hexCode: "#3e23e86d",
      //       isOnline: false,
      //     },
      //   ],
      //   accessCode: "m4nxuw",
      //   accessCodeExpiration: "2025-06-04T15:01:14.933Z",
      //   createdAt: "2025-06-04T14:51:00.534Z",
      //   elements: null,
      //   isEditable: false,
      //   isPrivate: true,
      //   sharableLink: null,
      //   tabId: "ed9e599f-ea6c-408f-b3b9-0a5d0313aa22",
      //   tabName: "New Tab",
      //   updatedAt: "2025-06-04T14:51:15.151Z",
      //   userId: "e4c948c4-638b-4e56-baff-4b74dc46fdfc",
      // };

      new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve(undefined);
        }, 1500);
      }).then(() => {
        navigate(`/${response.data.tabDets.tabId}`);
      });
    } else {
      alert("Enter a valid code");
    }
    setJoinCode("");
    onClose();
  };

  return (
    <div className="fixed inset-0  bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#dadada] text-black rounded-xl p-6 max-w-sm w-full shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Join with Code</h2>
        <div className="flex items-center mb-4 gap-4">
          <input
            maxLength={6}
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Enter join code"
            className="flex-grow px-3 py-2 rounded-lg border border-gray-400 font-mono tracking-wide"
          />
          <div
            onClick={async () => {
              const text = await navigator.clipboard.readText();
              setJoinCode(text.slice(0, 6));
            }}
            className="cursor-pointer"
          >
            <CopyClipboard />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 rounded-lg px-4 py-2 font-bold text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleJoinClick}
            className="bg-black hover:bg-black rounded-lg px-4 py-2 font-bold text-white"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinTabModal;
