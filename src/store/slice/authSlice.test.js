import authReducer, { login, logout, setIsAuthenticated } from './authSlice';

describe('authSlice', () => {
  const initialState = {
    isAuthenticated: null,
    userEmail: null,
  };

  //Test Case 1: Initial State Test
  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  //Test Case 2: Login Action Test
  it('should handle login', () => {
    const action = login({ email: 'test@example.com', token: 'test-token' });
    const expectedState = {
      isAuthenticated: true,
      userEmail: 'test@example.com',
    };
    const state = authReducer(initialState, action);
    expect(state).toEqual(expectedState);
    expect(localStorage.getItem('token')).toEqual('test-token');
    expect(localStorage.getItem('userEmail')).toEqual('test@example.com');
  });

  //Test Case 3: Logout Action Test
  it('should handle logout', () => {
    const loggedInState = {
      isAuthenticated: true,
      userEmail: 'test@example.com',
    };
    const action = logout();
    const expectedState = {
      isAuthenticated: false,
      userEmail: null,
    };
    const state = authReducer(loggedInState, action);
    expect(state).toEqual(expectedState);
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userEmail')).toBeNull();
  });

  //Test Case 4: SetIsAuthenticated Action Test
  it('should handle setIsAuthenticated', () => {
    const action = setIsAuthenticated(true);
    const expectedState = {
      isAuthenticated: true,
      userEmail: null,
    };
    const state = authReducer(initialState, action);
    expect(state).toEqual(expectedState);
  });
});
