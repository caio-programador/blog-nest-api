import { PostResponse } from "../dto/post-response.dto";
import { PostEntity } from "../entities/post.entity";

export const parseToDto = (post: PostEntity): PostResponse => {
  return new PostResponse(
      post.id,
      post.title,
      post.description,
      {
        id: post.user.id,
        email: post.user.email,
      },
      post.createdAt,
      post.updatedAt,
      post.categories
    )
}