// 'use strict';

// const expressJwt = require('express-jwt');
// const compose = require('composable-middleware');
// const config = require('../config/environment');
// const responseCode = require('../config/res');
// const { sendResponse } = require('../config/dto');
// const validateJwt = expressJwt({ secret: config['secrets']['session'] });

// /**
//   * Attaches the user object to the request if authenticated
//   * Otherwise returns 403
// **/
// function isAuthenticated() {
//     return compose().use((req, res, next) => {

//         if (req.query && req.query.hasOwnProperty('access_token'))
//             req.headers.authorization = `Bearer ${req.query.access_token}`;

//         validateJwt(req, res, (error, decoded) => {
//             if (error) return sendResponse(res, responseCode['UNAUTHORIZED'], `Your session has expired`);
//             next(decoded);
//         })
//     })
// }

// exports.isAuthenticated = isAuthenticated;