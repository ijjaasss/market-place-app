import { useEffect, useState } from "react";
import { X, ImagePlus } from "lucide-react";

const CategoryFormModal = ({
  open,
  mode = "create", // "create" | "edit"
  initialCategory = null,
  onClose,
  onSubmit,
  loading,
}) => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (open) {
      setName(initialCategory?.name || "");
      setImageFile(null);
      setPreviewUrl(initialCategory?.image || null);
    }
  }, [open, initialCategory]);

  if (!open) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (imageFile) formData.append("image", imageFile);
    onSubmit(formData);
  };

  const isEdit = mode === "edit";

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#161B2C] border border-[#2A3142] rounded-md w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8991A8] hover:text-[#EDEFF4] transition"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <h2 className="text-lg font-semibold text-[#EDEFF4] mb-6">
          {isEdit ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-2">
              Category Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Mobiles"
              className="w-full bg-[#0F1320] border border-[#2A3142] rounded-md px-3 py-2.5 text-sm text-[#EDEFF4] placeholder:text-[#565F78] focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-2">
              {isEdit ? "Replace Image" : "Category Image"}
            </label>
            <label className="flex items-center gap-4 cursor-pointer group">
              <div className="h-16 w-16 rounded-md border border-dashed border-[#2A3142] group-hover:border-[#C9A15C]/50 flex items-center justify-center overflow-hidden bg-[#0F1320] shrink-0 transition">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus size={18} className="text-[#565F78]" />
                )}
              </div>
              <span className="text-xs text-[#8991A8] group-hover:text-[#EDEFF4] transition">
                {previewUrl ? "Change image" : "Click to upload"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={!isEdit}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#C9A15C] hover:bg-[#D9B36E] disabled:opacity-50 disabled:cursor-not-allowed text-[#161B2C] font-semibold text-sm rounded-md py-2.5 transition"
          >
            {loading && (
              <span className="h-4 w-4 rounded-full border-2 border-[#161B2C]/40 border-t-[#161B2C] animate-spin" />
            )}
            {isEdit ? "Save Changes" : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;