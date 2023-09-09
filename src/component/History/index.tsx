import { useEffect, useState } from 'react';
import ContentWrapper from '../ContentWrapper';
import './index.css';
import axiosInstance from '../../store/axiosConfig';

const History = () => {
    const [recordingListing, setRecordingListing] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getRecordings = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get('/recording/listing');

            setRecordingListing(
                res.data.map((item: any) => {
                    console.log();
                    return {
                        url: URL.createObjectURL(
                            new Blob([new Uint8Array(item.audioData.data)], {
                                type: 'audio/mpeg'
                            })
                        ),
                        id: item._id
                    };
                })
            );
        } catch (error) {
            toast.error(
                error?.response?.data?.message || 'Something went wrong'
            );
        } finally {
            setIsLoading(false);
        }
    };
    const handleDelete = async (recordingId: string) => {
        try {
            await axiosInstance.delete(`/recording/${recordingId}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    token: localStorage.getItem('token')
                }
            });
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getRecordings();
    }, []);

    if (isLoading) {
        return (
            <ContentWrapper>
                {' '}
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
                    (record: { url: string; id: string }, idx) => (
                        <div className="audio-card-wrapper">
                            <h3 className="">{`Recording-${idx + 1}`}</h3>
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
