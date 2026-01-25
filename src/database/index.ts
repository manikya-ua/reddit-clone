import type { Comment } from "./types/comment";
import type { Post } from "./types/post";
import type { Sub } from "./types/sub";
import type { User } from "./types/user";

export type DBResponse<T = undefined> = {
  status: "200" | "400" | "401" | "404" | "500" | "501";
  message?: string;
  responseData?: T;
};

export abstract class Database {
  /**
   * Create a new user in the database
   *
   * @param user The details of new user to be created
   */
  public abstract createUser({ user }: { user: User }): Promise<DBResponse>;
  /**
   * Update an existing user in the database
   *
   * @param id The id of the user to update
   * @param newDetails The new data to be overriden
   */
  protected abstract updateUser({
    id,
    newDetails,
  }: {
    id: User["id"];
    newDetails: Partial<User>;
  }): Promise<DBResponse>;
  /**
   *
   * @param id The id of user to be deleted
   */
  public abstract deleteUser({ id }: { id: User["id"] }): Promise<DBResponse>;
  /**
   * One of id or email is required
   *
   * @param id get user with this id
   * @param email get user with this email
   */
  public abstract getUser({
    id,
    email,
  }: {
    id?: User["id"];
    email?: User["email"];
  }): Promise<DBResponse<User>>;
  /**
   * Create a new subreddit in the database
   *
   * @param sub The details of new sub to be created
   * @param creatorId The id of the user who created the sub
   */
  public abstract createSub({
    sub,
    creatorId,
  }: {
    sub: Sub;
    creatorId: User["id"];
  }): Promise<DBResponse>;
  /**
   * Update an existing sub in the database
   *
   * @param id The id of the user to update
   * @param newDetails The new data to be overriden
   */
  protected abstract updateSub({
    id,
    newDetails,
  }: {
    id: Sub["id"];
    newDetails: Partial<Sub>;
  }): Promise<DBResponse>;

  /**
   *
   * @param userId The id of the used who joins the Sub
   * @param subId The id of the sub which user wants to join
   */
  public async joinSub({
    userId,
    subId,
  }: {
    userId: User["id"];
    subId: Sub["id"];
  }): Promise<DBResponse> {
    const { responseData: sub } = await this.getSub({ id: subId });
    const { responseData: user } = await this.getUser({ id: userId });
    const subResponse = await this.updateSub({
      id: subId,
      newDetails: { members: [...(sub?.members ?? []), userId] },
    });
    // TODO: Should wrap these two opearations in a transaction
    const userRepsone = await this.updateUser({
      id: userId,
      newDetails: { subs: [...(user?.subs ?? []), subId] },
    });
    if (subResponse.status !== "200" || userRepsone.status !== "200") {
      return {
        status: "500",
        message: `User: ${userRepsone.message}, Sub: ${subResponse.message}`,
      };
    }
    return {
      status: "200",
      message: "Ok",
    };
  }

  /**
   *
   * @param id The id of sub to be deleted
   */
  public abstract deleteSub({ id }: { id: Sub["id"] }): Promise<DBResponse>;
  /**
   *
   * @param id get sub with this id
   */
  public abstract getSub({ id }: { id: Sub["id"] }): Promise<DBResponse<Sub>>;
  /**
   * Create a new post in the database
   *
   * @param sub The details of new post to be created
   * @param creatorId The id of user who created the post
   */
  public abstract createPost({
    post,
    creatorId,
  }: {
    post: Post;
    creatorId: User["id"];
  }): Promise<DBResponse>;

  /**
   *
   * @param id The id of post to be deleted
   */
  public abstract deletePost({ id }: { id: Post["id"] }): Promise<DBResponse>;
  /**
   *
   * @param id get post with this id
   */
  public abstract getPost({
    id,
  }: {
    id: Post["id"];
  }): Promise<DBResponse<Post>>;

  /**
   * Create a new comment in the database
   *
   * @param sub The details of new comment to be created
   */
  public abstract createComment({
    comment,
  }: {
    comment: Comment;
  }): Promise<DBResponse>;

  /**
   * Update a comment
   * @param commentId The id of the comment to update
   * @param newComment The new details to be put
   */
  protected abstract updateComment({
    commentId,
    newComment,
  }: {
    commentId: Comment["id"];
    newComment: Partial<Comment>;
  }): Promise<DBResponse>;

  /**
   * Delete a comment
   * @param commentId The id of the comment to be deleted
   */
  public deleteComment({
    commentId,
  }: {
    commentId: string;
  }): Promise<DBResponse> {
    return this.updateComment({
      commentId,
      newComment: {
        content: "This comment was deleted",
      },
    });
  }

  /**
   *
   * @param id get comment with this id
   */
  public abstract getComment({
    id,
  }: {
    id: Comment["id"];
  }): Promise<DBResponse<Comment>>;
}
