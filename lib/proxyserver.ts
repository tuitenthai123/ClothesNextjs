const proxyUrl = "http://localhost:8080/";
const targetUrl = "https://firebasestorage.googleapis.com/v0/b/doan2-e8d30.appspot.com/";
fetch(proxyUrl + targetUrl)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));
