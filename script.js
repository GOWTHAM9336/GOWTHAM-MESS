let cart = [];
let total = 0;

function addToCart(item, price, silent){

    cart.push({
        item,
        price
    });

    total += price;

    updateCart();

    if(!silent){
        alert(item + " added to cart");
    }

}

function updateCart(){

    let cartItems =
    document.getElementById("cart-items");

    cartItems.innerHTML = "";

    total = 0;

    // Tracks how many of each item are currently in the cart,
    // used below to keep the menu's qty badges in sync.
    let counts = {};

    cart.forEach((item,index)=>{

        total += item.price;

        counts[item.item] = (counts[item.item] || 0) + 1;

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

    document.getElementById("total").innerText = total;

    document.getElementById("cart-count").innerText = cart.length;

    // SYNC MENU QTY BADGES — this keeps the +/- badges on the
    // menu cards correct no matter whether an item was added,
    // removed, or its quantity changed from inside the cart panel.
    document.querySelectorAll('.qty-box span[id^="qty-"]').forEach(span=>{

        let name = span.id.replace("qty-", "");

        let qty = counts[name] || 0;

        quantities[name] = qty;

        span.innerText = qty;

    });

    // QR Amount Auto Update
    let qrBox = document.getElementById("qr-box");

    if(qrBox && qrBox.style.display === "block"){

        document.getElementById("qr-amount").innerText = total;

        document.getElementById("qrcode").innerHTML = "";

        let upiLink =
        `upi://pay?pa=9080149926@paytm&pn=GOWTHAM MESS&am=${total}&cu=INR`;

        new QRCode(
            document.getElementById("qrcode"),
            {
                text: upiLink,
                width: 250,
                height: 250
            }
        );
    }

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
    document.getElementById("bill-order-no").textContent = generateOrderNumber();

    let today = new Date();

    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let year = today.getFullYear();

    document.getElementById("bill-date").innerText =
    `${day}/${month}/${year}`;

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
    let icons = document.querySelector(".floating-icons");
    if(icons){
        icons.style.display = "flex";
    }
}

function printBill(){

    // Hide buttons before printing
    let icons = document.querySelector(".floating-icons");
    if(icons){
        icons.style.display = "none";
    }

    window.print();

    // Show buttons after printing
    if(icons){
        icons.style.display = "flex";
    }
}

function placeOrder(event){

    event.preventDefault();

    const name = document.getElementById("name").value;

    alert("Thank You " + name + " save your delivery details");

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

/* SHOW SELECTED MENU ONLY */
function showMenu(menuId){

    document.querySelectorAll(".menu-box").forEach(menu => {

        menu.style.display = "none";

    });

    document.getElementById(menuId).style.display = "block";

    document.getElementById(menuId).scrollIntoView({

        behavior:"smooth"

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

/* LOGOUT FUNCTION */

function logoutUser(){

    localStorage.removeItem("isLoggedIn");

    let icons = document.getElementById("floating-icons");
    if(icons){
        icons.style.display = "none";
    }

    alert("Logged Out Successfully");

    location.reload();

}

/* SHOW QR (toggle) */

function showQR() {

    let qrBox = document.getElementById("qr-box");

    // Toggle QR Show/Hide
    if (qrBox.style.display === "block") {

        qrBox.style.display = "none";
        return;

    }

    qrBox.style.display = "block";

    // Show cart total
    document.getElementById("qr-amount").innerText = total;

    // Clear old QR
    document.getElementById("qrcode").innerHTML = "";

    // Your UPI ID
    let upiLink =
    `upi://pay?pa=9080149926@paytm&pn=GOWTHAM MESS&am=${total}&cu=INR`;

    // Generate QR
    new QRCode(
        document.getElementById("qrcode"),
        {
            text: upiLink,
            width: 250,
            height: 250
        }
    );
}

/* PAYMENT SUCCESS (legacy popup, kept for compatibility) */

function paymentSuccess(){

    let popup = document.getElementById("payment-popup");
    if(popup){
        popup.style.display = "flex";
    }

}

/* CLOSE POPUP */

function closePaymentPopup(){

    let popup = document.getElementById("payment-popup");
    if(popup){
        popup.style.display = "none";
    }

}

/* ==================== PAYMENT GATING ====================

   The order can only be confirmed once the selected payment
   method has actually been completed:

   - Cash        -> always considered "paid" (pay on delivery)
   - Online(Card)-> paid only after Razorpay reports success
   - UPI / QR    -> paid only once a Transaction ID is entered
*/

let paymentCompleted = true; // Cash is selected by default

function initPaymentListeners(){

    document.querySelectorAll('input[name="payment"]').forEach(radio => {

        radio.addEventListener('change', function(){

            if(this.value === "Cash"){
                paymentCompleted = true;
            } else {
                paymentCompleted = false;
            }

        });

    });

    let txnInput = document.getElementById("transaction-id");

    if(txnInput){

        txnInput.addEventListener('input', function(){

            let upiSelected =
            document.querySelector('input[name="payment"]:checked');

            if(upiSelected && upiSelected.value === "UPI"){

                paymentCompleted = this.value.trim() !== "";

            }

        });

    }

}

/* CONFIRM ORDER */

function confirmOrder() {

    if (cart.length === 0) {
        alert("🛒 Cart is Empty! Please add items.");
        return;
    }

    if(!paymentCompleted){

        let payment =
        document.querySelector('input[name="payment"]:checked');

        let method = payment ? payment.value : "Cash";

        if(method === "Online"){
            alert("💳 Please complete the card payment before confirming your order.");
        } else if(method === "UPI"){
            alert("📱 Please complete the UPI payment and enter the Transaction ID before confirming your order.");
        } else {
            alert("Please complete the payment before confirming your order.");
        }

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

    /* RESET PAYMENT STATE FOR NEXT CUSTOMER */

    resetPaymentState();

    /* READY FOR NEXT CUSTOMER */

    alert("Ready For New Order 🍴");

}

function resetPaymentState(){

    let cashRadio =
    document.querySelector('input[name="payment"][value="Cash"]');

    if(cashRadio){
        cashRadio.checked = true;
    }

    paymentCompleted = true;

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

    if(total <= 0){
        alert("Please add items to cart first.");
        return;
    }

    window.location.href =
    `paytmmp://pay?pa=9080149926@ptsbi&pn=GowthamMess&am=${total}&cu=INR`;
}

function payWithGpay(){

    if(total <= 0){
        alert("Please add items to cart first.");
        return;
    }

    window.location.href =
    `tez://upi/pay?pa=m.gowthammanimalan8383@oksbi&pn=GowthamMess&am=${total}&cu=INR`;
}

function payWithPhonepe(){

    if(total <= 0){
        alert("Please add items to cart first.");
        return;
    }

    window.location.href =
    `phonepe://pay?pa=9080149926@ybl&pn=GowthamMess&am=${total}&cu=INR`;
}

function generateOrderNumber() {

    const today = new Date().toISOString().split("T")[0];

    let savedDate = localStorage.getItem("orderDate");
    let orderNo = parseInt(localStorage.getItem("orderNo")) || 0;

    if (savedDate !== today) {
        orderNo = 0;
        localStorage.setItem("orderDate", today);
    }

    orderNo++;

    localStorage.setItem("orderNo", orderNo);

    return String(orderNo).padStart(3, "0");
}

// Holds the live per-item count shown on each menu card's qty badge.
// updateCart() is the single source of truth for this — it recalculates
// every value straight from the cart array, so it can never drift out
// of sync with what's actually in the cart.
let quantities = {};

function increaseQtyByName(name, price){

    // silent=true: no need for a popup every time someone taps "+"
    addToCart(name, price, true);

}

function decreaseQtyByName(name, price){

    let index = cart.findIndex(item => item.item === name);

    if(index === -1){
        return;
    }

    cart.splice(index,1);

    updateCart();

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

function payNow(){

    if(total <= 0){

        alert("🛒 Please add items to cart first");
        paymentCompleted = false;
        return;
    }

    let options = {

        key: "rzp_live_T3sOsI8bfwt0vI",

        amount: total * 100,

        currency: "INR",

        name: "GOWTHAM MESS",

        description: "Food Order Payment",

        image: "pay.png",

        handler: function(response){

            let paymentId =
            response.razorpay_payment_id;

            let tx =
            document.getElementById("transaction-id");

            if(tx){
                tx.value = paymentId;
            }

            paymentCompleted = true;

            alert(
                "✅ Payment Successful\n\nTransaction ID:\n" +
                paymentId
            );

            // Automatically move on to order confirmation
            confirmOrder();

        },

        modal: {

            ondismiss: function(){

                // Popup closed without paying
                paymentCompleted = false;

            }

        },

        prefill: {

            name:
            document.getElementById("name").value,

            contact:
            document.getElementById("phone").value,

            email:
            document.getElementById("user_email") ?
            document.getElementById("user_email").value :
            ""

        },

        theme: {
            color: "#28a745"
        }

    };

    let rzp =
    new Razorpay(options);

    rzp.open();

}

/* ---------------- LOGIN TAB ---------------- */

function showLogin(){

    document.getElementById("login-form").style.display = "block";
    document.getElementById("signup-form").style.display = "none";

    document.getElementById("login-error").innerHTML = "";

}

/* ---------------- SIGNUP TAB ---------------- */

function showSignup(){

    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";

    document.getElementById("signup-error").innerHTML = "";

}

/* ---------------- SHOW / HIDE PASSWORD ---------------- */

function togglePassword(id,icon){

    let input = document.getElementById(id);

    if(input.type==="password"){

        input.type="text";
        icon.innerHTML="🙈";

    }else{

        input.type="password";
        icon.innerHTML="👁️";

    }

}

/* ---------------- SIGN UP ---------------- */
function signupUser(){

    let name = document.getElementById("signup-fullname").value.trim();
    let email = document.getElementById("signup-email").value.trim();
    let phone = document.getElementById("signup-phone").value.trim();
    let password = document.getElementById("signup-password").value;
    let confirm = document.getElementById("signup-confirm-password").value;

    if(name==="" || email==="" || phone==="" || password==="" || confirm===""){

        document.getElementById("signup-error").innerText =
        "Please fill all fields.";

        return;
    }

    if(password !== confirm){

        document.getElementById("signup-error").innerText =
        "Passwords do not match.";

        return;
    }

    // Save account (Full Name is also used as the display / user name)
    localStorage.setItem("fullname", name);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);
    localStorage.setItem("password", password);

    // User is NOT logged in yet
    localStorage.removeItem("isLoggedIn");

    alert("Account Created Successfully.\nPlease Login.");

    // Clear signup fields
    document.getElementById("signup-fullname").value = "";
    document.getElementById("signup-email").value = "";
    document.getElementById("signup-phone").value = "";
    document.getElementById("signup-password").value = "";
    document.getElementById("signup-confirm-password").value = "";

    document.getElementById("signup-error").innerText = "";

    // Open Login Form
    showLogin();
}

/* ---------------- LOGIN ---------------- */

function loginUser(){

    let identifier =
    document.getElementById("login-identifier").value.trim();

    let password =
    document.getElementById("login-password").value;

    if(

        (identifier===localStorage.getItem("email") ||
         identifier===localStorage.getItem("fullname")) &&
        password===localStorage.getItem("password")

    ){

        localStorage.setItem("isLoggedIn","true");

        document.getElementById("login-popup").style.display="none";

        let user =
        document.getElementById("user-name");

        if(user){

            user.innerText=
            localStorage.getItem("fullname");

        }

        let icons =
        document.getElementById("floating-icons");

        if(icons){

            icons.style.display="flex";

        }

        alert(
            "Welcome " +
            localStorage.getItem("fullname")
        );

    }

    else{

        document.getElementById("login-error").innerHTML =
        "Invalid Email/Username or Password.";

    }

}

/* ---------------- AUTO LOGIN ---------------- */

window.onload = function(){

    initPaymentListeners();

    if(localStorage.getItem("isLoggedIn")==="true"){

        let popup =
        document.getElementById("login-popup");

        if(popup){

            popup.style.display="none";

        }

        let user =
        document.getElementById("user-name");

        if(user){

            user.innerText=
            localStorage.getItem("fullname");

        }

        let icons =
        document.getElementById("floating-icons");

        if(icons){

            icons.style.display="flex";

        }

    }

    else{

        let popup =
        document.getElementById("login-popup");

        if(popup){

            popup.style.display="flex";

        }

    }

};

/* ==================== PROFILE ==================== */

function openProfile(){

    if(localStorage.getItem("isLoggedIn") !== "true"){

        let popup = document.getElementById("login-popup");

        if(popup){
            popup.style.display = "flex";
        }

        return;
    }

    document.getElementById("profile-view-name").innerText =
    localStorage.getItem("fullname") || "-";

    document.getElementById("profile-view-email").innerText =
    localStorage.getItem("email") || "-";

    document.getElementById("profile-view-phone").innerText =
    localStorage.getItem("phone") || "-";

    document.getElementById("profile-view").style.display = "block";
    document.getElementById("profile-edit").style.display = "none";
    document.getElementById("profile-password").style.display = "none";

    document.getElementById("profile-modal").style.display = "flex";

}

function closeProfile(){

    document.getElementById("profile-modal").style.display = "none";

}

function toggleEditProfile(show){

    if(show){

        document.getElementById("edit-fullname").value =
        localStorage.getItem("fullname") || "";

        document.getElementById("edit-email").value =
        localStorage.getItem("email") || "";

        document.getElementById("edit-phone").value =
        localStorage.getItem("phone") || "";

        document.getElementById("profile-edit-error").innerText = "";

        document.getElementById("profile-view").style.display = "none";
        document.getElementById("profile-edit").style.display = "block";

    } else {

        document.getElementById("profile-edit").style.display = "none";
        document.getElementById("profile-view").style.display = "block";

    }

}

function saveProfile(){

    let name = document.getElementById("edit-fullname").value.trim();
    let email = document.getElementById("edit-email").value.trim();
    let phone = document.getElementById("edit-phone").value.trim();

    if(name === "" || email === "" || phone === ""){

        document.getElementById("profile-edit-error").innerText =
        "Please fill all fields.";

        return;
    }

    localStorage.setItem("fullname", name);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);

    let userNameEl = document.getElementById("user-name");

    if(userNameEl){
        userNameEl.innerText = name;
    }

    alert("Profile Updated Successfully");

    toggleEditProfile(false);
    openProfile();

}

function toggleChangePassword(show){

    if(show){

        document.getElementById("current-password").value = "";
        document.getElementById("new-password").value = "";
        document.getElementById("confirm-new-password").value = "";
        document.getElementById("profile-password-error").innerText = "";

        document.getElementById("profile-view").style.display = "none";
        document.getElementById("profile-password").style.display = "block";

    } else {

        document.getElementById("profile-password").style.display = "none";
        document.getElementById("profile-view").style.display = "block";

    }

}

function submitChangePassword(){

    let current = document.getElementById("current-password").value;
    let newPass = document.getElementById("new-password").value;
    let confirmPass = document.getElementById("confirm-new-password").value;

    if(current === "" || newPass === "" || confirmPass === ""){

        document.getElementById("profile-password-error").innerText =
        "Please fill all fields.";

        return;
    }

    if(current !== localStorage.getItem("password")){

        document.getElementById("profile-password-error").innerText =
        "Current password is incorrect.";

        return;
    }

    if(newPass !== confirmPass){

        document.getElementById("profile-password-error").innerText =
        "New passwords do not match.";

        return;
    }

    localStorage.setItem("password", newPass);

    alert("Password Changed Successfully");

    toggleChangePassword(false);

}