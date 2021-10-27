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

exports.getToutListCalendar = async (req, res) => {
    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                const sql_getTourList = `SELECT id_data_tour, tour_name, type FROM tb_data_tours WHERE type = 'Half' OR type = '1'`;
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

exports.getCalendar = async (req, res) => {
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    const idPackage = parseInt(req.params.idPackage);
    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1) {
                const sql_getCalendar = `SELECT id_stop_sell, date_ticket, inventory, cut_off_day, cut_off_hours, booking_before, promotion_code, price_adult, price_child FROM tb_calendar_package WHERE id_package_tour = ${idPackage} AND date_ticket BETWEEN '${startDate}' AND '${endDate}' AND id_account = ${parseInt(v_token.data_user.id_account)} ORDER BY date_ticket`;
                const r_getCalendar = await querySQL(sql_getCalendar);
                if (r_getCalendar) {
                    res.json({
                        status: 1,
                        data: r_getCalendar,
                        msg: "get data calendar successfully"
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "get data calendar failed"
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

exports.inventory = async (req, res) => {
    const id_package_tour = parseInt(req.body.idPackage);
    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;
    const inventory = req.body.inventory;
    const stopSell = parseInt(req.body.stopSell);

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1) {
                let sql_update = "";
                let sql_insert = "";
                if (inventory !== '') {
                    sql_insert = "INSERT INTO tb_calendar_package (id_package_tour, id_account, id_stop_sell, date_ticket, inventory) VALUES ";
                }
                else {
                    sql_insert = "INSERT INTO tb_calendar_package (id_package_tour, id_account, id_stop_sell, date_ticket) VALUES ";
                }
                if (inventory !== '') {
                    sql_update = `UPDATE tb_calendar_package SET inventory = ${inventory}, id_stop_sell = ${stopSell} 
                    WHERE date_ticket IN (SELECT * FROM (SELECT date_ticket FROM tb_calendar_package 
                    WHERE date_ticket IN (SELECT date_ticket FROM tb_calendar_package WHERE date_ticket 
                    BETWEEN '${fromDate}' AND '${toDate}') AND id_account = ${parseInt(v_token.data_user.id_account)} AND 
                    id_package_tour = ${id_package_tour}) AS dates) AND id_account = ${parseInt(v_token.data_user.id_account)} AND id_package_tour = ${id_package_tour}`
                }
                else {
                    sql_update = `UPDATE tb_calendar_package SET id_stop_sell = ${stopSell} 
                    WHERE date_ticket IN (SELECT * FROM (SELECT date_ticket FROM tb_calendar_package 
                    WHERE date_ticket IN (SELECT date_ticket FROM tb_calendar_package WHERE date_ticket 
                    BETWEEN '${fromDate}' AND '${toDate}') AND id_account = ${parseInt(v_token.data_user.id_account)} AND 
                    id_package_tour = ${id_package_tour}) AS dates) AND id_account = ${parseInt(v_token.data_user.id_account)} AND id_package_tour = ${id_package_tour}`
                }
                con.query(sql_update, (err,results) => {
                    if (err) {
                        console.error(err);
                        return (
                            res.json({
                                status: 0,
                                msg: 'update no. of ticket fail!'
                            })
                        )
                    }
                    else {
                        let split_start_date = fromDate.split("-");
                        let split_to_date = toDate.split("-");
                        let dates = getDates(new Date(split_start_date[0],(split_start_date[1] - 1),split_start_date[2]), new Date(split_to_date[0],(split_to_date[1] - 1),split_to_date[2]));
                        let result_sql_have_date = "";
                        dates.map(async function(date, i) {
                            let date_split = JSON.stringify(date).split("T", 1);
                            let format_date_fn = date_split.toString().substring(1);
                            let format_date = format_date_fn+"T24:00:00.000Z";
                            let new_date_insert = new Date(format_date).toISOString().split("T", 1);

                            let check_sql_have_date = `SELECT EXISTS(SELECT date_ticket FROM tb_calendar_package WHERE date_ticket = '${new_date_insert[0]}' AND id_account = ${parseInt(v_token.data_user.id_account)} AND id_package_tour = ${id_package_tour}) as check_date`;
                            result_sql_have_date = await querySQL(check_sql_have_date);
                            if (!Boolean(result_sql_have_date[0].check_date)) { //เช็ควันว่ามีไหม
                                if (dates.length !== (i + 1)) {
                                    if (inventory !== '') {
                                        sql_insert += `(${id_package_tour}, ${v_token.data_user.id_account}, ${stopSell}, '${new_date_insert[0]}', ${inventory}),`;
                                    }
                                    else {
                                        sql_insert += `(${id_package_tour}, ${v_token.data_user.id_account}, ${stopSell}, '${new_date_insert[0]}'),`;
                                    }
                                }
                                else { // last day
                                    if (inventory !== '') {
                                        sql_insert += `(${id_package_tour}, ${v_token.data_user.id_account}, ${stopSell}, '${new_date_insert[0]}', ${inventory})`;
                                    }
                                    else {
                                        sql_insert += `(${id_package_tour}, ${v_token.data_user.id_account}, ${stopSell}, '${new_date_insert[0]}')`;
                                    }
                                }
                            }
                            if (dates.length === (i + 1)) {
                                if (sql_insert !== 'INSERT INTO tb_calendar_package (id_package_tour, id_account, id_stop_sell, date_ticket, inventory) VALUES ' && sql_insert !== 'INSERT INTO tb_calendar_package (id_package_tour, id_account, id_stop_sell, date_ticket) VALUES ') {
                                    con.query(sql_insert, (error_sql,result) => {
                                        if(error_sql){
                                            console.error(error_sql)
                                            return (
                                                res.json({
                                                    status: 0,
                                                    msg: 'update no. of ticket fail!'
                                                })
                                            )
                                        }
                                        else {
                                            res.json({
                                                status: 1,
                                                msg: 'update inventory successfully'
                                            });
                                        }
                                    })
                                }
                                else { // update all data and 0 insert
                                    res.json({
                                        status: 1,
                                        msg: 'update inventory successfully'
                                    });
                                }
                            }
                        })
                    }
                })
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

exports.updateCutOffDay = async (req, res) => {
    const idPackage = parseInt(req.body.idPackage);
    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;
    const cutOffDay = parseInt(req.body.cutOffDay);
    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1) {
                const sql_updateCutOffDay = `UPDATE tb_calendar_package SET cut_off_day = ${cutOffDay} 
                WHERE date_ticket IN (SELECT * FROM (SELECT date_ticket FROM tb_calendar_package 
                WHERE date_ticket IN (SELECT date_ticket FROM tb_calendar_package WHERE date_ticket 
                BETWEEN '${fromDate}' AND '${toDate}') AND id_account = ${parseInt(v_token.data_user.id_account)} AND 
                id_package_tour = ${idPackage}) AS dates)  AND id_account = ${parseInt(v_token.data_user.id_account)} AND id_package_tour = ${idPackage}`;
                const r_updateCutOffDay = await querySQL(sql_updateCutOffDay);

                if (r_updateCutOffDay) {
                    res.json({
                        status: 1,
                        msg: "update cut off day successfully"
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "update cut off day failed"
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

exports.updateCutOffHours = async (req, res) => {
    const idPackage = parseInt(req.body.idPackage);
    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;
    const cutOffHours = parseInt(req.body.cutOffHours);

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1) {
                const sql_updateCutOffHours = `UPDATE tb_calendar_package SET cut_off_hours = ${cutOffHours} 
                WHERE date_ticket IN (SELECT * FROM (SELECT date_ticket FROM tb_calendar_package 
                WHERE date_ticket IN (SELECT date_ticket FROM tb_calendar_package WHERE date_ticket 
                BETWEEN '${fromDate}' AND '${toDate}') AND id_account = ${parseInt(v_token.data_user.id_account)} AND 
                id_package_tour = ${idPackage}) AS dates)  AND id_account = ${parseInt(v_token.data_user.id_account)} AND id_package_tour = ${idPackage}`;
                const r_updateCutOffHours = await querySQL(sql_updateCutOffHours);

                if (r_updateCutOffHours) {
                    res.json({
                        status: 1,
                        msg: "update cut off hours successfully"
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "update cut off hours failed"
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

exports.updateBookingBefore = async (req, res) => {
    const idPackage = parseInt(req.body.idPackage);
    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;
    const bookingBefore = parseInt(req.body.bookingBefore);

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1) {
                const sql_updateBookingBefore = `UPDATE tb_calendar_package SET booking_before = ${bookingBefore} 
                WHERE date_ticket IN (SELECT * FROM (SELECT date_ticket FROM tb_calendar_package 
                WHERE date_ticket IN (SELECT date_ticket FROM tb_calendar_package WHERE date_ticket 
                BETWEEN '${fromDate}' AND '${toDate}') AND id_account = ${parseInt(v_token.data_user.id_account)} AND 
                id_package_tour = ${idPackage}) AS dates)  AND id_account = ${parseInt(v_token.data_user.id_account)} AND id_package_tour = ${idPackage}`;
                const r_updateCutOffHours = await querySQL(sql_updateBookingBefore);

                if (r_updateCutOffHours) {
                    res.json({
                        status: 1,
                        msg: "update booking before successfully"
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "update booking before failed"
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

exports.updatePromotionCode = async (req, res) => {
    const idPackage = parseInt(req.body.idPackage);
    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;
    const promotionCode = req.body.promotionCode;

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1) {
                const sql_updatePromotionCode = `UPDATE tb_calendar_package SET promotion_code = "${promotionCode}" 
                WHERE date_ticket IN (SELECT * FROM (SELECT date_ticket FROM tb_calendar_package 
                WHERE date_ticket IN (SELECT date_ticket FROM tb_calendar_package WHERE date_ticket 
                BETWEEN '${fromDate}' AND '${toDate}') AND id_account = ${parseInt(v_token.data_user.id_account)} AND 
                id_package_tour = ${idPackage}) AS dates)  AND id_account = ${parseInt(v_token.data_user.id_account)} AND id_package_tour = ${idPackage}`;
                const r_updatePromotionCode = await querySQL(sql_updatePromotionCode);

                if (r_updatePromotionCode) {
                    res.json({
                        status: 1,
                        msg: "update promotion code successfully"
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "update promotion code failed"
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

exports.updatePriceAdult = async (req, res) => {
    const idPackage = parseInt(req.body.idPackage);
    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;
    const priceAdult = parseInt(req.body.priceAdult);

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1) {
                const sql_updatePriceAdult = `UPDATE tb_calendar_package SET price_adult = ${priceAdult}
                WHERE date_ticket IN (SELECT * FROM (SELECT date_ticket FROM tb_calendar_package 
                WHERE date_ticket IN (SELECT date_ticket FROM tb_calendar_package WHERE date_ticket 
                BETWEEN '${fromDate}' AND '${toDate}') AND id_account = ${parseInt(v_token.data_user.id_account)} AND 
                id_package_tour = ${idPackage}) AS dates)  AND id_account = ${parseInt(v_token.data_user.id_account)} AND id_package_tour = ${idPackage}`;
                const r_updatePriceAdult = await querySQL(sql_updatePriceAdult);

                if (r_updatePriceAdult) {
                    res.json({
                        status: 1,
                        msg: "update price adult successfully"
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "update price adult failed"
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

exports.updatePriceChild = async (req, res) => {
    const idPackage = parseInt(req.body.idPackage);
    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;
    const priceChild = parseInt(req.body.priceChild);

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1) {
                const sql_updatePriceChild = `UPDATE tb_calendar_package SET price_child = ${priceChild}
                WHERE date_ticket IN (SELECT * FROM (SELECT date_ticket FROM tb_calendar_package 
                WHERE date_ticket IN (SELECT date_ticket FROM tb_calendar_package WHERE date_ticket 
                BETWEEN '${fromDate}' AND '${toDate}') AND id_account = ${parseInt(v_token.data_user.id_account)} AND 
                id_package_tour = ${idPackage}) AS dates)  AND id_account = ${parseInt(v_token.data_user.id_account)} AND id_package_tour = ${idPackage}`;
                const r_updatePriceChild = await querySQL(sql_updatePriceChild);

                if (r_updatePriceChild) {
                    res.json({
                        status: 1,
                        msg: "update price child successfully"
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "update price child failed"
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