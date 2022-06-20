export let sendResponse = (code, message, data) => {
    return {
        statusCode: code,
        body: JSON.stringify({
            status: code,
            message: message,
            body: data ? data : []
        }),
    };
};


export let errReturned = (err) => {
    return {
        statusCode: 400,
        body: JSON.stringify({
            status: 400,
            message: err.message || err,
            body: []
        }),
    };
};
