let step = 0;
let payee = 0;

let formatUSD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

let formatGBP = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'GBP',
});

let formatEUR = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
});

let formatINR = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'INR',
});

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function getOptionIndex(selectElement, value) {
  let options = selectElement.options;
  index = 0;
  for (let option of options) {
    if (option.textContent === value) {
      return index;
    }
    index++;
  }
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

  let listItem = document.createElement("li");
  listItem.appendChild(stepForm);

  // It seems that slist is designed to be called only once, 
  // if you use it multiple times you need to remove the event listeners first
  // https://stackoverflow.com/questions/19469881/remove-all-event-listeners-of-specific-type

  let allListItems = document.querySelectorAll("#sortlist li");

  allListItems.forEach(el => {
    el.removeAttribute("draggable");
    elClone = el.cloneNode(true);
    el.parentNode.replaceChild(elClone, el);
  });

  document.querySelector("#sortlist").appendChild(listItem);
  slist("sortlist");
  step++;
}

function removeStepForm(el) {
  const index = el.id.replace("js-trash", "");
  document.querySelector(`#js-step${index}`).remove();
  step--;

  // rename all steps and buttons so numbers match (no gaps)

  let steps = document.querySelectorAll("#js-form-area .js-addstep-form");

  steps.forEach((el, index) => {
    
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
      table.querySelector(".js-payeetable-type").textContent = select.options[select.selectedIndex].textContent;

      insertAfter(table, el);
    } else { // fix previous row
      let simButton = document.createElement('button');
      simButton.id = `js-payee-fix${payee-1}`;
      fixPayee(simButton);
    }

    let row = document.querySelector("#js-payeerow-template");

    // required as a reference for removal / adding
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
  let row = document.querySelector(`#js-payee${index}`);

  // if the last row then delete the table
  let tbody = row.parentElement;

  if (tbody.childElementCount === 1) {
    let index = tbody.id.replace("js-payee-table-body", "");
    let table = document.querySelector(`#js-payee-table${index}`);
    table.remove();
  }

  row.remove();
}

function editPayee(el) {
  let index = el.id.replace("js-edit", "");
  let row = document.querySelector(`#js-payee${index}`);

  let payeeName = row.querySelector(".js-payee-name").textContent;
  let payeeAccount = row.querySelector(".js-payee-ac").textContent;
  let payeeType = row.querySelector(".js-payee-type").textContent;
  let payeeAmount = row.querySelector(".js-payee-amount").textContent;

  let editRow = document.querySelector("#js-payeerow-template").cloneNode(true);

  // required as a reference for removal / adding
  editRow.querySelector(".js-payeerow").id = `js-payee${index}`;
  editRow.querySelector(".js-remove").id = `js-remove${index}`;
  editRow.querySelector(".js-payee-fix").id = `js-payee-fix${index}`;

  editRow.querySelector(".js-payee-name").setAttribute('value', payeeName);
  editRow.querySelector(".js-payee-ac").setAttribute('value', payeeAccount);

  let select = editRow.querySelector(".js-payee-type");
  let selectedIndex = getOptionIndex(select, payeeType);
  select.options[selectedIndex].setAttribute('selected', "true");
  editRow.querySelector(".js-payee-amount").setAttribute('value', payeeAmount);

  row.innerHTML = editRow.innerHTML;
}

function fixPayee(el) {
  let index = el.id.replace("js-payee-fix", "");
  let row = document.querySelector(`#js-payee${index}`);

  let typeIndex = row.querySelector(".js-payee-type").selectedIndex;

  // type is a required field
  if (typeIndex > 0) {

    let payeeName = row.querySelector(".js-payee-name").value;
    let payeeAccount = row.querySelector(".js-payee-ac").value;

    let select = row.querySelector(".js-payee-type");
    let payeeType = select.options[select.selectedIndex].textContent;

    let payeeAmount = row.querySelector(".js-payee-amount").value;

    let fixedRow = document.querySelector("#js-payeerow-fixed-template").cloneNode(true);

    // required as a reference for removal / edit
    fixedRow.querySelector(".js-payeerow").id = `js-payee${index}`;
    fixedRow.querySelector(".js-remove").id = `js-remove${index}`;
    fixedRow.querySelector(".js-edit").id = `js-edit${index}`;

    fixedRow.querySelector(".js-payee-name").textContent = payeeName;
    fixedRow.querySelector(".js-payee-ac").textContent = payeeAccount;
    fixedRow.querySelector(".js-payee-type").textContent = payeeType;
    fixedRow.querySelector(".js-payee-amount").textContent = payeeAmount;

    row.innerHTML = fixedRow.innerHTML;
  }
  else
  {
    // checking whether typeIndex is undefined, which means row is already fixed
    // so no need to show alert

    if (typeof typeIndex !== "undefined" && typeIndex !== null) {
      showAlert("Type is a required field.", row.parentElement);
    }
  }
}

function saveStep(el) {
  let index = el.id.replace("js-save", "");

  let step = document.querySelector(`#js-step${index}`);
  let typeIndex = step.querySelector(".js-step-type").selectedIndex;
  let typeValue = step.querySelector(".js-step-type").value;

  // type is a required field
  if (typeIndex > 0) {
    
    let cap = step.querySelector(".js-step-cap").value;

    if (isNaN(cap)) {
      showAlert("Cap must be a number.", step);
    } else {
      
      switch(document.querySelector("#currency").value) {
        case "USD":
          cap = formatUSD.format(cap);
          break;
        case "GBP":
          cap = formatGBP.format(cap);
          break;
        case "EUR":
          cap = formatEUR.format(cap);
          break;
        case "INR":
          cap = formatINR.format(cap);
          break;
        default:
          cap = formatUSD.format(cap);
          break;
      }
      
      let description = step.querySelector(".js-step").value;
      let fixedStep = document.querySelector("#js-addstep-fixed-template").cloneNode(true);

      fixedStep.querySelector(".js-edit").id = `js-edit${index}`;
    
      fixedStep.querySelector(".js-step-description").innerText = description;
      fixedStep.querySelector(".js-step-cap").innerText = cap;
      fixedStep.querySelector(".js-step-type-index").innerText = typeIndex;
      fixedStep.querySelector(".js-step-type-value").innerText = typeValue;
    
      let table = step.querySelector("table");
    
      step.innerHTML = fixedStep.innerHTML;
      if (table !== null) {
        step.querySelector(".js-step-details").append(table);
      } else {
        step.querySelector(".js-step-details").append("No payees added.");
      }
    }
  } else {
    showAlert("Type is a required field.", step);
  }
}

function editStep(el) {
  let index = el.id.replace("js-edit", "");
  let row = document.querySelector(`#js-step${index}`);

  let cap = row.querySelector(".js-step-cap").textContent;
  let description = row.querySelector(".js-step-description").textContent;
  let stepTypeIndex = row.querySelector(".js-step-type-index").textContent;

  let stepForm = document.querySelector("#js-addstep-template").firstElementChild.cloneNode(true);

  stepForm.id = `js-step${index}`;

  // set ids so that we can associate the step with the button clicked

  stepForm.querySelector(".js-trash").id = `js-trash${index}`;
  stepForm.querySelector(".js-add-payee").id = `js-add${index}`;
  stepForm.querySelector(".js-save-step").id = `js-save${index}`;

  stepForm.querySelector(".js-step").setAttribute('value', description);
  stepForm.querySelector(".js-step-cap").setAttribute('value', cap);

  let select = stepForm.querySelector(".js-step-type");
  select.options[stepTypeIndex].setAttribute('selected', "true");

  row.innerHTML = stepForm.innerHTML;
}

function saveAgreement(el) {
  const currencyIndex = document.querySelector("#currency").selectedIndex;
  
  if (currencyIndex > 0) {

    let savedAgreement = new Agreement(
      document.querySelector("#name").value,
      document.querySelector("#currency").value,
      document.querySelector("#pointer").value,
      document.querySelector("#contact").value,
      document.querySelector("#email").value,
      document.querySelector("#description").value
    );

    savedAgreement.addLimit(
      document.querySelector("#period-repeat").value,
      document.querySelector("#period-unit").value,
      new Date(document.querySelector("#start").value), 
      new Date(document.querySelector("#end").value)
    );

    const steps = document.querySelectorAll(".js-addstep-form");

    steps.forEach((step, index) => {
      
      // ignore the step template (which doesn't have an id)
      if (step.id.startsWith("js-step") === true) {
        let agreementStep = new Step(
          step.querySelector(".js-step-description").innerText,
          step.querySelector(".js-step-type-value").innerText,
          step.querySelector(".js-step-cap").innerText
        )
        console.log(agreementStep);
        const payees = step.querySelectorAll("tbody tr");
        console.log(payees);

        payees.forEach((payee, index) => {
          let agreementPayee = new Payee(
            payee.querySelector(".js-payee-name").innerText,
            payee.querySelector(".js-payee-ac").innerText,
            payee.querySelector(".js-payee-type").innerText,
            payee.querySelector(".js-payee-amount").innerText
          )
          console.log(agreementPayee);
          agreementStep.addPayee(agreementPayee);
        });

        savedAgreement.addStep(agreementStep);
      }
    });

    console.log(savedAgreement);
  } else {
    showAlert("Currency is a required field.", document.querySelector("#sortlist"));
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
  constructor(name, paymentAddress, paymentType, amount) {
    this.name = name;
    this.paymentAddress = paymentAddress;
    this.paymentType = paymentType;
    this.paymentAmount = amount;
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
Half done. Works for top level but not nested level. Otherwise switch to  https://lukasoppermann.github.io/html5sortable/index.html - which handles nesting - and also table rows. */

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
