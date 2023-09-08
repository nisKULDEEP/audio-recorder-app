import { useState, useEffect } from 'react';
import ContentWrapper from '../ContentWrapper';
import './index.css';

const Recorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const [isRecordingSaved, setIsRecordingSaved] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);

    const saveRecording = () => {
        if (audioURL) {
            // Create a FormData object to send the audio blob to the server
            const formData = new FormData();
            formData.append('audio', audioBlob); // Assuming you have the audioBlob available

            fetch('/api/save-recording', {
                method: 'POST',
                body: formData
            })
                .then((response) => {
                    if (response.ok) {
                        setIsRecordingSaved(true);
                        console.log('Recording saved successfully!');
                    } else {
                        console.error('Failed to save recording.');
                    }
                })
                .catch((error) => {
                    console.error('Error saving recording:', error);
                });
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            const recorder = new MediaRecorder(stream);
            const chunks: any[] = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                setAudioURL(url);
                setAudioChunks([]);
                setMediaRecorder(null);
                setAudioBlob(blob);
            };

            recorder.start();
            setIsRecording(true);
            setMediaRecorder(recorder);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    useEffect(() => {
        return () => {
            // Clean up when unmounting
            if (mediaRecorder && isRecording) {
                mediaRecorder.stop();
            }
        };
    }, [mediaRecorder, isRecording]);

    return (
        <ContentWrapper>
            <div className="recorder-container">
                {isRecordingSaved && <p>Recording saved successfully!</p>}
                {isRecording ? (
                    <button
                        className="stop-button"
                        role="button"
                        onClick={stopRecording}
                    >
                        Stop Recording
                    </button>
                ) : (
                    <button
                        className="start-button"
                        role="button"
                        onClick={startRecording}
                    >
                        Start Recording
                    </button>
                )}
                {audioURL && (
                    <div>
                        <p>Recorded Audio:</p>
                        <div className="recorder-audio-actions">
                            <audio controls src={audioURL}></audio>
                            <button
                                className="save-button"
                                onClick={saveRecording}
                                disabled={!audioURL || isRecordingSaved}
                            >
                                Save the recording
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ContentWrapper>
    );
};

export default Recorder;
