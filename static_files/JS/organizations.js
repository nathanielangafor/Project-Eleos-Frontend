async function loadData() {
    var arr = await (await fetch('https://port-7788.ms.binary-person.dev/api/projects')).json();
    var user = await (await fetch('https://port-7788.ms.binary-person.dev/api/user')).json();
    document.getElementById('user-greeting').textContent = 'Welcome ' + user.displayName;
    document.getElementById('');

    var data = ''
    arr.forEach(element => {
        var generatedSym = ""
        var sym = element['name'].split(' ')
        sym.forEach(ell => {
            generatedSym = generatedSym + ell[0]
        })
        data = data + `<div class="card mb-3"> <div class="card-body"> <div class="d-flex flex-column flex-lg-row"> <span class="avatar avatar-text rounded-3 me-4 bg-warning mb-2">${generatedSym.toUpperCase()}</span> <div class="row flex-fill"> <div class="col-sm-5"> <h4 class="h5">${element['name']}</h4> <span class="badge bg-secondary">${element['location']}</span> </div> <div class="col-sm-4 py-2"> <span class="badge bg-secondary">${element['tags'][0]}</span>  </div> <div class="col-sm-3 text-lg-end"> <a href="#" onClick="" class="btn btn-primary stretched-link">Donate Resources!</a> </div> </div> </div> </div> </div>`
    });
    document.getElementById("orgs").innerHTML = data;
}

window.onload = function () {
    if (firebase.auth().currentUser) {
        loadData();
    } else {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                loadData();
            }
        });
    }
};


