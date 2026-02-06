const chat = document.getElementById("chat");

/* Bot message with image */
function bot(msg){
  const row = document.createElement("div");
  row.className = "message-row";

  const img = document.createElement("img");
  img.src = "bot.jpeg";
  img.className = "bot-avatar";

  const d = document.createElement("div");
  d.className = "bot";
  d.innerText = msg;

  row.appendChild(img);
  row.appendChild(d);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

/* User message */
function user(msg){
  const d = document.createElement("div");
  d.className = "user";
  d.innerText = msg;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;

  //Send message to Python backend
  sendToBackend(msg);
}

/* Send message to Python Flask backend */
function sendToBackend(message){
  fetch("http://127.0.0.1:5000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: message })
  })
  .then(response => response.json())
  .then(data => {
    bot(data.reply);   // show backend reply
  })
  .catch(error => {
    bot("Server not connected. Please try again.");
  });
}

/* Options buttons */
function options(list, callback){
  const wrap = document.createElement("div");
  wrap.className = "options";

  list.forEach(t=>{
    const b = document.createElement("button");
    b.innerText = t;
    b.onclick = ()=>{
      wrap.remove();
      user(t);        // goes to backend now
      callback(t);
    };
    wrap.appendChild(b);
  });

  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
}

/* Chat flow */
function start(){
  bot("Hello! I am Healthbot, how can I help you?");
  options(["I AM SICK","NOT FEELING WELL","HELP ME"], problem);
}

function problem(){
  bot("Please describe your problem?");
  options(["COLD","FEVER","ABDOMINAL PAIN"], handleIssue);
}

function handleIssue(choice){
  if(choice === "FEVER"){
    bot("Is the temperature greater than 98.6°F?");
    options(["YES","NO"], ans=>{
      if(ans === "YES") throat();
      else bot("Please monitor your health and take rest.");
    });
  }
  else if(choice === "COLD"){
    bot("You may have common cold. Drink warm fluids and rest.");
  }
  else{
    bot("For abdominal pain please consult a doctor if severe.");
  }
}

function throat(){
  bot("Do you have sore throat?");
  options(["YES","NO"], a=>{
    if(a === "YES") eating();
    else bot("Please take rest and fluids.");
  });
}

function eating(){
  bot("Do you have difficulty in eating?");
  options(["YES","NO"], a=>{
    if(a === "YES") diagnose();
    else bot("Take warm water and soft food.");
  });
}

function diagnose(){
  bot("Seems like tonsillitis leading to fever. Want medicine suggestion?");
  options(["YES","NO"], a=>{
    if(a === "YES")
      bot("Acetaminophen or Ibuprofen can reduce pain & fever.");
    else
      bot("Please consult a doctor if condition worsens.");
  });
}

start();