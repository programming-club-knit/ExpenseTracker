const expenseForm = document.getElementById("expense-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const transactionList = document.getElementById("transaction-list");
const balanceElement = document.getElementById("balance");
const chartCanvas = document.getElementById("chart");

let transactions = [];

// Load transactions from local storage
if (localStorage.getItem("transactions")) {
    transactions = JSON.parse(localStorage.getItem("transactions"));
    updateUI();
}

// Add transaction
expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const description = descriptionInput.value.trim();
    const amount = +amountInput.value;
    const type = typeInput.value;

    if (description && amount) {
        const transaction = {
            id: Date.now(),
            description,
            amount,
            type,
        };
        transactions.push(transaction);
        updateUI();
        saveTransactions();
        expenseForm.reset();
    }
});

// Update UI
function updateUI() {
    // Update balance
    const balance = transactions.reduce((total, transaction) => {
        return transaction.type === "income"
            ? total + transaction.amount
            : total - transaction.amount;
    }, 0);
    balanceElement.textContent = `$${balance.toFixed(2)}`;

    // Update transaction list
    transactionList.innerHTML = transactions
        .map(
            (transaction) => `
      <li>
        <span>${transaction.description}</span>
        <span>$${transaction.amount.toFixed(2)}</span>
        <button onclick="deleteTransaction(${transaction.id})">Delete</button>
      </li>
    `
        )
        .join("");

    // Update chart
    updateChart();
}

// Delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
    updateUI();
    saveTransactions();
}

// Save transactions to local storage
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Update chart
function updateChart() {
    const ctx = chartCanvas.getContext("2d");
    const income = transactions
        .filter((transaction) => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.amount, 0);
    const expense = transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((total, transaction) => total + transaction.amount, 0);

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Income", "Expense"],
            datasets: [
                {
                    data: [income, expense],
                    backgroundColor: ["#4caf50", "#f44336"],
                },
            ],
        },
    });
}