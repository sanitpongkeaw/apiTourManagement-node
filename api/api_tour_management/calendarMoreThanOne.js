const querySQL = require('../config/configQuerySQL');
const { verifyJWT } = require('../config/configJWT');
const con = require('../../app/connect/connect');

//main function get date list between start date and to date
const getDates = (startDate, endDate) => {
    let dates = [],
        currentDate = startDate,
        addDays = function(days) {
            let date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
    while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
    }
    return dates;
};

exports.getToutListCalendarMore = async (req, res) => {
    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                const sql_getTourList = `SELECT id_data_tour, tour_name, type FROM tb_data_tours WHERE type != 'Half' AND type != '1'`;
                const r_getTourList = await querySQL(sql_getTourList);
                if (r_getTourList) {
                    res.json({
                        status: 1,
                        msg: "get tour list successfully",
                        tour: r_getTourList
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "get tour list failed"
                    });
                }
            }
            else {
                res.sendStatus(403);
            }
        }
        else {
            res.sendStatus(403);
        }
    } catch (error) {
        console.log(error.message);
        res.json({
            status: 0,
            msg: error.message
        });
    }
}

exports.getCalendarMore = async (req, res) => {
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    const idDataTour = parseInt(req.params.idDataTour);

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                const sql_getPackage = `SELECT a.id_package_tour, a.id_status_stop_sell, a.package_name, a.date_start, a.number_of_ticket, a.2_3_person_per_room_adult as mulAdult, a.2_3_person_per_room_child as mulChild, a.1_person_per_room_adult as oneAdult, a.1_person_per_room_child as oneChild, b.type FROM tb_package_tours AS a LEFT JOIN tb_data_tours as b ON a.id_data_tour = b.id_data_tour WHERE a.id_data_tour = ${idDataTour} AND a.date_start BETWEEN '${startDate}' AND '${endDate}'`;
                const r_getPackage = await querySQL(sql_getPackage);

                if (r_getPackage) {
                    res.json({
                        status: 1,
                        msg: "get package calendar successfully",
                        package: r_getPackage
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "get package calendar failed"
                    });
                }
            }
        }
        else {
            res.sendStatus(403);
        }
    } catch (error) {
        console.log(error.message);
        res.json({
            status: 0,
            msg: error.message
        });
    }
}

exports.updatePackage = async (req, res) => {
    const idPackageTour = parseInt(req.body.idPackageTour);
    const idStopSell = parseInt(req.body.idStopSell);
    const mulAdult = parseInt(req.body.mulAdult);
    const mulChild = parseInt(req.body.mulChild);
    const inventory = parseInt(req.body.inventory);
    const oneAdult = parseInt(req.body.oneAdult);
    const oneChild = parseInt(req.body.oneChild);

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                const sql_updatePackage = `UPDATE tb_package_tours SET id_status_stop_sell = ${idStopSell}, number_of_ticket = ${inventory}, 2_3_person_per_room_adult = ${mulAdult}, 2_3_person_per_room_child = ${mulChild}, 1_person_per_room_adult = ${oneAdult}, 1_person_per_room_child = ${oneChild} WHERE id_package_tour = ${idPackageTour}`;
                const r_updatePackage = await querySQL(sql_updatePackage);

                if (r_updatePackage) {
                    res.json({
                        status: 1,
                        msg: "update package successfully"
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "update package failed"
                    });
                }
            }
            else {
                res.sendStatus(403);
            }
        }
        else {
            res.sendStatus(403);
        }
    } catch (error) {
        console.log(error.message);
        res.json({
            status: 0,
            msg: error.message
        });
    }
}