document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("sendRequest").addEventListener("click", async () => {      
        const method = document.getElementById("method").value;
        const url = document.getElementById("url").value;
        let body = document.getElementById("body").value;
    
        const loading = document.getElementById("loading")
        const feedback = document.getElementById("feedback")
        const tag_status = document.getElementById("tag_status")
        const tag_time = document.getElementById("tag_time")
        const tag_bites = document.getElementById("tag_bites")
    
        const header = document.getElementById("headers");
        const responseField = document.getElementById("response")
        const cookie = document.getElementById("cookies")

        const authType = document.getElementById("authType").value
        
        let headers = {
          "Content-Type": "application/json"
        };
        if(authType === 'bearer'){
          const bearerToken = document.getElementById("token").value
          if (bearerToken) {
            headers["Authorization"] = `Bearer ${bearerToken}`;
          }
        } else if (authType === 'basic'){
          const username = document.getElementById("username").value
          const password = document.getElementById("password").value
          if (username && password) {
            const basicToken = btoa(`${username}:${password}`);
            headers["Authorization"] = `Basic ${basicToken}`;
          }
        }
    
        loading.innerHTML = "Carregando...";
        loading.style.display = "flex";
        feedback.style.display = "none";
        //GET => https://api.restful-api.dev/objects
        //POST => https://api.restful-api.dev/objects
        //PATCH, PUT, DELETE => https://api.restful-api.dev/objects/{id}
    
        try {
          let options = {
            method,
            headers
          };
      
          if (body && method !== "GET") {
            options.body = JSON.stringify(JSON.parse(body));
          }
    
          if(url.trim() === ""){
            feedback.innerHTML = "Preencha o campo da URL"
            feedback.style.display = "flex";
            loading.style.display = "none";
            return;
          }     
          const startTime = performance.now();
          const response = await fetch(url, options);
          const endTime = performance.now();
          const duration = endTime - startTime;
          tag_time.innerText = `${duration.toFixed(2)} ms`;


          let result;         
          tag_status.innerText = response.status.toString() 
          if(response.status.toString().substring(0,1) === "2" ){
            tag_status.classList.remove("warning");
            tag_status.classList.remove("error");
            tag_status.classList.add("success");
          } else if(response.status.toString().substring(0,1) === "5" ){
            tag_status.classList.remove("warning");
            tag_status.classList.remove("success");
            tag_status.classList.add("error");
            tag_status.innerText = "Error" 
          } else {
            tag_status.classList.remove("success");
            tag_status.classList.remove("error");
            tag_status.classList.add("warning");
          }

          const contentType = response.headers.get('Content-Type');
     
          if (contentType && contentType.includes('application/json')) {      
            result = await response.json();  
            responseField.textContent = JSON.stringify(result, null, 2);      
          } else {       
            responseField.textContent = await response.text(); 
          }
    
          const headers = response.headers      
    
          loading.innerHTML = "";
          loading.style.display = "none";
    
              
          let headersText = '';
          headers.forEach((value, name) => {
            headersText += `${name}: ${value}\n`;
          });
    
        
          header.textContent = headersText

          const contentLength = response.headers.get('Content-Length');
          if (contentLength) {
            tag_bites.innerText = `${contentLength} B`;
          } else {
            tag_bites.innerText = "--- B";
          }

    
          const cookies = document.cookie; 
         
          const cookiesArray = cookies.split(';').map(cookie => cookie.trim());
          const cookiesText = cookiesArray.join('\n');
    
          if(cookiesText){           
            cookie.textContent = cookiesText
          }
    
         
        } catch (error) {     
          console.error(error)
          feedback.innerHTML = "Um erro ocorreu durante a tentativa de realizar a requisição"
          feedback.style.display = "flex";
  
          loading.style.display = "none";

          tag_status.classList.remove("warning");
          tag_status.classList.remove("success");
          tag_status.classList.add("error");
          tag_status.innerText = "Error" 
          
          responseField.textContent = error.message;
        }
      });
})