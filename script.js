let step = 0;
let payee = 0;

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addStepForm() {
  const stepForm = document
    .querySelector("#js-addstep-template")
    .firstElementChild.cloneNode(true);

  stepForm.id = `js-step${step}`;

  // set ids so that we can associate the step with the button clicked

  stepForm.querySelector(".js-trash").id = `js-trash${step}`;
  stepForm.querySelector(".js-add-payee").id = `js-add${step}`;
  stepForm.querySelector(".js-save-step").id = `js-save${step}`;

  document.querySelector("#js-form-area").appendChild(stepForm);
  step++;
}

function removeStepForm(el) {
  const index = el.id.replace("js-trash", "");
  document.querySelector(`#js-step${index}`).remove();
  step--;

  // rename all steps and buttons so numbers match (no gaps)

  let steps = document.querySelectorAll("#js-form-area .js-addstep-form");


  steps.forEach((el, index) => {
    console.log(el);
    el.id = `js-step${index}`;
    el.querySelector(".js-trash").id = `js-trash${index}`;
    el.querySelector(".js-add-payee").id = `js-add${index}`;
    el.querySelector(".js-save-step").id = `js-save${index}`;

    // TODO: rename step description in form if it exists

  });
}

function addPayee(el) {
  let index = el.id.replace("js-add", "");
  let step = document.querySelector(`#js-step${index}`);

  let typeIndex = step.querySelector(".js-step-type").selectedIndex;

  // type is a required field
  if (typeIndex > 0) {

    // create table if it doesn't exist

    let table = step.querySelector("table");

    if (typeof table === "undefined" || table === null) {
      table = document.querySelector("#js-payeetable-template").firstElementChild.cloneNode(true);
      table.id = `js-payee-table${index}`;
      table.querySelector("tbody").id = `js-payee-table-body${index}`;

      // reflect the Step type in the Payee type column

      let select = step.querySelector(".js-step-type");
      table.querySelector(".js-payeetable-type").textContent =
        select.options[select.selectedIndex].textContent;

      insertAfter(table, el);
    }

    let row = document.querySelector("#js-payeerow-template");

    row.querySelector(".js-payeerow").id = `js-payee${payee}`;
    row.querySelector(".js-remove").id = `js-remove${payee}`;
    row.querySelector(".js-payee-fix").id = `js-payee-fix${payee}`;

    payee++;

    let tbody = table.querySelector("tbody");
    tbody.innerHTML += row.innerHTML;
  } else {
    showAlert("Type is a required field.", step);
  }
}

function removePayee(el) {
  let index = el.id.replace("js-remove", "");
  let row = document.getElementById(`js-payee${index}`);

  // if the last row then delete the table
  let tbody = row.parentElement;

  if (tbody.childElementCount === 1) {
    let index = tbody.id.replace("js-payee-table-body", "");
    let table = document.getElementById(`js-payee-table${index}`);
    table.remove();
  }

  row.remove();
}

function fixPayee(el) {
  let index = el.id.replace("js-payee-fix", "");
  let row = document.getElementById(`js-payee${index}`);

  let payeeName = row.getElementsByClassName("payee-name")[0].value;
  let payeeAccount = row.getElementsByClassName("payee-ac")[0].value;
  let payeeType = row.getElementsByClassName("payee-type")[0].value;
  let payeeAmount = row.getElementsByClassName("payee-amount")[0].value;

  let fixedRow = document
    .getElementById("js-payeerow-fixed-template")
    .cloneNode(true);

  // required as a reference for removal
  fixedRow.getElementsByClassName("js-payeerow")[0].id = `js-payee${index}`;
  fixedRow.getElementsByClassName("js-remove")[0].id = `js-remove${index}`;

  fixedRow.getElementsByClassName("js-payee-name")[0].textContent = payeeName;
  fixedRow.getElementsByClassName("js-payee-ac")[0].textContent = payeeAccount;
  fixedRow.getElementsByClassName("js-payee-type")[0].textContent = payeeType;
  fixedRow.getElementsByClassName("js-payee-amount")[0].textContent =
    payeeAmount;

  row.innerHTML = fixedRow.innerHTML;
}

function saveStep(el) {
  let index = el.id.replace("js-save", "");

  let step = document.querySelector(`#js-step${index}`);
  let typeIndex = step.querySelector(".js-step-type").selectedIndex;

  // type is a required field
  if (typeIndex > 0) {
    let description = step.getElementsByClassName("js-step")[0].value;

    let cap = step.getElementsByClassName("js-step-cap")[0].value;
  
    let fixedStep = document
      .getElementById("js-addstep-fixed-template")
      .cloneNode(true);
  
    fixedStep.getElementsByClassName("js-step-number")[0].innerText = `Step ${Number(index) + 1}`;
    fixedStep.getElementsByClassName("js-step-description")[0].innerText = description;
    fixedStep.getElementsByClassName("js-step-cap")[0].innerText = cap;
  
    let table = step.getElementsByTagName("table")[0];
  
    step.innerHTML = fixedStep.innerHTML;
    step.getElementsByClassName("js-step-details")[0].append(table);
  } else {
    showAlert("Type is a required field.", step);
  }
}

function showAlert(message, container) {
  // create div
  const div = document.createElement("div");
  // add classes
  div.className = `alert`;
  // add text
  div.appendChild(document.createTextNode(message));
  // Get parent
  //const container = document.querySelector(".container");
  // get form
  const form = document.querySelector("#agreement-form");
  // insert alert
  //container.insertBefore(div, form);
  container.appendChild(div);
  // timeout after 3 secs
  setTimeout(function () {
    document.querySelector(".alert").remove();
  }, 3000);
}

class Agreement {
  constructor(name, currency, address, contactName, contactEmail, description) {
    this.name = name;
    this.currency = currency;
    this.address = address;
    this.contactName = contactName;
    this.contactEmail = contactEmail;
    this.description = description;

    this.repeatFor = null;
    this.unit = null;
    this.startDate = null;
    this.endDate = null;

    this.steps = new Array();

    this.addLimit = function (repeatFor, unit, startDate, endDate) {
      this.repeatFor = repeatFor;
      this.unit = unit;
      this.startDate = startDate;
      this.endDate = endDate;
    };

    this.addStep = function (step) {
      this.steps.push(step);
    };
  }
}

class Step {
  constructor(description, type, cap) {
    this.description = description;
    this.type = type;
    this.cap = cap;

    this.payees = new Array();

    this.addPayee = function (payee) {
      this.payees.push(payee);
    };
  }
}

class Payee {
  constructor(name, paymentAddress, paymentType, percentage) {
    this.name = name;
    this.paymentAddress = paymentAddress;
    this.paymentType = paymentType;
    this.paymentPercentage = percentage;
  }
}

let myAgreement = new Agreement(
  "Artists United",
  "USD",
  "$ilp.example.com/pN3K3rKULNQh",
  "Artists United",
  null,
  "Founding agreement for film studio coop"
);

myAgreement.addLimit(1, "year", new Date(2021, 8, 19), null);

let step1 = new Step("Bonus for the studio founders", "%", 1000000);

let payee1 = new Payee("Chaplin", "$payee.example.com/charles", "ilp", 25);
step1.addPayee(payee1);

let payee2 = new Payee("Pickford", "$payee.example.com/mary", "ilp", 25);
step1.addPayee(payee2);

let payee3 = new Payee("Griffith", "$payee.example.com/melanie", "ilp", 25);
step1.addPayee(payee3);

let payee4 = new Payee("Fairbanks", "$payee.example.com/douglass", "ilp", 25);
step1.addPayee(payee4);

myAgreement.addStep(step1);

let step2 = new Step(null, "fixed", null);

let payee5 = new Payee("Annual Expenses", "ID001", "dbse", "{{expenses}}");
step2.addPayee(payee5);

myAgreement.addStep(step2);

let step3 = new Step("Profit share between founders and charity", "%", null);

let payee6 = new Payee("Chaplin", "$payee.example.com/charles", "ilp", 12.5);
step3.addPayee(payee6);

let payee7 = new Payee("Pickford", "$payee.example.com/mary", "ilp", 12.5);
step3.addPayee(payee7);

let payee8 = new Payee("Griffith", "$payee.example.com/melanie", "ilp", 12.5);
step3.addPayee(payee8);

let payee9 = new Payee("Fairbanks", "$payee.example.com/douglass", "ilp", 12.5);
step3.addPayee(payee9);

let payee10 = new Payee("UNICEF", "$payee.example.com/unicef", "ilp", 50);
step3.addPayee(payee10);

myAgreement.addStep(step3);

console.log(myAgreement);

/* Drag and drop - from https://code-boxx.com/drag-drop-sortable-list-javascript/ 
Half done. Works for top level but not nested level. Q.. as it is parri-parsu, why is 2nd level drag and dropable? Neatness only? Then ditch it. Otherwise switch to  https://lukasoppermann.github.io/html5sortable/index.html - which handles nesting - and also table rows. */

function slist(target) {
  // (A) GET LIST + ATTACH CSS CLASS
  target = document.getElementById(target);
  target.classList.add("slist");

  // (B) MAKE ITEMS DRAGGABLE + SORTABLE
  var items = target.getElementsByTagName("li"),
    current = null;
  for (let i of items) {
    // (B1) ATTACH DRAGGABLE
    i.draggable = true;

    // (B2) DRAG START - YELLOW HIGHLIGHT DROPZONES
    i.addEventListener("dragstart", function (ev) {
      current = this;
      for (let it of items) {
        if (it != current) {
          it.classList.add("hint");
        }
      }
    });

    // (B3) DRAG ENTER - RED HIGHLIGHT DROPZONE
    i.addEventListener("dragenter", function (ev) {
      if (this != current) {
        this.classList.add("active");
      }
    });

    // (B4) DRAG LEAVE - REMOVE RED HIGHLIGHT
    i.addEventListener("dragleave", function () {
      this.classList.remove("active");
    });

    // (B5) DRAG END - REMOVE ALL HIGHLIGHTS
    i.addEventListener("dragend", function () {
      for (let it of items) {
        it.classList.remove("hint");
        it.classList.remove("active");
      }
    });

    // (B6) DRAG OVER - PREVENT THE DEFAULT "DROP", SO WE CAN DO OUR OWN
    i.addEventListener("dragover", function (evt) {
      evt.preventDefault();
    });

    // (B7) ON DROP - DO SOMETHING
    i.addEventListener("drop", function (evt) {
      evt.preventDefault();
      if (this != current) {
        let currentpos = 0,
          droppedpos = 0;
        for (let it = 0; it < items.length; it++) {
          if (current == items[it]) {
            currentpos = it;
          }
          if (this == items[it]) {
            droppedpos = it;
          }
        }
        if (currentpos < droppedpos) {
          this.parentNode.insertBefore(current, this.nextSibling);
        } else {
          this.parentNode.insertBefore(current, this);
        }
      }
    });
  }
}
