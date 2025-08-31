app.js 에 routes/contactRrouters.js 를 미들웨어로 등록하는  코드의 빈칸을 완성하시오
const express = require("express")
const app = express()
const port = 3000;

app.get("/", (req, res)=>{
    res.status(200).send("Route 코드를 외부 파일로 관리!!");     
});

app.use("/contacts", require("./routes/contactRouters")); //router 미들웨어 등록

app.listen(port, () => {
    console.log(`${port}번 포트에서 서버 실행 중`);
}) 
