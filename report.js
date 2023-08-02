function printReport(pages){
    console.log('Generating report')
    const sortedPages = sort(pages)
    for (page of sortedPages){
        console.log(`Found ${pages[page]} internal links to ${page}`)
    }
}

function sort(pages){
    const sortedPages = Object.keys(pages).sort((a,b) => {
        if (pages[a] > pages[b]){
            return -1
        }else if (pages[a] < pages[b]){
            return 1
        }else{
            return 0
        }
    })
    return sortedPages
}

module.exports = {
    printReport
}