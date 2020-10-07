
class Item {
  constructor(name, price, category, image) {
    this.name = name;
    this.price = price;
    this.category = category;
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
                            <input class="qty__item" type="number" min="1"> Кол
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
  findItemByName(name) {
    return this.items.find((item) => item.name === name);
  }
}

class Checkout {
  constructor() {
    this.items = [];
    if (sessionStorage.getItem("shoppingCart") != null) {
      this.loadCart();
    }
  }
  addItem(item, count) {
    let countInt = +count;
    let indexOfItem = this.findItemIndexByName(item.name);
    if (indexOfItem >= 0) {
      this.items[indexOfItem].count += countInt;
      this.saveCart();
      return;
    }
    let newItem = {};
    Object.assign(newItem, item);
    newItem.count = countInt;
    this.items.push(newItem);
    this.saveCart();
  }
  saveCart() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(this.items));
  }
  loadCart() {
    this.items = JSON.parse(sessionStorage.getItem('shoppingCart'));
  }
  findItemIndexByName(name) {
    return this.items.findIndex((item) => item.name === name);
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



const totalCount = document.getElementById('js-totalcount');
const totalCountPrice = document.getElementById('js-totalcountprice');
const goodNodes = Array.from(document.getElementsByClassName('product-box__item'));
const goodsWrapper = document.querySelector('.products-box');
const selectOfCategory = document.getElementById('js-filtercategory');
const selectOfPrice = document.getElementById('js-filterprice');
const form = document.getElementById('js-form');
const formSubmitButton = form.querySelector('#js-submit-button');
const formFields = form.querySelectorAll('.field__input');
const openFormButton = document.getElementById('js-openform');
let goodsArray = [];
let goods;
let myCart = new Checkout();


//add amounts from sessionStorage

if (myCart.items.length) {
  totalCount.textContent = myCart.calculateTotalCount();
  totalCountPrice.textContent = myCart.calculateTotalPrice();
}

//create Goods

goodNodes.forEach(item => {
  let name = item.querySelector('.product-box__title').textContent;
  let price = parseInt(item.querySelector('.product-box__meta p').textContent);
  let image = item.querySelector('.img-fluid').src;
  let category = +item.dataset.category;
  let itemOfGoods = new Item(name, price, category, image);
  goodsArray.push(itemOfGoods);
})
goods = new Goods(goodsArray);

//addFilters

selectOfCategory.addEventListener('change', function () {
  let priceFilter = selectOfPrice.value;
  let categoryFilter = this.value;
  let currentGoods = goods.filterGoods(categoryFilter, priceFilter);
  goodsWrapper.innerHTML = '';
  currentGoods.forEach(item => goodsWrapper.innerHTML += item.displayGood());

});

selectOfPrice.addEventListener('change', function () {
  let priceFilter = this.value;
  let categoryFilter = selectOfCategory.value;
  let currentGoods = goods.filterGoods(categoryFilter, priceFilter);
  goodsWrapper.innerHTML = '';
  currentGoods.forEach(item => goodsWrapper.innerHTML += item.displayGood());
});


//add item to the card

goodsWrapper.addEventListener('click', (event) => {
  let target = event.target;
  if (target.matches('.product-box__btn')) {
    let name = target.closest('.product-box__item').querySelector('.product-box__title').textContent;
    let count = +target.closest('.product-box__item').querySelector('.qty__item').value;
    if (count < 1) count = 1;
    let itemInGoods = goods.findItemByName(name);
    myCart.addItem(itemInGoods, count);
    target.closest('.product-box__item').querySelector('.qty__item').value ='';
    totalCount.textContent = myCart.calculateTotalCount();
    totalCountPrice.textContent = myCart.calculateTotalPrice();
  }
})


///form

openFormButton.addEventListener('click', function () {
  form.parentElement.style.display = 'flex';
})

formSubmitButton.addEventListener('click', function (event) {
  event.preventDefault()
  let isFormValid = true;
  formFields.forEach(function (item) {
    isFormValid = isFormValid && validateField(item);
  });
  if (isFormValid) {
    alert('сообщение с благодарностью за покупки :D')
    myCart.clearCart();
    totalCount.textContent = 'XXX';
    totalCountPrice.textContent = 'XXX';
    form.parentElement.style.display = 'none';
  }

})


function validateField(item) {
  let value = item.value;
  let isValid = false;
  if (!!value && !!value.trim()) {
    isValid = true;
  } else {
    alert(`Поле ${item.name} не заполнено!`);
  }
  return isValid;
}
