// This file contains all the mutations used in this app for inserting or updating the data in database

import { gql } from "@apollo/client";

// Mutation to create a new post and insert its info in the posts table

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost(
    $postText: String!
    $postImgUrl: String
    $userId: String!
    $username: String!
    $tags: [String!]!
  ) {
    insertIntopostsCollection(
      objects: {
        post_text: $postText
        post_img_url: $postImgUrl
        user_id: $userId
        username: $username
        tags: $tags
      }
    ) {
      records {
        id
        post_text
        post_img_url
        user_id
        username
        tags
      }
    }
  }
`;


// Mutation to create a new follow relationship between two users and insert it into follow_info table

export const FOLLOW_USER_MUTATION = gql`
mutation FollowUser($follower_id: String!, $following_id: String!) {
  insertIntofollow_infoCollection(objects: {follower_id: $follower_id, following_id: $following_id }) {
    records {
      id
      follower_id
      following_id
    }
  }
}
`

// Mutation to remove a follow relationship between two users and also remove it from follow_info table

export const UNFOLLOW_USER_MUTATION = gql`
mutation UnfollowUser($follower_id: String!, $following_id: String!) {
  deleteFromfollow_infoCollection(filter: {follower_id: {eq: $follower_id}, following_id: {eq: $following_id}}) {
    records{
      id
      follower_id
      following_id
    }
  }
}
`