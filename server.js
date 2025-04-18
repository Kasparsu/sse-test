import express from 'express';
const app = express();
const port = 3000;
let messages = [];
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

app.use(express.urlencoded());

app.get('/',async (req, res) => {
    res.set('Content-Type', 'text/html');
    res.set('Connection', 'keep-alive');
    res.set('Cache-Control', 'no-cache');

    res.write('<iframe src="/input" height="50"></iframe>');
    
    let closed = false;
    req.on('close', () => {
        closed = true;
    });

    messages.forEach(message => {
        res.write(`<p>${message.message}</p>`);
    });

    let date = new Date();
    let filteredMessages = [];
    do {
        await sleep(1000);
        filteredMessages = messages.filter(msg => msg.date > date);
        if(filteredMessages.length) {
            let lastMessage = filteredMessages[filteredMessages.length-1];
            date = new Date(lastMessage.date);
        }
        filteredMessages.forEach(message => {
            res.write(`<p>${message.message}</p>`);
        });
        
    } while(!closed)
});
app.get('/input', (req, res) => {
    res.send('<form action="/input" method="POST"><input name="message"><button>Send</button></form>')
});
app.post('/input', (req, res) => {
    messages.push({message: req.body.message, date: new Date()});
    res.redirect('/input');
});
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})