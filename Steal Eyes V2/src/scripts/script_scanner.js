// ## IMPORTS ## //
const { ipcRenderer } = require('electron'); //module electron
const path = require('path'); //module path
const fs = require('fs'); //module fs



// ## SIDEBAR SELECTOR ## //
const sidebar = document.querySelector('.sidebar'); //setup sidebar
const togglebtn = document.querySelector('.toggle-btn'); //setup toggle-btn

togglebtn.addEventListener('click', () => { //defining a page's active status (active or not)
    sidebar.classList.toggle('active'); //set active
});



// ## FILE CHECKER //

//function to read the imported file
function readFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  const textDecoder = new TextDecoder('utf-8', { fatal: true }); //decode file content
  try {
    return textDecoder.decode(buffer);
  } catch (error) {
    const encodings = ['utf-16le', 'utf-16be', 'latin1', 'ascii']; //encodings list
    for (const encoding of encodings) { //try every encodings to bypass some errors
      try {
        const textDecoder = new TextDecoder(encoding, { fatal: true });
        return textDecoder.decode(buffer);
      } catch (error) {}
    }
    return 'Error'; //return "Error" if any encodings works
  }
}

//function to check a file (main)
function fileChecker(filePath) {
  const lines = readFile(filePath).split('\n') //retrieve & cut file content line by line
 
  const flags = [  //flags: suspect word list
    "token",
    "appdata",
    "leveldb",
    "Local Storage",
    "discord_webhook",
    "applicationdata",
    "dhooks",
    "grab",
    "steal",
    ".log",
    ".ldb",
    "webhook",
    "\\Discord",
    "\\discordcanary",
    "\\discordptb",
    "\\Google\\Chrome\\User Data\\Default",
    "\\Opera Software\\Opera Stable",
    "\\BraveSoftware\\Brave-Browser\\User Data\\Default",
    "\\Yandex\\YandexBrowser\\User Data\\Default",
    "\\Local Storage\\leveldb",
    "https://myexternalip.com/raw",
    "https://api.ipify.org",
    "Loginvault.db",
    "passwords.txt",
    "cookies.txt",
    "\\Google\\Chrome\\User Data\\Default\\Cookies",
    "Local\\Google\\Chrome\\User Data\\Default\\History",
    "launcher_accounts.json"
  ];
  let count = 0; //hit counts

  for (const line of lines) {
    for (const flag of flags) {
      if (line.includes(flag)) {
        count += 1;
      }
    }
  }
  
  //Risk calculator
  let risk = 'Error ✖️'; //base state of risk
  if (count === 0) { //light risk setup
    risk = '🟩 Light risk';
  } else if (count === 1) { //limited risk setup
    risk = '🟨 Limited risk';
    const stats = JSON.parse(fs.readFileSync('src/stats.json', 'utf8')); //retrive stats.json
    stats.totalDetections += 1; // add 1 to total actions
    fs.writeFileSync('src/stats.json', JSON.stringify(stats, null, 2)); //rewrite stats.json
  } else if (count === 2 || count === 3) { //medium risk setup
    risk = '🟧 Medium risk';
    const stats = JSON.parse(fs.readFileSync('src/stats.json', 'utf8')); //retrive stats.json
    stats.totalDetections += 1; // add 1 to total actions
    fs.writeFileSync('src/stats.json', JSON.stringify(stats, null, 2)); //rewrite stats.json
  } else { // high risk setup
    risk = '🟥 High risk';
    const stats = JSON.parse(fs.readFileSync('src/stats.json', 'utf8')); //retrive stats.json
    stats.totalDetections += 1; // add 1 to total actions
    fs.writeFileSync('src/stats.json', JSON.stringify(stats, null, 2)); //rewrite stats.json
  }

  //Return and push result into html
  document.getElementById('selectedfileName').textContent = `${path.basename(filePath)} 📄`; //file name push to html
  document.getElementById('riskRating').textContent = risk; //risk rating push to html
  document.getElementById('hitsNumber').textContent = count; //hits count push to html
  const stats = JSON.parse(fs.readFileSync('src/stats.json', 'utf8')); //retrive stats.json
  stats.totalActions += 1; // add 1 to total actions
  stats.lastAction = new Date().toLocaleString(); //update lastAction
  fs.writeFileSync('src/stats.json', JSON.stringify(stats, null, 2)); //rewrite stats.json
}

//Retrive selected file path
const selectButton = document.querySelector('.selectButton');
selectButton.addEventListener('click', () => {
  ipcRenderer.send('open-file-dialog');
});

ipcRenderer.on('selected-file', (event, filePath) => {
  fileChecker(filePath) //launch the file verification function when the path is retrieved
});

ipcRenderer.on('error', (event, err) => {
  console.error(err); //returns an error if something goes wrong
});



