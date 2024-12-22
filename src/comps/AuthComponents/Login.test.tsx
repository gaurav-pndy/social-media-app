import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./Login";

const mockHandleLogin = jest.fn();
const mockSetEmail = jest.fn();
const mockSetPassword = jest.fn();
const mockSetNewUser = jest.fn();

describe("Login Component", () => {
  const defaultProps = {
    email: "",
    setEmail: mockSetEmail,
    password: "",
    setPassword: mockSetPassword,
    handleLogin: mockHandleLogin,
    setNewUser: mockSetNewUser,
    loading: false,
  };

  // Checking if the login form elements are rendered properly

  test("renders Login form correctly", () => {
    render(<Login {...defaultProps} />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  // Checking if handleLogin function is called on clicking login

  test("calls handleLogin function when login button is clicked", () => {
    render(<Login {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(mockHandleLogin).toHaveBeenCalledTimes(1);
  });
});
