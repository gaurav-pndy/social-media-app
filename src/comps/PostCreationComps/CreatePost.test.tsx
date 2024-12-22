// createpost.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreatePost from "./CreatePost";
import { useMutation, useQuery } from "@apollo/client";
import { useAuth } from "../../hooks/useAuth";

jest.mock("@apollo/client", () => ({
  gql: jest.fn(() => ({})), // Mock implementation
  useMutation: jest.fn(),
  useQuery: jest.fn(),
}));

jest.mock("../../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../services/supaBaseClient", () => ({
  supabase: {
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn().mockResolvedValue({}),
      getPublicUrl: jest
        .fn()
        .mockReturnValue({ data: { publicUrl: "mock-url" } }),
    },
  },
}));

describe("CreatePost Component", () => {
  const mockUser = { id: "123", user_metadata: { username: "john_doe" } };
  const mockUsersData = {
    usersCollection: { edges: [{ node: { username: "jane_doe" } }] },
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useQuery as jest.Mock).mockReturnValue({ data: mockUsersData });
    (useMutation as jest.Mock).mockReturnValue([jest.fn(), jest.fn()]);
  });

  // Checking if CreatePost component is being rendered properly.

  test("renders CreatePost component correctly", () => {
    render(<CreatePost />);

    expect(
      screen.getByPlaceholderText("What's on your mind?")
    ).toBeInTheDocument();
    expect(screen.getByText("Post")).toBeInTheDocument();
  });

  // Checking ig user tagging is working properly.

  test("tags a user correctly", () => {
    render(<CreatePost />);

    fireEvent.change(screen.getByPlaceholderText("Search users..."), {
      target: { value: "pankaj" },
    });

    expect(screen.getByText("pankaj")).toBeInTheDocument();

    fireEvent.click(screen.getByText("pankaj"));

    expect(screen.getByText("pankaj")).toBeInTheDocument();
  });

  // Checking if 'Post' button is working properly and Create Post mutation is being called.

  test("handles post creation with image upload", async () => {
    const mockCreatePost = jest.fn();
    (useMutation as jest.Mock).mockReturnValue([mockCreatePost]);

    render(<CreatePost />);

    fireEvent.change(screen.getByPlaceholderText("What's on your mind?"), {
      target: { value: "Test Post with Image" },
    });

    const fileInput = screen.getByLabelText("Upload Image");
    const file = new File(["image"], "test.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText("Post"));

    await waitFor(() => {
      expect(mockCreatePost).toHaveBeenCalledWith({
        variables: {
          postText: "Hello there !",
          postImgUrl: "example.com",
          userId: "123",
          username: "gaurav",
          tags: JSON.stringify([]),
        },
      });
    });
  });
});
