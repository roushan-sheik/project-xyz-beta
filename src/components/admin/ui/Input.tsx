// Reusable Input Component
const Input: React.FC<{
  label: string;
  type?: "text" | "file";
  placeholder?: string;
  error?: string;
  accept?: string;
  register?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({
  label,
  type = "text",
  placeholder,
  error,
  accept,
  register,
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      accept={accept}
      placeholder={placeholder}
      onChange={onChange}
      {...register}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);
export default Input;
