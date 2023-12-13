const profile = document.getElementById("profile-pic");
const form_list = document.querySelectorAll("form");
const submit_buttom = document.querySelectorAll(".submit");
const username = document.getElementById("name");
const mobile = document.querySelectorAll(".mobile");
const mobile_transfer = document.getElementById("mobile-transfer");
const bank_transfer = document.getElementById("bank-transfer");
const self_transfer = document.getElementById("self-transfer");
const check_bal = document.getElementById("check-balance");
const allData = document.getElementById("all-data");
let response,
  payment_statement,
  loading_img,
  sign_in = localStorage.getItem("sign-in") || "";

let wait_sec = Math.floor(Math.random() * 10);
if (wait_sec == 0) wait_sec = 3;

profile.addEventListener("click", () => {
  if (sign_in == "") {
    form_list[0].style.display = "flex";
    allData.style.display = "none";
  } else alert("First logout current profile...");
});

submit_buttom[0].addEventListener("click", (event) => {
  event.preventDefault();
  if (mobile[0].value.length == 10 && username.value != "") {
    verifyUserDetails(username.value, mobile[0].value);
    sign_in = localStorage.setItem("sign-in", username.value);
    window.location.reload();
  } else alert("Invalid Details");
});

mobile_transfer.addEventListener("click", () => {
  if (sign_in !== "") {
    form_list[1].style.display = "flex";
    allData.style.display = "none";
  } else alert("Please sign in first.");
});

submit_buttom[1].addEventListener("click", (event) => {
  event.preventDefault();
  if (mobile[1].value !== "") loadingPayment();
  else alert("Please give correct input.");
  response = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mobile[1].value.length == 10) resolve(mobile[1].value);
      else reject("Invalid Mobile Number");
    }, wait_sec * 1000);
  });
  response
    .then((data) => successPayment(data))
    .catch((err) => failedPayment(err));
});

bank_transfer.addEventListener("click", () => {
  if (sign_in !== "") {
    form_list[2].style.display = "flex";
    allData.style.display = "none";
  } else alert("Please sign in first");
});

submit_buttom[2].addEventListener("click", (event) => {
  event.preventDefault();
  let temp = false,
    acc_num = document.getElementById("acc").value;
  if (acc_num !== "" && document.getElementById("ifsc").value !== "") {
    loadingPayment();
    temp = true;
  } else alert("All fields are mandatory.");

  response = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (acc_num.length == 14 && temp) resolve(acc_num);
      else reject("Check the inputs again.");
    }, wait_sec * 1000);
  });
  response
    .then((data) => successPayment(data))
    .catch((err) => failedPayment(err));
});

self_transfer.addEventListener("click", () => {
  if (sign_in !== "") {
    form_list[3].style.display = "flex";
    allData.style.display = "none";
  } else alert("Please sign in first");
});

submit_buttom[3].addEventListener("click", (event) => {
  event.preventDefault();
  let temp = false,
    from_acc_num = document.getElementById("from-acc").value,
    to_acc_num = document.getElementById("to-acc").value,
    from_ifsc = document.getElementById("from-ifsc").value,
    to_ifsc = document.getElementById("to-ifsc").value;

  if (
    from_acc_num !== "" &&
    from_ifsc !== "" &&
    to_acc_num !== "" &&
    to_ifsc !== "" &&
    from_acc_num != to_acc_num
  ) {
    loadingPayment();
    temp = true;
  } else alert("Invalid Inputs.");

  response = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (from_acc_num.length == 14 && to_acc_num.length == 14 && temp)
        resolve(to_acc_num);
      else reject("Check the inputs again.");
    }, wait_sec * 1000);
  });
  response
    .then((data) => successPayment(data))
    .catch((err) => failedPayment(err));
});

function loadingPayment() {
  const gif = "https://media.tenor.com/JBgYqrobdxsAAAAi/loading.gif";
  const body = document.querySelector("body");
  body.innerHTML = null;
  body.style.background = "white";
  payment_statement = document.createElement("p");
  payment_statement.innerText = "Please wait while we process the transaction.";
  payment_statement.style.color = "red";
  payment_statement.style.fontSize = "21px";
  loading_img = document.createElement("img");
  loading_img.setAttribute("src", gif);
  body.append(payment_statement, loading_img);
}

function successPayment(data) {
  const body = document.querySelector("body");
  body.innerHTML = null;
  const done_img = document.createElement("img");
  done_img.setAttribute(
    "src",
    "https://i.pinimg.com/originals/b0/e0/e9/b0e0e9129ef97614535d929a43831956.gif"
  );
  done_img.className = "done-img";
  payment_statement.innerText = `Payment successfull. Details are below.`;
  const date = new Date();
  const details = {
    to: `To: ${data}`,
    time: {
      hr: `${date.getHours()}: `,
      min: `${date.getMinutes()}: `,
      sec: `${date.getSeconds()}`,
    },
    date: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
    transaction_num: `Transaction ID: ${
      Math.floor(Math.random() * 10) * 987456 + 234987
    }`,
  };
  const trans_detail = document.createElement("div");
  trans_detail.className = "trans-details";
  const time = document.createElement("div");
  const to = document.createElement("p");
  to.innerText = details.to;
  const hr = document.createElement("p");
  hr.innerText = details.time.hr;
  const min = document.createElement("p");
  min.innerText = details.time.min;
  const sec = document.createElement("p");
  sec.innerText = details.time.sec;

  time.append("Time: ", hr, min, sec);
  time.className = "time";

  const trans_date = document.createElement("p");
  trans_date.innerHTML = "Date: " + details.date;

  const t_num = document.createElement("p");
  t_num.innerText = details.transaction_num;
  const qr = document.createElement("img");
  qr.setAttribute(
    "src",
    "https://media.istockphoto.com/id/1347277567/vector/qr-code-sample-for-smartphone-scanning-on-white-background.jpg?s=612x612&w=0&k=20&c=PYhWHZ7bMECGZ1fZzi_-is0rp4ZQ7abxbdH_fm8SP7Q="
  );
  qr.className = "qr";

  trans_detail.append(to, time, trans_date, t_num, qr);
  document
    .querySelector("body")
    .append(payment_statement, done_img, trans_detail);
}

function failedPayment(err) {
  const failed_gif = "https://epay.upnm.edu.my/assets/img/cards/fail_anim.gif";

  payment_statement.style.color = "blue";
  payment_statement.style.fontSize = "21px";

  const errStatement = document.createElement("p");
  errStatement.innerText = err;
  errStatement.style.color = "red";

  const img = document.createElement("img");
  img.setAttribute("src", failed_gif);
  img.style.borderRadius = "100%";
  document.querySelector("body").innerHTML = null;
  payment_statement.innerText = "OOPS!! Something went wrong.";

  const errMsg = document.createElement("div");
  errMsg.className = "err";

  errMsg.append(payment_statement, errStatement);
  document.querySelector("body").append(errMsg, img);
}

function verifyUserDetails(username, mobile) {
  const userDetails = {
    username,
    mobile,
  };
  form_list[0].style.display = "none";
  allData.style.display = "block";
  alert(`Welcome ${userDetails.username}`);
}

function checkBalance(data) {
  const balance = Math.floor(Math.random() * 10) * 1234 + 234;
  const balance_element = document.createElement("h1");
  balance_element.innerText = `Available Balance: 💲 ${balance}`;
  document.querySelector("body").innerHTML = null;
  balance_element.className = "bal";
  document.querySelector("body").append(balance_element);
  return balance;
}

check_bal.addEventListener("click", () => {
  let temp = false;
  if (sign_in !== "") {
    loadingPayment();
    temp = true;
  } else alert("Please sign in first");

  response = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (temp) resolve("Done...");
      else reject("Something went wrong. Please try again...");
    }, wait_sec * 1000);
  });
  response
    .then((data) => checkBalance(data))
    .catch((err) => failedPayment(err));
});

const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  sign_in = "";
  localStorage.setItem("sign-in", sign_in);
  logout.style.display = "none";
});

if (sign_in === "") logout.style.display = "none";
