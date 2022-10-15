const serverEndpoint = location.href.includes('binary-person') ? 'https://port-7788.ms.binary-person.dev' : 'http://64.190.90.49:7788';

async function authedFetch(url) {
    return await fetch(url, {
        headers: {
            Authorization: 'Bearer ' + await firebase.auth().currentUser.getIdToken()
        }
    });
}

async function loadData() {
    var arr = await (await fetch(serverEndpoint + '/api/projects')).json();
    var user = await (await authedFetch(serverEndpoint + '/api/user')).json();
    document.getElementById('user-greeting').textContent = 'Welcome ' + user.displayName;
    document.getElementById('logout-btn').onclick = function() {
        firebase.auth().signOut();
    };
    document.querySelector('.enav-right').style.display = 'block';

    var data = ''
    arr.forEach(element => {
        var generatedSym = ""
        var sym = element['name'].split(' ')
        sym.forEach(ell => {
            generatedSym = generatedSym + ell[0]
        })
        data = data
            + `
        <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex flex-column flex-lg-row">
                    <span class="avatar avatar-text rounded-3 me-4 bg-warning mb-2">${generatedSym.toUpperCase()}</span>
                    <div class="row flex-fill">
                        <div class="col-sm-5">
                            <h4 class="h5">${element['name']}</h4>
                            <span class="badge bg-secondary">${element['location']}</span>
                        </div>
                        <div class="col-sm-4 py-2">
                            <span class="badge bg-secondary">${element['tags'][0]}</span>
                        </div>
                        <div class="col-sm-3 text-lg-end">
                            <a href="#" onClick="donate('${element.id}'); event.preventDefault()" class="btn btn-primary stretched-link">${user.projects.includes(element.id) ? 'Currently donating' : 'Donate resources!'}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    });
    document.getElementById("orgs").innerHTML = data;
}

window.donate = async function donate(projectId) {
    var user = await (await authedFetch(serverEndpoint + '/api/user')).json();

    if (!user.projects.includes(projectId)) {
        await authedFetch(serverEndpoint + '/api/user/addProject?id=' + encodeURIComponent(projectId));
    }
    loadData();
}

window.onload = function () {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            loadData();
        } else {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(location.href);
        }
    });
};


