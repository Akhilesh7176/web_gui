#!/bin/bash
# Shell script to run a JAR file on macOS/Linux

# Path to your JAR file (modify this if the JAR is not in the same directory)
JAR_FILE="http-server-1.0-SNAPSHOT_everything.jar"

# Check if the JAR file exists
if [ ! -f "$JAR_FILE" ]; then
    echo "ERROR: JAR file '$JAR_FILE' not found!"
    exit 1
fi

# Run the JAR file
java -jar "$JAR_FILE" & 


# Keep the terminal open after the JAR finishes
read -p "Press Enter to exit..."
