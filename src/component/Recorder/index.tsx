import { useState, useEffect } from 'react';
import ContentWrapper from '../ContentWrapper';
import './index.css';
import axiosInstance from '../../store/axiosConfig';
import toast from 'react-hot-toast';

const Recorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const [isRecordingSaved, setIsRecordingSaved] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [selectedOption, setSelectedOption] = useState('Focused Listening');

    const handleSelectChange = (event: any) => {
        setSelectedOption(event.target.value);
    };

    const saveRecording = async () => {
        if (audioBlob) {
            const formData = new FormData();
            formData.append('audioFile', audioBlob, 'recording.ogg');
            formData.append('type', selectedOption);

            const response = await axiosInstance
                .post('/recording/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        token: localStorage.getItem('token')
                    }
                })
                .then((response: any) => {
                    setIsRecordingSaved(true);
                    toast.success('Recording saved successfully!');
                    setAudioURL(null);
                })
                .catch((err) =>
                    toast.error(
                        err?.response?.data?.message || 'Something went wrong'
                    )
                );
        } else {
            toast.error('Recording not found, please refresh the page.');
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
            toast.error('Error accessing microphone:');
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
            if (mediaRecorder && isRecording) {
                mediaRecorder.stop();
            }
        };
    }, [mediaRecorder, isRecording]);

    return (
        <ContentWrapper>
            <div className="recorder-container">
                <div className="select-container">
                    <label>Select a focus type:</label>
                    <select
                        value={selectedOption}
                        onChange={handleSelectChange}
                    >
                        <option value="Internal Listening">
                            Internal Listening
                        </option>
                        <option
                            value="Focused
                Listening"
                        >
                            Focused Listening
                        </option>
                        <option value="Global Listening">
                            Global Listening
                        </option>
                    </select>
                </div>

                {isRecording ? (
                    <>
                        <button
                            className="stop-button"
                            role="button"
                            onClick={stopRecording}
                        >
                            Stop Recording
                        </button>
                        <a href="#" className="button active" id="active">
                            <i className="fas fa-microphone"></i>
                        </a>
                    </>
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
                    <div className="recorder-audio-container">
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
