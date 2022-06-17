import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import commonMiddleware from '../../lib/commonMiddleware';
import getAuctionsSchema from '../../lib/schemas/getAuctionsSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function batchAuctions(event, context) {
    let auctions;

    var params = {
        RequestItems: {
            'AuctionsTable': {
                Keys: [
                    { 'id': '4565c71d-f2b6-49c3-b2b5-7cf3198f91fa', 'seller': 'taimoormalik@softtik.com' },
                ],
                ProjectionExpression: 'id, title, highestBid, seller, createdAt, endingAt'
            },
            'SecondTable': {
                Keys: [
                    { 'id': '39de02ce-b976-4119-903a-a9b6c4a955d0', 'seller': 'taimoormalik@softtik.com' },
                ],
                ProjectionExpression: 'id, title, highestBid, seller, createdAt, endingAt'
            }
        }
    };
    dynamodb.batchGet(params, function (err, data) {
        if (err) {
            console.log(`Error: ${err}`);
        } else {
            auctions = data;
            console.log(data);
            data.Responses.AuctionsTable.forEach(function (e, i, a) {
                console.log(e);
            });
            data.Responses.SecondTable.forEach(function (e, i, a) {
                console.log(e);
            });
        }
    });
    // try {
    //     const result = await dynamodb.batchGet(params).promise();
    //     auctions = result.Items;
    // } catch (error) {
    //     console.error(error);
    //     throw new createError.InternalServerError(error);
    // }


    return {
        statusCode: 200,
        body: auctions,
    };
}

export const handler = commonMiddleware(batchAuctions)
    .use(validator({ inputSchema: getAuctionsSchema, useDefaults: true }));