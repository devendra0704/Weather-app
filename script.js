const express=require('express')
const https=require('https')
const fs=require('fs')
const bodyParser=require('body-parser')

const app=express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'));


const port=5000;

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/public/index.html")

})


app.post('/',(req,res)=>{
    console.log("all working")
       const location=req.body.cityname
        const url="https://api.weatherapi.com/v1/current.json?key=ca25a6635deb4f6283052442231307&q="+location+"&aqi=no";
    https.get(url,(response)=>{
        
        response.on('data',(data)=>{
            const weatherData=JSON.parse(data)
            const temp=weatherData.current.temp_c
            const description=weatherData.current.condition.text
            const icon=weatherData.current.condition.icon
            // res.write("<h1>temperature of "+ location+" is "+temp+" degree celcius </h1>")
            // res.write("description :"+description)
            // res.write("<image src="+icon+">")
            // res.send()
            fs.readFile(__dirname + '/public/weather.html', 'utf8', (err, html) => {
                if (err) {
                    res.status(500).send("Error loading the page");
                    return;
                }

                let modifiedHtml = html.replace('{{location}}', location)
                                        .replace('{{temp}}', temp)
                                        .replace('{{description}}', description)
                                        .replace('{{icon}}', icon);
                res.send(modifiedHtml);
            });

        })
    })
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })