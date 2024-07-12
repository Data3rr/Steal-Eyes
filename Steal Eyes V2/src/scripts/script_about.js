// ## IMPORTS ## //
const { shell } = require('electron')



// ## GITHUB BUTTON ## //
const githubLink = 'https://github.com/data3rr';
  document.getElementById('github-link').addEventListener('click', () => {
    shell.openExternal(githubLink);
  });



// ## SIDEBAR SELECTOR ## //
const sidebar = document.querySelector('.sidebar'); //setup sidebar
const togglebtn = document.querySelector('.toggle-btn'); //setup toggle-btn

togglebtn.addEventListener('click', () => { //defining a page's active status (active or not)
    sidebar.classList.toggle('active'); //set active
});