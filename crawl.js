const { JSDOM } = require('jsdom');

function normalizeURL(url){
    const urlObj = new URL(url);
    let normalizedURL = `${urlObj.protocol}${urlObj.hostname}${urlObj.pathname}`
    if (normalizedURL.length > 0 && normalizedURL.slice(-1) === '/'){
        normalizedURL = normalizedURL.slice(0, -1)
    }
    return normalizedURL;
}

function getURLsFromHTML(htmlBody,baseURL){
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const aElements = dom.window.document.querySelectorAll('a');
    for ( const aElement of aElements){
        if (aElement.href.slice(0,1) === '/'){
            try{
                urls.push(new URL(aElement.href,baseURL).href);
            }catch(err){
                console.log(`${err.message}: ${aElement.href}}`)
            }
        }else{
            try{
                urls.push(new URL(aElement.href).href);
            }catch(err){
                console.log(`${err.message}: ${aElement.href}}`)
            }
        }
    }
    return urls;
}

async function crawlPage(baseURL, currentURL, pages){
    //check if we are already crawling this page
    if (!currentURL.includes(baseURL)){
        return pages;
    }
    currentURL = normalizeURL(currentURL);

    //crawl the page
    console.log(`crawling ${currentURL}...`)
    try{
        const response = await fetch(currentURL);
        if(response.status > 399){
            console.log(`HTTP error: ${response.status}`);
            return;
        }
        const contentType = response.headers.get('content-type');
        if (!contentType.includes('text/html')){
            console.log(`Got non-html response: ${contentType}`);
            return;
        }
        const htmlBody = await response.text();
        console.log(htmlBody)
        pages = pages.concat(getURLsFromHTML(htmlBody, baseURL));
    }catch(err){
        console.log(`Error: ${err.message}`);
    }
    if(pages.length !== 0){
        const queueURL = pages.pop();
        crawlPage(baseURL, queueURL, pages);
    }
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}
