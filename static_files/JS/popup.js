const serverEndpoint = 'http://64.190.90.49:7788';

async function authedFetch(url) {
    return await fetch(url, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('firebaseToken')
        }
    });
}

async function loadData() {
    var arr = await (await fetch(serverEndpoint + '/api/projects')).json();
    var user = await (await authedFetch(serverEndpoint + '/api/user')).json();
    console.log(user);
    
    var data = ''
    arr.forEach(element => {
        var generatedSym = ""
        var sym = element[1].split(' ')
        sym.forEach(ell => {
            generatedSym = generatedSym + ell[0]
        })
        data = data + `<div class="card mb-3"><div class="card-body"> <div class="d-flex flex-column flex-lg-row"> <div class="row flex-fill"> <div class="col-sm-5"> <h4 class="h5">${element[1]}</h4> <span class="avatar avatar-text rounded-3 me-4 bg-warning mb-2" style="position: absolute; right: 0;">${generatedSym}</span> <span class="badge bg-secondary">Tasks completed: </span> ${element[5]} </div> <div class="col-sm-4 py-2"> <span class="badge bg-secondary">Earnings: </span> ${element[6]} ELOS </div> </div> </div> </div> </div></div>`
    });
    document.getElementById("orgs").innerHTML= data;
}
window.onload = async function() {
    if (localStorage.getItem('firebaseToken')) {
        const res = await fetch(serverEndpoint + '/api/user', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('firebaseToken')
            }
        });
        if (res.status !== 401) {
            document.getElementById('main-stats').style.display = 'block';
            loadData();
            return;
        }
    }
    window.open('static_files/HTML/organizations.html');
};

