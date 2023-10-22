const Switch = ({
  label,
  value,
  toggle,
}: {
  label?: string;
  value: boolean;
  toggle?: () => void;
}) => {
  return (
    <div className="flex items-center">
      <button
        type="button"
        className={`${
          value ? "bg-red-600" : "bg-gray-200"
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2`}
        role="switch"
        aria-checked="false"
        onClick={() => {
          if (toggle) {
            toggle();
          }
        }}
      >
        <span
          aria-hidden="true"
          className={`${
            value ? "translate-x-5" : "translate-x-0"
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        ></span>
      </button>
      {label ? (
        <span className="ml-3 text-sm">
          <span className="font-medium text-gray-900">{label}</span>
        </span>
      ) : null}
    </div>
  );
};

export default Switch;
