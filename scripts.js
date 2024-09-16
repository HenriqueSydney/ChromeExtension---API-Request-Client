/* eslint-disable no-undef */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
  });
});

document.getElementById('authType').addEventListener('change', (e) => {
  const authType = e.target.value;
  const authFields = document.getElementById('authFields');
  authFields.innerHTML = '';

  if (authType === 'basic') {
    authFields.innerHTML = `
      <div class="form-input-container">
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" placeholder="Insira o Username">
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" placeholder="Insira o Password">
        </div>
      </div>
    `;
  } else if (authType === 'bearer') {
    authFields.innerHTML = `      
        <label for="token">Bearer Token:</label>
        <input type="text" id="token" placeholder="Insira o Bearer Token">     
    `;
  }
});

document.querySelectorAll('.tab-response').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab-response').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-response-content').forEach(content => content.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
  });
});

document.getElementById('add_request').addEventListener('click', () => {  
  const addRequestForm = document.getElementById('add_request_form');
  if(addRequestForm.style.display === 'flex') {
    addRequestForm.style.display = 'none';
    addRequestForm.style.height = 0;
  } else {
    addRequestForm.style.display = 'flex';
    addRequestForm.style.height = 200;
  } 
})

document.getElementById('close_add_request').addEventListener('click', () => {  
  const addRequestForm = document.getElementById('add_request_form');  
  addRequestForm.style.display = 'none';
  addRequestForm.style.height = 0;
  const field = document.querySelector('#add_request_input')
  field.value = '';
  
})

chrome.storage.local.get(['requests'], function(result) {
  if(result.requests){
    result.requests.forEach((request, key) => {
      createItemForListOfRequests({ requestInfo: request, requestIndex: key })
    })
  }  
});


document.querySelector('#confirm_request').addEventListener('click', function() {
  const field = document.querySelector('#add_request_input') 
  if(field.value === ""){
    field.classList.add("error");
    const errorMessage = document.createElement("span");
    errorMessage.innerHTML = "Forneça uma descrição"
    errorMessage.id = "errorMessageDescription"
    errorMessage.classList.add('error-message')
    field.append(errorMessage)
    return
  }
  field.classList.remove("error");
  const errorMessage = document.querySelector('#errorMessageDescription');
  if (errorMessage) errorMessage.remove();
  
  setListOfRequests({
    description:field.value.trim(),
    method: "",
    url: "",
    body: ""
  })

  field.value = ''
  const addRequestForm = document.getElementById('add_request_form');  
  addRequestForm.style.display = 'none';
  addRequestForm.style.height = 0;
  
})

function setListOfRequests({ id, description, method, url, body }){
  chrome.storage.local.get({ requests: [] }, function(result) {
    const requestsArray = result.requests || [];
    let newRequest
    if(id && requestsArray.length > 0 && requestsArray[id]){
      newRequest = {
        description: description || requestsArray[id].description,
        method: method || requestsArray[id].method,
        url: url || requestsArray[id].url,
        body: body || requestsArray[id].body,
      };
      requestsArray[id] = newRequest;
    } else {
      newRequest = {
        description,
        method,
        url,
        body
      };
      requestsArray.push(newRequest);
    }     

    currentIndex = id || requestsArray.length - 1 

    chrome.storage.local.set({ requests: requestsArray }, function() {      
      createItemForListOfRequests({ requestInfo: newRequest, requestIndex: currentIndex })
    });

    

    chrome.storage.local.set({ current_request: requestsArray }, function() {
      console.log('Index updated')
    })
    
  });
}

document.getElementById("method").addEventListener("change", () => {
  chrome.storage.local.get({ current_request }, function(result) {
    const value =document.getElementById("method").value
    setListOfRequests({
      id: result.current_request,
      method: value,
    })
  }) 
})

function createItemForListOfRequests({ requestInfo, requestIndex }){
  const itemDescription = document.createElement("strong");
  itemDescription.innerText = `${requestInfo.method} - ${requestInfo.description}`
  itemDescription.style.cursor = "pointer"

  itemDescription.addEventListener("click", () => {
    document.querySelector("#url").value = requestInfo.url
    document.querySelector("#method").value = requestInfo.method
    document.querySelector("#body").value = requestInfo.body
  })

  const itemTrash = document.createElement("button");
  itemTrash.classList.add("remove-request")
  itemTrash.innerText = 'x'
  itemTrash.addEventListener("click", () => {
    document.querySelector("#url").value = ""
    document.querySelector("#method").value = "GET"
    document.querySelector("#body").value = ""
    chrome.storage.local.get({ requests: [] }, function(result) {
      const requestsArray = result.requests || [];

      if(requestsArray.length > 0 && requestsArray[requestIndex]) {

        requestsArray.splice(requestIndex, 1)

        chrome.storage.local.set({ requests: requestsArray }, function() {      
          chrome.storage.local.get(['requests'], function(result) {
            if(result.requests){
              document.getElementById('list_of_requests').innerHTML = ''
              result.requests.forEach((request, key) => {
                createItemForListOfRequests({ requestInfo: request, requestIndex: key })
              })
            }  
          });
        });
      }

    })

  })

  const item = document.createElement("li");
  item.append(itemDescription)
  item.append(itemTrash)
  
  document.getElementById('list_of_requests').append(item)
}

document.getElementById("body").addEventListener("keyup", () => {
  chrome.storage.local.get({ current_request }, function(result) {
    const value = document.getElementById("body").value
    setListOfRequests({
      id: result.current_request,
      body: value,
    })
  }) 
})

document.getElementById("url").addEventListener("keyup", () => {
  chrome.storage.local.get({ current_request }, function(result) {
    const value = document.getElementById("url").value
    setListOfRequests({
      id: result.current_request,
      url: value,
    })
  }) 
})

