const puppeteer = require('puppeteer');
const promt = require('prompt-sync')();
const fs = require('fs');
var interval;

var searchResult = [];

function log(m){
  console.log(m)
}
function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

(async () => {
  const browser = await puppeteer.launch({headless:false, devtools:false,});
  const page = await browser.newPage();
  log("Goto MLWBD")
  await page.goto('https://mlwbd.bond/');
  await page.waitForSelector('#s');
  await page.type('#s',"iron man");
  await page.waitForSelector('form > .search-button');
  await page.click('form > .search-button')
  log("searching...")

  await page.waitForSelector(".title > a")


 let link = await page.evaluate(()=>
            Array.from(document.querySelectorAll(".title > a"),
            (e,i)=>{return {id:i,title :e.innerText,src:e.href}}));
  log("searching completed")

//console.log(link);

var searchId = 1//promt("Enter search result Id:")
var targetedResult = link[parseInt(searchId)];

 await page.goto(targetedResult.src);
 log("fetched searching...")

await page.waitForSelector('[data-wpel-link="internal"]');
await page.click('[data-wpel-link="internal"]');
log("click target....")

const pageTarget = page.target();
const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
//get the new page object:
const newPage = await newTarget.page();


await newPage.waitForSelector('form > .myButton');
await newPage.click('form > .myButton')
log("tap download button 1...")

let currentUrl =  null; 

  // setTimeout(async () => {
    log("waiting...")

    await delay(10000)
    log("waiting... done")

    await newPage.waitForSelector('#download-button')
    await newPage.click('#download-button')
    log("tap download button #download-button...")


  log("waiting for load")
  await newPage.waitForNavigation({waitUntil:'domcontentloaded'})
  await newPage.waitForSelector('script');
      console.log("domcontentloaded");

     await newPage.evaluate(()=>{
        document.title = "111"
        getLink();
        getMainDownload();
      })

    await newPage.waitForSelector('#main-download')
    await newPage.click('#main-download')
    log("tap download button #main-download...")

    await delay(2000);
    await newPage.waitForSelector('#download')
    log("tap download button #download...")
    await newPage.click('#download')
    log("clicked download button #download...")

    log(" waiting for Main download button")
  
  await newPage.waitForNavigation({waitUntil:'load'}).then(async()=>{
    log("page loaded")
     await newPage.waitForSelector(".btn").then(async()=>{
    log("find main download button")
    await delay(3000)
     await newPage.click(".btn");
    log("clicked Main download button")
  });
  })
 

  await newPage.waitForNavigation({
    waitUntil:'load'
  })
  log("wait for link")
   let d = await newPage.evaluate(()=>{
    let data = []
    let f1 = "";
    document.querySelectorAll('.entry-content > p > strong').forEach(el=>{
      
      if(el.style.display != 'none'){
        let x = {
            res:"",
            link:[]
        }
        if(el.children.length === 0)f1 = el.innerText;
        else{
            for(let i = 0; i < el.children.length;i++){
                let y = {
                    name:el.children[i].innerText,
                    src:el.children[i].href
                }
                x.res = f1;
                x.link.push(y);
            }
        }
     data.push(x)
      }
    })
  
    return data;    
  })

  for (let i = 0; i < d.length; i++) {
    if(d[i].link.length === 0)continue;
    console.log(`${i} ${d[i].res} \n`);
    d[i].link.forEach((el,k)=>{
      console.log(`\t ${k} ${el.name} ${el.src}`)
    })
  }
  let x = promt("x:")
  let y = promt("y:")
  await newPage.goto(d[x].link[y].src);
  log("10%")
  await newPage.waitForNavigation({waitUntil:'load'}).then(async()=>{
      await newPage.click('.butt');
  })
log("69%")
  await newPage.waitForSelector(".btn").then(async()=>{
      await newPage.click(".btn")
  })
log("99.9%");
  await newPage.waitForNavigation({waitUntil:'load'}).then(async()=>{
      console.log(await newPage.url());
      browser.close()
  })

})();
