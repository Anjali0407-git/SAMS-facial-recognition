import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../components/Dashboard'; // Adjust the import path as necessary
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

describe('Dashboard Component', () => {
    beforeEach(() => {
      fetchMock.resetMocks();
    });
  
    it('fetches attendance logs successfully', async () => {
      const fakeLogs = [{
        student_name: 'John Doe',
        student_id: '001',
        timestamp: new Date().toISOString(),
        location_label: 'Main Gate'
      }];
  
      // Mock the fetch call to return fake logs and a 200 status
      fetchMock.mockResponseOnce(JSON.stringify(fakeLogs), { status: 200 });
  
      render(
        <Router>
          <Dashboard />
        </Router>
      );
  
      // Wait for the fetch to complete and UI to update
      await waitFor(() => {
        // Check that the fetch was called
        expect(fetchMock).toHaveBeenCalled();
  
        // Check if specific data appears in the document
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('001')).toBeInTheDocument();
        expect(screen.getByText(/main gate/i)).toBeInTheDocument();
      });
    });
  
    it('displays no records found when there are no logs', async () => {
      // Return an empty array for logs
      fetchMock.mockResponseOnce(JSON.stringify([]), { status: 200 });
  
      render(
        <Router>
          <Dashboard />
        </Router>
      );
  
      // Wait for the fetch to complete and UI to update
      await waitFor(() => {
        expect(screen.getByText('No attendance records found for this date.')).toBeInTheDocument();
      });
    });

    it('renders correctly with header and initial table headers', async () => {
      render(
        <Router>
          <Dashboard />
        </Router>
      );
  
      // Check for the header text
      expect(screen.getByText('Attendance Logs')).toBeInTheDocument();
  
      // Verify table headers are present
      const headers = ['Student Name', 'Banner ID', 'Time of Login', 'Location'];
      headers.forEach(header => {
        expect(screen.getByText(header)).toBeInTheDocument();
      });
    });
  
    it('makes an API call to fetch attendance logs on component mount', async () => {
      render(
        <Router>
          <Dashboard />
        </Router>
      );
  
      await waitFor(() => {
        // Ensure the fetch was called once
        expect(fetchMock).toHaveBeenCalledTimes(1);
      });
  
      // Optionally check for specific endpoint if needed
      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('get_attendance_logs'));
    });

    it('displays no attendance records message if API returns empty array', async () => {
      // Setup fetch mock to return an empty array
      fetchMock.mockResponseOnce(JSON.stringify([]));
  
      render(
        <Router>
          <Dashboard />
        </Router>
      );
  
      await waitFor(() => {
        expect(screen.getByText('No attendance records found for this date.')).toBeInTheDocument();
      });
    });
  });
//     beforeEach(() => {
//       fetchMock.resetMocks();
//       fetchMock.mockResponseOnce(JSON.stringify([])); // Default empty response for all tests
//     });
  
//     it('renders correctly with header and initial table headers', async () => {
//       render(
//         <Router>
//           <Dashboard />
//         </Router>
//       );
  
//       // Check for the header text
//       expect(screen.getByText('Attendance Logs')).toBeInTheDocument();
  
//       // Verify table headers are present
//       const headers = ['Student Name', 'Banner ID', 'Time of Login', 'Location'];
//       headers.forEach(header => {
//         expect(screen.getByText(header)).toBeInTheDocument();
//       });
//     });
  
//     it('makes an API call to fetch attendance logs on component mount', async () => {
//       render(
//         <Router>
//           <Dashboard />
//         </Router>
//       );
  
//       await waitFor(() => {
//         // Ensure the fetch was called once
//         expect(fetchMock).toHaveBeenCalledTimes(1);
//       });
  
//       // Optionally check for specific endpoint if needed
//       expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('get_attendance_logs'));
//     });
  
//     it('displays no attendance records message if API returns empty array', async () => {
//       // Setup fetch mock to return an empty array
//       fetchMock.mockResponseOnce(JSON.stringify([]));
  
//       render(
//         <Router>
//           <Dashboard />
//         </Router>
//       );
  
//       await waitFor(() => {
//         expect(screen.getByText('No attendance records found for this date.')).toBeInTheDocument();
//       });
//     });

//     it('fetches attendance logs successfully', async () => {
//         const fakeLogs = [{
//           student_name: 'John Doe',
//           student_id: '001',
//           timestamp: new Date().toISOString(),
//           location_label: 'Main Gate'
//         }];
    
//         // Mock the fetch call to return fake logs and a 200 status
//         fetchMock.mockResponseOnce(JSON.stringify(fakeLogs), { status: 200 });
    
//         render(
//           <Router>
//             <Dashboard />
//           </Router>
//         );
    
//         // Wait for the fetch to complete and UI to update
//         await waitFor(() => {
//           // Check that the fetch was called
//           expect(fetchMock).toHaveBeenCalled();
    
//           // // Check the HTTP status of the fetch call
//           // const lastCall = fetchMock.mock.calls[fetchMock.mock.calls.length - 1];
//           // expect(lastCall[1]).toEqual(expect.objectContaining({ method: "GET" }));
//           // expect(fetchMock.mock.lastResponse()?.status).toBe(200);
    
//           // Check if specific data appears in the document
//           expect(screen.getByText('John Doe')).toBeInTheDocument();
//           expect(screen.getByText('001')).toBeInTheDocument();
//           expect(screen.getByText(/main gate/i)).toBeInTheDocument();
//         });
//       });
    
//       it('displays no records found when there are no logs', async () => {
//         // Return an empty array for logs
//         fetchMock.mockResponseOnce(JSON.stringify([]), { status: 200 });
    
//         render(
//           <Router>
//             <Dashboard />
//           </Router>
//         );
    
//         // Wait for the fetch to complete and UI to update
//         await waitFor(() => {
//           expect(screen.getByText('No attendance records found for this date.')).toBeInTheDocument();
//         });
//       });
  
//   });