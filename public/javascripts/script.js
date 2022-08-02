'use strict'

if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready(){
    // REMOVE-FROM-CART
    let btnRemove = document.getElementsByClassName('btn-remove');
    for(let btn of btnRemove){
    btn.addEventListener('click', removeCartItem)
    };

    // QUANTITY-CHANGED
    let arr_quantity = document.getElementsByClassName('quantity-cart-item');
    for(let quantity of arr_quantity){
        quantity.addEventListener('change', quantityChanged)
        quantity.addEventListener('click', () =>{
            quantity.classList.remove('red-border');
        });
    };

    // ADD-TO-CART  
    let arr_AddToCart = document.getElementsByClassName('btn-card-product');
        for(let btn of arr_AddToCart){
            btn.addEventListener('click', addToCartClick);
        };
    
    // REMOVE-ALL-BTN
    document.getElementById('btn-remove-all').addEventListener('click',removeAll);

    // PURCHASE
    document.getElementById('total-cart-el').addEventListener('click',()=>{
        console.log('click');
    })

    // OPEN-DETAILS-ITEMs
    let arr_cardItems = document.getElementsByClassName('grid-card-product');
    for(let card of arr_cardItems){
        card.addEventListener('click', (e) => {
            if(e.target !== card.getElementsByClassName('quantity-card-product')[0] 
                && e.target !== card.getElementsByClassName('btn-card-product')[0]){
                            fullCardPop(e);
            }
        })
    }

    // CLOSE-DETAILS-ITEMs
    let overlayBlur = document.getElementById('overlay-blur').addEventListener('click',closeModel);

}

// ADD-TO-CART

function addToCartClick(e){
    let btn = e.target;
    let cardProduct = btn.parentElement.parentElement;
    let name = cardProduct.getElementsByClassName('name-card-product')[0].innerHTML;
    let quantity = cardProduct.getElementsByClassName('quantity-card-product')[0].value;
    let price = cardProduct.getElementsByClassName('price-card-product')[0].innerHTML;
    let imgSrc = cardProduct.getElementsByClassName('img-card-product')[0].src;
    let el_quantity = cardProduct.getElementsByClassName('quantity-card-product')[0];
    if(isNaN(quantity) || quantity <= 0){
        el_quantity.classList.add('red-border');
        el_quantity.addEventListener('click', () =>{
            el_quantity.classList.remove('red-border');
        })
    } else {
        addToCart(name, quantity, price, imgSrc);
        updateCartTotal();}
}

function addToCart(name, quantity, price, imgSrc){
    let newCartItem = document.createElement('div');
    let cartItems = document.getElementById("cart-items");
    let arr_cartItemName = cartItems.getElementsByClassName('name-cart-item');
    for(let el_name of arr_cartItemName){
        if(el_name.innerHTML == name){
            el_name.parentElement.parentElement.remove();
        }
    }

    let cartItemContent = `
            <div class="cart-item">
                <img class="img-cart-item" src="${imgSrc}" alt="">
                <h1 class="name-cart-item">${name}</h1>
                <input class="quantity-cart-item" type="number" name="quantity" id="quantity" min="1" max="50" value="${quantity}">
                <h2 class="price-cart-item">${price}</h2>
                <h3 class="total-cart-item"></h3>
                <button class="btn-remove">הסר</button>
            </div>   `    
    newCartItem.innerHTML = cartItemContent;
    cartItems.append(newCartItem);
    newCartItem.getElementsByClassName('btn-remove')[0].addEventListener('click',removeCartItem);
    newCartItem.getElementsByClassName('quantity-cart-item')[0].addEventListener('change',quantityChanged);
    newCartItem.getElementsByClassName('quantity-cart-item')[0].addEventListener('click', () =>{
        newCartItem.getElementsByClassName('quantity-cart-item')[0].classList.remove('red-border');
    });
    updateTotalCartItem(newCartItem);
}

// REMOVE-FROM-CART
function removeCartItem(e){
        let btnClicked = e.target;
        btnClicked.parentElement.remove();
        updateCartTotal();
}

// QUANTITY-CHANGED
function quantityChanged(e){
    if(e.type == 'change'){
        let quantityInput = e.target;
    if(isNaN(quantityInput.value) || quantityInput.value <= 0){
        let cartItem = quantityInput.parentElement;
        let el_quantity = cartItem.getElementsByClassName('quantity-cart-item')[0];
        el_quantity.classList.add('red-border');
    } else {
        updateCartTotal();  
        updateTotalCartItem(e);  
    }
}
}

// UPDATE-TOTAL-CART-ITEM
function updateTotalCartItem(e){
    let cartItem;
    if(e.type == 'change'){
        let quantityInput = e.target;
        cartItem = quantityInput.parentElement.parentElement;
    } else {  
        cartItem = e;
    }
    let el_price = cartItem.getElementsByClassName('price-cart-item')[0];
    let el_quantity = cartItem.getElementsByClassName('quantity-cart-item')[0];
    let el_total = cartItem.getElementsByClassName('total-cart-item')[0];
    let price = parseFloat(el_price.innerHTML.replace('₪', ''));
    let quantity = el_quantity.value;
    let total = price * quantity;
    total = (Math.round(total * 100) / 100).toFixed(2);
    if(isNaN(total) || total <= 0){

    }else{
    el_total.innerHTML = total+' ₪'  ;
}}

//  UPDATE-TOTAL-CART
function updateCartTotal(){
    let el_totalPay = document.getElementById('total-cart-el');
    let cartItems = document.getElementById('cart-items');
    let arr_cartItem = cartItems.getElementsByClassName('cart-item');
    let total = 0;
    for (let item of arr_cartItem){
        let el_price = item.getElementsByClassName('price-cart-item')[0];
        let el_quantity = item.getElementsByClassName('quantity-cart-item')[0];
        let price = parseFloat(el_price.innerHTML.replace('₪', ''));
        let quantity = el_quantity.value;
        total += price * quantity;
    }
    total = (Math.round(total * 100) / 100).toFixed(2);
    el_totalPay.innerHTML = 'לתשלום: '+ total + ' ₪';
}

// REMOVE-ALL-ITEMs-FROM-CART
function removeAll(){
    let cartItems = document.getElementById('cart-items');
    while(cartItems.hasChildNodes()){
        cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
}


// FULL-CARD-POP
function fullCardPop(e) {
    let fullCard = document.getElementById('full-card-product');
    let cardContent = e.target.parentElement;
    let name = cardContent.getElementsByClassName('name-card-product')[0].innerHTML;
    let quantity = cardContent.getElementsByClassName('quantity-card-product')[0].value;
    let price = cardContent.getElementsByClassName('price-card-product')[0].innerHTML;
    let imgSrc = cardContent.getElementsByClassName('img-card-product')[0].src;
    popCardUpdate(cardContent, name, quantity, price, imgSrc);

    fullCard.classList.remove('hide');
    document.getElementById('overlay-blur').classList.remove('hide');
}

function closeModel(){
    let fullCard = document.getElementById('full-card-product');
    let overlayBlur = document.getElementById('overlay-blur');
    overlayBlur.classList.add('out');
    fullCard.classList.add('down');
    setTimeout(()=>{
        overlayBlur.classList.add('hide');
        fullCard.classList.add('hide');
        fullCard.classList.remove('down');
        overlayBlur.classList.remove('out');
    } ,200 )
}

function popCardUpdate(cardContent, name, quantity, price, imgSrc){
    let el_fullCardView = document.getElementById('full-card-view');
    let cartItemContent = `
        <img src="${imgSrc}" alt="full" class="full-card-img">
        <h1 class="full-card-name">${name}</h1>
        <h2 class="full-card-price">${price}</h2>
        <div class="full-quantity-btn">
            <input class="full-card-quantity" type="number" value="${quantity}" name="quantity" id="quantity" min="0" max="50">
            <button class="full-card-btn">הוסף לסל</button>
        </div>   `    
    el_fullCardView.innerHTML = cartItemContent;
    el_fullCardView.getElementsByClassName('full-card-quantity')[0].addEventListener('change',() => {
        quantityChanged;
    } )
    el_fullCardView.getElementsByClassName('full-card-quantity')[0].addEventListener('click', () =>{
        el_fullCardView.getElementsByClassName('full-card-quantity')[0].classList.remove('red-border');
    });
    
    el_fullCardView.getElementsByClassName('full-card-btn')[0].addEventListener('click',() =>{
        if (isNaN(el_fullCardView.getElementsByClassName('full-card-quantity')[0].value) ||el_fullCardView.getElementsByClassName('full-card-quantity')[0].value <= 0){
            el_fullCardView.getElementsByClassName('full-card-quantity')[0].classList.add('red-border');
        } else {
            cardContent.getElementsByClassName('quantity-card-product')[0].value = el_fullCardView.getElementsByClassName('full-card-quantity')[0].value;
            cardContent.getElementsByClassName('btn-card-product')[0].click();
        }
    });
}

