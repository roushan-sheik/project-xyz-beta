// Reusable Textarea Component
const Textarea: React.FC<{
  label: string;
  placeholder?: string;
  rows?: number;
  register?: any;
}> = ({ label, placeholder, rows = 3, register }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      rows={rows}
      placeholder={placeholder}
      {...register}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);
export default Textarea;
