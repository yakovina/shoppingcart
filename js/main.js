class Item {
  constructor(name, price, count, category, image) {
    this.name = name;
    this.price = price;
    this.category = category;
    this.count = count;
    this.image = image;
  }
  displayGood() {
    let goodInnerHtml = `
                <div class="product-box__item" data-category="${this.category}">
                    <h3 class="product-box__title">${this.name}</h3>
                    <div class="product-box__img">
                        <img class="img-fluid" src="${this.image}">
                    </div>
                    <div class="product-box__meta">
                        <p>${this.price} грн.</p>
                        <div class="qty">
                            <input class="qty__item" type="number"> Кол
                        </div>
                        <button class="product-box__btn">Добавить</button>
                    </div>
                </div>
    `
    return goodInnerHtml
  }
}

class Goods {
  constructor(items) {
    this.items = items;
  }
  filterGoods(categoryFilter, priceFilter) {
    let categoryFilterInt = +categoryFilter;
    let priceFilterInt = +priceFilter;

    let currentGoods;
    if ((!priceFilterInt && !categoryFilterInt)) currentGoods = this.items;

    else {
      currentGoods = this.items.filter((item, index) => {
        let isPrice = false;
        let isCategory = false;

        if (priceFilterInt) {
          isPrice = item.price < priceFilterInt;
        }
        if (categoryFilterInt) {
          isCategory = item.category === categoryFilterInt;
        }

        if (priceFilterInt && categoryFilterInt) {
          return isPrice && isCategory;
        } else return isPrice || isCategory;
      })
    }
    return currentGoods;
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
    return this.items.reduce((sum, item) => sum + item.count, 0);
  }

  calculateTotalPrice() {
    return this.items.reduce((sum, item) => sum + item.count * item.price, 0)
  }
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
const addToCartButtons = Array.from(document.getElementsByClassName('product-box__btn'));
const totalCount = document.getElementById('js-totalcount');
const totalCountPrice = document.getElementById('js-totalcountprice');
const goodNodes = Array.from(document.getElementsByClassName('product-box__item'));
const goodPrices = Array.from(document.querySelectorAll('.product-box__meta p'));
const goodsWrapper = document.querySelector('.products-box');
const selectOfCategory = document.getElementById('js-filtercategory');
const selectOfPrice = document.getElementById('js-filterprice');
let goodsArray = [];
let goods;
// const goodsPrices =

//create Goods && Filter;


goodNodes.forEach(item => {
  let name = item.querySelector('.product-box__title').textContent;
  let price = parseInt(item.querySelector('.product-box__meta p').textContent);
  let image = item.querySelector('.img-fluid').src;
  let count = null;
  let category = +item.dataset.category;
  let itemOfGoods = new Item(name, price, count, category, image);
  goodsArray.push(itemOfGoods);
})
goods = new Goods(goodsArray);

selectOfCategory.addEventListener('change', function () {
  let priceFilter = selectOfPrice.value;
  let categoryFilter = this.value;
  let currentGoods = goods.filterGoods(categoryFilter, priceFilter);
  console.log(currentGoods)
  goodsWrapper.innerHTML = '';
  currentGoods.forEach(item => goodsWrapper.innerHTML += item.displayGood());
});

selectOfPrice.addEventListener('change', function () {
  let priceFilter = this.value;
  let categoryFilter = selectOfCategory.value;
  let currentGoods = goods.filterGoods(categoryFilter, priceFilter);
  console.log(currentGoods)
  goodsWrapper.innerHTML = '';
  currentGoods.forEach(item => goodsWrapper.innerHTML += item.displayGood());
});



//add item to the card
if (myCart.items.length) {
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




