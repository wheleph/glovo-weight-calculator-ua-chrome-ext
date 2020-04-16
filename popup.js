const WEIGHT_UNKNOWN = -1

function isWeightUnknown(weight) {
  return weight == WEIGHT_UNKNOWN
}

function determineAmount(amountText) {
  // Cut the 'x' character at the end
  return parseInt(amountText.slice(0, amountText.length - 1))
}

function determineWeightGrams(productNameText) {
  const GR_PATTERN = /^.*\s(\d+)Г.*$/i
  const KG_PATTERN = /^.*\s(\d+)КГ.*$/i
  const ML_PATTERN = /^.*\s(\d+)МЛ.*$/i
  const L_PATTERN = /^.*\s(\d+)Л.*$/i

  if (GR_PATTERN.test(productNameText)) {
    var result = GR_PATTERN.exec(productNameText)
    return parseInt(result[1])
  } if (KG_PATTERN.test(productNameText)) {
    var result = KG_PATTERN.exec(productNameText)
    return 1000 * parseInt(result[1])
  } else if (ML_PATTERN.test(productNameText)) {
    var result = ML_PATTERN.exec(productNameText)
    return parseInt(result[1])
  } else if (L_PATTERN.test(productNameText)) {
    var result = L_PATTERN.exec(productNameText)
    return 1000 * parseInt(result[1])
  } else {
    return WEIGHT_UNKNOWN
  }
}

function formatProductWeightKg(amount, weight) {
  if (isWeightUnknown(weight)) {
    return "?"
  } else {
    return (amount * weight / 1000.0).toString()
  }
}

function formatTotalWeight(cartData) {
  var totalWeight = 0;
  var containUnknownProductWeight = false;

  for (p of cartData) {
    if (isWeightUnknown(p.weightGrams)) {
      containUnknownProductWeight = true
    } else {
      totalWeight += p.amount * p.weightGrams
    }
  }

  if (!containUnknownProductWeight) {
      return (totalWeight / 1000.0).toString() + " КГ"
  } else if (totalWeight != 0) {
      return (totalWeight / 1000.0).toString() + " КГ + ?"
  } else {
      return "?";
  }
}

// let actionButton = document.getElementById('action_button');

// actionButton.onclick = function() {
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {
    var rawCartData = response.cartData
    console.log(rawCartData.length)
    rawCartData.forEach(function(value, index, array) {
      console.log(value.amountText + " " + value.productNameText)
    })

    var cartData = rawCartData.map(function(p) {
      var amount = determineAmount(p.amountText)
      var weightGrams = determineWeightGrams(p.productNameText)
      return {
        productNameText: p.productNameText,
        amount: amount,
        weightGrams: weightGrams
      }
    })

    var productGridData = cartData.map(function(p) {
      return {
        productNameText: p.productNameText,
        amountText: `${p.amount.toString()} шт.`,
        totalWeightKgText: formatProductWeightKg(p.amount, p.weightGrams)
      }
    })

    $("#productGrid").jsGrid({
        width: "100%",
        height: "200px",

        inserting: false,
        editing: false,
        sorting: false,
        paging: false,

        data: productGridData,

        fields: [
            { title: "К-ть", name: "amountText" },
            { title: "Продукт", name: "productNameText" },
            { title: "Загальна вага, КГ" , name: "totalWeightKgText" }
        ]
    });

    $("#totalWeightLine").text("Всього: " + formatTotalWeight(cartData))
  })
});
// }
