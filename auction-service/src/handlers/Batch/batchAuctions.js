import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import commonMiddleware from '../../lib/commonMiddleware';
import getAuctionsSchema from '../../lib/schemas/getAuctionsSchema';
import { sendResponse,errReturned } from '../../lib/config/dto';
import { SUCCESS, BADREQUEST} from '../../lib/config/res'

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function batchAuctions(event, context) {
    try {

        // let auctions;

        console.log("************************ before params");

        var params = {
            'RequestItems': {
                'AuctionsTable-dev': {
                    'Keys': [
                        {
                            'id': '3039e83f-4cde-4699-91d2-f5b715d5d89b'
                        },
                    ],
                },
                'SecondTable-dev': {
                    'Keys': [
                        {
                            'id': '7562b24e-95b4-4326-8ae7-c1cb5b9a2c54'
                        },
                    ],
                }
            }
        };

        console.log("************************ after params");

        let result = await dynamodb.batchGet(params).promise();
        console.log("************************ result", result);

        if (result)
            return sendResponse(SUCCESS, "Get Batch Successful", result);
        else
            return sendResponse(BADREQUEST, "Get Batch Unsuccessful", []);

    } catch (error) {

        console.error(error);
        throw new createError.InternalServerError(error);

    }

}

export const handler = commonMiddleware(batchAuctions);
    // .use(validator({ inputSchema: getAuctionsSchema, useDefaults: true }));