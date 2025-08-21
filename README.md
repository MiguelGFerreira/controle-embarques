# Shipment Control Panel

A modern web application built to manage and update pending shipment records. This panel provides a clean and efficient interface for users to view, filter, and edit shipment dates and related information directly from an MSSQL database.

## Features

-   **Dynamic Data Table**: Displays a list of pending shipments with the most relevant information.
-   **Server-Side Operations**: All filtering and pagination are handled by the server, ensuring high performance even with large datasets.
-   **IDE Filtering**: Quickly find specific shipments by filtering by their `IDE` (EEC_PEDREF).
-   **Modal-Based Editing**: Click on any shipment to open a detailed modal, allowing for easy updates.
-   **Dynamic Form Generation**: The editing form within the modal is generated dynamically based on a central configuration file (`app/utils/index.ts`). This allows for:
    -   Support for multiple input types (`text`, `date`, `select`).
    -   Easy addition of new editable fields without changing the UI code.
    -   Input validation, such as `maxLength` for text fields.
-   **Real-time User Feedback**: Integrated toast notifications (`sonner`) provide immediate feedback for success or error on data updates.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Frontend Logic**: [React](https://react.dev/)
-   **Data Fetching**: [SWR](https://swr.vercel.app/) for efficient, real-time data synchronization.
-   **UI Components**:
    -   **Icons**: [Lucide React](https://lucide.dev/)
    -   **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
-   **Backend**: Next.js API Routes
-   **Database**: Microsoft SQL Server (MSSQL)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 18.x or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   Access to a Microsoft SQL Server (MSSQL) database.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/MiguelGFerreira/controle-embarques.git
    cd controle-embarques
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env.local` in the root of the project and add your database connection details.

    ```ini
    # .env.local
    # --- MSSQL Database Connection ---
    DB_USER="your_database_user"
    DB_PASSWORD="your_database_password"
    DB_SERVER="localhost" # Or your server's IP/hostname
    DB_DATABASE="your_database_name"
    DB_PORT="1433" # Default MSSQL port

    # --- Security Options ---
    # Set to 'true' for Azure SQL or SSL-enabled connections
    DB_ENCRYPT="true" 
    # Set to 'true' for local dev environments or servers with self-signed certs
    DB_TRUST_SERVER_CERTIFICATE="true" 
    ```

    **Note:** The current implementation builds SQL queries by concatenating string values. Ensure that the database user specified has the minimum necessary permissions for the required operations (SELECT, UPDATE).

### Running the Application

Once the installation and configuration are complete, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

The project follows the standard Next.js App Router structure. Key directories include:

```
/
├── app/
│   ├── api/                  # Backend API routes (GET, PUT)
│   │   └── embarques/
│   ├── components/           # Reusable React components (Modal, Table, etc.)
│   ├── lib/                  # Shared libraries, e.g., database connection (db.ts)
│   ├── utils/                # Utility functions and configurations (editableFieldsConfig)
│   ├── types/                # TypeScript type definitions (index.ts)
│   ├── layout.tsx            # Main application layout
│   └── page.tsx              # The main page component
└── public/                   # Static assets
```

## API Endpoints

The application uses the following API endpoints to interact with the database:

-   `GET /api/embarques`
    -   Fetches a paginated list of shipments.
    -   **Query Parameters:**
        -   `page` (number): The page number for pagination.
        -   `limit` (number): The number of records per page.
        -   `ide` (string): A string to filter shipments by their IDE.

-   `PUT /api/embarques/[id]`
    -   Updates a specific shipment record identified by its `R_E_C_N_O_`.
    -   The request body should be a JSON object containing the fields to be updated.