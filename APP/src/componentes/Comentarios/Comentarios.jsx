import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, ChevronRight } from "lucide-react";
import "./comentarios.css";
import { useUser } from "../../context/UserContext";

const initialComments = [
  {
    id: 1,
    user: {
      name: "João Silva",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    date: "2025-05-28T14:00:00",
    text: "Esse produto é excelente! Recomendo muito.",
    likes: 5,
    dislikes: 0,
    replies: [
      {
        id: 11,
        user: {
          name: "Carlos Pereira",
          avatar: "https://i.pravatar.cc/150?img=3",
        },
        date: "2025-05-28T16:00:00",
        text: "Concordo! Comprei e chegou rapidinho.",
        likes: 2,
        dislikes: 0,
      },
    ],
  },
  {
    id: 2,
    user: {
      name: "Maria Oliveira",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    date: "2025-05-27T09:15:00",
    text: "Gostei, mas poderia ser mais barato.",
    likes: 3,
    dislikes: 1,
    replies: [],
  },
];

function Comentarios() {
  const { user } = useUser();
  const [userData, setUserData] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [visibleReplies, setVisibleReplies] = useState({});
  const [inputValue, setInputValue] = useState("");

  const hasPurchased = true;

  useEffect(() => {
    setUserData(user);
  }, [user]);

  const toggleReplies = (commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleLike = (id, isReply = false, parentId = null) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (isReply && comment.id === parentId) {
          const updatedReplies = comment.replies.map((reply) =>
            reply.id === id ? { ...reply, likes: reply.likes + 1 } : reply
          );
          return { ...comment, replies: updatedReplies };
        }
        if (!isReply && comment.id === id) {
          return { ...comment, likes: comment.likes + 1 };
        }
        return comment;
      })
    );
  };

  const handleDislike = (id, isReply = false, parentId = null) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (isReply && comment.id === parentId) {
          const updatedReplies = comment.replies.map((reply) =>
            reply.id === id ? { ...reply, dislikes: reply.dislikes + 1 } : reply
          );
          return { ...comment, replies: updatedReplies };
        }
        if (!isReply && comment.id === id) {
          return { ...comment, dislikes: comment.dislikes + 1 };
        }
        return comment;
      })
    );
  };

  const handleComment = () => {
    if (!inputValue.trim()) return;

    const newComment = {
      id: Date.now,
      user: {
        name: userData.name,
        avatar: userData.profile_photo,
      },
      date: new Date(),
      text: inputValue,
      likes: 0,
      dislikes: 0,
      replies: [],
    };

    setComments((prev) => [...prev, newComment]);

    console.log("mudou", newComment);
  };

  return (
    <div className="comment-list">
      <h3>Comentários</h3>

      {hasPurchased && userData?.id && (
        <div className="can-comment">
          Você pode comentar sobre este produto.
        </div>
      )}

      {comments.length === 0 ? (
        <p className="no-comments">
          Ainda não há comentários para este produto.
        </p>
      ) : (
        comments.map((comment) => (
          <div key={comment?.id} className="comment-card">
            <img
              src={comment?.user?.avatar}
              alt={comment?.user?.name}
              className="avatar"
            />
            <div className="comment-content">
              <div className="comment-header">
                <strong>{comment?.user?.name}</strong>
                <span className="date">
                  {new Date(comment?.date).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <p>{comment?.text}</p>
              <div className="comment-actions">
                <button onClick={() => handleLike(comment?.id)}>
                  <ThumbsUp size={16} />
                  <span>{comment?.likes}</span>
                </button>
                <button onClick={() => handleDislike(comment?.id)}>
                  <ThumbsDown size={16} />
                  <span>{comment?.dislikes}</span>
                </button>
              </div>
              {comment?.replies?.length > 0 && (
                <>
                  <button
                    className="toggle-replies-btn"
                    onClick={() => toggleReplies(comment.id)}
                  >
                    {visibleReplies[comment?.id]
                      ? "Ocultar respostas"
                      : "Mostrar respostas"}
                  </button>

                  {visibleReplies[comment?.id] && (
                    <div className="replies">
                      {comment?.replies?.map((reply) => (
                        <div key={reply.id} className="reply-card">
                          <img
                            src={reply?.user?.avatar}
                            alt={reply?.user?.name}
                            className="avatar"
                          />
                          <div className="comment-content">
                            <div className="comment-header">
                              <strong>{reply?.user?.name}</strong>
                              <span className="date">
                                {new Date(reply?.date).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </span>
                            </div>
                            <p>{reply?.text}</p>
                            <div className="comment-actions">
                              <button
                                onClick={() =>
                                  handleLike(reply?.id, true, comment.id)
                                }
                              >
                                <ThumbsUp size={16} />
                                <span>{reply?.likes}</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleDislike(reply?.id, true, comment?.id)
                                }
                              >
                                <ThumbsDown size={16} />
                                <span>{reply?.dislikes}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))
      )}

      {hasPurchased && userData?.id && (
        <div className="comment-input-box">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              if (e.target.value.length > 300) return;

              setInputValue(e.target.value);
            }}
            placeholder="De sua opinião sobre o produto"
          />{" "}
          <button onClick={() => handleComment()}>
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

export default Comentarios;
