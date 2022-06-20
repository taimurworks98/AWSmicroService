import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import { getSecondAuctionById } from './getSecondAuction';
import commonMiddleware from '../../lib/commonMiddleware';
import placeBidSchema from '../../lib/schemas/placeBidSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeSecondBid(event, context) {
    const { id } = event.pathParameters;
    const { amount } = event.body;
    const { email } = event.requestContext.authorizer;


    const auction = await getSecondAuctionById(id);

    //Bid identity validation
    if(email===auction.seller){
        throw new createError.Forbidden(`You cannot bid on your own auction`);
    }

    //Avoid Double Bidding
    if(email===auction.highestBid.bidder){
        throw new createError.Forbidden(`You are already the highest bidder`);
    }

    //Auction status validation
    if (auction.status !== 'OPEN') {
        throw new createError.Forbidden(`You cannot bid on closed auctions!`);
    }

    //Bid Amount validation
    if (amount <= auction.highestBid.amount) {
        throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}!`);
    }

    const params = {
        TableName: process.env.SECOND_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
        ExpressionAttributeValues: {
            ':amount': amount,
            ':bidder': email,
        },
        ReturnValues: 'ALL_NEW',
    };

    let updatedAuction;

    try {
        const result = await dynamodb.update(params).promise();
        updatedAuction = result.Attributes;
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedAuction),
    };
}

export const handler = commonMiddleware(placeSecondBid)
    .use(validator({ inputSchema: placeBidSchema }));