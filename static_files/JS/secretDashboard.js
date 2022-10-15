
function loadData() {
    var arr = [2942, 431, 122, 4, 15]
    var innerText = `Total Hours Earned by Users: ${arr[0]}<br>Total ELOS Earned by Users: ${arr[1]}<br>Total Users Connected: ${arr[2]}<br>Active Organizations: ${arr[3]}<br><br>nline Users: ${arr[4]}`
    document.getElementById("data").innerHTML= innerText;
}
window.onload = loadData;

