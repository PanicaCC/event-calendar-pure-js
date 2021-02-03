async function startTest() {
    return await Promise.resolve('async is working')
}

startTest().then(console.log)