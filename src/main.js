import "./css/index.css"
import IMask from "imask"
const ccbgcolor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccbgcolor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const cclogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setcardtype(type) {
  const colors = {
    visa: ["#436D99", "#2d57f2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "grey"],
  }
  ccbgcolor01.setAttribute("fill", colors[type][0])
  ccbgcolor02.setAttribute("fill", colors[type][1])
  cclogo.setAttribute("src", `cc-${type}.svg`)
}

// cvc
const cvcdom = document.getElementById("security-code")
const cvcmask = {
  mask: "0000",
}
const cvcmasked = IMask(cvcdom, cvcmask)

// expiration date
const expirationDate = document.getElementById("expiration-date")
const expirationdatepatern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationdatemasked = IMask(expirationDate, expirationdatepatern)

const cardnumber = document.getElementById("card-number")
const cardnumberpatern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicmasked) {
    const number = (dynamicmasked.value + appended).replace(/\D/g, "")
    const foundmask = dynamicmasked.compiledMasks.find(({ regex }) =>
      number.match(regex)
    )
    console.log(foundmask)

    return foundmask
  },
}
const cardnumbermasked = IMask(cardnumber, cardnumberpatern)
// svg element
const addbutton = document.querySelector("#add-card")
addbutton.addEventListener("click", () => {
  alert("card added successfully")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const cardholder = document.querySelector("#card-holder")
cardholder.addEventListener("input", (event) => {
  const ccholder = document.querySelector(".cc-holder .value")

  ccholder.innerHTML =
    cardholder.value.length === 0 ? "FULANO DA SILVA" : cardholder.value
})

cvcmasked.on("accept", () => {
  updatesecuritycode(cvcmasked.value)
})

function updatesecuritycode(code) {
  const ccsecurity = document.querySelector(".cc-security .value")

  ccsecurity.innerText = code.length === 0 ? "123" : code
}

cardnumbermasked.on("accept", () => {
  const cardtype = cardnumbermasked.masked.currentMask.cardtype
  setcardtype(cardtype)
  updatecardnumber(cardnumbermasked.value)
})

function updatecardnumber(number) {
  const ccnumber = document.querySelector(".cc-number")

  ccnumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationdatemasked.on("accept", () => {
  updateexpirationdate(expirationdatemasked.value)
})

function updateexpirationdate(date) {
  const ccexpiration = document.querySelector(".cc-extra .value")

  ccexpiration.innerText = date.length === 0 ? "02/32" : date
}
