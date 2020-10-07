class Item {
  constructor(name, price, count) {
    this.name = name;
    this.price = price;
    this.count = count;
  }

  add(item) {
    item.id = (this.index += 1);
    this.items.push(item);
  }

  getTotal() {
    return this.total.toFixed(6).slice(0, -4);
  }

  getItems() {
    return this.items;
  }

  getLength() {
    return this.items.length;
  }

  deleteItem(item) {
    const index = this.items.indexOf(item);
    this.items.splice(index, 1);
    console.log(this.items)
  }
}

class Checkout {
  constructor() {
    this.items = [];
    if (sessionStorage.getItem("shoppingCart") != null) {
      this.loadCart();
    }
  }

  addItem(item) {
    this.items.push(item)
  }

  saveCart() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(this.items));
  }

  loadCart() {
    this.items = JSON.parse(sessionStorage.getItem('shoppingCart'));
  }

  findItemByName(name) {
    return this.items.findIndex((item) => item.name === name);
  }

  addItemToCart(name, price, count) {
    //переписать по файндиндекс
    let indexOfItem = this.findItemByName(name);
    if (indexOfItem >= 0) {
      this.items[indexOfItem].count++;
      this.saveCart();
      return;
    }
    let newItem = new Item(name, price, count);
    this.items.push(newItem);
    this.saveCart();
  }

  setCountForItem(name, count) {
    let indexOfItem = this.findItemByName(name);
    if (indexOfItem >= 0) {
      this.items[indexOfItem].count = count;
    }
  };

  removeItemFromCart(name) {
    let indexOfItem = this.findItemByName(name);
    if (indexOfItem >= 0) {
      this.items[indexOfItem].count--;
      if (this.items[indexOfItem].count === 0) {
        this.items.splice(this.items[indexOfItem], 1);
      }
    }
    this.saveCart();
  }

  removeItemFromCartAll(name) {
    let indexOfItem = this.findItemByName(name);
    if (indexOfItem >= 0) {
      this.items.splice(this.items[indexOfItem], 1);
    }
    this.saveCart();
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }

  calculateTotalCount() {
    return this.items.reduce((sum, item) =>sum + item.count, 0);
  }

  calculateTotalPrice() {
    return this.items.reduce((sum, item) =>sum + item.count* item.price, 0)}
}


// items : Array
// Item : Object/Class
// addItemToCart : Function (name, price, count)
// removeItemFromCart : Function
// removeItemFromCartAll : Function
// clearCart : Function
// countCart : Function
// totalCart : Function
// listCart : Function
// saveCart : Function
// loadCart : Function

// $('.add-to-cart').click(function(event) {
//   event.preventDefault();
//   var name = $(this).data('name');
//   var price = Number($(this).data('price'));
//   shoppingCart.addItemToCart(name, price, 1);
//   displayCart();
// });


let myCart = new Checkout();
let addToCartButtons = Array.from(document.getElementsByClassName('product-box__btn'));
let totalCount = document.getElementById('js-totalcount');
let totalCountPrice = document.getElementById('js-totalcountprice');

if(myCart.items.length){
  totalCount.textContent = myCart.calculateTotalCount();
  totalCountPrice.textContent = myCart.calculateTotalPrice();
}

addToCartButtons.forEach(item => {
  item.addEventListener('click', () => {
    let itemDOM = item.closest('.product-box__item');
    let name = itemDOM.querySelector('.product-box__title').textContent;
    let price = parseInt(itemDOM.querySelector('.product-box__meta p').textContent);
    let count = +itemDOM.querySelector('.qty__item').value;
    if (count <= 0) {
      itemDOM.querySelector('.qty__item').value = 1;
      count = 1;
    }
    myCart.addItemToCart(name, price, count);
    totalCount.textContent = myCart.calculateTotalCount();
    totalCountPrice.textContent = myCart.calculateTotalPrice();
  })
})
