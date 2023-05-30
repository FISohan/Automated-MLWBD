const puppeteer = require('puppeteer');
const promt = require('prompt-sync')();
const fs = require('fs');
var interval;

var searchResult = [];

(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();

 await page.goto('https://mlwbd.bond/');

  await page.waitForSelector('#s');
  await page.type('#s',"iron man");
  await page.waitForSelector('form > .search-button');
  await page.click('form > .search-button')

  await page.waitForSelector(".title > a")


 let link = await page.evaluate(()=>
            Array.from(document.querySelectorAll(".title > a"),
            (e,i)=>{return {id:i,title :e.innerText,src:e.href}}));

//console.log(link);

var searchId = 1//promt("Enter search result Id:")
var targetedResult = link[parseInt(searchId)];

 await page.goto(targetedResult.src);

await page.waitForSelector('[data-wpel-link="internal"]');
await page.click('[data-wpel-link="internal"]');

const pageTarget = page.target();
const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
//get the new page object:
const newPage = await newTarget.page();


await newPage.waitForSelector('form > .myButton');
await newPage.click('form > .myButton')
let currentUrl =  null; 
 setTimeout(async () => {
    await newPage.waitForSelector('#download-button')
    await newPage.click('#download-button')
    currentUrl = await newPage.url();
    console.log(currentUrl)
}, 7000);

interval = setInterval(async() => {
  let x = await newPage.url();
  if(currentUrl != null){
    if(currentUrl !== x){
      console.log("fuck off");

     await newPage.evaluate(()=>{
        document.title = "111"
        getLink();
        getMainDownload();
      })
    await newPage.waitForSelector('#main-download')
    await newPage.click('#main-download')
    
    await newPage.waitForSelector('#download')
    await newPage.click('#download')
      
     await newPage.waitForSelector(".butt");
    // await newPage.click("a");
  
  setTimeout(async() => {
  await newPage.click(".btn");
  await newPage.waitForNavigation({
    waitUntil:'load'
  })
  
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
  await newPage.waitForNavigation({waitUntil:'load'})
  await newPage.click('.butt');


  
  // let content = await newPage.content();
  // console.log(content);
  await newPage.waitForSelector(".btn")
  await newPage.click(".btn")
  await newPage.waitForNavigation({waitUntil:'load'})
  console.log(await newPage.url());
  browser.close()
  }, 3000);


      clearInterval(interval);
    }
  }
}, 10000);





})();

/*
let data = []
document.querySelectorAll('.entry-content > p > strong').forEach(el=>{
    let x = {
        res:"",
        link:[]
    }
    if(el.children.length === 0)x.res = el.innerText;
    else{
        for(let i = 0; i < el.children.length;i++){
            let y = {
                name:el.children.innerText,
                src:el.children[i].href
            }
            x.link.push(y);
        }
    }
 data.push(x)
})


*/