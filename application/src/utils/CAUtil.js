"use strict";
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.registerAndEnrollUser = exports.enrollAdmin = exports.buildCAClient = void 0;
var FabricCAServices = require("fabric-ca-client");
var adminUserId = 'admin';
var adminUserPasswd = 'adminpw';
/**
 *
 * @param {*} ccp
 */
var buildCAClient = function (ccp, caHostName) {
    // Create a new CA client for interacting with the CA.
    var caInfo = ccp.certificateAuthorities[caHostName]; // lookup CA details from config
    var caTLSCACerts = caInfo.tlsCACerts.pem;
    var caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
    console.log("Built a CA Client named ".concat(caInfo.caName));
    return caClient;
};
exports.buildCAClient = buildCAClient;
var enrollAdmin = function (caClient, wallet, orgMspId) { return __awaiter(void 0, void 0, void 0, function () {
    var identity, enrollment, x509Identity, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, wallet.get(adminUserId)];
            case 1:
                identity = _a.sent();
                if (identity) {
                    console.log('An identity for the admin user already exists in the wallet');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, caClient.enroll({ enrollmentID: adminUserId, enrollmentSecret: adminUserPasswd })];
            case 2:
                enrollment = _a.sent();
                x509Identity = {
                    credentials: {
                        certificate: enrollment.certificate,
                        privateKey: enrollment.key.toBytes()
                    },
                    mspId: orgMspId,
                    type: 'X.509'
                };
                return [4 /*yield*/, wallet.put(adminUserId, x509Identity)];
            case 3:
                _a.sent();
                console.log('Successfully enrolled admin user and imported it into the wallet');
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.error("Failed to enroll admin user : ".concat(error_1));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.enrollAdmin = enrollAdmin;
var registerAndEnrollUser = function (caClient, wallet, orgMspId, userId, affiliation) { return __awaiter(void 0, void 0, void 0, function () {
    var userIdentity, adminIdentity, provider, adminUser, secret, enrollment, x509Identity, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4 /*yield*/, wallet.get(userId)];
            case 1:
                userIdentity = _a.sent();
                if (userIdentity) {
                    console.log("An identity for the user ".concat(userId, " already exists in the wallet"));
                    return [2 /*return*/];
                }
                return [4 /*yield*/, wallet.get(adminUserId)];
            case 2:
                adminIdentity = _a.sent();
                if (!adminIdentity) {
                    console.log('An identity for the admin user does not exist in the wallet');
                    console.log('Enroll the admin user before retrying');
                    return [2 /*return*/];
                }
                provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
                return [4 /*yield*/, provider.getUserContext(adminIdentity, adminUserId)];
            case 3:
                adminUser = _a.sent();
                return [4 /*yield*/, caClient.register({
                        affiliation: affiliation,
                        enrollmentID: userId,
                        role: 'client'
                    }, adminUser)];
            case 4:
                secret = _a.sent();
                return [4 /*yield*/, caClient.enroll({
                        enrollmentID: userId,
                        enrollmentSecret: secret
                    })];
            case 5:
                enrollment = _a.sent();
                x509Identity = {
                    credentials: {
                        certificate: enrollment.certificate,
                        privateKey: enrollment.key.toBytes()
                    },
                    mspId: orgMspId,
                    type: 'X.509'
                };
                return [4 /*yield*/, wallet.put(userId, x509Identity)];
            case 6:
                _a.sent();
                console.log("Successfully registered and enrolled user ".concat(userId, " and imported it into the wallet"));
                return [3 /*break*/, 8];
            case 7:
                error_2 = _a.sent();
                console.error("Failed to register user : ".concat(error_2));
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.registerAndEnrollUser = registerAndEnrollUser;
