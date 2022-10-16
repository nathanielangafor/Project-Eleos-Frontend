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
    var userProjectIDs = user['projects'];
    
    var Name = ''
    var data = ''
    var totalEarnings = 0
    var totalHours = 1

    userProjectIDs.forEach(outterElem => {
        arr.filter(function(item){
            
            var tasks = item['tasks']
            var completedTasks = 0

            for (let i = 0; i < tasks; i++) {
                console.log(item['taskData'])
                if (item['taskData'][i] != null) {
                    completedTasks++;
                }
            }

            if (item['id'] == outterElem) {
                var earnings = completedTasks * item['pricePerTask']
                totalEarnings = earnings + totalEarnings
                var generatedSym = ""
                var sym = item['name'].split(' ')
                sym.forEach(ell => {
                    generatedSym = generatedSym + ell[0]
                    Name = Name + ell.charAt(0).toUpperCase() + ell.slice(1) + " "
                })
                earnings = earnings.toFixed(2);
                data = data + `<div class="card mb-3"><div class="card-body"> <div class="d-flex flex-column flex-lg-row"> <div class="row flex-fill"> <div class="col-sm-5"> <h4 class="h5">${Name}</h4> <span class="avatar avatar-text rounded-3 me-4 bg-warning mb-2" style="position: absolute; right: 0;">${generatedSym.toUpperCase( )}</span> <span class="badge bg-secondary">Tasks completed: </span> ${completedTasks} </div> <div class="col-sm-4 py-2"> <span class="badge bg-secondary">Earnings: </span> ${earnings} ELOS </div> </div> </div> </div> </div></div>`
            }
        });
        Name = ''
    });
    totalEarnings = totalEarnings.toFixed(2);
    document.getElementById("orgs").innerHTML= data;
    document.getElementById("totalEarnings").innerText= totalEarnings;
    document.getElementById("totalHours").innerText= totalHours;
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

