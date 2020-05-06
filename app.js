//variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartTotal = document.querySelector('.cart-total');
const cartItems = document.querySelector('.cart-items');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

// cart items
let cart = [];
//buttons
let buttonDOM = [];

//getting the products
class Products {
  async getProducts() {
    try {
      const result = await fetch('products.json');
      let data = await result.json();

      let products = data.items;
      products = products.map((product) => {
        const { title, price } = product.fields;
        const { id } = product.sys;
        const image = product.fields.image.fields.file.url;
        return {
          title,
          price,
          id,
          image,
        };
      });

      return products;
    } catch (error) {
      console.error(error);
    }
  }
}

// ui  display products
class UI {
  displayProducts(products) {
    let result = '';
    console.log(products);
    products.forEach((product) => {
      result += ` <!--single product-->
      <article class="product">
        <div class="img-container">
          <img
            src=${product.image}
            alt="product"
            class="product-img"
          />
          <button class="bag-btn" data-id=${product.id}>
            <i class="fas fa-shopping-cart">add to bag</i>
          </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$${product.price}</h4>
      </article>
      <!-- end of single product-->`;
    });
    productsDOM.innerHTML = result;
  }

  getBagBtn() {
    const btns = [...document.querySelectorAll('.bag-btn')];
    console.log(btns);
    btns.forEach((btn) => {
      let id = btn.dataset.id;
      let inCart = cart.find((item) => {
        item.id === id;
      });

      if (inCart) {
        btn.innerText = 'In Cart';
        btn.disabled = true;
      }
      btn.addEventListener('click', (evt) => {
        evt.target.innerText = 'In Cart';
        btn.disabled = true;
        console.log(btns);
        //get product from products basic on the id
        let cartItem = { ...Storage.getProduct(id), amount: 1 };

        //add product to the cart
        cart = [...cart, cartItem];

        //save cart in local storage
        Storage.saveCart(cart);

        //set cart values
        this.setCartValues(cart);

        //display cart item
        this.addCartItem(cartItem);

        //show the cart
        this.showCart();
      });
    });
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `<img src=${item.image} alt="product" />
    <div>
      <h4>${item.title}</h4>
      <h5>$${item.price}</h5>
      <span class="remove-item" data-id=${item.id}>remove</span>
    </div>
    <div>
      <i class="fas fa-chevron-up" data-id=${item.id}></i>
      <p class="item-amount">${item.amount}</p>
      <i class="fas fa-chevron-down"data-id=${item.id}></i>
    </div>`;

    cartContent.appendChild(div);
  }

  showCart() {
    cartOverlay.classList.add('transparentBcg');
    cartDOM.classList.add('showCart');
  }
}

//local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));

    return products.find((product) => {
      return product.id === id;
    });
  }
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  const products = new Products();

  //get all products
  products
    .getProducts()
    .then((data) => {
      ui.displayProducts(data);
      Storage.saveProducts(data);
    })
    .then(() => {
      ui.getBagBtn();
    });
});
