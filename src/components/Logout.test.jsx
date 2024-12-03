import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
import { logout } from '../store/authSlice';

// Mock the necessary hooks and functions
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('../store/authSlice', () => ({
  logout: vi.fn(),
}));

describe('Logout component', () => {
  let dispatchMock;
  let navigateMock;

  beforeEach(() => {
    dispatchMock = vi.fn();
    navigateMock = vi.fn();

    useDispatch.mockReturnValue(dispatchMock);
    useNavigate.mockReturnValue(navigateMock);
  });

  it('renders logout button', () => {
    render(<Logout />);
    const logoutButton = screen.getByText(/Logout/i);
    expect(logoutButton).toBeInTheDocument();
  });

  it('dispatches logout action on button click', () => {
    render(<Logout />);
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);
    expect(dispatchMock).toHaveBeenCalledWith(logout());
  });

  it('navigates to signup on button click', () => {
    render(<Logout />);
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);
    expect(navigateMock).toHaveBeenCalledWith('/signup');
  });

  it('calls dispatch and navigate exactly once on button click', () => {
    render(<Logout />);
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledTimes(1);
  });
});
