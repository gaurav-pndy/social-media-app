# Social Media App

A modern social media platform built with React, TypeScript, Supabase (for authentication and GraphQL), and Tailwind CSS. This app allows users to sign up, create posts, follow other users, and view a personalized news feed. The app features smooth scrolling for posts, the ability to tag users in posts, and is built with TypeScript for type safety.

## Features

- **User Authentication**: Secure sign-up and login using Supabase Auth.
- **News Feed**: Displays posts from users that the logged-in user follows. Posts are fetched through a GraphQL endpoint.
- **Post Creation**: Users can create new posts, attach images, and tag other users.
- **Follow/Unfollow**: Users can follow and unfollow each other.
- **TypeScript**: Type safety is enforced for all app data and logic.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (for authentication and GraphQL)
- **Authentication**: Supabase Auth
- **Data Fetching**: GraphQL

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js (v14 or above)
- npm or yarn
- A Supabase account for authentication and GraphQL endpoint

### Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/gaurav-pndy/social-app.git
   cd social-app
   ```

2. Install the dependencies:

```bash
npm install
# or
yarn install
```

3. Set up Supabase:

- Create a Supabase account and project.

- Enable Authentication with Supabase Auth.

- Create the necessary tables: users, posts, and follow_info.

- Configure GraphQL endpoints using Supabase.

- Add the required configuration keys to your .env file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_API_KEY=your_supabase_anon_key
```
4. Run the app locally:

```bash
npm run dev
# or
yarn start
```

## Features Breakdown

### User Authentication (Supabase Auth)

-Users can sign up, log in, and log out securely via Supabase Auth.
-The app uses JWT tokens for user sessions.

### News Feed

-The news feed displays posts from users that the current user follows.
-Posts are fetched using a GraphQL query to the Supabase backend.

### Post Creation

-Users can create posts with text and images.
-Tagging other users is supported in posts, providing an interactive experience.
-GraphQL mutations are used to create new posts.

### Follow/Unfollow

-Users can follow and unfollow other users.
-GraphQL queries and mutations handle the follow relationships.

### TypeScript for Type Safety

-TypeScript ensures that all data structures, queries, and mutations are type-safe, preventing runtime errors and improving developer experience.

### UI with React and Tailwind CSS

-The app uses React components for modularity and scalability.
-Tailwind CSS is used for responsive and modern styling.

### Testing

-Tests are written for core components and functions.
-Use Jest and React Testing Library to run tests and ensure app stability.


## Deployment

**The app is deployed to Vercel for live testing. You can access the live demo [here](https://social-app-nine-gold.vercel.app/)**
