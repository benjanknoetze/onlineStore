// Shopping Cart API

var shoppingCart = (function () {
  // Private methods and propeties
  cart = [];

  // Constructor
  function Item(name, price, count) {
    this.name = name;
    this.price = price;
    this.count = count;
  }

  // Save cart
  function saveCart() {
    sessionStorage.setItem("shoppingCart", JSON.stringify(cart));
  }

  // Load cart
  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem("shoppingCart"));
  }
  if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
  }

  // Load cart animation
  $(".cart").click(function () {
    $("#cart").animate(
      {
        marginLeft: "0.3in",
        fontSize: "2.7em",
        borderWidth: "10px",
      },
      1000
    );
  });

  // Public methods and propeties
  var obj = {};

  // Add to cart
  obj.addItemToCart = function (name, price, count) {
    for (var item in cart) {
      if (cart[item].name === name) {
        cart[item].count++;
        saveCart();
        return;
      }
    }
    var item = new Item(name, price, count);
    cart.push(item);
    saveCart();
  };

  // Set count from item
  obj.setCountForItem = function (name, count) {
    for (var i in cart) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }
  };

  // Remove item from cart
  obj.removeItemFromCart = function (name) {
    for (var item in cart) {
      if (cart[item].name === name) {
        cart[item].count--;
        if (cart[item].count === 0) {
          cart.splice(item, 1);
        }
        break;
      }
    }
    saveCart();
  };

  // Remove all items from cart
  obj.removeItemFromCartAll = function (name) {
    for (var item in cart) {
      if (cart[item].name === name) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  };

  // Clear cart
  obj.clearCart = function () {
    cart = [];
    saveCart();
  };

  // Count cart
  obj.totalCount = function () {
    var totalCount = 0;
    for (var item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  };

  // Total cart
  obj.totalCart = function () {
    var totalCart = 0;
    for (var item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  };

  // List cart
  obj.listCart = function () {
    var cartCopy = [];
    for (i in cart) {
      item = cart[i];
      itemCopy = {};
      for (p in item) {
        itemCopy[p] = item[p];
      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy);
    }
    return cartCopy;
  };

  // cart : Array
  // Item : Object/Class
  // addItemToCart : Function
  // removeItemFromCart : Function
  // removeItemFromCartAll : Function
  // clearCart : Function
  // countCart : Function
  // totalCart : Function
  // listCart : Function
  // saveCart : Function
  // loadCart : Function
  return obj;
})();

// Add item
$(".add").click(function (event) {
  event.preventDefault();
  var name = $(this).data("name");
  var price = Number($(this).data("price"));
  shoppingCart.addItemToCart(name, price, 1);
  displayCart();
  alert(
    name +
      " has been added to cart. \n" +
      "Your total is R" +
      shoppingCart.totalCart() +
      " (vat excluded)."
  );
});

// Clear items
$(".clear-cart").click(function () {
  shoppingCart.clearCart();
  displayCart();
  alert("Cart has been cleared.");
});

// To display cart contents
function displayCart() {
  var cartArray = shoppingCart.listCart();
  var output = "";
  for (var i in cartArray) {
    output +=
      "<tr>" +
      "<td>" +
      cartArray[i].name +
      "</td>" +
      "<td>(" +
      cartArray[i].price +
      ")</td>" +
      "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-light' data-name=" +
      cartArray[i].name +
      ">-</button>" +
      "<input type='number' class='item-count form-control' data-name=" +
      cartArray[i].name +
      " value='" +
      cartArray[i].count +
      "'>" +
      "<button class='plus-item input-group-addon btn btn-light' data-name=" +
      cartArray[i].name +
      ">+</button></div></td>" +
      "<td><button class='delete-item btn btn-light' data-name=" +
      cartArray[i].name +
      ">X</button></td>" +
      " = " +
      "<td>" +
      cartArray[i].total +
      "</td>" +
      "</tr>";
  }
  $(".show-cart").html(output);
  $(".total-cart").html(shoppingCart.totalCart());
  $(".total-count").html(shoppingCart.totalCount());
}

// Delete item button
$(".show-cart").on("click", ".delete-item", function (event) {
  var name = $(this).data("name");
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
});

// -1 item
$(".show-cart").on("click", ".minus-item", function (event) {
  var name = $(this).data("name");
  shoppingCart.removeItemFromCart(name);
  displayCart();
});

// +1 item
$(".show-cart").on("click", ".plus-item", function (event) {
  var name = $(this).data("name");
  shoppingCart.addItemToCart(name);
  displayCart();
});

// Item count input
$(".show-cart").on("change", ".item-count", function (event) {
  var name = $(this).data("name");
  var count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

displayCart();

// Add 15% VAT
plusTax = shoppingCart.totalCart() + shoppingCart.totalCart() * 0.15;

//Grand total(
var shipping;
var grandTotal = plusTax + shipping;

// Add shipping and VAT
function shippingTotal() {
  var shipping = document.getElementById("selectValue").value;
  var text;
  switch (shipping) {
    case "Next-day delivery: R30":
      shipping = 30;
      text = "R" + (shoppingCart.totalCart() + shipping);
      grandTotal = "R" + (plusTax + shipping);
      break;
    case "Same-day delivery: R40":
      shipping = 40;
      text = "R" + (shoppingCart.totalCart() + shipping);
      grandTotal = "R" + (plusTax + shipping);
      break;
    case "Pick-up: Free":
      shipping = 0;
      text = "R" + shoppingCart.totalCart();
      grandTotal = "R" + (plusTax + shipping);
      break;
    default:
      text = " Please choose an option...";
  }
  document.getElementById("plusShipping").innerHTML = "Total: " + text;
  document.getElementById("grandTotal").innerHTML =
    "Plus 15% VAT: " + grandTotal;
}

//Discount coupon alerts
function validateCoupon() {
  var myRe = "LUCKY100";
  var coupon = myRe.trim();
  var input = document.getElementById("in").value;
  if (input == coupon) {
    document.getElementById("message").innerHTML =
      "Coupon applied! R" + calculate();
    document.getElementById("err").innerHTML = "";
    return true;
  } else {
    document.getElementById("err").innerHTML = "Invalid coupon";
    document.getElementById("message").innerHTML = "";
    return false;
  }
}

//Apply discount coupon
function calculate() {
  var newgrandTotal = grandTotal.replace(/R/g, "");
  return (newgrandTotal / 2).toFixed(2);
}

// For invoice number
var invoice;
function invoiceNumber() {
  invoice = Math.floor(Math.random() * 1000) + 1;
  return invoice;
}

// Place order button - displays alert with invoice number - if there's anything in cart.
function checkoutAlert() {
  if (shoppingCart.totalCart() > 0) {
    alert(
      "Thanks for placing your order. \n" +
        "Your grand total is R" +
        calculate() +
        "\n" +
        "Your order number is " +
        invoiceNumber() +
        "."
    );
  } else {
    alert("Nothing in your cart just yet.");
  }
}

// End of cart section
/*==================================================================*/
/*==================================================================*/

//For contact form
(function ($) {
  "use strict";

  /*==================================================================
    [ Validate after type ]*/
  $(".validate-input .input100").each(function () {
    $(this).on("blur", function () {
      if (validate(this) == false) {
        showValidate(this);
      } else {
        $(this).parent().addClass("true-validate");
      }
    });
  });

  /*==================================================================
    [ Validate ]*/
  var input = $(".validate-input .input100");

  $(".validate-form").on("submit", function () {
    var check = true;

    for (var i = 0; i < input.length; i++) {
      if (validate(input[i]) == false) {
        showValidate(input[i]);
        check = false;
      }
    }

    return check;
  });

  $(".validate-form .input100").each(function () {
    $(this).focus(function () {
      hideValidate(this);
      $(this).parent().removeClass("true-validate");
    });
  });

  function validate(input) {
    if ($(input).attr("type") == "email" || $(input).attr("name") == "email") {
      if (
        $(input)
          .val()
          .trim()
          .match(
            /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
          ) == null
      ) {
        return false;
      }
    } else {
      if ($(input).val().trim() == "") {
        return false;
      }
    }
  }

  function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass("alert-validate");

    $(thisAlert).append('<span class="btn-hide-validate">&#xf136;</span>');
    $(".btn-hide-validate").each(function () {
      $(this).on("click", function () {
        hideValidate(this);
      });
    });
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();
    $(thisAlert).removeClass("alert-validate");
    $(thisAlert).find(".btn-hide-validate").remove();
  }
})(jQuery);
