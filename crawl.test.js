const {test,expect} = require('@jest/globals');

const {normalizeURL} = require('./crawl.js');

const {getURLsFromHTML} = require('./crawl.js');

test('normalizeURL',()=>{
    expect(normalizeURL('https://boot.dev/')).toBe('boot.dev');
});

test('getURLsFromHTML',()=>{
    const urls = ['https://blog.boot.dev/']
    expect(getURLsFromHTML('<html><body><a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a></body></html','https://boot.dev'))
    .toStrictEqual(urls);
});

