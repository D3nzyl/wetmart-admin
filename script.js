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

function booleanToString(bool){
  if(bool){
    return "Yes";
  }
  else{
    return "No"
  }
}

var currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

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
function getMarketList(callback1,callback2){

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
    return;
  })
  .then(function(){
    if(callback1){
      callback1(callback2);
    };
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

function getStoreCategoryList(callback){

  var toChange = "";
  var sellerStoreCategoryList = document.getElementById("seller-store-category-id");
  fetch(host+'/admin/seller/store_category_list')
  .then(response=>{
    return response.json();
  })
  .then(response=>{
    for (i=0; i < response.length; i++){
      toChange += `<option value="`+response[i].store_category_id+`">`+response[i].category_name+" ("+response[i].store_category_id+`)</option>`
    }
    sellerStoreCategoryList.innerHTML = toChange;
    return;
  })
  .then(function(){
    if(callback){
      callback();
    };
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
  const store_category_id = document.getElementById("seller-store-category-id").value;
  const description = document.getElementById("seller-description").value;
  const last_name = document.getElementById("seller-last-name").value;
  const unit_number = document.getElementById("seller-unit-number").value;
  const market_id = document.getElementById("seller-market-id").value;
  const bank = document.getElementById("seller-bank").value;
  const bank_account = document.getElementById("seller-bank-account").value;
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
  fd.append("store_category_id",store_category_id);
  fd.append("description",description);
  fd.append("last_name",last_name);
  fd.append("unit_number",unit_number);
  fd.append("market_id",market_id);
  fd.append("bank",bank);
  fd.append("bank_account",bank_account);
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

/* View Seller Details */
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
    document.getElementById("seller-store-category-id").value = response[0].store_category_id;
    document.getElementById("seller-description").value = response[0].store_description;
    document.getElementById("seller-address").value = response[0].address;
    document.getElementById("seller-last-name").value = response[0].last_name;
    document.getElementById("seller-unit-number").value = response[0].unit_number;
    document.getElementById("seller-market-id").value = response[0].market_id;
    document.getElementById("seller-bank").value = response[0].bank;
    document.getElementById("seller-bank-account").value = response[0].bank_account;
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
  const store_category_id = document.getElementById("seller-store-category-id").value;
  const description = document.getElementById("seller-description").value;
  const last_name = document.getElementById("seller-last-name").value;
  const unit_number = document.getElementById("seller-unit-number").value;
  const market_id = document.getElementById("seller-market-id").value;
  const bank = document.getElementById("seller-bank").value;
  const bank_account = document.getElementById("seller-bank-account").value;
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
  fd.append("store_category_id",store_category_id);
  fd.append("description",description);
  fd.append("last_name",last_name);
  fd.append("unit_number",unit_number);
  fd.append("bank",bank);
  fd.append("bank_account",bank_account);
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

/* View all Product & search */
function product(search){

  var productTableBody = document.getElementById("product-table-body");
  fetch(host+`/admin/product?search=`+search)
    .then(response => {
      return response.json();
    })
    .then(response=> {
      var toChange = `
      <table class="table">
        <thead>
          <tr>
            <th>Product Image</th>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Seller ID</th>
            <th>Store Name</th>
            <th>Category</th>
            <th>Availability</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
      `;
      for (i=0; i<response.length; i++){
        toChange += 
        `
        <tr>
          <td><img class="img-table" src="`+response[i].product_image_id+`" alt="Store Image"/></td>
          <td>`+response[i].product_id+`</td>
          <td>`+response[i].product_name+`</td>
          <td>`+response[i].seller_id+`</td>
          <td>`+response[i].store_name+`</td>
          <td>`+response[i].category_name+`</td>
          <td>`+booleanToString(response[i].availability)+`</td>
          <td>`+currencyFormatter.format(response[i].price)+`</td>
          <td><div class="view-edit" onclick="editProduct(`+response[i].product_id+`)">View/Edit</div></td>
        </tr>
        `
      }
      toChange += 
      `        
        </tbody>
      </table>
      `;
      productTableBody.innerHTML = toChange ;
    })
    .catch(error => {
      alert(error.message)
      console.log(error.message)
      console.log(error);
    });
};

/* Get seller list */
function getSellerList(callback1,callback2){
  var toChange = "";
  var productSellerList = document.getElementById("product-seller-id");
  fetch(host+'/admin/product/seller_list')
  .then(function(response){
    return response.json();
  })
  .then(function(response){
    for (i=0; i < response.length; i++){
      toChange += `<option value="`+response[i].seller_id+`">`+response[i].store_name+" ("+response[i].seller_id+`)</option>`
    }
    productSellerList.innerHTML = toChange;
    return;
  })
  .then(function(){
    if(callback1){
      callback1(callback2);
    }
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* Get category list */
function getCategoryList(callback){
  var toChange = "";
  var productCategoryList = document.getElementById("product-category-id");
  fetch(host+'/admin/product/category_list')
  .then(function(response){
    return response.json();
  })
  .then(function(response){
    for (i=0; i < response.length; i++){
      toChange += `<option value="`+response[i].product_category_id+`">`+response[i].category_name+" ("+response[i].product_category_id+`)</option>`
    }
    productCategoryList.innerHTML = toChange;
    return;
  })
  .then(function(){
    if(callback){
      callback();
    };
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* Add Product */
function addProduct(){
  const seller_id = document.getElementById("product-seller-id").value;
  const product_name = document.getElementById("product-name").value;
  const availability = document.getElementById("product-availability").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const product_description = document.getElementById("product-description").value;
  const weight = parseFloat(document.getElementById("product-weight").value);
  const product_category_id = document.getElementById("product-category-id").value;
  const image = document.getElementById("product-image").files[0];
  const fd = new FormData();
  fd.append("seller_id",seller_id);
  fd.append("product_name",product_name);
  fd.append("availability",availability);
  fd.append("price",price);
  fd.append("product_description",product_description);
  fd.append("weight",weight);
  fd.append("product_category_id",product_category_id);
  fd.append("image", image);

  console.log(image)
  console.log(fd)

  fetch(host+`/admin/product`, {
    method: 'POST',
    header:{'Content-Type':'multipart/form-data'},
    body: fd
  })
  .then(response => {
    if(response.status == 201){
      alert("Product has been created!")
      window.location = "./product.html"
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

/* Redirect to view/edit product */
function editProduct(productId){
  window.location = './editProduct.html?product_id='+productId;
};

/* View Product Details */
function viewProduct(){
  var product_id = getQueryVariable("product_id");
  fetch(host+`/admin/view_product?product_id=`+product_id)
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }
    document.getElementById("product-id").innerHTML = product_id;
    document.getElementById("product-seller-id").value = response[0].seller_id;
    document.getElementById("product-name").value = response[0].product_name;
    document.getElementById("product-availability").value = response[0].availability;
    document.getElementById("product-price").value = response[0].price;
    document.getElementById("product-description").value = response[0].product_description;
    document.getElementById("product-weight").value = response[0].weight;
    document.getElementById("product-category-id").value = response[0].product_category_id;
    document.getElementById("output").src = response[0].product_image_id;
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* Delete product */
function deleteProduct(){
  var product_id = getQueryVariable("product_id");
  fetch(host+`/admin/delete_product?product_id=`+product_id, {
    method: 'DELETE'
  })
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }
    alert("Product "+product_id+" has been deleted!")
    window.location = "./product.html"
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* Update Product */
function updateProduct(){

  const product_id = getQueryVariable("product_id");
  const seller_id = document.getElementById("product-seller-id").value;
  const product_name = document.getElementById("product-name").value;
  const availability = document.getElementById("product-availability").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const product_description = document.getElementById("product-description").value;
  const weight = parseFloat(document.getElementById("product-weight").value);
  const product_category_id = document.getElementById("product-category-id").value;
  const image = document.getElementById("product-image").files[0];
  const fd = new FormData();
  fd.append("product_id",product_id);
  fd.append("seller_id",seller_id);
  fd.append("product_name",product_name);
  fd.append("availability",availability);
  fd.append("price",price);
  fd.append("product_description",product_description);
  fd.append("weight",weight);
  fd.append("product_category_id",product_category_id);
  fd.append("image", image);

  fetch(host+`/admin/product`, {
    method: 'PUT',
    header:{'Content-Type':'multipart/form-data'},
    body: fd
  })
  .then(response => {
    if(response.status == 200){
      alert("Product "+product_id+" has been updated!")
      window.location = "./product.html"
    }
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* View all Product Category & search */
function productCategory(search){

  var productCategoryTableBody = document.getElementById("product-category-table-body");
  fetch(host+`/admin/product_category?search=`+search)
    .then(response => {
      return response.json();
    })
    .then(response=> {
      var toChange = `
      <table class="table">
        <thead>
          <tr>
            <th>Product Category ID</th>
            <th>Category Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
      `;
      for (i=0; i<response.length; i++){
        toChange += 
        `
        <tr>
          <td>`+response[i].product_category_id+`</td>
          <td>`+response[i].category_name+`</td>
          <td><div class="view-edit" onclick="editProductCategory(`+response[i].product_category_id+`)">View/Edit</div></td>
        </tr>
        `
      }
      toChange += 
      `        
        </tbody>
      </table>
      `;
      productCategoryTableBody.innerHTML = toChange ;
    })
    .catch(error => {
      alert(error.message)
      console.log(error.message)
      console.log(error);
    });
};

/* Add Product Category */
function addProductCategory(){
  const category_name = document.getElementById("product-category-name").value;

  fetch(host+`/admin/product_category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"category_name":category_name})
  })
  .then(response => {
    if(response.status == 201){
      alert("Product Category has been created!")
      window.location = "./productCategory.html"
    }
  })
  .catch(error => {
    console.log(error.message)
    console.log(error);
  });
};

/* Redirect to view/edit product category */
function editProductCategory(productCategoryId){
  window.location = './editProductCategory.html?product_category_id='+productCategoryId;
};

/* View Product Category Details */
function viewProductCategory(){
  var product_category_id = getQueryVariable("product_category_id");
  fetch(host+`/admin/view_product_category?product_category_id=`+product_category_id)
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }
    document.getElementById("product-category-id").innerHTML = product_category_id;
    document.getElementById("product-category-name").value = response[0].category_name;
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* Delete product category */
function deleteProductCategory(){
  var product_category_id = getQueryVariable("product_category_id");
  fetch(host+`/admin/delete_product_category?product_category_id=`+product_category_id, {
    method: 'DELETE'
  })
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }
    alert("Product Category "+product_category_id+" has been deleted!")
    window.location = "./productCategory.html"
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* Update Product Category */
function updateProductCategory(){

  var product_category_id = getQueryVariable("product_category_id");
  const category_name = document.getElementById("product-category-name").value;

  fetch(host+`/admin/product_category`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"product_category_id":product_category_id,"category_name": category_name})
  })
  .then(response => {
    if(response.status == 200){
      alert("Product Category "+product_category_id+" has been updated!")
      window.location = "./productCategory.html"
    }
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* View all Seller & search */
function registration(search){

  var sellerRegistrationTableBody = document.getElementById("seller-registration-table-body");
  fetch(host+`/admin/pending_seller?search=`+search)
    .then(response => {
      return response.json();
    })
    .then(response=> {
      var toChange = `
      <table class="table">
        <thead>
          <tr>
            <th>Store Image</th>
            <th>Pending Seller ID</th>
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
          <td>`+response[i].pending_seller_id+`</td>
          <td>`+response[i].store_name+`</td>
          <td>`+response[i].email+`</td>
          <td>`+response[i].first_name+`</td>
          <td>`+response[i].last_name+`</td>
          <td><div class="view-edit" onclick="editSellerRegistration(`+response[i].pending_seller_id+`)">View/Edit</div></td>
        </tr>
        `
      }
      toChange += 
      `        
        </tbody>
      </table>
      `;
      sellerRegistrationTableBody.innerHTML = toChange ;
    })
    .catch(error => {
      alert(error.message)
      console.log(error.message)
      console.log(error);
    });
};

/* Redirect to view/edit seller */
function editSellerRegistration(pendingSellerId){
  window.location = './editSellerRegistration.html?pending_seller_id='+pendingSellerId;
};

/* View Seller Registration Details */
function viewSellerRegistration(){
  var pending_seller_id = getQueryVariable("pending_seller_id");
  fetch(host+`/admin/view_pending_seller?pending_seller_id=`+pending_seller_id)
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }
    document.getElementById("pending-seller-id").innerHTML = pending_seller_id
    document.getElementById("seller-first-name").value = response[0].first_name;
    document.getElementById("seller-store-name").value = response[0].store_name;
    document.getElementById("seller-email").value = response[0].email;
    document.getElementById("seller-mobile-number").value = response[0].mobile_number;
    document.getElementById("seller-date-of-birth").value = formatDate(response[0].date_of_birth);
    document.getElementById("seller-password").value = response[0].password;
    document.getElementById("seller-gender").value = response[0].gender;
    document.getElementById("seller-address").value = response[0].address;
    document.getElementById("seller-store-category-id").value = response[0].store_category_id;
    document.getElementById("seller-description").value = response[0].store_description;
    document.getElementById("seller-last-name").value = response[0].last_name;
    document.getElementById("seller-unit-number").value = response[0].unit_number;
    document.getElementById("seller-market-id").value = response[0].market_id;
    document.getElementById("seller-bank").value = response[0].bank;
    document.getElementById("seller-bank-account").value = response[0].bank_account;
    document.getElementById("output").src = response[0].store_image_id;
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* Reject pending seller registration */
function approveSeller(){
  var pending_seller_id = getQueryVariable("pending_seller_id");

  fetch(host+`/admin/approve_pending_seller`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"pending_seller_id":pending_seller_id})
  })
  .then(response => {
    if(response.status == 200){
      alert("Pending Seller "+pending_seller_id+" has been approved!")
      window.location = "./sellerRegistration.html"
    }
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
}

/* Reject pending seller registration */
function rejectSeller(){
  var pending_seller_id = getQueryVariable("pending_seller_id");

  fetch(host+`/admin/reject_pending_seller`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"pending_seller_id":pending_seller_id})
  })
  .then(response => {
    if(response.status == 200){
      alert("Pending Seller "+pending_seller_id+" has been rejected!")
      window.location = "./sellerRegistration.html"
    }
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
}

/* View all Store Category & search */
function storeCategory(search){

  var storeCategoryTableBody = document.getElementById("store-category-table-body");
  fetch(host+`/admin/store_category?search=`+search)
    .then(response => {
      return response.json();
    })
    .then(response=> {
      var toChange = `
      <table class="table">
        <thead>
          <tr>
            <th>Store Category ID</th>
            <th>Category Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
      `;
      for (i=0; i<response.length; i++){
        toChange += 
        `
        <tr>
          <td>`+response[i].store_category_id+`</td>
          <td>`+response[i].category_name+`</td>
          <td><div class="view-edit" onclick="editStoreCategory(`+response[i].store_category_id+`)">View/Edit</div></td>
        </tr>
        `
      }
      toChange += 
      `        
        </tbody>
      </table>
      `;
      storeCategoryTableBody.innerHTML = toChange ;
    })
    .catch(error => {
      alert(error.message)
      console.log(error.message)
      console.log(error);
    });
};

/* Redirect to view/edit store category */
function editStoreCategory(storeCategoryId){
  window.location = './editStoreCategory.html?store_category_id='+storeCategoryId;
};

/* Add Store Category */
function addStoreCategory(){
  const category_name = document.getElementById("store-category-name").value;

  fetch(host+`/admin/store_category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"category_name":category_name})
  })
  .then(response => {
    if(response.status == 201){
      alert("Store Category has been created!")
      window.location = "./storeCategory.html"
    }
  })
  .catch(error => {
    console.log(error.message)
    console.log(error);
  });
};

/* View Store Category Details */
function viewStoreCategory(){
  var store_category_id = getQueryVariable("store_category_id");
  fetch(host+`/admin/view_store_category?store_category_id=`+store_category_id)
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }
    document.getElementById("store-category-id").innerHTML = store_category_id;
    document.getElementById("store-category-name").value = response[0].category_name;
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* Delete Store category */
function deleteStoreCategory(){
  var store_category_id = getQueryVariable("store_category_id");
  fetch(host+`/admin/delete_store_category?store_category_id=`+store_category_id, {
    method: 'DELETE'
  })
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }
    alert("Store Category "+store_category_id+" has been deleted!")
    window.location = "./storeCategory.html"
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};


/* Update Store Category */
function updateStoreCategory(){

  var store_category_id = getQueryVariable("store_category_id");
  const category_name = document.getElementById("store-category-name").value;

  fetch(host+`/admin/store_category`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"store_category_id":store_category_id,"category_name": category_name})
  })
  .then(response => {
    if(response.status == 200){
      alert("Store Category "+store_category_id+" has been updated!")
      window.location = "./storeCategory.html"
    }
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* View all Close Order & search */
function closeOrder(search){

  var closeOrderTableBody = document.getElementById("close-order-table-body");
  fetch(host+`/admin/close_order?search=`+search)
    .then(response => {
      return response.json();
    })
    .then(response=> {
      var toChange = `
      <table class="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Delivery ID</th>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Date of Order</th>
            <th>Total Price</th>
            <th>Total Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
      `;
      for (i=0; i<response.length; i++){
        toChange += 
        `
        <tr>
          <td>`+response[i].order_id+`</td>
          <td>`+response[i].delivery_id+`</td>
          <td>`+response[i].customer_id+`</td>
          <td>`+response[i].customer_name+`</td>
          <td>`+response[i].date_of_order+`</td>
          <td>`+response[i].total_price+`</td>
          <td>`+response[i].total_quantity+`</td>
          <td><div class="view-edit" onclick="editCloseOrder(`+response[i].order_id+`)">View</div></td>
        </tr>
        `
      }
      toChange += 
      `        
        </tbody>
      </table>
      `;
      closeOrderTableBody.innerHTML = toChange ;
    })
    .catch(error => {
      alert(error.message)
      console.log(error.message)
      console.log(error);
    });
};

/* Redirect to view/edit store category */
function editCloseOrder(orderId){
  window.location = './editCloseOrder.html?order_id='+orderId;
};

/* View Store Category Details */
function viewCloseOrder(){
  var order_id = getQueryVariable("order_id");
  fetch(host+`/admin/view_close_order?order_id=`+order_id)
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }
    document.getElementById("order-id").innerHTML = order_id
    document.getElementById("order-customer-id").innerHTML = response[0][0].customer_id;
    document.getElementById("order-delivery-id").value = response[0][0].delivery_id;
    document.getElementById("order-postal-code").value = response[0][0].postal_code;
    document.getElementById("order-mobile-number").value = response[0][0].mobile_number;
    document.getElementById("order-date-of-order").value = formatDate(response[0][0].date_of_order);
    document.getElementById("order-date-to-deliver").value = formatDate(response[0][0].date_to_deliver);
    document.getElementById("order-status").value = response[0][0].order_status;
    document.getElementById("order-delivery-fee").value = response[0][0].delivery_fee;

    
    var editCloseOrderTableBody = document.getElementById("edit-close-order-table-body");
    var toChange = `
    <table class="table">
      <thead>
        <tr>
          <th>Order Detail ID</th>
          <th>Seller ID</th>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Weight</th>
          <th>Total Price</th>
          <th>Action<th>
        </tr>
      </thead>
      <tbody>
    `;
    for (i=0; i<response[1].length; i++){
      toChange += 
      `
      <tr>
        <td>`+response[1][i].order_detail_id+`</td>
        <td>`+response[1][i].seller_id+`</td>
        <td>`+response[1][i].product_id+`</td>
        <td>`+response[1][i].product_name+`</td>
        <td>`+response[1][i].product_price+`</td>
        <td>`+response[1][i].product_quantity+`</td>
        <td>`+response[1][i].weight+`</td>
        <td>`+(response[1][i].total_price)+`</td>
        <td><div class="view-edit" onclick="editProduct(`+response[1][i].product_id+`)">View</div></td>
      </tr>
      `
    }
    toChange += 
    `        
      </tbody>
    </table>
    `;
    editCloseOrderTableBody.innerHTML = toChange ;
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* View all Open Order & search */
function openOrder(search){

  var openOrderTableBody = document.getElementById("open-order-table-body");
  fetch(host+`/admin/open_order?search=`+search)
    .then(response => {
      return response.json();
    })
    .then(response=> {
      var toChange = `
      <table class="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Delivery ID</th>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Date of Order</th>
            <th>Total Price</th>
            <th>Total Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
      `;
      for (i=0; i<response.length; i++){
        toChange += 
        `
        <tr>
          <td>`+response[i].order_id+`</td>
          <td>`+response[i].delivery_id+`</td>
          <td>`+response[i].customer_id+`</td>
          <td>`+response[i].customer_name+`</td>
          <td>`+response[i].date_of_order+`</td>
          <td>`+response[i].total_price+`</td>
          <td>`+response[i].total_quantity+`</td>
          <td><div class="view-edit" onclick="editOpenOrder(`+response[i].order_id+`)">View</div></td>
        </tr>
        `
      }
      toChange += 
      `        
        </tbody>
      </table>
      `;
      openOrderTableBody.innerHTML = toChange ;
    })
    .catch(error => {
      alert(error.message)
      console.log(error.message)
      console.log(error);
    });
};

/* Redirect to view/edit store category */
function editOpenOrder(orderId){
  window.location = './editOpenOrder.html?order_id='+orderId;
};

/* View Store Category Details */
function viewOpenOrder(){
  var order_id = getQueryVariable("order_id");
  fetch(host+`/admin/view_open_order?order_id=`+order_id)
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }
    document.getElementById("order-id").innerHTML = order_id
    document.getElementById("order-customer-id").innerHTML = response[0][0].customer_id;
    document.getElementById("order-delivery-id").value = response[0][0].delivery_id;
    document.getElementById("order-postal-code").value = response[0][0].postal_code;
    document.getElementById("order-mobile-number").value = response[0][0].mobile_number;
    document.getElementById("order-date-of-order").value = formatDate(response[0][0].date_of_order);
    document.getElementById("order-date-to-deliver").value = formatDate(response[0][0].date_to_deliver);
    document.getElementById("order-status").value = response[0][0].order_status;
    document.getElementById("order-delivery-fee").value = response[0][0].delivery_fee;

    
    var editOpenOrderTableBody = document.getElementById("edit-open-order-table-body");
    var toChange = `
    <table class="table">
      <thead>
        <tr>
          <th>Order Detail ID</th>
          <th>Seller ID</th>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Weight</th>
          <th>Total Price</th>
          <th>Action<th>
        </tr>
      </thead>
      <tbody>
    `;
    for (i=0; i<response[1].length; i++){
      toChange += 
      `
      <tr>
        <td>`+response[1][i].order_detail_id+`</td>
        <td>`+response[1][i].seller_id+`</td>
        <td>`+response[1][i].product_id+`</td>
        <td>`+response[1][i].product_name+`</td>
        <td>`+response[1][i].product_price+`</td>
        <td>`+response[1][i].product_quantity+`</td>
        <td>`+response[1][i].weight+`</td>
        <td>`+(response[1][i].total_price)+`</td>
        <td><div class="view-edit" onclick="editProduct(`+response[1][i].product_id+`)">View</div></td>
      </tr>
      `
    }
    toChange += 
    `        
      </tbody>
    </table>
    `;
    editOpenOrderTableBody.innerHTML = toChange ;
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* Cancel Order */
function cancelOrder(){
  var order_id = getQueryVariable("order_id");
  fetch(host+`/admin/cancel_order?order_id=`+order_id, {
    method: 'DELETE'
  })
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }
    alert("Order "+order_id+" has been cancel!")
    window.location = "./openOrder.html"
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* View all Rating & search */
function rating(search){

  var ratingTableBody = document.getElementById("rating-table-body");
  fetch(host+`/admin/rating?search=`+search)
    .then(response => {
      return response.json();
    })
    .then(response=> {
      var toChange = `
      <table class="table">
        <thead>
          <tr>
            <th>Rating ID</th>
            <th>Order ID</th>
            <th>Seller ID</th>
            <th>Customer ID</th>
            <th>Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
      `;
      for (i=0; i<response.length; i++){
        toChange += 
        `
        <tr>
          <td>`+response[i].rating_id+`</td>
          <td>`+response[i].order_id+`</td>
          <td>`+response[i].seller_id+`</td>
          <td>`+response[i].customer_id+`</td>
          <td>`+response[i].rating+`/5</td>
          <td><div class="view-edit" onclick="editRating(`+response[i].rating_id+`)">View/Edit</div></td>
        </tr>
        `
      }
      toChange += 
      `        
        </tbody>
      </table>
      `;
      ratingTableBody.innerHTML = toChange ;
    })
    .catch(error => {
      alert(error.message)
      console.log(error.message)
      console.log(error);
    });
};

/* Redirect to view/edit rating  */
function editRating(ratingId){
  window.location = './editRating.html?rating_id='+ratingId;
};

/* View Rating Details */
function viewRating(){
  var rating_id = getQueryVariable("rating_id");
  fetch(host+`/admin/view_rating?rating_id=`+rating_id)
  .then(response => {
    return response.json();
  })
  .then(response => {
    console.log(response  )
    if(response.status == 404){
      throw response;
    }
    document.getElementById("rating-id").innerHTML = rating_id
    document.getElementById("rating-seller-id").value = response.seller_id;
    document.getElementById("rating-customer-id").value = response.customer_id;
    document.getElementById("rating-order-id").value = response.order_id;
    document.getElementById("rating-rating").value = response.rating;
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* Update Rating */
function updateRating(){

  var rating_id = getQueryVariable("rating_id");
  const seller_id = document.getElementById("rating-seller-id").value;
  const rating = document.getElementById("rating-rating").value;

  fetch(host+`/admin/rating`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"rating_id": rating_id,"rating": rating,"seller_id": seller_id})
  })
  .then(response => {
    if(response.status == 200){
      alert("Rating "+rating_id+" has been updated!")
      window.location = "./rating.html"
    }
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* Delete Rating */
function deleteRating(){
  var rating_id = getQueryVariable("rating_id");
  fetch(host+`/admin/delete_rating?rating_id=`+rating_id, {
    method: 'DELETE'
  })
  .then(response => {
    return response.json();
  })
  .then(response => {
    if(response.status == 404){
      throw response;
    }
    alert("Rating "+rating_id+" has been deleted!")
    window.location = "./rating.html"
  })
  .catch(error => {
    alert(error.message)
    console.log(error);
  });
};

/* View all Product Category & search */
function finance(search){

  var financeTableBody = document.getElementById("finance-table-body");
  fetch(host+`/admin/finance?search=`+search)
    .then(response => {
      return response.json();
    })
    .then(response=> {
      var toChange = `
      <table class="table">
        <thead>
          <tr>
            <th>Finance Record ID</th>
            <th>Date of Record</th>
            <th>Paid</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
      `;
      for (i=0; i<response.length; i++){
        toChange += 
        `
        <tr>
          <td>`+response[i].finance_record_id+`</td>
          <td>`+response[i].date_of_record+`</td>
          <td>`+booleanToString(response[i].paid)+`</td>
          <td><div class="view-edit" onclick="editFinance(`+response[i].finance_record_id+`)">View/Edit</div></td>
        </tr>
        `
      }
      toChange += 
      `        
        </tbody>
      </table>
      `;
      financeTableBody.innerHTML = toChange ;
    })
    .catch(error => {
      alert(error.message)
      console.log(error.message)
      console.log(error);
    });
};

function addFinanceRecordButton() {
  let today = new Date();
  let date = today.getDate()+'-'+(today.getMonth()+1)+"-"+today.getFullYear();

  var confirmation = confirm("Do you want to create a new finance record for "+date+" ?");
  if (confirmation){
    addFinanceRecord();
  };
};

/* Add Store Category */
function addFinanceRecord(){
  fetch(host+`/admin/finance_record`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if(response.status == 201){
      alert("Finance record has been created!")
    };
  })
  .catch(error => {
    console.log(error.message)
    console.log(error);
  });
};