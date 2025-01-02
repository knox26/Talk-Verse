import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      text: "",
      image: null,
    },
  });

  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e, onChange) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      onChange(file); // Update form state
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (onChange) => {
    setImagePreview(null);
    onChange(null); // Clear form state
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data) => {
    if (!data.text.trim() && !data.image) return;

    try {
      const imageBase64 = imagePreview || null; // Optional: Convert file to base64 or handle as needed
      await sendMessage({
        text: data.text.trim(),
        image: imageBase64,
      });

      // Reset form
      reset();
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={() => removeImage(() => reset({ image: null }))}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2"
      >
        <div className="flex-1 flex gap-2">
          {/* Text Input */}
          <Controller
            name="text"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full input input-bordered rounded-lg input-md"
                placeholder="Type a message..."
              />
            )}
          />

          {/* File Input */}
          <Controller
            name="image"
            control={control}
            render={({ field: { onChange } }) => (
              <>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => handleImageChange(e, onChange)}
                />
                <button
                  type="button"
                  className={` sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image size={20} />
                </button>
              </>
            )}
          />
        </div>
        <button
          type="submit"
          className="btn btn-circle"
          disabled={!watch("text") && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
