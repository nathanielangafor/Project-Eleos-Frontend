const serverEndpoint = 'http://64.190.90.49:7788';
let token = null;

async function authedFetch(url) {
    return await fetch(url, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    while (true) {
        await sleep(100);
        try {
            const user = await (await authedFetch(serverEndpoint + '/api/user')).json();
            for (const projectId of user.projects) {
                const job = await (await authedFetch(serverEndpoint + '/api/worker/request-job?projectid=' + encodeURIComponent(projectId))).json();
                if (job.taskId) {
                    let run;
                    eval(job.code);
                    const result = run(job.taskId);
                    await authedFetch(serverEndpoint + '/api/worker/submit?projectid=' + encodeURIComponent(projectId) + '&taskId=' + encodeURIComponent(job.taskId) + '&result=' + encodeURIComponent(result));
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
}


onmessage = function(event) {
    console.log(event);
    if (!token) {
        // first message
        token = event.data.token;
        main();
    }
    token = event.data.token || token;
};
