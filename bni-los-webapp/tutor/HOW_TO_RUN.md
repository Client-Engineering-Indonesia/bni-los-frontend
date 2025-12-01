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

## Running in a Virtual Machine (VM)

If you are running this application inside a VM (e.g., VirtualBox, VMware, WSL2) and want to access it from your host machine:

1.  **Expose the Host**:
    By default, Vite only listens on `localhost`. To access it from outside the VM, you need to expose it to the network. Run the dev server with the `--host` flag:
    ```bash
    npm run dev -- --host
    ```

2.  **Access from Host**:
    The terminal will show a Network URL (e.g., `http://192.168.x.x:5173/`). Use this IP address in your host machine's browser.

3.  **Network Settings**:
    -   **Bridged Adapter**: The VM gets its own IP on your network. Use that IP.
    -   **NAT**: You must configure **Port Forwarding** in your VM settings (Map Host Port 5173 to Guest Port 5173).

### Ubuntu 22 Specifics

If you cannot access the app even with `--host`, check the Ubuntu firewall (`ufw`):

1.  **Allow Port 5173**:
    ```bash
    sudo ufw allow 5173/tcp
    ```
2.  **Check Status**:
    ```bash
    sudo ufw status
    ```
