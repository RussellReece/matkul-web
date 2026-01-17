const API_URL = "https://script.google.com/macros/s/AKfycbysZrz0hqkkGYpOBdlwy66KxoINi9iCfuNyIc4FfLmPNoUQkd-tNXaUTSJQxP3KjCOiDg/exec";

async function loadContacts() {
  const table = document.getElementById("contactsTable");

  table.innerHTML =
    "<tr><td colspan='4' align='center'><img src='loading.gif' height='40px' /></td></tr>";

  const result = await fetch(`${API_URL}?action=list`);
  const data = await result.json();

  table.innerHTML = "";
  data.forEach((contact) => {
    const row = `
        <tr>
            <td>${contact.name}</td>
            <td>${contact.phone}</td>
            <td>${contact.email}</td>
            <td>
                <button onclick="editContact(${contact.id}, '${contact.name}', '${contact.phone}', '${contact.email}')">Edit</button>
                <button onclick="deleteContact(${contact.id})">Delete</button>
            </td>
        </tr>
        `;
    table.innerHTML += row;
  });
}

// ini load pertama
loadContacts();

async function submitForm() {
  event.preventDefault();
  const form = document.forms["contactForm"];
  const button = document.getElementById("submit");
  const id = form["id"].value;
  const name = form["name"].value;
  const phone = form["phone"].value;
  const email = form["email"].value;
  button.value = "Loading...";
  button.setAttribute("disabled", true);
  let url = id ? `${API_URL}?action=update` : `${API_URL}?action=create`;

  await fetch(url, {
    method: "POST",
    body: JSON.stringify({ id, name, phone, email }),
  });

  alert("saved");
  form.reset();
  button.value = "Simpan";
  button.removeAttribute("disabled");
  loadContacts();
}

async function deleteContact(id) {
  if (!confirm("Hapus kontak ini ?")) return;

  await fetch(`${API_URL}?action=delete&id=${id}`, { method: "POST" });

  alert("deleted");
  loadContacts();
}

function editContact(id, name, phone, email) {
  const form = document.forms["contactForm"];
  form["id"].value = id;
  form["name"].value = name;
  form["phone"].value = phone;
  form["email"].value = email;
}