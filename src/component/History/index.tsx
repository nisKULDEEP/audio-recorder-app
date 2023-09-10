import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ContentWrapper from '../ContentWrapper';
import './index.css';
import axiosInstance from '../../store/axiosConfig';

const History = () => {
    const [recordingListing, setRecordingListing] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState({
        status: false,
        message: ''
    });

    const getRecordings = async () => {
        setIsLoading(true);
        try {
            const res: any = await axiosInstance.get('/recording/listing');

            setRecordingListing(
                res.data.map((item: any) => ({
                    url: URL.createObjectURL(
                        new Blob([new Uint8Array(item.audioData.data)], {
                            type: 'audio/mpeg'
                        })
                    ),
                    id: item._id,
                    type: item.type
                }))
            );
        } catch (error: any) {
            setLocalError({
                status: true,
                message: error.response.data.message
            });
            toast.error(
                error?.response?.data?.message || 'Something went wrong'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (recordingId: string) => {
        try {
            setRecordingListing(
                recordingListing.filter(
                    (item: { id: string }) => item.id != recordingId
                )
            );
            toast.success('Recording deleted successfully');

            await axiosInstance.delete(`/recording/${recordingId}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    token: localStorage.getItem('token')
                }
            });
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Something went wrong'
            );
        }
    };
    useEffect(() => {
        getRecordings();
    }, []);

    if (localError.status) {
        return (
            <ContentWrapper>
                <div>{localError.message || 'Something went wrong'}</div>
            </ContentWrapper>
        );
    }

    if (isLoading) {
        return (
            <ContentWrapper>
                <div>Loading...</div>
            </ContentWrapper>
        );
    }
    if (recordingListing.length === 0) {
        return (
            <div className="not-found-container">
                <img src="https://static.vecteezy.com/system/resources/previews/005/006/031/original/no-result-data-document-or-file-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-etc-vector.jpg" />
                <h2>Records not found</h2>
            </div>
        );
    }
    return (
        <ContentWrapper>
            <div className="audio-listing-container">
                {recordingListing.map(
                    (record: { url: string; id: string; type: string }) => (
                        <div className="audio-card-wrapper">
                            <h3 className="title">{`Recording-${record.id}`}</h3>
                            <div className="label">{record.type}</div>
                            <div className="audio-card">
                                <audio controls src={record.url}></audio>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(record.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )
                )}
            </div>
        </ContentWrapper>
    );
};

export default History;
