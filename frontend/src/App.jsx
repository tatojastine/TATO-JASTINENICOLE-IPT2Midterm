import { useEffect, useState } from "react";
import LoanForm from "./components/LoanForm";
import LoanList from "./components/LoanList";
import "./App.css";

function App() {

    // Store all textbook loans retrieved from the backend
    const [loans, setLoans] = useState([]);

    // Store the loan currently being edited
    const [editingLoan, setEditingLoan] = useState(null);

    // Retrieve all loans from the Express API
    const fetchLoans = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/loans"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch loans");
            }

            const data = await response.json();

            setLoans(data);

        } catch (error) {
            console.error(error);
            alert("Unable to load textbook loans.");
        }
    };

    // Fetch the loans when the React application first loads
    useEffect(() => {
        fetchLoans();
    }, []);

    // Prepare a loan for editing
    const handleEdit = (loan) => {
        setEditingLoan(loan);
    };

    // Delete a loan through the Express API
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this loan?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:5000/api/loans/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete loan");
            }

            // Refresh the loan list after deleting
            fetchLoans();

        } catch (error) {
            console.error(error);
            alert("Unable to delete the loan.");
        }
    };

    // Refresh the list after adding or updating a loan
    const handleLoanSaved = () => {
        setEditingLoan(null);
        fetchLoans();
    };

    // Cancel the current edit operation
    const handleCancelEdit = () => {
        setEditingLoan(null);
    };

    return (
        <div className="app">

            <header>
                <h1>Textbook Borrowing Tracker</h1>

                <p>
                    Manage textbook borrowing records
                </p>
            </header>

            <main>

                <LoanForm
                    onLoanSaved={handleLoanSaved}
                    editingLoan={editingLoan}
                    onCancelEdit={handleCancelEdit}
                />

                <LoanList
                    loans={loans}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            </main>

        </div>
    );
}

export default App;