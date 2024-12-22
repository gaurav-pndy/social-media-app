import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ApolloProvider } from "@apollo/client";
import client from "./services/apolloClient.ts";
import { Toaster } from "./components/ui/toaster.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ApolloProvider client={client}>
        <App />
        <Toaster />
      </ApolloProvider>
    </AuthProvider>
  </StrictMode>
);
