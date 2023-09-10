export interface ErrorType {
    response: { data: { message: string } };
}
export interface ResponseType {
    data: {
        token: string;
        userDetail: { _id: string; email: string; password: string };
    };
    error: ErrorType;
}

export interface HistoryResponseType {
    data: {
        _id: string;
        type: string;
        userId: string;
        audioData: { data: any };
    }[];
}
