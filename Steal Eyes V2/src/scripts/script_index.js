// ## IMPORTS ## //
//no import is required for this script



// ## SIDEBAR SELECTOR ## //
const sidebar = document.querySelector('.sidebar'); //setup sidebar
const togglebtn = document.querySelector('.toggle-btn'); //setup toggle-btn

togglebtn.addEventListener('click', () => { //defining a page's active status (active or not)
    sidebar.classList.toggle('active'); //set active
});



// ## STATISTICS LOADER ## //
// function for loading statistics(main)
function loadStats() {
    const nodata = 'No data available 🔌' //set nodata
    fetch('stats.json') //retrieve stats data
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => { //integrate statistics into html code
            document.getElementById('totalActions').textContent = data.totalActions ?? nodata;
            document.getElementById('totalDetections').textContent = data.totalDetections ?? nodata;
            document.getElementById('lastAction').textContent = data.lastAction ?? nodata;
            
        })
        .catch(error => { //integrate statistics into html code (when: error)
            console.error('Error loading JSON data:', error);
            document.getElementById('totalActions').textContent = nodata;
            document.getElementById('totalDetections').textContent = nodata;
            document.getElementById('lastAction').textContent = nodata;
        });
}

document.addEventListener('DOMContentLoaded', loadStats); //start loadstats


