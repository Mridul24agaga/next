import { useState } from "react";
import { useMutation } from "react-query"; // Ensure you have react-query installed
import prisma from "@/lib/prisma";

interface EditBioModalProps {
  isOpen: boolean;
  onClose: () => void;
  bio: string;
  userId: string;
}

const EditBioModal = ({ isOpen, onClose, bio, userId }: EditBioModalProps) => {
  const [newBio, setNewBio] = useState(bio);

  const mutation = useMutation(async () => {
    await prisma.user.update({
      where: { id: userId },
      data: { bio: newBio },
    });
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutation.mutateAsync();
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Bio</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            rows={4}
            className="w-full p-2 border rounded mb-4"
            placeholder="Write your bio..."
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 p-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBioModal;
