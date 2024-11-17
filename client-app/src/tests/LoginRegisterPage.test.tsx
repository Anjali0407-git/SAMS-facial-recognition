import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginRegisterPage from '../components/LoginRegisterPage'; 
// Ensure that '@testing-library/jest-dom' is configured in your Jest setup file.

// Mock the navigation function used by the useNavigate hook
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

describe('LoginRegisterPage', () => {
    beforeEach(() => {
        // Reset mocks before each test
        mockedNavigate.mockReset();
        render(<LoginRegisterPage />);
    });

    it('renders the login and register buttons', () => {
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('switches to the registration form when the register button is clicked', async () => {
        const registerButtons = screen.getAllByRole('button', { name: /register/i });
        userEvent.click(registerButtons[0]); // Adjust index based on actual UI
        const nameInput = await screen.findByPlaceholderText('Name'); // Use findBy to wait for the input to appear
        expect(nameInput).toBeInTheDocument();
    });

    it('submits the login form and navigates to home on success', async () => {
        // Setup fetch mock for a successful login
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ access_token: '12345', role: 'admin' })
            })
        ) as jest.Mock;

        userEvent.type(screen.getByPlaceholderText('Email or bannerId'), 'testuser');
        userEvent.type(screen.getByPlaceholderText('Password'), 'password');
        userEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('/home');
        });
    });

    it('displays an error via snackbar if the login fails', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ detail: 'Invalid credentials' })
            })
        ) as jest.Mock;

        userEvent.type(screen.getByPlaceholderText('Email or bannerId'), 'wronguser');
        userEvent.type(screen.getByPlaceholderText('Password'), 'wrongpassword');
        userEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            // Use regex and include case-insensitivity to handle dynamic text formatting
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });

});
