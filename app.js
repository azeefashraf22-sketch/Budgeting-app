let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const checkAmountButton = document.getElementById("check-amount");
const productTitle = document.getElementById("product-title");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
let tempAmount = 0;


window.onload = () => {
    tempAmount = localStorage.getItem("budget") || 0;
    amount.innerText = tempAmount;
    
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    let totalExpenses = 0;

    expenses.forEach((expense) => {
        totalExpenses += parseInt(expense.amount);
        listCreator(expense.title, expense.amount, false); 
    });

    expenditureValue.innerText = totalExpenses;
    balanceValue.innerText = tempAmount - totalExpenses;
};

const saveExpenseLocal = (title, amount) => {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push({ title, amount });
    localStorage.setItem("expenses", JSON.stringify(expenses));
};

const removeExpenseLocal = (title, amount) => {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    let index = expenses.findIndex(exp => exp.title === title && exp.amount === amount);
    if (index > -1) {
        expenses.splice(index, 1);
    }
    localStorage.setItem("expenses", JSON.stringify(expenses));
};


// Set Budget Function
totalAmountButton.addEventListener("click", () => {
    tempAmount = totalAmount.value;
    if (tempAmount === "" || tempAmount < 0) {
        alert("Value cannot be empty or negative");
    } else {
        amount.innerText = tempAmount;
        balanceValue.innerText = tempAmount - expenditureValue.innerText;
        // Save budget to local storage
        localStorage.setItem("budget", tempAmount);
        totalAmount.value = "";
    }
});

// Function to disable/enable edit and delete buttons
const disableButtons = (bool) => {
    let editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach((element) => {
        element.disabled = bool;
    });
};

// Modify List Elements Function
const modifyElement = (element, edit = false) => {
    let parentDiv = element.parentElement.parentElement;
    let currentBalance = balanceValue.innerText;
    let currentExpense = expenditureValue.innerText;
    let parentAmount = parentDiv.querySelector(".product-amount").innerText;
    let parentText = parentDiv.querySelector(".product-name").innerText;

    if (edit) {
        productTitle.value = parentText;
        userAmount.value = parentAmount;
        disableButtons(true);
    }

    balanceValue.innerText = parseInt(currentBalance) + parseInt(parentAmount);
    expenditureValue.innerText = parseInt(currentExpense) - parseInt(parentAmount);
    
    removeExpenseLocal(parentText, parentAmount);
    
    parentDiv.remove();
};

// Create List Function
const listCreator = (expenseName, expenseValue, shouldSave = true) => {
    let sublistContent = document.createElement("div");
    sublistContent.classList.add("list-item");
    sublistContent.innerHTML = `
        <div class="item-left">
            <div class="accent-line"></div>
            <p class="product-name">${expenseName}</p>
            <p class="product-amount">${expenseValue}</p>
        </div>
        <div class="icons-wrapper">
            <i class="fa-regular fa-pen-to-square edit" style="margin-right:8px"></i>
            <i class="fa-regular fa-trash-can delete"></i>
        </div>
    `;

    // Edit Button Logic
    sublistContent.querySelector(".edit").addEventListener("click", (e) => {
        modifyElement(e.target, true);
    });

    // Delete Button Logic
    sublistContent.querySelector(".delete").addEventListener("click", (e) => {
        modifyElement(e.target);
    });

    list.appendChild(sublistContent);

    if (shouldSave) {
        saveExpenseLocal(expenseName, expenseValue);
    }
};

// Add Expense Logic
checkAmountButton.addEventListener("click", () => {
    if (!userAmount.value || !productTitle.value) {
        alert("Values cannot be empty");
        return;
    }

    disableButtons(false);
    let expenditure = parseInt(userAmount.value);
    let sum = parseInt(expenditureValue.innerText) + expenditure;
    expenditureValue.innerText = sum;

    const totalBalance = tempAmount - sum;
    balanceValue.innerText = totalBalance;

    listCreator(productTitle.value, userAmount.value, true);
    
    productTitle.value = "";
    userAmount.value = "";
});