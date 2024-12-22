// This file contains all the queries used in this app for fetching data from database.

import { gql } from "@apollo/client";

// Query to fetch the users followed by logged in user

export const FETCH_FOLLOWING_USERS = gql`
query GetFollowing($follower_id: String!){
  follow_infoCollection(filter: {follower_id: {eq: $follower_id}}) {
    edges {
        node {
         following_id
        }
      }
  }
}
`


export const FETCH_FOLLOWERS = gql`
query GetFollowing($following_id: String!){
  follow_infoCollection(filter: {following_id: {eq: $following_id}}) {
    edges {
        node {
         follower_id
        }
      }
  }
}
`

// Query to Fetch the posts of users being followed by logged in user.

export const FETCH_FOLLOWING_USERS_POSTS_QUERY = gql`
  query FetchFollowingUsersPosts($user_ids : [String!]!) {
  postsCollection(filter: {user_id: {in: $user_ids}}) {
    edges {
      node {
        id
        post_text
        post_img_url
        user_id
        username
        tags
        created_at
        users {
          name
          dp_url
        }
      }
    }
  }
}

`;


// Query to fetch the posts of only the logged in user to show in his profile

export const FETCH_POSTS_BY_USER_QUERY = gql`
  query FetchPostsByUser($userId: Int!) {
    postsCollection(filter: { user_id: { eq: $userId } }) {
      edges {
        node {
          id
          post_text
          post_img_url
          user_id
          username
          tags
          created_at
          users {
            name
            dp_url
        }
        }
      }
    }
  }
`;


// Query to fetch the usernames of all the users

export const GET_USERS_QUERY = gql`
  query GetUsers {
    usersCollection {
       edges {
        node {
         name
          username
        }
      }
    }
  }
`;