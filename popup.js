document.getElementById("sendRequest").addEventListener("click", async () => {
    const method = document.getElementById("method").value;
    const url = document.getElementById("url").value;
    let body = document.getElementById("body").value;
  
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
  
      const response = await fetch(url, options);
      const result = await response.json();
      document.getElementById("response").textContent = JSON.stringify(result, null, 2);
    } catch (error) {
      document.getElementById("response").textContent = `Error: ${error.message}`;
    }
  });
  