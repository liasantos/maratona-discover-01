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

const transactions = [
  {
    id: 1,
    description: 'Luz',
    amount: -50000,
    date: '23/01/2021',
  },

  {
    id: 2,
    description: 'Website',
    amount: 500000,
    date: '23/01/2021',
  },

  {
    id: 3,
    description: 'Internet',
    amount: -20000,
    date: '23/01/2021',
  },

  {
    id: 4,
    description: 'App',
    amount: 200000,
    date: '23/01/2021',
  },
];

const Transaction = {
    all: transactions,

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

  incomes() {
    //somar as entradas
    let income = 0;
    Transaction.all.forEach(transaction => {
        if( transaction.amount > 0) {
            income += transaction.amount;
        }
    })
    return income;
  },
  expenses() {
    //somar as saídas
    let expense = 0;
    Transaction.all.forEach(transaction => {
        if( transaction.amount < 0) {
            expense += transaction.amount;
        }
    })
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
    tr.innerHTML = DOM.innerHTMLTransaction(transaction);

    DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense'; //analisa se é V ou F

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
        <img src="./assets/minus.svg" alt="Remover transação" />
        </td>
           
        `;
    return html;
  },

  updateBalance() {
      document
      .getElementById('incomeDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.incomes())

      document
      .getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.expenses())

      document
      .getElementById('totalDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.total())
  },

  clearTransactions(){
      DOM.transactionsContainer.innerHTML = ""
  }
};

const Utils = {
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

const App = {
    init() {

        Transaction.all.forEach(function(transaction){
            DOM.addTransaction(transaction)
        })

        DOM.updateBalance()

    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()

Transaction.add({
    id: 39,
    description: 'Alo',
    amount: 200,
    date: '23/01/2021'
})

//DOM.addTransaction(transactions[1]);




