import React from 'react';
import { render, screen, fireEvent ,waitFor} from '@testing-library/react';
import Home from './Home';
import { ThemeProvider } from '../store/ThemeContext';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { expect,vi } from 'vitest';
import axios from 'axios';
// import { mockAxios } from 'vitest';



vi.mock('axios');
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

describe('Home component', () => {

beforeEach(() => {
    // Adding a div with id 'modal-root' to the document body for modal testing
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);

    localStorage.setItem('userName', 'Test User');
    localStorage.setItem('userEmail', 'test@example.com');
  });

  afterEach(() => {
    // Clean up after each test
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }

    localStorage.clear();
    vi.resetAllMocks();
    // mockAxios.reset();

  });

 //Testing async code
  test('renders user name after fetching data', async () => {
    // Mocking the axios GET request for fetching user data
    mockAxios.mockResolvedValueOnce({
      data: {
        users: [
          { displayName: 'Test User', emailVerified: true, localId: '12345' }
        ]
      }
    });

    // Render the Home component with necessary providers
    renderWithProviders(<Home />);

    // Wait for the component to render and handle async operations
    // await waitFor(() => {
      // Expect the user's name to be displayed
      expect(await screen.findByText(/Welcome to the Expense Eagle, Test User!/i)).toBeInTheDocument();
    // });
  });

  

  test('renders email verification button if email is not verified', async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: { users: [{ localId: '12345', displayName: 'Test User', emailVerified: false }] }
    });

    renderWithProviders(<Home />);

    // await waitFor(() => {
      expect(await screen.findByText(/Verify Email/i)).toBeInTheDocument();
    // });
  });


test('renders loading state initially for email verification', async () => {
  mockAxios.post.mockResolvedValueOnce({
    data: { users: [{ localId: '12345', displayName: 'Test User', emailVerified: false}] }
  });

  renderWithProviders(<Home />);

  expect(await screen.findByText(/Loading.../i)).toBeInTheDocument();
});



 //Testing sync code
  test('renders the Home component', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/Welcome to the Expense Eagle/i)).toBeInTheDocument();
  });


  test('renders logged in email on Home UI',() => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/logged in as:/i)).toBeInTheDocument();

  })


  test('renders logged in confirmation on Home UI',() => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/you have successfully logged in,/i)).toBeInTheDocument();
  })

  test('renders note on Home UI for reminding to reload',() => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/Refresh page if profile changes are not reflecting on UI/i)).toBeInTheDocument()
  })

  test('renders Profile button', () => {
    renderWithProviders(<Home />);
    const profileButton = screen.getByRole('button', { name: /Profile/i });
    expect(profileButton).toBeInTheDocument();
  });

  test('renders Logout button', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test('renders add expenses button', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/Start adding expenses/i)).toBeInTheDocument();
  });

  
  test('renders email verification button if email is not verified', async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: { users: [{ localId: '12345', displayName: 'Test User', emailVerified: false }] }
    });
  
    renderWithProviders(<Home />);
  
    await waitFor(() => {
      expect(screen.getByText(/Verify Email/i)).toBeInTheDocument();
    });
  });

  


  test('renders Profile modal when profile button is clicked', () => {
    renderWithProviders(<Home />);
    const profileButton = screen.getByRole('button', { name: /Profile/i });
    fireEvent.click(profileButton);
    expect(screen.getByText(/View Profile/i)).toBeInTheDocument();
  });


  test('renders Profile modal input fields below view profile title', () => {
    renderWithProviders(<Home />);
    const profileButton = screen.getByRole('button', { name: /Profile/i });
    fireEvent.click(profileButton);
    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/job/i)).toBeInTheDocument();
    expect(screen.getByText(/location/i)).toBeInTheDocument();
  });

});
