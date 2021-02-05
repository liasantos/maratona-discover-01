const Modal = {
  open() {
    //abrir modal
    //adicionar a class active ao modal
    document
      .querySelector('.modal-overlay') //procura o seletor no html
      .classList.add('active');
  },
  close() {
    //fechar o modal
    //remover a class active do modal
    document
      .querySelector('.modal-overlay') //procura o seletor no html
      .classList.remove('active');
  },
};

/*const transactions = [
  {
    //id: 1,
    description: 'Luz',
    amount: -50000,
    date: '23/01/2021',
  },

  {
    //id: 2,
    description: 'Website',
    amount: 500000,
    date: '23/01/2021',
  },

  {
    //id: 3,
    description: 'Internet',
    amount: -20000,
    date: '23/01/2021',
  },

  {
    //id: 4,
    description: 'App',
    amount: 200000,
    date: '23/01/2021',
  },
];*/

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []; //transoforma de volta a string em array
  },

  set(transactions) {
    localStorage.setItem(
      "dev.finances:transactions",
      JSON.stringify(transactions)
    ); //transforma array em string
  },
};

const Transaction = {
  //all: transactions
  all: Storage.get(),

  add(transaction){
    Transaction.all.push(transaction), App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1), App.reload();
  },

  incomes() {
    //somar as entradas
    let income = 0;
    Transaction.all.forEach((transaction) => {
      if ( transaction.amount > 0) {
        income += transaction.amount;
      }
    });
    return income;
  },
  expenses() {
    //somar as saídas
    let expense = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    });
    return expense;
  },
  total() {
    //entradas - saídas
    return Transaction.incomes() + Transaction.expenses();
  },
};

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense"; //analisa se é V ou F

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
        <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação" />
        </td>           
        `;
    return html;
  },

  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    );

    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    );

    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
  },
};

const Utils = {
  formatAmount(value){
    value = Number(value) * 100;
    //console.log(value)
    return Math.round(value);
  },

  formatDate(date) {
    const splittedDate = date.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

  formatCurrency(value) {
    //console.log(value)
    const signal = Number(value) < 0 ? "-" : "";
    //console.log(signal)
    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    //console.log(signal + value);
    return signal + value;
  },
};

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },
  /*formatData(){
        console.log('formatar os dados');
    };*/
  validateFields() {
    const { description, amount, date } = Form.getValues();
    //console.log(Form.getValues())
    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos");
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues(); //não pode ser constante porque irá mudar

    amount = Utils.formatAmount(amount);

    date = Utils.formatDate(date);

    //console.log(date)

    return {
      description,
      amount,
      date,
    };
  },

  //saveTransaction(transaction) {
    //Transaction.add(transaction);
  //},

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    //console.log(event),
    event.preventDefault();

    try {
      // verificar se todas as infos foram preenchidas
      Form.validateFields();
      // formatar os dados para salvar
      const transaction = Form.formatValues();
      // salvar
      Transaction.add(transaction);
      //Form.saveTransaction(transaction);
      // apagar os dados do form
      Form.clearFields();
      // modal feche
      Modal.close();
    } catch (error) {
      alert(error.message);
    }
  },
};

const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction);
    //Transaction.all.forEach(function(transaction, index){
    //DOM.addTransaction(transaction, index)
    DOM.updateBalance();
    Storage.set(Transaction.all)
  },
  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

App.init();

/*Transaction.add({
    //id: 39,
    description: 'Alo',
    amount: 200,
    date: '23/01/2021'
})*/

//DOM.addTransaction(transactions[1]);

//Transaction.remove(0)
