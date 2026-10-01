import { useState } from "react";

function LoanForm({ onLoanSaved, editingLoan, onCancelEdit }) {

    // Store the values entered into the form
    const [formData, setFormData] = useState({
        book_title: editingLoan?.book_title || "",
        borrower: editingLoan?.borrower || "",
        date_borrowed: editingLoan?.date_borrowed || "",
        due_date: editingLoan?.due_date || "",
        returned: editingLoan?.returned || false
    });

    // Update form values whenever the user types or changes a field
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // Submit the form to the Express backend
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const url = editingLoan
                ? `http://localhost:5000/api/loans/${editingLoan.id}`
                : "http://localhost:5000/api/loans";

            const method = editingLoan ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Failed to save loan");
            }

            // Tell App.jsx that the loan was successfully saved
            onLoanSaved();

            // Clear the form
            setFormData({
                book_title: "",
                borrower: "",
                date_borrowed: "",
                due_date: "",
                returned: false
            });

        } catch (error) {
            console.error(error);
            alert("Unable to save the loan.");
        }
    };

    return (
        <form className="loan-form" onSubmit={handleSubmit}>

            <h2>
                {editingLoan ? "Update Loan" : "Add New Loan"}
            </h2>

            <label>
                Book Title
            </label>

            <input
                type="text"
                name="book_title"
                value={formData.book_title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
            />

            <label>
                Borrower
            </label>

            <input
                type="text"
                name="borrower"
                value={formData.borrower}
                onChange={handleChange}
                placeholder="Enter borrower's name"
                required
            />

            <label>
                Date Borrowed
            </label>

            <input
                type="date"
                name="date_borrowed"
                value={formData.date_borrowed}
                onChange={handleChange}
                required
            />

            <label>
                Due Date
            </label>

            <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                required
            />

            <label className="checkbox-label">
                <input
                    type="checkbox"
                    name="returned"
                    checked={formData.returned}
                    onChange={handleChange}
                />

                Returned
            </label>

            <button type="submit">
                {editingLoan ? "Update Loan" : "Add Loan"}
            </button>

            {editingLoan && (
                <button
                    type="button"
                    className="cancel-button"
                    onClick={onCancelEdit}
                >
                    Cancel
                </button>
            )}

        </form>
    );
}

export default LoanForm;