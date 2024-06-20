import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "./SignUp";
import axios from "axios";
import { vi } from "vitest";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../store/ThemeContext";
import { store } from "../store/store";

// Mocking axios globally using vitest
vi.mock("axios");
const mockAxios = axios;

const renderWithProviders = (ui) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          {/* <Home></Home> */}
          {ui}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe("SignUp component - Async Tests", () => {
  beforeEach(() => {
    // Clear any mocks before each test
    vi.clearAllMocks();
  });

  test("handles signup error", async () => {
    // Mock failed signup response
    mockAxios.post.mockRejectedValueOnce(new Error("Authentication failed"));

    renderWithProviders(<SignUp></SignUp>);

    fireEvent.submit(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/Authentication failed/i)).toBeInTheDocument();
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
  });

  test("handles login error", async () => {
    // Mock failed login response
    mockAxios.post.mockRejectedValueOnce(new Error("Authentication failed"));

    renderWithProviders(<SignUp></SignUp>);

    fireEvent.click(screen.getByText(/Log in with existing account/i));

    fireEvent.submit(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/Authentication failed/i)).toBeInTheDocument();
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
  });

  test("submits signup form successfully", async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: {
        email: "test@example.com",
        idToken: "mockToken",
      },
    });
  
    renderWithProviders(<SignUp />);
  
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password" },
    });
  
    fireEvent.submit(screen.getByRole("button", { name: "Sign up" }));
  
    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledTimes(1);
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Authentication failed/i)).not.toBeInTheDocument();
    });
  });

  test("submits login form successfully", async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: {
        email: "test@example.com",
        idToken: "mockToken",
      },
    });
  
    renderWithProviders(<SignUp />);
  
    fireEvent.click(screen.getByText(/Log in with existing account/i));
  
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });
  
    fireEvent.submit(screen.getByRole("button", { name: "Log in" }));
  
    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledTimes(1);
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Authentication failed/i)).not.toBeInTheDocument();
    });
  });


test("displays error when passwords do not match", async () => {
    renderWithProviders(<SignUp />);
  
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "differentpassword" },
    });
  
    fireEvent.submit(screen.getByRole("button", { name: "Sign up" }));
  
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
      expect(mockAxios.post).not.toHaveBeenCalled();
    });
  });


  test("displays loading state during signup", async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: {
        email: "test@example.com",
        idToken: "mockToken",
      },
    });
  
    renderWithProviders(<SignUp />);
  
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password" },
    });
  
    fireEvent.submit(screen.getByRole("button", { name: "Sign up" }));
  
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
  });


  test("displays loading state during login", async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: {
        email: "test@example.com",
        idToken: "mockToken",
      },
    });
  
    renderWithProviders(<SignUp />);
  
    fireEvent.click(screen.getByText(/Log in with existing account/i));
  
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });
  
    fireEvent.submit(screen.getByRole("button", { name: "Log in" }));
  
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
  });

  
  
  
  
  
  

   
});
