// import { render, screen } from '@testing-library/react';
// import Async from './Async';

// describe('Async component', () => {
//   test('renders posts if request succeeds', async () => {
//     render(<Async />)

//     const listItemElements = await screen.findAllByRole('listitem');
//     expect(listItemElements).not.toHaveLength(0);
//   });
// });


import { render, screen } from '@testing-library/react';
import Async from './Async';
import { describe, it, expect, vi } from 'vitest';

describe('Async component', () => {
  it('renders posts if request succeeds', async () => {
    // Mock the global fetch function
    global.fetch = vi.fn();
    global.fetch.mockResolvedValueOnce({
      json: async () => [{ id: 'p1', title: 'First post' }],
    });

    render(<Async />);

    const listItemElements = await screen.findAllByRole('listitem');
    expect(listItemElements).not.toHaveLength(0);

    // Clear the mock after the test
    global.fetch.mockClear();
  });
});
