import { PostData } from "@/lib/types";
import { Loader2, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSubmitCommentMutation } from "./mutations";

interface CommentInputProps {
  post: PostData;
}

export default function CommentInput({ post }: CommentInputProps) {
  const [input, setInput] = useState("");

  const mutation = useSubmitCommentMutation(post.id);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input) return;

    mutation.mutate(
      {
        post,
        content: input,
      },
      {
        onSuccess: () => setInput(""),
      },
    );
  }

  const addEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
  };

  const emojis = [
    "🙏", "😢", "😭", "🥺", "😔", "🤲",
    "👍", "❤️", "😂", "😊", "🎉", "👏",
    "😮", "😡", "🤔", "💪", "🙌", "✨"
  ];

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap justify-start gap-1">
        {emojis.map((emoji) => (
          <Button
            key={emoji}
            variant="outline"
            size="sm"
            onClick={() => addEmoji(emoji)}
            className="px-2 py-1 min-w-[36px]"
          >
            {emoji}
          </Button>
        ))}
      </div>
      <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
        <Input
          placeholder="Write a comment..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          disabled={!input.trim() || mutation.isPending}
        >
          {!mutation.isPending ? (
            <SendHorizonal />
          ) : (
            <Loader2 className="animate-spin" />
          )}
        </Button>
      </form>
    </div>
  );
}