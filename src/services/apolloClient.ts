// This file contains initialization and set up of Apollo client

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_APOLLO_CLIENT_URI, 
    headers: {
      "apikey": import.meta.env.VITE_SUPABASE_API_KEY, 
     "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_API_KEY}`,

    },
  }),
  cache: new InMemoryCache(),
});

export default client;
