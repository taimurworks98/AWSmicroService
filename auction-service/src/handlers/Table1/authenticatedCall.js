import AWS from 'aws-sdk';
import isAuthenticated from '../../lib/config/auth'
import commonMiddleware from '../../lib/commonMiddleware';
import { ResponseCodesEnum } from '../../lib/config/res';
import { sendResponse, errReturned } from '../../lib/config/dto';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function authenticatedCall(event, context) {
    let { SUCCESS, BADREQUEST } = ResponseCodesEnum;
    try {
        return sendResponse(SUCCESS, "Authentication successful");
    } catch (error) {
        return sendResponse(BADREQUEST, "Authentication failed", error)
    }
}

export const handler = commonMiddleware(authenticatedCall)
// .use(isAuthenticated(authenticatedCall));