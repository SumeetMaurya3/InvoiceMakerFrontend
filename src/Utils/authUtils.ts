import axios from 'axios';

// Function to get tokens from localStorage
const getTokensFromLocalStorage = () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    return { accessToken, refreshToken };
};

// Function to validate access token
export const validateAccessToken = async () => {
    const { accessToken } = getTokensFromLocalStorage(); // Extract the token from localStorage.

    if (!accessToken) {
        return false; // No access token, consider it invalid.
    }

    try {
        const response = await axios.post('http://localhost:8000/api/user/validate',
            { token: accessToken }, // Send token in the request body
            { withCredentials: true } // Ensure cookies are sent with the request
        );

        console.log(response);
        console.log(response.status)
        console.log(response.status === 200)

        // Ensure response structure is checked properly
        return response.status;
    } catch (error) {
        console.error("Error validating access token:", error);
        return false; // If an error occurs, the token is invalid.
    }
};


// Function to refresh the token using the refresh token
export const refreshAccessToken = async () => {
    const { refreshToken } = getTokensFromLocalStorage();
  
    if (!refreshToken) {
        return null; // No refresh token available
    }
  
    try {
        const response = await axios.post('http://localhost:8000/api/user/refresh', {}, {
            withCredentials: true // Ensure cookies are sent with the request
        });
  
        if (response.status === 200) {
            // Save the new access and refresh tokens (both should be returned from the backend)
            const { access_token, refresh_token } = response.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            return access_token;
        }
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return null; // Return null if refresh fails
    }
};
