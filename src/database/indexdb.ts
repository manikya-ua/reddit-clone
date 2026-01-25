import { type IDBPDatabase, openDB } from "idb";
import { ZodError, type ZodObject } from "zod";
import { Database, type DBResponse } from ".";
import { type Comment, CommentValidator } from "./types/comment";
import { type Post, PostValidator } from "./types/post";
import { type Sub, SubValidator } from "./types/sub";
import { type User, UserValidator } from "./types/user";

export const USERS_STORE = "users";
export const POSTS_STORE = "posts";
export const SUBS_STORE = "subs";
export const COMMENTS_STORE = "comments";

type Store =
  | typeof USERS_STORE
  | typeof POSTS_STORE
  | typeof SUBS_STORE
  | typeof COMMENTS_STORE;

export class IndexedDbProvider extends Database {
  constructor() {
    super();
    this.getDB().then((db) => {
      db.createObjectStore(USERS_STORE, {
        keyPath: "id",
      }).createIndex("email", "email");
      db.createObjectStore(POSTS_STORE, {
        keyPath: "id",
      });
      db.createObjectStore(SUBS_STORE, {
        keyPath: "id",
      });
      db.createObjectStore(COMMENTS_STORE, {
        keyPath: "id",
      });
    });
  }

  private async getDB(): Promise<IDBPDatabase> {
    return await openDB("reddit");
  }

  private async addToStore({
    store,
    data,
    validator,
  }: {
    store: Store;
    data: unknown;
    validator: ZodObject;
  }): Promise<DBResponse> {
    try {
      const db = await this.getDB();
      const validData = validator.parse(data);
      await db.add(store, validData);
      return {
        status: "200",
        message: "Ok",
      };
    } catch (e) {
      if (e instanceof ZodError) {
        return {
          status: "400",
          message: e.message,
        };
      }
      return {
        status: "500",
        message: `Error: ${e}`,
      };
    }
  }

  private async getFromStore<T>({
    store,
    key,
  }: {
    store: Store;
    key: IDBValidKey | IDBKeyRange;
  }): Promise<DBResponse<T>> {
    const db = await this.getDB();
    const sub = await db.get(store, key);
    if (!sub) {
      return {
        status: "404",
        message: "Not found",
      };
    }
    return {
      status: "200",
      message: "Ok",
      responseData: sub,
    };
  }

  private async getFromStoreByIndex<T>({
    key,
    keyVal,
    store,
  }: {
    store: Store;
    key: string;
    keyVal: IDBValidKey | IDBKeyRange;
  }): Promise<DBResponse<T>> {
    const db = await this.getDB();
    const result = await db.getFromIndex(store, key, keyVal);
    if (!result) {
      return { status: "404", message: "Not found" };
    }
    return {
      status: "200",
      message: "Ok",
      responseData: result,
    };
  }

  private async updateInStore<T>({
    store,
    key,
    newDetails,
  }: {
    store: Store;
    key: IDBValidKey | IDBKeyRange;
    newDetails: T;
  }): Promise<DBResponse> {
    const db = await this.getDB();
    const existing = await db.get(store, key);
    await db.put(store, { ...existing, ...newDetails });
    return {
      status: "200",
      message: "Ok",
    };
  }

  private async deleteInStore({
    key,
    store,
  }: {
    store: Store;
    key: IDBValidKey | IDBKeyRange;
  }): Promise<DBResponse> {
    const db = await this.getDB();
    await db.delete(store, key);
    return {
      status: "200",
      message: "Ok",
    };
  }

  public async createUser({ user }: { user: User }): Promise<DBResponse> {
    return await this.addToStore({
      store: USERS_STORE,
      data: user,
      validator: UserValidator,
    });
  }

  public async getUser({
    email,
    id,
  }: {
    id?: User["id"];
    email?: User["email"];
  }): Promise<DBResponse<User>> {
    if (email) {
      return this.getFromStoreByIndex({
        store: USERS_STORE,
        key: "email",
        keyVal: email,
      });
    } else if (id) {
      return this.getFromStore({
        store: USERS_STORE,
        key: id,
      });
    }
    return {
      status: "400",
      message: "Should have either id or email or both",
    };
  }

  public async updateUser({
    id,
    newDetails,
  }: {
    id: User["id"];
    newDetails: Partial<User>;
  }): Promise<DBResponse> {
    return await this.updateInStore({
      store: USERS_STORE,
      key: id,
      newDetails,
    });
  }

  public async deleteUser({ id }: { id: User["id"] }): Promise<DBResponse> {
    return await this.deleteInStore({ store: USERS_STORE, key: id });
  }

  public async createSub({
    sub,
    creatorId: _creatorId,
  }: {
    sub: Sub;
    creatorId: User["id"];
  }): Promise<DBResponse> {
    return await this.addToStore({
      store: SUBS_STORE,
      data: sub,
      validator: SubValidator,
    });
  }

  public async getSub({ id }: { id: Sub["id"] }): Promise<DBResponse<Sub>> {
    return await this.getFromStore({
      store: SUBS_STORE,
      key: id,
    });
  }

  protected async updateSub({
    id,
    newDetails,
  }: {
    id: Sub["id"];
    newDetails: Partial<Sub>;
  }): Promise<DBResponse> {
    return await this.updateInStore({ store: SUBS_STORE, key: id, newDetails });
  }

  public async deleteSub({ id }: { id: Sub["id"] }): Promise<DBResponse> {
    return await this.deleteInStore({
      key: id,
      store: SUBS_STORE,
    });
  }

  public async createPost({
    post,
    creatorId: _creatorId,
  }: {
    post: Post;
    creatorId: User["id"];
  }): Promise<DBResponse> {
    return await this.addToStore({
      store: POSTS_STORE,
      data: post,
      validator: PostValidator,
    });
  }

  public async getPost({ id }: { id: Post["id"] }): Promise<DBResponse<Post>> {
    return await this.getFromStore({
      store: POSTS_STORE,
      key: id,
    });
  }

  public async deletePost({ id }: { id: Post["id"] }): Promise<DBResponse> {
    return await this.deleteInStore({
      key: id,
      store: POSTS_STORE,
    });
  }

  public async createComment({
    comment,
  }: {
    comment: Comment;
  }): Promise<DBResponse> {
    return this.addToStore({
      data: comment,
      store: COMMENTS_STORE,
      validator: CommentValidator,
    });
  }

  public async getComment({
    id,
  }: {
    id: Comment["id"];
  }): Promise<DBResponse<Comment>> {
    return await this.getFromStore({
      store: COMMENTS_STORE,
      key: id,
    });
  }

  public async updateComment({
    commentId,
    newComment,
  }: {
    commentId: Comment["id"];
    newComment: Partial<Comment>;
  }): Promise<DBResponse> {
    return await this.updateInStore({
      store: COMMENTS_STORE,
      key: commentId,
      newDetails: newComment,
    });
  }
}
