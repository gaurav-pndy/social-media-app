import { render, screen, fireEvent } from "@testing-library/react";
import Signup from "./Signup"; // Adjust the import path accordingly

const mockHandleSignup = jest.fn();
const mockSetName = jest.fn();
const mockSetUsername = jest.fn();
const mockSetEmail = jest.fn();
const mockSetPassword = jest.fn();
const mockSetNewUser = jest.fn();

describe("Signup Component", () => {
  const defaultProps = {
    name: "",
    setName: mockSetName,
    username: "",
    setUsername: mockSetUsername,
    email: "",
    setEmail: mockSetEmail,
    password: "",
    setPassword: mockSetPassword,
    handleSignup: mockHandleSignup,
    setNewUser: mockSetNewUser,
    loading: false,
  };

  // Checking if Signup form is rendered properly

  test("renders the Signup form correctly", () => {
    render(<Signup {...defaultProps} />);

    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  //  Checking if handleSignup function is called on clicking Sign Up

  test("calls handleSignup when signup button is clicked", () => {
    render(<Signup {...defaultProps} />);

    fireEvent.click(screen.getByText("Sign up"));
    expect(mockHandleSignup).toHaveBeenCalledTimes(1);
  });
});
