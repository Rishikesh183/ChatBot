const API_KEY = "AIzaSyCpwk8T2rSLO-yOU0iH2_cc0LjSg5QlMto"; // replace your API Key here.

document.addEventListener("DOMContentLoaded", function (event) {
    const chatBodyScroll = document.getElementById("chat-body-scroll");
    chatBodyScroll.scrollTop = chatBodyScroll.scrollHeight;
    let sendButton = document.getElementById("send-button");
    sendButton.addEventListener("click", sendMessage);

    let userInput = document.getElementById("user-input");
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});

function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput) return;

    appendMessage(userInput, "sent");
    document.getElementById("user-input").value = "";

    fetchResponseFromGPT(userInput);

}


function appendMessage(message, sender) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("chat-message", sender);
    messageContainer.innerHTML = message;

    document
        .getElementById("chat-box-append")
        .appendChild(messageContainer);

    const chatBodyScroll = document.getElementById("chat-body-scroll");
    chatBodyScroll.scrollTop = chatBodyScroll.scrollHeight;
}


async function fetchResponseFromGPT(message) {

    document.getElementById("typing").classList.add("show-typing");
    
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: message }],
                    },
                ],
            }),
        }
    ).catch((e)=>{
        let er = `<p id="error-text">Error Occur <br> Try Again..<br>Error is:${e}</p>`;
        appendMessage(er, "received");
        // alert("erro Occur"+e)
        // console.log(e);
    })

    try{
        const data = await response.json();
        // console.log({data});
        const text = data.candidates[0].content.parts[0].text;
        let markedText = marked.parse(text);
        appendMessage(markedText, "received");
    }catch(e){
        // alert("erro Occur"+e)
        let er = `<p id="error-text">Error Occur <br> Try Again..<br>Error is:${e}</p>`;
        appendMessage(er, "received");
    }

    hilightCodeBlock();
    document.getElementById("typing").classList.remove("show-typing");

}


function hilightCodeBlock() {
    document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightBlock(block);
    });
}
