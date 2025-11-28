# How to Run BNI LOS Webapp

This guide will help you set up and run the BNI Loan Origination System (LOS) Webapp locally.

## Prerequisites

-   **Node.js**: Ensure you have Node.js installed (version 18 or higher is recommended).
-   **npm**: Node Package Manager (usually comes with Node.js).

## Installation

1.  **Navigate to the project directory**:
    Open your terminal and move to the project folder:
    ```bash
    cd bni-los-webapp
    ```

2.  **Install Dependencies**:
    Run the following command to install all necessary packages:
    ```bash
    npm install
    ```

## Running the Application

1.  **Start the Development Server**:
    To run the app in development mode:
    ```bash
    npm run dev
    ```

2.  **Access the App**:
    Open your web browser and go to:
    example: [http://localhost:5173](http://localhost:5173)

## Building for Production

If you need to build the application for production deployment:

1.  Run the build command:
    ```bash
    npm run build
    ```
2.  The build artifacts will be stored in the `dist/` directory.

## Troubleshooting

-   **Port already in use**: If port 5173 is busy, Vite will automatically try the next available port (e.g., 5174). Check the terminal output for the correct URL.
-   **Missing dependencies**: If you encounter errors about missing modules, try deleting `node_modules` and running `npm install` again.
