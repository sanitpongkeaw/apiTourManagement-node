const express = require('express');
const cors = require('cors');
var path = require('path');

require('dotenv').config();

const con = require('./app/connect/connect');
const authJWT = require('./api/api_tour_management/authJWT');
const configRegister = require('./api/config/configRegister');
const configAPI = require('./api/config/configAPI');
const configJWT = require('./api/config/configJWT');
const configTour = require('./api/config/configTour');

const register = require('./api/api_tour_management/register');
const travelAgent = require('./api/api_tour_management/travelAgent');
const tour = require('./api/api_tour_management/tour');
const packageTour = require('./api/api_tour_management/packageTour');
const calendar = require('./api/api_tour_management/calendar');
const calendarMoreThanOne = require('./api/api_tour_management/calendarMoreThanOne');
const { config } = require('dotenv');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

/* -------------------------------------------- Auth JWT------------------------------------------ */

app.post('/api/backend/auth/login', cors(configAPI), authJWT.checkLogin);
app.post('/api/backend/logout', cors(configAPI), authJWT.deleteTokenInValidateTokenList);

/* ------------------------------------------ End Auth JWT --------------------------------------- */

/* -------------------------------------------- Register ----------------------------------------- */

app.post('/api/backend/checkEmail', cors(configAPI), register.checkEmail);
app.post('/api/backend/auth/register', cors(configAPI), configRegister, register.insertAuth);

/* ------------------------------------------ End Register --------------------------------------- */

/* ------------------------------------------ Travel Agent --------------------------------------- */

app.get('/api/backend/getmembers', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, travelAgent.getMembers);
app.patch('/api/backend/updateStatusAccount', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, travelAgent.updateStatusAccount);
app.post('/api/backend/getFilesConsider', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, travelAgent.getFilesConsider);
app.post('/api/backend/readFile', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, travelAgent.readFile);
app.delete('/api/backend/deleteAccount', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, travelAgent.deleteAccount);

/* ---------------------------------------- End Travel Agent ------------------------------------- */

/* ---------------------------------------------- Tour ------------------------------------------- */

// Agent
app.post('/api/backend/addTour', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, configTour, tour.addTour);
app.get('/api/backend/getTours', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, tour.getToursAgent);
app.delete('/api/backend/deleteTour', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, tour.deleteTour);

app.get('/api/tour/getTour/:id_data_tour', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, tour.getDataTourEdit);
app.patch('/api/backend/tour/editPreview', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, configTour, tour.editPrevireImg);
app.put('/api/backend/tour/editPhoto', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, configTour, tour.editPhoto);
app.delete('/api/backend/tour/deletePhoto', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, tour.deletePhoto);
app.delete('/api/backend/tour/deletePhotoAll', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, tour.deletePhotoAll);
app.delete('/api/backend/tour/deletePhotoAllMP1', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, tour.deletePhotoAllMP1);
app.put('/api/backend/tour/editPhotoMP1', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, configTour, tour.editPhotoMP1);
app.delete('/api/backend/tour/deletePhotoMP1', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, tour.deletePhotoMP1);
app.delete('/api/backend/tour/deletePhotoAllMP2', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, tour.deletePhotoAllMP2);
app.delete('/api/backend/tour/deletePhotoMP2', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, tour.deletePhotoMP2);
app.put('/api/backend/tour/editPhotoMP2', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, configTour, tour.editPhotoMP2);
app.patch('/api/backend/tour/updateTour', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, configTour, tour.updateTour);
app.patch('/api/backend/tour/updateStatusTour', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, tour.updateStatusTour);

/* -------------------------------------------- End Tour ----------------------------------------- */

/* ------------------------------------------ Package Tour --------------------------------------- */

app.get('/api/backend/package/getTourList', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, packageTour.getToutList);
app.post('/api/backend/package/addPackage', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, packageTour.addPackage);
app.get('/api/backend/package/getPackage', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, packageTour.getPackages);
app.delete('/api/backend/deletePackage', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, packageTour.deletePackage);
app.get('/api/backend/package/getTourPackage/:idPackage', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, packageTour.getTourPackage);
app.put('/api/backend/package/updatePackage', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, packageTour.updatePackage);
app.patch('/api/backend/package/updatePackage', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, packageTour.updateStatusPackage);
app.get('/api/backend/package/getPackageList/:id_data_tour', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, packageTour.getPackageList);

/* ---------------------------------------- End Package Tour ------------------------------------- */

/* -------------------------------------- Calendar 1 and half ------------------------------------ */

app.get('/api/backend/calendar/getTourList', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, calendar.getToutListCalendar);
app.get('/api/backend/calendar/getCalendar/:startDate/:endDate/:idPackage', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, calendar.getCalendar);
app.post('/api/backend/calendar/inventory', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, calendar.inventory);
app.post('/api/backend/calendar/cutOffDay', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, calendar.updateCutOffDay);
app.post('/api/backend/calendar/cutOffHours', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, calendar.updateCutOffHours);
app.post('/api/backend/calendar/bookingBefore', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, calendar.updateBookingBefore);
app.post('/api/backend/calendar/promotionCode', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, calendar.updatePromotionCode);
app.post('/api/backend/calendar/priceAdult', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, calendar.updatePriceAdult);
app.post('/api/backend/calendar/priceChild', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, calendar.updatePriceChild);

/* ------------------------------------ End Calendar 1 and half ---------------------------------- */

/* -------------------------------------- Calendar More than 1 ----------------------------------- */

app.get('/api/backend/calendarMore/getTourList', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, calendarMoreThanOne.getToutListCalendarMore);
app.get('/api/backend/calendarMore/getCalendar/:startDate/:endDate/:idDataTour', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, calendarMoreThanOne.getCalendarMore);
app.patch('/api/backend/calendarMore/updatePackage', cors(configAPI), configJWT.verifyTokenInList, configJWT.verifyToken, calendarMoreThanOne.updatePackage);

/* ------------------------------------ END Calendar More than 1 --------------------------------- */

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port${port}...`));