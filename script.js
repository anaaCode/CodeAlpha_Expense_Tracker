// Implementing adding, viewing, editing, and deleting expenses functionalities.
// Integrating local storage to save user.

document.addEventListener('DOMContentLoaded', () => {
  // Selecting elements
  const dateInput = document.getElementById('date');
  const expenseInput = document.getElementById('name');
  const categoryInput = document.getElementById('category');
  const amountInput = document.getElementById('amount');
  const addExpenseBtn = document.getElementById('add-expense');
  const cancelEditBtn = document.getElementById('cancel-edit');
  const totalExpenses = document.getElementById('total-expenses');
  const expensesTable = document.getElementById('expenses-table');

  // Declaring variables
  let expensesList = [];
  let total = 0;
  let editIdx = -1;

  // Function to clear input fields
  function clearInputFields () {
    dateInput.value = '';
    expenseInput.value = '';
    categoryInput.value = '';
    amountInput.value = '';
  }

  // Function to validate user inputs
  function validateInputs () {
    if (dateInput.value === '' ||
         expenseInput.value === '' ||
         categoryInput.value === '' ||
         amountInput.value <= 0 ||
         isNaN(amountInput.value)) {
      alert('Please Enter valid inputs');
      return false;
    }
    return true;
  }

  // Function to save data to local storage
  function saveExpenses () {
    localStorage.setItem('Expenses', JSON.stringify(expensesList));
    localStorage.setItem('Totalexpenses', JSON.stringify(total));
  }

  // Function to get/read data from local storage
  function getExpenses () {
    const storedExpenses = localStorage.getItem('Expenses');
    const Total = localStorage.getItem('Totalexpenses');
    expensesList = storedExpenses ? JSON.parse(storedExpenses) : [];
    total = Total ? JSON.parse(Total) : 0;
  }

  // Function to display expenses
  function display () {
    // calculate and display total expenses
    total = expensesList.reduce((acc, expense) => acc + expense.amount, 0);
    totalExpenses.innerHTML = total.toLocaleString();

    // Clear available data
    expensesTable.innerHTML = '';

    if (expensesList.length !== 0) {
      expensesList.forEach((e, index) => {
        expensesTable.innerHTML += `
          <tr>
            <td>${e.date}</td>
            <td>${e.name}</td>
            <td>${e.category}</td>
            <td>${e.amount.toLocaleString()}</td>
            <td id="actions">
              <div>
                <button type="button" data-id="${index}" class="btn btn-warning btn-sm">Edit</button>
              </div>
              <div>
                <button type="button" data-id="${index}" class="btn btn-danger btn-sm">Delete</button>
              </div>
            </td>
          </tr>
        `;
      });
    } else {
      expensesTable.innerHTML = `
        <p style="font-weight:bold; font-size: 20px;">No expenses added!</p>
      `;
    }

    saveExpenses();
  }

  // Function to edit an expense
  function editExpense (idx) {
    editIdx = idx;

    // Populate form fields
    dateInput.value = expensesList[idx].date;
    expenseInput.value = expensesList[idx].name;
    categoryInput.value = expensesList[idx].category;
    amountInput.value = expensesList[idx].amount;

    cancelEditBtn.style.display = 'block';
  }

  // Function to cancel edit
  function cancelEdit () {
    // Reset edit index
    editIdx = -1;
    clearInputFields();
    cancelEditBtn.style.display = 'none';
  }

  // Function to add an expense
  function addExpense () {
    if (validateInputs() === true) {
      const dateValue = dateInput.value.trim();
      const expenseValue = expenseInput.value.trim();
      const categoryValue = categoryInput.value.trim();
      const amountValue = Number(amountInput.value);

      // Expense object
      const expense = {
        date: dateValue,
        name: expenseValue,
        category: categoryValue,
        amount: amountValue
      };

      if (editIdx !== -1) {
        expensesList[editIdx] = expense;
      } else {
        // Update expensesList
        expensesList.push(expense);
      }
      console.log(expense);

      // Reset edit index
      editIdx = -1;
      cancelEditBtn.style.display = 'none';

      clearInputFields();
      display();
    }
  }

  // function to delete an expense
  function deleteExpense (idx) {
    expensesList = expensesList.filter((expense, index) => index !== idx);
    display();
  }

  // Event listener to cancel edit
  cancelEditBtn.addEventListener('click', cancelEdit);

  // Event Delegation Delete and Edit
  expensesTable.addEventListener('click', (event) => {
    const expenseIdx = event.target.getAttribute('data-id');
    if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Delete') {
      deleteExpense(Number(expenseIdx));
      console.log(`Deleting expense at index ${expenseIdx}`);
    } else if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Edit') {
      editExpense(Number(expenseIdx));
      console.log(`Editing expense at index ${expenseIdx}`);
    }
  });

  // Event listener for adding an expense
  addExpenseBtn.addEventListener('click', addExpense);

  cancelEditBtn.style.display = 'none';
  getExpenses();
  display();
});
