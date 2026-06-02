let cart = [];
let total = 0;

function addToCart(item, price){

    cart.push({
        item,
        price
    });

    total += price;

    updateCart();

    alert(item + " added to cart");

}

function updateCart(){

    let cartItems =
    document.getElementById("cart-items");

    cartItems.innerHTML = "";

    total = 0;

    cart.forEach((item,index)=>{

        total += item.price;

        let li =
        document.createElement("li");

        li.innerHTML = `

        <div class="cart-item">

            <div>

                <h4>${item.item}</h4>

                <p>₹${item.price}</p>

            </div>

            <div class="cart-buttons">

                <button onclick="increaseQty(${index})">

                    +

                </button>

                <button onclick="decreaseQty(${index})">

                    -

                </button>

                <button onclick="removeItem(${index})">

                    🗑

                </button>

            </div>

        </div>

        `;

        cartItems.appendChild(li);

    });

    document.getElementById("total")
    .innerText = total;

    document.getElementById("cart-count")
    .innerText = cart.length;

}

function toggleCart(){

    document.getElementById("cart").classList.toggle("active");

}

function checkout(){

    if(cart.length === 0){

        alert("Cart is Empty");
        return;

    }

    let customerName = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let deliveryType = document.getElementById("deliveryType").value;
    let address = document.getElementById("address").value;

    let billMessage = `🍴 GOWTHAM MESS BILL %0A%0A`;

    billMessage += `Customer: ${customerName}%0A`;
    billMessage += `Phone: ${phone}%0A`;
    billMessage += `Delivery: ${deliveryType}%0A`;
    billMessage += `Address/Table: ${address}%0A%0A`;

    billMessage += `🛒 Ordered Items:%0A`;

    cart.forEach((item)=>{

        billMessage += `- ${item.item} : ₹${item.price}%0A`;

    });

    billMessage += `%0A💰 Total Amount: ₹${total}`;

    // YOUR WHATSAPP NUMBER
    let whatsappNumber = "919080149926";

    // OPEN WHATSAPP
    window.open(
        `https://wa.me/${whatsappNumber}?text=${billMessage}`,
        "_blank"
    );

}


function showBill(){

    if(cart.length === 0){

        alert("Cart is Empty");
        return;

    }

    let customerName =
    document.getElementById("name").value;

    document.getElementById("bill-customer").innerText =
    customerName;

    let today = new Date();

    document.getElementById("bill-date").innerText =
    today.toLocaleDateString();

    let billItems =
    document.getElementById("bill-items");

    billItems.innerHTML = "";

    let groupedItems = {};

    cart.forEach((item)=>{

        if(groupedItems[item.item]){

            groupedItems[item.item].qty += 1;
            groupedItems[item.item].price += item.price;

        }else{

            groupedItems[item.item] = {
                qty:1,
                price:item.price
            };

        }

    });

    for(let itemName in groupedItems){

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${itemName}</td>
            <td>${groupedItems[itemName].qty}</td>
            <td>₹${groupedItems[itemName].price}</td>
        `;

        billItems.appendChild(row);

    }

    document.getElementById("bill-total").innerText =
    total;

    /* PAYMENT METHOD */

let paymentMethod =
document.querySelector(
'input[name="payment"]:checked'
).value;

let transactionId =
document.getElementById("transaction-id").value;

/* CREATE PAYMENT ROW */

let paymentRow =
document.createElement("tr");

paymentRow.innerHTML = `
<td colspan="3">
<b>Payment:</b> ${paymentMethod}
<br>
<b>Transaction ID:</b>
${transactionId || "Cash Payment"}
</td>
`;

billItems.appendChild(paymentRow);

    document.getElementById("bill-popup").style.display =
    "flex";

}

function closeBill(){

    document.getElementById("bill-popup").style.display = "none";

    // Show Call & WhatsApp buttons again
    document.querySelector(".floating-icons").style.display = "flex";
}

function printBill(){

    // Hide buttons before printing
    document.querySelector(".floating-icons").style.display = "none";

    window.print();

    // Show buttons after printing
    document.querySelector(".floating-icons").style.display = "flex";
}

function placeOrder(event){

    event.preventDefault();

    const name = document.getElementById("name").value;

    alert("Thank You " + name + " Your Order is Confirmed");

}

function scrollMenu(){

    document.getElementById("menu").scrollIntoView({
        behavior:"smooth"
    });

}

function sendEmail(){

    if (cart.length === 0) {
    alert("Cart is Empty!");
    return;
}

    let customerName = document.getElementById("name").value;

    let email = prompt("Enter Email Address");

    if(email == "" || email == null){

        return;

    }

    let subject = "GOWTHAM MESS BILL";

    let body = `Customer: ${customerName}\n\n`;

    cart.forEach((item)=>{

        body += `${item.item} - ₹${item.price}\n`;

    });

    body += `\nTotal Amount: ₹${total}`;

    window.location.href =
    `mailto:${email}?subject=${subject}&body=${body}`;

}
function showMenu(sectionId){

    document.getElementById(sectionId).scrollIntoView({
        behavior:"smooth"
    });

}

function closeBill(){

    document.getElementById("bill-popup").style.display =
    "none";

}

/* LOGIN SYSTEM */



function loginUser(){

    let username =
    document.getElementById("username").value;

    let password =
    document.getElementById("password").value;

    if(username === "" || password === ""){

        alert("Enter Details");

        return;
    }

    localStorage.setItem(
        "gowthamUser",
        username
    );

    localStorage.setItem(
        "gowthamPass",
        password
    );

    document.getElementById("user-name")
    .innerText = username;

    document.getElementById("login-popup")
    .style.display = "none";

    document.getElementById("floating-icons").style.display = "flex";

    alert("Login Success");

}

/* LOGOUT FUNCTION */

function logoutUser(){

    localStorage.removeItem("gowthamUser");

    localStorage.removeItem("gowthamPass");
    document.getElementById("floating-icons")
.style.display = "none";

    alert("Logged Out");

    location.reload();

}

/* SHOW QR */

function showQR(){

    document.getElementById("qr-box")
    .style.display = "block";

    document.getElementById("qr-amount")
    .innerText = total;

}

/* PAYMENT SUCCESS */

function paymentSuccess(){

    document.getElementById("payment-popup")
    .style.display = "flex";

}

/* CLOSE POPUP */

function closePaymentPopup(){

    document.getElementById("payment-popup")
    .style.display = "none";

}

/* CONFIRM ORDER */

function confirmOrder(){

    

    let username =
    localStorage.getItem("gowthamUser")
    || "Customer";

    document.getElementById("success-user")
    .innerText =
    `Thank You ${username}`;

    document.getElementById(
        "order-success-popup"
    ).style.display = "flex";

}

/* CLOSE SUCCESS POPUP */
function closeSuccessPopup(){

    /* CLOSE SUCCESS POPUP */

    document.getElementById(
        "order-success-popup"
    ).style.display = "none";

    /* CLEAR CART */

    cart = [];

    total = 0;

    updateCart();

    /* CLEAR BILL */

    document.getElementById(
        "bill-items"
    ).innerHTML = "";

    document.getElementById(
        "bill-total"
    ).innerText = "0";

    /* RESET QR */

    document.getElementById(
        "qr-amount"
    ).innerText = "0";

    document.getElementById(
        "transaction-id"
    ).value = "";

    document.getElementById(
        "qr-box"
    ).style.display = "none";

    /* CLOSE CART PROPERLY */

    document.getElementById(
        "cart"
    ).classList.remove("active");

    /* RESET FORM */

    document.getElementById("name").value = "";

    document.getElementById("phone").value = "";

    document.getElementById("address").value = "";

    /* READY FOR NEXT CUSTOMER */

    alert("Ready For New Order 🍴");

}

/* REMOVE ITEM */

function removeItem(index){

    cart.splice(index,1);

    updateCart();

}

/* INCREASE QUANTITY */

function increaseQty(index){

    let item = cart[index];

    cart.push({
        item:item.item,
        price:item.price
    });

    updateCart();

}

/* DECREASE QUANTITY */

function decreaseQty(index){

    cart.splice(index,1);

    updateCart();

}

/* PAYTM */

function payWithPaytm(){

    window.location.href =
    `paytmmp://pay?pa=9080149926@paytm&pn=GowthamMess&am=${total}&cu=INR`;

}

/* GPAY */

function payWithGpay(){

    window.location.href =
    `tez://upi/pay?pa=9080149926@okaxis&pn=GowthamMess&am=${total}&cu=INR`;

}

/* PHONEPE */

function payWithPhonepe(){

    window.location.href =
    `phonepe://pay?pa=9080149926@ybl&pn=GowthamMess&am=${total}&cu=INR`;

}

function showMenu(category){

    const menus = document.querySelectorAll('.menu-category');

    menus.forEach(menu=>{
        menu.style.display='none';
    });

    document.getElementById(category).style.display='block';

    document.getElementById(category).scrollIntoView({
        behavior:'smooth'
    });
}

function showAllMenu(){

    document.querySelectorAll('.menu-category')
    .forEach(menu=>{
        menu.style.display='block';
    });

    document.getElementById('menu').scrollIntoView({
        behavior:'smooth'
    });
}




// Show selected menu only
function showMenu(menuId){

    document.querySelectorAll(".menu-box").forEach(menu => {

        menu.style.display = "none";

    });

    document.getElementById(menuId).style.display = "block";

    document.getElementById(menuId).scrollIntoView({

        behavior:"smooth"

    });

}

window.onload = function(){

    // Hide all menus
    document.querySelectorAll(".menu-box").forEach(menu => {
        menu.style.display = "none";
    });

    // Check saved login
    let savedUser = localStorage.getItem("gowthamUser");

    if(savedUser){

        document.getElementById("login-popup").style.display = "none";

        document.getElementById("user-name").innerText = savedUser;

        // Show floating buttons
        document.getElementById("floating-icons").style.display = "flex";
    }
}
function toggleOrderMenu(){

    const menu = document.getElementById("order-menu");

    if(!menu){
        console.log("order-menu not found");
        return;
    }

    menu.style.display =
    menu.style.display === "block"
    ? "none"
    : "block";
}

function showOrderDetails() {

    document.getElementById("orderUser").innerText =
        document.getElementById("name").value || "Not Entered";

    document.getElementById("orderPhone").innerText =
        document.getElementById("phone").value || "Not Entered";

    document.getElementById("orderAddress").innerText =
        document.getElementById("address").value || "Not Entered";

    let orderItems = document.getElementById("orderItems");

    orderItems.innerHTML = "";

    cart.forEach(item => {

        orderItems.innerHTML += `
            <p>
                ${item.item} - ₹${item.price}
            </p>
        `;

    });

    document.getElementById("orderTotal").innerText = total;

    document.getElementById("orderDetailsPopup").style.display = "flex";
}

function showDeliveryStatus(){

    document.getElementById("deliveryStatusPopup")
    .style.display = "flex";
}

function showPaymentDetails(){

    let payment =
    document.querySelector(
    'input[name="payment"]:checked'
    ).value;

    document.getElementById("paymentUser").innerText =
    document.getElementById("name").value;

    document.getElementById("paymentTotal").innerText =
    total;

    document.getElementById("paymentMethod").innerText =
    payment;

    document.getElementById("paymentDetailsPopup")
    .style.display = "flex";
}

function closePopup(id){

    document.getElementById(id)
    .style.display = "none";
}

function searchMenu(){

    let input =
    document.getElementById("searchInput")
    .value.toLowerCase();

    document.querySelectorAll(".menu-box")
    .forEach(menu => {

        menu.style.display = "block";

    });

    document.querySelectorAll(".card")
    .forEach(card => {

        let name =
        card.querySelector("h4")
        .innerText.toLowerCase();

        card.style.display =
        name.includes(input)
        ? "block"
        : "none";

    });

}

function showTracking(){

    document.getElementById(
        "trackingPopup"
    ).style.display = "flex";

}

function startTracking(){

    document.getElementById("track2")
    .classList.remove("active");

    document.getElementById("track3")
    .classList.remove("active");

    document.getElementById("track4")
    .classList.remove("active");

    setTimeout(function(){

        document.getElementById("track2")
        .classList.add("active");

    },3000);

    setTimeout(function(){

        document.getElementById("track3")
        .classList.add("active");

    },6000);

    setTimeout(function(){

        document.getElementById("track4")
        .classList.add("active");

        alert("🎉 Order Delivered");

    },9000);

}

function confirmOrder() {

    if (cart.length === 0) {
    alert("🛒 Cart is Empty! Please add items.");
    return;
}

    let customerName =
    document.getElementById("name").value;

    let phone =
    document.getElementById("phone").value;

    let email =
    document.getElementById("user_email").value;

    let address =
    document.getElementById("address").value;

    if (
    customerName === "" ||
    phone === "" ||
    email === "" ||
    address === ""
) {
    alert("🚚 Delivery Details are mandatory. Please fill all details.");
    return;
}

    let orderTime =
    new Date().toLocaleString("en-IN", {
        dateStyle: "short",
        timeStyle: "medium"
    });

    let payment =
    document.querySelector(
        'input[name="payment"]:checked'
    );

    let paymentMethod =
    payment ? payment.value : "Cash";

    let paymentStatus = "Paid ✅";

    let orderItems = "";

    cart.forEach(item => {
        orderItems +=
        `${item.item} - ₹${item.price}\n`;
    });

    emailjs.send(
        "gowtham_mess",
        "template_y0au8ao",
        {
            name: customerName,
            phone: phone,
            email: email,
            address: address,
            time: orderTime,
            payment_method: paymentMethod,
            payment_status: paymentStatus,
            items: orderItems,
            total: total
        }
    )

    .then(function(response){

        alert("Order Sent Successfully!");

        document.getElementById(
            "success-user"
        ).innerText =
        `Thank You ${customerName}`;

        document.getElementById(
            "order-success-popup"
        ).style.display = "flex";

    })

    .catch(function(error){

        console.log(error);

        alert("Email Failed");

    });

}

