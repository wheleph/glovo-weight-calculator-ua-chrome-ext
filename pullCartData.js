chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var cartData = $(".cart-product").map(function() {
      var amountText = $(this).find(".cart-product__amount").text()
      var productNameText = $(this).find(".cart-product__name").text()
      return {
        amountText: amountText,
        productNameText: productNameText
      }
    }).get();
    sendResponse({cartData: cartData})
  }
);
