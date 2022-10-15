// too many weird restrictions. i have given up //

// const serverEndpoint = 'http://64.190.90.49:7788';
// let token = null;

// async function authedFetch(url) {
//     return await fetch(url, {
//         headers: {
//             Authorization: 'Bearer ' + localStorage.getItem('firebaseToken')
//         }
//     });
// }

// async function sleep(ms) {
//     return new Promise((resolve) => setTimeout(resolve, ms));
// }

// onmessage = function(msg) {
//     console.log(msg);
// }

// async function main() {
//     while (true) {
//         await sleep(1000);
//         if (!localStorage.getItem('firebaseToken')) {
//             continue;
//         }
//         console.log(await authedFetch(serverEndpoint + '/api/users'));
//     }
// }

// main()