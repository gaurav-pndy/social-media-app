import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import ProfileCard from "./ProfileCard";
import { useAuth } from "../../hooks/useAuth";
import { useFetchUser } from "../../hooks/useFetchUser";

jest.mock("../../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../hooks/useFetchUser", () => ({
  useFetchUser: jest.fn(),
}));

describe("ProfileCard Component", () => {
  const mockNavigate = jest.fn();

  beforeAll(() => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockNavigate,
    }));
  });

  // Check if Profile Card is being rendered properly.

  it("renders the profile card with user information", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: "123",
        user_metadata: { name: "Gaurav Pandey", username: "gaurav" },
        email: "gaurav@email.com",
      },
    });

    (useFetchUser as jest.Mock).mockReturnValue({
      userData: { dp_url: "dp.jpg" },
    });

    render(
      <Router>
        <ProfileCard noOfPosts={2} />
      </Router>
    );

    expect(screen.getByAltText("dp")).toHaveAttribute("src", "dp.jpg");
    expect(screen.getByText("Gaurav Pandey")).toBeInTheDocument();
    expect(screen.getByText("@gaurav")).toBeInTheDocument();
    expect(screen.getByText("gaurav@email.com")).toBeInTheDocument();
    expect(screen.getByText("10 followers")).toBeInTheDocument();
    expect(screen.getByText("2 posts")).toBeInTheDocument();
    expect(screen.getByText("5 following")).toBeInTheDocument();
  });

  // Checking if "Go to Feed" button is working properly.

  it("navigates to the feed page on button click", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: "123",
        user_metadata: { name: "Gaurav Pandey", username: "gaurav" },
        email: "gaurav@email.com",
      },
    });

    (useFetchUser as jest.Mock).mockReturnValue({
      userData: { dp_url: "dp.jpg" },
    });

    render(
      <Router>
        <ProfileCard noOfPosts={2} />
      </Router>
    );

    const button = screen.getByRole("button", { name: /go to feed/i });
    await userEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/feed");
  });
});
