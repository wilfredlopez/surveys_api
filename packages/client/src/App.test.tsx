import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders React Surveys', () => {
  render(<App />);
  const linkElement = screen.getByText(/React Surveys/i);
  expect(linkElement).toBeInTheDocument();
});
