export interface UserVoteRequest {
    userId: number;
    postId: number;
    upvote: boolean;
}