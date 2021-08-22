let step = 0;

function addStepForm() {
  let stepForm = document
    .getElementById("js-addstep-template")
    .firstElementChild.cloneNode(true);

  stepForm.style.display = "block";
  stepForm.id = `js-step${step}`;
  stepForm.getElementsByClassName("gg-trash")[0].id = `js-trash${step}`;
  document.getElementById("js-form-area").appendChild(stepForm);
  step++;
}

function removeStepForm(el) {
  let index = el.id.replace("js-trash", "");
  document.getElementById(`js-step${index}`).remove();
  step--;
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
