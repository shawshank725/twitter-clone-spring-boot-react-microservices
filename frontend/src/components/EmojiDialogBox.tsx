import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';

type EmojiDialogBoxProps = {
  onEmojiSelect: (emoji: string) => void;
  refer: React.RefObject<HTMLDivElement | null>;
};

export default function EmojiDialogBox({ onEmojiSelect, refer }: EmojiDialogBoxProps) {
  return (
    <div ref={refer}>
      <EmojiPicker
        onEmojiClick={(emojiData: EmojiClickData) => {
          onEmojiSelect(emojiData.emoji);
        }}
      />
    </div>
  );
}
