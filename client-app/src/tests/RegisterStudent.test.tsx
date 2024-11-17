import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterStudent from '../components/RegisterStudent';
import { BrowserRouter } from 'react-router-dom';

const setup = () => render(
  <BrowserRouter>
    <RegisterStudent />
  </BrowserRouter>
);

describe('RegisterStudent', () => {
    beforeEach(() => {
        setup();
    });

    it('renders the registration form with all fields', async () => {
        expect(await screen.findByLabelText(/First Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Banner ID/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /upload image/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('allows entering text in input fields and selecting options', async () => {
        await userEvent.type(screen.getByLabelText(/First Name/i), 'John');
        await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
        await userEvent.type(screen.getByLabelText(/Email/i), 'john.doe@example.com');

        expect(screen.getByLabelText(/First Name/i)).toHaveValue('John');
    });

    it('submits the form when all fields are filled correctly', async () => {
        const submitButton = screen.getByRole('button', { name: /Register/i });
    
        // Fill in the form
        userEvent.type(screen.getByLabelText(/First Name/i), 'John');
        userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
        userEvent.type(screen.getByLabelText(/Email/i), 'john.doe@example.com');
        userEvent.type(screen.getByLabelText(/Password/i), '12345');
        userEvent.type(screen.getByLabelText(/Banner ID/i), 'B00123456');
    
        // Mock fetch request
        global.fetch = jest.fn(() =>
            Promise.resolve(new Response(JSON.stringify({ message: 'Registration successful' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }))
        );
    
        // Act
        userEvent.click(submitButton);
    });
    
    
    
});
