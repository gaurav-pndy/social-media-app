import FollowCard from "./FollowCard";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useMutation } from "@apollo/client";
import { useAuth } from "../../hooks/useAuth";

jest.mock("@apollo/client", () => ({
  useMutation: jest.fn(),
}));

jest.mock("../../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

const mockFollowUser = jest.fn();
const mockUnfollowUser = jest.fn();

describe("FollowCard Component", () => {
  const mockUser = { id: "123" };
  const mockPerson = {
    id: "1",
    uid: "123",
    name: "Gaurav Pandey",
    email: "gaurav@email.com",
    username: "gaurav",
    dp_url: "/profile.jpg",
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useMutation as jest.Mock).mockReturnValue([
      mockFollowUser,
      mockUnfollowUser,
    ]);
  });

  // Checking if FollowCard is being rendered properly.

  test("renders FollowCard component correctly", () => {
    render(<FollowCard person={mockPerson} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("@john_doe")).toBeInTheDocument();
    expect(screen.getByAltText("")).toHaveAttribute("src", "/profile.jpg");
    expect(screen.getByText("Follow")).toBeInTheDocument();
  });

  // Checking if Follow button is working properly.

  test("calls follow mutation when follow button is clicked", async () => {
    render(<FollowCard person={mockPerson} />);

    fireEvent.click(screen.getByText("Follow"));

    expect(mockFollowUser).toHaveBeenCalledWith({
      variables: { follower_id: "123", following_id: "456" },
    });

    await waitFor(() =>
      expect(screen.getByText("Unfollow")).toBeInTheDocument()
    );
  });

  // Checking if Unfollow button is working properly.

  test("calls unfollow mutation when unfollow button is clicked", async () => {
    render(<FollowCard person={mockPerson} />);

    const { rerender } = render(<FollowCard person={mockPerson} />);
    fireEvent.click(screen.getByText("Follow")); // Clicking Follow once to allow to then unfollow it.

    rerender(<FollowCard person={mockPerson} />);

    fireEvent.click(screen.getByText("Unfollow"));

    expect(mockUnfollowUser).toHaveBeenCalledWith({
      variables: { follower_id: "123", following_id: "456" },
    });

    await waitFor(() => expect(screen.getByText("Follow")).toBeInTheDocument());
  });
});
