import { useNavigate } from "react-router-dom";

interface MentionParserProps {
  text: string;
}

export default function MentionParser({ text }: MentionParserProps) {
  const navigate = useNavigate();

  const parts = text.split(/(@\w+|\n)/g);

  return (
    <div style={{ whiteSpace: "pre-wrap" }}>
      {parts.map((part, index) => {
        if (part.startsWith('@')) {
          const username = part.slice(1);
          return (
            <span
              key={index}
              style={{ color: '#1DA1F2', cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/${username}`);
              }}
            >
              {part}
            </span>
          );
        } else if (part === "\n") {
          return <br key={index} />; // render new line
        } else {
          return <span key={index}>{part}</span>;
        }
      })}
    </div>
  );
}
