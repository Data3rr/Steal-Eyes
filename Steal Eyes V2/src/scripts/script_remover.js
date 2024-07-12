// ## IMPORTS ## //
const fs = require('fs') //module fs
const path = require('path')



// ## SIDEBAR SELECTOR ## //
const sidebar = document.querySelector('.sidebar'); //setup sidebar
const togglebtn = document.querySelector('.toggle-btn'); //setup toggle-btn

togglebtn.addEventListener('click', () => { //defining a page's active status (active or not)
    sidebar.classList.toggle('active'); //set active
});



// ## INJECTION REMOVER ## //
//check file security
function checkFile(jsfileContent) {
    const lines = jsfileContent.split('\n') //retrieve & cut file content line by line
    console.log(lines)
    let check_result = []

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
  
    for (const line of lines) { //check lines and find hits
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
    check_result.push(risk) //push risk
    check_result.push(count) //push detection count
    return check_result
};

//function to check shell:startup
function checkShellStartup() {
    const hits = [];
    const startupPath = `${process.env.APPDATA}\\Microsoft\\Windows\\Start Menu\\Programs\\Startup`; //windows startup path
  
    fs.readdirSync(startupPath).forEach(file => {
      if (file === 'desktop.ini') return;
      const filePath = path.join(startupPath, file);
      const currentHit = [];
      currentHit.push(path.basename(filePath)); //push detection path
      currentHit.push(filePath); //push dectection name
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const score = checkFile(fileContent);
        currentHit.push(score);
        const stats = JSON.parse(fs.readFileSync('src/stats.json', 'utf8')); //retrive stats.json
        stats.totalDetections += 1; // add 1 to total actions
        fs.writeFileSync('src/stats.json', JSON.stringify(stats, null, 2)); //rewrite stats.json
      } catch (e) {
        currentHit.push(`None`);
      }
      try { //try to find some webhooks
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const webhookRegex = /https?:\/\/discord\.com\/api\/webhooks\/(\d+)\/([A-Za-z0-9-_]+)/;
        const match = fileContent.match(webhookRegex);
        if (match) {
          const webhookId = match[1];
          const webhookToken = match[2];
          const webhookUrl = `https://discord.com/api/webhooks/${webhookId}/${webhookToken}`;
          currentHit.push(webhookUrl)
        } else {
          currentHit.push('None')
        }
      } catch (err) {
        currentHit.push('None');
      }
      hits.push(currentHit + ' s3p ');
    });
  
    if (hits.length === 0) {
      hits.push('None');
    }
  
    return hits;
  }

//Discord injections founder
function findDiscordInjections() {
  const discordVersions = ['Discord', 'DiscordCanary', 'DiscordPTB', 'DiscordDevelopment']; //all discords versions
  let hits = [];

  for (const version of discordVersions) { //explore diffenrents discord verions
    const versionPath = `${process.env.LOCALAPPDATA}\\${version}`;
    if (fs.existsSync(versionPath)) {
      fs.readdirSync(versionPath).forEach(subdir => {
        if (subdir.includes('app-')) {
          fs.readdirSync(path.join(versionPath, subdir)).forEach(dir => {
            if (dir.includes('module')) {
              const modulePath = path.join(versionPath, subdir, dir);
              fs.readdirSync(modulePath).forEach(subsubdir => {
                if (subsubdir.includes('discord_desktop_core-')) {
                  fs.readdirSync(path.join(modulePath, subsubdir)).forEach(subsubsubdir => {
                    if (subsubsubdir.includes('discord_desktop_core')) {
                      fs.readdirSync(path.join(modulePath, subsubdir, subsubsubdir)).forEach(file => {
                        if (file === 'index.js') {
                          const jsfilePath = path.join(modulePath, subsubdir, subsubsubdir, file);
                          const jsfileContent = fs.readFileSync(jsfilePath, 'utf8');
                          if (jsfileContent.trim() !== "module.exports = require('./core.asar');") { //check index.js modifications
                            const currentHit = [];
                            currentHit.push(version);
                            currentHit.push(path.basename(jsfilePath));
                            currentHit.push(jsfilePath);
                            const check_result = checkFile(jsfileContent.trim());
                            if (check_result[1] !== 0) {
                              currentHit.push(['🟥 High risk', check_result[1]]);
                              const stats = JSON.parse(fs.readFileSync('src/stats.json', 'utf8'));
                              stats.totalDetections += 1;
                              fs.writeFileSync('src/stats.json', JSON.stringify(stats, null, 2));
                            }
                            try { //try to find a webhook
                              const webhookRegex = /https?:\/\/discord\.com\/api\/webhooks\/(\d+)\/([A-Za-z0-9-_]+)/;
                              const match = jsfileContent.trim().match(webhookRegex);
                              if (match) {
                                const webhookId = match[1];
                                const webhookToken = match[2];
                                const webhookUrl = `https://discord.com/api/webhooks/${webhookId}/${webhookToken}`;
                                currentHit.push(webhookUrl);
                              } else {
                                currentHit.push('None');
                              }
                            } catch (err) {
                              currentHit.push('None');
                            }
                            hits.push(currentHit);
                            return hits;
                          }
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  }
  if (hits.length === 0) {
    hits.push('None');
  }
  return hits; //return function results
}

//function to delete discord injections
function deleteInjection(discordVersion) { 
  const versionPath = path.join(process.env.LOCALAPPDATA, discordVersion); //selected discord path -> using var discordVersion

  if (fs.existsSync(versionPath)) {
    fs.readdirSync(versionPath).forEach(subdir => {
      if (subdir.includes('app-')) {
        fs.readdirSync(path.join(versionPath, subdir)).forEach(dir => {
          if (dir.includes('module')) {
            const modulePath = path.join(versionPath, subdir, dir);

            fs.readdirSync(modulePath).forEach(subsubdir => {
              if (subsubdir.includes('discord_desktop_core-')) {
                fs.readdirSync(path.join(modulePath, subsubdir)).forEach(subsubsubdir => {
                  if (subsubsubdir.includes('discord_desktop_core')) {
                    const filePath = path.join(modulePath, subsubdir, subsubsubdir, 'index.js');

                    if (fs.existsSync(filePath)) {
                      const fileContent = fs.readFileSync(filePath, 'utf8');
                      const baseJsContent = "module.exports = require('./core.asar');";

                      try {
                        fs.writeFileSync(filePath, baseJsContent);
                        const updatedFileContent = fs.readFileSync(filePath, 'utf8');
                        if (updatedFileContent != "module.exports = require('./core.asar');") {
                          window.alert('Error: Error when removing injection'); //error message
                        }
                        else {
                          window.alert(`${discordVersion} injection successfully removed !\n-> Press "Start" again to remove the detection from the list...`); //success message
                        }
                      } catch (err) {
                        window.alert(`Error: Unable to remove (${discordVersion} injection`); //error message
                      }
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  }
}

// function to delete a file by its path
function deleteFile(filePath) { 
  try {
    fs.unlinkSync(filePath);
    window.alert(`"${path.basename(filePath)}" file has been successfully deleted !\n-> Press "Start" again to remove the detection from the list...`); //success message
  } catch (err) {
    window.alert(`Error: Unable to delete ${path.basename(filePath)} !`); //error message
  }

}

//main function -> injection remover
function remover() { 
  let totalDetections = 0 //set detection number to 0
  //setup correctly (clear) output box
  outputBox.innerHTML = `[<span style="color: gray"> + <span style="color: white">] Injection remover - Steal Eyes V2 - by Adapters<br>
    [<span style="color: gray"> + <span style="color: white">] Press "Start" button to continue...<br><br>`

  let totalInjections = findDiscordInjections() //find discord injections
  for (hit in totalInjections) { //explore discord injections 
    let current_hit = totalInjections[hit]
    if (current_hit != 'None') {
      outputBox.innerHTML += `
        <i class='bx bx-error bx-burst' style='color:#ff0000' ></i> ${current_hit[0]} injection founded !<br>
        <i class='bx bx-chevrons-right'></i> Risk score: ${current_hit[3][0]}<br>
        <i class='bx bx-chevrons-right'></i> Hits: ${current_hit[3][1]}<br>
        <i class='bx bx-chevrons-right'></i> Webhook: ${current_hit[4]}<br>
        <button class="deleteButton" onclick="deleteInjection('${current_hit[0]}')">Delete injection</button><br><br>
      `; //return result into outputbox
      outputBox.scrollTop = outputBox.scrollHeight - outputBox.clientHeight; // automatic scroll
      totalDetections += 1; //update totalDetections number
    } else {
      outputBox.innerHTML += `
        <i class='bx bx-check-shield' style='color:#00ff2b'  ></i> No discord injection founded !<br><br>`; //return result into outputbox
        outputBox.scrollTop = outputBox.scrollHeight - outputBox.clientHeight; //automatic scroll
    }
  } 
  let totalStartup = checkShellStartup()
  for (hit in totalStartup)  {
      let current_hit = totalStartup[hit].split(',')
      if (current_hit != 'None') {
        //return hit
        outputBox.innerHTML += `
        <i class='bx bx-error bx-burst' style='color:#ff0000' ></i> Suspect startup file founded !<br>
        <i class='bx bx-chevrons-right'></i> File name: ${current_hit[0]}<br>
        <i class='bx bx-chevrons-right'></i> Location: shell:startup<br>
        <i class='bx bx-chevrons-right'></i> Risk score: ${current_hit[2]}<br>
        <i class='bx bx-chevrons-right'></i> Hits: ${current_hit[3]}<br>
        <i class='bx bx-chevrons-right'></i> Webhook: ${current_hit[4].replace(' s3p ', '')}<br>
        <button class="deleteButton" onclick="deleteFile('${current_hit[1].replace(/\\/g, '\\\\')}')">Delete suspect file</button><br><br>
      `; //return result into outputbox
      outputBox.scrollTop = outputBox.scrollHeight - outputBox.clientHeight; //automatic scroll
      totalDetections += 1; //update totalDetections number
      } else {
        outputBox.innerHTML += `
      <i class='bx bx-check-shield' style='color:#00ff2b'  ></i> No startup file founded !<br><br>`; //return result into outputbox
      outputBox.scrollTop = outputBox.scrollHeight - outputBox.clientHeight; //automatic scroll
      }
  }
  
  outputBox.innerHTML += `<i class='bx bx-check-square bx-tada' style='color:#00ff0f' ></i> Scan complete, ${totalDetections} potential threats identified !<br>`; //return end message
  outputBox.scrollTop = outputBox.scrollHeight - outputBox.clientHeight; //automatic scroll
};

const outputBox = document.querySelector('#outputBox'); // output box inital setup
document.querySelector('.selectButton').addEventListener('click', remover); //start main function 

