function LoanList({ loans, onEdit, onDelete }) {

    return (
        <div className="loan-list">

            <h2>Textbook Borrowing Records</h2>

            {loans.length === 0 ? (
                <p className="no-records">
                    No textbook loans found.
                </p>
            ) : (
                <div className="table-container">

                    <table>

                        <thead>
                            <tr>
                                <th>Book Title</th>
                                <th>Borrower</th>
                                <th>Date Borrowed</th>
                                <th>Due Date</th>
                                <th>Returned</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loans.map((loan) => (

                                <tr key={loan.id}>

                                    <td>
                                        {loan.book_title}
                                    </td>

                                    <td>
                                        {loan.borrower}
                                    </td>

                                    <td>
                                        {loan.date_borrowed}
                                    </td>

                                    <td>
                                        {loan.due_date}
                                    </td>

                                    <td>
                                        {loan.returned ? "Yes" : "No"}
                                    </td>

                                    <td>

                                        <button
                                            className="edit-button"
                                            onClick={() => onEdit(loan)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-button"
                                            onClick={() => onDelete(loan.id)}
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
}

export default LoanList;