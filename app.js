const puppeteer = require('puppeteer');
const promt = require('prompt-sync')();
const fs = require('fs');

var logCount = 23;
var step = 0;
var char = "="
let l = char;
function log(){
  step++;
  console.log(l,Math.floor((step/logCount)*100)+'%');
  l += char
}
function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
let search ;

(async () => {
  search = promt("Search:")
  const browser = await puppeteer.launch({headless:false, devtools:false,});
  const page = await browser.newPage();
  await page.goto('https://mlwbd.bond/');
  await page.waitForSelector('#s');
  await page.type('#s',search);
  log()
  await page.waitForSelector('form > .search-button');
  await page.click('form > .search-button')
  await page.waitForSelector(".title > a")
  log()

 let link = await page.evaluate(()=>
            Array.from(document.querySelectorAll(".title > a"),
            (e,i)=>{return {id:i,title :e.innerText,src:e.href}}));
  log()

  link.forEach(el=>{
    console.log(el.id,el.title)
    console.log('\n');
  })

var searchId = promt("Enter search result Id:")
var targetedResult = link[parseInt(searchId)];

 await page.goto(targetedResult.src);
 log()

await page.waitForSelector('[data-wpel-link="internal"]');
await page.click('[data-wpel-link="internal"]');
log()

const pageTarget = page.target();
const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
//get the new page object:
const newPage = await newTarget.page();


await newPage.waitForSelector('form > .myButton');
await newPage.click('form > .myButton')
log()

    log()

    await delay(6000)
    log()

    await newPage.waitForSelector('#download-button')
    await newPage.click('#download-button')
    log()


  log()
  await newPage.waitForNavigation({waitUntil:'domcontentloaded'})
  await newPage.waitForSelector('script');

     await newPage.evaluate(()=>{
        document.title = "111"
        getLink();
        getMainDownload();
      })

    await newPage.waitForSelector('#main-download')
    await newPage.click('#main-download')
    log()

    await delay(2000);
    await newPage.waitForSelector('#download')
    log()
    await newPage.click('#download')
    log()

    log()
  
  await newPage.waitForNavigation({waitUntil:'load'}).then(async()=>{
    log()
     await newPage.waitForSelector(".btn").then(async()=>{
    log()
    await delay(3000)
     await newPage.click(".btn");
    log()
  });
  })
 

  await newPage.waitForNavigation({
    waitUntil:'load'
  })
  log()
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
      console.log(`\t id ${k} ${el.name}`)
    })
  }
  let x = promt("x:")
  log();
  let y = promt("y:")
  log();

  await newPage.goto(d[x].link[y].src);
  log()
  await newPage.waitForNavigation({waitUntil:'load'}).then(async()=>{
      await newPage.click('.butt');
  })
log()
  await newPage.waitForSelector(".btn").then(async()=>{
      await newPage.click(".btn")
  })
log();
  await newPage.waitForNavigation({waitUntil:'load'}).then(async()=>{
      console.log(await newPage.url());
      browser.close()
  })

})();
