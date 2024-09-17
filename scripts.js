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
  const authToken = document.getElementById('authToken');
  const authBasic = document.getElementById('authBasic');
  

  if (authType === 'basic') {
    authToken.style.display = 'none';
    authBasic.style.display = 'flex';
  } else if (authType === 'bearer') {
    authToken.style.display = 'block';
    authBasic.style.display = 'none';
  } else {
    authBasic.style.display = 'none';
    authToken.style.display = 'none';
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

function reloadRequestsDescriptions(highlight){
  document.getElementById('list_of_requests').innerHTML = ''
  chrome.storage.local.get(['requests'], function(result) {
    if(result.requests){
     
      result.requests.forEach((request) => { 
        const requestIndex = result.requests.findIndex(reqInfo => reqInfo.id === request.id)  
        createItemForListOfRequests({ requestInfo: request, requestIndex, highlight })
      })
    }  
  });
}

reloadRequestsDescriptions(false);



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
    body: "",
    token: "", 
    username: "", 
    password: "", 
    authType: ""
  })

  field.value = ''
  const addRequestForm = document.getElementById('add_request_form');  
  addRequestForm.style.display = 'none';
  addRequestForm.style.height = 0;
  
})

function setListOfRequests({ id, description, method, url, body, token, username, password, authType }){
  chrome.storage.local.get(['requests'], function(result) {
    const requestsArray = result.requests || [];
    let newRequest
    if(id !== undefined && requestsArray.length > 0 && requestsArray[id]){
      newRequest = {
        id,
        description: description || requestsArray[id].description,
        method: method || requestsArray[id].method,
        url: url || requestsArray[id].url,
        body: body || requestsArray[id].body,
        token: token || requestsArray[id].token,
        username: username || requestsArray[id].username,
        password: password || requestsArray[id].password,
        authType: authType || requestsArray[id].authType
      };
      requestsArray[id] = newRequest;
    } else {
      newRequest = {
        id: requestsArray.length, 
        description,
        method: method || 'GET',
        url,
        body, 
        token, 
        username, 
        password, 
        authType
      };
      requestsArray.push(newRequest);
    }     

    chrome.storage.local.set({ requests: requestsArray });

    chrome.storage.local.set({ current_request: newRequest })
    
    reloadRequestsDescriptions(newRequest.id);
  });
}


function createItemForListOfRequests({ requestInfo, requestIndex, highlight }) {  

  const itemDescription = document.createElement("span");
  itemDescription.innerText = `${requestInfo.method} - ${requestInfo.description}`
  itemDescription.style.cursor = "pointer"
  itemDescription.classList.add('list-of-items')

  if(highlight === requestIndex){
    itemDescription.style.fontWeight = 700
  }

  itemDescription.addEventListener("click", () => {   
    document.querySelectorAll('.list-of-items').forEach(item => item.style.fontWeight = 300)
    itemDescription.style.fontWeight = 700
    chrome.storage.local.get(['requests'], function(result) {
    chrome.storage.local.set({ current_request: result.requests[requestIndex] })
      document.querySelector("#url").value = result.requests[requestIndex].url || ''
      document.querySelector("#method").value = result.requests[requestIndex].method || 'GET'
      document.querySelector("#body").value = result.requests[requestIndex].body || ''
      document.querySelector("#token").value = result.requests[requestIndex].token || ''
      document.querySelector("#password").value = result.requests[requestIndex].password || ''
      document.querySelector("#authType").value = result.requests[requestIndex].authType || 'none'
      document.querySelector("#username").value = result.requests[requestIndex].username || ''
    })
  })

  const itemTrash = document.createElement("button");
  itemTrash.classList.add("remove-request")
  itemTrash.innerText = 'x'
  itemTrash.addEventListener("click", () => {
    chrome.storage.local.set({ current_request: {} })
    document.querySelector("#url").value = ""
    document.querySelector("#method").value = "GET"
    document.querySelector("#body").value = ""

    chrome.storage.local.get(['requests'], function(result) {
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

document.getElementById("method").addEventListener("change", () => {
  chrome.storage.local.get(['current_request'], function(result) {
    if(result.current_request !== undefined){
      const value = document.getElementById("method").value     
      setListOfRequests({
        id: result.current_request.id,
        method: value,
      })
    }   
  }) 
})


document.getElementById("body").addEventListener("keyup", () => {
  const value = document.getElementById("body").value
  const sendButton = document.getElementById("sendRequest")
  const feedbackBody = document.getElementById("feedbackBody")
  let parsedValue;
  
  try {
    parsedValue = JSON.parse(value);
    
    // Verifica se o valor é um objeto
    if (typeof parsedValue !== 'object' || parsedValue === null) {
      throw new Error('Invalid object');
    }

    // Habilita o botão e esconde o feedback
    feedbackBody.style.display = 'none';
    sendButton.removeAttribute("disabled");

    chrome.storage.local.get(['current_request'], function(result) {   
      if(result.current_request !== undefined ){      
        setListOfRequests({
          id: result.current_request.id,
          body: value,
        })
      }   
    }) 
    
  } catch (e) {
    // Desabilita o botão e exibe o feedback se o JSON for inválido
    sendButton.setAttribute("disabled", "disabled");
    feedbackBody.style.display = 'flex';
  }

 
})

document.getElementById("url").addEventListener("keyup", () => {
  chrome.storage.local.get(['current_request'], function(result) {
    if(result.current_request !== undefined){
      const value = document.getElementById("url").value
      setListOfRequests({
        id: result.current_request.id,
        url: value,
      })
    }
    
  }) 
})

document.getElementById("token").addEventListener("keyup", () => {
  chrome.storage.local.get(['current_request'], function(result) {
    if(result.current_request !== undefined){
      const value = document.getElementById("token").value
      setListOfRequests({
        id: result.current_request.id,
        token: value,
      })
    }
    
  }) 
})


document.getElementById("username").addEventListener("keyup", () => {
  chrome.storage.local.get(['current_request'], function(result) {
    if(result.current_request !== undefined){
      const value = document.getElementById("username").value
      setListOfRequests({
        id: result.current_request.id,
        username: value,
      })
    }
    
  }) 
})

document.getElementById("password").addEventListener("keyup", () => {
  chrome.storage.local.get(['current_request'], function(result) {
    if(result.current_request !== undefined){
      const value = document.getElementById("password").value
      setListOfRequests({
        id: result.current_request.id,
        password: value,
      })
    }
    
  }) 
})

document.getElementById("authType").addEventListener("change", () => {
  chrome.storage.local.get(['current_request'], function(result) {
    if(result.current_request !== undefined){
      const value = document.getElementById("authType").value
      setListOfRequests({
        id: result.current_request.id,
        authType: value,
      })
    }
    
  }) 
})
