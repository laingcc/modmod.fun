import { ThreadComment } from '../components/comment/comment.component';

export function getRootComments(comments: ThreadComment[]): ThreadComment[] {
  return comments
    .filter((comment) => !comment.parentId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getChildComments(
  comments: ThreadComment[],
  parentId: number
): ThreadComment[] {
  return comments
    .filter((comment) => comment.parentId === parentId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getAllDescendants(
  comments: ThreadComment[],
  parentId: number
): ThreadComment[] {
  const descendants: ThreadComment[] = [];
  const stack = comments.filter((comment) => comment.parentId === parentId);

  while (stack.length > 0) {
    const current = stack.pop();
    if (current) {
      descendants.push(current);
      stack.push(
        ...comments.filter((comment) => comment.parentId === current.id)
      );
    }
  }

  return descendants.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
