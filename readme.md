# Voice Recorder App with AWS Lambda Integration (via Lambda URLs)

## Overview

This project demonstrates how to create a **Voice Recorder App** using **Vue.js** for the frontend and **AWS Lambda** for the backend. The application allows users to record audio in chunks, upload them to an S3 bucket, merge the chunks, and remove the merged file from the S3 bucket. The backend is deployed using **AWS Lambda** with **Lambda URLs**, **without using API Gateway**.

## Features

- **Home Page**: Displays a welcome message.
- **Recording Page**: Allows users to start and stop audio recording.
- **Chunked Audio Upload**: Records audio in chunks and uploads them to an S3 bucket.
- **Audio Merge**: Merges all recorded chunks into a single file and uploads it to S3.
- **Audio Removal**: Deletes the merged audio file from the S3 bucket.

## Folder Structure

voice-recorder-app/
├── frontend/                   # Frontend code
│   ├── src/                     
│   │   ├── components/         
│   │   │   └── AudioRecorder.vue
│   │   ├── App.vue
│   │   ├── main.js
│   ├── public/                 
│   ├── package.json
├── backend/                    # Backend (Lambda functions)
│   ├── addAudio.js              # Lambda function to upload audio chunks
│   ├── mergeAudio.js            # Lambda function to merge audio chunks
│   ├── removeAudio.js           # Lambda function to delete merged audio
│   ├── package.json
│   ├── .env                     # Environment variables for AWS config
├── README.md
