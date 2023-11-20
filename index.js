const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.set("port", 9101);
app.use(express.json())

const browserP = puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],headless: true
  });
  
  app.post("/sunat", (req, res) => {
    let page;
    let body_filtros = req.body;
    console.log(body_filtros);
    (async () => {
      page = await (await browserP).newPage();
        await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
          await page.goto('https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp');
          await page.waitForSelector("#btnAceptar");  
          await page.type("#txtRuc",body_filtros.documento);
          await page.click("#btnAceptar");
          await page.waitForTimeout(3000);
          let salida = await page.evaluate(() => {
            var elemento = document.querySelectorAll('.list-group-item-heading'); 
            var elemento2 = document.querySelector('.tblResultado tbody tr td:first-of-type');

            console.log(elemento2);
            return {
              razon_social: elemento[1].innerHTML,
              actividades:  elemento2.innerHTML,
            };
          });
           res.send(salida);
          })()
          .catch(err => res.sendStatus(500))
          .finally(async () => await page.close())
        ;
  });
/* 
  app.post("/sunarp", (req, res) => {
    let page;
    let body_filtros = req.body;
    console.log(body_filtros);
    (async () => {
      page = await (await browserP).newPage();
      await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
        await page.goto('https://www.sunarp.gob.pe/seccion/servicios/detalles/0/c3.html');
        await page.click(".jcrm-botondetalle a");
        await page.waitForSelector("#MainContent_btnSearch");  
        await page.waitForTimeout(3000);
        await page.waitForSelector("#g-recaptcha-response");  
        await page.type("#MainContent_txtNoPlaca",body_filtros.documento);
        const captha = body_filtros.captcha;
        await page.evaluate(`document.getElementById("g-recaptcha-response").innerHTML="${captha}";`);
        await page.click("#MainContent_btnSearch");
        await page.waitForTimeout(3000);
        let response = await page.screenshot({ encoding: "base64", fullPage: true });
        let salida ={base64:response};
        res.send(salida);
      
          })()
          .catch(err => res.sendStatus(500))
          .finally(async () => await page.close())
        ;
  });
  
  
app.post("/minsa", (req, res) => {
    let page;
    let body_filtros = req.body;
    console.log(body_filtros);
    (async () => {
    
      page = await (await browserP).newPage();
      await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
      await page.goto('https://carnetvacunacion.minsa.gob.pe');
      await page.waitForTimeout(2000);
      await page.waitForSelector("#g-recaptcha-response");  
      await page.type("#txtFechaEmision",body_filtros.fechaemision);
      await page.type("#txtFechaNacimiento",body_filtros.fechanacimiento);
      await page.type("#jaFrmRegVacLstTipoDoc","1");// DNI
      await page.type("#jaFrmRegVacTxtNumDoc",body_filtros.documento);
      await page.click("#chkPolitica");
      const response = body_filtros.captcha;
      await page.evaluate(`document.getElementById("g-recaptcha-response").innerHTML="${response}";`);
      await page.waitForSelector("#btnCerrar");
      await page.click("#btnCerrar");
      await page.click("#btnEntrar");
      var apellido =body_filtros.apellido;
      await page.waitForTimeout(3000);
      let salida = await page.evaluate(({apellido}) =>{
          var elemento = document.querySelector('div.col-9')?.innerHTML|| 'Error'; 
        if(elemento.includes(apellido)){
          return "OK";
        }else {
          return "Error";
        } 
      },{apellido});
      console.log(salida);
      let resultado ="";
      if(salida=="OK"){   
        await page.waitForSelector(".jOptVacuna");
        await page.click(".jOptVacuna");
        await page.waitForTimeout(1000);
        await page.waitForSelector("#jaBntCertificado");
        await page.click("#jaBntCertificado");
        await page.waitForTimeout(2000);
        const pages = await (await browserP).pages();
        resultado = await pages[2].screenshot({ encoding: "base64", fullPage: true })
        await pages[2].close();
      }  else{
          resultado="Error";
      }
      res.send(resultado);
    
    })()
      .catch(err => res.sendStatus(500))
      .finally(async () => await page.close())
    ;
  });

   */
app.post("/", (req, res) => {
  res.send("tu documento es : "+req.body.documento);
});
    
app.listen(app.get("port"), () => 
  console.log("app running on port", app.get("port"))
);