const serverEndpoint = 'http://64.190.90.49:7788';

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
    var Name = ''
    arr.forEach(element => {
        var generatedSym = ""
        var sym = element['name'].split(' ')
        sym.forEach(ell => {
            generatedSym = generatedSym + ell[0]
            Name = Name + ell.charAt(0).toUpperCase() + ell.slice(1) + " "
        })
        data = data
            + `
        <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex flex-column flex-lg-row">
                    <span class="avatar avatar-text rounded-3 me-4 bg-warning mb-2">${generatedSym.toUpperCase()}</span>
                    <div class="row flex-fill">
                        <div class="col-sm-5">
                            <h4 class="h5">${Name}</h4>
                            <span class="badge bg-secondary">${element['location']}</span>
                        </div>
                        <div class="col-sm-4 py-2">
                            <span class="badge bg-secondary">${element['tags'][0]}</span>
                        </div>
                        <div class="col-sm-3 text-lg-end">
                            <a href="#" data="${element.id}" class="btn btn-primary stretched-link donate-event-handler">${user.projects.includes(element.id) ? 'Currently donating' : 'Donate resources!'}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
        Name = ''
    });
    document.getElementById("orgs").innerHTML = data;
    for (const element of document.getElementsByClassName('donate-event-handler')) {
        element.onclick = donate;
    }
}

async function donate(event) {
    event.preventDefault();
    const projectId = event.target.getAttribute('data');

    var user = await (await authedFetch(serverEndpoint + '/api/user')).json();

    if (!user.projects.includes(projectId)) {
        await authedFetch(serverEndpoint + '/api/user/addProject?id=' + encodeURIComponent(projectId));
    } else {
        await authedFetch(serverEndpoint + '/api/user/removeProject?id=' + encodeURIComponent(projectId));
    }
    loadData();
}

async function loadWorker() {
    // do it in-page for now for simplicity and demo purposes
    const worker = new Worker('../JS/worker.js');
    const resendToken = async () => worker.postMessage({ token: await firebase.auth().currentUser.getIdToken() });
    resendToken();
    setInterval(resendToken, 30000);
}

window.onload = function () {
    firebase.auth().onAuthStateChanged(async user => {
        if (user) {
            loadData();
            loadWorker();
        } else {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(location.href);
        }
        localStorage.setItem('firebaseToken', await firebase.auth().currentUser?.getIdToken());
    });
};


