// --- ELEMENT SELECTION ---
var totalAmountInput = document.getElementById("total-amount");
var userAmountInput = document.getElementById("user-amount");
var productTitleInput = document.getElementById("product-title");

var totalBudgetBtn = document.getElementById("total-amount-button");
var checkAmountBtn = document.getElementById("check-amount");

var totalBudgetDisplay = document.getElementById("amount");
var totalExpensesDisplay = document.getElementById("expenditure-value");
var balanceDisplay = document.getElementById("balance-amount");
var expenseList = document.getElementById("list");

// --- BUDGET SETTING LOGIC ---
totalBudgetBtn.onclick = function() {
    var budgetValue = totalAmountInput.value;

    if (budgetValue == "" || budgetValue < 0) {
        alert("Please enter a valid budget amount!");
    } else {
        // Display budget on screen
        totalBudgetDisplay.innerText = budgetValue;
        // Update balance initially
        updateBalance();
        // Clear input
        totalAmountInput.value = "";
    }
};

// --- BALANCE CALCULATION LOGIC ---
function updateBalance() {
    var budget = parseInt(totalBudgetDisplay.innerText);
    var expenses = parseInt(totalExpensesDisplay.innerText);
    var currentBalance = budget - expenses;
    balanceDisplay.innerText = currentBalance;
}

// --- ADDING EXPENSE LOGIC ---
checkAmountBtn.onclick = function() {
    var title = productTitleInput.value;
    var amount = userAmountInput.value;

    if (title == "" || amount == "") {
        alert("Please enter product name and cost!");
        return;
    }

    // 1. Update Total Expenses Display
    var currentTotalExpenses = parseInt(totalExpensesDisplay.innerText);
    var newTotalExpenses = currentTotalExpenses + parseInt(amount);
    totalExpensesDisplay.innerText = newTotalExpenses;

    // 2. Update Balance
    updateBalance();

    // 3. Add item to the list
    createListItem(title, amount);

    // 4. Clear inputs
    productTitleInput.value = "";
    userAmountInput.value = "";
};

// --- CREATE LIST ITEM FUNCTION ---
function createListItem(name, val) {
    var div = document.createElement("div");
    div.classList.add("list-item");

    div.innerHTML = `
        <div class="item-left">
            <div class="accent-line"></div>
            <p class="product-name">${name}</p>
            <p class="product-amount">${val}</p>
        </div>
        <div class="icons-wrapper">
            <i class="fa-regular fa-pen-to-square edit-icon"></i>
            <i class="fa-regular fa-trash-can delete-icon"></i>
        </div>
    `;

    // DELETE LOGIC
    var deleteBtn = div.querySelector(".delete-icon");
    deleteBtn.onclick = function() {
        // Reduce the expense value
        var currentExpenses = parseInt(totalExpensesDisplay.innerText);
        totalExpensesDisplay.innerText = currentExpenses - parseInt(val);
        
        // Update balance
        updateBalance();
        
        // Remove item from UI
        div.remove();
    };

    // EDIT LOGIC
    var editBtn = div.querySelector(".edit-icon");
    editBtn.onclick = function() {
        // Fill inputs back with data
        productTitleInput.value = name;
        userAmountInput.value = val;
        
        // Remove current item (it will be added again after check amount)
        var currentExpenses = parseInt(totalExpensesDisplay.innerText);
        totalExpensesDisplay.innerText = currentExpenses - parseInt(val);
        updateBalance();
        div.remove();
    };

    expenseList.appendChild(div);
}