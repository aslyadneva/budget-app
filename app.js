// BUDGET CONTROLLER
const budgetController = (() => {

  const Expense = (id, description, value) => {
    this.id = id; 
    this.description = description; 
    this.value = value;
  }

  const Income = (id, description, value) => {
    this.id = id; 
    this.description = description; 
    this.value = value;
  }

})(); 

// UI CONTROLLER
const UIController = (()=> {

  const domStrings = {
    inputType: '.add__type', 
    inputDescription: '.add__description', 
    inputValue: '.add__value', 
    inputBtn: '.add__btn'
  }

  return {
    getInput: () => {
      return {
        type: document.querySelector(domStrings.inputType).value,
        description: document.querySelector(domStrings.inputDescription).value, 
        value: document.querySelector(domStrings.inputValue).value
      }    
    }, 
    getDomStrings: () => domStrings
  }

})();

// GLOBAL APP CONTROLLER
const controller = ((data, ui)=> {

  const initEventListeners = () => {
    const DOM = ui.getDomStrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keydown', event => {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem()
      }
    });
  }

  

  const ctrlAddItem = () => {

    //1. Get field input data 
    const input = ui.getInput();
    console.log(input); 

    //2. Add the item to budget controller 

    //3. Add the item to the ui controller 

    //4. Calculate the budget 

    //5. Display budget on UI 

  }

  return {
    init: ()=> {
      console.log('application started'); 
      initEventListeners();
    }
  }

})(budgetController, UIController);

controller.init(); 