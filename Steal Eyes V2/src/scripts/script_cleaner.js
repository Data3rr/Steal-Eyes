// ## IMPORTS ## //
const fs = require('fs'); //module fs
const path = require('path'); //module path
const os = require('os') // module os



// ## SIDEBAR SELECTOR ## //
const sidebar = document.querySelector('.sidebar'); //setup sidebar
const togglebtn = document.querySelector('.toggle-btn'); //setup toggle-btn

togglebtn.addEventListener('click', () => { //defining a page's active status (active or not)
    sidebar.classList.toggle('active'); //set active
});



// ## CLEANER ## //
//function to clean (main)
async function cleaner() { 
    outputBox.innerHTML = `[<span style="color: gray"> + <span style="color: white">] Injection remover - Steal Eyes V2 - by Adapters<br>
    [<span style="color: gray"> + <span style="color: white">] Press "Start" button to continue...<br><br>` //clean outputbox
    const tempFolder = os.tmpdir(); //temp folder path
  
    // function for deleting files
    async function deleteFile(filePath, file) {
      try {
        const stats = await fs.promises.stat(filePath);
        if (!(stats.mode & 0o2000)) { // Check if it's not a system file or folder
          await fs.promises.unlink(filePath);
          outputBox.innerHTML += `<i class='bx bx-check-square' style='color:#00ff0f'  ></i> File deleted: ${file}<br>`;
          outputBox.scrollTop = outputBox.scrollHeight - outputBox.clientHeight; //automatic scroll
        } else {
          outputBox.innerHTML += `<i class='bx bx-error' style='color:#ff0000' ></i> Error: ${file} (System file, cannot delete)<br>`;
          outputBox.scrollTop = outputBox.scrollHeight - outputBox.clientHeight; //automatic scroll
        }
      } catch (err) {
        if (err.code === 'EPERM') {
          outputBox.innerHTML += `<i class='bx bx-error' style='color:#ff0000' ></i> Error: ${file} (Permission denied)<br>`;
          outputBox.scrollTop = outputBox.scrollHeight - outputBox.clientHeight; //automatic scroll
        } else {
          outputBox.innerHTML += `<i class='bx bx-error' style='color:#ff0000' ></i> Error: ${file}<br>`;
          outputBox.scrollTop = outputBox.scrollHeight - outputBox.clientHeight; //automatic scroll
        }
      }
    }
  
    //function for deleting folders
    async function deleteDir(dirPath, dir) {
      try {
        if (!(stats.mode & 0o2000)) { // Check if it's not a system file or folder
          await fs.promises.rmdir(dirPath);
          outputBox.innerHTML += `<i class='bx bx-check-square' style='color:#00ff0f'  ></i> File deleted: ${file}<br>`;
          outputBox.scrollTop = outputBox.scrollHeight - outputBox.clientHeight; //automatic scroll
        } else {
          outputBox.innerHTML += `<i class='bx bx-error' style='color:#ff0000' ></i> Error: ${file} (System file, cannot delete)<br>`;
          outputBox.scrollTop = outputBox.scrollHeight - outputBox.clientHeight; //automatic scroll
        }
      } catch (err) {
        if (err.code === 'EPERM') {
          outputBox.innerHTML += `<i class='bx bx-error' style='color:#ff0000' ></i> Error: ${dir} (Permission denied)<br>`; //return failure
          outputBox.scrollTop = outputBox.scrollHeight - outputBox.clientHeight; //automatic scroll
        } else {
          outputBox.innerHTML += `<i class='bx bx-error' style='color:#ff0000' ></i> Error: ${dir}<br>`; //return failure
          outputBox.scrollTop = outputBox.scrollHeight - outputBox.clientHeight; //automatic scroll
        }
      }
    }
  
    //function for browsing the folder
    async function walkDir(dirPath) {
      const files = await fs.promises.readdir(dirPath); //retrieve elements
      for (const file of files) { //exploration loop
        try {
          const filePath = path.join(dirPath, file); //filePath setup
          const stats = await fs.promises.stat(filePath); //definition of item type (file or folder)
          if (stats.isFile()) { //launch deletefile function if item is a file
            await deleteFile(filePath, file); 
          } else if (stats.isDirectory()) {  //launche deleteDir function if item is a folder
            await walkDir(filePath);
            await deleteDir(filePath, file);
          }
        } catch (err) {
          outputBox.innerHTML += `<i class='bx bx-error' style='color:#ff0000' ></i> Error: One file cannot be deleted !<br>`; //return failure
          outputBox.scrollTop = outputBox.scrollHeight - outputBox.clientHeight; //automatic scroll
        }
      }
    }
  
    await walkDir(tempFolder);
    outputBox.innerHTML += `---<br><i class='bx bx-check-square bx-tada' style='color:#00ff0f' ></i> Cleaning complete !<br>`; //return end message
    const stats = JSON.parse(fs.readFileSync('src/stats.json', 'utf8')); //retrive stats.json
    stats.totalActions += 1; // add 1 to total actions
    stats.lastAction = new Date().toLocaleString(); //update lastAction
    fs.writeFileSync('src/stats.json', JSON.stringify(stats, null, 2)); //rewrite stats.json
    outputBox.scrollTop = outputBox.scrollHeight - outputBox.clientHeight; //automatic scroll
  }

const outputBox = document.querySelector('#outputBox'); // output box
document.querySelector('.selectButton').addEventListener('click', cleaner); //start cleaner


