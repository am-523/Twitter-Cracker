const jsdom = require("jsdom")
const { JSDOM } = jsdom;
const { document } = new JSDOM(`...`).window;
const axios = require("axios");
const express = require('express')
const bodyParser = require('body-parser');
const port = 3000
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;

if (cluster.isMaster) {
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i=0;i<totalCPUs;i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster.fork();
    })
    
} else {
    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    
    app.get('/js', async (req, res) => {

        let code = req.body.data
        let answer = eval(code);
        res.json(answer)
    })
    
    app.listen(port, () => {
        console.log(`Solver app listening at http://localhost:${port}`)
    })
}
