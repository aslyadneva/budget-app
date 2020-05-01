// BUDGET CONTROLLER
const budgetController = (() => {

  function Expense (id, description, value) {
    this.id = id; 
    this.description = description; 
    this.value = value;
    this.percentage = 0;
  }

  Expense.prototype.calculatePercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100)
    } else {
      this.percentage = 0
    }
  }

  Expense.prototype.getPercentage = function () {
    return this.percentage
  }

  function Income (id, description, value) {
    this.id = id; 
    this.description = description; 
    this.value = value;
  }

  const data = {
    allItems: {
      exp: [], 
      inc: []
    }, 
    totals: {
      exp: 0, 
      inc: 0
    }, 
    budget: 0, 
    percentage: 0
  }

  function calculateTotal (type) {
    let sum = data.allItems[type].reduce((acc, curr)=> acc + curr.value, 0)
    
    data.totals[type] = sum; 
  }

  return {
    addItem: (type, description, value) => {
      let newItem, id; 

      // Create new ID 
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1; 
      } else {
        id = 0
      }
          
      // Create new item based on its type
      if (type === 'exp') {
        newItem = new Expense(id, description, value); 
      } else if (type === 'inc') {
        newItem = new Income(id, description, value); 
      }     

      //Push it into data structure 
      data.allItems[type].push(newItem);

      return newItem;  
    },
    deleteItem: (type, id) => {
      //ex. ('exp', 1)     
      data.allItems[type] = data.allItems[type].filter(entry => entry.id !== id); 
    },
    calculateBudget: () => {
    
      // calculate total income & expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage of income went to expenses 
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp/data.totals.inc) *100);
      } else {
        data.percentage = 0;
      }     
    },
    calculatePercentages: () => {
      data.allItems.exp.forEach(expense => {
        expense.calculatePercentage(data.totals.inc)
      })
    },
    getPercentages: () => {
      return data.allItems.exp.map(expense => expense.getPercentage()); // this returns an array 
    },
    getBudget: () => {
      return {
        budget: data.budget, 
        totalInc: data.totals.inc,
        totalExp: data.totals.exp, 
        percentage: data.percentage
      }
    },
    test: data
  }

})(); 

// UI CONTROLLER
const UIController = (()=> {

  const domStrings = {
    container: '.container', 
    inputType: '.add__type', 
    inputDescription: '.add__description', 
    inputValue: '.add__value', 
    inputBtn: '.add__btn', 
    incomeContainer: '.income__list', 
    expensesContainer: '.expenses__list', 
    budgetDisplay: '.budget__value', 
    incomeDisplay: '.budget__income--value', 
    expenseDisplay: '.budget__expenses--value', 
    percentDisplay: '.budget__expenses--percentage', 
    percentItemLabel: '.item__percentage', 
    monthLabel: '.budget__title--month'
  };

  const formatNumber = (num) => {
    // removing the sign 
    num = Math.abs(num)

    // adding two decimal places -- creates a string 
    num = num.toFixed(2); 
    let numSplit = num.split('.') // return an array ex. ['2000', '99']

    let integer = numSplit[0]; 
    if (integer.length > 3) { // ex '2000'
      integer = `${integer.substr(0, integer.length - 3)},${integer.substr(integer.length - 3, 3)}`
      // integer is now '2,000'
    }

    let decimal = numSplit[1];     

    return `${integer}.${decimal}`
  };

  return {
    getInput: () => {
      return {
        type: document.querySelector(domStrings.inputType).value,
        description: document.querySelector(domStrings.inputDescription).value, 
        value: parseFloat(document.querySelector(domStrings.inputValue).value)
      }    
    }, 
    changeType: () => {
      document.querySelector(domStrings.inputType).classList.toggle('red-focus')
      document.querySelector(domStrings.inputDescription).classList.toggle('red-focus')
      document.querySelector(domStrings.inputValue).classList.toggle('red-focus')
      document.querySelector(domStrings.inputBtn).classList.toggle('red')
    },
    addListItem: (itemObj, type) => { 
      
      // Create list item template
      let listItem = `<div class="item clearfix" id="${type === 'inc' ? 'inc': 'exp'}-${itemObj.id}">
                <div class="item__description">${itemObj.description}</div>
                  <div class="right clearfix">
                    <div class="item__value">${type === 'inc'? '+' : '-'} ${formatNumber(itemObj.value)}</div>
                    ${type === 'inc' ? '' : '<div class="item__percentage">21%</div>'}
                    <div class="item__delete">
                      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
              </div>`;  

      // Select the appropriate list in the DOM 
      let list = type === 'inc' ? domStrings.incomeContainer : domStrings.expensesContainer;  

      // Insert list item into the list 
      document.querySelector(list).insertAdjacentHTML('beforeend', listItem)
    },
    deleteListItem: (selectorID) => {
      let parentElement = document.querySelector(`#${selectorID}`).parentNode;
      parentElement.removeChild(document.querySelector(`#${selectorID}`)); 
    },
    clearFields: () => {
      document.querySelector(domStrings.inputDescription).value =''; 
      document.querySelector(domStrings.inputValue).value =''; 

      document.querySelector(domStrings.inputDescription).focus(); 
    },
    displayBudget: ({budget, totalInc, totalExp, percentage}) => {  
      document.querySelector(domStrings.budgetDisplay).textContent = budget > 0 ? `+${formatNumber(budget)}`: `${formatNumber(budget)}`;
      document.querySelector(domStrings.incomeDisplay).textContent = `+${formatNumber(totalInc)}`;
      document.querySelector(domStrings.expenseDisplay).textContent = `-${formatNumber(totalExp)}`;
      document.querySelector(domStrings.percentDisplay).textContent = percentage > 0? `${percentage}%`: '---'
    },
    displayPercentages: (percentArray) => {
      const fields = document.querySelectorAll(domStrings.percentItemLabel) // returns a node list 

      fields.forEach((node, index)=> {
        if(percentArray[index] > 0) {
          node.textContent = `${percentArray[index]}%`
        } else {
          node.textContent = "---"
        }       
      })     
    },
    displayMonth: () => {
      const months = ["January", "February","March","April","May","June","July","August","September","October","November","December"]

      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth(); 

      document.querySelector(domStrings.monthLabel).textContent = `${months[month]} ${year}`
      
    },
    getDomStrings: () => domStrings
  }

})();



// GLOBAL APP CONTROLLER
const controller = ((data, ui)=> {

  const initEventListeners = () => {
    const DOM = ui.getDomStrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', addItem);
    document.addEventListener('keydown', event => {
      if (event.keyCode === 13 || event.which === 13) {
        addItem()
      }
    });
    document.querySelector(DOM.container).addEventListener('click', deleteItem);
    document.querySelector(DOM.inputType).addEventListener('change', ui.changeType)
  }

  const updateBudget = () => {
    //1. Calculate the budget 
    data.calculateBudget();

    //2. Retutn the budget
    const budget = data.getBudget(); 

    //3. Display budget on UI 
    console.log(budget);
    ui.displayBudget(budget);   
  }

  const updatePercentages = () => {

    // Calculate percentages 
    data.calculatePercentages();

    // Read percentages from budget controller 
    let percentages = data.getPercentages();

    // Update UI 
    console.log(percentages); 
    ui.displayPercentages(percentages)
  }
  
  const addItem = () => {
    //1. Get field input data 
    const input = ui.getInput();
    
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      //2. Add the item to budget controller 
    const newItem = budgetController.addItem(input.type, input.description, input.value); 

      //3. Add the item to the ui controller 
      ui.addListItem(newItem, input.type)

      //4. Clear input field
      ui.clearFields();

      //5. Calculate and update budget
      updateBudget()

      //6. Calculate and update percentages
      updatePercentages()
    } else {
      alert('Enter a valid value')
    }  
  }

  const deleteItem = (event) => {
    let itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; 

    if (itemID) {
      let splitID = itemID.split('-') // ex 'inc-1' becomes ["inc", "1"]
      let type = splitID[0] // will be either 'inc' or 'exp'
      let ID = parseInt(splitID[1]) // will be the unique number after the type 

      // Delete item from data structure 
      data.deleteItem(type, ID)

      // Delete item from UI 
      ui.deleteListItem(itemID); 

      // Recalculate and update budget UI
      updateBudget(); 

      // Recalculate and update percentages
      updatePercentages()
    }
  }

  return {
    init: ()=> {
      console.log('application started'); 
      ui.displayMonth();
      ui.displayBudget({
        budget: 0, 
        totalInc: 0,
        totalExp: 0, 
        percentage: 0
      });
      initEventListeners();
    }
  }

})(budgetController, UIController);

controller.init(); 