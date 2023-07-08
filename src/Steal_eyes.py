#<---       Steal Eyes | Grabber & RAT remover by 0xSp00f3d      --->
#<---                         python 3.x                         --->
#<---           Only for educationnal / good purposes            --->

import os
from pypresence import Presence
from colorama import Fore, init
from random import randint
from re import findall
from json import load, dump, dumps
import time

# Function for the discord rich presence
def rich_presence():
    try:
        rpc = Presence("1124632101623447632")
        rpc.connect()
        rpc.update(
            large_image= "icon",
            large_text = f"Steal Eyes",
            details = f"Grabber & RAT remover",
            state = "by 0xSpoofed",
            buttons=[{"label": "Github", "url": "https://github.com/0xSpoofed/nourl"}]
        )
    except Exception as e:
        pass

# Function to read a file
def readfile(path): 
    with open(path, 'r', encoding='utf-8') as f:
        return(f.read())
    
# Function read a file by line
def readline(path):
    with open(path, 'r') as f:
        return(f.readlines())

# Function read a json
def read_json(file_path: str) -> dict:
    with open(file_path, 'r') as json_file:
        return(load(json_file))

# Function to write a file
def writefile(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# Function to write a json
def write_json(file_path: str, data: dict) -> None:
    with open(file_path, 'w') as json_file:
        dump(data, json_file, indent=4)
        
# Function to define risk
def risk(num, w, r, y, v):
    try:
        if int(num) < 2: return(f"{v}Limited risk: ", str(num), f" hits {w}")
        elif 2 < int(num) < 5: return(f"{y}Medium risk: ", str(num), f" hits {w}")
        elif int(num) > 5: return(f"{r}High risk: ", str(num), f" hits {w}")
    except: return(f"{r}Unable to check the risk of this file{w}")
    
    
# Function to check the risk of a file
def checkfile(path):
    count = 0
    
    try:    
        words = ["token","appdata","leveldb","Local Storage","discord_webhook","applicationdata","dhooks","grab","steal",".log",".ldb", "webhook"]
        paths = ["\\Discord", "\\discordcanary", "\\discordptb", "\\Google\\Chrome\\User Data\\Default", "\\Opera Software\\Opera Stable", "\\BraveSoftware\\Brave-Browser\\User Data\\Default", "\\Yandex\\YandexBrowser\\User Data\\Default", "\\Local Storage\\leveldb"]
        links = ["https://myexternalip.com/raw", "https://api.ipify.org"]
        files = ["Loginvault.db", "passwords.txt", "cookies.txt","\\Google\\Chrome\\User Data\\Default\\Cookies", "Local\\Google\\Chrome\\User Data\\Default\\History", "launcher_accounts.json"]
        
        flags = words + paths + links + files  
        with open(path, 'r') as f:
            lines = f.readlines()
        
        for line in lines:
            for flag in flags:
                if flag in line:
                    count += 1
        
        return count
    except: return 'Unable to check the risk of this file'

# Function to detect the discord js injection
def checkinject():
    discord_versions = ['Discord', 'DiscordCanary', 'DiscordPTB', 'DiscordDevelopement']
    hits = []
    # Get index.js in discord files
    for version in discord_versions:
        current_hit = []
        version_path = f"{os.getenv('LOCALAPPDATA')}\\{version}"
        if os.path.exists(version_path) == True:
            for subdir, dirs, f in os.walk(version_path):
                if 'app-' in subdir:
                    for dir in dirs:
                        if 'module' in dir:
                            module_path = os.path.join(subdir, dir)
                            for subsubdir, sd, sf in os.walk(module_path):
                                if 'discord_desktop_core-' in subsubdir:
                                    for subsubsubdir, ssd, subsubfiles in os.walk(subsubdir):
                                        if 'discord_desktop_core' in subsubsubdir:
                                            for file in subsubfiles:
                                                if file == 'index.js':
                                                    jsfile_path = os.path.join(subsubsubdir, file)
            jsfile_content = readfile(jsfile_path)
            if jsfile_content.strip() != """module.exports = require('./core.asar');""":
                current_hit.append(version)
                current_hit.append(os.path.basename(jsfile_path))
                current_hit.append(jsfile_path)
                current_hit.append(checkfile(jsfile_path))
                webhook = findall(r'(https?):\/\/((?:ptb\.|canary\.)?discord(?:app)?\.com)\/api(?:\/)?(v\d{1,2})?\/webhooks\/(\d{17,19})\/([\w\-]{68})', jsfile_content)
                if webhook != []:
                    if webhook not in current_hit:
                        current_hit.append(f"{webhook[0][0]}://{webhook[0][1]}/{webhook[0][3]}/{webhook[0][4]}")
                    else: pass
                else: current_hit.append('None')
                hits.append(current_hit)
    
    if hits == []: hits.append('None')
    
    return hits

# Function to detect suspicious shell:startup file
def checkshellstartup(r, w):
    hits = []
    startup_path = os.getenv('APPDATA') + '\\Microsoft\\Windows\\Start Menu\\Programs\\Startup'
    for subdir, dirs, files in os.walk(startup_path):
        for file in files:
            if os.path.basename(file) == 'desktop.ini': pass
            else:
                current_hit = []
                file_path = os.path.join(subdir, file)
                current_hit.append(os.path.basename(file_path))
                current_hit.append(file_path)
                try:
                    score = checkfile(file_path)
                except: score = f"{r}Unable to check the risk of this file{w}"
                current_hit.append(score)
                try:
                    webhook = findall(r'(https?):\/\/((?:ptb\.|canary\.)?discord(?:app)?\.com)\/api(?:\/)?(v\d{1,2})?\/webhooks\/(\d{17,19})\/([\w\-]{68})', readfile(file_path))
                    if webhook != []:
                        if webhook not in current_hit:
                            current_hit.append(f"{webhook[0][0]}://{webhook[0][1]}/{webhook[0][3]}/{webhook[0][4]}")
                        else: pass
                    else: current_hit.append('None')
                except: current_hit.append('None')
                hits.append(current_hit)
            
    if hits == []: hits.append('None')
        
    return hits

# Function to clean temp files
def cleaner(w, g, r, y, v):
    print(f"{w}[{g}INFO{w}] Cleaning started !\n\n{w}[{g}RESULTS{w}]")
    temp_folder = os.environ.get('TEMP')
    for subdir, dirs, files in os.walk(temp_folder):
        for file in files:
            try:
                os.remove(os.path.join(subdir, file))
                print(f"{w}[{v}+{w}] File deleted: " + os.path.basename(os.path.join(subdir, file)))
            except PermissionError:
                print(f"{w}[{r}!{w}] Error: " + os.path.basename(os.path.join(subdir, file)))
    print(f"\n{w}[{g}INFO{w}] Cleaning successfuly finished !\n\n----------\n")

# Funtion scanner 
def scan(w, g, r, y, v):
    low_risk_hits = 0
    medium_risk_hits = 0
    high_risk_hits = 0

    totals_hits = []
    injec_hits = []
    file_hits = []
    
    data = {}
    json_data = {}
    
    #discord file scan
    print(f"{w}[{g}INFO{w}] Discord files scan started !\n\n{w}[{g}RESULTS{w}]")
    results_injection = checkinject()
    if results_injection == ['None']:
        print(f"{w}[{v}+{w}] Any discord injection detected !\n")

    else:
        for ri in results_injection:
            high_risk_hits += 1
            id_show = randint(1000, 9999)
            ri.append(id_show)
            injec_hits.append(ri)
            print(f"""{w}[{r}!!{w}] {r}WARNING{w}: Discord injection detected !
    [{g}>{w}] Discord version: {ri[0]}
    [{g}>{w}] File affected: {ri[1]}
    [{g}>{w}] Risk score: {''.join(risk(ri[3], w, r, y, v))} 
    [{g}>{w}] Webhook: {"Any webhook founded :/" if ri[4] == 'None' else ri[4]}
    [{g}INFO{w}] Detection id: {id_show}""")
    print(f"\n{w}[{g}INFO{w}] Discord files scan finished !\n\n----------\n")

    #startup files scan
    print(f"{w}[{g}INFO{w}] Startup files scan started !\n\n{w}[{g}RESULTS{w}]")
    resultstatup = checkshellstartup(r, w)
    if resultstatup == ['None']:
        print(f"{w}[{v}+{w}] Any file was detected in startup !\n")

    else:
        for rs in resultstatup:
            id_show = randint(1000, 9999)
            rs.append(id_show)
            file_hits.append(rs)
            print(f"""{w}[{r}!!{w}] {r}WARNING{w}: Startup file detected !
    [{g}>{w}] File name: {rs[0]}
    [{g}>{w}] Folder: %appdata%/Microsoft/Windows/Start Menu/Programs/Startup
    [{g}>{w}] Risk score: {''.join(risk(rs[2], w, r, y, v))}
    [{g}>{w}] Webhook: {"Any webhook founded :/" if rs[3] == 'None' else rs[3]}
    [{g}INFO{w}] Detection id: {id_show}""")
            try:
                if int(risk(rs[2], w, r, y, v)[1]) < 2: low_risk_hits += 1
                elif 2 < int(risk(rs[2], w, r, y, v)[1]) < 5: medium_risk_hits += 1
                elif int(risk(rs[2], w, r, y, v)[1]) > 5: high_risk_hits += 1
            except: high_risk_hits +=1
                
    print(f"\n{w}[{g}INFO{w}] Startup files scan finished !\n\n----------\n")
    
    #write pins in logs
    id_predefinie = "ID-"
    for element in injec_hits:
        tmp = []
        tmp.append(element[2])
        tmp.append(element[-1])
        totals_hits.append(tmp)
    for element in file_hits:
        tmp = []
        tmp.append(element[1])
        tmp.append(element[-1])
        totals_hits.append(tmp)
    
    if os.path.exists('logs.json'):
        json_data = read_json('logs.json')
    else:
        writefile('logs.json', '{}')
        json_data = {}

    for element in totals_hits:
        data = {id_predefinie + str(element[1]): f"{element[0]}"}
        json_data.update(data)

    write_json(os.path.join(os.getcwd(), 'logs.json'), json_data)
    
    return low_risk_hits, medium_risk_hits, high_risk_hits

# Function to clean all injection & startup sus elements
def cleanall(w, g, r, y, v):
    os.system('cls')
    print('\n')
    json_data = read_json('logs.json')
    for id_ in list(json_data.keys()):
        pth = json_data[id_]
        if "discord_desktop_core-1" in pth:
            try: 
                writefile(pth, "module.exports = require('./core.asar');")
                print(f"{w}[{v}+{w}] Injection successfuly removed: " + os.path.basename(pth))
            except:
                print(f"{w}[{v}+{w}] Injection can not be deleted: " + os.path.basename(pth))
        else: 
            try: 
                os.remove(pth)
                print(f"{w}[{v}+{w}] File deleted: " + os.path.basename(pth))
            except:
                print(f"{w}[{r}!{w}] Error: " + os.path.basename(pth))
            del json_data[id_]
    writefile('logs.json', dumps(json_data))
    writefile('logs.json', '{}')
    input(f"{w}[{g}INFO{w}] Your pc is now free ! | Press enter to exit...")
    main()

# Function du delete or path one detection
def cleanone(w, g, r, y, v):
    json_data = read_json('logs.json')
    print("\n\n----------\n")
    id = input(f"{g}[{w}+{g}]{w} Enter detection id here: ")
    os.system('cls')
    pth = json_data['ID-' + id]
    if "discord_desktop_core-1" in pth:
        try: 
            writefile(pth, "module.exports = require('./core.asar');")
            print(f"{w}[{v}+{w}] Injection successfuly removed: " + os.path.basename(pth))
        except:
            print(f"{w}[{v}+{w}] Injection can not be deleted: " + os.path.basename(pth))
    else: 
        try: 
            os.remove(pth)
            print(f"{w}[{v}+{w}] File deleted: " + os.path.basename(pth))
        except:
            print(f"{w}[{r}!{w}] Error: " + os.path.basename(pth))
        del json_data['ID-' + id]
    
    writefile('logs.json', dumps(json_data))
    writefile('logs.json', '{}')
    input(f"\n----------\n\n{w}[{g}INFO{w}] Your pc is now free ! | Press enter to exit...")
    main()

# Function to scan and clean startup, discord, temp
def scan_and_clean(w, g, r, y, v):
    os.system('cls')
    cleaner(w, g, r, y, v)
    results = scan(w, g, r, y, v)
    choices = {
        "1": lambda: cleanall(w, g, r, y, v),
        "2": lambda: cleanone(w, g, r, y, v),
        "3": lambda: main()
    }
    
    while True:
        print(f"""{w}[{g}INFO{w}] Scan & cleaning finished !\n{w}[{g}RESULTS{w}] {v}{str(results[0])}{w} Low risk | {y}{str(results[1])}{w} Medium risk | {r}{str(results[2])}{w} High risk\n\n----------\n""")
        choice = input(f""" {g}[{w}+{g}]{w} Actions:\n\n [{g}1{w}] Clean all\n [{g}2{w}] Clean one thing by id\n [{g}3{w}] Exit\n\n [{g}+{w}] Enter your choice here: """)
        if choice in choices:
            choices[choice]()
        else:
            continue

# Function to scan startup et discord only
def only_scan(w, g, r, y, v):
    os.system('cls')
    results = scan(w, g, r, y, v)
    choices = {
        "1": lambda: cleanall(w, g, r, y, v),
        "2": lambda: cleanone(w, g, r, y, v),
        "3": lambda: main()
    }
    
    while True:
        print(f"""{w}[{g}INFO{w}] Scan & cleaning finished !\n{w}[{g}RESULTS{w}] {v}{str(results[0])}{w} Low risk | {y}{str(results[1])}{w} Medium risk | {r}{str(results[2])}{w} High risk\n\n----------\n""")
        choice = input(f""" {g}[{w}+{g}]{w} Actions:\n\n [{g}1{w}] Clean all\n [{g}2{w}] Clean one thing by id\n [{g}3{w}] Exit\n\n [{g}+{w}] Enter your choice here: """)
        if choice in choices:
            choices[choice]()
        else:
            continue

# Function to only clean temp
def only_clean(w, g, r, y, v):
    os.system('cls')
    cleaner(w, g, r, y, v)
    input(f"\n----------\n\n{w}[{g}INFO{w}] Your pc is now cleaned ! | Press enter to exit...")
    main()

# Function to scan a particular file by his path 
def scan_file(banner, w, g, r, y, v):
    os.system('cls')
    print(f'{banner}\n-----\n')
    scan_path = input(f'{g}[{w}+{g}]{w} Enter a file path to scan here: ')
    result = checkfile(scan_path)
    if not isinstance(result, int): final_result = result
    else:
        if int(result) < 2: final_result = f'{v}Low risk: {str(result)}{w}'
        elif 2 < int(result) < 5: final_result = f'{y}Medium risk: {str(result)}{w}'
        elif int(result) > 5: final_result = f'{r}High risk: {str(result)}{w}'
        print(f"""\n{w}[{g}+{w}] Fichier : {os.path.basename(scan_path)} Détection : {final_result}\n\n----------\n""")
    print(f"""\n{w}[{g}INFO{w}] Scan & cleaning finished !\n{w}[{g}RESULTS{w}] File: {os.path.basename(scan_path)} Detection: {final_result}\n\n----------\n""")
    input(f"""{g}[{w}INFO{g}]{w} Press enter to exit...""")

# Function to scan all files in a folder by the folder path
def scan_folder(banner, w, g, r, y, v):
    high_risk = []
    medium_risk = []

    os.system('cls')
    print(f'{banner}\n-----\n')
    scan_path = input(f'{g}[{w}+{g}]{w} Enter a folder path to scan here (without spaces in path): ')
    print(f'\n----------\n\n{w}[{g}INFO{w}] Scan started !')
    for subdir, dirs, files in os.walk(scan_path):
        for file in files:
            path = os.path.join(subdir, file)
            if os.path.isfile(path):
                result = checkfile(path)
                if not isinstance(result, int):
                    continue
                if int(result) < 2: 
                    pass
                elif 2 <= int(result) < 5:
                    final_result = f'{y}Medium risk : {str(result)}{w}'
                    print(f"""\n{w}[{r}+{w}] File detected : \n [{g}>{w}] File name: {file}\n [{g}>{w}] File path : {path}\n [{g}>{w}] Risk score : {final_result}""")
                    medium_risk.append(str(path))
                elif int(result) >= 5:
                    final_result = f'{r}High risk : {str(result)}{w}'
                    print(f"""\n{w}[{r}+{w}] File detected : \n [{g}>{w}] File name: {file}\n [{g}>{w}] File path : {path}\n [{g}>{w}] Risk score : {final_result}""")
                    high_risk.append(str(path))
    print(f"""\n{w}[{g}INFO{w}] Scan finished successfully!\n""")
    print(f"""----------\n""")
    choice = input(f"""{g}[{w}+{g}]{w} Actions:\n\n [{g}1{w}] Clean all\n [{g}2{w}] Clean all highs risks\n [{g}3{w}] Clean all mediums risks\n [{g}4{w}] Clean one\n [{g}5{w}] Exit\n\n[{g}+{w}] Enter your choice here: """)
    # Clean all
    if choice == '1':
        os.system('cls')
        all_detections = medium_risk + high_risk
        for pth in all_detections:
            try: 
                os.remove(pth)
                print(f"{w}[{v}+{w}] File deleted: " + os.path.basename(pth))
            except:
                print(f"{w}[{r}!{w}] Error: " + os.path.basename(pth))
        input(f"\n----------\n\n{w}[{g}INFO{w}] Your pc is now cleaned ! | Press enter to exit...")
        main()
    # Clean high risks only
    elif choice == '2':
        os.system('cls')
        for pth in high_risk:
            try: 
                os.remove(pth)
                print(f"{w}[{v}+{w}] File deleted: " + os.path.basename(pth))
            except:
                print(f"{w}[{r}!{w}] Error: " + os.path.basename(pth))
        input(f"\n----------\n\n{w}[{g}INFO{w}] Your pc is now cleaned ! | Press enter to exit...")
    # Clean medium risks only
    elif choice == '3':
        os.system('cls')
        for pth in medium_risk:
            try: 
                os.remove(pth)
                print(f"{w}[{v}+{w}] File deleted: " + os.path.basename(pth))
            except:
                print(f"{w}[{r}!{w}] Error: " + os.path.basename(pth))
        input(f"\n----------\n\n{w}[{g}INFO{w}] Your pc is now cleaned ! | Press enter to exit...")
    # Clean a particular file by his path
    elif choice == '4':
        pth = input(f"""\n----------\n\n{g}[{w}+{g}]{w} Enter a file path here: """)
        os.system('cls')
        try: 
            os.remove(pth)
            print(f"{w}[{v}+{w}] File deleted: " + os.path.basename(pth))
        except:
            print(f"{w}[{r}!{w}] Error: " + os.path.basename(pth))
        input(f"\n----------\n\n{w}[{g}INFO{w}] Your pc is now cleaned ! | Press enter to exit...")
    elif choice == '5': main()
        
        
# Main function of the code
def main():
    w = "\x1b[97m"
    g = "\x1b[37m"
    r = "\x1b[91m"
    y = "\x1b[93m"
    v = "\x1b[32m"

    banner = f"""\n{w} ███████╗████████╗███████╗ █████╗ ██╗         ███████╗██╗   ██╗███████╗███████╗
 ██╔════╝╚══██╔══╝██╔════╝██╔══██╗██║         ██╔════╝╚██╗ ██╔╝██╔════╝██╔════╝
 ███████╗   ██║   █████╗  ███████║██║         █████╗   ╚████╔╝ █████╗  ███████╗
 ╚════██║   ██║   ██╔══╝  ██╔══██║██║         ██╔══╝    ╚██╔╝  ██╔══╝  ╚════██║
 ███████║   ██║   ███████╗██║  ██║███████╗    ███████╗   ██║   ███████╗███████║
 ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝    ╚══════╝   ╚═╝   ╚══════╝╚══════╝\n{w} by 0xSpoofed | Stealer & Rat remover""".replace('█', f'{w}█{g}')

    choices = {
        "1": lambda: scan_and_clean(w, g, r, y, v),
        "2": lambda: only_scan(w, g, r, y, v),
        "3": lambda: only_clean(w, g, r, y, v),
        "4": lambda: scan_file(banner, w, g, r, y, v),
        "5": lambda: scan_folder(banner, w, g, r, y, v),
        "6": lambda: exit()
    }
    
    while True:
        os.system("cls")
        print(f"""{banner}\n -----\n
 {g}[{w}+{g}]{w} Menu:                                                      
                                                         
 {g}[{w}1{g}]{w} Scan & clean       {g}[{w}4{g}]{w} Analyse one file               
 {g}[{w}2{g}]{w} Scan only          {g}[{w}5{g}]{w} Analyse one directory            
 {g}[{w}3{g}]{w} Clean only         {g}[{w}6{g}]{w} Exit""") 
        
        choice = input(f"\n {g}[{w}->{g}]{w} Enter your choice here: ")
        if choice in choices:
            choices[choice]()
        else:
            os.system("cls")
            print(f"{banner}\n\n {w}[{r}!{w}] Invalid option, please try again.")
            time.sleep(2)
            os.system("cls")
            continue

if __name__ == "__main__":
    os.system("title Steal Eyes")
    rich_presence()
    init()
    main()
    
        

   