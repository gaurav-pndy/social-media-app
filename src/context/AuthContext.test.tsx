import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import AuthContext, { AuthProvider } from "../context/AuthContext";
import { supabase } from "../services/supaBaseClient";
import { AuthContextProps } from "../types/types";

jest.mock("../services/supaBaseClient", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      updateUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    from: jest.fn(() => ({
      insert: jest.fn(),
      select: jest.fn(),
    })),
  },
}));

describe("AuthContext", () => {
  // Checking if AuthProvider is rendering children components properly.

  it("renders children", async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: null },
    });

    render(
      <AuthProvider>
        <div>Child Component</div>
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByText("Child Component")).toBeInTheDocument()
    );
  });

  // Checking if user is being set after signup.

  it("sets user after successful sign-up", async () => {
    const mockUser = { email: "gaurav@email.com", id: "123" };
    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser },
      error: null,
    });
    (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: { user: mockUser } },
    });
    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValueOnce({ error: null }),
    });

    let context: AuthContextProps | undefined;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            context = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    await act(async () => {
      await context?.signUp({
        email: "gaurav@email.com",
        password: "password123",
        name: "Gaurav Pandey",
        username: "gaurav",
      });
    });

    expect(context?.user).toEqual(mockUser);
    expect(context?.error).toBeNull();
  });

  // Checking if Error is being handled properly during failed sign up.

  it("sets error on failed sign-up", async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: { message: "Sign-up failed" },
    });

    let context: AuthContextProps | undefined;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            context = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    await act(async () => {
      await expect(
        context?.signUp({
          email: "gaurav@email.com",
          password: "password123",
          name: "Gaurav Pandey",
          username: "gaurav",
        })
      ).rejects.toThrow("Sign-up failed");
    });

    expect(context?.error).toBe("Sign-up failed");
    expect(context?.user).toBeNull();
  });
});
