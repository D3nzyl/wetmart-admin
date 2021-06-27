const host = "http://localhost:3000";

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
};

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
};

var loadFile = function(event) {
  var output = document.getElementById('output');
  output.src = URL.createObjectURL(event.target.files[0]);
  output.onload = function() {
    URL.revokeObjectURL(output.src) // free memory
  };
};

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
        };
      })
      .catch(error => {
        alert(error.message)
        console.log(error.message)
        console.log(error);
    });
};

/* View all customer & search */
function customer(search){

  var customerTableBody = document.getElementById("customer-table-body");
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
      for (i=0; i<response.length; i++){
        toChange += 
        `
        <tr>
          <td>`+response[i].customer_id+`</td>
          <td>`+response[i].email+`</td>
          <td>`+response[i].first_name+`</td>
          <td>`+response[i].last_name+`</td>
          <td>`+response[i].mobile_number+`</td>
          <td><div class="view-edit" onclick="editCustomer(`+response[i].customer_id+`)">View/Edit</div></td>
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
};

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
};

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
};

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
};

/* View all admin & search */
function admin(search){

  var adminTableBody = document.getElementById("admin-table-body");
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
      for (i=0; i<response.length; i++){
        toChange += 
        `
        <tr>
          <td>`+response[i].admin_id+`</td>
          <td>`+response[i].email+`</td>
          <td>`+response[i].first_name+`</td>
          <td>`+response[i].last_name+`</td>
          <td>`+response[i].mobile_number+`</td>
          <td>`+response[i].position+`</td>
          <td><div class="view-edit" onclick="editAdmin(`+response[i].admin_id+`)">View/Edit</div></td>
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
};

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
};

/* View Admin Details */
function viewAdmin(){
  var admin_id = getQueryVariable("admin_id");
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
};

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
};

/* Update Admin */
function updateAdmin(){

  const admin_id = getQueryVariable("admin_id");
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
};


/* View all Market & search */
function market(search){

  var marketTableBody = document.getElementById("market-table-body");
  fetch(host+`/admin/market?search=`+search)
    .then(response => {
      return response.json();
    })
    .then(response=> {
      var toChange = `
      <table class="table">
        <thead>
          <tr>
            <th>Market Image</th>
            <th>Market ID</th>
            <th>Market Name</th>
            <th>Postal Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
      `;
      for (i=0; i<response.length; i++){
        toChange += 
        `
        <tr>
          <td><img class="img-table" src="`+response[i].market_image_id+`" alt="Market Image"/></td>
          <td>`+response[i].market_id+`</td>
          <td>`+response[i].market_name+`</td>
          <td>`+response[i].postal_code+`</td>
          <td><div class="view-edit" onclick="editMarket(`+response[i].market_id+`)">View/Edit</div></td>
        </tr>
        `
      }
      toChange += 
      `        
        </tbody>
      </table>
      `;
      marketTableBody.innerHTML = toChange ;
    })
    .catch(error => {
      alert(error.message)
      console.log(error.message)
      console.log(error);
    });
};

/* Add Market */
function addMarket(){
  const market_name = document.getElementById("market-name").value;
  const postal_code = document.getElementById("market-postal-code").value;
  const image = document.getElementById("market-image").files[0];
  const fd = new FormData();
  fd.append("market_name", market_name);
  fd.append("postal_code",postal_code);
  fd.append("image", image);

  fetch(host+`/admin/market`, {
    method: 'POST',
    header:{'Content-TYpe':'multipart/form-data'},
    body: fd
  })
  .then(response => {
    if(response.status == 201){
      alert("Market has been created!")
      window.location = "./market.html"
    }
    else if(response.status == 400){
      return response.json()
      .then(response => {
        alert(response.message)
      })
    }
  })
  .catch(error => {
    console.log(error.message)
    console.log(error);
  });
};

/* Redirect to view/edit market */
function editMarket(marketId){
  window.location = './editMarket.html?market_id='+marketId;
};

/* View Market Details */
function viewMarket(){
  var market_id = getQueryVariable("market_id");
  fetch(host+`/admin/view_market?market_id=`+market_id)
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }
    document.getElementById("market-id").innerHTML = market_id
    document.getElementById("market-name").value = response[0].market_name;
    document.getElementById("market-postal-code").value = response[0].postal_code;
    document.getElementById("output").src = response[0].market_image_id;
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* Delete market */
function deleteMarket(){
  var market_id = getQueryVariable("market_id");
  fetch(host+`/admin/delete_market?market_id=`+market_id, {
    method: 'DELETE'
  })
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }
    alert("Market "+market_id+" has been deleted!")
    window.location = "./market.html"
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* Update Admin */
function updateMarket(){

  const market_id = getQueryVariable("market_id");
  const market_name = document.getElementById("market-name").value;
  const postal_code = document.getElementById("market-postal-code").value;
  const image = document.getElementById("market-image").files[0];
  const fd = new FormData();
  fd.append("market_id", market_id);
  fd.append("market_name", market_name);
  fd.append("postal_code",postal_code);
  fd.append("image", image);

  fetch(host+`/admin/market`, {
    method: 'PUT',
    header:{'Content-Type':'multipart/form-data'},
    body: fd
  })
  .then(response => {
    if(response.status == 200){
      alert("Market "+market_id+" has been updated!")
      window.location = "./market.html"
    }
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* Get market list */
async function getMarketList(){

  var toChange = "";
  var sellerMarketList = document.getElementById("seller-market-id");
  fetch(host+'/admin/seller/market_list')
  .then(response=>{
    return response.json();
  })
  .then(response=>{
    for (i=0; i < response.length; i++){
      toChange += `<option value="`+response[i].market_id+`">`+response[i].market_name+" ("+response[i].market_id+`)</option>`
    }
    sellerMarketList.innerHTML = toChange;
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};


/* View all Seller & search */
function seller(search){

  var sellerTableBody = document.getElementById("seller-table-body");
  fetch(host+`/admin/seller?search=`+search)
    .then(response => {
      return response.json();
    })
    .then(response=> {
      var toChange = `
      <table class="table">
        <thead>
          <tr>
            <th>Store Image</th>
            <th>Seller ID</th>
            <th>Store Name</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
      `;
      for (i=0; i<response.length; i++){
        toChange += 
        `
        <tr>
          <td><img class="img-table" src="`+response[i].store_image_id+`" alt="Store Image"/></td>
          <td>`+response[i].seller_id+`</td>
          <td>`+response[i].store_name+`</td>
          <td>`+response[i].email+`</td>
          <td>`+response[i].first_name+`</td>
          <td>`+response[i].last_name+`</td>
          <td><div class="view-edit" onclick="editSeller(`+response[i].seller_id+`)">View/Edit</div></td>
        </tr>
        `
      }
      toChange += 
      `        
        </tbody>
      </table>
      `;
      sellerTableBody.innerHTML = toChange ;
    })
    .catch(error => {
      alert(error.message)
      console.log(error.message)
      console.log(error);
    });
};

/* Add Seller */
function addSeller(){
  const first_name = document.getElementById("seller-first-name").value;
  const store_name = document.getElementById("seller-store-name").value;
  const email = document.getElementById("seller-email").value;
  const mobile_number = document.getElementById("seller-mobile-number").value;
  const date_of_birth = document.getElementById("seller-date-of-birth").value;
  const password = document.getElementById("seller-password").value;
  const gender = document.getElementById("seller-gender").value;
  const address = document.getElementById("seller-address").value;
  const last_name = document.getElementById("seller-last-name").value;
  const unit_number = document.getElementById("seller-unit-number").value;
  const market_id = document.getElementById("seller-market-id").value;
  const image = document.getElementById("seller-store-image").files[0];
  const fd = new FormData();
  fd.append("first_name",first_name);
  fd.append("store_name",store_name);
  fd.append("email",email);
  fd.append("mobile_number",mobile_number);
  fd.append("date_of_birth",date_of_birth);
  fd.append("password",password);
  fd.append("gender",gender);
  fd.append("address",address);
  fd.append("last_name",last_name);
  fd.append("unit_number",unit_number);
  fd.append("market_id",market_id);
  fd.append("image", image);


  fetch(host+`/admin/seller`, {
    method: 'POST',
    header:{'Content-Type':'multipart/form-data'},
    body: fd
  })
  .then(response => {
    if(response.status == 201){
      alert("Seller has been created!")
      window.location = "./seller.html"
    }
    else if(response.status == 400){
      return response.json()
      .then(response => {
        alert(response.message)
      })
    }
  })
  .catch(error => {
    console.log(error.message)
    console.log(error);
  });
};


/* Redirect to view/edit seller */
function editSeller(sellerId){
  window.location = './editSeller.html?seller_id='+sellerId;
};

/* View Market Details */
function viewSeller(){
  var seller_id = getQueryVariable("seller_id");
  fetch(host+`/admin/view_seller?seller_id=`+seller_id)
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }
    document.getElementById("seller-id").innerHTML = seller_id
    document.getElementById("seller-rating").innerHTML = response[0].rating+"/5"
    document.getElementById("seller-first-name").value = response[0].first_name;
    document.getElementById("seller-store-name").value = response[0].store_name;
    document.getElementById("seller-email").value = response[0].email;
    document.getElementById("seller-mobile-number").value = response[0].mobile_number;
    document.getElementById("seller-date-of-birth").value = formatDate(response[0].date_of_birth);
    document.getElementById("seller-password").value = response[0].password;
    document.getElementById("seller-gender").value = response[0].gender;
    document.getElementById("seller-address").value = response[0].address;
    document.getElementById("seller-last-name").value = response[0].last_name;
    document.getElementById("seller-unit-number").value = response[0].unit_number;
    document.getElementById("seller-market-id").value = response[0].market_id;
    document.getElementById("output").src = response[0].store_image_id;
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* Delete market */
function deleteSeller(){
  var seller_id = getQueryVariable("seller_id");
  fetch(host+`/admin/delete_seller?seller_id=`+seller_id, {
    method: 'DELETE'
  })
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }
    alert("Seller "+seller_id+" has been deleted!")
    window.location = "./seller.html"
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* Update Seller */
function updateSeller(){

  const seller_id = getQueryVariable("seller_id");
  const first_name = document.getElementById("seller-first-name").value;
  const store_name = document.getElementById("seller-store-name").value;
  const email = document.getElementById("seller-email").value;
  const mobile_number = document.getElementById("seller-mobile-number").value;
  const date_of_birth = document.getElementById("seller-date-of-birth").value;
  const password = document.getElementById("seller-password").value;
  const gender = document.getElementById("seller-gender").value;
  const address = document.getElementById("seller-address").value;
  const last_name = document.getElementById("seller-last-name").value;
  const unit_number = document.getElementById("seller-unit-number").value;
  const market_id = document.getElementById("seller-market-id").value;
  const image = document.getElementById("seller-store-image").files[0];
  const fd = new FormData();
  fd.append("seller_id",seller_id);
  fd.append("first_name",first_name);
  fd.append("store_name",store_name);
  fd.append("email",email);
  fd.append("mobile_number",mobile_number);
  fd.append("date_of_birth",date_of_birth);
  fd.append("password",password);
  fd.append("gender",gender);
  fd.append("address",address);
  fd.append("last_name",last_name);
  fd.append("unit_number",unit_number);
  fd.append("market_id",market_id);
  fd.append("image", image);

  fetch(host+`/admin/seller`, {
    method: 'PUT',
    header:{'Content-Type':'multipart/form-data'},
    body: fd
  })
  .then(response => {
    if(response.status == 200){
      alert("Seller "+seller_id+" has been updated!")
      window.location = "./seller.html"
    }
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};