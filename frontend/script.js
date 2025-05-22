const form = document.getElementById("playerForm");
const roleSelect = document.getElementById("role");
const paymentSelect = document.getElementById("paymentMethod");
const qrImage = document.getElementById("qrImage");
const receiptUpload = document.getElementById("receiptUpload");

// Create a message element
const feeMsg = document.createElement("p");
feeMsg.style.color = "yellow";
feeMsg.style.fontWeight = "bold";
form.insertBefore(feeMsg, paymentSelect);

roleSelect.addEventListener("change", () => {
  if (roleSelect.value === "player") {
    feeMsg.textContent = "You have to pay ₹200.";
  } else if (roleSelect.value === "owner") {
    feeMsg.textContent = "You have to pay ₹2000.";
  } else {
    feeMsg.textContent = "";
  }
});

paymentSelect.addEventListener("change", () => {
  if (paymentSelect.value === "online") {
    qrImage.style.display = "block";
    receiptUpload.style.display = "block";
    downloadQR.style.display = "inline-block";
  } else {
    qrImage.style.display = "none";
    receiptUpload.style.display = "none";
    downloadQR.style.display = "none";
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const nickName = document.getElementById("nickName").value;
  const phone = document.getElementById("phone").value;
  const role = roleSelect.value;
  const paymentMethod = paymentSelect.value;
  const playerType = document.getElementById("playerType").value;
  const receipt = receiptUpload.files[0];

  // Create FormData object to send the form data, including the file
  const formData = new FormData();
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("nickName", nickName);
  formData.append("phone", phone);
  formData.append("role", role);
  formData.append("paymentMethod", paymentMethod);
  formData.append("playerType", playerType);
  if (receipt) formData.append("receipt", receipt);

  // Send data to the backend
  fetch("https://tournament-registration-2.onrender.com/register", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      // Display success message
      document.getElementById("successMsg").textContent = data.message;
      alert(data.message);
      form.reset();
      feeMsg.textContent = "";
      qrImage.style.display = "none";
      receiptUpload.style.display = "none";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    });
});
