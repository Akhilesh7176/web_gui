#!/bin/bash
# Shell script to run a JAR file on macOS/Linux

# Path to your JAR file (modify this if the JAR is not in the same directory)
JAR_FILE="http-server-1.0-SNAPSHOT.jar"

# Check if the JAR file exists
if [ ! -f "$JAR_FILE" ]; then
    echo "ERROR: JAR file '$JAR_FILE' not found!"
    exit 1
fi

# Run the JAR file
java -jar "$JAR_FILE" &  # Run in background
SERVER_PID=$!  # Save the process ID

# Wait for the server to start
sleep 5  # Adjust the sleep duration as necessary

# Download and save as a different filename
curl -o ../src/assets/machine_part.obj http://127.0.0.1:8080/example.obj

# Stop the server after download
kill $SERVER_PID
npm run start:all
# Keep the terminal open after the JAR finishes
read -p "Press Enter to exit..."
