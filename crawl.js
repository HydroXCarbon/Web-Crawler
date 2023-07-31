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
    //check is domain correct
    currentURL = new URL(currentURL);
    baseURL = new URL(baseURL);
    if ( currentURL.hostname !== baseURL.hostname){
        return pages;
    }

    const normalizedURL = normalizeURL(currentURL);

    //check if already crawled
    if (pages[normalizedURL] > 0){
        pages[normalizedURL] += 1;
        return pages;
    }

    //check is URL already in pages
    if (normalizedURL.hostname === baseURL.hostname){
        pages[normalizedURL] = 0;
    }else{
        pages[normalizedURL] = 1;
    }

    //crawl the page
    console.log(`crawling ${currentURL}...`)
    let htmlBody = '';
    try{
        const response = await fetch(currentURL);
        if(response.status > 399){
            console.log(`HTTP error: ${response.status}`);
            return pages;
        }
        const contentType = response.headers.get('content-type');
        if (!contentType.includes('text/html')){
            console.log(`Got non-html response: ${contentType}`);
            return pages;
        }
        htmlBody = await response.text();
        //console.log(htmlBody)
    }catch(err){
        console.log(`Error: ${err.message}`);
    }
    
    const nextURLs = getURLsFromHTML(htmlBody, baseURL);
    for(const nextURL of nextURLs){
        pages = await crawlPage(baseURL, nextURL, pages);
    }

    return pages;
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}
