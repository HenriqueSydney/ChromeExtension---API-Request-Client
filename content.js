/* eslint-disable no-undef */
chrome.runtime.onMessage.addListener((request) => {
    
  if (request.type === 'popup-modal') {
    showModal();
  }
});
  
function showModal() {
  const modal = document.createElement("dialog");
  modal.setAttribute("style", `
    width: 80%;
    height: 600px;
    border: none;
    top: 10px;
    border-radius: 20px;
    background-color: #202024;
    position: fixed; 
    box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
  `);

  modal.innerHTML = `
    <iframe id="popup-content" style="height: 100%; width: 100%"></iframe>
    <div style="position: absolute; top: 10px; left: 10px">
      <button id="close-button" style="
        padding: 8px 12px; 
        font-size: 1rem; 
        border: 1px solid rgba(64, 0, 191, 0.7); 
        border-radius: 20px; 
        background-color: transparent; 
        cursor: pointer;
        transition: background-color 0.4s;
      ">x</button>
    </div>
  `;    

  document.body.appendChild(modal);
  const dialog = document.querySelector("dialog");
  dialog.showModal();
  
  const iframe = document.getElementById("popup-content");
  iframe.src = chrome.runtime.getURL("index.html");
  iframe.frameBorder = 0;

  dialog.querySelector("button").addEventListener("click", () => {
    dialog.close();
  });

  document.querySelector('#close-button').addEventListener('mouseover', function() {
    this.style.backgroundColor = 'rgba(64, 0, 191, 0.7)'; 
  });
  
  document.querySelector('#close-button').addEventListener('mouseout', function() {
    this.style.backgroundColor = 'transparent';
  });


  
}
  