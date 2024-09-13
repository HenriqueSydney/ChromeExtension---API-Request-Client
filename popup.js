document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("sendRequest").addEventListener("click", async () => {
        const method = document.getElementById("method").value;
        const url = document.getElementById("url").value;
        let body = document.getElementById("body").value;
    
        const loading = document.getElementById("loading")
        const feedback = document.getElementById("feedback")
    
        const header = document.getElementById("headers");
        const responseField = document.getElementById("response")
        const cookie = document.getElementById("cookies")
    
        const headerContainer = document.getElementById("headers_container");
        const responseContainer = document.getElementById("response_container")
        const cookieContainer = document.getElementById("cookies_container")
    
        loading.innerHTML = "Carregando...";
        loading.style.display = "flex";
        feedback.style.display = "none";
        //https://jsonplaceholder.typicode.com/posts
    
        try {
          let options = {
            method,
            headers: {
                "Content-Type": "application/json"
              }
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
      
          const response = await fetch(url, options);
          const contentType = response.headers.get('Content-Type');
    
          let result;
          let responseText;
          responseContainer.style.display = "flex";
          if (contentType && contentType.includes('application/json')) {      
            result = await response.json();  
            responseField.textContent = JSON.stringify(result, null, 2);      
          } else {       
            responseField.textContent = await response.text(); 
          }
    
          const headers = response.headers      
    
          loading.innerHTML = "";
          loading.style.display = "none";
    
          
         responseText;
    
          let headersText = '';
          headers.forEach((value, name) => {
            headersText += `${name}: ${value}\n`;
          });
    
          headerContainer.style.display = "flex";
          header.textContent = headersText
    
          const cookies = document.cookie; 
         
          const cookiesArray = cookies.split(';').map(cookie => cookie.trim());
          const cookiesText = cookiesArray.join('\n');
    
          if(cookiesText){
            cookieContainer.style.display = "flex";
            cookie.textContent = cookiesText
          }
    
         
        } catch (error) {
            headerContainer.style.display = "none";
            cookieContainer.style.display = "none";
    
    
            feedback.innerHTML = "Um erro ocorreu durante a tentativa de realizar a requisição"
            feedback.style.display = "flex";
    
            loading.style.display = "none";
    
            responseContainer.style.display = "flex";
            response.textContent = error.message;
        }
      });
})