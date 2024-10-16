import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom/extend-expect';

jest.mock('./components/HomePage', () => () => <div>Home Page</div>);
jest.mock('./components/RegisterStudent', () => () => <div>Register Student Page</div>);
jest.mock('./components/LoginRegisterPage', () => () => <div>Login Register Page</div>);
jest.mock('./components/LandingPage', () => () => <div>Landing Page</div>);
jest.mock('./components/ForgotPasswordPage', () => () => <div>Forgot Password Page</div>);
jest.mock('./components/Webcam', () => () => <div>Webcam Component</div>);
jest.mock('./components/Dashboard', () => () => <div>Dashboard Page</div>);

describe('App routing tests', () => {
  test('renders Landing Page by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Landing Page')).toBeInTheDocument();
  });

  test('renders Home Page on /home route', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  test('renders Register Student Page on /registerstudent route', () => {
    render(
      <MemoryRouter initialEntries={['/registerstudent']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Register Student Page')).toBeInTheDocument();
  });

  test('renders Login Register Page on /loginregisterpage route', () => {
    render(
      <MemoryRouter initialEntries={['/loginregisterpage']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Login Register Page')).toBeInTheDocument();
  });

  test('renders Forgot Password Page on /forgotpasswordpage route', () => {
    render(
      <MemoryRouter initialEntries={['/forgotpasswordpage']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Forgot Password Page')).toBeInTheDocument();
  });

  test('renders Dashboard Page on /dashboard route', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });

  test('renders Webcam Component on /capture route', () => {
    render(
      <MemoryRouter initialEntries={['/capture']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Webcam Component')).toBeInTheDocument();
  });
});
