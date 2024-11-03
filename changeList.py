import subprocess
import sys

# Der erste Parameter ist der Window
if sys.argv.__len__==1:
    window = sys.argv[0]

    # Datei mit den Befehlen
    file_path = '.local/applicationList/windowChangeList'
    
    # Befehle aus der Datei einlesen und ausführen
    try:
        with open(file_path, 'r') as file:
            for line in file:
                command = line.strip()  # Leerzeichen am Anfang und Ende entfernen
                if command:  # Nur nicht-leere Zeilen ausführen
                    full_command = f"{command} {window}"
                    subprocess.Popen(full_command, shell=True)  # Befehl asynchron ausführen
    except FileNotFoundError:
        print(f"Die Datei wurde nicht gefunden: {file_path}")
        sys.exit(1)
