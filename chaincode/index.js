/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const user = require('./lib/user');
const line = require('./lib/line');
const travel = require('./lib/travel');
const lineEntrance = require('./lib/lineEntrance');
const pollutant = require('./lib/pollutant'); 
const repairingService = require('./lib/repairingService');
const station = require('./lib/station');
const stationLine = require('./lib/stationLine');
const vehicle = require('./lib/vehicle');
const ticket = require('./lib/ticket');
const moveToStation = require('./lib/moveToStation');


module.exports.User = user;
module.exports.Line = line;
module.exports.Travel = travel;
module.exports.LineEntrance = lineEntrance;
module.exports.Pollutant = pollutant;
module.exports.RepairingService = repairingService;
module.exports.Station = station;
module.exports.StationLine = stationLine;
module.exports.Vehicle = vehicle;
module.exports.Ticket = ticket;
module.exports.MoveToStation = moveToStation;

module.exports.User = user;
module.exports.contracts = [user,line,travel,lineEntrance,pollutant,repairingService,station,stationLine,vehicle,ticket,moveToStation];
