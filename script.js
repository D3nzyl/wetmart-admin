var host = "http://localhost:3000" 

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
  }
}
console.log('Query Variable ' + variable + ' not found');
}


/* Login */
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    fetch(host+`/admin/login`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"email": email, "password": password})
      })
      .then(response => {
        return response.json();
      })
      .then(response => {
        if(response.status >= 400 && response.status <= 499) {
            alert(response.message)
        }
        else{
            console.log(response)
          //document.location.href = "homepage.html";
        }
      })
      .catch(error => {
        alert(error.message)
        console.log(error.message)
        console.log(error);
    });
}

/* View all customer & search */
function customer(search){

  var customerTableBody = document.getElementById("customer-table-body");
  console.log(search)
  fetch(host+`/admin/customer?search=`+search)
    .then(response => {
      return response.json();
    })
    .then(response=> {
      var toChange = `
      <table class="table">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
      `;
      for (i=0; i<response.rowCount; i++){
        toChange += 
        `
        <tr>
          <td>`+response.rows[i].customer_id+`</td>
          <td>`+response.rows[i].email+`</td>
          <td>`+response.rows[i].first_name+`</td>
          <td>`+response.rows[i].last_name+`</td>
          <td>`+response.rows[i].mobile_number+`</td>
          <td><div class="view-edit" onclick="editCustomer(`+response.rows[i].customer_id+`)">View/Edit</div></td>
        </tr>
        `
      }
      toChange += 
      `        
        </tbody>
      </table>
      `;
      customerTableBody.innerHTML = toChange ;
    })
    .catch(error => {
      alert(error.message)
      console.log(error.message)
      console.log(error);
    });
}

/* Add Customer */
function addCustomer(){
  const email = document.getElementById("customer-email").value;
  const first_name = document.getElementById("customer-first-name").value;
  const last_name = document.getElementById("customer-last-name").value;
  const postal_code = document.getElementById("customer-postal-code").value;
  const unit_number = document.getElementById("customer-unit-number").value;
  const mobile_number = document.getElementById("customer-mobile-number").value;
  const date_of_birth = document.getElementById("customer-date-of-birth").value;
  const gender = document.getElementById("customer-gender").value;
  const password = document.getElementById("customer-password").value;
  const address = document.getElementById("customer-address").value;

  fetch(host+`/admin/customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"email": email,"first_name": first_name,"last_name": last_name,"postal_code": postal_code, "unit_number": unit_number,"mobile_number": mobile_number,"date_of_birth": date_of_birth,"gender": gender, "password": password, "address": address})
  })
  .then(response => {
    if(response.status == 201){
      alert("Customer has been created!")
      window.location = "./customer.html"
    }
  })
  .catch(error => {
    console.log(error.message)
    console.log(error);
  });
};

/* Redirect to view/edit customer */
function editCustomer(customerId){
  window.location = './editCustomer.html?customer_id='+customerId;
  customer_id = document.getElementById(customer_id);
  customer_id.innerHTML = customer_id;
};

/* View Customer Details */
function viewCustomer(){
  var customer_id = getQueryVariable("customer_id");
  fetch(host+`/admin/view_customer?customer_id=`+customer_id)
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }

    document.getElementById("customer-id").innerHTML = customer_id
    document.getElementById("customer-email").value = response[0].email;
    document.getElementById("customer-first-name").value = response[0].first_name;
    document.getElementById("customer-last-name").value = response[0].last_name;
    document.getElementById("customer-postal-code").value = response[0].postal_code;
    document.getElementById("customer-unit-number").value = response[0].unit_number;
    document.getElementById("customer-mobile-number").value = response[0].mobile_number;
    document.getElementById("customer-date-of-birth").value = formatDate(new Date(response[0].date_of_birth));
    document.getElementById("customer-gender").value = response[0].gender;
    document.getElementById("customer-password").value = response[0].password;
    document.getElementById("customer-address").value = response[0].address;
  
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
}

/* Delete customer */
function deleteCustomer(){
  var customer_id = getQueryVariable("customer_id");
  fetch(host+`/admin/delete_customer?customer_id=`+customer_id, {
    method: 'DELETE'
  })
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }
    alert("Customer "+customer_id+" has been deleted!")
    window.location = "./customer.html"
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
}

/* Update Customer */
function updateCustomer(){

  var customer_id = getQueryVariable("customer_id");
  const email = document.getElementById("customer-email").value;
  const first_name = document.getElementById("customer-first-name").value;
  const last_name = document.getElementById("customer-last-name").value;
  const postal_code = document.getElementById("customer-postal-code").value;
  const unit_number = document.getElementById("customer-unit-number").value;
  const mobile_number = document.getElementById("customer-mobile-number").value;
  const date_of_birth = document.getElementById("customer-date-of-birth").value;
  const gender = document.getElementById("customer-gender").value;
  const password = document.getElementById("customer-password").value;
  const address = document.getElementById("customer-address").value;
  
  fetch(host+`/admin/customer`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"customer_id":customer_id,"email": email,"first_name": first_name,"last_name": last_name,"postal_code": postal_code, "unit_number": unit_number,"mobile_number": mobile_number,"date_of_birth": date_of_birth,"gender": gender, "password": password, "address": address})
  })
  .then(response => {
    if(response.status == 200){
      alert("Customer "+customer_id+" has been updated!")
      window.location = "./customer.html"
    }
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
}

/* View all admin & search */
function admin(search){

  var adminTableBody = document.getElementById("admin-table-body");
  console.log(search)
  fetch(host+`/admin/admin?search=`+search)
    .then(response => {
      return response.json();
    })
    .then(response=> {
      var toChange = `
      <table class="table">
        <thead>
          <tr>
            <th>Admin ID</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile Number</th>
            <th>Position</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
      `;
      for (i=0; i<response.rowCount; i++){
        toChange += 
        `
        <tr>
          <td>`+response.rows[i].admin_id+`</td>
          <td>`+response.rows[i].email+`</td>
          <td>`+response.rows[i].first_name+`</td>
          <td>`+response.rows[i].last_name+`</td>
          <td>`+response.rows[i].mobile_number+`</td>
          <td>`+response.rows[i].position+`</td>
          <td><div class="view-edit" onclick="editAdmin(`+response.rows[i].admin_id+`)">View/Edit</div></td>
        </tr>
        `
      }
      toChange += 
      `        
        </tbody>
      </table>
      `;
      adminTableBody.innerHTML = toChange ;
    })
    .catch(error => {
      alert(error.message)
      console.log(error.message)
      console.log(error);
    });
}

/* Add Admin */
function addAdmin(){
  const email = document.getElementById("admin-email").value;
  const first_name = document.getElementById("admin-first-name").value;
  const last_name = document.getElementById("admin-last-name").value;
  const address = document.getElementById("admin-address").value;
  const mobile_number = document.getElementById("admin-mobile-number").value;
  const date_of_birth = document.getElementById("admin-date-of-birth").value;
  const gender = document.getElementById("admin-gender").value;
  const password = document.getElementById("admin-password").value;
  const position = document.getElementById("admin-position").value;

  fetch(host+`/admin/admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"email": email,"first_name": first_name,"last_name": last_name, "address": address,"mobile_number": mobile_number,"date_of_birth": date_of_birth,"gender": gender, "password": password, "position": position})
  })
  .then(response => {
    if(response.status == 201){
      alert("Admin has been created!")
      window.location = "./admin.html"
    }
  })
  .catch(error => {
    console.log(error.message)
    console.log(error);
  });
};

/* Redirect to view/edit admin */
function editAdmin(adminId){
  window.location = './editAdmin.html?admin_id='+adminId;
  customer_id = document.getElementById(adminId);
  customer_id.innerHTML = customer_id;
};

/* View Admin Details */
function viewAdmin(){
  var admin_id = getQueryVariable("admin_id");
  console.log(admin_id);
  fetch(host+`/admin/view_admin?admin_id=`+admin_id)
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }

    document.getElementById("admin-id").innerHTML = admin_id
    document.getElementById("admin-email").value = response[0].email;
    document.getElementById("admin-first-name").value = response[0].first_name;
    document.getElementById("admin-last-name").value = response[0].last_name;
    document.getElementById("admin-address").value = response[0].address;
    document.getElementById("admin-mobile-number").value = response[0].mobile_number;
    document.getElementById("admin-date-of-birth").value = formatDate(new Date(response[0].date_of_birth));
    document.getElementById("admin-gender").value = response[0].gender;
    document.getElementById("admin-password").value = response[0].password;
    document.getElementById("admin-position").value = response[0].position;
  
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
}

/* Delete admin */
function deleteAdmin(){
  var admin_id = getQueryVariable("admin_id");
  fetch(host+`/admin/delete_admin?admin_id=`+admin_id, {
    method: 'DELETE'
  })
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }
    alert("Admin "+admin_id+" has been deleted!")
    window.location = "./admin.html"
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
}

/* Update Admin */
function updateAdmin(){

  var admin_id = getQueryVariable("admin_id");
  const email = document.getElementById("admin-email").value;
  const first_name = document.getElementById("admin-first-name").value;
  const last_name = document.getElementById("admin-last-name").value;
  const address = document.getElementById("admin-address").value;
  const mobile_number = document.getElementById("admin-mobile-number").value;
  const date_of_birth = document.getElementById("admin-date-of-birth").value;
  const gender = document.getElementById("admin-gender").value;
  const password = document.getElementById("admin-password").value;
  const position = document.getElementById("admin-position").value;

  fetch(host+`/admin/admin`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"admin_id": admin_id,"email": email,"first_name": first_name,"last_name": last_name, "address": address,"mobile_number": mobile_number,"date_of_birth": date_of_birth,"gender": gender, "password": password, "position": position})
  })
  .then(response => {
    if(response.status == 200){
      alert("Admin "+admin_id+" has been updated!")
      window.location = "./admin.html"
    }
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
}