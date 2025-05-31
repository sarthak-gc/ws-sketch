const KeyboardShortcutsModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div
      className={`fixed inset-0 flex bg-opacity-50 z-50 justify-center items-center w-full bg-transparent`}
    >
      <div className="bg-gray-100 p-6 rounded-lg max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          ⌨ Keyboard Shortcuts
        </h2>
        <div className="text-gray-700">
          <ul className=" pl-10">
            <li>
              <strong>Backspace</strong>: Remove selected shape
            </li>
            <li>
              <strong> 1</strong>: Select Rectangle
            </li>
            <li>
              <strong> 2</strong>: Select Line
            </li>
            <li>
              <strong> 3</strong>: Select Arrow
            </li>
            <li>
              <strong> 4</strong>: Select Circle
            </li>
            <li>
              <strong> 5</strong>: Select Diamond
            </li>
            <li>
              <strong>Ctrl + D</strong>: Clear everything
            </li>
            <li>
            Toggle Shortcuts Screen
            </li>
            <li>
              <strong>Escape</strong>: Deselect shape
            </li>
          </ul>
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
