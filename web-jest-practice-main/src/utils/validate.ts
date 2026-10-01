interface PostInput {
  title: string;
  content: string;
}

function isValidPost(post: PostInput): boolean {
  return (
    typeof post.title === "string" &&
    post.title.trim().length > 0 &&
    typeof post.content === "string" &&
    post.content.trim().length > 0
  );
}

export type { PostInput };
export { isValidPost };
